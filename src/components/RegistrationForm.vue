<template>
    <div
        class="flex min-h-full max-w-md w-full border border-slate-100 rounded-2xl flex-col justify-center px-6 py-12 lg:px-8 bg-white shadow-2xl">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img :src=poolrLogo alt="Poolr Logo" class="mx-auto h-25 w-auto rounded-xl shadow-md" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-slate-900">Sign up with Poolr</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form @submit.prevent="submitForm" class="space-y-6">
                <div>
                    <label for="realName" class="form-label">Full Name</label>
                    <div class="mt-2">
                        <input v-model="register.realName" id="realName" type="text" name="realName" required
                            autocomplete="text" class="form-input" />
                    </div>
                </div>

                <div>
                    <label for="username" class="form-label">Username</label>
                    <div class="mt-2">
                        <input v-model="register.username" id="username" type="text" name="username" required
                            autocomplete="text" class="form-input" />
                    </div>
                </div>

                <div>
                    <label for="phoneNumber" class="form-label">Phone number</label>
                    <div class="mt-2">
                        <input v-model="register.phoneNumber" id="phoneNumber" type="tel" name="phoneNumber" required
                            autocomplete="tel" class="form-input" />
                    </div>
                </div>

                <div>
                    <label for="email" class="form-label">Email address</label>
                    <div class="mt-2">
                        <input v-model="register.email" id="email" type="email" name="email" required
                            autocomplete="email" class="form-input" />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="form-label">Password</label>
                        <div class="text-sm">
                            <a href="#" class="font-semibold text-electric-blue hover:text-blue-600">Forgot
                                password?</a>
                        </div>
                    </div>
                    <div class="mt-2">
                        <input v-model="register.password" id="password" type="password" name="password" required
                            autocomplete="current-password" class="form-input" />
                    </div>
                </div>

                <div>
                    <button type="submit" class="btn-primary">Sign
                        up</button>
                </div>
            </form>

            <DemoAccountButton />
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
import DemoAccountButton from './DemoAccountButton.vue'

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