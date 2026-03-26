import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useFilterPagination() {
  const route = useRoute()
  const router = useRouter()

  const searchParams = ref(route.query.search?.toString() || '')
  const locationParams = ref(route.query.location?.toString() || '')
  const categoryParams = ref(route.query.category?.toString() || '')
  const statusParams = ref(route.query.status?.toString() || '')
  const startDateParams = ref(route.query.start_date?.toString() || '')
  const endDateParams = ref(route.query.end_date?.toString() || '')
  const selectParams = ref(route.query.user?.toString() || '')
  
  const pageParams = ref(Number(route.query.page) || 1)
  const limitParams = ref(Number(route.query.page_size) || 10)

  const applyFilter = (resetPage = false) => {
    if (resetPage) pageParams.value = 1

    const query: Record<string, string | number> = {}
    
    if (searchParams.value) query.search = searchParams.value
    if (locationParams.value) query.location = locationParams.value
    if (categoryParams.value) query.category = categoryParams.value
    if (statusParams.value) query.status = statusParams.value
    if (startDateParams.value) query.start_date = startDateParams.value
    if (endDateParams.value) query.end_date = endDateParams.value
    if (selectParams.value) query.user = selectParams.value
    
    if (pageParams.value > 1) query.page = pageParams.value
    if (limitParams.value !== 10) query.page_size = limitParams.value

    router.push({ query })
  }

  const prevPage = () => {
    if (pageParams.value > 1) pageParams.value--
  }

  const nextPage = (totalPages: number) => {
    if (pageParams.value < totalPages) pageParams.value++
  }

  watch([locationParams, categoryParams, statusParams, startDateParams, endDateParams, selectParams, limitParams], () => {
    applyFilter(true) 
  })

  watch(pageParams, () => {
    applyFilter(false)
  })

  let searchTimeout: ReturnType<typeof setTimeout> | null = null
  watch(searchParams, () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      applyFilter(true)
    }, 500) 
  })

  const apiQuery = computed(() => route.query)

  return {
    searchParams,
    locationParams,
    categoryParams,
    statusParams,
    startDateParams,
    endDateParams,
    pageParams,
    limitParams,
    selectParams, 
    
    apiQuery,
    prevPage,
    nextPage,
  }
}