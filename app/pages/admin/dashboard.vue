<script setup lang="ts">
import { useAspiration } from '~/composables/api/useAspiration'
import { useRouter } from 'vue-router'
import defaultImage from '~/assets/images/core_profile.jpg'

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const { fetchAspirations, fetchAspirationStats, fetchAspirationCategoryStats } = useAspiration() 
const { data: response, pending } = await fetchAspirations()
const { data: stats } = await fetchAspirationStats()
const { data: category_stats } = await fetchAspirationCategoryStats()
const router = useRouter()

const topStudents = [
  { id: 1, name: 'Rizqya Adzra Zahira Sudrajat', nis: '12310021 | PPLG XII-5' },
  { id: 2, name: 'Rizqya Adzra Zahira Sudrajat', nis: '12310021 | PPLG XII-5' },
  { id: 3, name: 'Rizqya Adzra Zahira Sudrajat', nis: '12310021 | PPLG XII-5' },
  { id: 4, name: 'Rizqya Adzra Zahira Sudrajat', nis: '12310021 | PPLG XII-5' },
  { id: 5, name: 'Rizqya Adzra Zahira Sudrajat', nis: '12310021 | PPLG XII-5' },
  { id: 6, name: 'Rizqya Adzra Zahira Sudrajat', nis: '12310021 | PPLG XII-5' },
]

const listAspirasi = computed(() => response.value?.data.slice(0, 4) || [])

const goToDetail = (id: string) => {
  router.push(`/admin/aspiration/detail/${id}`)
}
</script>

<template>
  <div class="mb-6">
    <p class="text-4xl font-bold">Selamat datang Admin!</p>
    <p class="text-xs tracking-[0.2em] text-gray-500 mt-2">Thursday, 26 February 2026</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
    <div class="lg:col-span-4 flex flex-col gap-6">
      <div class="bg-white rounded-4xl p-6">
        <div class="flex items-center justify-between font-bold mb-5">
          <p>Statistik Laporan</p>
          <UIcon name="i-lucide-filter" class="size-5 text-gray-600 cursor-pointer" />
        </div>
        
        <div class="grid grid-cols-3 gap-2">
          <div class="flex flex-col items-center text-center gap-3 bg-[#E0FFE4] text-green border border-green hover:bg-green hover:text-white transition-all duration-300 rounded-4xl px-4 py-10">
            <UIcon name="i-lucide-chart-pie" class="size-6" />
            <p class="text-3xl font-bold">{{ category_stats?.data?.fasilitas || 0 }}</p>
            <p class="font-medium text-sm">Selesai</p>
          </div>
          
          <div class="flex flex-col items-center text-center gap-3 bg-[#E6EBFF] text-purple border border-purple hover:bg-purple hover:text-white transition-all duration-300 rounded-4xl px-4 py-10">
            <UIcon name="i-lucide-tree-pine" class="size-6" />
            <p class="text-3xl font-bold">{{ category_stats?.data?.lingkungan || 0 }}</p>
            <p class="font-medium text-sm">Diproses</p>
          </div>
          
          <div class="flex flex-col items-center text-center gap-3 bg-[#FFF2D9] text-yellow border border-yellow hover:bg-yellow hover:text-white transition-all duration-300 rounded-4xl px-4 py-10">
            <UIcon name="i-lucide-graduation-cap" class="size-6" />
            <p class="text-3xl font-bold">{{ category_stats?.data?.pendidikan || 0 }}</p>
            <p class="font-medium text-sm">Menunggu</p>
          </div>
        </div>

        <div class="mt-5 space-y-2">
          <div class="w-full bg-gray-200 rounded-full h-2.5 flex items-center">
            <div class="bg-electric-blue h-2.5 rounded-full" style="width: 85%"></div>
          </div>
          <p class="text-center text-[10px] font-bold text-gray-400">85% ASPIRASI TERATASI</p>
        </div>
      </div>

      <div class="bg-white rounded-4xl p-6">
        <div class="flex items-center justify-between font-bold mb-5">
          <p>Konstribusi Siswa</p>
          <UIcon name="i-lucide-building-2" class="size-5 text-gray-600" />
        </div>
        
        <div class="flex flex-col gap-3">
          <div 
            v-for="student in topStudents" 
            :key="student.id" 
            class="flex items-center gap-4 bg-[#F6F6F6] p-3 rounded-2xl px-4 py-6"
          >
            <img :src="defaultImage" alt="Profile" class="object-cover rounded-full w-10 h-10 bg-gray-300" />  
            <div class="flex flex-col overflow-hidden space-y-1">
              <span class="text-sm font-bold text-black truncate">{{ student.name }}</span>
              <span class="text-xs text-gray-500 truncate">{{ student.nis }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:col-span-8 flex flex-col">
      <div class="flex items-center justify-between font-bold mb-3 px-2">
        <p>Aspirasi terbaru</p>
        <NuxtLink to="/admin/aspiration/list-page">
          <p class="text-electric-blue text-sm cursor-pointer hover:underline">Lihat Semua</p>
        </NuxtLink>
      </div>
      
      <div v-if="pending" class="w-full flex justify-center py-24">
        <p class="text-gray-500 animate-pulse font-medium">Sedang memuat data...</p>
      </div>
        
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UiCard 
          v-for="item in listAspirasi" 
          :key="item.id" 
          :report="item" 
          @click="goToDetail(item.id)" 
        />
      </div>
    </div>
  </div>
</template>