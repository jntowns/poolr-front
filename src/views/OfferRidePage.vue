<template>
  <div class="max-w-2xl mx-auto my-8 px-4">
    <div v-if="isLoading" class="bg-white rounded-lg p-8 shadow-md text-center">
      <div
        class="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
      ></div>
      <p class="text-gray-600">{{ t("offer.loading") }}</p>
    </div>
    <transition v-else name="fade" mode="out-in">
      <div
        v-if="!isLoggedIn"
        class="bg-white rounded-lg p-8 shadow-md text-center"
      >
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">
          {{ t("offer.startHeader") }}
        </h2>
        <p class="mb-6 text-gray-600">
          {{ t("offer.startMessage") }}
        </p>
        <button
          @click="goToLogin"
          class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          {{ t("offer.loginButton") }}
        </button>
      </div>

      <!-- not verified -->
      <div
        v-else-if="!isVerified"
        class="bg-white rounded-lg p-8 shadow-md text-center"
      >
        <!-- Maybe this should just redirect but this seems okay for now -->
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">
          {{ t("offer.notVerifiedHeader") }}
        </h2>
        <p class="mb-6 text-gray-600">
          {{ t("offer.notVerifiedMessage") }}
        </p>
        <p class="mb-6 text-gray-600">
          {{ t("offer.notVerifiedInstructions") }}
        </p>
        <button
          @click="goToVerify"
          class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          {{ t("offer.submitLicenseButton") }}
        </button>
      </div>

      <!-- Verified but no vehicle -->
      <div
        v-else-if="isVerified && !isVehicleSetup"
        class="bg-white rounded-lg p-8 shadow-md text-center"
      >
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">
          {{ t("offer.completeVehicleHeader") }}
        </h2>
        <p class="mb-6 text-gray-600">
          {{ t("offer.completeVehicleMessage") }}
        </p>
        <button
          @click="goToVerify"
          class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          {{ t("offer.setupVehicleButton") }}
        </button>
      </div>

      <!-- Verified and vehicle setup -->
      <div
        v-else-if="isVerified && isVehicleSetup"
        class="bg-white rounded-lg p-8 shadow-md"
      >
        <h2 class="text-3xl font-semibold mb-6 text-gray-800 text-center">
          {{ t("offer.offerRideHeader") }}
        </h2>

        <div class="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 class="text-xl font-medium mb-4 text-gray-700">
            {{ t("offer.createRideHeader") }}
          </h3>
          <div class="space-y-4" :key="refreshKey">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t("offer.startingLocationLabel")
              }}</label>
              <AddressSearchBar
                placeholder="Where are you driving from?"
                @select="handleStartSelect"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t("offer.destinationLabel")
              }}</label>
              <AddressSearchBar
                placeholder="Where are you heading?"
                @select="handleEndSelect"
                :userLocation="startLocationForSearch"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{
                  t("offer.departureTimeLabel")
                }}</label>
                <input
                  v-model="departureTime"
                  type="datetime-local"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t("offer.fareLabel") }}</label
                >
                <input
                  v-model="fare"
                  type="number"
                  min="0"
                  step="0.50"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              @click="createRide"
              :disabled="!isValidRide || isCreating"
              class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
            >
              <span v-if="isCreating" class="animate-spin mr-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              {{
                isCreating
                  ? t("offer.creatingRide")
                  : t("offer.createRideButton")
              }}
            </button>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-medium mb-4 text-gray-700">
            {{ t("offer.upcomingRidesHeader") }}
          </h3>
          <div
            v-if="myRides.length === 0"
            class="text-center text-gray-500 py-8 bg-gray-50 rounded-lg"
          >
            <svg
              class="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>{{ t("offer.noUpcomingRides") }}</p>
            <p class="text-sm mt-1">{{ t("offer.createRideHint") }}</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="ride in myRides"
              :key="ride.id"
              class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200"
            >
              <!-- Header with time countdown and status -->
              <div class="flex justify-between items-start mb-4">
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <span class="text-lg font-semibold text-gray-900">{{
                      formatDate(ride.startTime)
                    }}</span>
                    <span
                      class="px-2.5 py-1 text-xs font-medium rounded-full"
                      :class="{
                        'bg-green-100 text-green-700':
                          ride.status === 'SCHEDULED',
                        'bg-blue-100 text-blue-700':
                          ride.status === 'IN_PROGRESS',
                        'bg-gray-100 text-gray-600':
                          ride.status === 'COMPLETED',
                        'bg-red-100 text-red-700': ride.status === 'CANCELLED',
                      }"
                    >
                      {{ formatStatus(ride.status) }}
                    </span>
                  </div>
                  <!-- Time until departure -->
                  <div
                    class="flex items-center text-sm"
                    :class="getTimeUntilClass(ride.startTime)"
                  >
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {{ getTimeUntil(ride.startTime) }}
                  </div>
                </div>

                <!-- Seats info -->
                <div class="text-right">
                  <div class="flex items-center justify-end text-gray-600">
                    <svg
                      class="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span class="text-sm font-medium"
                      >{{
                        formatCount(
                          identityStore.vehicleSeats - 1,
                          t("offer.seatsAvailable")
                        )
                      }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Route visualization -->
              <div class="relative pl-6 space-y-3">
                <!-- Vertical line connecting dots -->
                <div
                  class="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-green-400 to-red-400"
                ></div>

                <!-- Start location -->
                <div class="flex items-start">
                  <div
                    class="absolute left-0 mt-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"
                  ></div>
                  <div class="ml-4">
                    <span
                      class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                      >{{ t("offer.fromLabel") }}</span
                    >
                    <p class="text-gray-800 font-medium">
                      {{ ride.startAddress }}
                    </p>
                  </div>
                </div>

                <!-- End location -->
                <div class="flex items-start">
                  <div
                    class="absolute left-0 mt-1.5 w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"
                  ></div>
                  <div class="ml-4">
                    <span
                      class="text-xs font-medium text-gray-500 uppercase tracking-wide"
                      >{{ t("offer.toLabel") }}</span
                    >
                    <p class="text-gray-800 font-medium">
                      {{ ride.endAddress }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Footer with ride ID -->
              <div
                class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center"
              >
                <span class="text-xs text-gray-400"
                  >{{ t("offer.rideIdLabel") }}{{ ride.id }}</span
                >
                <!-- TODO: Add action buttons here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useIdentityStore } from "../stores/identityStore";
import AddressSearchBar from "../components/AddressSearchBar.vue";
import apiClient from "../utils/apiClient";
import {
  formatDate,
  formatStatus,
  getTimeUntil,
  getTimeUntilClass,
  formatCount,
} from "../utils/dateUtils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const router = useRouter();
const identityStore = useIdentityStore();

const isVerified = ref(false);
const isVehicleSetup = ref(false);
const isLoading = ref(true);
const isCreating = ref(false);

const myRides = ref([]);
const startLocation = ref(null);
const endLocation = ref(null);
const departureTime = ref("");
const fare = ref(5.0);

const isLoggedIn = computed(() => !!identityStore.id);
const isValidRide = computed(
  () =>
    startLocation.value &&
    endLocation.value &&
    departureTime.value &&
    fare.value > 0
);
const startLocationForSearch = computed(() => {
  if (startLocation.value) {
    return {
      latitude: startLocation.value.latitude,
      longitude: startLocation.value.longitude,
    };
  }
  return null;
});

onMounted(async () => {
  await identityStore.getIdentity();
  if (identityStore.isVerified) {
    isVerified.value = true;
  }
  if (
    identityStore.vehicleModel &&
    identityStore.vehicleMake &&
    identityStore.vehicleYear &&
    identityStore.vehicleSeats &&
    identityStore.vehicleColor
  ) {
    isVehicleSetup.value = true;
    await fetchMyRides();
  }
  isLoading.value = false;
});

const fetchMyRides = async () => {
  try {
    const response = await apiClient.get("/api/rides/driver");
    myRides.value = response.data.sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );
  } catch (error) {
    console.error("Failed to fetch rides", error);
  }
};

