<template>
    <div
        class="flex min-h-full max-w-md min-w-md border border-gray-200 rounded-lg flex-col justify-center px-6 py-12 lg:px-8 bg-sky-900">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
             <img :src=poolrLogo alt="Poolr Logo"
                class="mx-auto h-25 w-auto rounded-lg" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign up with Poolr</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form @submit.prevent="submitForm" class="space-y-6">
                <div>
                    <label for="realName" class="block text-sm/6 font-medium text-gray-100">Full Name</label>
                    <div class="mt-2">
                        <input v-model="register.realName" id="realName" type="text" name="realName" required
                            autocomplete="text"
                            class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <label for="username" class="block text-sm/6 font-medium text-gray-100">Username</label>
                    <div class="mt-2">
                        <input v-model="register.username" id="username" type="text" name="username" required
                            autocomplete="text"
                            class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <label for="phoneNumber" class="block text-sm/6 font-medium text-gray-100">Phone number</label>
                    <div class="mt-2">
                        <input v-model="register.phoneNumber" id="phoneNumber" type="tel" name="phoneNumber" required
                            autocomplete="tel"
                            class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <label for="email" class="block text-sm/6 font-medium text-gray-100">Email address</label>
                    <div class="mt-2">
                        <input v-model="register.email" id="email" type="email" name="email" required
                            autocomplete="email"
                            class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 font-medium text-gray-100">Password</label>
                        <div class="text-sm">
                            <a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a>
                        </div>
                    </div>
                    <div class="mt-2">
                        <input v-model="register.password" id="password" type="password" name="password" required
                            autocomplete="current-password"
                            class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign
                        up</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import poolrLogo from '../assets/images/poolr-logo.png'
import apiClient from '../utils/apiClient'
import { showToast } from '../utils/BaseToast'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useIdentityStore } from '../stores/identityStore'

const identityStore = useIdentityStore();
const router = useRouter()

const register = reactive({
    realName: '',
    username: '',
    phoneNumber: '',
    email: '',
    password: ''
})

const submitForm = async () => {
    // Optional: simple validation
    if (!register.realName || !register.username || !register.phoneNumber || !register.email || !register.password) {
        showToast('Please fill in all required fields.', 'error');
        return
    }

    try {
        localStorage.removeItem('token')

        const response = await apiClient.post('/api/auth/register', register)

        if (response.status != 200) throw new Error('Failed to register')

        showToast('Registration successful!', 'success')
        console.log(response)
        localStorage.setItem('token', response.data.token)
        identityStore.setIdentity(response.data)
        router.push('/')

    } catch (err) {
        console.error(err)
        showToast('There was a problem registering.', 'error');
    }
}
</script>