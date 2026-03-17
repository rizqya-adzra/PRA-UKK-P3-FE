<script setup lang="ts">
const props = withDefaults(defineProps<{
  iconName: string
  isActive?: boolean
  badgeCount?: number 
}>(), {
  isActive: false,
  badgeCount: 0
})

const classes = computed(() => [
  'p-2 rounded-[10px] flex items-center justify-center',
  'transition-all duration-200 relative', 
  props.isActive ? 'bg-[#DFE3F0] text-black' : 'bg-transparent text-black hover:bg-gray-100'
])
</script>

<template>
  <button :class="classes">
    <UIcon :name="iconName" class="size-6 shrink-0" />
    
    <span 
      v-if="badgeCount > 0" 
      class="absolute -top-0.5 -right-0.5 bg-[#C9353F] text-white text-[11px] font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full"
    >
      {{ badgeCount }}
    </span>
  </button>
</template>