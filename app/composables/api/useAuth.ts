import { useAuthStore } from '~/stores/useAuthStore'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  
  const showTosModal = ref(false)
  const showPrivacyPolicyModal = ref(false)

  return {
    authStore,
    router,
    showTosModal,
    showPrivacyPolicyModal
  }
}