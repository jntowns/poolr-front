<template>
    <div class="max-w-2xl mx-auto my-8 px-4">
        <div v-if="isLoading" class="bg-white rounded-lg p-8 shadow-md text-center">
            <div class="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin">
            </div>
            <p class="text-gray-600">Loading...</p>
        </div>
        <transition v-else name="fade" mode="out-in">
            <div v-if="!isLoggedIn" class="bg-white rounded-lg p-8 shadow-md text-center">
                <h2 class="text-2xl font-semibold mb-4 text-gray-800">Start Offering Rides</h2>
                <p class="mb-6 text-gray-600">Please create an account or log in to start offering rides to other users.
                </p>
                <button @click="goToLogin"
                    class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors">
                    Create Account / Log In
                </button>
            </div>

            <!-- logged in but not verified -->
            <div v-else-if="!isVerified && !isVerifying" class="bg-white rounded-lg p-8 shadow-md text-center">
                <h2 class="text-2xl font-semibold mb-4 text-gray-800">Verify Your Driver's License</h2>
                <p class="mb-6 text-gray-600">To offer rides, please upload a photo of your driver's license for
                    verification.</p>

                <form @submit.prevent="handleUpload">
                    <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                        <p class="mb-2 text-sm text-gray-600">For demo purposes, you can use our sample license:</p>
                        <button type="button" @click="useDemoLicense"
                            class="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
                            Use Demo License
                        </button>
                    </div>

                    <div class="relative my-6 text-gray-500 font-semibold">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center">
                            <span class="bg-white px-4">OR</span>
                        </div>
                    </div>

                    <div class="mb-6">
                        <input type="file" id="license-upload" ref="fileInput"
                            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp" @change="handleFileSelect"
                            class="hidden" />
                        <label for="license-upload"
                            class="block p-8 border-2 border-dashed border-blue-600 rounded-lg cursor-pointer text-blue-600 hover:bg-blue-50 transition-colors">
                            <span v-if="!selectedFile && !previewUrl">Click to upload your license image</span>
                            <span v-else-if="selectedFile && !isDemoLicense">{{ selectedFile.name }}</span>
                            <span v-else>Demo License Selected</span>
                        </label>
                    </div>

                    <div v-if="previewUrl" class="my-6 p-4 bg-gray-50 rounded-lg">
                        <img :src="previewUrl" alt="License preview"
                            class="max-w-full max-h-72 mx-auto rounded shadow-sm" />
                    </div>

                    <button type="submit" :disabled="!selectedFile && !previewUrl"
                        class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Submit for Verification
                    </button>
                </form>
            </div>

            <!-- Verifying -->
            <div v-else-if="isVerifying" class="bg-white rounded-lg p-12 shadow-md text-center">
                <div v-if="previewUrl" class="mb-6 p-4 bg-gray-50 rounded-lg scanning-container">
                    <img :src="previewUrl" alt="License preview"
                        class="max-w-full max-h-72 mx-auto rounded shadow-sm" />
                </div>
                <div
                    class="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin">
                </div>
                <h2 class="text-2xl font-semibold mb-4 text-gray-800">Verifying Your License...</h2>
                <p class="text-gray-600">Please wait while we verify your driver's license. This can take a few moments.
                </p>
            </div>

            <!-- Verified -->
            <div v-else-if="isVerified" class="bg-white rounded-lg p-8 shadow-md text-center">
                <h2 class="text-3xl font-semibold mb-4 text-green-600">✓ Verified Driver</h2>
                <button @click="goToOfferRide"
                    class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors">
                    Start offering rides!
                </button>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useIdentityStore } from '../stores/identityStore'
import { showToast } from '../utils/BaseToast'
import demoLicenseImg from '../assets/images/license.jpg'

const identityStore = useIdentityStore()

const { id, realName, username, email, phoneNumber, vehicleModel } = storeToRefs(identityStore)
const localUserData = ref({
    id: "",
    realName: "",
    username: "",
    email: "",
    phoneNumber: "",
    vehicleModel: ""
})
const router = useRouter()


const selectedFile = ref(null)
const isVerifying = ref(false)
const isVerified = ref(false)
const previewUrl = ref(null)
const isDemoLicense = ref(false)
const isLoading = ref(true)

const isLoggedIn = computed(() => !!identityStore.id)

onMounted(async () => {
    await identityStore.getIdentity()
    const verified = localStorage.getItem('verified')
    if (verified === 'true') {
        isVerified.value = true
    }
    isLoading.value = false
})

const goToLogin = () => {
    router.push('/login')
}

const goToOfferRide = () => {
    router.push('/offer-ride')
}

const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedFile.value = file
        isDemoLicense.value = false

        if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value)
        }
        previewUrl.value = URL.createObjectURL(file)
    }
}

const useDemoLicense = () => {
    isDemoLicense.value = true
    selectedFile.value = { name: 'demo-license.png' }
    previewUrl.value = demoLicenseImg
    showToast('Demo license selected', 'info')
}

const handleUpload = async () => {
    if (!selectedFile.value && !previewUrl.value) return

    isVerifying.value = true

    // random delay between 5-10 seconds
    const delay = Math.floor(Math.random() * 5000) + 5000

    setTimeout(() => {
        localStorage.setItem('verified', 'true')
        isVerified.value = true
        isVerifying.value = false
        showToast('Driver\'s license verified successfully!', 'success')

        if (previewUrl.value && !isDemoLicense.value) {
            URL.revokeObjectURL(previewUrl.value)
        }
    }, delay)
}
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
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 0, 0.9), transparent);
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
