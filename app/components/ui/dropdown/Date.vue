<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  startDate?: string | null
  endDate?: string | null
}>()

const emit = defineEmits(['update:startDate', 'update:endDate'])

const isPopoverOpen = ref(false)

const parseDate = (dateStr?: string | null): Date | null => {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d) 
}

const formatDate = (date: Date | null): string => {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const internalStart = computed({
  get: () => parseDate(props.startDate),
  set: (val) => emit('update:startDate', formatDate(val))
})

const internalEnd = computed({
  get: () => parseDate(props.endDate),
  set: (val) => emit('update:endDate', formatDate(val))
})

const currentDate = ref(internalStart.value || new Date())
const days = ['M', 'S', 'S', 'R', 'K', 'J', 'S']
const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]

const currentMonthYear = computed(() => {
  return `${monthNames[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

const selectedDateText = computed(() => {
  if (!internalStart.value) return null
  
  const startStr = `${internalStart.value.getDate()} ${monthNames[internalStart.value.getMonth()]}`
  
  if (!internalEnd.value) return startStr 
  
  const endStr = `${internalEnd.value.getDate()} ${monthNames[internalEnd.value.getMonth()]}`
  
  if (internalStart.value.getTime() === internalEnd.value.getTime()) return startStr
  
  return `${startStr} - ${endStr}`
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const dates = []

  for (let i = 0; i < firstDayOfMonth; i++) {
    dates.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i)
  }

  return dates
})

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const getDateFromDay = (day: number) => {
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day, 0, 0, 0, 0)
}

const selectDate = (day: number | null) => {
  if (!day) return 

  const clickedDate = getDateFromDay(day)

  if (!internalStart.value || (internalStart.value && internalEnd.value)) {
    internalStart.value = clickedDate
    internalEnd.value = null
  } else if (internalStart.value && !internalEnd.value) {
    if (clickedDate < internalStart.value) {
      internalStart.value = clickedDate
    } else {
      internalEnd.value = clickedDate
      isPopoverOpen.value = false
    }
  }
}

const isStart = (day: number | null) => {
  if (!day || !internalStart.value) return false
  return getDateFromDay(day).getTime() === internalStart.value.getTime()
}

const isEnd = (day: number | null) => {
  if (!day || !internalEnd.value) return false
  return getDateFromDay(day).getTime() === internalEnd.value.getTime()
}

const inRange = (day: number | null) => {
  if (!day || !internalStart.value || !internalEnd.value) return false
  const current = getDateFromDay(day).getTime()
  return current > internalStart.value.getTime() && current < internalEnd.value.getTime()
}

const isToday = (day: number | null) => {
  if (!day) return false
  const today = new Date()
  return getDateFromDay(day).getTime() === new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
}
</script>

<template>
  <div>
    <UPopover 
      v-model:open="isPopoverOpen"
      :ui="{
        content: 'flex flex-col bg-[#E9ECF6]/80 backdrop-blur-md ring-0 border-none text-black font-medium p-5 rounded-[32px] w-[280px] outline-none'
      }"
    >
      <button 
        type="button"
        :class="[
          'w-36 space-x-2 h-13 px-6 rounded-full flex items-center justify-between font-medium text-black outline-none transition-all duration-300 border-2 cursor-pointer',
          internalStart ? 'border-blue-500' : 'border-transparent',
          isPopoverOpen ? 'bg-[#E9ECF6]' : 'bg-white hover:bg-[#E9ECF6] focus:bg-[#E9ECF6]'
        ]"
      >
        <span class="text-sm truncate text-left flex-1 mr-2">
          {{ selectedDateText || 'Tanggal' }}
        </span>
        
        <div class="flex items-center gap-2 shrink-0">
          <UIcon 
            v-if="internalStart"
            name="i-lucide-x" 
            class="size-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" 
            @click.prevent.stop="internalStart = null; internalEnd = null"
          />
          <UIcon 
            v-if="!internalStart"
            name="i-lucide-calendar" 
            class="size-5 text-black"
          />
        </div>
      </button>

      <template #content>
        <div class="w-full">
          <p class="text-xs text-center mb-3 text-gray-400">pilih tanggal awal & akhir</p>
          <div class="flex items-center justify-between mb-4 px-2">
            <UIcon 
              name="i-lucide-chevron-left" 
              class="size-5 cursor-pointer hover:text-white transition-colors" 
              @click="prevMonth"
            />
            <span class="font-bold text-lg select-none">{{ currentMonthYear }}</span>
            <UIcon 
              name="i-lucide-chevron-right" 
              class="size-5 cursor-pointer hover:text-white transition-colors" 
              @click="nextMonth"
            />
          </div>

          <div class="grid grid-cols-7 gap-y-4 gap-x-1 text-center mb-2 border-b border-gray-400/30 pb-2">
            <div v-for="day in days" :key="day" class="text-sm font-normal text-gray-800">{{ day }}</div>
          </div>

          <div class="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-sm items-center justify-items-center">
            <div 
              v-for="(day, index) in calendarDays" 
              :key="index"
              @click="selectDate(day)"
              :class="[
                'w-8 h-8 flex items-center justify-center transition-all duration-200 select-none relative',
                !day ? 'invisible' : 'cursor-pointer', 
                
                isStart(day) && !isEnd(day) ? 'bg-[#1D7AFA] text-white font-bold rounded-l-xl rounded-r-md scale-105' : '',
                isEnd(day) && !isStart(day) ? 'bg-[#1D7AFA] text-white font-bold rounded-r-xl rounded-l-md scale-105' : '',
                isStart(day) && isEnd(day) ? 'bg-[#1D7AFA] text-white font-bold rounded-xl scale-105' : '',
                
                inRange(day) ? 'bg-[#FFFFFF] text-black font-medium rounded-md' : '',
                
                !isStart(day) && !isEnd(day) && !inRange(day) && day ? 'hover:bg-white/40 text-gray-900 rounded-lg' : '',
                isToday(day) && !isStart(day) && !isEnd(day) && !inRange(day) ? 'bg-white/50 ring-1 ring-white font-bold' : ''
              ]"
            >
              {{ day }}
            </div>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>