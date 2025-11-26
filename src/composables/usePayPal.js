import { ref, computed, watch, nextTick } from 'vue'
import { loadPayPalSdk } from '../utils/paypal'
import { showToast } from '../utils/BaseToast'
import apiClient from '../utils/apiClient'
import router from "../router/index.js";
import { useMapStore } from '../stores/mapStore.js'
import { getFullAddressText } from '../utils/addressUtils'


export function usePayPal() {
    const paypalConfig = ref(null)
    const isLoadingPaypalConfig = ref(false)
    const paypalStatus = ref('idle')
    const paypalError = ref(null)
    const paypalButtonsInstance = ref(null)
    const paypalRenderSignature = ref(null)
    const mapStore = useMapStore()

    let isRenderingPaypal = false

    const paypalAvailable = computed(() => {
        const config = paypalConfig.value
        return Boolean(config?.enabled && config?.clientId)
    })

    const fetchPaypalConfig = async () => {
        isLoadingPaypalConfig.value = true
        paypalError.value = null
        try {
            const { data } = await apiClient.get('/api/payments/paypal/config')
            paypalConfig.value = data
            if (!data?.enabled) {
                paypalError.value = 'PayPal sandbox is not configured on the server yet.'
            }
        } catch (error) {
            console.error('Failed to load PayPal configuration', error)
            paypalError.value = 'Unable to load PayPal configuration.'
        } finally {
            isLoadingPaypalConfig.value = false
        }
    }

    const renderPaypalButtons = async ({ container, amount, currency, description }) => {
        if (!paypalAvailable.value || isRenderingPaypal) return

        const config = paypalConfig.value
        if (!config?.clientId || !container) return

        const finalCurrency = currency || config.currency || 'CAD'
        const signature = `${config.clientId}:${amount}:${finalCurrency}`

        if (paypalStatus.value === 'ready' && paypalRenderSignature.value === signature) return

        isRenderingPaypal = true
        paypalStatus.value = 'loading'
        paypalError.value = null

        try {
            const paypal = await loadPayPalSdk({
                clientId: config.clientId,
                currency: finalCurrency
            })

            const waitForButtons = async (sdk, retries = 20) => {
                if (sdk && typeof sdk.Buttons === 'function') return
                if (retries <= 0) {
                    throw new Error('PayPal Buttons component unavailable.')
                }
                await new Promise(resolve => setTimeout(resolve, 50))
                return waitForButtons(window.paypal, retries - 1)
            }

            await waitForButtons(paypal)
            await nextTick()

            container.innerHTML = ''

            if (paypalButtonsInstance.value?.close) {
                paypalButtonsInstance.value.close()
            }

            const buttons = window.paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'pill',
                    label: 'paypal'
                },
                createOrder: async () => {
                    try {
                        const response = await apiClient.post('/api/payments/paypal/order', {
                            amount: Number(amount).toFixed(2),
                            currency: finalCurrency,
                            description
                        })
                        return response.data.orderId
                    } catch (error) {
                        console.error('Failed to create PayPal order', error)
                        const message = error.response?.data?.message || 'Failed to create PayPal order.'
                        paypalError.value = message
                        showToast(message, 'error')
                        throw error
                    }
                },
                onApprove: async (data) => {
                    try {
                        const response = await apiClient.post(`/api/payments/paypal/order/${data.orderID}/capture`)
                        const payerName = response.data?.payerName

                        const ride = mapStore.selectedRide
                        if (ride && ride.rideId) {
                            try {
                                await apiClient.post('/api/tickets', {
                                    rideId: ride.rideId,
                                    pickupAddress: getFullAddressText(mapStore.userOrigin),
                                    dropoffAddress: getFullAddressText(mapStore.userDestination)
                                })
                            } catch (ticketError) {
                                console.error('Failed to create ticket after payment', ticketError)

                                showToast('Payment succeeded but ticket could not be created.', 'error')
                            }
                        } else {
                            console.warn('No selected ride found when trying to create ticket.')
                        }


                        showToast(
                            payerName
                                ? `Payment captured successfully. Thanks, ${payerName}!
Redirecting to your tickets`
                                : 'Payment captured successfully!' +
                                '/redirecting to your tickets',
                            'success'

                        )
                        setTimeout(async function () {
                            await router.push('/tickets')
                        }, 3000)


                    } catch (error) {
                        console.error('Failed to capture PayPal order', error)
                        const message = error.response?.data?.message || 'Failed to capture PayPal order.'
                        paypalError.value = message
                        showToast(message, 'error')
                        throw error
                    }
                },

                onCancel: () => {
                    showToast('PayPal checkout was cancelled.', 'info')
                },
                onError: (err) => {
                    console.error('PayPal encountered an error', err)
                    paypalError.value = err?.message || 'PayPal checkout failed.'
                    paypalStatus.value = 'error'
                }
            })

            paypalButtonsInstance.value = buttons
            await buttons.render(container)
            paypalRenderSignature.value = signature
            paypalStatus.value = 'ready'
        } catch (error) {
            if (paypalStatus.value !== 'error') {
                paypalError.value = error?.message || 'Unable to load PayPal checkout.'
                paypalStatus.value = 'error'
            }
        } finally {
            isRenderingPaypal = false
        }
    }

    const cleanupPaypalButtons = () => {
        if (paypalButtonsInstance.value?.close) {
            paypalButtonsInstance.value.close()
        }
        paypalButtonsInstance.value = null
        paypalRenderSignature.value = null
        paypalStatus.value = 'idle'
        paypalError.value = null
    }

    const retryPayPal = (params) => {
        paypalRenderSignature.value = null
        return renderPaypalButtons(params)
    }

    return {
        paypalConfig,
        isLoadingPaypalConfig,
        paypalStatus,
        paypalError,
        paypalAvailable,
        fetchPaypalConfig,
        renderPaypalButtons,
        cleanupPaypalButtons,
        retryPayPal
    }
}
