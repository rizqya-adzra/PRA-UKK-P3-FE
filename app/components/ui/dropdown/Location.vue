<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocation } from '~/composables/api/useLocation'

const props = defineProps<{
  modelValue?: string | number
}>()

const emit = defineEmits(['update:modelValue'])

const { fetchLocations } = useLocation()
const { data: response, pending } = await fetchLocations()

// 1. Tambahkan state untuk input pencarian
const searchQuery = ref('')

const locations = computed(() => {
  if (response.value?.data) {
    let allLocations = response.value.data
    
    // 2. Filter data berdasarkan searchQuery jika ada
    if (searchQuery.value) {
      const searchLower = searchQuery.value.toLowerCase()
      allLocations = allLocations.filter((loc: any) => 
        loc.name.toLowerCase().includes(searchLower)
      )
    }
    
    // 3. Simpan total data yang sudah difilter
    const totalFiltered = allLocations.length

    // 4. Potong maksimal 5 item
    const sliced = allLocations.map((loc: any) => ({
      id: loc.id,
      label: loc.name,
      disabled: false
    })).slice(0, 5)

    // 5. Tambahkan footer info dinamis jika hasil filter > 5
    if (totalFiltered > 5) {
      sliced.push({
        id: 'info-footer', 
        label: `Menampilkan 5 dari total ${totalFiltered} lokasi`,
        disabled: true
      })
    }
    
    // (Opsional) Tampilkan pesan jika tidak ada lokasi yang ditemukan
    if (totalFiltered === 0 && searchQuery.value) {
       sliced.push({
        id: 'info-footer', 
        label: `Lokasi tidak ditemukan`,
        disabled: true
      })
    }

    return sliced
  }
  return []
})

const selected = ref(locations.value.find(c => c.id === props.modelValue && c.id !== 'info-footer') || undefined)

watch(() => props.modelValue, (newVal) => {
  selected.value = locations.value.find(c => c.id === newVal && c.id !== 'info-footer') || undefined
})

watch(selected, (newValue) => {
  if (newValue && newValue.id !== 'info-footer') {
    emit('update:modelValue', newValue.id)
  } else {
    emit('update:modelValue', '')
  }
})
</script>

<template>
  <div>
    <USelectMenu 
      v-model="selected" 
      :items="locations"
      trailing-icon=""
      variant="none"
      :disabled="pending"
      :ui="{
        content: 'bg-white/80 backdrop-blur-md ring-0 border-none rounded-[16px] md:rounded-2xl p-2 md:p-3 min-w-[100px] md:min-w-[120px] shadow',
        input: 'hidden h-0 w-0 p-0 m-0 border-none', 
        item: 'p-0 cursor-pointer transition-transform duration-200 data-[highlighted]:bg-tertiary/5 px-4 rounded-xl data-[disabled]:cursor-default data-[disabled]:opacity-100'
      }"
    >
      <template #default="{ open }">
        <button 
          type="button"
          :disabled="pending"
          :class="[
            'h-8 md:h-10 w-28 md:w-38 space-x-2 px-4 md:px-6 rounded-full flex items-center justify-between font-bold text-tertiary outline-none transition-all duration-300 border md:border-2',
            pending ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
            selected ? 'border-blue-500' : 'border-transparent',
            open ? 'bg-[#E9ECF6]' : 'bg-white hover:bg-[#E9ECF6] focus:bg-[#E9ECF6]'
          ]"
        >
          <span class="text-sm truncate">
            {{ pending ? 'Memuat...' : (selected?.label || 'Lokasi') }}
          </span>
          
          <UIcon 
            v-if="selected && !pending"
            name="i-lucide-x" 
            class="size-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer z-10" 
            @click.prevent.stop="selected = undefined"
          />
          <UIcon 
            v-if="!selected || pending"
            name="i-lucide-chevron-down" 
            :class="['size-5 text-tertiary transition-transform duration-200', open ? 'rotate-180' : '']" 
          />
        </button>
      </template>

      <template #content-top>
        <div class="mb-3">
          <UiInput 
            v-model="searchQuery"
            placeholder="Cari Lokasi..." 
            variant="search" 
            icon="i-lucide-search" 
            class="w-full bg-white rounded-full"
            @click.stop
          />
        </div>
      </template>

      <template #item="{ item }">
        <div v-if="item.id === 'info-footer'" class="w-full text-center border-t border-gray-200 mt-1 pt-2 pb-1">
          <span class="text-[11px] md:text-xs text-gray-400 italic font-medium w-full">{{ item.label }}</span>
        </div>
        
        <p v-else class="font-semibold text-tertiary hover:text-black duration-300 my-2">{{ item.label }}</p>
      </template>
    </USelectMenu>
  </div>
</template>