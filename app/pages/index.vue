<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'guest'
})
</script>

<template>
  <div class="mb-16">
    
    <div class="max-w-full mx-auto">
      <div class="relative w-full min-h-screen overflow-hidden flex flex-col justify-center items-center text-center md:p-12">
        
        <img 
          src="~/assets/images/auth_bg.jpg" 
          alt="Hero Background" 
          class="absolute inset-0 w-full h-full object-cover -z-1"
        />

        <div class="absolute top-20 left-32 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-sm hidden md:block"></div>
        <div class="absolute top-20 right-32 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-sm hidden md:block"></div>
        <div class="absolute bottom-20 left-32 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-sm hidden md:block"></div>
        <div class="absolute bottom-20 right-32 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-sm hidden md:block"></div>

        <h1 class="hidden md:block text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-4 leading-tight">
          Speak Up <br /> Pakai Aspirasi!
        </h1>
        <img src="~/assets/images/logo.png" alt="Logo" class="md:hidden w-24 h-24 shrink-0 mb-6" />
        <h1 class="block md:hidden text-4xl font-bold text-white mb-4 leading-tight">
          Speak Up Pakai Aspirasi!
        </h1>
        <p class="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-8 font-medium">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...
        </p>
        
        <NuxtLink to="/login">
          <button class="md:mt-5 bg-white text-black text-xs md:text-sm font-bold py-3 md:py-4 px-6 md:px-8 hover:ring-6 hover:ring-white/50 transition-all duration-400 flex items-center gap-2 cursor-pointer">
            YUK! BUAT ASPIRASI 
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
          </button>
        </NuxtLink>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24">
      <div class="mb-10 text-center md:text-left">
        <h2 class="text-3xl md:text-4xl font-bold text-black mb-3">
          Gimana <span class="text-electric-blue">Caranya?</span>
        </h2>
        <p class="text-gray-500 text-sm md:text-base max-w-lg mx-auto md:mx-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        <div class="bg-[#F1F3F5] rounded-3xl py-12 px-6 md:py-16 md:px-8 flex flex-col items-center md:items-start transition-all hover:ring-2 hover:ring-electric-blue duration-400">
          <UIcon name="i-lucide-edit-3" class="w-8 h-8 text-blue-600 mb-5 md:mb-8" />
          <h3 class="text-lg md:text-xl font-bold text-black mb-2">Buat Aspirasi Mu</h3>
          <p class="text-xs md:text-sm text-gray-500 leading-relaxed">Lorem ipsum dolor sit amet</p>
        </div>

        <div class="bg-[#F1F3F5] rounded-3xl py-12 px-6 md:py-16 md:px-8 flex flex-col items-center md:items-start transition-all hover:ring-2 hover:ring-electric-blue duration-400">
          <UIcon name="i-lucide-message-circle" class="w-8 h-8 text-blue-600 mb-5 md:mb-8" />
          <h3 class="text-lg md:text-xl font-bold text-black mb-2">Direspon Admin</h3>
          <p class="text-xs md:text-sm text-gray-500 leading-relaxed">Lorem ipsum dolor sit amet</p>
        </div>

        <div class="bg-[#F1F3F5] rounded-3xl py-12 px-6 md:py-16 md:px-8 flex flex-col items-center md:items-start transition-all hover:ring-2 hover:ring-electric-blue duration-400">
          <UIcon name="i-lucide-check-circle-2" class="w-8 h-8 text-blue-600 mb-5 md:mb-8" />
          <h3 class="text-lg md:text-xl font-bold text-black mb-2">Selesai!</h3>
          <p class="text-xs md:text-sm text-gray-500 leading-relaxed">Lorem ipsum dolor sit amet</p>
        </div>

      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
      <div class="border-2 border-electric-blue rounded-4xl p-8 md:px-16 md:py-12 flex flex-col md:flex-row items-center justify-between gap-10">
        
        <div class="max-w-xl text-center md:text-left">
          <h2 class="text-3xl md:text-5xl font-bold text-black mb-4 leading-tight">
            Buat Aspirasi Mu <br class="hidden md:block" /> Sekarang Juga!
          </h2>
          <p class="text-gray-500 text-sm md:text-base mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...
          </p>
          <NuxtLink to="/login" class="flex flex-col ">
            <UiButton label="YUK! BUAT ASPIRASI" color="gradient" variant="imperative" />
          </NuxtLink>
        </div>

        <div class="relative w-32 h-32 md:w-48 md:h-48 shrink-0 mb-4 md:mb-0">
          <UIcon name="i-lucide-megaphone" class="w-32 h-32 md:w-48 md:h-48 text-electric-blue shrink-0 mb-4 md:mb-0" />
        </div>

      </div>
    </div>

  </div>
</template>