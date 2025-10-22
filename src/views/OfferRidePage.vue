<template>
    <div class="max-w-2xl mx-auto my-8 px-4">
        <!-- shows when a user is not logged in -->
        <div v-if="!isLoggedIn" class="bg-white rounded-lg p-8 shadow-md text-center">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800">Start Offering Rides</h2>
            <p class="mb-6 text-gray-600">Please create an account or log in to start offering rides to other users.</p>
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
            <div class="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin">
            </div>
            <h2 class="text-2xl font-semibold mb-4 text-gray-800">Verifying Your License...</h2>
            <p class="text-gray-600">Please wait while we verify your driver's license. This can take a few moments.</p>
        </div>

        <!-- Verified -->
        <div v-else-if="isVerified" class="bg-white rounded-lg p-8 shadow-md text-center">
            <h2 class="text-3xl font-semibold mb-4 text-green-600">✓ Verified Driver</h2>
            <p class="text-gray-600">Driving page coming soon</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIdentityStore } from '../stores/identityStore'
import { showToast } from '../utils/BaseToast'
import demoLicenseImg from '../assets/images/license.jpg'

const router = useRouter()
const identityStore = useIdentityStore()

const selectedFile = ref(null)
const isVerifying = ref(false)
const isVerified = ref(false)
const previewUrl = ref(null)
const isDemoLicense = ref(false)

const isLoggedIn = computed(() => !!identityStore.id)

onMounted(() => {
    const verified = localStorage.getItem('verified')
    if (verified === 'true') {
        isVerified.value = true
    }
})

const goToLogin = () => {
    router.push('/login')
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
