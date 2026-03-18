import { defineStore } from 'pinia'
import { useApi } from '~/composables/api/useApi' 

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string>
}

interface User {
  email: string
  id?: number
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const tokenCookie = useCookie('token')
    return {
      user: null as User | null,
      token: tokenCookie.value || null,
      loading: false,
      message: null as string | null,
      error: null as string | null,
      validationErrors: {} as Record<string, string>,
    }
  },

  actions: {
   async login(payload: any) { 
      this.loading = true
      this.message = null
      this.error = null
      this.validationErrors = {} 
      const apiFetch = useApi()
      
      try {
        const response = await apiFetch<ApiResponse>('auth/login/', {
          method: 'POST',
          body: payload, 
        })

        if (response.success && response.data) {
            this.token = response.data.token
            this.user = { email: response.data.email } 
            const tokenCookie = useCookie('token')
            tokenCookie.value = response.data.token
            return response 
        }

      } catch (err: any) {
        const apiResponse = err.data as ApiResponse 

        const errorMsg = apiResponse?.message || 'Gagal login ke server'
        this.message = errorMsg
        this.error = errorMsg 

        if (apiResponse?.errors) {
          this.validationErrors = apiResponse.errors
        }

        throw apiResponse 
      } finally {
        this.loading = false
      }
    },

    async register(payload: any) {
      this.loading = true
      this.message = null
      this.error = null
      this.validationErrors = {}
      const apiFetch = useApi()
      
      try {
        const response = await apiFetch<ApiResponse>('auth/register/', {
          method: 'POST',
          body: payload,
        })

        if (response.success && response.data) {
          this.token = response.data.token
          this.user = { email: response.data.email }

          const tokenCookie = useCookie('token')
          tokenCookie.value = response.data.token

          return response
        }

      } catch (err: any) {
        const apiResponse = err.data || {}

        const errorMsg = apiResponse?.message || err.statusMessage || 'Registrasi gagal'

        this.message = errorMsg
        this.error = errorMsg
        
        this.validationErrors = apiResponse?.errors || {}

        const safeErrorPayload = {
            success: false,
            message: errorMsg,
            errors: apiResponse?.errors || {} 
        }

        throw safeErrorPayload

      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      const apiFetch = useApi()

      try {
        await apiFetch('auth/logout/', {
          method: 'POST'
        })

        console.log('Server session terminated')

      } catch (error: any) {
        console.warn('Logout failed on server (token expired?):', error.message)
        
      } finally {
        this.user = null
        this.token = null
        this.validationErrors = {}
        this.error = null

        const tokenCookie = useCookie('token')

        tokenCookie.value = null

        this.loading = false

        return navigateTo('/login')
      }
    }
  }
})