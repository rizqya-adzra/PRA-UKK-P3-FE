<script setup lang="ts">
import { ref, computed } from 'vue'

const isPopoverOpen = ref(false)

const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)

const currentDate = ref(new Date())
const days = ['M', 'S', 'S', 'R', 'K', 'J', 'S']
const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]

const currentMonthYear = computed(() => {
  return `${monthNames[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

const selectedDateText = computed(() => {
  if (!startDate.value) return null
  
  const startStr = `${startDate.value.getDate()} ${monthNames[startDate.value.getMonth()]}`
  
  if (!endDate.value) return startStr 
  
  const endStr = `${endDate.value.getDate()} ${monthNames[endDate.value.getMonth()]}`
  
  if (startDate.value.getTime() === endDate.value.getTime()) return startStr
  
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

  if (!startDate.value || (startDate.value && endDate.value)) {
    startDate.value = clickedDate
    endDate.value = null
  } else if (startDate.value && !endDate.value) {
    if (clickedDate < startDate.value) {
      startDate.value = clickedDate
    } else {
      endDate.value = clickedDate
      isPopoverOpen.value = false
    }
  }
}

const isStart = (day: number | null) => {
  if (!day || !startDate.value) return false
  return getDateFromDay(day).getTime() === startDate.value.getTime()
}

const isEnd = (day: number | null) => {
  if (!day || !endDate.value) return false
  return getDateFromDay(day).getTime() === endDate.value.getTime()
}

const inRange = (day: number | null) => {
  if (!day || !startDate.value || !endDate.value) return false
  const current = getDateFromDay(day).getTime()
  return current > startDate.value.getTime() && current < endDate.value.getTime()
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
          startDate ? 'border-blue-500' : 'border-transparent',
          isPopoverOpen ? 'bg-[#E9ECF6]' : 'bg-white hover:bg-[#E9ECF6] focus:bg-[#E9ECF6]'
        ]"
      >
        <span class="text-sm truncate text-left flex-1 mr-2">
          {{ selectedDateText || 'Tanggal' }}
        </span>
        
        <div class="flex items-center gap-2 shrink-0">
          <UIcon 
            v-if="startDate"
            name="i-lucide-x" 
            class="size-5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" 
            @click.prevent.stop="startDate = null; endDate = null"
          />
          <UIcon 
            v-if="!startDate"
            name="i-lucide-calendar" 
            class="size-5 text-black"
          />
        </div>
      </button>

      <template #content>
        <div class="w-full">
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