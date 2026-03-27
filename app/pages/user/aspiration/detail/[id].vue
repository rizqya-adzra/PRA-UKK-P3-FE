<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import defaultProfileImage from '~/assets/images/core_profile.jpg'
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

const statusColors = {
  menunggu: 'text-yellow-500',
  proses: 'text-blue-500',
  selesai: 'text-green-500',
  dibatalkan: 'text-red-500'
}

const fileModalRef = ref<any>(null)

// --- LOGIKA GALLERY ATTACHMENTS ---
const MAX_VISIBLE_ATTACHMENTS = 4 // Maksimal file yang terlihat sebelum muncul "+ N"
const expandedAttachmentGroups = ref(new Set<string>())

const toggleExpand = (groupId: string) => {
  if (expandedAttachmentGroups.value.has(groupId)) {
    expandedAttachmentGroups.value.delete(groupId)
  } else {
    expandedAttachmentGroups.value.add(groupId)
  }
}
// ----------------------------------

const timelineStatus = computed(() => {
  if (!aspiration.value) return 'menunggu'
  const stat = aspiration.value.status.toLowerCase()
  if (stat === 'proses') return 'diproses'
  return stat as 'menunggu' | 'diproses' | 'selesai' | 'dibatalkan'
}) 

const progressUpdates = computed(() => {
  if (!aspiration.value?.progress_updates) return []
  return [...aspiration.value.progress_updates].reverse()
})

