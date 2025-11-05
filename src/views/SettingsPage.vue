<template>
  <div class="settings-page">
    <h2 class="title">Settings</h2>

    <div class="box" id="profile">
        <label>Profile</label>
      <router-link to="/me" class="link-box">
        Go to Profile
      </router-link>
    </div>
    <div class="box" id="theme">
      <label>Theme:</label>
      <select v-model="theme.theme" @change="theme.setTheme(theme.theme)">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>

    <div class="box" id="appearance">
      <label>Appearance Size:</label>
      <select
        v-model="theme.appearanceSize"
        @change="theme.setAppearanceSize(theme.appearanceSize)"
      >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from "../stores/theme";
const theme = useThemeStore();
</script>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  width: 200px;
  min-height: 100vh;
  background-color: #f9fafc;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #111827;
}

.box {
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.box:hover {
  background-color: #f0f4ff;
  transform: translateX(3px);
}

.box label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.box select {
  width: 100%;
  padding: 0.4rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #111827;
  cursor: pointer;
}

#theme {
  border-left: 4px solid #3b82f6;
}

#appearance {
  border-left: 4px solid #10b981;
}
#profile {
    border-left: 4px solid #374151;
}
</style>
