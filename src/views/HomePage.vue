<template>
  <div class="min-h-screen" style="background: var(--page-bg)">
    <!-- Hero Section -->
    <div class="bg-midnight-blue text-pure-white">
      <div class="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 class="text-5xl font-bold mb-4">Poolr</h1>
        <p class="text-xl text-slate-gray mb-8">
          {{ t("homeP") }}
        </p>
        <button
          @click="$router.push('/find-ride')"
          class="pushButton bg-electric-blue hover:bg-deep-blue text-pure-white font-semibold py-3 px-8 rounded-lg"
        >
          {{ t("getStarted") }}
        </button>
      </div>
    </div>

    <!-- Features Section -->
    <div
      class="max-w-6xl mx-auto px-4 py-16"
      style="background: var(--feature-section-bg)"
    >
      <h2
        class="text-3xl font-bold text-midnight-blue text-center mb-12"
        style="color: var(--title-color)"
      >
        {{ t("whyChoose") }}
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-pure-white p-6 rounded-lg shadow-md">
          <div class="text-soft-teal text-4xl mb-4">💰</div>
          <h3 class="text-xl font-semibold text-slate-blue mb-2">
            {{ t("homeDivOneH") }}
          </h3>
          <p class="text-slate-gray">
            {{ t("homeDivOneP") }}
          </p>
        </div>
        <div class="bg-pure-white p-6 rounded-lg shadow-md">
          <div class="text-soft-teal text-4xl mb-4">🌍</div>
          <h3 class="text-xl font-semibold text-slate-blue mb-2">
            {{ t("homeDivTwoH") }}
          </h3>
          <p class="text-slate-gray">{{ t("homeDivTwoP") }}</p>
        </div>
        <div class="bg-pure-white p-6 rounded-lg shadow-md">
          <div class="text-soft-teal text-4xl mb-4">👥</div>
          <h3 class="text-xl font-semibold text-slate-blue mb-2">
            {{ t("homeDivThreeH") }}
          </h3>
          <p class="text-slate-gray">{{ t("homeDivThreeP") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useThemeStore } from "../stores/theme";
import { useI18n } from "vue-i18n";
const theme = useThemeStore();

const { t, locale } = useI18n();
const selectedLanguage = ref(locale.value);
</script>
