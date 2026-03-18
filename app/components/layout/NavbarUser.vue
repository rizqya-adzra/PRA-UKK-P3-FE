<script setup lang="ts">
//
</script>

<template>
  <header class="sticky top-0 z-50 w-full h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 flex items-center justify-between">
    
    <div class="flex items-center gap-8">
      <img src="~/assets/images/logo.png" alt="Logo" class="w-10 h-10 shrink-0" />

      <nav class="flex items-center gap-2">
        <NavButton label="Beranda" is-active />
        <NavButton label="Aspirasi Baru" />
        <NavButton label="Tentang Kami" />
      </nav>
    </div>

    <div class="flex items-center gap-3">
      <NavIcon icon-name="i-lucide-box" />
      <NavIcon icon-name="i-lucide-bell" :badge-count="3" />
      <NavIcon icon-name="i-lucide-user" />
    </div>

  </header>
</template>