<template>
    <div class="transaction-page">
        <div v-if="selectedRide" class="transaction-content">
            <section class="transaction-card">
                <header>
                    <h1>Confirm Your Ride</h1>
                    <p class="provider-note">
                        Complete your booking with PayPal or a credit card.
                    </p>
                </header>

                <div class="ride-summary">
                    <div class="summary-row">
                        <span class="label">Driver</span>
                        <span class="value">{{ selectedRide.driverName }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Vehicle</span>
                        <span class="value">{{ selectedRide.vehicle }} ({{ selectedRide.vehicleColor }})</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Pickup</span>
                        <span class="value">{{ selectedRide.startAddress }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Destination</span>
                        <span class="value">{{ selectedRide.endAddress }}</span>
                    </div>
                    <div v-if="routeData" class="summary-row">
                        <span class="label">Route Distance</span>
                        <span class="value">{{ routeData.distanceKm.toFixed(2) }} km</span>
                    </div>
                    <div v-if="routeData" class="summary-row">
                        <span class="label">Estimated Duration</span>
                        <span class="value">{{ routeData.durationMinutes.toFixed(1) }} min</span>
                    </div>
                </div>

                <div class="pricing-section" v-if="pricing">
                    <h2>Fare Breakdown</h2>
                    <ul>
                        <li>
                            <span>Subtotal</span>
                            <span>{{ formatCurrency(pricing.subtotalAmount) }}</span>
                        </li>
                        <li>
                            <span>Tax</span>
                            <span>{{ formatCurrency(pricing.taxAmount) }}</span>
                        </li>
                        <li>
                            <span>Platform Fee</span>
                            <span>{{ formatCurrency(pricing.platformFeeAmount) }}</span>
                        </li>
                        <li>
                            <span>External Fee</span>
                            <span>{{ formatCurrency(pricing.externalFeeAmount) }}</span>
                        </li>
                        <li>
                            <span>Tip</span>
                            <span>{{ formatCurrency(pricing.tipAmount) }}</span>
                        </li>
                    </ul>
                    <div class="pricing-total">
                        <span>Total Due</span>
                        <span>{{ formatCurrency(pricing.grossAmount) }}</span>
                    </div>
                </div>

                <div class="provider-section">
                    <h2>Payment Method</h2>
                    <div class="provider-option" :class="{ active: provider === 'paypal' }" @click="selectProvider('paypal')">
                        <div class="provider-details">
                            <input type="radio" id="paypal" value="paypal" v-model="provider" />
                            <label for="paypal">
                                <span class="provider-name">PayPal</span>
                                <span class="provider-desc">Fast checkout with your PayPal account</span>
                            </label>
                        </div>
                        <span class="provider-badge">Recommended</span>
                    </div>

                    <div v-if="provider === 'paypal'" class="paypal-panel">
                        <p v-if="paypalAvailable" class="paypal-note">
                            Use your PayPal sandbox buyer account to authorize this ride payment.
                        </p>
                        <p v-else-if="!isLoadingPaypalConfig" class="paypal-note warning">
                            {{ paypalError || 'PayPal sandbox is not configured yet on the server. Add credentials to enable checkout.' }}
                        </p>
                        <div v-if="isLoadingPaypalConfig" class="paypal-status">
                            Loading PayPal configuration…
                        </div>
                        <div v-if="paypalAvailable">
                            <div id="paypal-button-container" ref="paypalContainer"></div>
                            <div v-if="paypalStatus === 'loading'" class="paypal-status">
                                Loading PayPal buttons…
                            </div>
                            <div v-if="paypalError" class="paypal-status error">
                                {{ paypalError }}
                                <button v-if="paypalStatus === 'error'" type="button" class="retry-btn"
                                    @click="retryPayPal">
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="actions">
                    <button class="back-btn" @click="goBack">
                        Back
                    </button>
                </div>
            </section>
            <section class="map-preview">
                <h2>Route Map</h2>
                <div class="map-wrapper">
                    <RouteMap />
                </div>
            </section>
        </div>

        <div v-else class="missing-selection">
            <h1>No ride selected</h1>
            <p>Please pick a ride before continuing to the transaction screen.</p>
            <button class="back-btn" @click="goToResults">Back to Ride Results</button>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import RouteMap from '../components/RouteMap.vue'
import { useMapStore } from '../stores/mapStore'
import { useAddressStore } from '../stores/addressStore'
import { calculateRidePricing, formatCurrency } from '../utils/pricing'
import { showToast } from '../utils/BaseToast'
import apiClient from '../utils/apiClient'
import { loadPayPalSdk } from '../utils/paypal'

const router = useRouter()
const mapStore = useMapStore()
const addressStore = useAddressStore()

const selectedRide = computed(() => mapStore.selectedRide)
const routeData = computed(() => mapStore.routeData)
const pricing = computed(() => {
    const currentRide = selectedRide.value
    if (!currentRide) return null
    return currentRide.pricing ?? calculateRidePricing(currentRide.rideDistanceKm)
})
const provider = ref('paypal')

const isSubmitting = ref(false)
const cardForm = reactive({
    name: '',
    number: '',
    expiry: '',
    cvc: ''
})

const paypalConfig = ref(null)
const isLoadingPaypalConfig = ref(false)
const paypalStatus = ref('idle') // idle | loading | ready | error
const paypalError = ref(null)
const paypalContainer = ref(null)
const paypalButtonsInstance = ref(null)
const paypalRenderSignature = ref(null)
let isRenderingPaypal = false

const paypalAvailable = computed(() => {
    const config = paypalConfig.value
    return Boolean(config?.enabled && config?.clientId)
})

const selectProvider = (value) => {
    provider.value = value
}

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

const renderPaypalButtons = async () => {
    if (provider.value !== 'paypal' || !pricing.value || !paypalAvailable.value) return
    if (isRenderingPaypal) return

    const config = paypalConfig.value
    if (!config?.clientId) return

    const amount = pricing.value.grossAmount
    const currency = pricing.value.currency || config.currency || 'CAD'
    const signature = `${config.clientId}:${amount}:${currency}`
    if (paypalStatus.value === 'ready' && paypalRenderSignature.value === signature) return

    isRenderingPaypal = true
    paypalStatus.value = 'loading'
    paypalError.value = null

    try {
        const paypal = await loadPayPalSdk({
            clientId: config.clientId,
            currency
        })

        const ensureButtons = async (sdk, retries = 10) => {
            if (typeof sdk?.Buttons === 'function') {
                return
            }
            if (retries <= 0) {
                throw new Error('PayPal Buttons component unavailable.')
            }
            await new Promise(resolve => setTimeout(resolve, 50))
            return ensureButtons(sdk, retries - 1)
        }

        const waitForButtons = async (sdk, retries = 20) => {
            if (sdk && typeof sdk.Buttons === 'function') {
                return
            }
            if (retries <= 0) {
                throw new Error('PayPal Buttons component unavailable.')
            }
            await new Promise(resolve => setTimeout(resolve, 50))
            return waitForButtons(window.paypal, retries - 1)
        }
        await waitForButtons(paypal)

        await nextTick()
        const container = paypalContainer.value
        if (!container) {
            throw new Error('PayPal button container not ready.')
        }
        container.innerHTML = ''

        if (paypalButtonsInstance.value?.close) {
            paypalButtonsInstance.value.close()
        }

        const description = `Poolr ride with ${selectedRide.value?.driverName ?? 'driver'}`
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
                        currency,
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
                    showToast(
                        payerName ? `Payment captured successfully. Thanks, ${payerName}!`
                            : 'Payment captured successfully!',
                        'success'
                    )
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
    if (paypalContainer.value) {
        paypalContainer.value.innerHTML = ''
    }
    paypalRenderSignature.value = null
    if (provider.value !== 'paypal') {
        paypalStatus.value = 'idle'
        paypalError.value = null
    }
}

const retryPayPal = async () => {
    paypalRenderSignature.value = null
    await renderPaypalButtons()
}

const submitCard = async () => {
    if (!pricing.value) {
        showToast('Ride pricing not found. Please re-select your ride.', 'error')
        router.push('/find-ride')
        return
    }

    if (!cardForm.name || !cardForm.number || !cardForm.expiry || !cardForm.cvc) {
        showToast('Please complete all card fields.', 'error')
        return
    }

    const sanitizedNumber = cardForm.number.replace(/\s+/g, '')
    if (sanitizedNumber.length < 12) {
        showToast('Enter a valid card number.', 'error')
        return
    }

    if (!/^\d{2}\/\d{2}$/.test(cardForm.expiry.trim())) {
        showToast('Enter expiry as MM/YY.', 'error')
        return
    }

    if (cardForm.cvc.trim().length < 3) {
        showToast('Enter a valid CVC.', 'error')
        return
    }

    isSubmitting.value = true
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        showToast('Card payment successful (demo).', 'success')
    } catch (error) {
        console.error('Credit card submission failed', error)
        showToast('Card payment failed. Please try again.', 'error')
    } finally {
        isSubmitting.value = false
    }
}

const goBack = () => {
    router.back()
}

const goToResults = () => {
    router.push('/ride-results')
}

watch(
    () => provider.value,
    async (value) => {
        if (value === 'paypal') {
            await renderPaypalButtons()
        } else {
            cleanupPaypalButtons()
        }
    }
)

watch(
    () => pricing.value?.grossAmount,
    async () => {
        if (provider.value === 'paypal') {
            await renderPaypalButtons()
        }
    }
)

watch(
    () => paypalConfig.value,
    async () => {
        if (provider.value === 'paypal') {
            await renderPaypalButtons()
        }
    }
)

onMounted(async () => {
    if (!selectedRide.value) {
        router.replace('/find-ride')
        return
    }
    if (!mapStore.selectedRide?.pricing) {
        mapStore.selectedRide = {
            ...mapStore.selectedRide,
            pricing: calculateRidePricing(mapStore.selectedRide.rideDistanceKm)
        }
    }
    if (!addressStore.origin || !addressStore.destination) {
        showToast('Origin or destination is missing. Re-select your ride if the map looks off.', 'info')
    }
    await fetchPaypalConfig()
    if (provider.value === 'paypal') {
        await renderPaypalButtons()
    }
})

onBeforeUnmount(() => {
    cleanupPaypalButtons()
})
</script>

<style scoped>
.transaction-page {
    min-height: 100vh;
    background: #f3f4f6;
    padding: 32px 16px;
    box-sizing: border-box;
}

.transaction-content {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 420px) minmax(0, 1.8fr);
    gap: 28px;
    align-items: stretch;
}

.transaction-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
    display: flex;
    flex-direction: column;
}

