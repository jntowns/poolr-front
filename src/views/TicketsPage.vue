<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">Your Tickets</h1>

    <div v-if="ticketStore.loading" class="text-gray-500 py-4">
      Loading tickets...
    </div>

    <div v-else-if="tickets.length === 0" class="text-gray-500 py-4">
      You have no tickets yet.
    </div>

    <div v-else class="space-y-4">
      <div
          v-for="ticket in tickets"
          :key="ticket.ticketId"
          class="p-4 border border-gray-200 rounded-lg"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <p class="text-xs text-gray-500 mb-1">
              Ticket #{{ ticket.ticketId }}
            </p>
            <p class="text-sm">
              Confirmation code:
              <span class="font-mono font-semibold tracking-widest text-blue-700">
                                {{ ticket.confirmationCode }}
                            </span>
            </p>

            <p class="mt-3 text-sm text-gray-600">
              Driver:
              <span class="font-medium text-gray-800">{{ ticket.driverName }}</span>
            </p>
            <p class="text-sm text-gray-600">
              {{ ticket.vehicle }} • {{ ticket.vehicleColor }}
            </p>

            <div class="mt-2 text-sm text-gray-700 space-y-1">
              <div class="flex items-start gap-2">
                <span class="text-green-600">●</span>
                <span>{{ ticket.startAddress }}</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-red-600">●</span>
                <span>{{ ticket.endAddress }}</span>
              </div>
              <p class="text-sm text-gray-800 mt-1">
                Departure:
                {{ formatDeparture(ticket.startTime) }}
              </p>
            </div>
          </div>

          <div class="text-right min-w-[120px]">
            <p v-if="ticket.rideDistanceKm" class="text-xs text-gray-500">
              {{ ticket.rideDistanceKm.toFixed(2) }} km
            </p>
            <p class="text-xs text-gray-400 mt-2">
              Booked at
              {{ new Date(ticket.createdAt).toLocaleString() }}
            </p>
          </div>
        </div>

        <p class="mt-3 text-xs text-gray-500">
          Show this confirmation code to the driver to verify your ride.
        </p>
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
