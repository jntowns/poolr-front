<template>
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <div class="mb-6">
                <button @click="goBack" class="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Search
                </button>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                <RideSearchResults :rides="nearbyRides" :selected-ride-id="selectedRide?.rideId" @select="selectRide" />
            </div>

            <div v-if="selectedRide" ref="mapContainer" class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Route Map</h2>
                <RouteMap ref="routeMapRef" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMapStore } from '../stores/mapStore'
import { useAddressStore } from '../stores/addressStore'
import RideSearchResults from '../components/RideSearchResults.vue'
import RouteMap from '../components/RouteMap.vue'
import { showToast } from '../utils/BaseToast'

const router = useRouter()
const mapStore = useMapStore()
const addressStore = useAddressStore()

const nearbyRides = computed(() => mapStore.nearbyRides)
const selectedRide = computed(() => mapStore.selectedRide)
const origin = computed(() => addressStore.origin)
const destination = computed(() => addressStore.destination)

const mapContainer = ref(null)
const routeMapRef = ref(null)

const selectRide = async (ride) => {
    console.log("Origin: ", origin.value)
    console.log("Destination: ", destination.value)
    mapStore.setSelectedRide(ride, origin.value, destination.value)
    showToast('Route calculated! Check the map below.', 'success')
    await nextTick()

    if (mapContainer.value) {
        const yOffset = -20
        const element = mapContainer.value
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

        window.scrollTo({
            top: y,
            behavior: 'smooth'
        })
    }

    setTimeout(() => {
        if (routeMapRef.value && routeMapRef.value.fitRouteBounds) {
            routeMapRef.value.fitRouteBounds()
        }
    }, 800)
}

const goBack = () => {
    mapStore.clearPoints()
    router.push('/find-ride')
}
</script>
