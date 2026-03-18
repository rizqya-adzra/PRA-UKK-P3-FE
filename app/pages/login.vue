<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'guest'
})

const authStore = useAuthStore()
const router = useRouter()

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
</script>

<template>
  <img src="~/assets/images/auth_bg.jpg" alt="background" class="fixed inset-0 w-full h-full object-cover -z-10" />
  
  <div class="min-h-screen flex items-center justify-center text-sm m-5">
    <div class="bg-white/80 backdrop-blur-md rounded-3xl px-12 py-20 w-full max-w-md shadow-2xl shadow-white/50 relative">
      
      <div class="flex flex-col gap-4 justify-center items-center">
        <img src="~/assets/images/logo.png" alt="Logo" class="w-20 h-20 shrink-0" />
        <h2 class="text-3xl font-bold mb-14 text-center">Sign in to <span class="text-electric-blue">Aspiration</span></h2>
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

        <p class="text-center mt-2">
          Baru di Aspiration? 
          <NuxtLink to="/register" class="text-blue-500 hover:text-blue-600 font-medium hover:underline transition-all">
            Buat Akun
          </NuxtLink>
        </p>

        <div class="border border-black/10 mt-6"></div>
        
        <div class="flex gap-3 justify-center items-center text-black/40 text-xs mt-4">
          <p class="cursor-pointer hover:text-black transition-colors">Terms of Service</p>
          <p>|</p>
          <p class="cursor-pointer hover:text-black transition-colors">Privacy Policy</p>
        </div>
      </form>

    </div>
  </div>
</template>