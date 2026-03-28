import { useAuthStore } from '~/stores/useAuthStore'

export interface CategoryDetail {
  id: string
  name: string
  description: string
  color: string
}

export interface CategoryResponse {
  success: boolean
  status_code: number
  message: string
  count: number
  data: CategoryDetail[]
}

export const useCategory = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const getHeaders = () => {
    return {
      Authorization: `Token ${authStore.token}`,
      Accept: 'application/json',
    }
  }

  const fetchCategories = async () => {
    return useFetch<CategoryResponse>('/aspiration/categories/', {
      key: 'categories-list',
      baseURL: config.public.apiBase,
      headers: getHeaders(),
    })
  }

  return {
    fetchCategories
  }
}