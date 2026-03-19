<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: 'menunggu' | 'diproses' | 'selesai' | 'dibatalkan'
}>()

const steps = [
  { key: 'menunggu', label: 'Menunggu', icon: 'i-lucide-loader-2' },
  { key: 'diproses', label: 'Diproses', icon: 'i-lucide-mail' },
  { key: 'selesai', label: 'Selesai', icon: 'i-lucide-check' }
]

const getStepColorClass = (index: number) => {
  if (index === 0) {
    return props.status === 'menunggu' 
      ? { border: 'border-amber-500', bg: 'bg-amber-500', hoverBg: 'hover:bg-amber-600', iconText: 'text-white', labelText: 'text-amber-500' } // Aktif (Solid)
      : { border: 'border-amber-500', bg: 'bg-amber-50', hoverBg: 'hover:bg-amber-100', iconText: 'text-amber-500', labelText: 'text-amber-500' } // Sudah lewat (Outline)
  }
  
  if (index === 1) {
    if (props.status === 'diproses') {
      return { border: 'border-blue-500', bg: 'bg-blue-500', hoverBg: 'hover:bg-blue-600', iconText: 'text-white', labelText: 'text-blue-500' } // Aktif (Solid)
    } else if (props.status === 'selesai') {
      return { border: 'border-blue-500', bg: 'bg-blue-50', hoverBg: 'hover:bg-blue-100', iconText: 'text-blue-500', labelText: 'text-blue-500' } // Sudah lewat (Outline)
    }
    return { border: 'border-gray-400', bg: 'bg-gray-100', hoverBg: 'hover:bg-gray-200', iconText: 'text-gray-500', labelText: 'text-gray-500' }
  }
  
  if (index === 2) {
    if (props.status === 'selesai') {
      return { border: 'border-emerald-500', bg: 'bg-emerald-500', hoverBg: 'hover:bg-emerald-600', iconText: 'text-white', labelText: 'text-emerald-500' } // Aktif (Solid)
    }
    return { border: 'border-gray-400', bg: 'bg-gray-100', hoverBg: 'hover:bg-gray-200', iconText: 'text-gray-500', labelText: 'text-gray-500' }
  }
  
  return { border: 'border-gray-400', bg: 'bg-gray-100', hoverBg: 'hover:bg-gray-200', iconText: 'text-gray-500', labelText: 'text-gray-500' }
}

const getLineColorClass = (index: number) => {
  if (index === 0) { 
    if (props.status === 'diproses' || props.status === 'selesai') {
      return 'bg-gradient-to-r from-amber-500 to-blue-500' 
    }
  } else if (index === 1) { 
    if (props.status === 'selesai') {
      return 'bg-gradient-to-r from-blue-500 to-emerald-500' 
    }
  }
  return 'bg-gray-400' 
}
</script>

<template>
  <div class="w-full flex py-6">
    
    <div v-if="status === 'dibatalkan'" class="flex flex-col items-center gap-3">
      <div class="size-12 rounded-full flex items-center justify-center border-2 border-red-500 bg-red-50 hover:bg-red-100 transition-colors">
        <UIcon name="i-lucide-x" class="size-6 text-red-500" />
      </div>
      <span class="text-sm font-semibold text-red-500">Dibatalkan</span>
    </div>

    <div v-else class="flex flex-col items-center justify-center gap-3 min-w-3xl">
      <div class="flex items-center justify-center w-full max-w-xl">
        <template v-for="(step, index) in steps" :key="step.key">
          
          <div class="flex items-center flex-1 last:flex-none">
            
            <div 
              class="relative size-12 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors duration-300"
              :class="[
                getStepColorClass(index).border,
                getStepColorClass(index).bg,
                getStepColorClass(index).hoverBg
              ]"
            >
              <UIcon 
                :name="step.icon" 
                class="size-6 transition-colors duration-300" 
                :class="getStepColorClass(index).iconText"
              />
            </div>
            
            <div 
              v-if="index < steps.length - 1" 
              class="h-1 grow mx-2 rounded-full transition-all duration-300"
              :class="getLineColorClass(index)"
            />
          </div>
          
        </template>
      </div>

      <div class="flex items-center justify-between w-full text-center">
        <div 
          v-for="(step, index) in steps" 
          :key="step.key + '-label'" 
          class="flex-1 text-sm font-semibold transition-colors duration-300"
          :class="getStepColorClass(index).labelText"
        >
          {{ step.label }}
        </div>
      </div>
    </div>
  </div>
</template>