<script setup lang="ts">
import { computed } from 'vue'
import defaultProfileImage from '~/assets/images/core_profile.jpg'

const props = defineProps<{
  notif: any 
}>()

const emit = defineEmits(['click'])

const timeAgo = computed(() => {
  const dateString = props.notif.created_at
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
})
</script>

<template>
  <div 
    class="bg-white rounded-3xl md:rounded-4xl p-5 md:p-8 focus:ring focus:ring-tertiary hover:ring-2 hover:ring-black duration-400 cursor-pointer transition-all border border-gray-100 md:border-none"
    :class="{ 'opacity-70': notif.is_read, 'ring ring-tertiary': !notif.is_read }"
    @click="emit('click', notif)"
  >
    <div class="flex flex-col-reverse md:flex-row md:items-center justify-between gap-2 md:gap-4">
      <p class="text-base md:text-xl font-bold leading-tight flex-1">
        {{ notif.message }}
      </p>
      <div class="flex items-center gap-2 shrink-0 self-start md:self-auto">
        <p class="text-gray-500 text-xs md:text-sm font-medium">{{ timeAgo }}</p>
        <div v-if="!notif.is_read" class="bg-electric-blue rounded-full w-2 h-2 md:w-3 md:h-3"></div> 
      </div>
    </div>

    <svg class="w-full text-gray-200 my-3 md:my-4" height="4" xmlns="http://www.w3.org/2000/svg">
      <line x1="2" y1="2" x2="100%" y2="2" stroke="currentColor" stroke-width="2" stroke-dasharray="16 20" stroke-linecap="round" />
    </svg>

    <div class="w-full flex items-center gap-2 md:gap-3 text-left mt-3 md:mt-5">
      <img 
        :src="notif.student_image || defaultProfileImage" 
        alt="Profile" 
        class="size-10 md:size-12 rounded-full object-cover shrink-0 border border-gray-100"
      />
      <div class="flex flex-col items-start min-w-0">
        <span class="font-bold text-black text-sm md:text-[15px] leading-tight truncate w-full">
          {{ notif.student_info?.name || '-' }}
        </span>
        <span class="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1 font-medium">
          {{ notif.student_info?.nis || '-' }} • {{ notif.student_info?.rombel || '-' }}
        </span>
      </div>
    </div>

    <div v-if="notif.aspiration_info" class="bg-[#F1F9FF] rounded-xl ml-0 md:ml-14 p-3 md:p-5 text-sm mt-3 md:mt-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-2">
        <div>
          <p class="font-bold text-gray-800 text-xs md:text-sm">
            {{ notif.aspiration_info.name }} 
            <span class="font-normal text-gray-600">- {{ notif.aspiration_info.location }}</span>
          </p>
          <p class="text-gray-600 mt-1 line-clamp-2 text-xs md:text-sm">
            {{ notif.aspiration_info.description }}
          </p>
        </div>
        
        <div class="flex space-x-2 shrink-0">
          <UiLabel :text="notif.aspiration_info.category" variant="solid" />
          <UiLabel :text="notif.aspiration_info.status" variant="outline" />
        </div>
      </div>
    </div>
  </div>
</template>