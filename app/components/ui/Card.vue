<script setup lang="ts">
import { computed } from 'vue'

export interface Report {
  id: string
  report_id: string
  student: string
  student_info: {
    name: string
  }
  title: string
  description: string
  location: string
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
  <div class="bg-white rounded-[36px] p-7 w-full hover:ring-2 hover:ring-tertiary transition-all duration-400 cursor-pointer">
    
    <div class="flex justify-between items-center mb-5">
      <UiLabel :text="report.category_detail.name" variant="solid" color="purple" />
      <UiLabel :text="report.status_display" variant="outline" color="orange" />
    </div>
    
    <p class="text-tertiary text-sm mb-3">{{ formattedDate || '-' }}</p>
    
    <h3 class="font-bold text-2xl text-black leading-tight mb-4 line-clamp-2">
      {{ report?.title }}
    </h3>
    
    <p class="text-black text-base leading-relaxed mb-8 line-clamp-3">
      {{ report?.description || '-' }}
    </p>
    
    <svg class="w-full text-gray-300 mb-6" height="4" xmlns="http://www.w3.org/2000/svg">
      <line 
        x1="2" 
        y1="2" 
        x2="100%" 
        y2="2" 
        stroke="currentColor" 
        stroke-width="1" 
        stroke-dasharray="16 20" 
        stroke-linecap="round" 
      />
    </svg>

    <div class="flex items-center">
      <div class="w-12 h-12 rounded-full bg-[#A3A3A3] shrink-0 mr-4"></div>
      
      <div class="flex flex-col">
        <span class="font-bold text-black text-sm truncate">{{ report?.student_info?.name || 'No Name' }}</span>
        <span class="text-black text-sm truncate">{{ report?.student || '-' }}</span> 
      </div>

      <UIcon name="i-lucide-chevron-right" class="size-6 ml-auto text-black stroke-3" />
    </div>

  </div>
</template>