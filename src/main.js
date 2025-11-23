import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "leaflet/dist/leaflet.css";
import { createPinia } from "pinia";
import router from "./router";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { createI18n } from "vue-i18n";

import en from "./locales/en.json";
import frCA from "./locales/fr-CA.json";

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem("appLanguage") || "en",
    fallbackLocale: "en",
    messages: {
        en,
        frCA,
    },
});

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(Vue3Toastify, {
    clearOnUrlChange: false,
});
app.use(i18n);
app.mount("#app");
