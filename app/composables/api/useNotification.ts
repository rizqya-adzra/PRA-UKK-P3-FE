import { useAuthStore } from '~/stores/useAuthStore'

export interface StudentInfo {
  name: string
  nis: number
  rombel: string
  rayon: string
}

export interface AspirationInfo {
  report_id: string
  name: string
  location: string
  description: string
  category: string
  status: string
}

export interface Notification {
  id: string
  message: string
  student: string
  student_image: string
  student_info: StudentInfo
  aspiration_id: string
  aspiration_info: AspirationInfo
  is_read: string
  created_at: string
}

export interface NotificationResponse {
  success: boolean
  status_code: number
  message: string
  count: number
  data: Notification[]
}

export const useNotification = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  const getHeaders = () => {
    return {
      Authorization: `Token ${authStore.token}`,
      Accept: 'application/json',
    }
  }

  const fetchNotification = async () => {
    return useFetch<NotificationResponse>('/aspiration/notifications/', {
      key: 'notifications-list',
      baseURL: config.public.apiBase, 
      headers: getHeaders(),
      transform: (response) => response,
    })
  }

  const markAsRead = async (notificationId: string) => {
    return useFetch(`/aspiration/notifications/${notificationId}/read/`, {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: getHeaders(),
    })
  }

  const markAllAsRead = async () => {
    return useFetch(`/aspiration/notifications/all-read/`, {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: getHeaders(),
    })
  }

  return {
    fetchNotification,
    markAsRead,
    markAllAsRead
  }
}