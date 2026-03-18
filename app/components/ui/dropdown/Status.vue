<script setup lang="ts">
const statuses = [
  { id: 1, label: 'Menunggu' as const },
  { id: 2, label: 'Diproses' as const },
  { id: 3, label: 'Selesai' as const },
  { id: 4, label: 'Dibatalkan' as const }
]

const selected = ref(statuses[0])
</script>

<template>
  <div>
    <USelectMenu 
      v-model="selected" 
      :items="statuses"
      variant="none"
      trailing-icon=""
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
          <span class="text-sm truncate">{{ selected?.label || 'Status' }}</span>
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
            variant="outline" 
          />
      </template>
    </USelectMenu>
  </div>
</template>