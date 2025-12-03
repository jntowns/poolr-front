<template>
    <div class="mt-6 flex-1 flex flex-col">
        <h2 class="text-lg sm:text-base mb-3">{{ t("title") }}</h2>

        <div v-if="!isAuthenticated" class="p-5 sm:p-4 rounded-xl bg-amber-100 border border-amber-500 text-center">
            <p class="mb-4 text-amber-800 font-medium">{{ t("auth_required") }}</p>
            <button
                class="border-none rounded-lg px-4 py-2.5 sm:px-3.5 sm:py-2 text-sm sm:text-xs font-semibold cursor-pointer bg-blue-600 text-white"
                @click="$emit('login')">
                {{ t("signin_continue") }}
            </button>
        </div>

        <template v-else>
            <div
                class="provider-option flex items-center justify-between sm:flex-col sm:items-start sm:gap-2 p-4 sm:p-3 rounded-xl border border-blue-600 bg-white mb-3 shadow-lg shadow-blue-600/10">
                <div class="flex items-center gap-3">
                    <input type="radio" id="paypal" value="paypal" checked />
                    <label for="paypal">
                        <span class="font-semibold text-gray-900 block">{{ t("name") }}</span>
                        <span class="text-xs text-gray-500 block">{{ t("desc") }}</span>
                    </label>
                </div>
                <span class="text-xs text-blue-600 font-semibold sm:self-end">{{ t("recommended") }}</span>
            </div>

            <div
                class="paypal-panel mt-4 p-6 sm:p-4 rounded-xl bg-slate-50 flex flex-col items-center justify-center gap-4 sm:gap-3 relative overflow-hidden">
                <div
                    class="bg-amber-100 text-amber-800 px-4 py-2 sm:px-3 sm:py-1.5 rounded-md text-sm sm:text-xs text-center w-full border border-amber-300 mb-2">
                    <strong>TEST MODE</strong>: No real money will be charged.
                </div>

                <div class="border border-gray-200 rounded-xl p-4 sm:p-3 bg-gray-50 w-full max-w-[400px]">
                    <h3 class="text-sm sm:text-xs font-semibold text-gray-800 mb-3">Use these credentials to pay:</h3>
                    <div
                        class="flex justify-between items-center gap-4 sm:flex-col sm:items-start sm:gap-1.5 mb-2.5 text-sm text-gray-800">
                        <span class="font-semibold shrink-0">Email</span>
                        <div class="flex items-center gap-2 flex-wrap justify-end sm:justify-start sm:w-full">
                            <code
                                class="font-mono bg-gray-200 px-2 py-1 rounded-md text-gray-900 text-xs">user@poolr.com</code>
                            <button class="copy-btn" @click="copyToClipboard('user@poolr.com')" title="Copy Email">
                                📋
                            </button>
                        </div>
                    </div>
                    <div
                        class="flex justify-between items-center gap-4 sm:flex-col sm:items-start sm:gap-1.5 mb-2.5 text-sm text-gray-800">
                        <span class="font-semibold shrink-0">Password</span>
                        <div class="flex items-center gap-2 flex-wrap justify-end sm:justify-start sm:w-full">
                            <code
                                class="font-mono bg-gray-200 px-2 py-1 rounded-md text-gray-900 text-xs">12345678</code>
                            <button class="copy-btn" @click="copyToClipboard('12345678')" title="Copy Password">
                                📋
                            </button>
                        </div>
                    </div>
                    <div
                        class="flex justify-between items-center gap-4 sm:flex-col sm:items-start sm:gap-1.5 text-sm text-gray-800">
                        <span class="font-semibold shrink-0">Test Card</span>
                        <div class="flex items-center gap-2 flex-wrap justify-end sm:justify-start sm:w-full">
                            <code
                                class="font-mono bg-gray-200 px-2 py-1 rounded-md text-gray-900 text-xs">4111 1111 1111 1111</code>
                            <span class="text-xs text-gray-500">(Any exp/cvv)</span>
                            <button class="copy-btn" @click="copyToClipboard('4111111111111111')"
                                title="Copy Card Number">
                                📋
                            </button>
                        </div>
                    </div>
                </div>

                <p v-if="paypalAvailable"
                    class="text-sm sm:text-xs text-slate-500 text-center max-w-[90%] sm:max-w-full">
                    {{ t("sandbox_note") }}
                </p>
                <p v-else-if="!isLoadingPaypalConfig"
                    class="text-sm sm:text-xs text-amber-700 text-center max-w-[90%] sm:max-w-full">
                    {{ paypalError || t("not_configured") }}
                </p>

                <div v-if="isLoadingPaypalConfig" class="text-sm text-gray-800">
                    {{ t("loading_config") }}
                </div>

                <div v-if="paypalAvailable" class="w-full max-w-[400px] sm:max-w-full flex flex-col items-center">
                    <div id="paypal-button-container" ref="paypalContainer"></div>
                    <div v-if="paypalStatus === 'loading'" class="text-sm text-gray-800">
                        {{ t("loading_buttons") }}
                    </div>
                    <div v-if="paypalError" class="text-sm text-red-700 flex flex-wrap gap-1.5 items-center">
                        {{ paypalError }}
                        <button v-if="paypalStatus === 'error'" type="button"
                            class="border-none bg-transparent text-blue-600 cursor-pointer font-semibold p-0"
                            @click="handleRetry">
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

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
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
.paypal-panel {
    border: 2px dashed #cbd5e1;
}

.copy-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    opacity: 0.6;
    transition: opacity 0.2s, transform 0.1s;
    font-size: 14px;
    line-height: 1;
}

.copy-btn:hover {
    opacity: 1;
    transform: scale(1.1);
}

.copy-btn:active {
    transform: scale(0.95);
}
</style>
