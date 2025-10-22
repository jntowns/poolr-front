<template>
    <div class="ride-search-results">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Available Rides</h2>
        <div v-if="rides.length === 0" class="text-center py-8 text-gray-500">
            No rides found. Try adjusting your search criteria.
        </div>
        <div v-else class="space-y-4">
            <div v-for="ride in rides" :key="ride.rideId"
                class="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                :class="{ 'border-blue-500 bg-blue-50': selectedRideId === ride.rideId }"
                @click="$emit('select', ride)">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <h3 class="font-semibold text-gray-900">{{ ride.driverName }}</h3>
                            <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                {{ ride.distanceFromUserKm.toFixed(2) }} km away
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 mb-1">
                            {{ ride.vehicle }} • {{ ride.vehicleColor }}
                        </p>
                        <div class="text-sm text-gray-700 space-y-1">
                            <div class="flex items-start gap-2">
                                <span class="text-green-600">●</span>
                                <span>{{ ride.startAddress }}</span>
                            </div>
                            <div class="flex items-start gap-2">
                                <span class="text-red-600">●</span>
                                <span>{{ ride.endAddress }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-500">{{ ride.rideDistanceKm.toFixed(2) }} km</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    rides: {
        type: Array,
        required: true
    },
    selectedRideId: {
        type: Number,
        default: null
    }
})

defineEmits(['select'])
</script>

<style scoped>
.ride-search-results {
    width: 100%;
}
</style>
