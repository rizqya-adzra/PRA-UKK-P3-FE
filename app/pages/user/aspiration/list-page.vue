<script setup lang="ts">
import { useAspiration } from '~/composables/api/useAspiration'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { fetchAspirations } = useAspiration()
const { data: response, pending, error, refresh } = await fetchAspirations()
const listAspirasi = computed(() => response.value?.data || [])
const router = useRouter()

const goToDetail = (id: string) => {
  console.log("ID yang diklik:", id)
  router.push(`/user/aspiration/detail/${id}`)
}
</script>

<template>
  <div class="border-6 border-white p-6 rounded-4xl flex justify-between items-center">
    <p class="font-bold">Tambah Aspirasi yang <br> ingin kamu sampaikan</p>
    <NuxtLink to="/user/aspiration/create">
      <UiButton label="BUAT ASPIRASI "variant="imperative" color="gradient" />
    </NuxtLink>
  </div>

  <svg class="w-full text-gray-300 my-14" height="4" xmlns="http://www.w3.org/2000/svg">
    <line 
      x1="2" 
      y1="2" 
      x2="100%" 
      y2="2" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-dasharray="16 20" 
      stroke-linecap="round" 
    />
  </svg>

  <div class="flex flex-col items-center justify-center gap-7">
    <p class="text-3xl font-bold text-center">Semua List Aspirasi</p>
    <div class="space-y-1 w-full max-w-2xl">
      <UiInput placeholder="Cari aspirasi..." variant="search" icon="i-lucide-search"/>
      <div class="flex items-center justify-center gap-2">
        <UiDropdownDate />    
        <UiDropdownCategory />
        <UiDropdownStatus />    
      </div>
    </div>
  </div>

  <div class="w-full my-20">
    <div v-if="listAspirasi.length === 0" class="bg-white rounded-4xl w-full px-12 py-24 flex justify-center items-center">
      <p class="text-center text-gray-500">Masih kosong nih yuk bikin dulu!</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiCard 
        v-for="item in listAspirasi" 
        :key="item.id" 
        :report="item" 
        @click="goToDetail(item.id)" class="cursor-pointer"
      />
    </div>
  </div>
</template>