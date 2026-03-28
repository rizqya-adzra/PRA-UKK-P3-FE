<script setup lang="ts">
import { useAuthStore } from '~/stores/useAuthStore'
import { useAspiration } from '~/composables/api/useAspiration'
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const auth = useAuthStore()
const showTosModal = ref(false)
const showPrivacyPolicyModal = ref(false)
const isLogoutModalOpen = ref(false)
const { fetchAspirationStats } = useAspiration()

const isEditProfileModalOpen = ref(false)
const profileForm = ref({
  name: '',
  image: null as File | null,
  imagePreview: ''
})

const isChangePasswordModalOpen = ref(false)
const passwordForm = ref({
  old_password: '',
  new_password: '',
})

const { data: stats } = await fetchAspirationStats()

const user = computed(() => auth.user)

const handleOpenEditProfile = () => {
  profileForm.value = {
    name: user.value?.profile?.name || user.value?.name || '',
    image: null,
    imagePreview: ''
  }
  isEditProfileModalOpen.value = true
}

const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    profileForm.value.image = file
    profileForm.value.imagePreview = URL.createObjectURL(file)
  }
}

const removeImage = () => {
  if (profileForm.value.imagePreview) {
    URL.revokeObjectURL(profileForm.value.imagePreview)
  }
  profileForm.value.image = null
  profileForm.value.imagePreview = ''
}

const handleSaveProfile = async () => {
  try {
    let payload: FormData | Record<string, any>

    if (profileForm.value.image) {
      payload = new FormData()
      payload.append('profile[name]', profileForm.value.name)
      payload.append('image', profileForm.value.image)
    } else {
      payload = {
        profile: {
          name: profileForm.value.name
        }
      }
    }

    await auth.updateProfile(payload)

    if (profileForm.value.imagePreview) {
      URL.revokeObjectURL(profileForm.value.imagePreview)
    }

    isEditProfileModalOpen.value = false
  } catch (error) {
    console.error('Gagal memperbarui profil:', error)
  }
}

const handleSavePassword = async () => {
  try {
      await auth.changePassword(passwordForm.value)
      alert('Password berhasil diubah! Silakan login kembali')
      passwordForm.value = { old_password: '', new_password: '' }
    } catch (error) {
      console.error('Gagal ubah password', error)
    }
}