const userAttachments = computed(() => {
  if (!aspiration.value?.attachments) return []
  
  const adminAttachmentIds = new Set(
    progressUpdates.value.flatMap(update => 
      (update.attachments || []).map((file: any) => file.id)
    )
  )
  
  return aspiration.value.attachments.filter((file: any) => !adminAttachmentIds.has(file.id))
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

    <div class="flex flex-col items-center justify-center text-center mt-5 min-w-full">
      <div class="flex min-w-full justify-end md:hidden">
        <UiButton label="Export to PDF" variant="export" color="red" @click="isExportModalOpen = true" />
      </div>
      <div class="bg-white rounded-4xl py-8 md:py-10 px-6 md:px-12 mt-4 mb-14 space-y-5 w-full">
        <div class="hidden md:flex flex-col-reverse md:flex-row justify-between items-center w-full mb-10">
          <UiButton label="Export to PDF" variant="export" color="red" @click="isExportModalOpen = true" />
          <p class="text-sm font-semibold text-tertiary"> 
            No. Aspirasi: <span class="font-semibold text-blue-500">{{ aspiration.report_id }}</span> 
          </p>
        </div>
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="block md:hidden text-end shrink-0 space-y-2">
            <p class="flex justify-between text-sm font-semibold text-tertiary"> 
              No. Aspirasi: <span class="font-semibold text-blue-500">{{ aspiration.report_id }}</span> 
            </p>
            <div class="flex flex-wrap md:justify-end gap-1 md:gap-2 mt-2">
              <UiLabel :text="aspiration.category_detail.name" variant="solid" />
              <UiLabel :text="aspiration.status_display" variant="outline" />
            </div>
            <p class="hidden md:block text-xs md:text-sm text-gray-500">{{ formatDate(aspiration.created_at) }}</p>
          </div>

          <div class="w-full flex items-center gap-3 text-left">
            <img 
              :src="aspiration.student_image || defaultProfileImage" 
              alt="Profile" 
              class="size-12 rounded-full object-cover shrink-0 border border-gray-100"
            />
            <div class="flex flex-col items-start min-w-0">
              <span class="font-bold text-black text-sm leading-tight truncate w-full">
                {{ aspiration.student_info.name || 'Siswa' }}
              </span>
              <span class="text-xs text-gray-500 mt-1 font-medium">
                {{ aspiration.student_info.nis }} • {{ aspiration.student_info.rombel }}
              </span>
            </div>
          </div>
          
          <div class="hidden md:block text-left md:text-end shrink-0 pl-14 md:pl-0">
            <p class="text-xs md:text-sm text-gray-500">{{ formatDate(aspiration.created_at) }}</p>
            <div class="flex flex-wrap md:justify-end gap-2 mt-2">
              <UiLabel :text="aspiration.category_detail.name" variant="solid" />
              <UiLabel :text="aspiration.status_display" variant="outline" />
            </div>
          </div>
        </div>

        <div class="text-start space-y-2 md:space-y-4 mt-0 md:mt-10">
          <p class="block md:hidden text-xs text-gray-500">{{ formatDate(aspiration.created_at) }}</p>
          <p class="text-xl md:text-3xl font-bold">{{ aspiration.title }}</p>
          <div>
            <p class="text-sm md:text-base font-semibold text-tertiary">{{ aspiration.location_detail.name }}</p>
            <p class="text-sm md:text-base">{{ aspiration.description }}</p>
          </div>
          
          <div v-if="userAttachments.length > 0" class="mt-4">
            <div class="flex flex-wrap gap-3 md:gap-4">
              <template v-for="(file, index) in (expandedAttachmentGroups.has('user') ? userAttachments : userAttachments.slice(0, MAX_VISIBLE_ATTACHMENTS))" :key="file.id">
                
                <div class="relative w-[110px] sm:w-[140px] md:w-[180px] h-[110px] sm:h-[140px] md:h-[180px] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer transition-transform duration-300 hover:scale-105 group shrink-0">
                  
                  <img 
                    v-if="file.file_type === 'image'" 
                    :src="file.file" 
                    alt="Attachment" 
                    @click="fileModalRef?.open(file.file, 'image')"
                    class="w-full h-full object-cover" 
                  />
                  
                  <div 
                    v-else
                    @click="fileModalRef?.open(file.file, file.file_type)"
                    class="w-full h-full flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100 p-2 md:p-4 text-center"
                  >
                    <UIcon name="i-lucide-file-text" class="size-8 md:size-10 text-red-500 mb-2 md:mb-3" />
                    <span class="text-xs md:text-sm font-semibold text-gray-700">Lihat PDF</span>
                  </div>

                  <div 
                    v-if="!expandedAttachmentGroups.has('user') && index === MAX_VISIBLE_ATTACHMENTS - 1 && userAttachments.length > MAX_VISIBLE_ATTACHMENTS"
                    @click.stop="toggleExpand('user')"
                    class="absolute inset-0 bg-black/50 hover:bg-black/60 transition-colors flex flex-col items-center justify-center text-white backdrop-blur-sm z-10"
                  >
                    <span class="text-2xl md:text-3xl font-bold">+{{ userAttachments.length - MAX_VISIBLE_ATTACHMENTS + 1 }}</span>
                    <span class="text-[10px] md:text-xs font-medium mt-1">Lainnya</span>
                  </div>
                </div>

              </template>
            </div>
            
            <button 
              v-if="expandedAttachmentGroups.has('user') && userAttachments.length > MAX_VISIBLE_ATTACHMENTS"
              @click="toggleExpand('user')"
              class="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors mt-4 block"
            >
              Tutup sebagian lampiran
            </button>
          </div>
        </div>

        <div 
          v-for="(update, index) in progressUpdates" 
          :key="update.id"
          class="bg-gray-100 rounded-3xl md:rounded-4xl py-6 md:py-10 px-5 md:px-10 w-full mt-8"
        >
          <div class="flex flex-col md:flex-row gap-4 md:gap-7">            
            <div class="flex-1 w-full">
              <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <div class="flex items-center gap-3">
                  <div class="size-10 md:size-12 rounded-full flex items-center justify-center shrink-0 border border-blue-200 bg-blue-100 text-blue-600 font-bold">
                    A
                  </div>
                  <div class="flex flex-col items-start min-w-0">
                    <span class="font-bold text-black text-[14px] md:text-sm leading-tight truncate w-full">
                      Admin ({{ update.admin_name }})
                    </span>
                    <span :class="`text-xs mt-1 font-semibold uppercase ${statusColors[update.status.toLowerCase() as keyof typeof statusColors] || 'text-gray-500'}`">
                      {{ update.status }}
                    </span>
                  </div>
                </div>
                <p class="hidden md:block text-sm text-gray-500 pl-14 md:pl-0">{{ formatDate(update.created_at) }}</p>
              </div>
              
              <div class="mt-4 space-y-1">
                <p class="text-start block md:hidden text-xs text-gray-400">{{ formatDate(update.created_at) }}</p>
                <p class="text-start md:mt-4 text-sm md:text-base">
                  {{ update.description }}
                </p>
              </div>
              
              <div v-if="update.attachments && update.attachments.length > 0" class="mt-5">
                <div class="flex flex-wrap gap-3 md:gap-4">
                  <template v-for="(file, index) in (expandedAttachmentGroups.has(`admin-${update.id}`) ? update.attachments : update.attachments.slice(0, MAX_VISIBLE_ATTACHMENTS))" :key="file.id">
                    
                    <div class="relative w-[100px] sm:w-[130px] md:w-[160px] h-[100px] sm:h-[130px] md:h-[160px] rounded-2xl md:rounded-3xl overflow-hidden border border-blue-100 shadow-sm cursor-pointer transition-transform duration-300 hover:scale-105 group shrink-0">
                      
                      <img 
                        v-if="file.file_type === 'image'"
                        :src="file.file" 
                        alt="Admin Attachment" 
                        @click="fileModalRef?.open(file.file, 'image')"
                        class="w-full h-full object-cover" 
                      />

                      <div 
                        v-else
                        @click="fileModalRef?.open(file.file, file.file_type)"
                        class="w-full h-full flex flex-col items-center justify-center bg-white group-hover:bg-blue-50 p-2 md:p-4 text-center"
                      >
                        <UIcon name="i-lucide-file-text" class="size-6 md:size-8 text-blue-500 mb-2" />
                        <span class="text-[10px] md:text-xs font-semibold text-gray-700">Lihat Dokumen</span>
                      </div>

                      <div 
                        v-if="!expandedAttachmentGroups.has(`admin-${update.id}`) && index === MAX_VISIBLE_ATTACHMENTS - 1 && update.attachments.length > MAX_VISIBLE_ATTACHMENTS"
                        @click.stop="toggleExpand(`admin-${update.id}`)"
                        class="absolute inset-0 bg-blue-900/50 hover:bg-blue-900/60 transition-colors flex flex-col items-center justify-center text-white backdrop-blur-sm z-10"
                      >
                        <span class="text-xl md:text-2xl font-bold">+{{ update.attachments.length - MAX_VISIBLE_ATTACHMENTS + 1 }}</span>
                        <span class="text-[10px] md:text-xs font-medium mt-1">Lainnya</span>
                      </div>

                    </div>

                  </template>
                </div>

                <button 
                  v-if="expandedAttachmentGroups.has(`admin-${update.id}`) && update.attachments.length > MAX_VISIBLE_ATTACHMENTS"
                  @click="toggleExpand(`admin-${update.id}`)"
                  class="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors mt-3 block"
                >
                  Tutup sebagian dokumen
                </button>
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