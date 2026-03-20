<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import defaultProfileImage from '~/assets/images/core_profile.jpg'
import { useAspiration } from '~/composables/api/useAspiration'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const route = useRoute()
const { fetchAspirationDetail, exportAspirationPDF } = useAspiration() 
const aspirationId = route.params.id as string

const { data: response, pending, error } = await fetchAspirationDetail(aspirationId)
const aspiration = computed(() => response.value?.data)

const fileModalRef = ref<any>(null)

const formatDate = (isoString: string | undefined) => {
  if (!isoString) return '-'
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

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

    <div class="flex flex-col items-center justify-center text-center mt-10 min-w-full">
      <div class="flex flex-col-reverse md:flex-row justify-between items-center w-full px-4 md:px-12 gap-4">
        <UiButton label="Export to PDF" variant="export" color="red" @click="isExportModalOpen = true" />
        <p class="text-sm md:text-base"> 
          No. Aspirasi: <span class="font-semibold text-blue-500">{{ aspiration.report_id }}</span> 
        </p>
      </div>

      <div class="bg-white rounded-4xl py-8 md:py-10 px-6 md:px-12 mt-4 mb-14 space-y-5 w-full">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="w-full flex items-center gap-3 text-left">
            <img 
              :src="aspiration.student_image || defaultProfileImage" 
              alt="Profile" 
              class="size-12 rounded-full object-cover shrink-0 border border-gray-100"
            />
            <div class="flex flex-col items-start min-w-0">
              <span class="font-bold text-black text-[15px] leading-tight truncate w-full">
                {{ aspiration.student_info.name || 'Siswa' }}
              </span>
              <span class="text-xs text-gray-500 mt-1 font-medium">
                {{ aspiration.student_info.nis }} • {{ aspiration.student_info.rombel }}
              </span>
            </div>
          </div>
          
          <div class="text-left md:text-end shrink-0 pl-14 md:pl-0">
            <p class="text-xs md:text-sm text-gray-500">{{ formatDate(aspiration.created_at) }}</p>
            <div class="flex flex-wrap md:justify-end gap-2 mt-2">
              <UiLabel :text="aspiration.category_detail.name" variant="solid" />
              <UiLabel :text="aspiration.status_display" variant="outline" />
            </div>
          </div>
        </div>

        <div class="text-start space-y-4 mt-8 md:mt-10">
          <p class="text-xl md:text-3xl font-bold">{{ aspiration.title }}</p>
          <p class="text-sm md:text-base">{{ aspiration.description }}</p>
          
          <div v-if="aspiration.attachments && aspiration.attachments.length > 0" class="flex flex-wrap gap-4 mt-4">
            <template v-for="file in aspiration.attachments" :key="file.id">
              
              <img 
                v-if="file.file_type === 'image'" 
                :src="file.file" 
                alt="Attachment" 
                @click="fileModalRef?.open(file.file, 'image')"
                class="w-full max-w-40 md:max-w-52 h-40 md:h-64 object-cover rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm cursor-pointer transition-transform hover:scale-105" 
              />
              
              <div 
                v-else
                @click="fileModalRef?.open(file.file, file.file_type)"
                class="w-full max-w-40 md:max-w-52 h-40 md:h-64 flex flex-col items-center justify-center bg-gray-50 rounded-2xl md:rounded-3xl border border-gray-200 shadow-sm cursor-pointer transition-transform hover:scale-105 hover:bg-gray-100 p-4 text-center"
              >
                <UIcon name="i-lucide-file-text" class="size-10 text-red-500 mb-3" />
                <span class="text-sm font-semibold text-gray-700">Lihat PDF</span>
                <span class="text-xs text-gray-400 mt-1 truncate w-full">Lampiran Dokumen</span>
              </div>

            </template>
          </div>
        </div>

        <div 
          v-for="(update, index) in aspiration.progress_updates" 
          :key="update.id"
          class="bg-[#F1F9FF] rounded-3xl md:rounded-4xl py-8 md:py-10 px-6 md:px-10 w-full mt-8"
        >
          <div class="flex flex-col md:flex-row gap-4 md:gap-7">
            <div class="hidden md:block border-l-2 border-black/10 min-h-full"></div>
            
            <div class="flex-1 w-full">
              <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <div class="flex items-center gap-3">
                  <div class="size-10 md:size-12 rounded-full flex items-center justify-center shrink-0 border border-blue-200 bg-blue-100 text-blue-600 font-bold">
                    A
                  </div>
                  <div class="flex flex-col items-start min-w-0">
                    <span class="font-bold text-black text-[14px] md:text-[15px] leading-tight truncate w-full">
                      Admin ({{ update.admin_name }})
                    </span>
                    <span class="text-xs text-blue-500 mt-1 font-semibold uppercase">
                      {{ update.status }}
                    </span>
                  </div>
                </div>
                <p class="text-xs md:text-sm text-gray-500 pl-14 md:pl-0">{{ formatDate(update.created_at) }}</p>
              </div>
              
              <p class="text-start mt-4 text-sm md:text-base">
                {{ update.description }}
              </p>
              
              <div v-if="update.attachments && update.attachments.length > 0" class="flex flex-wrap gap-4 mt-5">
                <template v-for="file in update.attachments" :key="file.id">
                  
                  <img 
                    v-if="file.file_type === 'image'"
                    :src="file.file" 
                    alt="Admin Attachment" 
                    @click="fileModalRef?.open(file.file, 'image')"
                    class="w-full max-w-32 md:max-w-52 h-32 md:h-64 object-cover rounded-2xl md:rounded-3xl border border-blue-100 cursor-pointer transition-transform hover:scale-105" 
                  />

                  <div 
                    v-else
                    @click="fileModalRef?.open(file.file, file.file_type)"
                    class="w-full max-w-32 md:max-w-52 h-32 md:h-64 flex flex-col items-center justify-center bg-white rounded-2xl md:rounded-3xl border border-blue-100 cursor-pointer transition-transform hover:scale-105 hover:bg-blue-50 p-4 text-center"
                  >
                    <UIcon name="i-lucide-file-text" class="size-8 text-blue-500 mb-2" />
                    <span class="text-xs font-semibold text-gray-700">Lihat Dokumen</span>
                  </div>

                </template>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="flex flex-col md:flex-row items-center justify-center gap-3 mb-16 text-sm md:text-base">
        <p class="font-bold text-gray-800">Status Aspirasi</p>
        <UiLabel :text="aspiration.status_display" variant="outline" />
        <p class="text-gray-500">{{ statusMessage }}</p>
      </div>

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
  </div>
</template>