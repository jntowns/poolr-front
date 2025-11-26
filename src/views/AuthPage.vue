<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthCard from '../components/auth/AuthCard.vue'
import AuthTabs from '../components/auth/AuthTabs.vue'
import AuthInput from '../components/auth/AuthInput.vue'
import { useAuth } from '../composables/useAuth.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const tabs = computed(() => [
    { label: t('login'), value: 'login' },
    { label: t('signUp'), value: 'register' }
])

const activeTab = ref('login')

const {
    loginForm,
    registerForm,
    login,
    register,
    createDemoAccount
} = useAuth()

const email = computed({
    get: () => activeTab.value === 'login' ? loginForm.email : registerForm.email,
    set: (val) => {
        if (activeTab.value === 'login') {
            loginForm.email = val
        } else {
            registerForm.email = val
        }
    }
})

const password = computed({
    get: () => activeTab.value === 'login' ? loginForm.password : registerForm.password,
    set: (val) => {
        if (activeTab.value === 'login') {
            loginForm.password = val
        } else {
            registerForm.password = val
        }
    }
})

// syncing tab with route
onMounted(() => {
    if (route.name === 'register') {
        activeTab.value = 'register'
    }
})

// updating url when tab changes
watch(activeTab, (newTab) => {
    if (newTab === 'register' && route.name !== 'register') {
        router.replace({ name: 'register' })
    } else if (newTab === 'login' && route.name !== 'login') {
        router.replace({ name: 'login' })
    }
})

// watching for route changes (e.g., browser back/forward)
watch(() => route.name, (newRoute) => {
    if (newRoute === 'register') {
        activeTab.value = 'register'
    } else if (newRoute === 'login') {
        activeTab.value = 'login'
    }
})

const handleSubmit = async () => {
    if (activeTab.value === 'login') {
        await login()
    } else {
        await register()
    }
}

const cardTitle = computed(() =>
    activeTab.value === 'login' ? t('loginTitle') : t('signUpWithPoolr')
)
</script>

<template>
    <div class="flex-grow flex flex-col justify-center items-center bg-slate-50 py-12 sm:px-6 lg:px-8">
        <AuthCard :title="cardTitle">
            <AuthTabs v-model="activeTab" :tabs="tabs" />

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- showing register-only fields -->
                <template v-if="activeTab === 'register'">
                    <AuthInput id="realName" v-model="registerForm.realName" :label="t('fullName')" type="text"
                        autocomplete="name" required />

                    <AuthInput id="username" v-model="registerForm.username" :label="t('username')" type="text"
                        autocomplete="username" required />

                    <AuthInput id="phoneNumber" v-model="registerForm.phoneNumber" :label="t('phoneNumber')" type="tel"
                        autocomplete="tel" required />
                </template>

                <!-- rendering shared fields -->
                <AuthInput id="email" v-model="email" :label="t('emailAddress')" type="email" autocomplete="email"
                    required />

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="form-label">{{ t('password') }}</label>
                        <div v-if="activeTab === 'login'" class="text-sm">
                            <a href="#" class="font-semibold text-electric-blue hover:text-blue-600">
                                {{ t('forgotPassword') }}
                            </a>
                        </div>
                    </div>
                    <div class="mt-2">
                        <input id="password" v-model="password" type="password" name="password" required
                            autocomplete="current-password" class="form-input" />
                    </div>
                </div>

                <div>
                    <button type="submit" class="btn-primary">
                        {{ activeTab === 'login' ? t('loginButton') : t('signUp') }}
                    </button>
                </div>
            </form>

            <!-- rendering demo account section -->
            <div class="mt-6 text-center">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-slate-200"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-slate-500">{{ t('demo.tryItOut') }}</span>
                    </div>
                </div>

                <div class="mt-6">
                    <button @click="createDemoAccount" type="button"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {{ t('demo.createDemoAccount') }}
                    </button>
                    <p class="mt-2 text-xs text-slate-400">
                        {{ t('demo.demoDisclaimer') }}
                    </p>
                </div>
            </div>
        </AuthCard>
    </div>
</template>
