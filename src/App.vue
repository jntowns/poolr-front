<template>
    <div class="flex flex-col min-h-screen">
        <NavBar />
        <div class="flex-grow flex flex-col">
            <router-view />
        </div>
        <Footer />
    </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>

<style scoped></style>