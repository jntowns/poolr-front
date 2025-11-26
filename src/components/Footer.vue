<template>
  <footer class="bg-white border-t border-slate-100 py-8">
    <div
      class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4"
    >
      <div class="text-slate-500 text-sm">
        &copy; {{ new Date().getFullYear() }} {{ t("footer.companyName") }}.
        {{ t("footer.rightsReserved") }}
      </div>
      <!-- TODO add actual pages for these -->
      <div class="flex gap-6 text-slate-500 text-sm font-medium">
        <a href="#" class="hover:text-slate-900 transition-colors">{{
          t("footer.privacy")
        }}</a>
        <a href="#" class="hover:text-slate-900 transition-colors">{{
          t("footer.terms")
        }}</a>
        <a href="#" class="hover:text-slate-900 transition-colors">{{
          t("footer.contact")
        }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
