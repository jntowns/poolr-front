<template>
    <div class="pricing-section">
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
</template>

<script setup>
import { formatCurrency } from '../utils/pricing'

defineProps({
    pricing: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
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
</style>
