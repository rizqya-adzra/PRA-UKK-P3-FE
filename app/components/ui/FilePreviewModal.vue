<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
const selectedFileUrl = ref('')
const originalFileUrl = ref('') 
const selectedFileType = ref('') 
const isLoadingPdf = ref(false)

const open = async (url: string, type: string) => {
  isOpen.value = true
  originalFileUrl.value = url 
  selectedFileUrl.value = url 
  
  if (type === 'pdf' || url.toLowerCase().endsWith('.pdf')) {
    selectedFileType.value = 'pdf'
    isLoadingPdf.value = true 
    
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Gagal fetch file')
      const blob = await res.blob()
      selectedFileUrl.value = URL.createObjectURL(blob)
    } catch (err) {
      console.error('Gagal memuat PDF sebagai Blob:', err)
    } finally {
      isLoadingPdf.value = false 
    }
  } else {
    selectedFileType.value = 'image'
  }
}

defineExpose({ open })
</script>

<template>
  <UiModalDefault v-model="isOpen" maxWidth="max-w-5xl">
    <div class="flex flex-col items-center justify-center -m-6 rounded-3xl p-4">
      
      <img 
        v-if="selectedFileType === 'image'"
        :src="selectedFileUrl" 
        alt="Full Preview" 
        class="w-full h-full object-contain rounded-xl" 
      />
      
      <div v-else-if="selectedFileType === 'pdf'" class="w-full h-[78vh] flex flex-col relative ">
        <a :href="originalFileUrl" target="_blank" class="hidden"></a>
        
        <div v-if="isLoadingPdf" class="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-b-xl border border-t-0 border-gray-200">
          <UIcon name="i-lucide-loader-2" class="size-10 text-blue-500 animate-spin mb-3" />
          <p class="text-gray-500 font-medium">Sedang memuat dokumen...</p>
        </div>

        <iframe 
          v-else
          :src="selectedFileUrl" 
          class="w-full flex-1 rounded-b-xl border border-t-0 border-gray-200 bg-gray-50"
          frameborder="0"
          title="PDF Preview"
        ></iframe>
      </div>

      <div v-else class="flex flex-col items-center justify-center text-center h-[50vh]">
        <UIcon name="i-lucide-file-warning" class="size-16 text-gray-400 mb-4" />
        <p class="text-lg font-semibold text-gray-700">Format file tidak dapat dipratinjau</p>
        <a :href="originalFileUrl" target="_blank" class="mt-4 text-blue-500 hover:underline">
          Unduh File Secara Langsung
        </a>
      </div>

    </div>
  </UiModalDefault>
</template>