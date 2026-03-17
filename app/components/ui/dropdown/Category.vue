<script setup lang="ts">
const categories = [
  { id: 1, label: 'Fasilitas', color: 'purple' as const},
  { id: 2, label: 'Lingkungan', color: 'light-green' as const},
  { id: 3, label: 'Pendidikan', color: 'red' as const},
  { id: 4, label: 'Karakter', color: 'orange' as const},
  { id: 5, label: 'Ibadah', color: 'pink' as const}
]

const selected = ref(categories[0])
</script>

<template>
  <div class="w-60">
    <USelectMenu 
      v-model="selected" 
      :items="categories"
      trailing-icon=""
      variant="none"
      :ui="{
        content: 'bg-[#DFE3F0]/80 backdrop-blur-md ring-0 border-none shadow-lg rounded-2xl p-3',
        input: 'hidden h-0 w-0 p-0 m-0 border-none', 
        item: 'hover:bg-transparent data-[highlighted]:bg-transparent justify-start p-2 cursor-pointer'
      }"
    >
      <template #default="{ open }">
        <button 
          type="button"
          :class="[
            'w-54 space-x-2 h-13 px-6 rounded-full flex items-center justify-between font-medium text-black outline-none transition-all duration-300 cursor-pointer border-2',
            selected ? 'border-blue-500' : 'border-transparent',
            open ? 'bg-[#DFE3F0]' : 'bg-white hover:bg-[#DFE3F0] focus:bg-[#DFE3F0]'
          ]"
        >
          <span class="text-base">{{ selected?.label || 'Kategori' }}</span>
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
            :color="item.color" 
          />
      </template>
    </USelectMenu>
  </div>
</template>