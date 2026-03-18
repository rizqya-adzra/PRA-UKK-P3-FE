<script setup lang="ts">
type LabelVariant = 'solid' | 'outline'

const props = withDefaults(defineProps<{
  text: string
  variant?: LabelVariant
}>(), {
  variant: 'solid'
})

const categoryColors: Record<string, string> = {
  'Fasilitas': 'bg-[#6D5DFF] text-white',
  'Lingkungan': 'bg-[#9DC344] text-white',
  'Pendidikan': 'bg-[#C03648] text-white',
  'Karakter': 'bg-[#C08736] text-white',
  'Ibadah': 'bg-[#BA36C0] text-white',
}

const statusColors: Record<string, string> = {
  'Menunggu': 'border-[#EE9300] text-[#EE9300]',
  'Proses': 'border-[#006EFF] text-[#006EFF]',
  'Diproses': 'border-[#006EFF] text-[#006EFF]', 
  'Selesai': 'border-[#19A229] text-[#19A229]',
  'Dibatalkan': 'border-[#A21919] text-[#A21919]',
}

const classes = computed(() => {
  const base = 'px-4 py-1.5 font-bold text-sm inline-flex items-center justify-center Montserrat whitespace-nowrap'
  
  const key = props.text 

  if (props.variant === 'solid') {
    const colorClass = categoryColors[key] || 'bg-gray-500 text-white'
    return [base, 'rounded-full', colorClass]
  } else {
    const colorClass = statusColors[key] || 'border-gray-400 text-gray-400'
    return [base, 'rounded-md border-2 bg-transparent', colorClass]
  }
})
</script>

<template>
  <span :class="classes">{{ text }}</span>
</template>