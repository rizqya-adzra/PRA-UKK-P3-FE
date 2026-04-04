<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/api/useAuth'

definePageMeta({
  middleware: 'auth',
  layout: 'guest'
})

const { authStore, router, showTosModal, showPrivacyPolicyModal } = useAuth()

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password
    })

    router.push('/') 
    console.log('Login sukses!')

  } catch (error) {
    console.error('Login gagal', error)
  }
}

useHead({
  title: 'Login | Aspiration',
})
</script>

<template>
  <img src="~/assets/images/auth_bg.jpg" alt="background" class="fixed inset-0 w-full h-full object-cover -z-10" />
  
  <div class="min-h-screen flex items-center justify-center text-sm m-4 md:m-5">
    <div class="bg-white rounded-2xl md:rounded-3xl px-8 md:px-12 py-10 md:py-16 w-full max-w-md shadow-2xl shadow-white/50 relative">
      
      <div class="flex flex-col gap-3 md:gap-4 justify-center items-center">
        <img src="~/assets/images/logo.png" alt="Logo" class="w-16 h-16 md:w-20 md:h-20 shrink-0" />
        <h2 class="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">Sign in to Aspiration</h2>
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        
        <UiInput 
          v-model="form.email"
          label="Email" 
          placeholder="Masukkan email" 
          variant="auth" 
          :error="authStore.validationErrors?.email || authStore.validationErrors?.detail || ''"
        />

        <UiInput 
          v-model="form.password"
          label="Password" 
          placeholder="Masukkan password" 
          type="password" 
          variant="auth" 
          showForgot 
          :error="authStore.validationErrors?.password || authStore.validationErrors?.detail || ''"
        />

        <UiButton 
          type="submit" 
          label="Sign In" 
          :disabled="authStore.loading"
          :class="{'opacity-70 cursor-not-allowed': authStore.loading}"
        >
          <span v-if="authStore.loading">Loading...</span>
          <span v-else>Sign In</span>
        </UiButton>

        <p class="text-center mt-2 text-xs md:text-sm">
          Baru di Aspiration? 
          <NuxtLink to="/register" class="text-blue-500 hover:text-blue-600 font-medium hover:underline transition-all">
            Buat Akun
          </NuxtLink>
        </p>

        <div class="border border-black/10 mt-4 md:mt-6"></div>
        
        <div class="flex gap-3 justify-center items-center text-black/40 text-[10px] md:text-xs mt-4">
          <p class="cursor-pointer hover:text-black transition-colors" @click="showTosModal = true">Terms of Service</p>
          <p>|</p>
          <p class="cursor-pointer hover:text-black transition-colors" @click="showPrivacyPolicyModal = true">Privacy Policy</p>
        </div>
      </form>

    </div>
  </div>

  <UiModalDefault v-model="showTosModal" :title="TOS_DATA?.title || 'Terms of Service'" maxWidth="max-w-3xl">
    <UiModalDataToS />
  </UiModalDefault>

  <UiModalDefault v-model="showPrivacyPolicyModal" :title="PRIVACY_POLICY?.title || 'Privacy Policy'" maxWidth="max-w-3xl">
    <UiModalDataPrivacyPolicy />
  </UiModalDefault>
</template>