<script setup lang="ts">
import defaultProfileImage from '~/assets/images/core_profile.jpg'
import { useAspiration } from '~/composables/api/useAspiration'

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const { 
  alertModal, showAlert, 
  selectedFiles, handleFileAdded, removeFile, clearFiles,
  leaveModal, setupLeaveGuard, confirmLeave 
} = useFormUtils()

const auth = useAuthStore()
const route = useRoute()
const { fetchAspirationDetail, createAspirationProgress, exportAspirationPDF } = useAspiration() 
const aspirationId = route.params.id as string
const { isExportModalOpen, isExporting, executeExport } = useExportPDF()
const statusColors = {
  menunggu: 'text-yellow-500',
  proses: 'text-blue-500',
  selesai: 'text-green-500',
  dibatalkan: 'text-red-500'
}
const { formatDate } = useFormatter()
const { data: response, pending, error } = await fetchAspirationDetail(aspirationId)
const aspiration = computed(() => response.value?.data)

const fileModalRef = ref<any>(null)
const isSubmitting = ref(false)
const isConfirmModalOpen = ref(false)
const form = ref({
  description: '',
  status: '' ,
})

watch(aspiration, (newAspiration) => {
  if (newAspiration?.status && form.value.status === '') {
    form.value.status = newAspiration.status
  }
}, { immediate: true })

const isFormDirty = computed(() => {
  return form.value.description !== '' || form.value.status !== '' || selectedFiles.value.length > 0
})

setupLeaveGuard(isFormDirty, isSubmitting)

clearFiles()

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

const executeExportPDF = () => {
  if (!aspiration.value) return
  
  executeExport(
    () => exportAspirationPDF(aspirationId),
    `Bukti_Aspirasi_${aspiration.value.report_id}.pdf`
  )
}

onMounted(async () => {
  if (!auth.user?.profile) {
    try {
      await auth.fetchProfile()
    } catch (err) {
      console.error("Gagal mengambil data profil:", err)
    }
  }
})

