<template>
  <div class="transaction-page">
    <div v-if="selectedRide" class="transaction-content">
      <section class="map-preview">
        <h2>{{ t("transactions.transaction_routeMap") }}</h2>
        <div class="map-wrapper">
          <RouteMap />
        </div>
      </section>

      <section class="transaction-card">
        <header>
          <h1>{{ t("transactions.transaction_confirmRide") }}</h1>
          <p class="provider-note">
            {{ t("transactions.transaction_providerNote") }}
          </p>
        </header>

        <RideSummary :ride="selectedRide" :route-data="routeData" />
        <FareBreakdown v-if="pricing" :pricing="pricing" />
        <PayPalPayment
          :is-authenticated="isAuthenticated"
          :pricing="pricing"
          :ride-name="selectedRide.driverName"
          @login="goToLogin"
        />

        <div class="actions">
          <button class="back-btn" @click="goBack">
            {{ t("transactions.back") }}
          </button>
        </div>
      </section>
    </div>

    <div v-else class="missing-selection">
      <h1>{{ t("transactions.transaction_noRideSelected") }}</h1>
      <p>{{ t("transactions.transaction_pickRideFirst") }}.</p>
      <button class="back-btn" @click="goToResults">
        {{ t("transactions.transaction_backToResults") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import RouteMap from "../components/RouteMap.vue";
import RideSummary from "../components/RideSummary.vue";
import FareBreakdown from "../components/FareBreakdown.vue";
import PayPalPayment from "../components/PayPalPayment.vue";
import { useMapStore } from "../stores/mapStore";
import { useAddressStore } from "../stores/addressStore";
import { useIdentityStore } from "../stores/identityStore";
import { calculateRidePricing } from "../utils/pricing";
import { showToast } from "../utils/BaseToast";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();
const mapStore = useMapStore();
const addressStore = useAddressStore();
const identityStore = useIdentityStore();

const selectedRide = computed(() => mapStore.selectedRide);
const routeData = computed(() => mapStore.routeData);
const pricing = computed(() => {
  const currentRide = selectedRide.value;
  if (!currentRide) return null;
  return (
    currentRide.pricing ??
    calculateRidePricing(currentRide.rideDistanceKm, currentRide.detourDistance)
  );
});

const isAuthenticated = computed(() => !!identityStore.id);

const goBack = () => {
  router.back();
};

const goToResults = () => {
  router.push("/ride-results");
};

const goToLogin = () => {
  router.push("/login");
};

onMounted(async () => {
  await identityStore.getIdentity();

  if (!selectedRide.value) {
    router.replace("/find-ride");
    return;
  }

  if (!mapStore.selectedRide?.pricing) {
    mapStore.selectedRide = {
      ...mapStore.selectedRide,
      pricing: calculateRidePricing(
        mapStore.selectedRide.rideDistanceKm,
        mapStore.selectedRide.detourDistance
      ),
    };
  }

  if (!addressStore.origin || !addressStore.destination) {
    showToast(
      "Origin or destination is missing. Re-select your ride if the map looks off.",
      "info"
    );
  }
});
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
  grid-template-columns: 1fr;
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
}
</style>
