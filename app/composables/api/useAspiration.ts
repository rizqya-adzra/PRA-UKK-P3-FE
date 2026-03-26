import { useAuthStore } from '~/stores/useAuthStore'

export interface AspirationQuery {
  page?: number | string
  search?: string
  status?: string
  category?: string
  start_date?: string
  end_date?: string
  [key: string]: any
}

export interface CategoryDetail {
  id: string
  name: string
  description: string
  color: string
}

export interface LocationDetail {
  id: string
  name: string
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
  student_image: string | undefined
  student_info: StudentInfo
  title: string
  description: string
  location: string
  location_id: string
  location_detail: LocationDetail
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
  current_page?: number  
  total_pages?: number
}

export interface AspirationStats {
  total: number
  selesai: number
  proses: number
  menunggu: number
}

export interface AspirationCategoryStats {
  fasilitas: number
  lingkungan: number
  pendidikan: number
  karakter: number
  ibadah: number
}

export interface UserRanking {
  id: string
  image: string
  name: number
  nis: number
  rombel: number
  aspiration_count: number
}

export interface StatsResponse {
  success: boolean
  status_code: number
  message: string
  count: number
  data: AspirationStats 
}

export interface CategoryStatsResponse {
  success: boolean
  status_code: number
  message: string
  count: number
  data: AspirationCategoryStats 
}

export interface UserRankingResponse {
  success: boolean
  status_code: number
  message: string
  count: number
  data: UserRanking[]
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

  const fetchAspirations = async (queryParams?: any) => {
    return useFetch<AspirationResponse>('/aspiration/list/', {
      key: 'aspirations-list',
      baseURL: config.public.apiBase, 
      headers: getHeaders(),
      query: queryParams,
      transform: (response) => response, 
    })
  }

  const fetchAspirationDetail = async (id: string) => {
    return useFetch<{ success: boolean; data: Aspiration }>(`/aspiration/list/${id}/`, {
      key: `aspiration-detail-${id}`,
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

  const createAspirationProgress = async (formData: FormData | Record<string, any>) => {
    try {
      const response = await $fetch('/aspiration/progress/', {
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

  const fetchAspirationStats = async (queryParams?: any) => {
    return useFetch<StatsResponse>('/aspiration/stats/', {
      key: 'aspiration-stats',
      baseURL: config.public.apiBase,
      headers: getHeaders(),
      query: queryParams,
    })
  }

  const fetchAspirationCategoryStats = async (queryParams?: any) => {
    return useFetch<CategoryStatsResponse>('/aspiration/category-stats/', {
      key: 'aspiration-category-stats',
      baseURL: config.public.apiBase,
      headers: getHeaders(),
      query: queryParams,
    })
  }

  const fetchUserRanking = async (queryParams?: any) => {
    return useFetch<UserRankingResponse>('/user/ranking/', {
      key: 'aspiration-user-ranking',
      baseURL: config.public.apiBase,
      headers: getHeaders(),
      query: queryParams,
    })
  }

  const fetchAspirationHistories = async (queryParams?: any) => {
    return useFetch<AspirationResponse>('/aspiration/history/', {
      key: 'aspiration-histories',
      baseURL: config.public.apiBase, 
      headers: getHeaders(),
      query: queryParams,
      transform: (response) => response, 
    })
  }

  const exportAspirationsExcel = async (queryParams?: any) => {
    try {
      const response = await $fetch<Blob>('/aspiration/list/', {
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Token ${authStore.token}` 
        },
        query: { ...queryParams, export: 'excel' }, 
        responseType: 'blob', 
      })
      return response
    } catch (error) {
      console.error('Gagal mengekspor data:', error)
      throw error
    }
  }

  const exportAspirationHistoriesExcel = async (queryParams?: any) => {
    try {
      const response = await $fetch<Blob>('/aspiration/history/', {
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Token ${authStore.token}` 
        },
        query: { ...queryParams, export: 'excel' }, 
        responseType: 'blob', 
      })
      return response
    } catch (error) {
      console.error('Gagal mengekspor data:', error)
      throw error
    }
  }

  const exportAspirationPDF = async (id: string) => {
    try {
      const response = await $fetch<Blob>(`/aspiration/list/${id}/`, {
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Token ${authStore.token}` 
        },
        query: { export: 'pdf' }, 
        responseType: 'blob', 
      })
      return response
    } catch (error) {
      console.error('Gagal mengekspor PDF:', error)
      throw error
    }
  }

  return {
    fetchAspirations,
    fetchAspirationDetail,
    createAspiration,
    createAspirationProgress,
    fetchAspirationStats,
    fetchAspirationCategoryStats,
    fetchUserRanking,
    fetchAspirationHistories,
    exportAspirationsExcel,
    exportAspirationHistoriesExcel,
    exportAspirationPDF
  }
}