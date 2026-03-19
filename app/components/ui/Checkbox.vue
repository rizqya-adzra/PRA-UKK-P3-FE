<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  link?: string
  error?: string
}>(), {
  modelValue: false,
  label: '',
  link: '',
  error: ''
})

// Tambahkan 'open-link' di sini
const emit = defineEmits(['update:modelValue', 'open-link'])
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label class="flex items-center gap-3 cursor-pointer group w-fit">
      <div class="relative flex items-center justify-center">
        <input
          type="checkbox"
          :checked="modelValue"
          @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
          class="peer appearance-none size-5 border-2 rounded-md bg-transparent transition-all duration-300 cursor-pointer
                 checked:bg-black checked:border-black
                 border-gray-500 group-hover:border-black
                 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          :class="error ? 'border-red-500! checked:bg-red-500! checked:border-red-500! focus:ring-red-500!' : ''"
        />
        
        <svg
          class="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      
      <span 
        v-if="label" 
        class="text-sm transition-colors duration-300"
        :class="error ? 'text-red-500' : 'text-gray-700 group-hover:text-black'"
      >
        {{ label }}
        <a 
          v-if="link" 
          href="#" 
          @click.prevent="emit('open-link')"
          class="font-bold text-black hover:text-blue-600 underline duration-300 transition-colors"
        >
          {{ link }}
        </a>
      </span>
    </label>

    <span v-if="error" class="text-red-500 text-xs font-medium px-1">
      {{ error }}
    </span>
  </div>
</template>