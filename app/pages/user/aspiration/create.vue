<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'
import { useAspiration } from '~/composables/api/useAspiration' 
import defaultProfileImage from '~/assets/images/core_profile.jpg'
import { useFormUtils } from '~/composables/useFormUtils'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { 
  alertModal, showAlert, 
  selectedFiles, handleFileAdded, removeFile, clearFiles,
  leaveModal, setupLeaveGuard, confirmLeave 
} = useFormUtils()

const auth = useAuthStore()
const { createAspiration } = useAspiration()

const agreeTos = ref(false)
const agreeResponsibility = ref(false)
const isSubmitting = ref(false)
const showTosModal = ref(false)

const form = ref({
  title: '',
  description: '',
  location_id: '',
  category_id: '' 
})

const isFormDirty = computed(() => {
  return form.value.title !== '' ||
         form.value.description !== '' || form.value.category_id !== '' || 
         selectedFiles.value.length > 0
})

setupLeaveGuard(isFormDirty, isSubmitting)

clearFiles()

const handleCloseAlert = () => {
  alertModal.value.isOpen = false
  if (alertModal.value.isSuccess) {
    navigateTo('/user/aspiration/list-page')
  }
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

const handleSubmit = async () => {
  if (!form.value.title || !form.value.location_id || !form.value.description || !form.value.category_id) {
    showAlert("Data Tidak Lengkap", "Mohon lengkapi semua data form (Judul, Lokasi, Deskripsi, Kategori)!")
    return
  }
  
  if (!agreeTos.value || !agreeResponsibility.value) {
    showAlert("Persetujuan Dibutuhkan", "Kamu harus menyetujui Syarat & Ketentuan serta Tanggung Jawab aspirasi!")
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('location_id', form.value.location_id)
    formData.append('description', form.value.description)
    formData.append('category_id', form.value.category_id)
    
    selectedFiles.value.forEach((item) => {
      formData.append('attachments', item.file) 
    })

    await createAspiration(formData)

    await Promise.all([
      refreshNuxtData('aspirations-list'),
      refreshNuxtData('aspiration-stats'),
      refreshNuxtData('aspiration-histories'),
      refreshNuxtData('notifications-list')
    ])
    
    showAlert("Berhasil", "Aspirasi kamu berhasil dikirim!", true)

    selectedFiles.value.forEach(item => {
      if(item.preview) URL.revokeObjectURL(item.preview)
    })

  } catch (error) {
    console.error("Error submit aspirasi:", error)
    showAlert("Terjadi Kesalahan", "Gagal mengirim aspirasi. Coba lagi!")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center py-4 md:py-0 bg-[#F8F9FA] md:bg-transparent min-h-screen md:min-h-0">
    <div class="bg-white rounded-3xl md:rounded-4xl py-8 md:py-10 px-6 md:px-12 mt-0 md:mt-3 mb-10 md:mb-16 space-y-5 md:space-y-6 w-full">
      
      <div class="w-full flex items-center gap-3 text-left">
        <img 
          :src="auth?.user?.image || defaultProfileImage" 
          alt="Profile" 
          class="size-10 md:size-12 rounded-full object-cover shrink-0 border border-gray-100"
        />
        
        <div class="flex flex-col items-start min-w-0">
          <span class="font-bold text-black text-sm md:text-[15px] leading-tight truncate w-full">
            {{ auth.user?.name || '-' }}
          </span>
          <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1 font-medium">
            {{ auth.user?.nis || '-' }} • {{ auth.user?.rombel || '-' }} • {{ auth.user?.rayon || '-' }}
          </span>
        </div>
      </div>

      <div>
        <div class="space-y-4">
          <div class="flex flex-wrap md:flex-nowrap gap-2 items-center z-10">
            <UiDropdownLocation v-model="form.location_id" />
            <UiDropdownCategory v-model="form.category_id" />
            <UiFileUpload 
              v-if="selectedFiles.length < 5"
              @file-selected="handleFileAdded" 
              class="hidden md:block shrink-0"
            />
          </div>

          <UiInput v-model="form.title" label="Judul" placeholder="Tambah judul" variant="gray" />
          <UiInput v-model="form.description" label="Deskripsi" placeholder="Tambah deskripsi" type="textarea" variant="gray" />
          <UiFileUpload 
              v-if="selectedFiles.length < 5"
              @file-selected="handleFileAdded" 
              class="block md:hidden shrink-0"
            />
        </div>
        
        <div class="flex gap-3 md:gap-4 overflow-x-auto pt-3 pb-1 [&::-webkit-scrollbar]:hidden">
          <div 
            v-for="(item, index) in selectedFiles" 
            :key="index"
            class="relative size-20 md:size-28 bg-gray-200 rounded-xl md:rounded-2xl shrink-0 overflow-hidden group border border-gray-300"
          >
            <img 
              v-if="item.preview" 
              :src="item.preview" 
              class="w-full h-full object-cover" 
            />
            
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100 p-2">
              <UIcon name="i-lucide-file-text" class="size-6 md:size-8 mb-1" />
              <span class="text-[8px] md:text-[10px] text-center truncate w-full px-1">{{ item.file.name }}</span>
            </div>

            <button 
              @click="removeFile(index)"
              class="absolute top-1 right-1 bg-black/70 md:bg-black text-white rounded-full w-6 h-6 md:w-7 md:h-7 p-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 cursor-pointer flex items-center justify-center"
            >
              <UIcon name="i-lucide-x" class="size-3 md:size-4" />
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-3 md:space-y-2 mb-6 md:mb-7 mt-4 md:mt-6">
        <UiCheckbox v-model="agreeTos" label="Saya sudah membaca dan menyetujui yang ada dalam" link="Terms of Service" @open-link="showTosModal = true" />
        <UiCheckbox v-model="agreeResponsibility" label="Saya mengetahui bahwa Aspirasi yang saya buat merupakan tanggung jawab saya" />
      </div>

      <UiButton 
        @click="handleSubmit"
        :label="isSubmitting ? 'Mengirim...' : 'Kirim'" 
        color="black" 
        :showIcon="false"
        :disabled="isSubmitting"
        class="w-full"
      />
    </div>
  </div>

  <UiModalDefault v-model="showTosModal" :title="TOS_DATA?.title || 'Terms of Service'" maxWidth="max-w-3xl">
    <UiModalDataToS />
  </UiModalDefault>

  <UiModalDefault v-model="alertModal.isOpen" :title="alertModal.title" maxWidth="max-w-md" @update:model-value="(val) => !val && handleCloseAlert()">
    <p class="text-gray-600 text-sm md:text-[15px]">{{ alertModal.message }}</p>
  </UiModalDefault>

  <UiModalDefault v-model="leaveModal" title="Peringatan" maxWidth="max-w-md">
    <div class="flex flex-col gap-6 p-2">
      <p class="text-gray-600 text-sm md:text-[15px]">
        Kamu belum menyelesaikan pengisian form. Yakin ingin keluar? Perubahan tidak akan disimpan.
      </p>
      <div class="flex justify-end gap-3">
        <UiButton label="Ya, Keluar" color="red" @click="confirmLeave" />
      </div>
    </div>
  </UiModalDefault>

</template>