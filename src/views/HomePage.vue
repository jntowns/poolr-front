<template>
  <div
    class="min-h-screen bg-white text-slate-900 font-sans selection:bg-electric-blue selection:text-white"
  >
    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-6 pt-12 lg:pt-24 pb-20">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div class="space-y-8">
          <h1
            class="text-A5xl lg:text-7xl font-bold tracking-tight leading-tight text-slate-900"
          >
            {{ t("heroTitle1") }} <br />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-soft-teal"
              >{{ t("heroTitle2") }}</span
            >
          </h1>

          <p class="text-lg lg:text-xl text-slate-500 max-w-lg leading-relaxed">
            {{ t("heroSubtitle") }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              @click="$router.push('/find-ride')"
              class="bg-slate-900 text-white hover:bg-slate-800 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
            >
              {{ t("findRide") }}
            </button>
            <button
              @click="$router.push('/offer-ride')"
              class="bg-white text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-8 py-4 rounded-xl font-semibold transition-all duration-200 w-full sm:w-auto"
            >
              {{ t("offerRide") }}
            </button>
          </div>

          <!-- Stats -->
          <div class="pt-8 border-t border-slate-100 mt-8">
            <div class="flex items-baseline gap-3">
              <span
                class="text-4xl lg:text-5xl font-bold tracking-tighter tabular-nums text-slate-900"
              >
                {{ displayCount.toLocaleString() }}
              </span>
              <span class="text-slate-500 font-medium">{{
                t("activeRidesLabel")
              }}</span>
            </div>
          </div>
        </div>

        <div class="relative hidden lg:block">
          <div
            class="absolute -inset-4 bg-gradient-to-r from-blue-100 to-teal-100 rounded-[2rem] blur-3xl opacity-30"
          ></div>
          <div
            class="relative bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-2xl"
          >
            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl"
                  >
                    🚗
                  </div>
                  <div>
                    <div
                      class="h-2.5 w-24 bg-slate-200 rounded-full mb-2"
                    ></div>
                    <div class="h-2 w-16 bg-slate-100 rounded-full"></div>
                  </div>
                </div>
                <div class="h-8 w-20 bg-slate-900 rounded-lg"></div>
              </div>
              <div
                class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 opacity-60"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-xl"
                  >
                    📍
                  </div>
                  <div>
                    <div
                      class="h-2.5 w-32 bg-slate-200 rounded-full mb-2"
                    ></div>
                    <div class="h-2 w-20 bg-slate-100 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div
                class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 opacity-30"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl"
                  >
                    👋
                  </div>
                  <div>
                    <div
                      class="h-2.5 w-28 bg-slate-200 rounded-full mb-2"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-slate-50 py-24">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="relative hidden lg:block">
            <div
              class="absolute -inset-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-[2rem] blur-3xl opacity-30"
            ></div>
            <div
              class="relative bg-white rounded-[2rem] p-8 border border-slate-100 shadow-2xl"
            >
              <div class="space-y-6">
                <div
                  class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl"
                    >
                      💰
                    </div>
                    <div>
                      <div class="font-semibold text-slate-900">
                        {{ t("monthlySavings") }}
                      </div>
                      <div class="text-sm text-slate-500">
                        {{ t("fuelMaintenance") }}
                      </div>
                    </div>
                  </div>
                  <div class="text-green-600 font-bold text-lg">+$450</div>
                </div>

                <div
                  class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 opacity-80"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl"
                    >
                      🌱
                    </div>
                    <div>
                      <div class="font-semibold text-slate-900">
                        {{ t("co2Saved") }}
                      </div>
                      <div class="text-sm text-slate-500">
                        {{ t("environmentalImpact") }}
                      </div>
                    </div>
                  </div>
                  <div class="text-blue-600 font-bold text-lg">120kg</div>
                </div>

                <div
                  class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 opacity-60"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl"
                    >
                      🤝
                    </div>
                    <div>
                      <div class="font-semibold text-slate-900">
                        {{ t("newConnections") }}
                      </div>
                      <div class="text-sm text-slate-500">
                        {{ t("communityGrowth") }}
                      </div>
                    </div>
                  </div>
                  <div class="text-purple-600 font-bold text-lg">15+</div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-8">
            <h2
              class="text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-slate-900"
            >
              {{ t("becomeDriverTitle1") }} <br />
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-soft-teal"
                >{{ t("becomeDriverTitle2") }}</span
              >
            </h2>
            <p class="text-lg text-slate-500 max-w-lg leading-relaxed">
              {{ t("driverDescription") }}
            </p>
            <div class="pt-4">
              <button
                @click="$router.push('/offer-ride')"
                class="bg-slate-900 text-white hover:bg-slate-800 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
              >
                {{ t("startDrivingToday") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import apiClient from "../utils/apiClient";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const rideCount = ref(0);
const displayCount = ref(0);
let pollingInterval = null;

const fetchRideCount = async () => {
  try {
    const response = await apiClient.get("/api/demo/rides/count");
    rideCount.value = response.data;
  } catch (error) {
    console.error("Failed to fetch ride count:", error);
  }
};

// simple animation function to animate the count up
const animateCount = () => {
  const duration = 2000;
  const start = displayCount.value;
  const end = rideCount.value;

  if (start === end) return;

  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // slows down the animation towards the end
    const ease = 1 - Math.pow(1 - progress, 4);

    displayCount.value = Math.floor(start + (end - start) * ease);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

watch(rideCount, () => {
  animateCount();
});

// we get the ride count and set up polling every 10 seconds
onMounted(() => {
  fetchRideCount();
  pollingInterval = setInterval(fetchRideCount, 10000);
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>
