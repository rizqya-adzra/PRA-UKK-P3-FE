import { useAuthStore } from '~/stores/useAuthStore'

export interface LocationDetail {
  id: string
  name: string
}

export interface LocationResponse {
  success: boolean
  status_code: number
  message: string
  count: number
  data: LocationDetail[]
}

export const useLocation = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const getHeaders = () => {
    return {
      Authorization: `Token ${authStore.token}`,
      Accept: 'application/json',
    }
  }

  const fetchLocations = async () => {
    return useFetch<LocationResponse>('/aspiration/locations/', {
      key: 'locations-list',
      baseURL: config.public.apiBase,
      headers: getHeaders(),
    })
  }

  return {
    fetchLocations
  }
}