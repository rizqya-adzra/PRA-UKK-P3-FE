<script setup lang="ts">
import { computed } from 'vue'

type LabelVariant = 'solid' | 'outline'

const props = withDefaults(defineProps<{
  text: string
  variant?: LabelVariant
}>(), {
  variant: 'solid'
})

const categoryColors: Record<string, string> = {
  'Fasilitas': 'bg-purple text-white',
  'Lingkungan': 'bg-green text-white',
  'Pendidikan': 'bg-red text-white',
  'Karakter': 'bg-yellow text-white',
  'Ibadah': 'bg-[#BA36C0] text-white',
}

const statusStyles: Record<string, { bg: string, textBorder: string }> = {
  'Menunggu': { bg: 'bg-[#FFF2D9]', textBorder: 'text-yellow border-yellow' },
  'Proses': { bg: 'bg-[#E6EBFF]', textBorder: 'text-purple border-purple' },
  'Selesai': { bg: 'bg-[#E0FFE4]', textBorder: 'text-green border-green' },
  'Dibatalkan': { bg: 'bg-[#FFDDDD]', textBorder: 'text-red border-red' },
}

const classes = computed(() => {
  const base = 'px-4 py-1.5 font-bold text-sm inline-flex items-center justify-center whitespace-nowrap rounded-full'
  
  const key = props.text 

  if (props.variant === 'solid') {
    const colorClass = categoryColors[key] || 'bg-gray-500 text-white'
    return [base, colorClass]
  } else {
    const style = statusStyles[key] || { bg: 'bg-gray-100', textBorder: 'text-gray-500 border-gray-500' }
    return [base, 'border-2', style.bg, style.textBorder]
  }
})
</script>

<template>
  <span :class="classes">
    <span v-if="variant === 'outline'" class="w-2.5 h-2.5 rounded-full mr-2 bg-current shrink-0"></span>
    
    {{ text }}
  </span>
</template>