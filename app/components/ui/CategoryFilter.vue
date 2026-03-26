<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | number | null
}>()

const emit = defineEmits(['update:modelValue'])

const categories = [
  { id: '9c419047-3b39-4b2b-a42b-34101fd166c9', label: 'Fasilitas' },
  { id: 'b87f6a78-10a0-422a-a22e-ecdec921f702', label: 'Lingkungan' },
  { id: 'c2dc2a64-c057-4845-bedc-2364dea0ad45', label: 'Pendidikan' },
  { id: '62c1cee5-b99f-456c-b24a-f2b49fad3017', label: 'Karakter' },
  { id: '96d3c761-94fe-4ae8-a68e-89502144498e', label: 'Ibadah' }
]

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
  
  return 'text-[#6D5DFF]' 
}
</script>

<template>
  <div class="inline-flex items-center p-2 gap-1 bg-[#EFEFEF] rounded-full overflow-x-auto">
    
    <button
      v-for="category in categories"
      :key="category.id"
      type="button"
      @click="selectCategory(category.id)"
      class="px-6 py-2.5 rounded-full font-bold text-[15px] transition-all duration-300 cursor-pointer whitespace-nowrap"
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