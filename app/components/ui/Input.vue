<script setup lang="ts">
type InputVariant = 'auth' | 'search' | 'gray' | 'white'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  variant?: InputVariant
  showForgot?: boolean
  icon?: string 
  error?: string
}>(), {
  modelValue: '',
  type: 'text',
  variant: 'auth',
  showForgot: false,
  error: ''
})

const emit = defineEmits(['update:modelValue'])

const inputVariants: Record<InputVariant, string> = {
  auth: [
    'h-[60px] w-full rounded-[20px] px-6',
    'bg-transparent border border-gray-500 text-black',
    'focus:border-black focus:ring-1 focus:ring-black',
    'placeholder:text-gray-500 outline-none transition-all duration-300'
  ].join(' '),
  
  search: [
    'h-[48px] md:h-[64px] w-full rounded-full pl-12 md:pl-16 pr-4 md:pr-6', 
    'bg-white text-sm md:text-base text-black font-medium border border-gray-100 md:border-2 md:border-transparent',
    'hover:border-blue-500 focus:border-blue-500', 
    'placeholder:text-gray-400 md:placeholder:text-tertiary outline-none transition-all duration-300'
  ].join(' '),

  gray: [
    'h-[60px] w-full rounded-[20px] px-6',
    'bg-gray-100 text-black border border-transparent',
    'focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:bg-white',
    'placeholder:text-tertiary outline-none transition-all duration-300'
  ].join(' '),

  white: [
    'h-[60px] w-full rounded-4xl px-6',
    'bg-white text-black border border-transparent',
    'focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:bg-white',
    'placeholder:text-gray-500 outline-none transition-all duration-300'
  ].join(' ')
}
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    
    <div v-if="variant === 'auth' && label" class="flex justify-between items-end px-2">
      <label 
        class="font-bold text-base Montserrat transition-colors duration-300"
        :class="error ? 'text-red-500' : 'text-black'"
      >
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
        class="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 size-4 md:size-6 transition-colors"
        :class="error ? 'text-red-500' : 'text-black'"
      />

      <textarea
        v-if="type === 'textarea'"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        :placeholder="placeholder"
        rows="4"
        :class="[
          inputVariants[variant],
          'h-auto py-4 resize-y min-h-30',
          error ? 'border-red-500! focus:border-red-500! focus:ring-red-500! text-red-500! placeholder:text-red-300!' : ''
        ]"
      ></textarea>

      <input
        v-else
        :type="type"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :class="[
          inputVariants[variant],
          error ? 'border-red-500! focus:border-red-500! focus:ring-red-500! text-red-500! placeholder:text-red-300!' : ''
        ]"
      />
    </div>

    <span v-if="error" class="text-red-500 text-xs font-medium px-4">
      {{ error }}
    </span>

  </div>
</template>