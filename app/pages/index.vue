<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'guest'
})
</script>

<template>
  <video 
    src="~/assets/videos/landing_page_animation.mp4" 
    autoplay 
    muted 
    loop 
    playsinline
    class="fixed inset-0 w-screen h-screen object-cover -z-10"
  >
    Your browser does not support the video tag.
  </video>
  
  <div class="flex flex-col justify-center items-start gap-16 z-10 pl-24 h-screen">
    <div class="space-y-6">
      <h1 class="font-black text-4xl md:text-7xl xl:text-8xl text-white leading-[0.9em]">
        Aspirasi <br /> untuk semua.
      </h1>
      <p class="text-sm md:text-base max-w-xl tracking-[0.2em] text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...
      </p>
    </div>
    
    <NuxtLink to="/login">
      <button class="bg-white px-12 hover:text-blue-500 py-5 hover:ring-6 hover:ring-white/50 duration-500 font-bold cursor-pointer">BUAT ASPIRASI MU!</button>
    </NuxtLink>
  </div>
</template>