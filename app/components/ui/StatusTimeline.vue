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
      ? { border: 'border-yellow', bg: 'bg-yellow', hoverBg: 'hover:bg-amber-600', iconText: 'text-white', labelText: 'text-yellow' } 
      : { border: 'border-yellow', bg: 'bg-amber-50', hoverBg: 'hover:bg-amber-100', iconText: 'text-yellow', labelText: 'text-yellow' } 
  }
  
  if (index === 1) {
    if (props.status === 'diproses') {
      return { border: 'border-purple', bg: 'bg-purple', hoverBg: 'hover:bg-blue-600', iconText: 'text-white', labelText: 'text-purple' } 
    } else if (props.status === 'selesai') {
      return { border: 'border-purple', bg: 'bg-blue-50', hoverBg: 'hover:bg-blue-100', iconText: 'text-purple', labelText: 'text-purple' } 
    }
    return { border: 'border-tertiary', bg: 'bg-gray-100', hoverBg: 'hover:bg-gray-200', iconText: 'text-gray-500', labelText: 'text-gray-500' }
  }
  
  if (index === 2) {
    if (props.status === 'selesai') {
      return { border: 'border-green', bg: 'bg-green', hoverBg: 'hover:bg-emerald-600', iconText: 'text-white', labelText: 'text-green' } 
    }
    return { border: 'border-tertiary', bg: 'bg-gray-100', hoverBg: 'hover:bg-gray-200', iconText: 'text-gray-500', labelText: 'text-gray-500' }
  }
  
  return { border: 'border-tertiary', bg: 'bg-gray-100', hoverBg: 'hover:bg-gray-200', iconText: 'text-gray-500', labelText: 'text-gray-500' }
}

const getLineColorClass = (index: number) => {
  if (index === 0) { 
    if (props.status === 'diproses' || props.status === 'selesai') {
      return 'bg-gradient-to-r from-yellow to-purple' 
    }
  } else if (index === 1) { 
    if (props.status === 'selesai') {
      return 'bg-gradient-to-r from-purple to-green' 
    }
  }
  return 'bg-tertiary' 
}
</script>

<template>
  <div class="w-full flex py-6 sm:py-8 px-2 sm:px-0">
    
    <div v-if="status === 'dibatalkan'" class="flex flex-col items-center gap-2 sm:gap-3 w-full">
      <div class="size-10 sm:size-12 rounded-full flex items-center justify-center border-2 border-red-500 bg-red-50 hover:bg-red-100 transition-colors">
        <UIcon name="i-lucide-x" class="size-5 sm:size-6 text-red-500" />
      </div>
      <span class="text-xs sm:text-sm font-semibold text-red-500">Dibatalkan</span>
    </div>

    <div v-else class="w-full max-w-2xl mx-auto pb-6"> <div class="flex items-center w-full">
        
        <template v-for="(step, index) in steps" :key="step.key">
          
          <div class="flex items-center flex-1 last:flex-none">
            
            <div class="relative flex flex-col items-center">
              
              <div 
                class="relative size-10 sm:size-12 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors duration-300 z-10"
                :class="[
                  getStepColorClass(index).border,
                  getStepColorClass(index).bg,
                  getStepColorClass(index).hoverBg
                ]"
              >
                <UIcon 
                  :name="step.icon" 
                  class="size-5 sm:size-6 transition-colors duration-300" 
                  :class="getStepColorClass(index).iconText"
                />
              </div>

              <div class="absolute top-full mt-2 sm:mt-3 left-1/2 -translate-x-1/2 w-max text-center">
                <span 
                  class="text-xs sm:text-sm font-semibold transition-colors duration-300"
                  :class="getStepColorClass(index).labelText"
                >
                  {{ step.label }}
                </span>
              </div>
            </div>
            
            <div 
              v-if="index < steps.length - 1" 
              class="h-1 grow mx-2 rounded-full transition-all duration-300"
              :class="getLineColorClass(index)"
            />
          </div>
          
        </template>
      </div>
    </div>
  </div>
</template>