<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAspiration } from '~/composables/api/useAspiration' 
import defaultProfileImage from '~/assets/images/core_profile.jpg'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const auth = useAuthStore()
const { createAspiration } = useAspiration()

const form = ref({
  title: '',
  location: '',
  description: '',
  category_id: '' 
})

const selectedFiles = ref<{ file: File; preview: string }[]>([])

const agreeTos = ref(false)
const agreeResponsibility = ref(false)
const isSubmitting = ref(false)
const showTosModal = ref(false)

onMounted(async () => {
  if (!auth.user?.profile) {
    try {
      await auth.fetchProfile()
    } catch (err) {
      console.error("Gagal mengambil data profil:", err)
    }
  }
})

const handleFileAdded = (file: File) => {
  if (selectedFiles.value.length >= 5) {
    alert("Maksimal hanya 5 file yang diizinkan!")
    return
  }

  const isImage = file.type.startsWith('image/')
  const preview = isImage ? URL.createObjectURL(file) : ''

  selectedFiles.value.push({
    file,
    preview
  })
}

const removeFile = (index: number) => {
  const fileItem = selectedFiles.value[index]
  
  if (fileItem?.preview) {
    URL.revokeObjectURL(fileItem.preview)
  }
  
  selectedFiles.value.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.value.title || !form.value.location || !form.value.description || !form.value.category_id) {
    alert("Mohon lengkapi semua data form (Judul, Lokasi, Deskripsi, Kategori)!")
    return
  }
  
  if (!agreeTos.value || !agreeResponsibility.value) {
    alert("Kamu harus menyetujui Syarat & Ketentuan serta Tanggung Jawab aspirasi!")
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('location', form.value.location)
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
    
    alert("Aspirasi berhasil dikirim!")
    
    selectedFiles.value.forEach(item => {
      if(item.preview) URL.revokeObjectURL(item.preview)
    })
    
    navigateTo('/user/aspiration/list-page')

  } catch (error) {
    console.error("Error submit aspirasi:", error)
    alert("Gagal mengirim aspirasi. Coba lagi!")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="bg-white rounded-4xl py-10 px-12 mt-3 mb-16 space-y-5 w-full">
      <div class="w-full flex items-center gap-3 text-left">
        <img 
          :src="auth?.user?.image || defaultProfileImage" 
          alt="Profile" 
          class="size-12 rounded-full object-cover shrink-0 border border-gray-100"
        />
        
        <div class="flex flex-col items-start min-w-0">
          <span class="font-bold text-black text-[15px] leading-tight truncate w-full">
            {{ auth.user?.profile?.name || '-' }}
          </span>
          <span class="text-xs text-gray-500 mt-1 font-medium">
            {{ auth.user?.profile?.nis || '-' }} • {{ auth.user?.profile?.rombel || '-' }}
          </span>
        </div>
      </div>

      <div>
        <div class="space-y-3">
          <UiInput v-model="form.title" label="Judul" placeholder="Tambah judul" variant="gray" />
          <UiInput v-model="form.location" label="Lokasi" placeholder="Tambah lokasi" variant="gray" />
          <UiInput v-model="form.description" label="Deskripsi" placeholder="Tambah deskripsi" type="textarea" variant="gray" />
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
              class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </div>
        </div>

        <div class="flex gap-2 items-center z-10">
          <UiDropdownCategory v-model="form.category_id" />
          
          <UiFileUpload 
            v-if="selectedFiles.length < 5"
            @file-selected="handleFileAdded" 
          />
        </div>
      </div>

      <div class="space-y-2 mb-7 mt-4">
        <UiCheckbox v-model="agreeTos" label="Saya sudah membaca dan menyetujui yang ada dalam" link="Terms of Service" @open-link="showTosModal = true" />
        <UiCheckbox v-model="agreeResponsibility" label="Saya mengetahui bahwa Aspirasi yang saya buat merupakan tanggung jawab saya" />
      </div>

      <UiButton 
        @click="handleSubmit"
        :label="isSubmitting ? 'Mengirim...' : 'Kirim'" 
        color="black" 
        :showIcon="false"
        :disabled="isSubmitting"
      />
    </div>
  </div>

  <UiModalDefault v-model="showTosModal" :title="TOS_DATA.title" maxWidth="max-w-3xl">
    <UiModalDataToS />
  </UiModalDefault>
</template>