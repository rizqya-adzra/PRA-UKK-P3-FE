<script setup lang="ts">
import { computed } from 'vue'
import defaultImage from '~/assets/images/core_profile.jpg'

export interface Report {
  id: string
  report_id: string
  student: string
  student_image: string | undefined
  student_info: {
    name: string
  }
  title: string
  description: string
  location_id: string
  location_detail: {
    id: string
    name: string
  }
  category_id: string
  category_detail: {
    id: string
    name: string
    color: string
  }
  attachments: any[]
  status: string
  status_display: string
  status_color: string
  created_at: string
}

const props = defineProps<{
  report: Report
}>()

const formattedDate = computed(() => {
  if (!props.report?.created_at) return ''
  const date = new Date(props.report.created_at)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
})
</script>

<template>
  <div class="bg-white rounded-4xl p-5 md:p-7 w-full hover:ring-2 hover:ring-tertiary transition-all duration-400 cursor-pointer">
    
    <div class="flex justify-between items-center mb-3 md:mb-5">
      <UiLabel :text="report.category_detail.name" variant="solid" color="purple" class="text-xs md:text-sm" />
      <UiLabel :text="report.status_display" variant="outline" color="orange" class="text-xs md:text-sm" />
    </div>
    
    <div class="flex flex-col md:flex-row gap-0 md:gap-2 items-start md:items-center justify-between mb-2 md:mb-3">
      <p class="text-tertiary font-semibold text-sm md:mb-0">{{ report?.location_detail?.name || '-' }}</p>
      <p class="text-gray-400 md:text-tertiary text-xs md:text-sm">{{ formattedDate || '-' }}</p>
    </div>
    
    <h3 class="font-bold text-md md:text-2xl text-black leading-snug md:leading-tight mb-2 md:mb-4 line-clamp-2">
      {{ report?.title }}
    </h3>
    
    <p class="text-gray-600 md:text-black text-sm md:text-base leading-relaxed mb-4 md:mb-8 line-clamp-3">
      {{ report?.description || '-' }}
    </p>
    
    <svg class="w-full text-gray-200 md:text-gray-300 mb-4 md:mb-6" height="4" xmlns="http://www.w3.org/2000/svg">
      <line 
        x1="2" 
        y1="2" 
        x2="100%" 
        y2="2" 
        stroke="currentColor" 
        stroke-width="1" 
        stroke-dasharray="10 14" 
        stroke-linecap="round" 
      />
    </svg>

    <div class="flex items-center">
      <img :src="report?.student_image || defaultImage" alt="" class="w-9 h-9 md:w-12 md:h-12 rounded-full bg-[#A3A3A3] shrink-0 mr-3 md:mr-4">
      
      <div class="flex flex-col truncate">
        <span class="font-bold text-black text-xs md:text-sm truncate">{{ report?.student_info?.name || 'No Name' }}</span>
        <span class="text-gray-500 md:text-black text-xs md:text-sm truncate">{{ report?.student || '-' }}</span> 
      </div>

      <UIcon name="i-lucide-chevron-right" class="size-4 md:size-6 ml-auto text-black stroke-3" />
    </div>

  </div>
</template>