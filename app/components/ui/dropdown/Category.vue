<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | number
}>()

const emit = defineEmits(['update:modelValue'])

const categories = [
  { id: 'bea0bfff-b4a7-4dae-a8a3-78ea6756e703', label: 'Fasilitas' as const},
  { id: 'd4b3f29e-0995-4709-9825-0ca48a87dbb0', label: 'Lingkungan' as const},
  { id: '4a7b9e07-9a43-4426-9eef-74987aa467a5', label: 'Pendidikan' as const},
  { id: '3541c7b7-ec66-402f-bea1-6d2dc63752a7', label: 'Karakter' as const},
  { id: '60180a56-2df6-4b2e-bb32-43844d7afb86', label: 'Ibadah' as const}
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
        content: 'bg-[#E9ECF6]/80 backdrop-blur-md ring-0 border-none rounded-2xl p-3',
        input: 'hidden h-0 w-0 p-0 m-0 border-none', 
        item: 'hover:bg-transparent data-[highlighted]:bg-transparent justify-start p-2 cursor-pointer'
      }"
    >
      <template #default="{ open }">
        <button 
          type="button"
          :class="[
            'w-36 space-x-2 h-13 px-6 rounded-full flex items-center justify-between font-medium text-black outline-none transition-all duration-300 cursor-pointer border-2',
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
            :class="['size-5 text-black transition-transform duration-200', open ? 'rotate-180' : '']" 
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