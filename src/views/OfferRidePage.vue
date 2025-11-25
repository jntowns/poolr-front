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

            <!-- not verified -->
            <div v-else-if="!isVerified" class="bg-white rounded-lg p-8 shadow-md text-center">
                <!-- Maybe this should just redirect but this seems okay for now -->
                <h2 class="text-2xl font-semibold mb-4 text-gray-800">Start Offering Rides</h2>
                <p class="mb-6 text-gray-600">Looking to help others in their commute?</p>
                <p class="mb-6 text-gray-600">To register as a driver with our service, you will need to provide a valid
                    driver's license for the area you will be driving in. Any images you upload will be removed from our
                    servers after verification is complete.
                </p>
                <button @click="goToVerify"
                    class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors">
                    Submit your License
                </button>
            </div>

            <!-- Verified -->
            <div v-else-if="isVerified" class="bg-white rounded-lg p-8 shadow-md text-center">
                <h2 class="text-3xl font-semibold mb-4 text-gray-600">Your Rides</h2>

            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIdentityStore } from '../stores/identityStore'

const router = useRouter()
const identityStore = useIdentityStore()

const isVerified = ref(false)
const isLoading = ref(true)

const isLoggedIn = computed(() => !!identityStore.id)

onMounted(async () => {
    await identityStore.getIdentity()
    if (identityStore.isVerified) {
        isVerified.value = true
    }
    isLoading.value = false
})

const goToLogin = () => {
    router.push('/login')
}

const goToVerify = () => {
    router.push('/verify-license')
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
