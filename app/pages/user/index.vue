<script setup lang="ts">
import { useAspiration } from '~/composables/api/useAspiration'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { fetchAspirations, fetchAspirationStats } = useAspiration()
const { data: response, pending, error, refresh } = await fetchAspirations()
const { data: stats } = await fetchAspirationStats()
const listAspirasi = computed(() => response.value?.data || [])
</script>

<template>
  <div class="flex flex-col justify-start items-start gap-14">

    <img src="~/assets/images/user_welcome.jpg" alt="Welcome">

    <div class="w-full space-y-5">
      <div class="flex items-center justify-start gap-3">
        <p class="text-3xl font-bold">Bulan Ini Kamu Sudah Berkonstribusi</p>
        <UIcon name="i-lucide-arrow-right" class="size-5" />
      </div>
      <div class="bg-white rounded-4xl w-full p-12 space-y-9">
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
    </div>

    <div class="w-full space-y-5">
      <div class="flex items-center justify-start gap-3">
        <p class="text-3xl font-bold">Histori Aspirasi Kamu</p>
        <UIcon name="i-lucide-arrow-right" class="size-5" />
      </div>
      <!-- <div class="bg-white rounded-4xl w-full px-12 py-24 space-y-9">
        <p class="text-center">Masih kosong nih yuk bikin dulu!</p>
      </div> -->
      <div class="flex gap-2">
        <UiCard v-for="item in listAspirasi" :key="item.id" :report="item" />
      </div>
      
    </div>

    <div class="relative w-full text-center mt-20 mb-5">
      <p class="text-5xl font-bold text-center mb-24"><span class="text-electric-blue">Aspirasi</span> Kamu Sangat <br> Berharga!</p>
      <img 
        src="~/assets/images/user_imperative.png" 
        alt="Aspirasi Berharga" 
        class="w-full max-w-5xl mx-auto -mt-10 mb-10" 
      />
      <div class="absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
        <UiButton label="YUK! BUAT ASPIRASI"variant="imperative" color="gradient" />
      </div>
    </div>

  </div>
</template>