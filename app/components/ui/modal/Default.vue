<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title?: string
  maxWidth?: string
}>()

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (isOpen) => {
  if (typeof window !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden' 
    } else {
      document.body.style.overflow = ''       
    }
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6"
        @click.self="close" 
      >
        <div 
          class="bg-white p-5 rounded-3xl shadow-2xl flex flex-col w-full max-h-[90vh] transform transition-all"
          :class="maxWidth || 'max-w-2xl'"
        >
          <div v-if="title" class="flex justify-between items-center p-6 border-b border-gray-300 shrink-0">
            <h3 class="text-3xl font-bold ">{{ title }}</h3>
            <button @click="close" class="cursor-pointer">
              <UIcon name="i-lucide-x" class="size-5" />
            </button>
          </div>

          <div class="p-8 overflow-y-auto">
            <slot />
          </div>

          <div v-if="$slots.footer" class="p-6 border-t border-gray-100 shrink-0 bg-gray-50 rounded-b-3xl">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>