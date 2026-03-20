<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: string | number
}>()

const emit = defineEmits(['update:modelValue'])

const pageSizes = [
  { id: 10, label: '10' as const },
  { id: 20, label: '20' as const },
  { id: 50, label: '50' as const },
]

const initialSize = pageSizes.find(p => p.id === Number(props.modelValue)) || pageSizes[0]
const selected = ref(initialSize)

watch(selected, (newValue) => {
  if (newValue) {
    emit('update:modelValue', newValue.id)
  }
})
</script>

<template>
  <div>
    <USelectMenu 
      v-model="selected" 
      :items="pageSizes"
      trailing-icon=""
      variant="none"
      :ui="{
        content: 'bg-[#E9ECF6]/80 backdrop-blur-md ring-0 border-none rounded-2xl p-3 min-w-[120px]',
        input: 'hidden h-0 w-0 p-0 m-0 border-none', 
        item: 'hover:bg-transparent data-[highlighted]:bg-black/5 justify-center p-2 cursor-pointer transition-colors rounded-xl'
      }"
    >
      <template #default="{ open }">
        <button 
          type="button"
          :class="[
            'h-10 w-38 rounded-full flex items-center justify-center gap-2 outline-none transition-all duration-300 cursor-pointer border-2 border-gray-500',
            open ? 'bg-[#E9ECF6]' : 'bg-transparent hover:bg-[#E9ECF6]/50 focus:bg-[#E9ECF6]/50'
          ]"
        >
          <span class="text-sm font-normal text-gray-500 tracking-wide">Pagination</span>
          <span class="text-sm font-bold text-black">{{ selected?.label }}</span>
        </button>
      </template>

      <template #item="{ item }">
        <span class="font-bold text-sm text-black text-center w-full">
          {{ item.label }}
        </span>
      </template>
    </USelectMenu>
  </div>
</template>