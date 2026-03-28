<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'export' | 'imperative'
type ButtonColor = 'blue' | 'black' | 'green' | 'red' | 'gradient'

const props = withDefaults(defineProps<{
  label: string
  variant?: ButtonVariant
  color?: ButtonColor
  showIcon?: boolean
  iconName?: string 
}>(), {
  variant: 'primary',
  color: 'blue',
  showIcon: true
})

const colorVariants: Record<ButtonColor, string> = {
  blue: 'bg-electric-blue hover:bg-electric-blue-hover',
  black: 'bg-pure-black hover:bg-pure-black-hover',
  green: 'bg-green hover:bg-[#21653B]',
  red: 'bg-red hover:bg-[#711D1D]',
  gradient: 'bg-gradient-to-r from-electric-blue to-[#7975EB] hover:from-electric-blue-hover to-[#7975EB]'
}

const sizeVariants: Record<ButtonVariant, string> = {
  primary: 'h-[48px] md:h-[60px] w-full font-bold text-sm md:text-base', 
  export: 'h-[36px] md:h-[40px] w-auto md:w-[240px] px-6 md:px-0 font-semibold text-xs md:text-sm group',
  imperative: 'h-[48px] md:h-[66px] w-auto md:w-[260px] px-6 md:px-0 font-bold md:font-semibold text-xs md:text-base'
}

const currentIcon = computed(() => {
  if (props.iconName) return props.iconName
  return props.variant === 'export' ? 'i-lucide-upload' : 'i-lucide-arrow-right'
})

const iconClasses = computed(() => {
  if (props.variant === 'export') {
    return 'size-3 md:size-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5'
  }
  return 'size-4 md:size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1'
})

const classes = computed(() => [
  'rounded-full flex items-center justify-center gap-2 md:gap-3',
  'Montserrat text-white text-center border-none select-none cursor-pointer',
  'transition-all duration-400',
  
  sizeVariants[props.variant],
  colorVariants[props.color]
])
</script>

<template>
  <UButton :class="classes">
    <span class="leading-none pt-0.5 whitespace-nowrap">{{ label }}</span>

    <UIcon 
      v-if="showIcon" 
      :name="currentIcon" 
      :class="iconClasses"
    />
  </UButton>
</template>