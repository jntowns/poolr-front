import { defineStore } from 'pinia'
import apiClient from '../utils/apiClient'
import { showToast } from '../utils/BaseToast'
import { calculateRidePricing } from '../utils/pricing'

export const useMapStore = defineStore('map', {
    state: () => ({
        waypoints: [],
        routeData: null,
        nearbyRides: [],
        selectedRide: null
    }),
    actions: {
        addWaypoint(waypoint) {
            this.waypoints.push(waypoint)
            if (this.waypoints.length >= 2) {
                this.fetchRoute()
            }
        },
        setWaypoints(waypoints) {
            this.waypoints = waypoints
            if (this.waypoints.length >= 2) {
                this.fetchRoute()
            }
        },
        async fetchRoute() {
            try {
                const response = await apiClient.post('/api/route', { waypoints: this.waypoints })
                this.routeData = response.data
            } catch (error) {
                console.error('Error fetching route:', error)
                showToast('Failed to calculate route. Please try again.', 'error')
            }
        },
        async fetchNearbyRides(lat, lon, limit = 10) {
            try {
                const params = { lat, lon }
                if (limit) {
                    params.limit = limit
                }
                const response = await apiClient.get('/api/demo/rides/nearest', { params })
                const ridesWithPricing = (response.data || []).map(ride => ({
                    ...ride,
                    pricing: calculateRidePricing(ride.rideDistanceKm)
                }))
                // sorting by cheapest first
                ridesWithPricing.sort((a, b) => a.pricing.grossAmount - b.pricing.grossAmount)
                this.nearbyRides = ridesWithPricing
                return ridesWithPricing
            } catch (error) {
                console.error('Error fetching nearby rides:', error)
                showToast('Failed to fetch nearby rides. Please try again.', 'error')
                this.nearbyRides = []
                throw error
            }
        },
        setSelectedRide(ride, userOrigin, userDestination) {
            const rideWithPricing = ride?.pricing
                ? ride
                : {
                    ...ride,
                    pricing: calculateRidePricing(ride?.rideDistanceKm)
                }
            this.selectedRide = rideWithPricing
            const waypoints = [
                { lat: rideWithPricing.startLatitude, lon: rideWithPricing.startLongitude },
                { lat: userOrigin.latitude, lon: userOrigin.longitude },
                { lat: userDestination.latitude, lon: userDestination.longitude },
                { lat: rideWithPricing.endLatitude, lon: rideWithPricing.endLongitude }
            ]
            this.setWaypoints(waypoints)
        },
        clearPoints() {
            this.waypoints = []
            this.routeData = null
            this.nearbyRides = []
            this.selectedRide = null
        }
    }
})
