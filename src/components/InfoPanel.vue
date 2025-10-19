<template>
    <div class="info-panel" aria-live="polite">
        <h3>Route Planner</h3>
        <p>Click on the map to set waypoint {{ waypoints.length + 1 }} of 3</p>

        <div v-for="(waypoint, index) in waypoints" :key="index" class="point-info">
            <strong>Waypoint {{ index + 1 }}:</strong> {{ waypoint.lat.toFixed(5) }}, {{ waypoint.lon.toFixed(5) }}
        </div>

        <div v-if="routeData" class="route-info">
            <strong>Distance:</strong> {{ routeData.distanceKm.toFixed(2) }} km<br>
            <strong>Duration:</strong> {{ routeData.durationMinutes.toFixed(2) }} minutes
        </div>

        <button v-if="waypoints.length > 0" @click="clearPoints" class="clear-btn">
            Clear Points
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMapStore } from '../stores/mapStore'

const mapStore = useMapStore()

const waypoints = computed(() => mapStore.waypoints)
const routeData = computed(() => mapStore.routeData)

const clearPoints = () => {
    mapStore.clearPoints()
}
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
</style>
