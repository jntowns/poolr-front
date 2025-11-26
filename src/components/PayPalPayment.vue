<template>
  <div class="provider-section">
    <h2>{{ t("title") }}</h2>

    <div v-if="!isAuthenticated" class="auth-required-message">
      <p>{{ t("auth_required") }}</p>
      <button class="login-btn" @click="$emit('login')">
        {{ t("signin_continue") }}
      </button>
    </div>

    <template v-else>
      <div class="provider-option active">
        <div class="provider-details">
          <input type="radio" id="paypal" value="paypal" checked />
          <label for="paypal">
            <span class="provider-name">{{ t("name") }}</span>
            <span class="provider-desc">{{ t("desc") }}</span>
          </label>
        </div>
        <span class="provider-badge">{{ t("recommended") }}</span>
      </div>

      <div class="paypal-panel">
        <p v-if="paypalAvailable" class="paypal-note">
          {{ t("sandbox_note") }}
        </p>
        <p v-else-if="!isLoadingPaypalConfig" class="paypal-note warning">
          {{ paypalError || t("not_configured") }}
        </p>

        <div v-if="isLoadingPaypalConfig" class="paypal-status">
          {{ t("loading_config") }}
        </div>

        <div v-if="paypalAvailable">
          <div id="paypal-button-container" ref="paypalContainer"></div>
          <div v-if="paypalStatus === 'loading'" class="paypal-status">
            {{ t("loading_buttons") }}
          </div>
          <div v-if="paypalError" class="paypal-status error">
            {{ paypalError }}
            <button
              v-if="paypalStatus === 'error'"
              type="button"
              class="retry-btn"
              @click="handleRetry"
            >
              {{ t("retry") }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { usePayPal } from "../composables/usePayPal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  isAuthenticated: {
    type: Boolean,
    required: true,
  },
  pricing: {
    type: Object,
    required: true,
  },
  rideName: {
    type: String,
    default: "driver",
  },
});

defineEmits(["login"]);

const paypalContainer = ref(null);

const {
  paypalConfig,
  isLoadingPaypalConfig,
  paypalStatus,
  paypalError,
  paypalAvailable,
  fetchPaypalConfig,
  renderPaypalButtons,
  cleanupPaypalButtons,
  retryPayPal,
} = usePayPal();

const handleRetry = () => {
  if (!paypalContainer.value || !props.pricing) return;

  retryPayPal({
    container: paypalContainer.value,
    amount: props.pricing.grossAmount,
    currency: props.pricing.currency,
    description: `Poolr ride with ${props.rideName}`,
  });
};

const renderButtons = async () => {
  if (!paypalContainer.value || !props.pricing) return;

  await renderPaypalButtons({
    container: paypalContainer.value,
    amount: props.pricing.grossAmount,
    currency: props.pricing.currency,
    description: `Poolr ride with ${props.rideName}`,
  });
};

watch(() => props.pricing?.grossAmount, renderButtons);
watch(paypalConfig, renderButtons);

onMounted(async () => {
  await fetchPaypalConfig();
  if (props.isAuthenticated) {
    await renderButtons();
  }
});

onBeforeUnmount(() => {
  cleanupPaypalButtons();
});
</script>

<style scoped>
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

.auth-required-message {
  padding: 20px;
  border-radius: 12px;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  text-align: center;
}

.auth-required-message p {
  margin-bottom: 16px;
  color: #92400e;
  font-weight: 500;
}

.login-btn {
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: #2563eb;
  color: #ffffff;
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
  align-items: center;
  justify-content: center;
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
</style>
