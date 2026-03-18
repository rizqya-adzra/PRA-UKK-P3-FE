<script setup lang="ts">
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
  green: 'bg-[#227742] hover:bg-[#21653B]',
  red: 'bg-[#861D1D] hover:bg-[#711D1D]',
  gradient: 'bg-gradient-to-r from-electric-blue to-[#7975EB] hover:from-electric-blue-hover to-[#7975EB]'
}

const sizeVariants: Record<ButtonVariant, string> = {
  primary: 'h-[60px] w-full font-bold text-md', 
  export: 'h-[34px] w-[240px] font-semibold text-xs group',
  imperative: 'h-[60px] w-[240px] font-semibold text-sm'
}

const currentIcon = computed(() => {
  if (props.iconName) return props.iconName
  return props.variant === 'export' ? 'i-lucide-upload' : 'i-lucide-arrow-right'
})

const iconClasses = computed(() => {
  if (props.variant === 'export') {
    return 'size-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5'
  }
  return 'size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1'
})

const classes = computed(() => [
  'rounded-[20px] flex items-center justify-center gap-3',
  'Montserrat text-white text-center border-none select-none cursor-pointer',
  'transition-all duration-400',
  
  sizeVariants[props.variant],
  colorVariants[props.color]
])
</script>

<template>
  <UButton :class="classes">
    <span class="leading-none pt-0.5">{{ label }}</span>

    <UIcon 
      v-if="showIcon" 
      :name="currentIcon" 
      :class="iconClasses"
    />
  </UButton>
</template>