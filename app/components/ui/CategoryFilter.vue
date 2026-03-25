<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | number | null
}>()

const emit = defineEmits(['update:modelValue'])

const categories = [
  { id: 'bea0bfff-b4a7-4dae-a8a3-78ea6756e703', label: 'Fasilitas' },
  { id: 'd4b3f29e-0995-4709-9825-0ca48a87dbb0', label: 'Lingkungan' },
  { id: '4a7b9e07-9a43-4426-9eef-74987aa467a5', label: 'Pendidikan' },
  { id: '3541c7b7-ec66-402f-bea1-6d2dc63752a7', label: 'Karakter' },
  { id: '60180a56-2df6-4b2e-bb32-43844d7afb86', label: 'Ibadah' }
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