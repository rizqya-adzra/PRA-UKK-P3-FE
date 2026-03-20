<script setup lang="ts">
import { useNotification } from '~/composables/api/useNotification' 

const { fetchNotification } = useNotification()

const { data: response } = await fetchNotification()

const unreadCount = computed(() => {
  const notifications = response.value?.data || []
  
  return notifications.filter((notif: any) => !notif.is_read).length
})
</script>

<template>
  <header class="sticky top-0 z-50 w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 flex items-center justify-between">
    
    <div class="flex items-center gap-8">
      <img src="~/assets/images/logo.png" alt="Logo" class="w-10 h-10 shrink-0" />

      <nav class="flex items-center gap-2">
        <NuxtLink to="/user/">
          <NavButton label="Beranda" />
        </NuxtLink>
        <NuxtLink to="/user/aspiration/list-page">
          <NavButton label="Aspirasi Kamu" />
        </NuxtLink>
        <NuxtLink to="/user/aspiration/create">
          <NavButton label="Buat Aspirasi" />
        </NuxtLink>
      </nav>
    </div>

    <div class="flex items-center gap-3">
      <NuxtLink to="/user/aspiration/history">
        <NavIcon icon-name="i-lucide-archive" />
      </NuxtLink>
      <NuxtLink to="/user/notification">
        <NavIcon icon-name="i-lucide-bell" :badge-count="unreadCount" />
      </NuxtLink>
      <div class="border border-black/10 h-8"></div>
      <NavIcon icon-name="i-lucide-user" />
    </div>

  </header>
</template>