<template>
    <div>
        <h2>{{ t('rideHistory') }}</h2>
        <div v-for="ride in rideHistory.rides" :key="ride.id">
            <RideSummary :ride="ride"/>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import RideSummary from '../components/RideSummary.vue';
import {useRideHistoryStore} from '../stores/rideHistoryStore'
import { useI18n} from 'vue-i18n';

const { t, locale } = useI18n()
const rideHistory = useRideHistoryStore()

const selectedLanguage = ref(locale.value);

</script>