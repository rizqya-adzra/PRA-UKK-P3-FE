<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAspiration } from '~/composables/api/useAspiration'
import { useFormatter } from '~/composables/useFormatter'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const route = useRoute()
const { fetchAspirationDetail, exportAspirationPDF } = useAspiration() 
const aspirationId = route.params.id as string
const { formatDate } = useFormatter()

const { data: response, pending, error } = await fetchAspirationDetail(aspirationId)
const aspiration = computed(() => response.value?.data)

const timelineStatus = computed(() => {
  if (!aspiration.value) return 'menunggu'
  const stat = aspiration.value.status.toLowerCase()
  if (stat === 'proses') return 'diproses'
  return stat as 'menunggu' | 'diproses' | 'selesai' | 'dibatalkan'
}) 

const statusMessage = computed(() => {
  if (!aspiration.value) return ''
  const stat = aspiration.value.status.toLowerCase()
  
  if (stat === 'menunggu') return 'tunggu balasan dari admin ya!'
  if (stat === 'diproses' || stat === 'proses') return 'aspirasi kamu lagi di kurasi nih!'
  if (stat === 'selesai' || stat === 'dibatalkan') return `pada ${formatDate(aspiration.value.created_at)}`
  
  return ''
})

const isExportModalOpen = ref(false)
const isExporting = ref(false)

const executeExportPDF = async () => {
  if (!aspiration.value) return

  isExporting.value = true
  try {
    const blob = await exportAspirationPDF(aspirationId)
    const url = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Bukti_Aspirasi_${aspiration.value.report_id}.pdf`) 
    
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    
    isExportModalOpen.value = false
  } catch (error) {
    console.error("Terjadi kesalahan saat mengunduh PDF:", error)
  } finally {
    isExporting.value = false
  }
}
</script>

<template>
  <div>
    <div v-if="pending" class="flex justify-center items-center py-20 min-h-[50vh]">
      <UIcon name="i-lucide-loader-2" class="size-10 text-blue-500 animate-spin" />
    </div>
  
    <div v-else-if="error || !aspiration" class="text-center py-20 text-red-500">
      <p>Gagal memuat detail aspirasi atau data tidak ditemukan.</p>
    </div>
  
    <div v-else class="w-full">
      <div class="px-4 md:px-12 lg:px-20 max-w-4xl mx-auto">
        <UiStatusTimeline :status="timelineStatus" />
      </div>
  
      <div class="flex flex-col items-center justify-center text-center mt-5 min-w-full">
        <div class="flex min-w-full justify-end md:hidden">
          <UiButton label="Export to PDF" variant="export" color="red" @click="isExportModalOpen = true" />
        </div>
        <UiCardAspirationDetail 
          :aspiration="aspiration" 
          @export="isExportModalOpen = true" 
        />
      </div>
    </div>
  </div>

  <div class="flex flex-col md:flex-row items-center justify-center gap-3 mb-16 text-sm md:text-base">
    <p class="font-bold text-gray-800">Status Aspirasi</p>
    <UiLabel v-if="aspiration" :text="aspiration.status_display" variant="outline" />
    <p class="text-gray-500">{{ statusMessage }}</p>
  </div>

  <UiFilePreviewModal ref="fileModalRef" />
  <UiModalDefault 
      v-model="isExportModalOpen" 
      title="Export Data ke PDF" 
      maxWidth="max-w-xl"
    >
      <div class="space-y-4">
        <p class="text-gray-600">
          Kamu akan mengunduh tanda bukti laporan aspirasi ini ke dalam format PDF. 
        </p>
        <div class="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 border border-gray-100">
          <p class="font-medium mb-1">Informasi Unduhan:</p>
          <ul class="list-disc pl-4 space-y-1">
            <li>Nomor Laporan: <strong>{{ aspiration?.report_id }}</strong></li>
            <li>Judul: <strong>{{ aspiration?.title }}</strong></li>
          </ul>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-3 w-full">
          <UiButton 
            label="Unduh Sekarang" 
            variant="imperative" 
            color="red" 
            @click="executeExportPDF" 
            :loading="isExporting"
          />
        </div>
      </template>
    </UiModalDefault>
</template>