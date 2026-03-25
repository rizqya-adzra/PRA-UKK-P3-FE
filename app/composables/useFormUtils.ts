import { ref, watch, type Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

export function useFormUtils() {
  const alertModal = ref({
    isOpen: false,
    title: '',
    message: '',
    isSuccess: false
  })

  const showAlert = (title: string, message: string, isSuccess = false) => {
    alertModal.value = { isOpen: true, title, message, isSuccess }
  }

  const selectedFiles = ref<{ file: File; preview: string }[]>([])

  const handleFileAdded = (file: File) => {
    if (selectedFiles.value.length >= 5) {
      showAlert("Batas File", "Maksimal hanya 5 file yang diizinkan!")
      return
    }

    const isImage = file.type.startsWith('image/')
    const preview = isImage ? URL.createObjectURL(file) : ''

    selectedFiles.value.push({ file, preview })
  }

  const removeFile = (index: number) => {
    const fileItem = selectedFiles.value[index]
    if (fileItem?.preview) {
      URL.revokeObjectURL(fileItem.preview)
    }
    selectedFiles.value.splice(index, 1)
  }

  const clearFiles = () => {
    selectedFiles.value.forEach(item => {
      if (item.preview) URL.revokeObjectURL(item.preview)
    })
    selectedFiles.value = []
  }

  const leaveModal = ref(false)
  let leaveNext: Function | null = null

  const setupLeaveGuard = (isFormDirty: Ref<boolean>, isSubmitting: Ref<boolean>) => {
    onBeforeRouteLeave((to, from, next) => {
      if (!isFormDirty.value || isSubmitting.value || alertModal.value.isSuccess) {
        next()
        return
      }
      
      leaveModal.value = true
      leaveNext = next
    })

    watch(leaveModal, (isOpen) => {
      if (!isOpen && leaveNext) {
        leaveNext(false)
        leaveNext = null
      }
    })
  }

  const confirmLeave = () => {
    leaveModal.value = false
    if (leaveNext) leaveNext()
  }

  return {
    alertModal,
    showAlert,

    selectedFiles,
    handleFileAdded,
    removeFile,
    clearFiles,

    leaveModal,
    setupLeaveGuard,
    confirmLeave
  }
}