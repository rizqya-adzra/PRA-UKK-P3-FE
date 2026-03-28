<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import defaultProfileImage from '~/assets/images/core_profile.jpg'
import { useAspiration } from '~/composables/api/useAspiration'
import { useFormatter } from '~/composables/useFormatter'

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
const { formatDate } = useFormatter()

const statusColors = {
  menunggu: 'text-yellow-500',
  proses: 'text-blue-500',
  selesai: 'text-green-500',
  dibatalkan: 'text-red-500'
}

const { data: response, pending, error } = await fetchAspirationDetail(aspirationId)
const aspiration = computed(() => response.value?.data)

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
    
          <svg class="w-full md:w-1/2 text-gray-300" height="4" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="2" x2="100%" y2="2" stroke="currentColor" stroke-width="2" stroke-dasharray="16 20" stroke-linecap="round" />
          </svg>
    
          <div class="w-full mb-16">
            </div>
        </div>
      </div>
    </div>

    <div class="w-full mb-16">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        
        <div class="w-full flex items-center gap-3 text-left">
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

        <div class="flex gap-3 md:gap-5 items-center justify-between md:justify-end w-full">
          <p class="text-sm font-bold shrink-0">Ubah Status:</p>
          <UiDropdownStatus v-model="form.status" class="w-auto" /> 
        </div>
      </div>
      
      <div class="flex gap-4 overflow-x-auto md:pt-2 md:pb-2">
        <div 
          v-for="(item, index) in selectedFiles" 
          :key="index"
          class="relative size-24 md:size-28 bg-gray-200 rounded-xl shrink-0 my-2 overflow-hidden group border border-gray-300"
        >
          <img 
            v-if="item.preview" 
            :src="item.preview" 
            class="w-full h-full object-cover" 
          />
          
          <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100 p-2">
            <UIcon name="i-lucide-file-text" class="size-6 md:size-8 mb-1" />
            <span class="text-[10px] text-center truncate w-full px-1">{{ item.file.name }}</span>
          </div>

          <button 
            @click="removeFile(index)"
            class="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 md:w-7 md:h-7 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer flex items-center justify-center"
          >
            <UIcon name="i-lucide-x" class="size-3 md:size-4" />
          </button>
        </div>
      </div>

      <UiInput v-model="form.description" label="Deskripsi" placeholder="Berikan Tanggapan" type="textarea" variant="white" />
      
      <div class="flex flex-col md:flex-row gap-4 md:gap-5 items-start md:items-center justify-between mt-2">
        <UiFileUpload 
          v-if="selectedFiles.length < 5"
          @file-selected="handleFileAdded" 
          class="w-full md:w-auto"
        />
        <UiButton 
          @click="confirmSubmit"
          :label="isSubmitting ? 'Mengirim...' : 'Kirim'" 
          color="black" 
          :showIcon="false"
          :disabled="isSubmitting"
          class="w-full md:w-1/3"
        />
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