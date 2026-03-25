<script setup lang="ts">
import { useAspiration } from '~/composables/api/useAspiration'
import { useRouter } from 'vue-router'

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

const listAspirasi = computed(() => response.value?.data.slice(0, 3) || [])

const goToDetail = (id: string) => {
  router.push(`/admin/aspiration/detail/${id}`)
}
</script>

<template>
  <div class="space-y-1 mb-6">
    <p class="text-3xl font-bold">Hello <span class="text-electric-blue">Admin!</span></p>
    <p class="text-sm tracking-[0.4em]">Thursday, 26 February 2026</p>
  </div>
  <div class="flex items-start justify-start gap-7">
    <div class="flex flex-col gap-5 items-center">
      <div class="bg-white rounded-4xl px-12 py-8 space-y-6 w-full">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-3xl font-bold">Semua Aspirasi</p>
            <p class="text-sm">Berdasarkan total aspirasi dan kategori terbanyak.</p>
          </div>
          <UIcon name="i-lucide-funnel" class="size-7" />
        </div>
        <div class="flex items-center justify-center gap-12">
          <div class="flex gap-4 items-center">
            <p class="text-6xl font-bold">{{ stats?.data?.selesai || 0 }}</p>
            <p class="font-bold leading-tight">Aspirasi yang <br> dilaksanakan</p>
          </div>
          <div class="border border-black h-10"></div>
          <div class="flex gap-4 items-center">
            <p class="text-6xl font-bold">{{ stats?.data?.proses || 0 }}</p>
            <p class="font-bold leading-tight">Masih dalam <br> proses</p>
          </div>
          <div class="border border-black h-10"></div>
          <div class="flex gap-4 items-center">
            <p class="text-6xl font-bold">{{ stats?.data?.menunggu || 0 }}</p>
            <p class="font-bold leading-tight">Masih menunggu <br> balasan</p>
          </div>
        </div>
        <svg class="w-full text-gray-300 my-7" height="6" xmlns="http://www.w3.org/2000/svg">
          <line 
            x1="2" 
            y1="2" 
            x2="100%" 
            y2="2" 
            stroke="currentColor" 
            stroke-width="6" 
            stroke-dasharray="56 38" 
            stroke-linecap="round" 
          />
        </svg>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <div class="flex flex-col items-center text-center gap-3 bg-[#151518] hover:bg-[#6D5DFF] transition-all duration-300 rounded-4xl px-4 py-6">
            <UIcon name="i-lucide-chart-pie" class="size-6 bg-white" />
            <p class="text-white text-3xl font-bold">{{ category_stats?.data?.fasilitas || 0 }}</p>
            <p class="text-gray-300 font-medium text-xs">Fasilitas</p>
          </div>
          
          <div class="flex flex-col items-center text-center gap-3 bg-[#151518] hover:bg-[#9DC344] transition-all duration-300 rounded-4xl px-4 py-6">
            <UIcon name="i-lucide-tree-pine" class="size-6 bg-white" />
            <p class="text-white text-3xl font-bold">{{ category_stats?.data?.lingkungan || 0 }}</p>
            <p class="text-gray-300 font-medium text-xs">Lingkungan</p>
          </div>
          
          <div class="flex flex-col items-center text-center gap-3 bg-[#151518] hover:bg-[#C03648] transition-all duration-300 rounded-4xl px-4 py-6">
            <UIcon name="i-lucide-graduation-cap" class="size-6 bg-white" />
            <p class="text-white text-3xl font-bold">{{ category_stats?.data?.pendidikan || 0 }}</p>
            <p class="text-gray-300 font-medium text-xs">Pendidikan</p>
          </div>
          
          <div class="flex flex-col items-center text-center gap-3 bg-[#151518] hover:bg-[#C08736] transition-all duration-300 rounded-4xl px-4 py-6">
            <UIcon name="i-lucide-person-standing" class="size-6 bg-white" />
            <p class="text-white text-3xl font-bold">{{ category_stats?.data?.karakter || 0 }}</p>
            <p class="text-gray-300 font-medium text-xs">Karakter</p>
          </div>
          
          <div class="flex flex-col items-center text-center gap-3 bg-[#151518] hover:bg-[#BA36C0] transition-all duration-300 rounded-4xl px-4 py-6">
            <UIcon name="i-lucide-book" class="size-6 bg-white" />
            <p class="text-white text-3xl font-bold">{{ category_stats?.data?.ibadah || 0 }}</p>
            <p class="text-gray-300 font-medium text-xs">Ibadah</p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex gap-3 items-center">
          <p class="text-3xl font-bold">Aspirasi terbaru</p>
          <UIcon name="i-lucide-arrow-right" class="size-6" />
        </div>
      
        <div v-if="pending" class="w-full flex justify-center py-24">
          <p class="text-gray-500 animate-pulse font-medium">Sedang memuat data...</p>
        </div>
      
        <div v-else class="grid grid-cols-3 md:grid-cols-3 gap-4">
          <UiCardMini 
            v-for="item in listAspirasi " 
            :key="item.id" 
            :report="item" 
            @click="goToDetail(item.id)" 
            class="cursor-pointer"
          />
        </div>
      </div>
    </div>
  
    <div class="w-125 bg-[#1C1C1E] rounded-4xl p-8 text-white flex flex-col">
      <div class="flex items-start justify-between mb-2">
        <p class="text-2xl font-bold">Konstribusi Siswa</p>
        <UIcon name="i-lucide-building-2" class="size-6 text-white" />
      </div>
      <p class="text-xs text-gray-400 mb-6">Pada 1 bulan terakhir</p>
  
      <div class="flex flex-col gap-3 flex-1">
        <div v-for="student in topStudents" :key="student.id" class="bg-white rounded-2xl p-5 flex items-center gap-4 text-black">
          <div class="size-10 rounded-full bg-gray-200 shrink-0"></div>
          <div>
            <p class="text-sm font-bold">{{ student.name }}</p>
            <p class="text-sm text-gray-500">{{ student.nis }}</p>
          </div>
        </div>
      </div>
      
      <button class="mt-4 text-sm font-bold text-right hover:text-gray-300">Lihat lainnya</button>
    </div>
  </div>
</template>