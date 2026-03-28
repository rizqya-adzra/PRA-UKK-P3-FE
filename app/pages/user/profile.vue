<script setup lang="ts">
import { useAuthStore } from '~/stores/useAuthStore'
import { useAspiration } from '~/composables/api/useAspiration'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const router = useRouter()
const auth = useAuthStore()
const showTosModal = ref(false)
const showPrivacyPolicyModal = ref(false)
const isLogoutModalOpen = ref(false)
const { fetchAspirationStats, fetchAspirations } = useAspiration()

const isEditProfileModalOpen = ref(false)
const profileForm = ref({
  name: '',
  nis: '',
  rombel: '',
  rayon: '',
  image: null as File | null,
  imagePreview: ''
})

const isChangePasswordModalOpen = ref(false)
const passwordForm = ref({
  old_password: '',
  new_password: '',
})

const { data: statsResponse } = await fetchAspirationStats()
const { data: Response } = await fetchAspirations()

const user = computed(() => auth.user)
const stats = computed(() => statsResponse.value?.data || { total: 0, selesai: 0, proses: 0 })

const recentHistories = computed(() => {
  return Response.value?.data?.slice(0, 3) || []
})

const handleOpenEditProfile = () => {
  profileForm.value = {
    name: user.value?.profile?.name || user.value?.name || '',
    nis: user.value?.profile?.nis || user.value?.nis || '',
    rombel: user.value?.profile?.rombel || user.value?.rombel || '',
    rayon: user.value?.profile?.rayon || user.value?.rayon || '',
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
      payload.append('profile[nis]', String(profileForm.value.nis || ''))
      payload.append('profile[rombel]', profileForm.value.rombel)
      payload.append('profile[rayon]', profileForm.value.rayon)
      payload.append('image', profileForm.value.image)
    } else {
      payload = {
        profile: {
          name: profileForm.value.name,
          nis: Number(profileForm.value.nis),
          rombel: profileForm.value.rombel,
          rayon: profileForm.value.rayon
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

const goToDetail = (id: string) => {
  router.push(`/user/aspiration/detail/${id}`)
}
</script>

<template>
  <div class="min-h-screen w-full mb-16 bg-[#F8F9FA] lg:bg-transparent py-4 lg:py-0">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      <div class="lg:col-span-6 relative mt-16">
        <div class="absolute -top-14 lg:-top-16 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0 w-28 h-28 lg:w-32 lg:h-32 bg-[#D9D9D9] rounded-full border-4 lg:border-6 border-white z-10 overflow-hidden flex items-center justify-center">
           <img v-if="auth?.user?.image" :src="auth.user.image" alt="Profile" class="w-full h-full object-cover" />
           <UIcon v-else name="i-lucide-user" class="w-10 h-10 lg:w-12 lg:h-12 text-gray-400" />
        </div>
        
        <div class="bg-white rounded-3xl lg:rounded-4xl pt-16 lg:pt-20 pb-8 lg:pb-10 px-5 lg:px-8 border border-gray-100 lg:border-none flex flex-col items-center lg:items-start">
          <h2 class="text-xl lg:text-2xl font-bold text-center lg:text-left">{{ auth?.user?.name || 'Nama Lengkap Siswa' }}</h2>
          <p class="text-[11px] lg:text-sm text-gray-500 mt-1 lg:mt-2 uppercase tracking-wide text-center lg:text-left">
            {{ auth?.user?.nis || 'NIS' }} | {{ auth?.user?.rombel || 'ROMBEL' }} | {{ auth?.user?.rayon || 'RAYON' }}
          </p>
          <a :href="`mailto:${user?.email}`" class="text-xs lg:text-sm text-gray-600 underline mt-1 block hover:text-blue-600 transition-colors text-center lg:text-left">
            {{ user?.email || 'email@contoh.com' }}
          </a>
          
          <div class="flex flex-col items-center gap-3 mt-6 lg:mt-8 w-full max-w-sm mx-auto lg:mx-0">
            <button class="w-full py-2 border-2 border-gray-400 rounded-full text-xs lg:text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer" @click="handleOpenEditProfile">
              Edit Profil
            </button>
            <button class="w-full py-2 border-2 border-gray-400 rounded-full text-xs lg:text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer" @click="isChangePasswordModalOpen = true">
              Change Password
            </button>
          </div>
              
          <svg class="w-full text-gray-200 my-6 lg:my-8" height="2" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="1" x2="100%" y2="1" stroke="currentColor" stroke-width="2" stroke-dasharray="12 12" />
          </svg>
          
          <div class="grid grid-cols-3 gap-1 lg:gap-2 text-center w-full">
            <div>
              <p class="text-2xl lg:text-3xl font-black text-gray-900">{{ stats.total }}</p>
              <p class="text-xs lg:text-sm font-bold text-gray-900 mt-1 leading-tight">Aspirasi yang<br>disampaikan</p>
            </div>
            <div>
              <p class="text-2xl lg:text-3xl font-black text-gray-900">{{ stats.selesai }}</p>
              <p class="text-xs lg:text-sm font-bold text-gray-900 mt-1 leading-tight">Sudah<br>terlaksanakan</p>
            </div>
            <div>
              <p class="text-2xl lg:text-3xl font-black text-gray-900">{{ stats.proses }}</p>
              <p class="text-xs lg:text-sm font-bold text-gray-900 mt-1 leading-tight">Masih dalam<br>proses</p>
            </div>
          </div>
        </div>

        <div class="px-5 lg:px-8 mt-6 space-y-3 flex flex-col items-center lg:items-start">
          <p class="block underline text-sm cursor-pointer text-gray-500 hover:text-black" @click="showTosModal = true">Terms of Service</p>
          <p  class="block underline text-sm cursor-pointer text-gray-500 hover:text-black" @click="showPrivacyPolicyModal = true">Privacy Policy</p>
          <button @click="isLogoutModalOpen = true" class="block text-sm cursor-pointer text-red-400 underline hover:text-red-600 w-max">Logout</button>
        </div>
      </div>

      <div class="lg:col-span-6 lg:mt-4 mt-8">
        <div class="flex items-center justify-between mb-3 px-2">
          <h1 class="text-xl lg:text-3xl font-bold">Riwayat</h1>
          <UIcon name="i-lucide-bar-chart-2" class="w-6 h-6 lg:w-7 lg:h-7 text-gray-800" />
        </div>
        
        <div class="space-y-3">
          <template v-if="recentHistories.length > 0">
            <UiCardDefault 
              v-for="report in recentHistories" 
              :key="report.id" 
              :report="report" 
              @click="goToDetail(report.id)" 
            />
          </template>
          
          <div v-else class="text-center py-12 bg-white rounded-3xl lg:rounded-4xl border border-gray-100">
            <p class="text-gray-500 font-medium text-sm lg:text-base">Belum ada riwayat aspirasi.</p>
          </div>
        </div>
      </div>
      
    </div>
  </div>

  <UiModalDefault 
    v-model="isEditProfileModalOpen" 
    title="Edit Profil" 
    maxWidth="max-w-xl"
  >
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
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
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
      <UiInput 
        v-model="profileForm.nis" 
        label="NIS" 
        placeholder="Masukkan NIS" 
        variant="gray" 
      />
      <UiInput 
        v-model="profileForm.rombel" 
        label="Rombel" 
        placeholder="Masukkan Rombel (ex: PPLG XII-5)" 
        variant="gray" 
      />
      <UiInput 
        v-model="profileForm.rayon" 
        label="Rayon" 
        placeholder="Masukkan Rayon (ex: Tajur 4)" 
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

  <UiModalDefault 
    v-model="isLogoutModalOpen" 
    title="Apakah Anda yakin untuk logout?" 
    maxWidth="max-w-md"
  >
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
        />
      </div>
    </template>
  </UiModalDefault>
</template>