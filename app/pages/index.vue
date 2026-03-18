<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'guest'
})
</script>

<template>
  <img src="~/assets/images/landing_bg.jpg" alt="background" class="fixed inset-0 w-full h-full object-cover -z-10" />
  
  <div class="relative min-h-screen flex flex-col overflow-hidden px-4">
    
    <div class="flex-1 flex flex-col justify-center items-center gap-2 z-10 pt-10">
      
      <div class="flex flex-col justify-center items-center gap-3 text-center mb-5">
        <h1 class="font-black text-4xl md:text-5xl">
          Aspirasi <br /> Untuk Semua
        </h1>
        
        <p class="text-sm md:text-base max-w-md mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...
        </p>
      </div>

      <NuxtLink to="/login">
        <UiButton label="YUK! BUAT ASPIRASI"variant="imperative" color="gradient" />
      </NuxtLink>
    </div>

    <div class="w-full flex justify-center mt-14 z-10">
      <img 
        src="~/assets/images/landing_sub.png" 
        alt="Hand holding phone" 
        class="hidden md:block lg:block lg:w-96 object-contain object-bottom" 
      />
    </div>

  </div>
</template>