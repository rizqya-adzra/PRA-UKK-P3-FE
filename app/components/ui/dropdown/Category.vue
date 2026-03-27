<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | number
}>()

const emit = defineEmits(['update:modelValue'])

const categories = [
  { id: '9c419047-3b39-4b2b-a42b-34101fd166c9', label: 'Fasilitas' as const},
  { id: 'b87f6a78-10a0-422a-a22e-ecdec921f702', label: 'Lingkungan' as const},
  { id: 'c2dc2a64-c057-4845-bedc-2364dea0ad45', label: 'Pendidikan' as const},
  { id: '62c1cee5-b99f-456c-b24a-f2b49fad3017', label: 'Karakter' as const},
  { id: '96d3c761-94fe-4ae8-a68e-89502144498e', label: 'Ibadah' as const}
]

const initialCategory = categories.find(c => c.id === props.modelValue) || undefined
const selected = ref(initialCategory)

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
      :items="categories"
      trailing-icon=""
      variant="none"
      :ui="{
        content: 'bg-white/80 backdrop-blur-md ring-0 border-none rounded-[16px] md:rounded-2xl p-2 md:p-3 min-w-[100px] md:min-w-[120px]',
        input: 'hidden h-0 w-0 p-0 m-0 border-none', 
        item: 'p-0 cursor-pointer transition-transform duration-200 data-[highlighted]:bg-tertiary/5'
      }"
    >
      <template #default="{ open }">
        <button 
          type="button"
          :class="[
            'h-8 md:h-10 w-28 md:w-38 space-x-2 px-4 md:px-6 rounded-full flex items-center justify-between font-bold text-tertiary outline-none transition-all duration-300 cursor-pointer border md:border-2',
            selected ? 'border-blue-500' : 'border-transparent',
            open ? 'bg-[#E9ECF6]' : 'bg-white hover:bg-[#E9ECF6] focus:bg-[#E9ECF6]'
          ]"
        >
          <span class="text-sm truncate">{{ selected?.label || 'Kategori' }}</span>
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
          <UiLabel 
            :text="item.label" 
            variant="solid" 
          />
      </template>
    </USelectMenu>
  </div>
</template>