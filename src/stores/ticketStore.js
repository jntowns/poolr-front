import { defineStore } from 'pinia'
import apiClient from '../utils/apiClient'
import { showToast } from '../utils/BaseToast'

export const useTicketStore = defineStore('tickets', {
    state: () => ({
        tickets: [],
        loading: false
    }),
    actions: {
        async fetchMyTickets() {
            this.loading = true
            try {
                const res = await apiClient.get('/api/tickets/my')
                this.tickets = res.data || []
            } catch (err) {
                console.error('Error fetching tickets', err)
                showToast('Failed to load your tickets.', 'error')
            } finally {
                this.loading = false
            }
        },
        async createTicketFromRide(ride) {
            try {
                const res = await apiClient.post('/api/tickets', {
                    rideId: ride.rideId
                })
                const ticket = res.data
                this.tickets.unshift(ticket)
                showToast('Ticket created successfully!', 'success')
                return ticket
            } catch (err) {
                console.error('Error creating ticket', err)
                showToast('Failed to create ticket.', 'error')
                throw err
            }
        }
    }
})
