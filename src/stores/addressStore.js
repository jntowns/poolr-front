import { defineStore } from 'pinia'
import apiClient from '../utils/apiClient'

export const useAddressStore = defineStore('address', {
    state: () => ({
        selectedAddress: null,
        origin: null,
        destination: null,
        isLoading: false,
        error: null
    }),
    actions: {
        async searchAddresses(query, limit = 10, userLat = null, userLon = null) {
            this.isLoading = true
            this.error = null

            try {
                const params = { query, limit }
                if (userLat !== null && userLon !== null) {
                    params.userLat = userLat
                    params.userLon = userLon
                }

                const response = await apiClient.get('/api/search/autocomplete', {
                    params
                })

                const results = response.data

                return results
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to fetch addresses'
                throw err
            } finally {
                this.isLoading = false
            }
        },

        async getAddressById(id) {
            try {
                const response = await apiClient.get(`/api/search/${id}`)
                return response.data
            } catch (err) {
                this.error = 'Failed to fetch address details'
                throw err
            }
        },

        setSelectedAddress(address) {
            this.selectedAddress = address
        },

        setOrigin(address) {
            this.origin = address
        },

        setDestination(address) {
            this.destination = address
        },

        clearOrigin() {
            this.origin = null
        },

        clearDestination() {
            this.destination = null
        },

        clearError() {
            this.error = null
        }
    }
})
