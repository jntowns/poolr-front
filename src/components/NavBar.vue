<template>
  <nav class="bg-midnight-blue border-b border-slate-blue">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- so we have to put the logo Jen made here somewhere -->
        <div class="flex-shrink-0">
          <router-link
            to="/"
            class="filter saturate-100 hover:saturate-200 transition flex items-center pushButton"
            style="transition-property: filter; transition-duration: 500ms"
          >
            <img
              :src="poolrLogo"
              alt="Poolr Logo"
              class="mx-auto h-15 w-auto rounded-md"
            />
          </router-link>
        </div>

        <div class="hidden md:flex items-center space-x-4 ml-auto mr-8">
          <router-link
            to="/find-ride"
            class="text-cool-white hover:text-electric-blue transition-colors font-medium pushButton"
          >
            Ride
          </router-link>
          <router-link
            to="/offer-ride"
            class="text-cool-white hover:text-electric-blue transition-colors font-medium pushButton"
          >
            Drive
          </router-link>
          <!-- <router-link to="/about"
                        class="text-cool-white hover:text-electric-blue transition-colors font-medium pushButton">
                        About
                    </router-link> -->
          <router-link
            to="/settings"
            class="text-cool-white hover:text-electric-blue transition-colors font-medium pushButton"
          >
            Settings
          </router-link>
        </div>

        <div
          v-if="username == undefined"
          class="hidden md:flex items-center space-x-3"
        >
          <router-link
            to="/login"
            class="text-cool-white hover:text-electric-blue transition-colors font-medium px-4 py-2 pushButton"
          >
            Log in
          </router-link>
          <router-link
            to="/register"
            class="bg-electric-blue hover:bg-deep-blue text-white px-5 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg pushButton"
          >
            Sign up
          </router-link>
        </div>
        <div v-else class="hidden md:flex items-center space-x-3">
          <router-link
            to="/me"
            class="bg-electric-blue hover:bg-deep-blue text-white px-5 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg pushButton"
          >
            {{ username }}
          </router-link>
          <button
            @click="logout"
            class="text-cool-white hover:text-electric-blue transition-colors font-medium px-4 py-2 pushButton"
          >
            Log out
          </button>
        </div>

        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="text-cool-white hover:text-electric-blue transition p-2"
            aria-label="Toggle menu"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- mobile menu, im not quite happy with the animation but itll have to do for now -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-show="isMobileMenuOpen" class="md:hidden pb-4">
          <div class="flex flex-col space-y-3 pt-2">
            <router-link
              to="/find-ride"
              @click="closeMobileMenu"
              class="text-cool-white hover:text-electric-blue transition-colors font-medium px-2 py-2 pushButton"
            >
              Ride
            </router-link>
            <router-link
              to="/offer-ride"
              @click="closeMobileMenu"
              class="text-cool-white hover:text-electric-blue transition-colors font-medium px-2 py-2 pushButton"
            >
              Drive
            </router-link>
            <router-link
              to="/settings"
              class="text-cool-white hover:text-electric-blue transition-colors font-medium px-2 py-2 pushButton"
            >
              Settings
            </router-link>
            <!-- <router-link to="/about" @click="closeMobileMenu"
                            class="text-cool-white hover:text-electric-blue transition-colors font-medium px-2 py-2 pushButton">
                            About
                        </router-link> -->
            <div
              v-if="username == undefined"
              class="border-t border-slate-blue pt-3 space-y-3"
            >
              <router-link
                to="/login"
                @click="closeMobileMenu"
                class="block text-cool-white hover:text-electric-blue transition-colors font-medium px-2 py-2 pushButton"
              >
                Log in
              </router-link>
              <router-link
                to="/register"
                @click="closeMobileMenu"
                class="block bg-electric-blue hover:bg-deep-blue text-white px-5 py-2 rounded-lg font-medium transition-all shadow-md text-center pushButton"
              >
                Sign up
              </router-link>
            </div>
            <div v-else class="border-t border-slate-blue pt-3 space-y-3">
              <router-link
                to="/register"
                @click="closeMobileMenu"
                class="block bg-electric-blue hover:bg-deep-blue text-white px-5 py-2 rounded-lg font-medium transition-all shadow-md text-center pushButton"
              >
                Sign up
              </router-link>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import poolrLogo from "../assets/images/poolr-logo.png";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import { useIdentityStore } from "../stores/identityStore";
import { useRouter } from "vue-router";

const router = useRouter();
const identityStore = useIdentityStore();
const { username } = storeToRefs(identityStore);
onMounted(() => {
  identityStore.getIdentity();
});

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

function logout() {
  identityStore.clearIdentity();
  localStorage.removeItem("token");
  router.push("/");
}
</script>
