<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <div class="text-6xl mb-4">404</div>
    <h1 class="text-5xl font-bold mb-4">{{ t("404_title") }}</h1>
    <p class="text-lg mb-8 text-slate-gray max-w-md text-center">
      {{ t("404_message") }}
    </p>
    <router-link
      to="/"
      class="bg-electric-blue text-pure-white px-8 py-4 rounded-full hover:bg-deep-blue hover:scale-105 transition-all duration-300 font-semibold shadow-lg"
    >
      {{ t("404_backHome") }}
    </router-link>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
