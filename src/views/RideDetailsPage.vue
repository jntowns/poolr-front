<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {{ t("backToSearch") }}
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6">
        <RideSearchResults
          :rides="nearbyRides"
          :selected-ride-id="selectedRide?.rideId"
          @select="selectRide"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useMapStore } from "../stores/mapStore";
import { useAddressStore } from "../stores/addressStore";
import RideSearchResults from "../components/RideSearchResults.vue";
import { showToast } from "../utils/BaseToast";

import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();
const mapStore = useMapStore();
const addressStore = useAddressStore();

const nearbyRides = computed(() => mapStore.nearbyRides);
const selectedRide = computed(() => mapStore.selectedRide);
const origin = computed(() => addressStore.origin);
const destination = computed(() => addressStore.destination);

const selectRide = async (ride) => {
  if (!origin.value || !destination.value) {
    showToast(t("setPickupAndDestination"), "error");
    return;
  }
  mapStore.setSelectedRide(ride, origin.value, destination.value);
  showToast(t("routeCalculated"), "success");
  router.push({ name: "transaction" });
};

const goBack = () => {
  mapStore.clearPoints();
  router.push("/find-ride");
};
</script>
