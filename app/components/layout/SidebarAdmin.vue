<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNotification } from '~/composables/api/useNotification' 
import defaultImage from '~/assets/images/core_profile.jpg'
import { useAuthStore } from '~/stores/useAuthStore'

const auth = useAuthStore()

const { fetchNotification } = useNotification()
const { data: response } = await fetchNotification()

const unreadCount = computed(() => {
  const notifications = response.value?.data || []
  return notifications.filter((notif: any) => !notif.is_read).length
})

const isAspirationOpen = ref(true) 

const isOpen = ref(false)
const isMobileAspirationOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => {
  isOpen.value = false
})

onMounted(async () => {
  if (!auth.user?.profile) {
    try {
      await auth.fetchProfile()
    } catch (err) {
      console.error("Gagal mengambil data profil:", err)
    }
  }
})
</script>

<template>
  <aside class="hidden lg:flex w-65 h-screen flex-col py-8 px-5 sticky top-0 shrink-0">
    <div class="mb-10 px-2">
      <img src="~/assets/images/logo.png" alt="Logo" class="w-14 h-14 shrink-0" />
    </div>
    
    <nav class="flex flex-col gap-2 flex-1 w-full overflow-y-auto no-scrollbar">
      
      <NuxtLink to="/admin/dashboard" #default="{ isActive }">
        <NavIcon 
          label="Dashboard" 
          name="i-lucide-home" 
          :is-active="isActive" 
        />
      </NuxtLink>

      <div>
        <NavIcon 
          label="Aspiration" 
          name="i-lucide-activity" 
          :is-dropdown="true"
          :is-open="isAspirationOpen"
          @click="isAspirationOpen = !isAspirationOpen"
        />
        
        <div v-show="isAspirationOpen" class="flex flex-col gap-1 mt-1 pl-10 pr-2">
          <NuxtLink to="/admin/aspiration/list-page" #default="{ isActive }">
            <NavIcon label="Semua List" :is-active="isActive" />
          </NuxtLink>
          <NuxtLink to="/admin/aspiration/by-category" #default="{ isActive }">
            <NavIcon label="Kategori" :is-active="isActive" />
          </NuxtLink>
          <NuxtLink to="/admin/aspiration/history" #default="{ isActive }">
            <NavIcon label="Riwayat" :is-active="isActive" />
          </NuxtLink>
        </div>
      </div>

      <NuxtLink to="/admin/notification" #default="{ isActive }">
        <NavIcon 
          label="Notification" 
          name="i-lucide-bell" 
          :badge-count="unreadCount" 
          :is-active="isActive" 
        />
      </NuxtLink>
    </nav>

    <div class="mt-auto shrink-0 pt-4 border-t border-gray-100">
      <NuxtLink to="/admin/profile" class="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
        <img :src="auth?.user?.image || defaultImage" alt="Profile" class="object-cover rounded-full w-12 h-12" />  
        <div class="flex flex-col overflow-hidden">
          <span class="text-sm font-bold text-black truncate">{{ auth?.user?.name || '-' }}</span>
          <span class="text-xs text-tertiary truncate">{{ auth?.user?.email || '-' }}</span>
        </div>
      </NuxtLink>
    </div>
  </aside>

  <div class="lg:hidden fixed top-4 right-4 z-50">
    <div
      :class="[
          'bg-white backdrop-blur-md',
          'transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)', 
          isOpen
            ? 'rounded-3xl h-112 w-[85vw] bg-opacity-95'
            : 'rounded-xl h-12 w-12 bg-opacity-100'
        ]"
        class="origin-top-right overflow-hidden relative">
      
      <button class="absolute top-0 right-0 w-12 h-12 flex items-center justify-center z-20" @click="isOpen = !isOpen">
        <UIcon 
          :name="isOpen ? 'i-lucide-x' : 'i-lucide-menu'" 
          class="size-6 text-gray-600 hover:text-black duration-300" 
          :class="isOpen ? 'rotate-90' : 'rotate-0'"
        />
        <span v-if="!isOpen && unreadCount > 0" class="absolute top-2 right-2 flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
        </span>
      </button>

      <div class="px-6 pt-16 flex flex-col gap-4 h-full overflow-y-auto pb-6" :class="isOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'">
        
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Menu Admin</p>
        
        <NuxtLink to="/admin/dashboard" class="text-lg font-bold text-black hover:text-blue-600 transition-colors">
          Dashboard
        </NuxtLink>
        
        <div>
          <button @click="isMobileAspirationOpen = !isMobileAspirationOpen" class="flex items-center justify-between w-full text-lg font-bold text-black hover:text-blue-600 transition-colors">
            Aspiration
            <UIcon name="i-lucide-chevron-down" class="size-5 transition-transform duration-300 text-gray-500" :class="isMobileAspirationOpen ? 'rotate-180' : ''" />
          </button>
          
          <div v-show="isMobileAspirationOpen" class="flex flex-col gap-3 mt-3 pl-4 border-l-2 border-gray-100">
            <NuxtLink to="/admin/aspiration/list-page" class="text-base font-semibold text-gray-500 hover:text-black">
              Semua List
            </NuxtLink>
            <NuxtLink to="/admin/aspiration/by-category" class="text-base font-semibold text-gray-500 hover:text-black">
              Kategori
            </NuxtLink>
            <NuxtLink to="/admin/aspiration/history" class="text-base font-semibold text-gray-500 hover:text-black">
              Riwayat
            </NuxtLink>
          </div>
        </div>

        <NuxtLink to="/admin/notification" class="flex items-center justify-between text-lg font-bold text-black hover:text-blue-600 transition-colors mt-1">
          Notification
          <span v-if="unreadCount > 0" class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{{ unreadCount }}</span>
        </NuxtLink>

        <div class="h-px w-full bg-gray-200 my-2"></div>

        <NuxtLink to="/admin/profile" class="flex items-center gap-3 text-lg font-bold text-black hover:text-blue-600 transition-colors mt-1">
          <img :src="auth?.user?.image || defaultImage" alt="Profile" class="w-8 h-8 rounded-full object-cover border border-gray-200" />
          <div class="flex flex-col">
            <span class="text-base truncate">{{ auth?.user?.name || 'Profil Akun' }}</span>
          </div>
        </NuxtLink>

      </div>
    </div>
  </div>

  <div v-if="isOpen" class="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm transition-opacity" @click="isOpen = false"></div>
</template>