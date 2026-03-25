<script setup lang="ts">
import { useAspiration } from '~/composables/api/useAspiration'
import { useRouter } from 'vue-router'
import { computed, watch, ref } from 'vue'
import { useFilterPagination } from '~/composables/useFilterPagination'

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const router = useRouter()
const { fetchAspirations, exportAspirationsExcel } = useAspiration() 

const {
  searchParams,
  categoryParams,
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
  router.push(`/admin/aspiration/detail/${id}`)
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
  <div>  
    <div class="w-1/2">
      <UiInput 
        v-model="searchParams" 
        placeholder="Cari laporan aspirasi..." 
        variant="search" 
        icon="i-lucide-search-check"
      />
    </div>
    <div class="flex items-center justify-between mt-8">
      <p class="text-4xl font-bold text-center ml-2">Berdasarkan Kategori</p>
      <div class="flex items-center justify-center gap-2">
        <UiCategoryFilter v-model="categoryParams" />
      </div>
    </div>
  
    <div class="w-full my-6">  
      <div v-if="pending" class="w-full flex justify-center py-24">
        <p class="text-gray-500 animate-pulse font-medium">Sedang memuat data...</p>
      </div>
  
      <div v-else-if="listAspirasi.length === 0" class="bg-white rounded-4xl w-full px-12 py-24 flex justify-center items-center">
        <p class="text-center text-gray-500">
          {{ searchParams || categoryParams ? 'Tidak ada aspirasi yang cocok.' : 'Masih kosong' }}
        </p>
      </div>
  
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        <UiCard 
          v-for="item in listAspirasi" 
          :key="item.id" 
          :report="item" 
          @click="goToDetail(item.id)" 
          class="cursor-pointer"
        />
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4 mb-4">
        <button 
          @click="prevPage" 
          :disabled="pageParams === 1"
          class="w-6 h-6 flex items-center justify-center rounded-full disabled:opacity-20 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <UIcon name="i-lucide-chevron-left" class="size-6 text-tertiary" />
        </button>

        <span class="select-none text-tertiary font-semibold">
          {{ pageParams }} / {{ totalPages }}
        </span>

        <button 
          @click="nextPage" 
          :disabled="pageParams >= totalPages"
          class="w-6 h-6 flex items-center justify-center rounded-full disabled:opacity-20 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <UIcon name="i-lucide-chevron-right" class="size-6 text-tertiary" />
        </button>
      </div>
      
      <div class="flex items-center justify-end gap-2 mb-4">
        <UiDropdownPagination v-model="limitParams" />
        <UiButton label="Export to Excel" variant="export" color="green" @click="isExportModalOpen = true" />
      </div>
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
</template>