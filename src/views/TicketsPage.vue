<template>
    <div class="max-w-2xl mx-auto my-8 px-4">
        <div class="bg-white rounded-lg p-8 shadow-md">
            <h1 class="text-3xl font-semibold mb-6 text-gray-800 text-center">
                Your Tickets
            </h1>

            <div v-if="ticketStore.loading" class="text-center py-8 text-gray-500">
                <div
                    class="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin">
                </div>
                <p>Loading tickets...</p>
            </div>

            <div v-else-if="tickets.length === 0" class="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 20l-1.447 1.342A1 1 0 016 20.764V18m9-14H9a2 2 0 00-2 2v1H5a2 2 0 00-2 2v3.5a2.5 2.5 0 000 5V20a2 2 0 002 2h10a2 2 0 002-2v-1.5a2.5 2.5 0 000-5V9a2 2 0 00-2-2h-1V6a2 2 0 00-2-2z" />
                </svg>
                <p>No tickets yet.</p>
                <p class="text-sm mt-1">
                    Book a ride to see your tickets here.
                </p>
            </div>

            <div v-else class="space-y-4">
                <div v-for="ticket in tickets" :key="ticket.ticketId"
                    class="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <p class="text-xs text-gray-400 mb-1">
                                Ticket #{{ ticket.ticketId }}
                            </p>
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Confirmation
                                </span>
                                <span
                                    class="px-2.5 py-1 text-xs font-mono font-semibold tracking-widest rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                    {{ ticket.confirmationCode }}
                                </span>
                            </div>
                        </div>
                        <div class="text-right min-w-[140px]">
                            <p v-if="ticket.rideDistanceKm" class="text-xs text-gray-500">
                                {{ ticket.rideDistanceKm.toFixed(2) }} km
                            </p>
                            <p class="text-xs text-gray-400 mt-1">
                                Booked at
                                {{ new Date(ticket.createdAt).toLocaleString() }}
                            </p>
                        </div>
                    </div>

                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <p class="text-sm text-gray-600">
                                Driver:
                                <span class="font-medium text-gray-800">
                                    {{ ticket.driverName }}
                                </span>
                            </p>
                            <p class="text-sm text-gray-600">
                                {{ ticket.vehicle }} • {{ ticket.vehicleColor }}
                            </p>
                        </div>
                    </div>

                    <div class="relative pl-6 space-y-3 mt-2">
                        <div
                            class="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-green-400 to-red-400">
                        </div>

                        <div class="flex items-start">
                            <div
                                class="absolute left-0 mt-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow">
                            </div>
                            <div class="ml-4">
                                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">From</span>
                                <p class="text-gray-800 font-medium">
                                    {{ ticket.startAddress }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div
                                class="absolute left-0 mt-1.5 w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow">
                            </div>
                            <div class="ml-4">
                                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">To</span>
                                <p class="text-gray-800 font-medium">
                                    {{ ticket.endAddress }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-start">
                        <p class="text-sm text-gray-700">
                            Departure:
                            <span class="font-medium">
                                {{ formatDeparture(ticket.startTime) }}
                            </span>
                        </p>
                        <p class="text-xs text-gray-500 text-right max-w-[220px] leading-snug ml-4">
                            <span class="block">Show this code to your driver</span>
                            <span class="block mt-0.5">to verify your ride.</span>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTicketStore } from '../stores/ticketStore'

const ticketStore = useTicketStore()
const { tickets } = storeToRefs(ticketStore)

onMounted(() => {
    ticketStore.fetchMyTickets()
})

const formatDeparture = (startTime) => {
    if (!startTime) return 'Unknown'
    const d = new Date(startTime)
    return d.toLocaleString([], {
        hour: 'numeric',
        minute: '2-digit',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>
