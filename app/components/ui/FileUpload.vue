<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: File | null
  error?: string
  accept?: string
}>(), {
  modelValue: null,
  error: '',
  accept: '.jpg,.jpeg,.png,.webp,.mp4,.mov,.pdf,.doc,.docx'
})

const emit = defineEmits(['file-selected'])

const displayText = computed(() => {
  if (props.modelValue && props.modelValue.name) {
    return props.modelValue.name
  }
  return 'File'
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    emit('file-selected', target.files[0])
    
    target.value = ''
  }
}
</script>

<template>
  <div class="flex flex-col gap-1 w-fit">
    
    <label 
      class="w-28 space-x-1 h-13 px-6 rounded-full flex items-center justify-between text-sm font-medium outline-none transition-all duration-300 cursor-pointer hover:bg-[#E9ECF6]"
      :class="error ? 'border-red-500! text-red-500!' : ''"
    >
      <span class="truncate max-w-50">{{ displayText }}</span>
      
      <UIcon name="i-lucide-paperclip" class="size-5 shrink-0" />
      
      <input 
        type="file" 
        class="hidden" 
        :accept="accept"
        @change="handleFileChange"
      />
    </label>

    <span v-if="error" class="text-red-500 text-xs px-4">
      {{ error }}
    </span>

  </div>
</template>