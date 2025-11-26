<template>
  <div class="max-w-2xl mx-auto my-8 px-4">
    <div v-if="isLoading" class="bg-white rounded-lg p-8 shadow-md text-center">
      <div
        class="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
      ></div>
      <p class="text-gray-600">{{ t("driverSetup.loading") }}</p>
    </div>
    <transition v-else name="fade" mode="out-in">
      <div
        v-if="!isLoggedIn"
        class="bg-white rounded-lg p-8 shadow-md text-center"
      >
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">
          {{ t("driverSetup.startOfferingRidesTitle") }}
        </h2>
        <p class="mb-6 text-gray-600">
          {{ t("driverSetup.startOfferingRidesMessage") }}
        </p>
        <button
          @click="goToLogin"
          class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          {{ t("driverSetup.createAccountLoginButton") }}
        </button>
      </div>

      <!-- logged in but not verified -->
      <div
        v-else-if="!isVerified && !isVerifying"
        class="bg-white rounded-lg p-8 shadow-md text-center"
      >
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">
          {{ t("driverSetup.verifyLicenseTitle") }}
        </h2>
        <p class="mb-6 text-gray-600">
          {{ t("driverSetup.verifyLicenseMessage") }}
        </p>

        <form @submit.prevent="handleUpload">
          <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <p class="mb-2 text-sm text-gray-600">
              {{ t("driverSetup.demoLicenseNote") }}
            </p>
            <button
              type="button"
              @click="useDemoLicense"
              class="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              {{ t("driverSetup.useDemoLicenseButton") }}
            </button>
          </div>

          <div class="relative my-6 text-gray-500 font-semibold">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="bg-white px-4">{{ t("driverSetup.or") }}</span>
            </div>
          </div>

          <div class="mb-6">
            <input
              type="file"
              id="license-upload"
              ref="fileInput"
              accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
              @change="handleFileSelect"
              class="hidden"
            />
            <label
              for="license-upload"
              class="block p-8 border-2 border-dashed border-blue-600 rounded-lg cursor-pointer text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <span v-if="!selectedFile && !previewUrl">{{
                t("driverSetup.clickToUploadLicense")
              }}</span>
              <span v-else-if="selectedFile && !isDemoLicense">{{
                selectedFile.name
              }}</span>
              <span v-else>{{ t("driverSetup.demoLicenseSelected") }}</span>
            </label>
          </div>

          <div v-if="previewUrl" class="my-6 p-4 bg-gray-50 rounded-lg">
            <img
              :src="previewUrl"
              alt="License preview"
              class="max-w-full max-h-72 mx-auto rounded shadow-sm"
            />
          </div>

          <button
            type="submit"
            :disabled="!selectedFile && !previewUrl"
            class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ t("driverSetup.submitForVerification") }}
          </button>
        </form>
      </div>

      <!-- Verifying -->
      <div
        v-else-if="isVerifying"
        class="bg-white rounded-lg p-12 shadow-md text-center"
      >
        <div
          v-if="previewUrl"
          class="mb-6 p-4 bg-gray-50 rounded-lg scanning-container"
        >
          <img
            :src="previewUrl"
            alt="License preview"
            class="max-w-full max-h-72 mx-auto rounded shadow-sm"
          />
        </div>
        <div
          class="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
        ></div>
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">
          {{ t("driverSetup.verifyingLicenseTitle") }}
        </h2>
        <p class="text-gray-600">
          {{ t("driverSetup.verifyingLicenseMessage") }}
        </p>
      </div>

      <!-- Verified -->
      <div
        v-else-if="isVerified"
        class="bg-white rounded-lg p-8 shadow-md text-center"
      >
        <h2 class="text-3xl font-semibold mb-4 text-green-600">
          {{ t("driverSetup.verificationSuccessTitle") }}
        </h2>

        <p class="mb-6 text-gray-600">
          {{ t("driverSetup.enterVehicleDetailsMessage") }}
        </p>

        <div
          class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-sky-900 p-6 rounded-lg"
        >
          <form @submit.prevent="continueToDriverPage" class="space-y-6">
            <div>
              <label
                for="vehicleMake"
                class="block text-sm/6 font-medium text-gray-100"
                >{{ t("driverSetup.vehicleMakeLabel") }}</label
              >
              <div class="mt-2">
                <input
                  required
                  v-model="localValue.vehicleMake"
                  id="vehicleMake"
                  type="text"
                  name="vehicleMake"
                  :placeholder="t('driverSetup.vehicleMakePlaceholder')"
                  class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label
                for="vehicleModel"
                class="block text-sm/6 font-medium text-gray-100"
                >{{ t("driverSetup.vehicleModelLabel") }}</label
              >
              <div class="mt-2">
                <input
                  required
                  v-model="localValue.vehicleModel"
                  id="vehicleModel"
                  type="text"
                  name="vehicleModel"
                  :placeholder="t('driverSetup.vehicleModelPlaceholder')"
                  class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label
                for="vehicleYear"
                class="block text-sm/6 font-medium text-gray-100"
                >{{ t("driverSetup.vehicleYearLabel") }}</label
              >
              <div class="mt-2">
                <input
                  required
                  v-model="localValue.vehicleYear"
                  id="vehicleYear"
                  type="number"
                  name="vehicleYear"
                  :placeholder="t('driverSetup.vehicleYearPlaceholder')"
                  class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label
                for="vehicleSeats"
                class="block text-sm/6 font-medium text-gray-100"
                >{{ t("driverSetup.vehicleSeatsLabel") }}</label
              >
              <div class="mt-2">
                <input
                  required
                  v-model="localValue.vehicleSeats"
                  id="vehicleSeats"
                  type="number"
                  name="vehicleSeats"
                  :placeholder="t('driverSetup.vehicleSeatsPlaceholder')"
                  class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label
                for="vehicleColor"
                class="block text-sm/6 font-medium text-gray-100"
                >{{ t("driverSetup.vehicleColorLabel") }}</label
              >
              <div class="mt-2">
                <input
                  required
                  v-model="localValue.vehicleColor"
                  id="vehicleColor"
                  type="text"
                  name="vehicleColor"
                  :placeholder="t('driverSetup.vehicleColorPlaceholder')"
                  class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {{ t("driverSetup.continueButton") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useIdentityStore } from "../stores/identityStore";
import { showToast } from "../utils/BaseToast";
import demoLicenseImg from "../assets/images/license.jpg";
import apiClient from "../utils/apiClient";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const identityStore = useIdentityStore();
const router = useRouter();

const localValue = reactive({
  vehicleModel: "",
  vehicleMake: "",
  vehicleYear: "",
  vehicleSeats: "",
  vehicleColor: "",
});

const selectedFile = ref(null);
const isVerifying = ref(false);
const isVerified = ref(false);
const previewUrl = ref(null);
const isDemoLicense = ref(false);
const isLoading = ref(true);

const isLoggedIn = computed(() => !!identityStore.id);

onMounted(async () => {
  await identityStore.getIdentity();
  if (identityStore.isVerified) {
    isVerified.value = true;
  }
  isLoading.value = false;
});

const goToLogin = () => {
  router.push("/login");
};

const continueToDriverPage = async () => {
  if (
    !localValue.vehicleModel ||
    !localValue.vehicleMake ||
    !localValue.vehicleYear ||
    !localValue.vehicleSeats ||
    !localValue.vehicleColor
  ) {
    showToast("Please fill in all required fields.", "error");
    return;
  }

  console.log(localValue);

  const updateData = ref({
    id: identityStore.id,
    realName: identityStore.realName,
    username: identityStore.username,
    email: identityStore.email,
    phoneNumber: identityStore.phoneNumber,
    vehicleModel: localValue.vehicleModel,
    vehicleMake: localValue.vehicleMake,
    vehicleYear: localValue.vehicleYear,
    vehicleSeats: localValue.vehicleSeats,
    vehicleColor: localValue.vehicleColor,
  });

  updateData.vehicleModel = localValue.vehicleModel;
  updateData.vehicleMake = localValue.vehicleMake;
  updateData.vehicleYear = localValue.vehicleYear;
  updateData.vehicleSeats = localValue.vehicleSeats;
  updateData.vehicleColor = localValue.vehicleColor;

  console.log(updateData);

  try {
    const response = await identityStore.postIdentity(updateData.value);

    if (response.status != 200)
      throw new Error("Failed to update user information");
    console.log(response);
    localStorage.setItem("token", response.data.token);

    router.push("/offer-ride");
  } catch (err) {
    console.error(err);
    showToast("There was a problem updating user information.", "error");
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    isDemoLicense.value = false;

    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = URL.createObjectURL(file);
  }
};

const useDemoLicense = () => {
  isDemoLicense.value = true;
  selectedFile.value = { name: "demo-license.png" };
  previewUrl.value = demoLicenseImg;
  showToast("Demo license selected", "info");
};

const handleUpload = async () => {
  if (!selectedFile.value && !previewUrl.value) return;

  isVerifying.value = true;

  // random delay between 5-10 seconds
  const delay = Math.floor(Math.random() * 5000) + 5000;

  setTimeout(async () => {
    try {
      await apiClient.post("/api/user/verify");
      await identityStore.getIdentity();

      isVerified.value = true;
      isVerifying.value = false;
      showToast("Driver's license verified successfully!", "success");

      if (previewUrl.value && !isDemoLicense.value) {
        URL.revokeObjectURL(previewUrl.value);
      }
    } catch (error) {
      isVerifying.value = false;
      showToast("Verification failed", "error");
    }
  }, delay);
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