.transaction-card header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #111827;
}

.provider-note {
    margin-top: 4px;
    color: #4b5563;
    font-size: 14px;
}

.ride-summary {
    margin-top: 20px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    background: #f9fafb;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 10px;
    font-size: 14px;
    color: #1f2937;
}

.summary-row:last-child {
    margin-bottom: 0;
}

.summary-row .label {
    font-weight: 600;
}

.pricing-section {
    margin-top: 24px;
}

.pricing-section h2 {
    font-size: 18px;
    margin-bottom: 12px;
}

.pricing-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
}

.pricing-section li {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    font-size: 14px;
    color: #111827;
    background: #ffffff;
}

.pricing-section li:nth-child(even) {
    background: #f9fafb;
}

.pricing-total {
    display: flex;
    justify-content: space-between;
    margin-top: 14px;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
}

.provider-section {
    margin-top: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.provider-section h2 {
    font-size: 18px;
    margin-bottom: 12px;
}

.provider-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    margin-bottom: 12px;
    transition: border 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
}

.provider-option.active {
    border-color: #2563eb;
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.1);
}

.provider-details {
    display: flex;
    align-items: center;
    gap: 12px;
}

.provider-name {
    font-weight: 600;
    color: #111827;
    display: block;
}

.provider-desc {
    font-size: 12px;
    color: #6b7280;
    display: block;
}

