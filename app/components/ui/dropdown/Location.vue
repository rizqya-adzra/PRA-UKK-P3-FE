<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocation } from '~/composables/api/useLocation'

const props = defineProps<{
  modelValue?: string | number
}>()

const emit = defineEmits(['update:modelValue'])

const { fetchLocations } = useLocation()
const { data: response, pending } = await fetchLocations()

const locations = computed(() => {
  if (response.value?.data) {
    return response.value.data.map(loc => ({
      id: loc.id,
      label: loc.name
    }))
    .slice(0, 10)
  }
  return []
})

const selected = ref(locations.value.find(c => c.id === props.modelValue) || undefined)

watch(() => props.modelValue, (newVal) => {
  selected.value = locations.value.find(c => c.id === newVal) || undefined
})

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
      :disabled="pending"
      :ui="{
        content: 'bg-white/80 backdrop-blur-md ring-0 border-none rounded-[16px] md:rounded-2xl p-2 md:p-3 min-w-[100px] md:min-w-[120px]',
        item: 'p-0 cursor-pointer transition-transform duration-200 data-[highlighted]:bg-tertiary/5 px-4 rounded-xl'
      }"
    >
      <template #default="{ open }">
        <button 
          type="button"
          :disabled="pending"
          :class="[
            'h-8 md:h-10 w-28 md:w-38 space-x-2 px-4 md:px-6 rounded-full flex items-center justify-between font-bold text-tertiary outline-none transition-all duration-300 border md:border-2',
            pending ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
            selected ? 'border-blue-500' : 'border-transparent',
            open ? 'bg-[#E9ECF6]' : 'bg-white hover:bg-[#E9ECF6] focus:bg-[#E9ECF6]'
          ]"
        >
          <span class="text-sm truncate">
            {{ pending ? 'Memuat...' : (selected?.label || 'Lokasi') }}
          </span>
          
          <UIcon 
            v-if="selected && !pending"
            name="i-lucide-x" 
            class="size-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" 
            @click.prevent.stop="selected = undefined"
          />
          <UIcon 
            v-if="!selected || pending"
            name="i-lucide-chevron-down" 
            :class="['size-5 text-tertiary transition-transform duration-200', open ? 'rotate-180' : '']" 
          />
        </button>
      </template>

      <template #item="{ item }">
        <p class="font-semibold text-tertiary hover:text-black duration-300 my-2">{{ item.label }}</p>
      </template>
    </USelectMenu>
  </div>
</template>