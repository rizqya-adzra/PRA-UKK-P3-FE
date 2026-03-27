<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'

const props = defineProps<{
  modelValue?: string | number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const authStore = useAuthStore()
const rawUsers = ref<any[]>([]) 
const isLoading = ref(false)
const searchQuery = ref('')

const loadUsers = async () => {
  isLoading.value = true
  try {
    const response = await authStore.fetchAllUsers()
    
    if (response && response.data) {
      rawUsers.value = response.data 
    }
  } catch (error) {
    console.error("Gagal memuat list user:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUsers()
})

const students = computed(() => {
  return rawUsers.value.map(user => {
    return {
      id: user.id,
      email: user.email,
      name: user.profile?.name || 'User Tanpa Nama',
      nis: user.profile?.nis || '-',
      rombel: user.profile?.rombel || '-'
    }
  })
})

const filteredStudents = computed(() => {
  let result = students.value

  if (searchQuery.value) {
    const searchLower = searchQuery.value.toLowerCase()
    result = result.filter(student => {
      return student.name.toLowerCase().includes(searchLower) ||
             student.nis.toString().toLowerCase().includes(searchLower) ||
             student.rombel.toLowerCase().includes(searchLower) 
    })
  }

  return result.slice(0, 5)
})

const selectedStudent = computed({
  get() {
    if (!props.modelValue) return undefined
    return students.value.find(s => s.id?.toString() === props.modelValue?.toString())
  },
  set(newStudent) {
    if (newStudent) {
      emit('update:modelValue', newStudent.id.toString())
    } else {
      emit('update:modelValue', '')
    }
  }
})
</script>

<template>
  <div>
    <USelectMenu 
      v-model="selectedStudent" 
      :items="filteredStudents" 
      trailing-icon=""
      variant="none"
      :ui="{
        content: 'bg-white/80 backdrop-blur-md ring-0 border-none rounded-[16px] md:rounded-2xl p-2 md:p-3 min-w-[100px] md:min-w-[120px]',
        input: 'hidden h-0 w-0 p-0 m-0 border-none', 
        item: 'p-0 cursor-pointer transition-transform duration-200 data-[highlighted]:bg-tertiary/5'
      }"
    >
      <template #default="{ open }">
        <button 
          type="button"
          :class="[
            'h-8 md:h-10 w-28 md:w-38 space-x-2 px-4 md:px-6 rounded-full flex items-center justify-between font-bold text-tertiary outline-none transition-all duration-300 cursor-pointer border md:border-2',
            selectedStudent ? 'border-blue-500' : 'border-transparent',
            open ? 'bg-[#E9ECF6]' : 'bg-white hover:bg-[#E9ECF6] focus:bg-[#E9ECF6]'
          ]"
        >
        <span class="text-sm truncate text-left flex-1 mr-2">
          {{ selectedStudent?.name || 'Siswa' }}
        </span>
          <UIcon 
            v-if="selectedStudent"
            name="i-lucide-x" 
            class="size-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer z-10" 
            @click.prevent.stop="selectedStudent = undefined"
          />
          <UIcon 
            v-else
            name="i-lucide-chevron-down" 
            :class="['size-5 text-tertiary transition-transform duration-200', open ? 'rotate-180' : '']" 
          />
        </button>
      </template>

      <template #content-top>
        <div class="mb-3">
          <UiInput 
            v-model="searchQuery"
            placeholder="Cari Siswa..." 
            variant="search" 
            icon="i-lucide-search" 
            class="w-full bg-white rounded-full shadow-sm"
            @click.stop
          />
        </div>
      </template>

      <template #item="{ item }">
        <div class="w-full my-1 bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm text-left transition-all duration-300 hover:bg-[#E9ECF6] cursor-pointer">
          <div class="size-12 rounded-full bg-gray-200 shrink-0 border border-gray-100"></div>
          <div class="flex flex-col items-start min-w-0">
            <span class="font-bold text-black text-[15px] leading-tight truncate w-full">
              {{ item.name }}
            </span>
            <span class="text-xs text-gray-500 mt-1 font-medium">
              {{ item.nis }} • {{ item.rombel }}
            </span>
          </div>
        </div>
  </template>
    </USelectMenu>
  </div>
</template>