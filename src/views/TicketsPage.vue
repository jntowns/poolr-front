<template>
    <div class="max-w-5xl mx-auto my-10 px-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-white tracking-tight">
                Your Tickets
            </h1>
            <span v-if="tickets.length > 0"
                class="text-sm text-blue-200 bg-blue-900/50 px-3 py-1 rounded-full border border-blue-800">
                {{ tickets.length }} Upcoming
            </span>
        </div>

        <!-- Loading State -->
        <div v-if="ticketStore.loading"
            class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-xl">
            <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p class="text-gray-500 font-medium">Retrieving your tickets...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="tickets.length === 0"
            class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-xl text-center px-6">
            <div class="bg-blue-50 p-6 rounded-full mb-6">
                <!-- Ticket Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No tickets yet</h3>
            <p class="text-gray-500 max-w-sm mb-8">
                Ready to hit the road? Book a ride now to see your upcoming trips and ticket details here.
            </p>
            <router-link to="/find-ride"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                Book a Ride
            </router-link>
        </div>

        <!-- Ticket Grid -->
        <div v-else class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            <div v-for="ticket in tickets" :key="ticket.ticketId"
                class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">

                <!-- Ticket Header -->
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <p class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Departure</p>
                        <p class="text-lg font-bold text-gray-900">
                            {{ formatDeparture(ticket.startTime) }}
                        </p>
                    </div>
                    <div class="text-right">
                        <div
                            class="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Code</span>
                            <span class="font-mono text-sm font-bold text-gray-800 tracking-wider">
                                {{ ticket.confirmationCode }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Ticket Body -->
                <div class="p-6 flex-grow">
                    <!-- Route Timeline -->
                    <div class="relative pl-4 space-y-8 mb-8">
                        <!-- Connecting Line -->
                        <div class="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gray-200"></div>

                        <!-- From -->
                        <div class="relative flex items-start">
                            <div
                                class="absolute left-0 mt-1 w-2.5 h-2.5 rounded-full bg-white border-[3px] border-green-500 z-10">
                            </div>
                            <div class="ml-6">
                                <p class="text-xs font-semibold text-gray-400 uppercase">From</p>
                                <p class="text-gray-900 font-medium leading-tight mt-0.5">{{ ticket.startAddress }}</p>
                            </div>
                        </div>

                        <!-- To -->
                        <div class="relative flex items-start">
                            <div
                                class="absolute left-0 mt-1 w-2.5 h-2.5 rounded-full bg-white border-[3px] border-red-500 z-10">
                            </div>
                            <div class="ml-6">
                                <p class="text-xs font-semibold text-gray-400 uppercase">To</p>
                                <p class="text-gray-900 font-medium leading-tight mt-0.5">{{ ticket.endAddress }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Driver Info Card -->
                    <div class="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                        <div class="flex items-center gap-3">
                            <!-- Avatar Placeholder with Initials -->
                            <div
                                class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border-2 border-white shadow-sm">
                                {{ getInitials(ticket.driverName) }}
                            </div>
                            <div>
                                <p class="text-sm font-bold text-gray-900">{{ ticket.driverName }}</p>
                                <p class="text-xs text-gray-500">{{ ticket.vehicleColor }} {{ ticket.vehicle }}</p>
                            </div>
                        </div>

                        <div v-if="ticket.rideDistanceKm" class="text-right">
                            <p class="text-xs text-gray-400">Distance</p>
                            <p class="text-xs font-semibold text-gray-700">{{ ticket.rideDistanceKm.toFixed(1) }} km</p>
                        </div>
                    </div>
                </div>

                <!-- Footer / Metadata -->
                <div
                    class="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                    <span>Ticket #{{ ticket.ticketId }}</span>
                    <span>Booked {{ formatDate(ticket.createdAt) }}</span>
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

const getInitials = (name) => {
    if (!name) return 'DR';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

const formatDeparture = (startTime) => {
    if (!startTime) return 'Unknown'
    const d = new Date(startTime)
    // Format: Nov 27 • 7:22 AM
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    }) + ' • ' + d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    })
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString()
}
</script>