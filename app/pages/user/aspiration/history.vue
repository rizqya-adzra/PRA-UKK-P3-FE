<script setup lang="ts">
import { useAspiration } from '~/composables/api/useAspiration'
import { useRouter } from 'vue-router'
import { computed, watch } from 'vue'
import { useFilterPagination } from '~/composables/useFilterPagination'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const router = useRouter()
const { fetchAspirationHistories } = useAspiration()

const {
  searchParams,
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

const { data: response, pending} = await fetchAspirationHistories(apiQuery)

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
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-7">
    <p class="text-3xl font-bold text-center">Arsip History</p>
    <div class="space-y-1 w-full max-w-2xl">
      <UiInput 
        v-model="searchParams" 
        placeholder="Cari aspirasi..." 
        variant="search" 
        icon="i-lucide-search"
      />
      <div class="flex items-center justify-center gap-2">
        <UiDropdownDate 
          v-model:startDate="startDateParams" 
          v-model:endDate="endDateParams" 
        />    
        <UiDropdownCategory v-model="categoryParams" />
      </div>
    </div>
  </div>

  <div class="w-full my-20">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4 mb-4">
        <button 
          @click="prevPage" 
          :disabled="pageParams === 1"
          class="w-6 h-6 flex items-center justify-center rounded-full border-2 border-black disabled:opacity-20 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <UIcon name="i-lucide-chevron-left" class="size-6 text-black" />
        </button>

        <span class="select-none">
          page {{ pageParams }} / {{ totalPages }}
        </span>

        <button 
          @click="nextPage" 
          :disabled="pageParams >= totalPages"
          class="w-6 h-6 flex items-center justify-center rounded-full border-2 border-black disabled:opacity-20 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <UIcon name="i-lucide-chevron-right" class="size-6 text-black" />
        </button>
      </div>
      
      <div class="flex items-center justify-end gap-2 mb-4">
        <UiDropdownPagination v-model="limitParams" />
        <UiButton label="Export to Excel" variant="export" color="green" />
      </div>
    </div>

    <div v-if="pending" class="w-full flex justify-center py-24">
      <p class="text-gray-500 animate-pulse font-medium">Sedang memuat data...</p>
    </div>

    <div v-else-if="listAspirasi.length === 0" class="bg-white rounded-4xl w-full px-12 py-24 flex justify-center items-center">
      <p class="text-center text-gray-500">
        {{ searchParams || categoryParams || statusParams ? 'Tidak ada aspirasi yang cocok.' : 'Masih kosong nih yuk bikin dulu!' }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiCard 
        v-for="item in listAspirasi" 
        :key="item.id" 
        :report="item" 
        @click="goToDetail(item.id)" 
        class="cursor-pointer"
      />
    </div>
  </div>
</template>