import { defineStore } from 'pinia'
import apiClient from '../utils/apiClient'
import { showToast } from '../utils/BaseToast'

export const useMapStore = defineStore('map', {
    state: () => ({
        waypoints: [],
        routeData: null,
        nearbyRides: [],
        selectedRide: null,
        hoveredElement: null
    }),
    actions: {
        setHoveredElement(element) {
            this.hoveredElement = element
        },
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
        async fetchNearbyRides(lat, lon, lat2, lon2) {
            try {
                const params = { lat, lon, lat2, lon2 }
                const response = await apiClient.get('/api/demo/rides/nearest', { params })
                // sorting by cheapest first (handle missing pricing gracefully)
                this.nearbyRides = (response.data || []).sort((a, b) => {
                    const priceA = a.pricing?.grossAmount ?? Infinity
                    const priceB = b.pricing?.grossAmount ?? Infinity
                    return priceA - priceB
                })
                return this.nearbyRides
            } catch (error) {
                console.error('Error fetching nearby rides:', error)
                showToast('Failed to fetch nearby rides. Please try again.', 'error')
                this.nearbyRides = []
                throw error
            }
        },
        setSelectedRide(ride, userOrigin, userDestination) {
            this.selectedRide = ride
            const waypoints = [
                { lat: ride.startLatitude, lon: ride.startLongitude },
                { lat: userOrigin.latitude, lon: userOrigin.longitude },
                { lat: userDestination.latitude, lon: userDestination.longitude },
                { lat: ride.endLatitude, lon: ride.endLongitude }
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
