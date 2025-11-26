<template>
    <div>
        <label :for="id" class="form-label">{{ label }}</label>
        <div class="mt-2">
            <input :id="id" :type="type" :name="name || id" :autocomplete="autocomplete" :required="required"
                :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="form-input" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'text'
    },
    name: String,
    autocomplete: String,
    required: Boolean,
    modelValue: {
        type: String,
        required: true
    }
})

defineEmits(['update:modelValue'])
</script>
