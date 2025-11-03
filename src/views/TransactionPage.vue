<template>
    <div class="transaction-page">
        <div v-if="ride" class="transaction-content">
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
                        <span class="value">{{ ride.driverName }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Vehicle</span>
                        <span class="value">{{ ride.vehicle }} ({{ ride.vehicleColor }})</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Pickup</span>
                        <span class="value">{{ ride.startAddress }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Destination</span>
                        <span class="value">{{ ride.endAddress }}</span>
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
                    <div class="provider-option" :class="{ active: provider === 'card' }" @click="selectProvider('card')">
                        <div class="provider-details">
                            <input type="radio" id="card" value="card" v-model="provider" />
                            <label for="card">
                                <span class="provider-name">Credit Card</span>
                                <span class="provider-desc">Visa, Mastercard, Amex</span>
                            </label>
                        </div>
                    </div>

                    <div v-if="provider === 'paypal'" class="paypal-panel">
                        <p class="paypal-note">
                            This sandbox button simulates a PayPal checkout using test money.
                        </p>
                        <button class="paypal-btn" @click="handlePayPalSandbox">
                            Pay with PayPal Sandbox
                        </button>
                    </div>

                    <div v-else class="card-panel">
                        <div class="form-row">
                            <label for="card-name">Name on card</label>
                            <input id="card-name" v-model="cardForm.name" type="text" autocomplete="cc-name" />
                        </div>
                        <div class="form-row">
                            <label for="card-number">Card number</label>
                            <input id="card-number" v-model="cardForm.number" type="text" inputmode="numeric"
                                placeholder="4242 4242 4242 4242" autocomplete="cc-number" />
                        </div>
                        <div class="form-split">
                            <div class="form-row">
                                <label for="card-expiry">Expiry</label>
                                <input id="card-expiry" v-model="cardForm.expiry" type="text" placeholder="MM/YY"
                                    autocomplete="cc-exp" />
                            </div>
                            <div class="form-row">
                                <label for="card-cvc">CVC</label>
                                <input id="card-cvc" v-model="cardForm.cvc" type="text" inputmode="numeric"
                                    autocomplete="cc-csc" />
                            </div>
                        </div>
                        <button class="submit-btn" @click="submitCard" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Processing…' : 'Pay ' + formatCurrency(pricing?.grossAmount ?? 0) }}
                        </button>
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
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import RouteMap from '../components/RouteMap.vue'
import { useMapStore } from '../stores/mapStore'
import { useAddressStore } from '../stores/addressStore'
import { calculateRidePricing, formatCurrency } from '../utils/pricing'
import { showToast } from '../utils/BaseToast'

const router = useRouter()
const mapStore = useMapStore()
const addressStore = useAddressStore()

const ride = computed(() => mapStore.selectedRide)
const routeData = computed(() => mapStore.routeData)
const pricing = computed(() => {
    const currentRide = ride.value
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

const selectProvider = (value) => {
    provider.value = value
}

const handlePayPalSandbox = () => {
    if (!pricing.value) {
        showToast('Please select a ride first.', 'error')
        return
    }
    showToast('Redirecting to PayPal sandbox (mock checkout).', 'info')
    window.open('https://www.sandbox.paypal.com/signin', '_blank', 'noopener')
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

onMounted(() => {
    if (!ride.value) {
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

.paypal-btn {
    border: none;
    border-radius: 9999px;
    background: #ffc439;
    color: #111827;
    font-weight: 700;
    font-size: 15px;
    padding: 12px 20px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    align-self: flex-start;
}

.paypal-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.paypal-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
}

.card-panel {
    margin-top: 16px;
    padding: 20px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #d1d5db;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-row label {
    font-size: 12px;
    font-weight: 600;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.form-row input {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5f5;
    background: #ffffff;
    font-size: 14px;
    color: #111827;
    width: 100%;
    box-sizing: border-box;
}

.form-row input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.form-split {
    display: flex;
    gap: 12px;
}

.form-split .form-row {
    flex: 1;
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

.submit-btn {
    border: none;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    background: #2563eb;
    color: #ffffff;
    width: 100%;
}

.submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
