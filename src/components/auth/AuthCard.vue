<template>
    <div
        class="flex min-h-full max-w-md w-full border border-slate-100 rounded-2xl flex-col justify-center px-6 py-12 lg:px-8 bg-white shadow-2xl">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img :src="poolrLogo" alt="Poolr Logo" class="mx-auto h-25 w-auto rounded-xl shadow-md" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-slate-900">
                {{ title }}
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <slot />
        </div>
    </div>
</template>

<script setup>
import poolrLogo from '../../assets/images/poolr-logo.png'

defineProps({
    title: {
        type: String,
        required: true
    }
})
</script>
