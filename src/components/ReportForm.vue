<template>
  <div class="min-h-screen flex items-center justify-center bg-cool-white">
    <div
      class="flex min-h-full max-w-md min-w-md border border-gray-200 rounded-lg flex-col justify-center px-6 py-12 lg:px-8 bg-sky-900"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          :src="poolrLogo"
          alt="Poolr Logo"
          class="mx-auto h-25 w-auto rounded-lg"
        />
        <h2
          class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white"
        >
          Report Problem
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div
          v-if="successMessage"
          class="p-3 mb-4 rounded-md bg-green-600 text-white text-center"
        >
          {{ successMessage }}
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label for="name" class="block text-sm/6 font-medium text-gray-100"
              >Name</label
            >
            <div class="mt-2">
              <input
                v-model="form.name"
                id="name"
                type="name"
                name="name"
                required
                placeholder="Enter your name"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-100"
              >Email Address</label
            >
            <div class="mt-2">
              <input
                v-model="form.email"
                id="email"
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm/6 font-medium text-gray-100"
              >Phone Number</label
            >
            <div class="mt-2">
              <input
                v-model="form.password"
                id="phone"
                type="phone"
                name="phone"
                required
                placeholder="Enter phone number"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm/6 font-medium text-gray-100"
              >Category</label
            >
            <div class="mt-2">
              <select
                v-model="form.category"
                id="category"
                name="category"
                class="block w-full rounded-md bg-grey text-white px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
              >
                <option value="App Bug" class="bg-gray-800 text-white">
                  App Bug
                </option>
                <option value="Payment Issue" class="bg-gray-800 text-white">
                  Payment Issue
                </option>
                <option value="Account Issue" class="bg-gray-800 text-white">
                  Account Issue
                </option>
                <option
                  value="Driver/Rider Issue"
                  class="bg-gray-800 text-white"
                >
                  Driver/Rider Issue
                </option>
                <option value="Incomplete Ride" class="bg-gray-800 text-white">
                  Incomplete Ride
                </option>
                <option value="Other" class="bg-gray-800 text-white">
                  Other
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              for="description"
              class="block text-sm/6 font-medium text-gray-100"
              >Description</label
            >
            <div class="mt-2">
              <textarea
                id="description"
                v-model="form.description"
                placeholder="please describle problem in detail..."
                maxlength="1000"
                rows="6"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm resize-y"
              >
              </textarea>
              <div class="text-right text-xs text-gray-300 mt-1">
                {{ form.description.length }}/1000 characters
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import poolrLogo from "../assets/images/poolr-logo.png";
import apiClient from "../utils/apiClient";
import { showToast } from "../utils/BaseToast";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useIdentityStore } from "../stores/identityStore";

const identityStore = useIdentityStore();
const successMessage = ref("");
const router = useRouter();

const form = reactive({
  name: "",
  email: "",
  phone: "",
  category: "App Bug",
  description: "",
});

const submitForm = async () => {
  if (!form.name || !form.email || !form.description) {
    showToast("Please fill in all required fields.", "error");
    return;
  }

  try {
    const response = await apiClient.post("/api/report", form);

    if (response.status != 200) throw new Error("Failed to submit report");

    successMessage.value = "Report submitted successfully!";
    showToast("Report submitted successfully!", "success");
  } catch (err) {
    console.error(err);
    showToast("There was a problem submitting your report.", "error");
  }
};
</script>
