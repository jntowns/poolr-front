import { ref } from "vue";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const { t, locale } = useI18n();
    const selectedLanguage = ref(locale.value);

    onMounted(() => {
      const savedLang = localStorage.getItem("appLanguage");
      if (savedLang) {
        locale.value = savedLang;
        selectedLanguage.value = savedLang;
      }
    });
    const changeLanguage = () => {
      locale.value = selectedLanguage.value;
      localStorage.setItem("appLanguage", selectedLanguage.value);
    };

    return {
      selectedLanguage,
      changeLanguage,
      t,
    };
  },
};
