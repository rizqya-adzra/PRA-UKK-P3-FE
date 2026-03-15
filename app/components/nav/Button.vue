<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  isActive?: boolean
}>(), {
  isActive: false
})

const classes = computed(() => [
  'px-4 py-2 rounded-[16px]',
  'font-bold Montserrat text-xs text-black',
  'transition-all duration-200',
  props.isActive ? 'bg-[#DFE3F0]' : 'bg-transparent hover:bg-gray-100'
])
</script>

<template>
  <button :class="classes">
    <span class="leading-none pt-0.5">{{ label }}</span>
  </button>
</template>