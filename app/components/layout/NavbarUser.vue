<script setup lang="ts">
//
</script>

<template>
  <header class="w-full h-[50px] bg-white px-8 flex items-center justify-between">
    
    <div class="flex items-center gap-8">
      <img src="~/assets/images/logo.png" alt="Logo" class="w-8 h-8 shrink-0" />

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