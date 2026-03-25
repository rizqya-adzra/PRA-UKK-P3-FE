<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  name?: string 
  label?: string 
  isActive?: boolean
  badgeCount?: number
  isDropdown?: boolean 
  isOpen?: boolean     
}>(), {
  isActive: false,
  badgeCount: 0,
  isDropdown: false,
  isOpen: false,
})

const emit = defineEmits(['click'])

const classes = computed(() => [
  'relative flex items-center transition-all duration-200 cursor-pointer rounded-2xl font-bold text-sm',
  
  props.isActive 
    ? 'bg-white text-black' 
    : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-black',
  
  props.label 
    ? 'w-full px-4 py-3 justify-start' 
    : 'size-[48px] p-3 justify-center'  
])
</script>

<template>
  <button :class="classes" @click="emit('click')">
    <UIcon 
      :name="name" 
      :class="['size-6 shrink-0', { 'mr-4': label }]" 
    />
    
    <template v-if="label">
      <span class="flex-1 text-left whitespace-nowrap pt-0.5">{{ label }}</span>
      
      <span v-if="badgeCount > 0" class="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
        {{ badgeCount > 99 ? '99+' : badgeCount }}
      </span>

      <div 
        v-if="isDropdown" 
        class="ml-2 shrink-0 transition-transform duration-200" 
        :class="{ 'rotate-180': isOpen }"
      >
        <UIcon name="i-lucide-chevron-down" class="size-5" />
      </div>
    </template>

    <template v-else>
      <span 
        v-if="badgeCount > 0" 
        class="absolute top-0 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
      >
        {{ badgeCount > 99 ? '99+' : badgeCount }}
      </span>
    </template>
  </button>
</template>