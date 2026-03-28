<script setup lang="ts">
import { useAspiration } from '~/composables/api/useAspiration'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import defaultImage from '~/assets/images/core_profile.jpg'

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const { fetchAspirations, fetchAspirationStats, fetchUserRanking } = useAspiration() 
const { data: response, pending } = await fetchAspirations()
const { data: stats } = await fetchAspirationStats()
const { data: rankingResponse } = await fetchUserRanking() 
const router = useRouter()
const topStudents = computed(() => rankingResponse.value?.data?.slice(0, 6) || [])

const listAspirasi = computed(() => response.value?.data.slice(0, 4) || [])

const goToDetail = (id: string) => {
  router.push(`/admin/aspiration/detail/${id}`)
}

const todayDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  return new Date().toLocaleDateString('en-US', options)
})

useHead({
  title: 'Dashboard Admin | Aspiration',
  meta: [
    { name: 'description', content: 'Kirim aspirasi kamu di sini.' }
  ]
})
</script>

<template>
  <div class="mb-6 md:mb-8 text-center md:text-left">
    <p class="text-2xl sm:text-3xl lg:text-4xl font-bold">Selamat datang Admin!</p>
    <p class="text-[10px] sm:text-xs tracking-[0.2em] text-gray-500 mt-2 uppercase">{{ todayDate }}</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start mb-6 md:mb-0">
    
    <div class="lg:col-span-4 flex flex-col gap-5 lg:gap-6">
      
      <div class="bg-white rounded-3xl md:rounded-4xl p-4 md:p-6 border border-gray-50">
        <div class="flex items-center justify-between font-bold mb-4 md:mb-5">
          <p class="text-sm md:text-base">Statistik Laporan</p>
          <UIcon name="i-lucide-filter" class="size-4 md:size-5 text-gray-600 cursor-pointer hover:text-black transition-colors" />
        </div>
        
        <div class="grid grid-cols-3 gap-2 md:gap-3">
          <div class="flex flex-col items-center text-center gap-2 md:gap-3 bg-[#E0FFE4] text-green-600 border border-green-500 hover:bg-green-500 hover:text-white transition-all duration-300 rounded-2xl md:rounded-3xl px-1 py-5 md:py-8 lg:py-10 cursor-default group">
            <UIcon name="i-lucide-chart-pie" class="size-5 md:size-6" />
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ stats?.data?.selesai || 0 }}</p>
            <p class="font-medium text-[10px] sm:text-xs md:text-sm">Selesai</p>
          </div>
          
          <div class="flex flex-col items-center text-center gap-2 md:gap-3 bg-[#E6EBFF] text-blue-600 border border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 rounded-2xl md:rounded-3xl px-1 py-5 md:py-8 lg:py-10 cursor-default group">
            <UIcon name="i-lucide-tree-pine" class="size-5 md:size-6" />
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ stats?.data?.proses || 0 }}</p>
            <p class="font-medium text-[10px] sm:text-xs md:text-sm">Diproses</p>
          </div>
          
          <div class="flex flex-col items-center text-center gap-2 md:gap-3 bg-[#FFF2D9] text-yellow-600 border border-yellow-500 hover:bg-yellow-500 hover:text-white transition-all duration-300 rounded-2xl md:rounded-3xl px-1 py-5 md:py-8 lg:py-10 cursor-default group">
            <UIcon name="i-lucide-graduation-cap" class="size-5 md:size-6" />
            <p class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ stats?.data?.menunggu || 0 }}</p>
            <p class="font-medium text-[10px] sm:text-xs md:text-sm">Menunggu</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl md:rounded-4xl p-4 md:p-6 border border-gray-50">
        <div class="flex items-center justify-between font-bold mb-4 md:mb-5">
          <p class="text-sm md:text-base">Kontribusi Siswa</p>
          <UIcon name="i-lucide-building-2" class="size-4 md:size-5 text-gray-600" />
        </div>
        
        <div class="flex flex-col gap-2 md:gap-3">
          <div 
            v-for="(student, index) in topStudents" 
            :key="student.id" 
            class="flex items-center gap-3 md:gap-4 bg-[#F6F6F6] p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-gray-100 transition-colors duration-200"
          >
            <img 
              :src="student.image || defaultImage" 
              alt="Profile" 
              class="object-cover rounded-full w-10 h-10 md:w-11 md:h-11 bg-gray-300 shrink-0" 
            /> 
            
            <div class="flex flex-col min-w-0 flex-1 space-y-0.5">
              <span class="text-xs md:text-sm font-bold text-gray-900 truncate">
                {{ student.name }}
              </span>
              <span class="text-[10px] md:text-[11px] text-gray-500 truncate flex items-center gap-1">
                <span class="font-bold text-blue-500">#{{ index + 1 }}</span>
                <span v-if="student.nis" class="text-gray-300">|</span>
                <span v-if="student.nis">{{ student.nis }}</span>
                <span v-if="student.rombel" class="text-gray-300">|</span>
                <span v-if="student.rombel" class="truncate">{{ student.rombel }}</span>
              </span>
            </div>

            <div class="ml-auto shrink-0 flex items-center justify-center font-bold bg-white rounded-full w-8 h-8 md:w-9 md:h-9 text-blue-500 text-xs">
              {{ student.aspiration_count }}
            </div>
          </div>

          <div v-if="topStudents.length === 0" class="text-center text-xs md:text-sm text-gray-400 py-4">
            Belum ada data kontribusi.
          </div>
        </div>
      </div>
    </div>

    <div class="lg:col-span-8 flex flex-col mt-2 lg:mt-0">
      <div class="flex items-center justify-between font-bold mb-3 md:mb-4 px-1 md:px-2">
        <p class="text-base md:text-lg">Aspirasi Terbaru</p>
        <NuxtLink to="/admin/aspiration/list-page">
          <p class="text-blue-500 text-xs md:text-sm cursor-pointer hover:underline">Lihat Semua</p>
        </NuxtLink>
      </div>
      
      <div v-if="pending" class="w-full flex justify-center py-16 md:py-24">
        <div class="flex flex-col items-center gap-2">
          <UIcon name="i-lucide-loader-2" class="size-8 text-blue-500 animate-spin" />
          <p class="text-gray-500 text-sm font-medium">Memuat data...</p>
        </div>
      </div>
        
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <UiCardDefault 
          v-for="item in listAspirasi" 
          :key="item.id" 
          :report="item" 
          @click="goToDetail(item.id)" 
        />
      </div>
    </div>
    
  </div>
</template>