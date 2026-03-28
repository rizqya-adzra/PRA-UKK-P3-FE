<script setup lang="ts">
import { ref, computed } from 'vue'
import defaultProfileImage from '~/assets/images/core_profile.jpg'
import { useFormatter } from '~/composables/useFormatter'

const props = defineProps<{
  aspiration: any
}>()

const emit = defineEmits(['export'])

const { formatDate } = useFormatter()

const statusColors: Record<string, string> = {
  menunggu: 'text-yellow-500',
  proses: 'text-blue-500',
  selesai: 'text-green-500',
  dibatalkan: 'text-red-500'
}

const fileModalRef = ref<any>(null)

const MAX_VISIBLE_ATTACHMENTS = 4
const expandedAttachmentGroups = ref(new Set<string>())

const toggleExpand = (groupId: string) => {
  if (expandedAttachmentGroups.value.has(groupId)) {
    expandedAttachmentGroups.value.delete(groupId)
  } else {
    expandedAttachmentGroups.value.add(groupId)
  }
}

const progressUpdates = computed(() => {
  if (!props.aspiration?.progress_updates) return []
  return [...props.aspiration.progress_updates].reverse()
})

const userAttachments = computed(() => {
  if (!props.aspiration?.attachments) return []
  const adminAttachmentIds = new Set(
    progressUpdates.value.flatMap((update: any) => 
      (update.attachments || []).map((file: any) => file.id)
    )
  )
  return props.aspiration.attachments.filter((file: any) => !adminAttachmentIds.has(file.id))
})
</script>

