<script setup lang="ts">
import { ref, computed } from 'vue'

const students = [
  { id: 1, name: 'Rizqya Adzra Zahira Sudrajat', nis: '12310021', class: 'PPLG XII-5' },
  { id: 2, name: 'Shapira Bunga Aulia', nis: '12310047', class: 'PPLG XII-5' },
  { id: 3, name: 'Shayma Choula Febryna', nis: '12310048', class: 'PPLG XII-5' }
]

const selectedStudent = ref<typeof students[0] | undefined>(undefined)

const searchQuery = ref('')

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students
  
  return students.filter(student => {
    return student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           student.nis.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           student.class.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})
</script>

<template>
  <div class="w-60">
    <USelectMenu 
      v-model="selectedStudent" 
      :items="filteredStudents" 
      trailing-icon=""
      variant="none"
      :ui="{
        content: 'bg-[#DFE3F0]/80 backdrop-blur-md ring-0 border-none shadow-lg rounded-[32px] p-3',
        input: 'hidden h-0 w-0 p-0 m-0 border-none', 
        item: 'p-0 cursor-pointer transition-transform duration-200 data-[highlighted]:bg-transparent'
      }"
    >
      <template #default="{ open }">
        <button 
          type="button"
          :class="[
            'w-54 space-x-2 h-13 px-6 rounded-full flex items-center justify-between font-medium text-black outline-none transition-all duration-300 cursor-pointer border-2',
            selectedStudent ? 'border-blue-500' : 'border-transparent',
            open ? 'bg-[#DFE3F0]' : 'bg-white hover:bg-[#DFE3F0] focus:bg-[#DFE3F0]'
          ]"
        >
        <span class="text-base truncate text-left flex-1 mr-2">
          {{ selectedStudent?.name || 'Siswa' }}
        </span>
          <UIcon 
            v-if="selectedStudent"
            name="i-lucide-x" 
            class="size-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" 
            @click.prevent.stop="selectedStudent = undefined"
          />
          <UIcon 
            v-if="!selectedStudent"
            name="i-lucide-chevron-down" 
            :class="['size-5 text-black transition-transform duration-200', open ? 'rotate-180' : '']" 
          />
        </button>
      </template>

      <template #content-top>
        <div class="mb-3">
          <UiInput 
            v-model="searchQuery"
            placeholder="Cari Siswa..." 
            variant="search" 
            icon="i-lucide-search" 
            class="w-full bg-white rounded-full shadow-sm"
            @click.stop
          />
        </div>
      </template>

      <template #item="{ item }">
        <div class="w-full my-1 bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm text-left transition-all duration-300 hover:bg-[#DFE3F0] cursor-pointer">
          <div class="size-12 rounded-full bg-gray-200 shrink-0 border border-gray-100"></div>
          <div class="flex flex-col items-start min-w-0">
            <span class="font-bold text-black text-[15px] leading-tight truncate w-full">
              {{ item.name }}
            </span>
            <span class="text-xs text-gray-500 mt-1 font-medium">
              {{ item.nis }} • {{ item.class }}
            </span>
          </div>
        </div>
  </template>
    </USelectMenu>
  </div>
</template>