<script setup lang="ts">
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

defineProps<{
  report: Report
}>()
</script>

<template>
  <div class="bg-white rounded-4xl p-7 w-full max-w-sm hover:ring-2 hover:ring-blue-500 transition-all duration-300 cursor-pointer">
    
    <h3 class="font-bold text-lg leading-tight text-black mb-3 line-clamp-1">
      {{ report?.title || '-' }}
    </h3>
    
    <div class="flex items-center gap-2 mb-4">
      <UiLabel :text="report.category_detail.name" variant="solid" color="purple" />
      <UiLabel :text="report.status_display" variant="outline" color="orange" />
    </div>
    
    <svg class="w-full text-gray-300 mb-4" height="4" xmlns="http://www.w3.org/2000/svg">
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

    <p class="text-gray-700 text-sm leading-relaxed line-clamp-1">
      {{ report?.description || '-' }}
    </p>
    
    <p class="text-right text-gray-400 text-sm mt-4">
      - {{ report?.student_info?.name || '-' }}
    </p>

  </div>
</template>