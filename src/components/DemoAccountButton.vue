<template>
    <div class="mt-6 text-center">
        <div class="relative">
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-slate-500">Or try it out</span>
            </div>
        </div>

        <div class="mt-6">
            <button @click="createDemoAccount" type="button"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create Demo Account
            </button>
            <p class="mt-2 text-xs text-slate-400">
                Demo accounts last for 1 hour. All changes will be reverted afterwards.
            </p>
        </div>
    </div>
</template>

<script setup>
import apiClient from '../utils/apiClient'
import { showToast } from '../utils/BaseToast'
import { useRouter } from 'vue-router'
import { useIdentityStore } from '../stores/identityStore'

const identityStore = useIdentityStore();
const router = useRouter()

const createDemoAccount = async () => {
    try {
        localStorage.removeItem('token')

        const response = await apiClient.post('/api/auth/demo')

        if (response.status != 200) throw new Error('Failed to create demo account')

        showToast('Demo account created! Valid for 1 hour.', 'success');
        localStorage.setItem('token', response.data.token)
        identityStore.setIdentity(response.data)
        router.push('/')

    } catch (err) {
        console.error(err)
        showToast('Failed to create demo account.', 'error');
    }
}
</script>
