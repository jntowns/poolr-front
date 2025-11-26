<template>
    <div class="flex rounded-lg bg-slate-100 p-1 mb-6">
        <button v-for="tab in tabs" :key="tab.value" @click="$emit('update:modelValue', tab.value)" :class="[
            'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200',
            modelValue === tab.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
        ]" type="button">
            {{ tab.label }}
        </button>
    </div>
</template>

<script setup>
defineProps({
    tabs: {
        type: Array,
        required: true
    },
    modelValue: {
        type: String,
        required: true
    }
})

defineEmits(['update:modelValue'])
</script>
