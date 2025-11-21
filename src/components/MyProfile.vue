<template>
    <div
        class="flex min-h-full max-w-md w-full border border-slate-100 rounded-2xl flex-col justify-center px-6 py-12 lg:px-8 bg-white shadow-2xl">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-slate-900">My Profile</h2>
        </div>
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form @submit.prevent="submitForm" class="space-y-6">
                <div>
                    <label for="realName" class="form-label">Full Name</label>
                    <div class="mt-2">
                        <input v-model="localUserData.realName" id="realName" type="text" name="realName"
                            class="form-input" />
                    </div>
                </div>

                <div>
                    <label for="username" class="form-label">Username</label>
                    <div class="mt-2">
                        <input v-model="localUserData.username" id="username" type="text" name="username"
                            class="form-input" />
                    </div>
                </div>

                <div>
                    <label for="phoneNumber" class="form-label">Phone number</label>
                    <div class="mt-2">
                        <input v-model="localUserData.phoneNumber" id="phoneNumber" type="tel" name="phoneNumber"
                            autocomplete="tel" class="form-input" />
                    </div>
                </div>

                <div>
                    <label for="email" class="form-label">Email address</label>
                    <div class="mt-2">
                        <input v-model="localUserData.email" id="email" type="email" name="email" autocomplete="email"
                            class="form-input" />
                    </div>
                </div>

                <div>
                    <label for="vehicleModel" class="form-label">Vehicle Model</label>
                    <div class="mt-2">
                        <input disabled v-model="localUserData.vehicleModel" id="vehicleModel" type="text"
                            name="vehicleModel" class="form-input bg-slate-50 text-slate-500" />
                    </div>
                </div>


                <div>
                    <button type="submit" class="btn-primary">Update</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { useIdentityStore } from '../stores/identityStore'
import { showToast } from '../utils/BaseToast';

const identityStore = useIdentityStore();
const { id, realName, username, email, phoneNumber, vehicleModel } = storeToRefs(identityStore)
const localUserData = ref({
    id: "",
    realName: "",
    username: "",
    email: "",
    phoneNumber: "",
    vehicleModel: ""
})
onMounted(async () => {
    refreshUserData();
})

const submitForm = async () => {

    try {

        const response = await identityStore.postIdentity(localUserData.value)

        if (response.status != 200) throw new Error('Failed to update user information')

        console.log(response)
        localStorage.setItem('token', response.data.token)
        refreshUserData()

    } catch (err) {
        console.error(err)
        showToast('There was a problem updating user information.', 'error');
    }
}

async function refreshUserData() {
    await identityStore.getIdentity();
    localUserData.value.id = id.value;
    localUserData.value.realName = realName.value;
    localUserData.value.username = username.value;
    localUserData.value.email = email.value;
    localUserData.value.phoneNumber = phoneNumber.value;
    localUserData.value.vehicleModel = vehicleModel.value;
}

</script>