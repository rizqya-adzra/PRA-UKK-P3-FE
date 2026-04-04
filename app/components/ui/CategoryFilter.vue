<script setup lang="ts">
import { computed } from 'vue'
import { useCategory } from '~/composables/api/useCategory'

const props = defineProps<{
  modelValue?: string | number | null
}>()

const emit = defineEmits(['update:modelValue'])

const { fetchCategories } = useCategory()
const { data: response, pending } = await fetchCategories()

const categories = computed(() => {
  if (response.value?.data) {
    return response.value.data.map((cat: any) => ({
      id: cat.id,
      label: cat.name
    }))
  }
  return []
})

const selectCategory = (id: string) => {
  if (props.modelValue === id) {
    emit('update:modelValue', '')
  } else {
    emit('update:modelValue', id)
  }
}

const getActiveColorClass = (label: string) => {
  const text = label.toLowerCase()
  
  if (text.includes('fasilitas')) return 'text-purple' 
  if (text.includes('lingkungan')) return 'text-green' 
  if (text.includes('pendidikan')) return 'text-red' 
  if (text.includes('karakter')) return 'text-yellow'
  if (text.includes('ibadah')) return 'text-[#BA36C0]'
  if (text.includes('kesehatan')) return 'text-[#36BCC0]'
  
  return 'text-[#6D5DFF]' 
}
</script>

<template>
  <div class="inline-flex items-center p-1.5 md:p-2 gap-1 bg-[#EFEFEF] rounded-full overflow-x-auto w-full md:w-auto [&::-webkit-scrollbar]:hidden">
    
    <div v-if="pending" class="px-4 md:px-6 py-1.5 md:py-2.5 text-sm md:text-[15px] font-bold text-gray-500 whitespace-nowrap">
      Memuat kategori...
    </div>

    <button
      v-else
      v-for="category in categories"
      :key="category.id"
      type="button"
      @click="selectCategory(category.id)"
      class="px-4 md:px-6 py-1.5 md:py-2.5 rounded-full font-bold text-sm md:text-[15px] transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0"
      :class="[
        modelValue === category.id 
          ? `bg-white ${getActiveColorClass(category.label)}` 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
      ]"
    >
      {{ category.label }}
    </button>
    
  </div>
</template>