<script setup lang="ts">
import { computed } from 'vue'
import defaultProfileImage from '~/assets/images/core_profile.jpg'
import { useNotification } from '~/composables/api/useNotification'

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const { fetchNotification, markAsRead, markAllAsRead } = useNotification()
const { data: response, pending } = await fetchNotification()
const notifications = computed(() => response.value?.data || [])

const timeAgo = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds} detik lalu`
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} jam lalu`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} hari lalu`

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const handleMarkAll = async () => {
  try {
    await markAllAsRead() 
    
    if (response.value && response.value.data) {
      response.value.data.forEach((notif: any) => {
        notif.is_read = true
      })
    }

    await refreshNuxtData('notifications-list')    

  } catch (error) {
    console.error("Gagal menandai semua notifikasi:", error)
  }
}

const goToAspirationDetail = async (notif: any) => {
  if (notif.aspiration_id) {
    try {
      await markAsRead(notif.id)
      notif.is_read = true
    } catch (error) {
      console.error("Gagal menandai notifikasi sebagai sudah dibaca:", error)
    }
    
    navigateTo(`/admin/aspiration/detail/${notif.aspiration_id}`)
  }
}
</script>

<template>
  <div class="px-28">
    <div class="flex items-end justify-between mb-7 px-10">
      <p class="text-3xl font-bold">Notifikasi</p>
      <p class="text-sm text-blue-500 cursor-pointer hover:underline font-medium" @click="handleMarkAll">
        mark all as read
      </p>
    </div>

    <div v-if="pending" class="flex justify-center items-center py-20">
      <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="notifications.length === 0" class="text-center py-20 text-gray-500">
      <p>Belum ada notifikasi saat ini.</p>
    </div>

    <div v-else class="flex flex-col gap-4">
      <div 
        v-for="notif in notifications" 
        :key="notif.id"
        class="bg-white rounded-4xl p-8 focus:ring focus:ring-blue-500 hover:ring-2 hover:ring-blue-500 duration-400 cursor-pointer transition-all"
        :class="{ 'opacity-70': notif.is_read, 'ring ring-blue-500': !notif.is_read }"
        @click="goToAspirationDetail(notif)"
      >
        <div class="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
          <p class="text-xl font-bold leading-tight flex-1">
            {{ notif.message }}
          </p>
          <div class="flex items-center gap-2 shrink-0">
            <p class="text-gray-500 text-sm font-medium">{{ timeAgo(notif.created_at) }}</p>
            <div v-if="!notif.is_read" class="bg-blue-500 rounded-full w-3 h-3 shadow-sm"></div> 
          </div>
        </div>

        <svg class="w-full text-gray-200 my-4" height="4" xmlns="http://www.w3.org/2000/svg">
          <line x1="2" y1="2" x2="100%" y2="2" stroke="currentColor" stroke-width="2" stroke-dasharray="16 20" stroke-linecap="round" />
        </svg>

        <div class="w-full flex items-center gap-3 text-left mt-5">
          <img 
            :src="notif.student_image || defaultProfileImage" 
            alt="Profile" 
            class="size-12 rounded-full object-cover shrink-0 border border-gray-100"
          />
          
          <div class="flex flex-col items-start min-w-0">
            <span class="font-bold text-black text-[15px] leading-tight truncate w-full">
              {{ notif.student_info?.name || '-' }}
            </span>
            <span class="text-xs text-gray-500 mt-1 font-medium">
              {{ notif.student_info?.nis || '-' }} • {{ notif.student_info?.rombel || '-' }}
            </span>
          </div>
        </div>

        <div class="bg-[#F1F9FF] rounded-xl ml-14 p-5 text-sm mt-3">
          <div class="flex items-center justify-between gap-2">
            <div>
              <p class="font-bold text-gray-800">{{ notif.aspiration_info.name }} <span>- {{ notif.aspiration_info.location }}</span></p>
              <p class="text-gray-600 mt-1 line-clamp-2">
                {{ notif.aspiration_info.description }}
              </p>
            </div>
            <div class="space-x-2">
              <UiLabel :text="notif.aspiration_info.category" variant="solid" />
              <UiLabel :text="notif.aspiration_info.status" variant="outline" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>