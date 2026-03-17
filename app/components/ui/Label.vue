<script setup lang="ts">
type LabelVariant = 'solid' | 'outline'
type LabelColor = 'purple' | 'light-green' | 'red' | 'orange' | 'pink' | 'blue' | 'dark-green'

const props = withDefaults(defineProps<{
  text: string
  variant?: LabelVariant
  color?: LabelColor
}>(), {
  variant: 'solid',
  color: 'purple'
})

const solidColors: Record<string, string> = {
  'purple': 'bg-[#6D5DFF] text-white',       // Fasilitas
  'light-green': 'bg-[#9DC344] text-white',  // Lingkungan
  'red': 'bg-[#C03648] text-white',          // Pendidikan 
  'orange': 'bg-[#C08736] text-white',       // Karakter
  'pink': 'bg-[#BA36C0] text-white',         // Ibadah
}

const outlineColors: Record<string, string> = {
  'orange': 'border-[#EE9300] text-[#EE9300]', // Menunggu
  'blue': 'border-[#006EFF] text-[#006EFF]',   // Diproses
  'dark-green': 'border-[#19A229] text-[#19A229]', // Selesai
  'red': 'border-[#A21919] text-[#A21919]',    // Dibatalkan
}

const classes = computed(() => {
  const base = 'px-4 py-1.5 font-bold text-sm inline-flex items-center justify-center Montserrat'
  
  if (props.variant === 'solid') {
    return [base, 'rounded-full', solidColors[props.color]]
  } else {
    return [base, 'rounded-md border-2 bg-transparent', outlineColors[props.color]]
  }
})
</script>

<template>
  <span :class="classes">{{ text }}</span>
</template>