<template>
  <div class="bg-white rounded-4xl py-8 md:py-10 px-6 md:px-12 mt-4 mb-10 space-y-5 w-full">
    <div class="hidden md:flex flex-col-reverse md:flex-row justify-between items-center w-full mb-10">
      <UiButton label="Export to PDF" variant="export" color="red" @click="emit('export')" />
      <p class="text-sm font-semibold text-tertiary"> 
        No. Aspirasi: <span class="font-semibold text-blue-500">{{ aspiration.report_id }}</span> 
      </p>
    </div>
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="block md:hidden text-end shrink-0 space-y-2">
        <p class="flex justify-between text-sm font-semibold text-tertiary"> 
          No. Aspirasi: <span class="font-semibold text-blue-500">{{ aspiration.report_id }}</span> 
        </p>
        <div class="flex flex-wrap md:justify-end gap-1 md:gap-2 mt-2">
          <UiLabel :text="aspiration.category_detail.name" variant="solid" />
          <UiLabel :text="aspiration.status_display" variant="outline" />
        </div>
        <p class="hidden md:block text-xs md:text-sm text-gray-500">{{ formatDate(aspiration.created_at) }}</p>
      </div>

      <div class="w-full flex items-center gap-3 text-left">
        <img 
          :src="aspiration.student_image || defaultProfileImage" 
          alt="Profile" 
          class="size-12 rounded-full object-cover shrink-0 border border-gray-100"
        />
        <div class="flex flex-col items-start min-w-0">
          <span class="font-bold text-black text-sm md:text-[15px] leading-tight truncate w-full">
            {{ aspiration.student_info?.name || 'Siswa' }}
          </span>
          <span class="text-xs text-gray-500 mt-1 font-medium">
            {{ aspiration.student_info?.nis }} • {{ aspiration.student_info?.rombel }}
          </span>
        </div>
      </div>
      
      <div class="hidden md:block text-left md:text-end shrink-0 pl-14 md:pl-0">
        <p class="text-xs md:text-sm text-gray-500">{{ formatDate(aspiration.created_at) }}</p>
        <div class="flex flex-wrap md:justify-end gap-2 mt-2">
          <UiLabel :text="aspiration.category_detail.name" variant="solid" />
          <UiLabel :text="aspiration.status_display" variant="outline" />
        </div>
      </div>
    </div>

    <div class="text-start space-y-2 md:space-y-4 mt-0 md:mt-10">
      <p class="block md:hidden text-xs text-gray-500">{{ formatDate(aspiration.created_at) }}</p>
      <p class="text-xl md:text-3xl font-bold">{{ aspiration.title }}</p>
      <div>
        <p class="text-sm md:text-base font-semibold text-tertiary">{{ aspiration.location_detail?.name }}</p>
        <p class="text-sm md:text-base">{{ aspiration.description }}</p>
      </div>
      
      <div v-if="userAttachments.length > 0" class="mt-4">
        <div class="flex flex-wrap gap-3 md:gap-4">
          <template v-for="(file, index) in (expandedAttachmentGroups.has('user') ? userAttachments : userAttachments.slice(0, MAX_VISIBLE_ATTACHMENTS))" :key="file.id">
            
            <div class="relative w-27 sm:w-35 md:w-45 h-27 sm:h-35 md:h-45 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 cursor-pointer transition-transform duration-300">
              
              <img 
                v-if="file.file_type === 'image'" 
                :src="file.file" 
                alt="Attachment" 
                @click="fileModalRef?.open(file.file, 'image')"
                class="w-full h-full object-cover" 
              />
              
              <div 
                v-else
                @click="fileModalRef?.open(file.file, file.file_type)"
                class="w-full h-full flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100 p-2 md:p-4 text-center"
              >
                <UIcon name="i-lucide-file-text" class="size-8 md:size-10 text-red-500 mb-2 md:mb-3" />
                <span class="text-xs md:text-sm font-semibold text-gray-700">Lihat PDF</span>
              </div>

              <div 
                v-if="!expandedAttachmentGroups.has('user') && index === MAX_VISIBLE_ATTACHMENTS - 1 && userAttachments.length > MAX_VISIBLE_ATTACHMENTS"
                @click.stop="toggleExpand('user')"
                class="absolute inset-0 bg-black/50 hover:bg-black/60 transition-colors flex flex-col items-center justify-center text-white backdrop-blur-sm z-10"
              >
                <span class="text-2xl md:text-3xl font-bold">+{{ userAttachments.length - MAX_VISIBLE_ATTACHMENTS + 1 }}</span>
                <span class="text-[10px] md:text-xs font-medium mt-1">Lainnya</span>
              </div>
            </div>

          </template>
        </div>
        
        <button 
          v-if="expandedAttachmentGroups.has('user') && userAttachments.length > MAX_VISIBLE_ATTACHMENTS"
          @click="toggleExpand('user')"
          class="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors mt-4 block"
        >
          Tutup sebagian lampiran
        </button>
      </div>
    </div>

    <div 
      v-for="update in progressUpdates" 
      :key="update.id"
      class="bg-gray-100 rounded-3xl md:rounded-4xl py-6 md:py-10 px-5 md:px-10 w-full mt-8"
    >
      <div class="flex flex-col md:flex-row gap-4 md:gap-7">
        <div class="flex-1 w-full">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div class="flex items-center gap-3">
              <div class="size-10 md:size-12 rounded-full flex items-center justify-center shrink-0 border border-blue-200 bg-blue-100 text-blue-600 font-bold">
                A
              </div>
              <div class="flex flex-col items-start min-w-0">
                <span class="font-bold text-black text-[14px] md:text-sm leading-tight truncate w-full">
                  Admin ({{ update.admin_name }})
                </span> 
                <span :class="`text-xs mt-1 font-semibold uppercase ${statusColors[update.status.toLowerCase()] || 'text-gray-500'}`">
                  {{ update.status }}
                </span>
              </div>
            </div>
            <p class="hidden md:block text-sm text-gray-500 pl-14 md:pl-0">{{ formatDate(update.created_at) }}</p>
          </div>
          
          <div class="mt-4 space-y-1">
            <p class="text-start block md:hidden text-xs text-gray-400">{{ formatDate(update.created_at) }}</p>
            <p class="text-start md:mt-4 text-sm md:text-base">
              {{ update.description }}
            </p>
          </div>
          
          <div v-if="update.attachments && update.attachments.length > 0" class="mt-5">
            <div class="flex flex-wrap gap-3 md:gap-4">
              <template v-for="(file, index) in (expandedAttachmentGroups.has(`admin-${update.id}`) ? update.attachments : update.attachments.slice(0, MAX_VISIBLE_ATTACHMENTS))" :key="file.id">
                
                <div class="relative w-25 sm:w-32 md:w-40 h-25 sm:h-32 md:h-40 rounded-2xl md:rounded-3xl overflow-hidden border border-blue-100 cursor-pointer transition-transform duration-300">
                  <img 
                    v-if="file.file_type === 'image'"
                    :src="file.file" 
                    alt="Admin Attachment" 
                    @click="fileModalRef?.open(file.file, 'image')"
                    class="w-full h-full object-cover" 
                  />
                  <div 
                    v-else
                    @click="fileModalRef?.open(file.file, file.file_type)"
                    class="w-full h-full flex flex-col items-center justify-center bg-white group-hover:bg-blue-50 p-2 md:p-4 text-center"
                  >
                    <UIcon name="i-lucide-file-text" class="size-6 md:size-8 text-blue-500 mb-2" />
                    <span class="text-[10px] md:text-xs font-semibold text-gray-700">Lihat Dokumen</span>
                  </div>

                  <div 
                    v-if="!expandedAttachmentGroups.has(`admin-${update.id}`) && index === MAX_VISIBLE_ATTACHMENTS - 1 && update.attachments.length > MAX_VISIBLE_ATTACHMENTS"
                    @click.stop="toggleExpand(`admin-${update.id}`)"
                    class="absolute inset-0 bg-blue-900/50 hover:bg-blue-900/60 transition-colors flex flex-col items-center justify-center text-white backdrop-blur-sm z-10"
                  >
                    <span class="text-xl md:text-2xl font-bold">+{{ update.attachments.length - MAX_VISIBLE_ATTACHMENTS + 1 }}</span>
                    <span class="text-[10px] md:text-xs font-medium mt-1">Lainnya</span>
                  </div>
                </div>

              </template>
            </div>

            <button 
              v-if="expandedAttachmentGroups.has(`admin-${update.id}`) && update.attachments.length > MAX_VISIBLE_ATTACHMENTS"
              @click="toggleExpand(`admin-${update.id}`)"
              class="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors mt-3 block"
            >
              Tutup sebagian dokumen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <UiFilePreviewModal ref="fileModalRef" />
</template>