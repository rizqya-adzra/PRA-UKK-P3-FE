<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotification } from '~/composables/api/useNotification' 
import { useAuthStore } from '~/stores/useAuthStore'

const auth = useAuthStore()

const { fetchNotification } = useNotification()
const { data: response } = await fetchNotification()

const unreadCount = computed(() => {
  const notifications = response.value?.data || []
  return notifications.filter((notif: any) => !notif.is_read).length
})

const isAspirationOpen = ref(true) 

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
  <aside class="w-65 h-screen flex flex-col py-8 px-5">
    <div class="mb-10 px-2">
      <img src="~/assets/images/logo.png" alt="Logo" class="w-14 h-14 shrink-0" />
    </div>
    
    <nav class="flex flex-col gap-2 flex-1 w-full">
      
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

    <div class="mt-auto shrink-0 pt-4">
      <NuxtLink to="/admin/profile" class="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
        <img v-if="auth?.user?.image" :src="auth.user.image" alt="Profile" class="object-cover rounded-full w-12 h-12" />  
        <div class="flex flex-col overflow-hidden">
          <span class="text-sm font-bold text-black truncate">{{ auth?.user?.name || '-' }}</span>
          <span class="text-xs text-tertiary truncate">{{ auth?.user?.email || '-' }}</span>
        </div>
      </NuxtLink>
    </div>
  </aside>
</template>