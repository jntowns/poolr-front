<template>
    <div class="info-panel" aria-live="polite">
        <div class="panel-header">
            <h3>{{ selectedRide ? t("selectedRide") : t("routePlanner") }}</h3>
        </div>

        <div v-if="selectedRide" class="ride-details-card">
            <div class="detail-row">
                <span class="label">{{ t("driver") }}</span>
                <span class="value">{{ selectedRide.driverName }}</span>
            </div>
            <div class="detail-row">
                <span class="label">{{ t("vehicle") }}</span>
                <span class="value">{{ selectedRide.vehicle }} • {{ selectedRide.vehicleColor }}</span>
            </div>
            <div v-if="selectedRide.distanceFromUserKm != null" class="detail-row">
                <span class="label">{{ t("distance") }}</span>
                <span class="value">{{ selectedRide.distanceFromUserKm.toFixed(2) }} km {{ t("infoPanel.away") }}</span>
            </div>

            <button v-if="!onTransactionPage" class="action-btn primary" @click="goToTransaction">
                {{ t("continueToPayment") }}
            </button>
        </div>

        <div v-else class="instruction-card">
            <p>{{ t("clickToSetWaypoint") }}</p>
        </div>

        <div v-if="selectedRide" class="legend-section">
            <h4 class="section-title">{{ t("mapLegend") }}</h4>

            <div class="legend-group">
                <div class="legend-item" @mouseenter="setHover('marker', 0)" @mouseleave="clearHover"
                    :class="{ active: isHovered('marker', 0) }">
                    <div class="marker-icon start">A</div>
                    <div class="legend-text">
                        <span class="title">{{ t("rideStart") }}</span>
                        <span class="subtitle">{{ t("infoPanel.driversOrigin") }}</span>
                    </div>
                </div>

                <div class="legend-item" @mouseenter="setHover('segment', 0)" @mouseleave="clearHover"
                    :class="{ active: isHovered('segment', 0) }">
                    <div class="line-icon segment-1"></div>
                    <div class="legend-text">
                        <span class="title">{{ t("infoPanel.pickupRoute") }}</span>
                        <span class="subtitle">{{ t("infoPanel.driverToYou") }}</span>
                    </div>
                </div>

                <div class="legend-item" @mouseenter="setHover('marker', 1)" @mouseleave="clearHover"
                    :class="{ active: isHovered('marker', 1) }">
                    <div class="marker-icon pickup">B</div>
                    <div class="legend-text">
                        <span class="title">{{ t("yourPickup") }}</span>
                        <span class="subtitle">{{ t("infoPanel.meetHere") }}</span>
                    </div>
                </div>

                <div class="legend-item" @mouseenter="setHover('segment', 1)" @mouseleave="clearHover"
                    :class="{ active: isHovered('segment', 1) }">
                    <div class="line-icon segment-2"></div>
                    <div class="legend-text">
                        <span class="title">{{ t("infoPanel.sharedRide") }}</span>
                        <span class="subtitle">{{ t("infoPanel.youAndDriver") }}</span>
                    </div>
                </div>

                <div class="legend-item" @mouseenter="setHover('marker', 2)" @mouseleave="clearHover"
                    :class="{ active: isHovered('marker', 2) }">
                    <div class="marker-icon dropoff">C</div>
                    <div class="legend-text">
                        <span class="title">{{ t("yourDestination") }}</span>
                        <span class="subtitle">{{ t("infoPanel.destination") }}</span>
                    </div>
                </div>

                <div class="legend-item" @mouseenter="setHover('marker', 3)" @mouseleave="clearHover"
                    :class="{ active: isHovered('marker', 3) }">
                    <div class="marker-icon end">D</div>
                    <div class="legend-text">
                        <span class="title">{{ t("rideEnd") }}</span>
                        <span class="subtitle">{{ t("infoPanel.driversFinalStop") }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="routeData" class="stats-card">
            <div class="stat-item">
                <span class="stat-value">{{ routeData.distanceKm.toFixed(1) }}</span>
                <span class="stat-label">{{ t("infoPanel.kmTotal") }}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <span class="stat-value">{{ Math.round(routeData.durationMinutes) }}</span>
                <span class="stat-label">{{ t("infoPanel.min") }}</span>
            </div>
        </div>

        <button v-if="waypoints.length > 0 && !onTransactionPage" @click="clearPoints" class="action-btn secondary">
            {{ t("infoPanel.clearRoute") }}
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

const waypoints = computed(() => mapStore.waypoints)
const routeData = computed(() => mapStore.routeData)
const selectedRide = computed(() => mapStore.selectedRide)
const onTransactionPage = computed(() => route.name === 'transaction')
const hoveredElement = computed(() => mapStore.hoveredElement)

const setHover = (type, index) => {
    mapStore.setHoveredElement({ type, index })
}

const clearHover = () => {
    mapStore.setHoveredElement(null)
}

const isHovered = (type, index) => {
    return hoveredElement.value?.type === type && hoveredElement.value?.index === index
}

const clearPoints = () => {
  mapStore.clearPoints();
};

const goToTransaction = () => {
    if (!selectedRide.value || onTransactionPage.value) return
    router.push({ name: 'transaction' })
}
</script>

<style scoped>
.info-panel {
    background: white;
    padding: 14px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    width: 320px;
    max-width: 100%;
    flex-shrink: 0;
    align-self: flex-start;
    font-family: 'Inter', sans-serif;
}

.panel-header h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 700;
    color: #111827;
}

.ride-details-card,
.instruction-card {
    background: #f9fafb;
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 14px;
    border: 1px solid #e5e7eb;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    font-size: 12px;
}

.detail-row:last-child {
    margin-bottom: 0;
}

.label {
    color: #6b7280;
    font-weight: 500;
}

.value {
    color: #111827;
    font-weight: 600;
    text-align: right;
}

.section-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
    margin: 0 0 8px 0;
    font-weight: 600;
}

.legend-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.legend-item:hover,
.legend-item.active {
    background: #f3f4f6;
    border-color: #e5e7eb;
    transform: translateX(4px);
}

.marker-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 11px;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
}

.marker-icon.start {
    background-color: #10B981;
}

.marker-icon.pickup {
    background-color: #3B82F6;
}

.marker-icon.dropoff {
    background-color: #F59E0B;
}

.marker-icon.end {
    background-color: #EF4444;
}

.line-icon {
    width: 20px;
    height: 3px;
    border-radius: 2px;
    flex-shrink: 0;
}

.line-icon.segment-1 {
    background-color: #3B82F6;
}

.line-icon.segment-2 {
    background-color: #10B981;
}

.legend-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.legend-text .title {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    line-height: 1.3;
}

.legend-text .subtitle {
    font-size: 10px;
    color: #6b7280;
    line-height: 1.2;
}

.stats-card {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #eff6ff;
    border-radius: 10px;
    padding: 10px;
    margin: 14px 0;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    font-size: 16px;
    font-weight: 700;
    color: #1d4ed8;
    line-height: 1.2;
}

.stat-label {
    font-size: 10px;
    color: #60a5fa;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 1.2;
}

.stat-divider {
    width: 1px;
    height: 24px;
    background: #dbeafe;
}

.action-btn {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.action-btn.primary {
    background: #2563eb;
    color: white;
    margin-top: 10px;
}

.action-btn.primary:hover {
    background: #1d4ed8;
}

.action-btn.secondary {
    background: #fee2e2;
    color: #ef4444;
}

.action-btn.secondary:hover {
    background: #fecaca;
}

@media (max-width: 768px) {
  .info-panel {
    width: 100%;
    align-self: stretch;
  }
}
</style>
