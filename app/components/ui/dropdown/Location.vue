<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | number
}>()

const emit = defineEmits(['update:modelValue'])

const locations = [
  { id: '321a1c15-3b3e-4915-b694-caf6aa7cb8a1', label: 'R. 128' as const},
  { id: '88283971-ddc2-4439-8c2b-dba2566e2d7b', label: 'R. 129' as const},
]

const initialLocation = locations.find(c => c.id === props.modelValue) || undefined
const selected = ref(initialLocation)

watch(selected, (newValue) => {
  if (newValue) {
    emit('update:modelValue', newValue.id)
  } else {
    emit('update:modelValue', '')
  }
})
</script>

<template>
  <div>
    <USelectMenu 
      v-model="selected" 
      :items="locations"
      trailing-icon=""
      variant="none"
      :ui="{
        content: 'bg-[#E9ECF6]/80 backdrop-blur-md ring-0 border-none rounded-2xl p-3',
        input: 'hidden h-0 w-0 p-0 m-0 border-none', 
        item: 'hover:bg-transparent data-[highlighted]:bg-transparent justify-start p-2 cursor-pointer'
      }"
    >
      <template #default="{ open }">
        <button 
          type="button"
          :class="[
            'w-36 space-x-2 h-13 px-6 rounded-full flex items-center justify-between font-bold text-tertiary outline-none transition-all duration-300 cursor-pointer border-2',
            selected ? 'border-blue-500' : 'border-transparent',
            open ? 'bg-[#E9ECF6]' : 'bg-white hover:bg-[#E9ECF6] focus:bg-[#E9ECF6]'
          ]"
        >
          <span class="text-sm truncate">{{ selected?.label || 'Lokasi' }}</span>
          <UIcon 
            v-if="selected"
            name="i-lucide-x" 
            class="size-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" 
            @click.prevent.stop="selected = undefined"
          />
          <UIcon 
            v-if="!selected"
            name="i-lucide-chevron-down" 
            :class="['size-5 text-tertiary transition-transform duration-200', open ? 'rotate-180' : '']" 
          />
        </button>
      </template>

      <template #item="{ item }">
        <p class="font-semibold text-tertiary hover:text-black duration-300">{{ item.label }}</p>
      </template>
    </USelectMenu>
  </div>
</template>