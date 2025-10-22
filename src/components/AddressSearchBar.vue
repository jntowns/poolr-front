<template>
    <div class="relative w-full">
        <div class="relative">
            <input v-model="searchQuery" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
                @keydown.down.prevent="highlightNext" @keydown.up.prevent="highlightPrevious"
                @keydown.enter.prevent="selectHighlighted" @keydown.escape="closeSuggestions" type="text"
                :placeholder="placeholder" autocomplete="off"
                class="w-full px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                :class="{ 'border-red-500': error }" />

            <div v-if="isLoading" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-5 h-5 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
            </div>

            <button v-else-if="searchQuery" @mousedown.prevent="clearSearch" type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <Transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-if="showSuggestions && suggestions.length > 0"
                class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                <ul class="py-1">
                    <li v-for="(address, index) in suggestions" :key="address.id"
                        @mousedown.prevent="selectAddress(address)" @mouseenter="highlightedIndex = index"
                        class="px-4 py-3 cursor-pointer transition-colors duration-150" :class="{
                            'bg-blue-50': highlightedIndex === index,
                            'hover:bg-gray-50': highlightedIndex !== index
                        }">
                        <div class="flex items-start">
                            <svg class="w-5 h-5 mt-0.5 mr-3 text-gray-400 flex-shrink-0" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">
                                    {{ address.fullAddress }}
                                </p>
                                <p class="text-sm text-gray-500 mt-0.5">
                                    {{ formatAddressDetails(address) }}
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </Transition>

        <div v-if="showSuggestions && !isLoading && searchQuery.length >= minChars && suggestions.length === 0"
            class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div class="px-4 py-8 text-center">
                <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p class="text-sm text-gray-500">No addresses found</p>
            </div>
        </div>

        <Transition enter-active-class="transition ease-out duration-100" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="error" class="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                    {{ error }}
                </p>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAddressStore } from '../stores/addressStore'

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Search for an address...'
    },
    minChars: {
        type: Number,
        default: 3
    },
    debounceDelay: {
        type: Number,
        default: 300
    },
    maxResults: {
        type: Number,
        default: 10
    },
    modelValue: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'select', 'clear'])
const addressStore = useAddressStore()
const searchQuery = ref('')
const suggestions = ref([])
const isFocused = ref(false)
const highlightedIndex = ref(-1)
let debounceTimer = null
const showSuggestions = computed(() => {
    return isFocused.value && searchQuery.value.length >= props.minChars
})
const isLoading = computed(() => addressStore.isLoading)
const error = computed(() => addressStore.error)

const handleInput = () => {
    addressStore.clearError()
    highlightedIndex.value = -1

    if (searchQuery.value.length < props.minChars) {
        suggestions.value = []
        emit('clear')
        emit('update:modelValue', null)
        return
    }

    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        fetchAddresses()
    }, props.debounceDelay)
}

const fetchAddresses = async () => {
    if (searchQuery.value.length < props.minChars) return

    try {
        const results = await addressStore.searchAddresses(
            searchQuery.value,
            props.maxResults
        )
        suggestions.value = results
    } catch (err) {
        suggestions.value = []
    }
}

const selectAddress = (address) => {
    searchQuery.value = address.fullAddress
    suggestions.value = []
    highlightedIndex.value = -1
    addressStore.setSelectedAddress(address)
    emit('select', address)
    emit('update:modelValue', address)
    isFocused.value = false
}

const handleFocus = () => {
    isFocused.value = true
    if (searchQuery.value.length >= props.minChars && suggestions.value.length === 0) {
        fetchAddresses()
    }
}

const handleBlur = () => {
    setTimeout(() => {
        isFocused.value = false
        highlightedIndex.value = -1
    }, 200)
}

const clearSearch = () => {
    searchQuery.value = ''
    suggestions.value = []
    highlightedIndex.value = -1
    emit('clear')
    emit('update:modelValue', null)
}

const closeSuggestions = () => {
    isFocused.value = false
    highlightedIndex.value = -1
}

const highlightNext = () => {
    if (highlightedIndex.value < suggestions.value.length - 1) {
        highlightedIndex.value++
    }
}

const highlightPrevious = () => {
    if (highlightedIndex.value > 0) {
        highlightedIndex.value--
    }
}

const selectHighlighted = () => {
    if (highlightedIndex.value >= 0 && suggestions.value[highlightedIndex.value]) {
        selectAddress(suggestions.value[highlightedIndex.value])
    }
}

const formatAddressDetails = (address) => {
    const parts = []
    if (address.housenumber) parts.push(address.housenumber)
    if (address.street) parts.push(address.street)
    if (address.city) parts.push(address.city)
    if (address.postcode) parts.push(address.postcode)
    return parts.join(', ')
}

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        searchQuery.value = newValue.fullAddress
    } else {
        searchQuery.value = ''
    }
})

defineExpose({
    clear: clearSearch,
    focus: () => document.querySelector('input').focus()
})
</script>
