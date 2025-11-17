<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl mx-auto">
            <div class="bg-white rounded-xl shadow-lg p-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-6">
                    Find a Ride
                </h1>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        From (Your Location)
                    </label>
                    <div class="flex gap-2">
                        <div class="flex-1">
                            <AddressSearchBar v-model="origin" placeholder="Enter pickup location..." :min-chars="2"
                                :debounce-delay="300" :max-results="10" @select="handleOriginSelect"
                                @clear="handleOriginClear" />
                        </div>
                        <button @click="getUserLocation" :disabled="isGettingLocation"
                            class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center gap-2"
                            title="Use my current location">
                            <svg v-if="!isGettingLocation" class="w-5 h-5" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        To (Destination)
                    </label>
                    <AddressSearchBar v-model="destination" placeholder="Enter destination..." :min-chars="2"
                        :debounce-delay="300" :max-results="10" :user-location="origin"
                        @select="handleDestinationSelect" @clear="handleDestinationClear" />
                </div>

                <div v-if="origin || destination" class="mt-6 space-y-4">
                    <div v-if="origin"
                        class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                        <h3 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="8" />
                            </svg>
                            Pickup Location
                        </h3>
                        <p class="text-sm text-gray-900">{{ getPrimaryText(origin) }}</p>
                    </div>

                    <div v-if="destination"
                        class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                        <h3 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Destination
                        </h3>
                        <p class="text-sm text-gray-900">{{ getFullAddressText(destination) }}</p>
                    </div>
                </div>

                <button v-if="origin && destination" @click="findRide" :disabled="isSearching"
                    class="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200">
                    {{ isSearching ? 'Searching...' : 'Find Available Rides' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAddressStore } from '../stores/addressStore'
import { useMapStore } from '../stores/mapStore'
import AddressSearchBar from '../components/AddressSearchBar.vue'
import { getPrimaryText, getFullAddressText } from '../utils/addressUtils'
import apiClient from '../utils/apiClient'
import { showToast } from '../utils/BaseToast'

const router = useRouter()
const addressStore = useAddressStore()
const mapStore = useMapStore()

const origin = computed({
    get: () => addressStore.origin,
    set: (value) => addressStore.setOrigin(value)
})
const destination = computed({
    get: () => addressStore.destination,
    set: (value) => addressStore.setDestination(value)
})

const isGettingLocation = ref(false)
const isSearching = ref(false)

const handleOriginSelect = (address) => {
    addressStore.setOrigin(address)
    console.log('Origin selected:', address)
}

const handleOriginClear = () => {
    addressStore.clearOrigin()
    console.log('Origin cleared')
}

const handleDestinationSelect = (address) => {
    addressStore.setDestination(address)
    console.log('Destination selected:', address)
}

const handleDestinationClear = () => {
    addressStore.clearDestination()
    console.log('Destination cleared')
}

const getUserLocation = () => {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser', 'error')
        return
    }

    isGettingLocation.value = true

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords

                const response = await apiClient.get('/api/search/reverse', {
                    params: { lat: latitude, lon: longitude }
                })

                const address = response.data
                addressStore.setOrigin(address)
                showToast('Location found!', 'success')
            } catch (error) {
                console.error('Error reverse geocoding:', error)
                showToast('Failed to get address from location', 'error')
            } finally {
                isGettingLocation.value = false
            }
        },
        (error) => {
            console.error('Geolocation error:', error)
            showToast('Failed to get your location. Please enter it manually.', 'error')
            isGettingLocation.value = false
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    )
}

const findRide = async () => {
    if (!origin.value || !destination.value) return

    isSearching.value = true
    try {
        showToast('Searching for available rides...', 'info')
        const rides = await mapStore.fetchNearbyRides(origin.value.latitude, origin.value.longitude, 10)
        if (rides.length === 0) {
            showToast('No rides found nearby', 'warning')
        } else {
            showToast(`Found ${rides.length} available ride${rides.length > 1 ? 's' : ''}`, 'success')
            router.push('/ride-results')
        }
    } catch (error) {
    } finally {
        isSearching.value = false
    }
}
</script>