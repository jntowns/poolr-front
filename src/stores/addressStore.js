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
        async searchAddresses(query, limit = 10) {
            this.isLoading = true
            this.error = null

            try {
                const response = await apiClient.get('/api/addresses/autocomplete', {
                    params: { query, limit }
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
                const response = await apiClient.get(`/api/addresses/${id}`)
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
