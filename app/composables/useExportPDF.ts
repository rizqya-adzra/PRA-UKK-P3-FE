import { ref } from 'vue'

export function useExportPDF() {
  const isExportModalOpen = ref(false)
  const isExporting = ref(false)

  /** 
  * @param fetchBlobCallback 
  * @param fileName 
  */
 
  const executeExport = async (fetchBlobCallback: () => Promise<Blob>, fileName: string) => {
    isExporting.value = true
    try {
      const blob = await fetchBlobCallback()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      isExportModalOpen.value = false
    } catch (error) {
      console.error("Terjadi kesalahan saat mengunduh dokumen:", error)
    } finally {
      isExporting.value = false
    }
  }

  return {
    isExportModalOpen,
    isExporting,
    executeExport
  }
}