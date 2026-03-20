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
  <div class="bg-white rounded-4xl py-5 px-7 w-full hover:ring-2 hover:ring-blue-500 transition-all duration-400 cursor-pointer">
    
    <p class="font-bold text-lg truncate">{{ report.title }}</p>
    
    <div class="flex justify-between items-end">
      <div class="space-x-2 mt-2">
        <UiLabel :text="report.category_detail.name" variant="solid" color="purple" />
        
        <UiLabel :text="report.status_display" variant="outline" color="orange" />
      </div>
      
      <p class="text-xs">{{ formattedDate }}</p>
    </div>
    
    <svg class="w-full text-gray-300 my-3" height="4" xmlns="http://www.w3.org/2000/svg">
      <line 
        x1="2" 
        y1="2" 
        x2="100%" 
        y2="2" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-dasharray="16 20" 
        stroke-linecap="round" 
      />
    </svg>

    <div class="my-6">
      <p class="text-sm uppercase text-gray-400 w-max">{{ report.location }}</p>
      <p class="">{{ report.description }}</p>
    </div>
    
    <div class="flex justify-between items-center text-sm">
      
      <div class="flex items-center gap-1 mt-1 text-gray-400">
        <UIcon name="i-lucide-file" class="size-4" />
        <p>{{ report.attachments ? report.attachments.length : 0 }}</p>
      </div>


      
      <p class="text-gray-400">- {{ report.student_info.name }}</p>
      
    </div>
  </div>
</template>