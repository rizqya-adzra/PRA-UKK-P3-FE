<script setup lang="ts">
import { useAspiration } from '~/composables/api/useAspiration'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { fetchAspirations, fetchAspirationStats } = useAspiration()
const { data: response, pending, error, refresh } = await fetchAspirations()
const { data: stats } = await fetchAspirationStats()
const listAspirasi = computed(() => response.value?.data || [])
const router = useRouter()

const goToDetail = (id: string) => {
  console.log("ID yang diklik:", id)
  router.push(`/user/aspiration/detail/${id}`)
}
</script>

<template>
  <div class="flex flex-col justify-start items-start gap-6 md:gap-14 md:bg-transparent min-h-screen mb-16 md:mb-0">

    <img src="~/assets/images/user_welcome.jpg" alt="Welcome" class="w-full rounded-2xl md:rounded-none object-cover">

    <div class="w-full space-y-3 md:space-y-5">
      <p class="hidden md:block text-3xl font-bold">Bulan Ini Kamu Sudah Berkonstribusi</p>
      <p class="md:hidden text-md font-bold text-black">Konstribusi Kamu</p>

      <div class="hidden md:block bg-white rounded-4xl w-full p-12 space-y-9">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-3xl font-bold">Semua Aspirasi</p>
            <p>Berdasarkan total aspirasi dan kategori terbanyak.</p>    
          </div>
          <UIcon name="i-lucide-box" class="size-10" />
        </div>
        <div class="flex items-center justify-center gap-12">
          <div class="flex gap-4 items-center">
            <p class="text-5xl font-bold">{{ stats?.data?.total || 0 }}</p>
            <p class="font-bold leading-tight">Aspirasi yang <br> disampaikan</p>
          </div>
          <div class="border border-black h-10"></div>
          <div class="flex gap-4 items-center">
            <p class="text-5xl font-bold">{{ stats?.data?.selesai || 0 }}</p>
            <p class="font-bold leading-tight">Sudah <br> terlaksanakan</p>
          </div>
          <div class="border border-black h-10"></div>
          <div class="flex gap-4 items-center">
            <p class="text-5xl font-bold">{{ stats?.data?.proses || 0 }}</p>
            <p class="font-bold leading-tight">Masih dalam <br> proses</p>
          </div>
        </div>
      </div>

      <div class="flex md:hidden items-center justify-between gap-3 w-full">
        <div class="flex-1 bg-white rounded-2xl py-5 px-2 flex flex-col items-center justify-center text-center">
          <p class="text-2xl font-bold text-black mb-1">{{ stats?.data?.total || 0 }}</p>
          <p class="text-xs text-gray-600 font-medium leading-tight">Total<br>Aspirasi</p>
        </div>
        <div class="flex-1 bg-white rounded-2xl py-5 px-2 flex flex-col items-center justify-center text-center">
          <p class="text-2xl font-bold text-black mb-1">{{ stats?.data?.selesai || 0 }}</p>
          <p class="text-xs text-gray-600 font-medium leading-tight">Sudah<br>Selesai</p>
        </div>
        <div class="flex-1 bg-white rounded-2xl py-5 px-2 flex flex-col items-center justify-center text-center">
          <p class="text-2xl font-bold text-black mb-1">{{ stats?.data?.proses || 0 }}</p>
          <p class="text-xs text-gray-600 font-medium leading-tight">Masih<br>Proses</p>
        </div>
      </div>
    </div>

    <div class="w-full space-y-4 md:space-y-5 mt-2 md:mt-0">
      <div>
        <NuxtLink to="/user/aspiration/list-page" class="flex items-center justify-between md:justify-start md:gap-3 w-full">
          <p class="hidden md:block text-3xl font-bold">Histori Aspirasi Kamu</p>
          <UIcon name="i-lucide-arrow-right" class="hidden md:block size-5" />
          
          <p class="md:hidden text-md font-bold text-black">Histori Aspirasi</p>
          <span class="md:hidden text-xs font-bold text-blue-600">Lihat Semua</span>
        </NuxtLink>
      </div>
      <div v-if="listAspirasi.length === 0" class="bg-white rounded-4xl w-full px-12 py-24 space-y-9 md:shadow-none">
        <p class="text-center">Masih kosong nih yuk bikin dulu!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
        <UiCard 
          v-for="item in listAspirasi.slice(0, 2)" 
          :key="item.id" 
          :report="item" 
          @click="goToDetail(item.id)" class="cursor-pointer"
        />
      </div>
    </div>

    <div class="relative w-full flex flex-col items-center text-center mt-10 md:mt-20 mb-5">
      <p class="hidden md:block text-5xl font-bold text-center mb-24"><span class="text-electric-blue">Aspirasi</span> Kamu Sangat <br> Berharga!</p>
      
      <p class="md:hidden text-2xl font-bold text-center mb-6 leading-tight">
        <span class="text-electric-blue">Aspirasi</span> Kamu Sangat<br>Berharga!
      </p>

      <div class="relative w-full hidden md:flex md:w-auto md:max-w-5xl md:mx-auto pt-8 pb-20 px-4 md:p-0 md:flex-col items-center">
        <img 
          src="~/assets/images/user_imperative.png" 
          alt="Aspirasi Berharga" 
          class="w-[80%] max-w-70 md:max-w-5xl md:w-full md:-mt-10 md:mb-10" 
        />
        
        <div class="absolute -bottom-5 md:bottom-28 left-1/2 -translate-x-1/2 z-20 w-[85%] md:w-auto">
          <NuxtLink to="/user/aspiration/create" class="block w-full">
            <UiButton label="YUK! BUAT ASPIRASI" variant="imperative" color="gradient" />
          </NuxtLink>
        </div>
      </div>
      <NuxtLink to="/user/aspiration/create" class="block md:hidden">
        <UiButton label="YUK! BUAT ASPIRASI" variant="imperative" color="gradient" />
      </NuxtLink>
    </div>

  </div>
</template>