.provider-badge {
    font-size: 12px;
    color: #2563eb;
    font-weight: 600;
}

.paypal-panel {
    margin-top: 16px;
    padding: 20px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px dashed #d1d5db;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.paypal-note {
    font-size: 13px;
    color: #374151;
}

.paypal-note.warning {
    color: #b45309;
}

.paypal-status {
    font-size: 14px;
    color: #1f2937;
}

.paypal-status.error {
    color: #b91c1c;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}

.retry-btn {
    border: none;
    background: none;
    color: #2563eb;
    cursor: pointer;
    font-weight: 600;
    padding: 0;
}
.actions {
    margin-top: 24px;
    display: flex;
    justify-content: flex-start;
}

.back-btn {
    border: none;
    border-radius: 8px;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    background: #e5e7eb;
    color: #111827;
}

.map-preview {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
    display: flex;
    flex-direction: column;
}

.map-preview h2 {
    margin: 0 0 16px 0;
    font-size: 20px;
    font-weight: 600;
    color: #111827;
}

.map-wrapper {
    flex: 1;
    min-height: 520px;
    border-radius: 12px;
    overflow: hidden;
}

.missing-selection {
    max-width: 480px;
    margin: 100px auto;
    padding: 32px;
    background: #ffffff;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
}

.missing-selection h1 {
    margin-bottom: 12px;
    font-size: 24px;
}

.missing-selection p {
    margin-bottom: 20px;
    color: #4b5563;
}

@media (max-width: 1100px) {
    .transaction-content {
        grid-template-columns: 1fr;
    }

    .map-wrapper {
        min-height: 360px;
    }
}

@media (max-width: 640px) {
    .transaction-card {
        padding: 20px;
    }

    .map-preview {
        padding: 20px;
    }

    .form-split {
        flex-direction: column;
    }
}
</style>
