<template>
    <div
        class="flex min-h-full max-w-md w-full border border-slate-100 rounded-2xl flex-col justify-center px-6 py-12 lg:px-8 bg-white shadow-2xl">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-slate-900">
                {{ t("prof.title") }}
            </h2>
        </div>
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form @submit.prevent="submitForm" class="space-y-6">
                <div>
                    <label for="realName" class="form-label">{{
                        t("prof.fullName")
                        }}</label>
                    <div class="mt-2">
                        <input v-model="localUserData.realName" id="realName" type="text" name="realName"
                            class="form-input" />
                    </div>
                </div>

                <div>
                    <label for="username" class="form-label">{{
                        t("prof.username")
                        }}</label>
                    <div class="mt-2">
                        <input v-model="localUserData.username" id="username" type="text" name="username"
                            class="form-input" />
                    </div>
                </div>

                <div>
                    <label for="phoneNumber" class="form-label">{{
                        t("prof.phoneNumber")
                        }}</label>
                    <div class="mt-2">
                        <input v-model="localUserData.phoneNumber" id="phoneNumber" type="tel" name="phoneNumber"
                            autocomplete="tel" class="form-input" />
                    </div>
                </div>

                <div>
                    <label for="email" class="form-label">{{
                        t("prof.emailAddress")
                        }}</label>
                    <div class="mt-2">
                        <input v-model="localUserData.email" id="email" type="email" name="email" autocomplete="email"
                            class="form-input" />
                    </div>
                </div>

                <!-- Vehicle Info Section -->
                <div class="border-t border-gray-200 pt-6 mt-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">
                        {{ t("prof.vehicleInfo") }}
                    </h3>

                    <!-- show vehicle fields only if verified and vehicle is set up -->
                    <template v-if="canEditVehicle">
                        <div class="space-y-4">
                            <div>
                                <label for="vehicleMake" class="form-label">{{
                                    t("prof.vehicleMake")
                                    }}</label>
                                <div class="mt-2">
                                    <input v-model="localUserData.vehicleMake" id="vehicleMake" type="text"
                                        name="vehicleMake" class="form-input" />
                                </div>
                            </div>

                            <div>
                                <label for="vehicleModel" class="form-label">{{
                                    t("prof.vehicleModel")
                                    }}</label>
                                <div class="mt-2">
                                    <input v-model="localUserData.vehicleModel" id="vehicleModel" type="text"
                                        name="vehicleModel" class="form-input" />
                                </div>
                            </div>

                            <div>
                                <label for="vehicleYear" class="form-label">{{
                                    t("prof.vehicleYear")
                                    }}</label>
                                <div class="mt-2">
                                    <input v-model="localUserData.vehicleYear" id="vehicleYear" type="number"
                                        name="vehicleYear" class="form-input" />
                                </div>
                            </div>

                            <div>
                                <label for="vehicleSeats" class="form-label">{{
                                    t("prof.vehicleSeats")
                                    }}</label>
                                <div class="mt-2">
                                    <input v-model="localUserData.vehicleSeats" id="vehicleSeats" type="number"
                                        name="vehicleSeats" class="form-input" />
                                </div>
                            </div>

                            <div>
                                <label for="vehicleColor" class="form-label">{{
                                    t("prof.vehicleColor")
                                    }}</label>
                                <div class="mt-2">
                                    <input v-model="localUserData.vehicleColor" id="vehicleColor" type="text"
                                        name="vehicleColor" class="form-input" />
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- show setup prompt if not verified or vehicle not set up -->
                    <template v-else>
                        <div class="bg-gray-50 rounded-lg p-4 text-center">
                            <p class="text-gray-600 mb-4" v-if="!isVerified">
                                {{ t("prof.verifyLicenseMessage") }}
                            </p>
                            <p class="text-gray-600 mb-4" v-else>
                                {{ t("prof.completeVehicleSetupMessage") }}
                            </p>
                            <button type="button" @click="goToDriverSetup"
                                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                {{
                                    isVerified
                                        ? t("prof.setupVehicle")
                                        : t("prof.verifyLicenseAndSetupVehicle")
                                }}
                            </button>
                        </div>
                    </template>
                </div>

                <div>
                    <button type="submit" class="btn-primary">
                        {{ t("prof.updateButton") }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useIdentityStore } from "../stores/identityStore";
import { showToast } from "../utils/BaseToast";

const { t } = useI18n();

const router = useRouter();
const identityStore = useIdentityStore();
const {
    id,
    realName,
    username,
    email,
    phoneNumber,
    vehicleModel,
    vehicleMake,
    vehicleYear,
    vehicleSeats,
    vehicleColor,
    isVerified,
} = storeToRefs(identityStore);

// checking if the user can edit vehicle info (verified AND has completed vehicle setup)
const canEditVehicle = computed(() => {
    return (
        isVerified.value &&
        vehicleModel.value &&
        vehicleMake.value &&
        vehicleYear.value &&
        vehicleSeats.value &&
        vehicleColor.value
    );
});

const goToDriverSetup = () => {
    router.push("/driver-setup");
};
const localUserData = ref({
    id: "",
    realName: "",
    username: "",
    email: "",
    phoneNumber: "",
    vehicleModel: "",
    vehicleMake: "",
    vehicleYear: "",
    vehicleSeats: "",
    vehicleColor: "",
});
onMounted(async () => {
    refreshUserData();
});

const submitForm = async () => {
    try {
        const response = await identityStore.postIdentity(localUserData.value);

        if (response.status != 200) throw new Error(t("update_failed"));

        console.log(response);
        localStorage.setItem("token", response.data.token);
        refreshUserData();
    } catch (err) {
        console.error(err);
        showToast(t("update_error"), "error");
    }
};

async function refreshUserData() {
    await identityStore.getIdentity();
    localUserData.value.id = id.value;
    localUserData.value.realName = realName.value;
    localUserData.value.username = username.value;
    localUserData.value.email = email.value;
    localUserData.value.phoneNumber = phoneNumber.value;
    localUserData.value.vehicleModel = vehicleModel.value;
    localUserData.value.vehicleMake = vehicleMake.value;
    localUserData.value.vehicleYear = vehicleYear.value;
    localUserData.value.vehicleSeats = vehicleSeats.value;
    localUserData.value.vehicleColor = vehicleColor.value;
}
</script>
