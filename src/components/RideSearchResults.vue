<template>
    <div class="ride-search-results">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Available Rides</h2>
        <div v-if="futureRides.length === 0" class="text-center py-8 text-gray-500">
            No rides found. Try adjusting your search criteria.
        </div>
        <div v-else class="space-y-4">
            <div v-for="ride in futureRides" :key="ride.rideId"
                class="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                :class="{ 'border-blue-500 bg-blue-50': selectedRideId === ride.rideId }"
                @click="$emit('select', ride)">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <h3 class="font-semibold text-gray-900">{{ ride.driverName }}</h3>
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
                            <p class="text-lg font-semibold text-gray-800 mb-1">
                                {{ getDepartureInfo(ride.startTime) }}
                            </p>
                        </div>
                    </div>
                    <div class="text-right min-w-[140px]">
                        <p class="text-lg font-semibold text-gray-900">
                            {{ ride.pricing ? formatCurrency(ride.pricing.grossAmount) : '—' }}
                        </p>
                        <p class="text-xs text-gray-500">
                            {{ (ride.rideDistanceKm || 0).toFixed(2) }} km trip • {{ (ride.detourDistance ||
                            0).toFixed(2) }} km detour for driver • Subtotal:
                            {{ ride.pricing ? formatCurrency(ride.pricing.subtotalAmount) : '—' }}
                        </p>
                    </div>
                </div>
                <div class="mt-3 flex justify-end">
                    <button
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        @click.stop="$emit('select', ride)">
                        Use This Ride
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/pricing'

const props = defineProps({
    rides: {
        type: Array,
        required: true
    },
    selectedRideId: {
        type: Number,
        default: null
    }
})

const futureRides = computed(() => {
    const now = new Date()
    return props.rides.filter(ride => new Date(ride.startTime) > now)
})

const getDepartureInfo = (startTime) => {
    const now = new Date()
    const start = new Date(startTime)
    const diffMs = start - now
    if (diffMs <= 0) return 'Departed'
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    let timeString = ''
    if (diffHours > 0) {
        timeString = `Leaves in ${diffHours} hour${diffHours > 1 ? 's' : ''}`
    } else {
        timeString = `Leaves in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
    }
    const formattedTime = start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    return `${timeString} (${formattedTime})`
}

defineEmits(['select'])
</script>

<style scoped>
.ride-search-results {
    width: 100%;
}
</style>