const handleStartSelect = (address) => {
  startLocation.value = address;
};

const handleEndSelect = (address) => {
  endLocation.value = address;
};

const formatAddress = (location) => {
  // For POIs: use name + street + city, for addresses: use street + city or description
  if (location.type === "poi") {
    const parts = [location.name];
    if (location.street) parts.push(location.street);
    if (location.city) parts.push(location.city);
    return parts.join(", ");
  } else {
    // For addresses, street + city or fall back to name
    const parts = [];
    if (location.street) parts.push(location.street);
    if (location.city) parts.push(location.city);
    return parts.length > 0 ? parts.join(", ") : location.name;
  }
};

const createRide = async () => {
  if (!isValidRide.value) return;

  isCreating.value = true;
  try {
    const rideData = {
      driverId: identityStore.id,
      startLatitude: startLocation.value.latitude,
      startLongitude: startLocation.value.longitude,
      startAddress: formatAddress(startLocation.value),
      endLatitude: endLocation.value.latitude,
      endLongitude: endLocation.value.longitude,
      endAddress: formatAddress(endLocation.value),
      poiCategory: "commute",
      fare: parseFloat(fare.value),
      startTime: new Date(departureTime.value).toISOString(),
    };

    await apiClient.post("/api/rides", rideData);
    await fetchMyRides();

    startLocation.value = null;
    endLocation.value = null;
    departureTime.value = "";

    // forcing a refresh of the form
    refreshKey.value++;
  } catch (error) {
    console.error("Failed to create ride", error);
    alert("Failed to create ride. Please try again.");
  } finally {
    isCreating.value = false;
  }
};

const refreshKey = ref(0);

const goToLogin = () => {
  router.push("/login");
};

const goToVerify = () => {
  router.push("/driver-setup");
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scanning-container {
  position: relative;
  overflow: hidden;
}

.scanning-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 0, 0.9),
    transparent
  );
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.4);
  animation: scan 1.2s ease-in-out infinite;
  z-index: 1;
}

@keyframes scan {
  0% {
    top: 0;
    opacity: 0;
    transform: scaleY(0.5);
  }

  10% {
    opacity: 1;
    transform: scaleY(1);
  }

  90% {
    opacity: 1;
    transform: scaleY(1);
  }

  100% {
    top: 100%;
    opacity: 0;
    transform: scaleY(0.5);
  }
}
</style>
