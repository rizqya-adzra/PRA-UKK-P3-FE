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
  <aside class="w-16 m-5 h-[calc(100vh-40px)] bg-white rounded-3xl flex flex-col items-center py-8 border border-gray-100">
    
    <img src="~/assets/images/logo.png" alt="Logo" class="w-10 h-10 mb-10 shrink-0" />
    
    <nav class="flex flex-col gap-4 flex-1 w-full px-3">
      <NuxtLink to="/admin/dashboard" #default="{ isActive }">
        <NavIcon icon-name="i-lucide-home" class="w-full" :is-active="isActive" />
      </NuxtLink>
      <NuxtLink to="/admin/aspiration/list-page" #default="{ isActive }">
        <NavIcon icon-name="i-lucide-book" class="w-full" :is-active="isActive" />
      </NuxtLink>
      <NuxtLink to="/admin/notification" #default="{ isActive }">
        <NavIcon icon-name="i-lucide-bell" class="w-full" :badge-count="unreadCount" :is-active="isActive" />
      </NuxtLink>
      <NuxtLink to="/admin/aspiration/history" #default="{ isActive }">
        <NavIcon icon-name="i-lucide-box" class="w-full" :is-active="isActive" />
      </NuxtLink>
    </nav>

    <div class="mt-auto shrink-0">
      <NuxtLink to="/admin/profile" #default="{ isActive }">
        <NavIcon icon-name="i-lucide-user" :is-active="isActive" />
      </NuxtLink>
    </div>
    
  </aside>
</template>