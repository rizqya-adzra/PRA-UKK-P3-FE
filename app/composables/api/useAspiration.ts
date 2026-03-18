import { useAuthStore } from '~/stores/auth'

export interface CategoryDetail {
  id: string
  name: string
  description: string
  color: string
}

export interface StudentInfo {
  name: string
  nis: number
  rombel: string
  rayon: string
}

export interface Attachment {
  id: string
  file: string
  file_type: string
}

export interface ProgressUpdate {
  id: string
  aspiration: string
  admin_name: string
  status: string
  description: string
  attachments: Attachment[]
  created_at: string
}

export interface Aspiration {
  id: string
  report_id: string
  student: string
  student_image: string | null
  student_info: StudentInfo
  title: string
  description: string
  location: string
  category_id: string
  category_detail: CategoryDetail
  attachments: Attachment[]
  status: string
  status_display: string
  status_color: string
  progress_updates: ProgressUpdate[]
  created_at: string
}

export interface AspirationResponse {
  success: boolean
  status_code: number
  message: string
  count: number
  data: Aspiration[]
}

export interface AspirationStats {
  total: number
  selesai: number
  proses: number
}

export interface StatsResponse {
  success: boolean
  status_code: number
  message: string
  count: number
  data: AspirationStats 
}

export const useAspiration = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const getHeaders = () => {
    return {
      Authorization: `Token ${authStore.token}`,
      Accept: 'application/json',
    }
  }

  const fetchAspirations = async () => {
    return useFetch<AspirationResponse>('/aspiration/list/', {
      baseURL: config.public.apiBase, 
      headers: getHeaders(),
      transform: (response) => response, 
    })
  }

  const fetchAspirationDetail = async (id: string) => {
    return useFetch<{ success: boolean; data: Aspiration }>(`/aspiration/list/${id}/`, {
      baseURL: config.public.apiBase,
      headers: getHeaders(),
    })
  }

  const createAspiration = async (formData: FormData | Record<string, any>) => {
    try {
      const response = await $fetch('/aspiration/list/', {
        baseURL: config.public.apiBase,
        method: 'POST',
        headers: getHeaders(),
        body: formData,
      })
      return response
    } catch (error) {
      console.error('Failed to create aspiration:', error)
      throw error
    }
  }

  const fetchAspirationStats = async () => {
    return useFetch<StatsResponse>('/aspiration/stats/', {
      baseURL: config.public.apiBase,
      headers: getHeaders(),
    })
  }

  return {
    fetchAspirations,
    fetchAspirationDetail,
    createAspiration,
    fetchAspirationStats,
  }
}