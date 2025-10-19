import { defineStore } from 'pinia'
import apiClient from '../utils/apiClient'

export const useMapStore = defineStore('map', {
    state: () => ({
        waypoints: [],
        routeData: null
    }),
    actions: {
        addWaypoint(waypoint) {
            if (this.waypoints.length < 3) {
                this.waypoints.push(waypoint)
            } else {
                this.waypoints = [waypoint]
                this.routeData = null
            }
            if (this.waypoints.length === 3) {
                this.fetchRoute()
            }
        },
        async fetchRoute() {
            try {
                const response = await apiClient.post('/api/route', { waypoints: this.waypoints })
                this.routeData = response.data
            } catch (error) {
                console.error('Error fetching route:', error)
                alert('Failed to calculate route. Please try again.')
            }
        },
        clearPoints() {
            this.waypoints = []
            this.routeData = null
        }
    }
})