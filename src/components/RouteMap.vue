<template>
    <div class="route-planner-container">
        <div class="map-section">
            <l-map ref="map" :zoom="zoom" :center="center" @click="onMapClick" class="map"
                aria-label="Interactive map for route planning">
                <l-tile-layer :url="'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'"
                    :attribution="attribution" :subdomains="'abcd'" :max-zoom="20" />

                <!-- Polygon for available routing area -->
                <l-polygon :lat-lngs="routingAreaPolygon" :color="'#FF0000FF'" :weight="2" :fill="false">
                    <l-popup>Available routing area</l-popup>
                </l-polygon>

                <!-- Waypoint markers -->
                <l-marker v-for="(waypoint, index) in waypoints" :key="index" :lat-lng="[waypoint.lat, waypoint.lon]">
                    <l-icon :icon-url="getMarkerIcon(getMarkerColor(index))" :icon-size="[25, 41]"
                        :icon-anchor="[12, 41]" />
                    <l-popup>Waypoint {{ index + 1 }}</l-popup>
                </l-marker>

                <!-- Route polyline segments with different colors -->
                <template v-if="routeData && routeSegments.length > 0">
                    <l-polyline v-for="(segment, index) in routeSegments" :key="index" :lat-lngs="segment.coordinates"
                        :color="segment.color" :weight="5" :opacity="0.7" />
                </template>
            </l-map>
        </div>
        <InfoPanel />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { LMap, LTileLayer, LMarker, LPolyline, LPopup, LIcon, LRectangle, LPolygon } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapStore } from '../stores/mapStore'
import InfoPanel from './InfoPanel.vue'
import { routingAreaPolygon } from '../data/routingAreaPolygon.js'

const mapStore = useMapStore()
const waypoints = computed(() => mapStore.waypoints)
const routeData = computed(() => mapStore.routeData)
const map = ref(null)

// Map config
const zoom = ref(14)
const center = ref([44.6087, -79.4207]) // orillia

// Attribution string
const attribution = ref('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>')

// Fix map size after mounting
onMounted(() => {
    nextTick(() => {
        if (map.value && map.value.leafletObject) {
            setTimeout(() => {
                map.value.leafletObject.invalidateSize()
            }, 100)
        }
    })
})

// Compute route segments with different colors
const routeSegments = computed(() => {
    if (!routeData.value || !routeData.value.segments) return []

    const colors = ['#00ff00', '#ff6600'] // Green for segment 1->2, Orange for segment 2->3

    return routeData.value.segments.map((segmentCoords, index) => ({
        coordinates: segmentCoords,
        color: colors[index] || '#0000ff'
    }))
})

const onMapClick = (event) => {
    const { lat, lng } = event.latlng
    mapStore.addWaypoint({ lat, lon: lng })
}

// Helper to get marker color based on index
const getMarkerColor = (index) => {
    const colors = ['green', 'orange', 'red']
    return colors[index] || 'blue'
}

// Helper to get marker icon (default Leaflet markers)
const getMarkerIcon = (color) => {
    return `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`
}
</script>

<style scoped>
.route-planner-container {
    display: flex;
    gap: 15px;
    width: 100%;
    height: calc(100vh - 250px);
    min-height: 500px;
    max-width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

.map-section {
    flex: 1;
    min-width: 0;
    height: 100%;
}

.map {
    width: 100%;
    height: 100%;
}

@media (max-width: 768px) {
    .route-planner-container {
        flex-direction: column;
        height: auto;
        min-height: 0;
        padding: 10px;
        gap: 10px;
    }

    .map-section {
        height: 50vh;
        min-height: 300px;
        width: 100%;
    }
}
</style>
