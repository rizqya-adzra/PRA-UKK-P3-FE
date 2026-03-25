<script setup lang="ts">
import { useAuthStore } from '~/stores/useAuthStore'
import { useAspiration } from '~/composables/api/useAspiration'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

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
  <div class="min-h-screen w-full mb-16">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      <div class="lg:col-span-6 relative mt-16">
        <div class="absolute -top-16 left-8 w-32 h-32 bg-[#D9D9D9] rounded-full border-[6px] border-white z-10 overflow-hidden flex items-center justify-center">
           <img v-if="auth?.user?.image" :src="auth.user.image" alt="Profile" class="w-full h-full object-cover" />
           <UIcon v-else name="i-lucide-user" class="w-12 h-12 text-gray-400" />
        </div>
        
        <div class="bg-white rounded-4xl pt-20 pb-10 px-8">
          <h2 class="text-2xl font-bold">{{ auth?.user?.name || 'Nama Lengkap Siswa' }}</h2>
          <p class="text-sm text-gray-500 mt-2 uppercase tracking-wide">
            {{ auth?.user?.nis || 'NIS' }} | {{ auth?.user?.rombel || 'ROMBEL' }} | {{ auth?.user?.rayon || 'RAYON' }}
          </p>
          <a :href="`mailto:${user?.email}`" class="text-sm text-gray-600 underline mt-1 block hover:text-blue-600 transition-colors">
            {{ user?.email || 'email@contoh.com' }}
          </a>
          
          <button class="w-full mt-6 py-2.5 border-2 rounded-full text-sm font-semibold hover:bg-black hover:text-white duration-400 transition-all cursor-pointer" @click="handleOpenEditProfile">
            Edit Profil
          </button>
          
          <svg class="w-full text-gray-200 my-8" height="2" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="1" x2="100%" y2="1" stroke="currentColor" stroke-width="2" stroke-dasharray="12 12" />
          </svg>
          
          <div class="grid grid-cols-3 gap-2 text-center">
            <div>
              <p class="text-3xl font-black text-gray-900">{{ stats.total }}</p>
              <p class="text-xs font-bold text-gray-900 mt-1 leading-tight">Aspirasi yang<br>disampaikan</p>
            </div>
            <div>
              <p class="text-3xl font-black text-gray-900">{{ stats.selesai }}</p>
              <p class="text-xs font-bold text-gray-900 mt-1 leading-tight">Sudah<br>terlaksanakan</p>
            </div>
            <div>
              <p class="text-3xl font-black text-gray-900">{{ stats.proses }}</p>
              <p class="text-xs font-bold text-gray-900 mt-1 leading-tight">Masih dalam<br>proses</p>
            </div>
          </div>
        </div>

        <div class="px-8 mt-6 space-y-3">
          <p class="block underline text-sm cursor-pointer text-gray-500 hover:text-black" @click="showTosModal = true">Terms of Service</p>
          <p  class="block underline text-sm cursor-pointer text-gray-500 hover:text-black" @click="showPrivacyPolicyModal = true">Privacy Policy</p>
          <button @click="isLogoutModalOpen = true" class="block text-sm cursor-pointer text-red-400 underline hover:text-red-600 w-max">Logout</button>
        </div>
      </div>

      <div class="lg:col-span-6 lg:mt-4">
        <div class="flex items-center justify-between mb-3 px-2 mt-4 lg:mt-0">
          <h1 class="text-3xl font-bold">Riwayat</h1>
          <UIcon name="i-lucide-bar-chart-2" class="w-7 h-7 text-gray-800" />
        </div>
        
        <div class="space-y-3">
          <template v-if="recentHistories.length > 0">
            <UiCard 
              v-for="report in recentHistories" 
              :key="report.id" 
              :report="report" 
            />
          </template>
          
          <div v-else class="text-center py-12 bg-white rounded-4xl border border-gray-100">
            <p class="text-gray-500 font-medium">Belum ada riwayat aspirasi.</p>
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
      <div class="flex items-center gap-4">
        <div class="w-20 h-20 bg-gray-100 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden">
          <img 
            v-if="profileForm.imagePreview || auth?.user?.image" 
            :src="profileForm.imagePreview || auth?.user?.image || undefined" 
            alt="Profile Preview" 
            class="w-full h-full object-cover"
          />
          <UIcon v-else name="i-lucide-user" class="w-8 h-8 text-gray-400" />
        </div>

        <button 
          v-if="profileForm.imagePreview"
          @click="removeImage"
          class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <UIcon name="i-lucide-x" class="w-3 h-3" />
        </button>

        <div class="flex-1">
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
          <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG, Max: 5MB</p>
        </div>
      </div>
    </div>

    <div class="space-y-5">
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
      <div class="flex items-center justify-end gap-3 w-full">
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

  <UiModalDefault v-model="showTosModal" :title="TOS_DATA.title" maxWidth="max-w-3xl">
    <UiModalDataToS />
  </UiModalDefault>

  <UiModalDefault v-model="showPrivacyPolicyModal" :title="PRIVACY_POLICY.title" maxWidth="max-w-3xl">
    <UiModalDataPrivacyPolicy />
  </UiModalDefault>

  <UiModalDefault 
    v-model="isLogoutModalOpen" 
    title="Apakah Anda yakin untuk logout?" 
    maxWidth="max-w-md"
  >
    <div class="space-y-4">
      <p class="text-gray-600">
        Kamu harus login kembali untuk mengakses data-data aspirasimu 
      </p>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full">
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