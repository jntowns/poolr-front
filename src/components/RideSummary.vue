<template>
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
</template>

<script setup>
defineProps({
    ride: {
        type: Object,
        required: true
    },
    routeData: {
        type: Object,
        default: null
    }
})
</script>

<style scoped>
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
</style>
