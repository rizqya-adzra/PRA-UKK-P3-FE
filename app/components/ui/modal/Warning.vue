<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string 
}>()

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const close = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="close"
      >
        <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 text-center">
          <div class="mx-auto flex items-center justify-center size-16 rounded-full bg-red-100 mb-5">
            <UIcon name="i-lucide-alert-triangle" class="size-8 text-red-500" />
          </div>
          
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
          <p class="text-sm text-gray-500 mb-8">{{ message }}</p>
          
          <div class="flex gap-3 w-full">
            <button 
              @click="close" 
              class="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              {{ cancelText || 'Batal' }}
            </button>
            <button 
              @click="handleConfirm" 
              class="flex-1 px-4 py-2.5 rounded-xl text-white font-semibold transition-colors"
              :class="confirmColor || 'bg-red-500 hover:bg-red-600'"
            >
              {{ confirmText || 'Ya, Lanjutkan' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>