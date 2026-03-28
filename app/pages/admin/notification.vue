<script setup lang="ts">
import { computed } from 'vue'
import { useNotification } from '~/composables/api/useNotification'

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const { fetchNotification, markAsRead, markAllAsRead } = useNotification()
const { data: response, pending } = await fetchNotification()
const notifications = computed(() => response.value?.data || [])

const goToAspirationDetail = async (notif: any) => {
  if (notif.aspiration_id) {
    try {
      await markAsRead(notif.id)
      notif.is_read = true
    } catch (error) {
      console.error('Gagal menandai notifikasi sebagai sudah dibaca:', error)
    }
    navigateTo(`/admin/aspiration/detail/${notif.aspiration_id}`)
  }
}

const handleMarkAll = async () => {
  try {
    await markAllAsRead() 
    if (response.value && response.value.data) {
      response.value.data.forEach((notif: any) => {
        notif.is_read = true
      })
    }
  } catch (error) {
    console.error("Gagal menandai semua notifikasi:", error)
  }
}
</script>

<template>
  <div>
    <div class="flex items-end justify-between mb-5 md:mb-7 px-2 md:px-10 mt-4 md:mt-0">
      <p class="text-2xl md:text-3xl font-bold">Notifikasi</p>
      <p 
        class="text-xs md:text-sm text-electric-blue cursor-pointer hover:underline font-medium" 
        @click="handleMarkAll"
      >
        mark all as read
      </p>
    </div>

    <div v-if="pending" class="flex justify-center items-center py-16 md:py-20">
      <div class="w-8 h-8 md:w-10 md:h-10 border-4 border-tertiary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="notifications.length === 0" class="text-center py-20 text-gray-500">
      <p>Belum ada notifikasi saat ini.</p>
    </div>

    <div v-else class="flex flex-col gap-4">
      <UiNotificationCard 
        v-for="notif in notifications" 
        :key="notif.id"
        :notif="notif"
        @click="goToAspirationDetail"
      />
    </div>
  </div>
</template>