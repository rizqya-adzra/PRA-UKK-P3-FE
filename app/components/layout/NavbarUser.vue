<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNotification } from '~/composables/api/useNotification' 

const { fetchNotification } = useNotification()
const { data: response } = await fetchNotification()

const unreadCount = computed(() => {
  const notifications = response.value?.data || []
  return notifications.filter((notif: any) => !notif.is_read).length
})

const isOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => {
  isOpen.value = false
})
</script>

<template>
    <header class="sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
      <div class="px-6 h-full flex items-center justify-between max-w-7xl mx-auto">
        
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-2">
            <img src="~/assets/images/logo.png" alt="Logo" class="w-10 h-10 shrink-0" />
            <p class="font-bold uppercase">Aspiration</p>
          </div>

          <nav class="hidden lg:flex items-center gap-2">
            <NuxtLink to="/user" #default="{ isActive }">
              <NavButton label="Beranda" :is-active="isActive" />
            </NuxtLink>
            <NuxtLink to="/user/aspiration/list-page" #default="{ isActive }">
              <NavButton label="Aspirasi Kamu" :is-active="isActive" />
            </NuxtLink>
            <NuxtLink to="/user/aspiration/create" #default="{ isActive }">
              <NavButton label="Buat Aspirasi" :is-active="isActive" />
            </NuxtLink>
          </nav>
        </div>

        <div class="hidden lg:flex items-center gap-3">
          <NuxtLink to="/user/aspiration/history" #default="{ isActive }">
            <NavIcon name="i-lucide-archive" :is-active="isActive" />
          </NuxtLink>
          <NuxtLink to="/user/notification" #default="{ isActive }">
            <NavIcon name="i-lucide-bell" :badge-count="unreadCount" :is-active="isActive" />
          </NuxtLink>
          <div class="border border-black/10 h-8"></div>
          <NuxtLink to="/user/profile/" #default="{ isActive }">
            <NavIcon name="i-lucide-user" :is-active="isActive" />
          </NuxtLink>
        </div>

        <div class="lg:hidden flex items-center justify-end w-full">
          <div class="flex items-center gap-5 mr-15 transition-all duration-300" :class="isOpen ? 'opacity-0 translate-x-10' : 'opacity-100'">
            <NuxtLink to="/user/notification">
              <NavIcon name="i-lucide-bell" :badge-count="unreadCount" />
            </NuxtLink>
          </div>
        </div>

      </div>
    </header>

    <div class="fixed top-2 right-6 z-50 lg:hidden">
      <div
        :class="[
          'bg-white backdrop-blur-md hover:bg-gray-100 ',
          'transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)', 
          isOpen
            ? 'rounded-3xl h-105 w-[85vw] bg-opacity-95'
            : 'rounded-xl h-12 w-12 bg-opacity-100'
        ]"
        class="origin-top-right overflow-hidden relative">
        
        <button class="absolute top-0 right-0 w-12 h-12 flex items-center justify-center z-20" @click="isOpen = !isOpen">
          <UIcon 
            :name="isOpen ? 'i-lucide-x' : 'i-lucide-menu'" 
            class="size-6 text-tertiary hover:text-black duration-300" 
            :class="isOpen ? 'rotate-90' : 'rotate-0'"
          />
        </button>

        <div class="px-6 pt-16 flex flex-col gap-4 h-full" :class="isOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'">
          
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Menu</p>
          
          <NuxtLink to="/user" class="text-lg font-bold text-black hover:text-tertiary">
            Beranda
          </NuxtLink>
          
          <NuxtLink to="/user/aspiration/list-page" class="text-lg font-bold text-black hover:text-tertiary">
            Aspirasi Kamu
          </NuxtLink>
          
          <NuxtLink to="/user/aspiration/create" class="text-lg font-bold text-black hover:text-tertiary">
            Buat Aspirasi
          </NuxtLink>

          <div class="h-px w-full bg-gray-200 my-2"></div>

          <NuxtLink to="/user/aspiration/history" class="text-lg font-bold text-black hover:text-tertiary">
            Riwayat
          </NuxtLink>
          
          <NuxtLink to="/user/profile/" class="text-lg font-bold text-black hover:text-tertiary">
            Profil Akun
          </NuxtLink>

        </div>
      </div>
    </div>
    <div v-if="isOpen" class="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm transition-opacity" @click="isOpen = false"></div>
</template>