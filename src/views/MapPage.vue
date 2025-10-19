<template>
    this is the map page
    <div class="route-container">
        <RouteMap />
    </div>
</template>

<script setup>
import RouteMap from '../components/RouteMap.vue'
</script>

<style scoped>
.route-container {
    padding: 0;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
}
</style>