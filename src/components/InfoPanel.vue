<template>
  <div class="info-panel" aria-live="polite">
    <h3>{{ selectedRide ? t("selectedRide") : t("routePlanner") }}</h3>

    <div v-if="selectedRide" class="ride-details">
      <div class="detail-item">
        <strong>{{ t("driver") }}:</strong> {{ selectedRide.driverName }}
      </div>
      <div class="detail-item">
        <strong>{{ t("vehicle") }}:</strong> {{ selectedRide.vehicle }} ({{
          selectedRide.vehicleColor
        }})
      </div>
      <div v-if="selectedRide.distanceFromUserKm != null" class="detail-item">
        <strong>{{ t("distanceFromYou") }}:</strong>
        {{ selectedRide.distanceFromUserKm.toFixed(2) }} km
      </div>
      <button
        v-if="!onTransactionPage"
        class="payment-btn"
        @click="goToTransaction"
      >
        {{ t("continueToPayment") }}
      </button>
    </div>

    <p v-else>{{ t("clickToSetWaypoint") }} {{ waypoints.length + 1 }}</p>

    <!-- legend that displays what the colors mean -->
    <div v-if="selectedRide" class="legend-section">
      <h4 class="legend-title">{{ t("mapLegend") }}</h4>

      <div class="legend-subsection">
        <strong>{{ t("markers") }}:</strong>
        <div class="legend-item">
          <span class="marker-dot" style="background-color: #2aad27"></span>
          <span>{{ t("rideStart") }}</span>
        </div>
        <div class="legend-item">
          <span class="marker-dot" style="background-color: #2a81cb"></span>
          <span>{{ t("yourPickup") }}</span>
        </div>
        <div class="legend-item">
          <span class="marker-dot" style="background-color: #cb8427"></span>
          <span>{{ t("yourDestination") }}</span>
        </div>
        <div class="legend-item">
          <span class="marker-dot" style="background-color: #cb2b3e"></span>
          <span>{{ t("rideEnd") }}</span>
        </div>
      </div>

      <div class="legend-subsection">
        <strong>{{ t("routeSegments") }}:</strong>
        <div class="legend-item">
          <span class="line-sample" style="background-color: #00ff00"></span>
          <span>{{ t("driverRouteToPickup") }}</span>
        </div>
        <div class="legend-item">
          <span class="line-sample" style="background-color: #ff6600"></span>
          <span>{{ t("sharedRideToDestination") }}</span>
        </div>
      </div>
    </div>

    <div v-for="(waypoint, index) in waypoints" :key="index" class="point-info">
      <strong>{{ getWaypointLabel(index) }}:</strong>
      {{ waypoint.lat.toFixed(5) }}, {{ waypoint.lon.toFixed(5) }}
    </div>

    <div v-if="routeData" class="route-info">
      <strong>{{ t("distance") }}:</strong>
      {{ routeData.distanceKm.toFixed(2) }} km<br />
      <strong>{{ t("duration") }}:</strong>
      {{ routeData.durationMinutes.toFixed(2) }} {{ t("minutes") }}
    </div>

    <button
      v-if="waypoints.length > 0 && !onTransactionPage"
      @click="clearPoints"
      class="clear-btn"
    >
      {{ t("clearPoints") }}
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMapStore } from "../stores/mapStore";
import { useI18n } from "vue-i18n";

const mapStore = useMapStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const waypoints = computed(() => mapStore.waypoints);
const routeData = computed(() => mapStore.routeData);
const selectedRide = computed(() => mapStore.selectedRide);
const onTransactionPage = computed(() => route.name === "transaction");

const getWaypointLabel = (index) => {
  if (selectedRide.value) {
    const labels = [
      t("rideStart"),
      t("yourPickup"),
      t("yourDestination"),
      t("rideEnd"),
    ];
    return labels[index] || `${t("point")} ${index + 1}`;
  }
  return `${t("waypoint")} ${index + 1}`;
};

const clearPoints = () => {
  mapStore.clearPoints();
};

const goToTransaction = () => {
  if (!selectedRide.value || onTransactionPage.value) return;
  router.push({ name: "transaction" });
};

const formatCurrency = (amount) => formatMoney(amount);
</script>

<style scoped>
.info-panel {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  width: 280px;
  max-width: 100%;
  flex-shrink: 0;
  align-self: flex-start;
}

.info-panel h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.info-panel p {
  margin: 5px 0;
  font-size: 13px;
  color: #000;
}

.point-info {
  margin: 6px 0;
  padding: 6px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  color: #000;
}

.route-info {
  margin: 10px 0;
  padding: 8px;
  background: #e3f2fd;
  border-radius: 4px;
  font-size: 13px;
  color: #000;
}

.clear-btn {
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.clear-btn:hover {
  background: #d32f2f;
}

@media (max-width: 768px) {
  .info-panel {
    width: 100%;
    align-self: stretch;
  }
}

.ride-details {
  margin: 10px 0;
  padding: 10px;
  background: #e8f5e9;
  border-radius: 4px;
}

.detail-item {
  margin: 5px 0;
  font-size: 12px;
  color: #000;
}

.legend-section {
  margin: 15px 0;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.legend-title {
  margin: 0 0 10px 0;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.legend-subsection {
  margin: 8px 0;
}

.legend-subsection strong {
  display: block;
  font-size: 11px;
  color: #666;
  margin-bottom: 5px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
  font-size: 11px;
  color: #000;
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.line-sample {
  width: 20px;
  height: 4px;
  border-radius: 2px;
  flex-shrink: 0;
}

.fare-breakdown {
  margin: 12px 0;
  padding: 10px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #1f2937;
}

.fare-row,
.fare-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.fare-total {
  margin-top: 10px;
  font-weight: 600;
  border-top: 1px solid #e5e7eb;
  padding-top: 8px;
}

.payment-btn {
  width: 100%;
  margin-top: 12px;
  padding: 10px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.payment-btn:hover {
  background: #1d4ed8;
}
</style>
