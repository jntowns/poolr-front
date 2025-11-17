import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref(localStorage.getItem("theme") || "light");
  const appearanceSize = ref(
    localStorage.getItem("appearanceSize") || "medium"
  );

  function setTheme(value) {
    theme.value = value;
    document.documentElement.setAttribute("data-theme", value);
  }

  function setAppearanceSize(value) {
    appearanceSize.value = value;
    document.documentElement.style.fontSize =
      value === "small" ? "14px" : value === "large" ? "18px" : "16px";
  }

  watch(theme, (newVal) => localStorage.setItem("theme", newVal));
  watch(appearanceSize, (newVal) =>
    localStorage.setItem("appearanceSize", newVal)
  );

  setTheme(theme.value);
  setAppearanceSize(appearanceSize.value);

  return { theme, appearanceSize, setTheme, setAppearanceSize };
});
