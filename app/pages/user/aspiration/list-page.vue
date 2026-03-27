<script setup lang="ts">
import { useAspiration } from '~/composables/api/useAspiration'
import { useRouter } from 'vue-router'
import { computed, watch, ref } from 'vue'
import { useFilterPagination } from '~/composables/useFilterPagination'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const router = useRouter()
const { fetchAspirations, exportAspirationsExcel } = useAspiration() 

const {
  searchParams,
  locationParams,
  categoryParams,
  statusParams,
  startDateParams,
  endDateParams,
  pageParams,
  limitParams,
  apiQuery,
  prevPage,
  nextPage: triggerNextPage
} = useFilterPagination()

const { data: response, pending } = await fetchAspirations(apiQuery)

const listAspirasi = computed(() => response.value?.data || [])
const totalPages = computed(() => response.value?.total_pages || 1)

const nextPage = () => triggerNextPage(totalPages.value)

watch(
  () => response.value?.current_page,
  (newCurrentPage) => {
    if (newCurrentPage && newCurrentPage !== pageParams.value) {
      pageParams.value = newCurrentPage
    }
  }
)

const goToDetail = (id: string) => {
  router.push(`/user/aspiration/detail/${id}`)
}

const isExportModalOpen = ref(false)
const isExporting = ref(false)

const executeExport = async () => {
  isExporting.value = true
  try {
    const blob = await exportAspirationsExcel(apiQuery.value)
    
    const url = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    const dateString = new Date().toISOString().split('T')[0]
    link.setAttribute('download', `Aspirasi_${dateString}.xlsx`) 
    
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    isExportModalOpen.value = false
  } catch (error) {
    console.error("Terjadi kesalahan saat mengunduh Excel:", error)
  } finally {
    isExporting.value = false
  }
}
</script>

<template>
  <div class="md:px-0 py-6 md:py-0 md:bg-transparent min-h-screen">
    
    <div class="bg-white md:bg-transparent md:border-6 md:border-white p-6 md:p-6 rounded-4xl md:rounded-4xl flex flex-col md:flex-row justify-center md:justify-between items-center text-center md:text-left gap-4 md:gap-0">
      <p class="font-bold text-lg md:text-base text-black leading-snug">Tambah Aspirasi yang <br class="hidden md:block"> ingin kamu sampaikan</p>
      <NuxtLink to="/user/aspiration/create" class="md:w-auto">
        <UiButton label="BUAT ASPIRASI" variant="imperative" color="gradient" />
      </NuxtLink>
    </div>

    <svg class="hidden md:block w-full text-gray-300 my-14" height="4" xmlns="http://www.w3.org/2000/svg">
      <line x1="2" y1="2" x2="100%" y2="2" stroke="currentColor" stroke-width="2" stroke-dasharray="16 20" stroke-linecap="round" />
    </svg>

    <div class="flex flex-col md:items-center justify-center gap-4 md:gap-7 mt-6 md:mt-0">
      <p class="hidden md:block text-3xl font-bold text-center">Semua List Aspirasi</p>
      
      <div class="space-y-3 md:space-y-1 w-full max-w-2xl">
        <UiInput 
          v-model="searchParams" 
          placeholder="Cari laporan aspirasi..." 
          variant="search" 
          icon="i-lucide-search"
        />
        <div class="flex overflow-x-auto md:overflow-visible items-center md:justify-center gap-2 pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden">
          <UiDropdownDate v-model:startDate="startDateParams" v-model:endDate="endDateParams" class="shrink-0" />    
          <UiDropdownCategory v-model="categoryParams" class="shrink-0" />
          <UiDropdownStatus v-model="statusParams" class="shrink-0" />    
          <UiDropdownLocation v-model="locationParams" class="shrink-0" />
        </div>
      </div>
    </div>

    <div class="flex md:hidden flex-col gap-4 mt-8 mb-4">
      <div class="flex items-end justify-between w-full">
        <h2 class="font-bold text-md text-black">Semua List Aspirasi</h2>
        <span class="text-xs text-gray-500 font-medium">{{ listAspirasi.length }} laporan</span>
      </div>
      
      <div class="flex items-center justify-between w-full">
        <UiButton label="Export to Excel" variant="export" color="green" @click="isExportModalOpen = true" />
        <UiDropdownPagination v-model="limitParams"  />
      </div>
    </div>

    <div class="w-full mt-2 md:mt-12 mb-6">
      <div v-if="pending" class="w-full flex justify-center py-24">
        <p class="text-gray-500 animate-pulse font-medium">Sedang memuat data...</p>
      </div>

      <div v-else-if="listAspirasi.length === 0" class="bg-white rounded-4xl md:rounded-4xl w-full px-8 md:px-12 py-16 md:py-24 flex justify-center items-center shadow-sm md:shadow-none">
        <p class="text-center text-xs md:text-base text-gray-500">
          {{ searchParams || locationParams || categoryParams || statusParams ? 'Tidak ada aspirasi yang cocok.' : 'Masih kosong nih yuk bikin dulu!' }}
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <UiCard 
          v-for="item in listAspirasi" 
          :key="item.id" 
          :report="item" 
          @click="goToDetail(item.id)" 
          class="cursor-pointer"
        />
      </div>
    </div>

    <div class="flex flex-col md:flex-row items-end md:items-center justify-end md:justify-between w-full mt-4 md:mt-0">
      
      <div class="flex items-center gap-3 md:gap-4 mb-4 order-1">
        <button 
          @click="prevPage" 
          :disabled="pageParams === 1"
          class="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full disabled:opacity-20 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <UIcon name="i-lucide-chevron-left" class="size-4 md:size-6 text-tertiary" />
        </button>

        <span class="select-none text-tertiary font-semibold text-xs md:text-base">
          {{ pageParams }} / {{ totalPages }}
        </span>

        <button 
          @click="nextPage" 
          :disabled="pageParams >= totalPages"
          class="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full disabled:opacity-20 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <UIcon name="i-lucide-chevron-right" class="size-4 md:size-6 text-tertiary" />
        </button>
      </div>
      
      <div class="hidden md:flex items-center justify-end gap-2 mb-4 order-2">
        <UiDropdownPagination v-model="limitParams" />
        <UiButton label="Export to Excel" variant="export" color="green" @click="isExportModalOpen = true" />
      </div>
    </div>

    <UiModalDefault 
      v-model="isExportModalOpen" 
      title="Export Data ke Excel" 
      maxWidth="max-w-xl"
    >
      <div class="space-y-4">
        <p class="text-gray-600">
          Kamu akan mengunduh data aspirasi ke dalam format Excel (<strong>.xlsx</strong>). 
        </p>
        <div class="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 border border-gray-100">
          <p class="font-medium mb-1">Informasi Unduhan:</p>
          <ul class="list-disc pl-4 space-y-1">
            <li>Data yang diunduh akan menyesuaikan filter yang sedang aktif.</li>
            <li>Jumlah data sesuai dengan paginasi halaman ini (<strong>{{ limitParams }}</strong> baris).</li>
          </ul>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-3 w-full">
          <UiButton 
            label="Unduh Sekarang" 
            variant="imperative" 
            color="green" 
            @click="executeExport" 
            :loading="isExporting"
          />
        </div>
      </template>
    </UiModalDefault>

  </div>
</template>