<template>
  <div class="pricing-section">
    <h2>{{ t("pricing.fareBreakdown") }}</h2>
    <ul>
      <li v-if="pricing.baseFareAmount !== undefined">
        <span>{{ t("pricing.baseFare") }}</span>
        <span>{{ formatCurrency(pricing.baseFareAmount) }}</span>
      </li>
      <li v-if="pricing.distanceCostAmount !== undefined">
        <span>{{ t("pricing.distanceCost") }}</span>
        <span>{{ formatCurrency(pricing.distanceCostAmount) }}</span>
      </li>
      <li
        v-if="
          pricing.detourCostAmount !== undefined && pricing.detourCostAmount > 0
        "
      >
        <span>{{ t("pricing.detourCost") }}</span>
        <span>{{ formatCurrency(pricing.detourCostAmount) }}</span>
      </li>
      <li class="subtotal-row">
        <span>{{ t("pricing.subtotal") }}</span>
        <span>{{ formatCurrency(pricing.subtotalAmount) }}</span>
      </li>
      <li>
        <span>{{ t("pricing.tax") }}</span>
        <span>{{ formatCurrency(pricing.taxAmount) }}</span>
      </li>
      <li>
        <span>{{ t("pricing.platformFee") }}</span>
        <span>{{ formatCurrency(pricing.platformFeeAmount) }}</span>
      </li>
      <li>
        <span>{{ t("pricing.externalFee") }}</span>
        <span>{{ formatCurrency(pricing.externalFeeAmount) }}</span>
      </li>
      <li>
        <span>{{ t("pricing.tip") }}</span>
        <span>{{ formatCurrency(pricing.tipAmount) }}</span>
      </li>
    </ul>
    <div class="pricing-total">
      <span>{{ t("pricing.totalDue") }}</span>
      <span>{{ formatCurrency(pricing.grossAmount) }}</span>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from "../utils/pricing";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  pricing: {
    type: Object,
    required: true,
  },
});
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
.subtotal-row {
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}
</style>
