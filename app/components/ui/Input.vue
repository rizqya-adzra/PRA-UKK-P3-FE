<script setup lang="ts">
type InputVariant = 'auth' | 'search'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  variant?: InputVariant
  showForgot?: boolean
  icon?: string 
}>(), {
  modelValue: '',
  type: 'text',
  variant: 'auth',
  showForgot: false
})

const emit = defineEmits(['update:modelValue'])

const inputVariants: Record<InputVariant, string> = {
  auth: [
    'h-[60px] w-full rounded-[20px] px-6',
    'bg-transparent border border-gray-500 text-white',
    'focus:border-white focus:ring-1 focus:ring-white',
    'placeholder:text-gray-500 outline-none transition-all duration-300'
  ].join(' '),
  
  search: [
    'h-[64px] w-full rounded-full pl-16 pr-6', 
    'bg-white text-black font-medium border-2 border-transparent',
    'hover:border-blue-500 focus:border-blue-500', 
    'placeholder:text-gray-400 outline-none transition-all duration-300 shadow-sm'
  ].join(' ')
}
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    
    <div v-if="variant === 'auth' && label" class="flex justify-between items-end px-2">
      <label class="font-bold text-base Montserrat text-white">
        {{ label }}
      </label>
      
      <NuxtLink 
        v-if="showForgot" 
        to="/forgot-password" 
        class="text-sm font-medium text-blue-500 hover:text-blue-400 hover:underline transition-colors"
      >
        Forgot Password?
      </NuxtLink>
    </div>

    <div class="relative w-full">
      <UIcon
        v-if="icon"
        :name="icon"
        class="absolute left-6 top-1/2 -translate-y-1/2 size-6 text-black transition-colors"
      />

      <input
        :type="type"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :class="inputVariants[variant]"
      />
    </div>

  </div>
</template>