const handleConfirmLogout = async () => {
  await auth.logout()
  isLogoutModalOpen.value = false 
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

watch(isEditProfileModalOpen, (isOpen) => {
  if (!isOpen && profileForm.value.imagePreview) {
    URL.revokeObjectURL(profileForm.value.imagePreview)
    profileForm.value.imagePreview = ''
    profileForm.value.image = null
  }
})
</script>

<template>
  <div class="mt-20 md:mt-24 px-4 w-full max-w-4xl mx-auto">
    
    <div class="relative bg-white rounded-3xl md:rounded-4xl pt-16 md:pt-20 pb-8 md:pb-12 px-5 md:px-8 text-center w-full border border-gray-100 md:border-none">
      
      <div class="absolute -top-16 md:-top-24 left-1/2 transform -translate-x-1/2 w-32 h-32 md:w-44 md:h-44 bg-[#D9D9D9] rounded-full border-4 md:border-8 border-[#F6F6F6] z-10 overflow-hidden flex items-center justify-center">
          <img v-if="auth?.user?.image" :src="auth.user.image" alt="Profile" class="w-full h-full object-cover" />
          <UIcon v-else name="i-lucide-user" class="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
      </div>
      
      <h2 class="text-xl md:text-2xl font-bold text-black">{{ auth?.user?.name || '-' }}</h2>

      <a :href="user?.email ? `mailto:${user.email}` : undefined" class="text-xs md:text-sm text-gray-600 underline mt-1 md:mt-2 inline-block hover:text-blue-600 transition-colors">
        {{ user?.email || '-' }}
      </a>

      <div class="flex flex-col items-center gap-3 mt-6 md:mt-8 w-full max-w-sm mx-auto">
        <button class="w-full py-2 border-2 border-gray-400 rounded-full text-xs md:text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer" @click="handleOpenEditProfile">
          Edit Profil
        </button>
        <button class="w-full py-2 border-2 border-gray-400 rounded-full text-xs md:text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer" @click="isChangePasswordModalOpen = true">
          Change Password
        </button>
      </div>

      <svg class="w-full text-gray-200 md:text-gray-300 my-6 md:my-10" height="2" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="1" x2="100%" y2="1" stroke="currentColor" stroke-width="2" stroke-dasharray="12 12" md:stroke-dasharray="16 20" />
      </svg>

      <div class="grid grid-cols-3 gap-2 md:gap-4 text-center">
        <div>
          <p class="text-3xl md:text-5xl font-black text-black">{{ stats?.data.selesai || 0 }}</p>
          <p class="text-[11px] md:text-sm font-bold text-black mt-1 md:mt-2 leading-tight">Aspirasi yang<br>disampaikan</p>
        </div>
        <div>
          <p class="text-3xl md:text-5xl font-black text-black">{{ stats?.data.proses || 0 }}</p>
          <p class="text-[11px] md:text-sm font-bold text-black mt-1 md:mt-2 leading-tight">Sudah<br>terlaksanakan</p>
        </div>
        <div>
          <p class="text-3xl md:text-5xl font-black text-black">{{ stats?.data.menunggu || 0 }}</p>
          <p class="text-[11px] md:text-sm font-bold text-black mt-1 md:mt-2 leading-tight">Masih dalam<br>proses</p>
        </div>
      </div>

    </div> 
    
    <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-6 md:mt-8 mb-12">
      <p class="block underline text-sm cursor-pointer text-gray-500 hover:text-black" @click="showTosModal = true">Terms of Service</p>
      <p class="block underline text-sm cursor-pointer text-gray-500 hover:text-black" @click="showPrivacyPolicyModal = true">Privacy Policy</p>
      <button @click="isLogoutModalOpen = true" class="block text-sm cursor-pointer text-red-400 font-bold hover:text-red-600 underline">Logout</button>
    </div>

  </div> 
  
  <UiModalDefault v-model="isEditProfileModalOpen" title="Edit Profil" maxWidth="max-w-xl">
    <div class="space-y-3 mb-7">        
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div class="relative w-20 h-20 bg-gray-100 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden shrink-0 mx-auto md:mx-0">
          <img 
            v-if="profileForm.imagePreview || auth?.user?.image" 
            :src="profileForm.imagePreview || auth?.user?.image || undefined" 
            alt="Profile Preview" 
            class="w-full h-full object-cover"
          />
          <UIcon v-else name="i-lucide-user" class="w-8 h-8 text-gray-400" />
          
          <button 
            v-if="profileForm.imagePreview"
            @click="removeImage"
            class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-20"
          >
            <UIcon name="i-lucide-x" class="w-3 h-3" />
          </button>
        </div>
        
        <div class="flex-1 text-center md:text-left">
          <input
            type="file"
            accept="image/*"
            @change="handleImageSelect"
            class="hidden"
            id="profile-image-input"
          />
          <label 
            for="profile-image-input"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <UIcon name="i-lucide-camera" class="w-4 h-4 mr-2" />
            Pilih Gambar
          </label>
          <p class="text-xs text-gray-500 mt-2 md:mt-1">Format: JPG, PNG, Max: 5MB</p>
        </div>
      </div>
    </div>
    <div class="space-y-4 md:space-y-5">
      <UiInput 
        v-model="profileForm.name" 
        label="Nama Lengkap" 
        placeholder="Masukkan nama lengkap" 
        variant="gray" 
      />
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full mt-4 md:mt-0">
        <UiButton 
          label="Simpan Perubahan" 
          variant="imperative" 
          color="black" 
          @click="handleSaveProfile"
          :loading="auth.loading"
          class="w-full md:w-auto"
        />
      </div>
    </template>
  </UiModalDefault>

  <UiModalDefault v-model="isChangePasswordModalOpen" title="Change Password" maxWidth="max-w-md">
    <div class="space-y-4 md:space-y-5">
      <UiInput 
        v-model="passwordForm.old_password" 
        label="Password Lama" 
        type="password"
        placeholder="Masukkan password lama" 
        variant="gray" 
      />
      <UiInput 
        v-model="passwordForm.new_password" 
        label="Password Baru" 
        type="password"
        placeholder="Masukkan password baru" 
        variant="gray" 
      />
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full mt-4 md:mt-0">
        <UiButton 
          label="Simpan Password" 
          variant="imperative" 
          color="black" 
          @click="handleSavePassword"
          :loading="auth.loading"
          class="w-full md:w-auto"
        />
      </div>
    </template>
  </UiModalDefault>

  <UiModalDefault v-model="showTosModal" :title="TOS_DATA?.title || 'Terms of Service'" maxWidth="max-w-3xl">
    <UiModalDataToS />
  </UiModalDefault>

  <UiModalDefault v-model="showPrivacyPolicyModal" :title="PRIVACY_POLICY?.title || 'Privacy Policy'" maxWidth="max-w-3xl">
    <UiModalDataPrivacyPolicy />
  </UiModalDefault>

  <UiModalDefault v-model="isLogoutModalOpen" title="Apakah Anda yakin untuk logout?" maxWidth="max-w-md">
    <div class="space-y-4">
      <p class="text-gray-600 text-sm md:text-base">
        Kamu harus login kembali untuk mengakses data-data aspirasimu 
      </p>
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full mt-4 md:mt-0">
        <UiButton 
          label="Logout" 
          variant="imperative" 
          color="red" 
          @click="handleConfirmLogout" 
          class="w-full md:w-auto"
        />
      </div>
    </template>
  </UiModalDefault>
</template>