const confirmSubmit = () => {
  if (!form.value.description || !form.value.status) {
    showAlert("Data Tidak Lengkap", "Mohon lengkapi semua data form (Deskripsi dan Status)!")
    return
  }
  
  isConfirmModalOpen.value = true
}

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    const formData = new FormData()
    formData.append('aspiration', aspirationId)
    formData.append('description', form.value.description)
    formData.append('status', form.value.status)
    
    selectedFiles.value.forEach((item) => {
      formData.append('attachments', item.file) 
    })

    await createAspirationProgress(formData)

    await Promise.all([
      refreshNuxtData('aspirations-list'),
      refreshNuxtData('aspiration-stats'),
      refreshNuxtData('aspiration-histories'),
      refreshNuxtData('notifications-list'),
      refreshNuxtData(`aspiration-detail-${aspirationId}`)
    ])
    
    showAlert("Berhasil", "Progres Aspirasi berhasil dikirim!", true)

    form.value.description = ''
    selectedFiles.value.forEach(item => {
      if(item.preview) URL.revokeObjectURL(item.preview)
    })
    selectedFiles.value = []

    isConfirmModalOpen.value = false

  } catch (error) {
    console.error("Error submit progres aspirasi:", error)
    showAlert("Terjadi Kesalahan", "Gagal mengirim progres aspirasi. Coba lagi!")
  } finally {
    isSubmitting.value = false
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
            <div>
              <p class="text-sm md:text-base font-semibold text-tertiary">{{ aspiration.location_detail.name }}</p>
              <p class="text-sm md:text-base">{{ aspiration.description }}</p>
            </div>
            
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
            v-for="(update, index) in progressUpdates" 
            :key="update.id"
            class="bg-gray-100 rounded-3xl md:rounded-4xl py-8 md:py-10 px-6 md:px-10 w-full mt-8"
          >
            <div class="flex flex-col md:flex-row gap-4 md:gap-7">
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
                      <span :class="`text-xs mt-1 font-semibold uppercase ${statusColors[update.status.toLowerCase() as keyof typeof statusColors] || 'text-gray-500'}`">
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
  
        <svg class="w-1/2 text-gray-300 my-10" height="4" xmlns="http://www.w3.org/2000/svg">
          <line 
            x1="2" y1="2" x2="100%" y2="2" 
            stroke="currentColor" stroke-width="2" stroke-dasharray="16 20" stroke-linecap="round" 
          />
        </svg>
  
        <div class="w-full mb-16 space-y-2">
          <div class="flex items-end justify-between">
            <div class="w-full flex items-center gap-3 text-left mt-5">
              <img 
                :src="auth?.user?.image || defaultProfileImage" 
                alt="Profile" 
                class="size-12 rounded-full object-cover shrink-0 border border-gray-100"
              />
              
              <div class="flex flex-col items-start min-w-0">
                <span class="font-bold text-black leading-tight truncate w-full">
                  {{ auth.user?.name || '-' }}
                </span>
                <span class="text-sm leading-tight truncate w-full">
                  {{ auth.user?.email || '-' }}
                </span>
              </div>
            </div>
            <div class="flex gap-5 items-center justify-end w-full">
              <p class="text-sm font-bold">Ubah Status Aspirasi:</p>
              <UiDropdownStatus v-model="form.status" /> 
            </div>
          </div>
          <div class="flex gap-4 overflow-x-auto pt-2">
            <div 
              v-for="(item, index) in selectedFiles" 
              :key="index"
              class="relative size-28 bg-gray-200 rounded-xl shrink-0 overflow-hidden group border border-gray-300"
            >
              <img 
                v-if="item.preview" 
                :src="item.preview" 
                class="w-full h-full object-cover" 
              />
              
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100 p-2">
                <UIcon name="i-lucide-file-text" class="size-8 mb-1" />
                <span class="text-[10px] text-center truncate w-full px-1">{{ item.file.name }}</span>
              </div>
  
              <button 
                @click="removeFile(index)"
                class="absolute top-1 right-1 bg-black text-white rounded-full w-7 h-7 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              >
                <UIcon name="i-lucide-x" class="size-4" />
              </button>
            </div>
          </div>
          <UiInput v-model="form.description" label="Deskripsi" placeholder="Berikan Tanggapan" type="textarea" variant="white" />
          <div class="flex gap-5 items-start justify-between">
            <UiFileUpload 
              v-if="selectedFiles.length < 5"
              @file-selected="handleFileAdded" 
            />
            <UiButton 
              @click="confirmSubmit"
              :label="isSubmitting ? 'Mengirim...' : 'Kirim'" 
              color="black" 
              :showIcon="false"
              :disabled="isSubmitting"
              class="w-1/3"
            />
          </div>
        </div>
      </div>
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

  <UiModalDefault v-model="leaveModal" title="Peringatan" maxWidth="max-w-md">
    <div class="flex flex-col gap-6 p-2">
      <p class="text-gray-600 text-[15px]">
        Kamu belum menyelesaikan pengisian form. Yakin ingin keluar? Perubahan tidak akan disimpan.
      </p>
      <div class="flex justify-end gap-3">
        <UiButton label="Ya, Keluar" color="red" @click="confirmLeave" />
      </div>
    </div>
  </UiModalDefault>

  <UiModalDefault v-model="alertModal.isOpen" :title="alertModal.title" maxWidth="max-w-md" @update:model-value="(val) => !val">
    <p class="text-gray-600 text-[15px]">{{ alertModal.message }}</p>
  </UiModalDefault>

  <UiModalDefault 
    v-model="isConfirmModalOpen" 
    title="Apakah data sudah benar?" 
    maxWidth="max-w-4xl"
  >
    <div class="space-y-4">
      <div>
        <p>Deskripsi progress:</p>
        <strong class="text-base">{{ form.description }}</strong> <br>
      </div>
      <div class="bg-blue-50 p-4 rounded-xl text-sm border border-blue-100">
        Status aspirasi ini akan diubah menjadi: <br/>
        <strong class="uppercase text-blue-600 text-base">{{ form.status }}</strong>
      </div>
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full">
        <UiButton 
          label="Ya, Kirim" 
          variant="imperative" 
          color="black" 
          @click="handleSubmit" 
          :loading="isSubmitting"
        />
      </div>
    </template>
  </UiModalDefault>
</template>