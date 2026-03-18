export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  const token = authStore.token
  const isStaff = String(authStore.isStaff) === 'true'

  if (!token) {
    const publicPages = ['/login', '/register', '/']
    if (!publicPages.includes(to.path)) {
      return navigateTo('/login')
    }
    return
  }

  if (token) {
    if (['/login', '/register', '/'].includes(to.path)) {
      return isStaff ? navigateTo('/admin/dashboard') : navigateTo('/user')
    }

    if (to.path.startsWith('/admin') && !isStaff) {
      return navigateTo('/user') 
    }

    if (to.path.startsWith('/user') && isStaff) {
      return navigateTo('/admin/dashboard')
    }
  }
})