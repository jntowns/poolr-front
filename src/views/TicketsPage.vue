<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">{{ t("tickets.title") }}</h1>

    <div v-if="ticketStore.loading" class="text-gray-500 py-4">
      {{ t("tickets.loading") }}
    </div>

    <div v-else-if="tickets.length === 0" class="text-gray-500 py-4">
      {{ t("tickets.empty") }}
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
              {{ t("tickets.ticketNumber", { id: ticket.ticketId }) }}
            </p>
            <p class="text-sm">
              {{ t("tickets.confirmationCode") }}:
              <span
                class="font-mono font-semibold tracking-widest text-blue-700"
              >
                {{ ticket.confirmationCode }}
              </span>
            </p>

            <p class="mt-3 text-sm text-gray-600">
              {{ t("tickets.driver") }}:
              <span class="font-medium text-gray-800">{{
                ticket.driverName
              }}</span>
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
                {{ t("tickets.departure") }}:
                {{ formatDeparture(ticket.startTime) }}
              </p>
            </div>
          </div>

          <div class="text-right min-w-[120px]">
            <p v-if="ticket.rideDistanceKm" class="text-xs text-gray-500">
              {{ ticket.rideDistanceKm.toFixed(2) }} km
            </p>
            <p class="text-xs text-gray-400 mt-2">
              {{ t("tickets.bookedAt") }}
              {{ new Date(ticket.createdAt).toLocaleString() }}
            </p>
          </div>
        </div>

        <p class="mt-3 text-xs text-gray-500">
          {{ t("tickets.showToDriver") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTicketStore } from "../stores/ticketStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const ticketStore = useTicketStore();
const { tickets } = storeToRefs(ticketStore);

onMounted(() => {
  ticketStore.fetchMyTickets();
});

const formatDeparture = (startTime) => {
  if (!startTime) return "Unknown";
  const d = new Date(startTime);
  return d.toLocaleString([], {
    hour: "numeric",
    minute: "2-digit",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
