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
  id?: number | string
  name?: string
  nis?: number | string
  rombel?: string
  rayon?: string 
  image?: string | null
  [key: string]: any 
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const tokenCookie = useCookie('token')
    return {
      user: null as User | null,
      token: tokenCookie.value || null,
      isStaff: useCookie('is_staff').value || false,
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
            this.isStaff = response.data.is_staff
            this.user = { email: response.data.email } 
            const tokenCookie = useCookie('token')
            tokenCookie.value = response.data.token
            const isStaffCookie = useCookie('is_staff')
            isStaffCookie.value = response.data.is_staff.toString()

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

    async fetchProfile() {
      if (!this.token) return null

      this.loading = true
      this.error = null
      const apiFetch = useApi()

      try {
        const response = await apiFetch<ApiResponse>('profile/', {
          method: 'GET',
          headers: {
            Authorization: `Token ${this.token}`, 
            Accept: 'application/json',
          } 
        })

        if (response.success && response.data) {
          const userData = { ...response.data }
          if (userData.profile) {
             Object.assign(userData, userData.profile)
             delete userData.profile
          }

          this.user = {
            ...this.user,
            ...userData
          }
          return response
        }
        
      } catch (err: any) {
        console.error('Failed to fetch profile:', err)
        const apiResponse = err.data || {}
        this.error = apiResponse?.message || 'Gagal mengambil data profil'
        
        throw apiResponse
      } finally {
        this.loading = false
      }
    },

    async updateProfile(formData: FormData | Record<string, any>) {
      if (!this.token) return null

      this.loading = true
      this.error = null
      this.message = null
      this.validationErrors = {}
      const apiFetch = useApi()

      const headers: Record<string, string> = {
        Authorization: `Token ${this.token}`,
        Accept: 'application/json',
      }

      if (!(formData instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }

      try {
        const response = await apiFetch<ApiResponse>('profile/', {
          method: 'PUT',
          headers,
          body: formData
        })

        if (response.success && response.data) {
           this.message = response.message || 'Profil berhasil diperbarui'
           
           const userData = { ...response.data }
           if (userData.profile) {
              Object.assign(userData, userData.profile)
              delete userData.profile
           }

           this.user = {
             ...this.user,
             ...userData
           }

           return response
        }
      } catch (err: any) {
        console.error('Failed to update profile:', err)
        const apiResponse = err.data || {}
        const errorMsg = apiResponse?.message || 'Gagal memperbarui profil'
        
        this.error = errorMsg
        if (apiResponse?.errors) {
            this.validationErrors = apiResponse.errors
        }
        
        throw apiResponse
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
        const isStaffCookie = useCookie('is_staff')
        
        tokenCookie.value = null
        isStaffCookie.value = null

        this.loading = false

        return navigateTo('/login')
      }
    },

    async fetchAllUsers(query: string = '') {
      if (!this.token) {
        throw new Error('Tidak ada akses (Token hilang).')
      }
      
      this.loading = true
      this.error = null
      const apiFetch = useApi()

      try {
        const endpoint = query ? `user/list/?${query}` : 'user/list/'
        
        const response = await apiFetch<ApiResponse<User[]>>(endpoint, {
          method: 'GET',
          headers: {
            Authorization: `Token ${this.token}`, 
            Accept: 'application/json',
          }
        })

        if (response.success && response.data) {
          return response
        }

      } catch (err: any) {
        console.error('Failed to fetch all users:', err)
        const apiResponse = err.data || {}
        this.error = apiResponse?.message || 'Gagal mengambil daftar pengguna'
        
        throw apiResponse
      } finally {
        this.loading = false
      }
    },
  }
})