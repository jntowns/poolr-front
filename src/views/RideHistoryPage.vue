<template>
    <div>
        <h2>Ride History</h2>
        <div v-for="ride in rideHistory.rides" :key="ride.id">
            <RideSummary :ride="ride"/>
        </div>
    </div>
</template>

<script setup>
import RideSummary from '../components/RideSummary.vue';
import {useRideHistoryStore} from '../stores/rideHistoryStore'

const rideHistory = useRideHistoryStore()
</script>