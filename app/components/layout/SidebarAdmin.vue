<template>
  <aside class="w-14.5 m-5 h-[calc(100vh-40px)] m-5 bg-white rounded-3xl flex flex-col items-center py-8">
    
    <img src="~/assets/images/logo.png" alt="Logo" class="w-8 h-8 mb-10 shrink-0" />
    
    <nav class="flex flex-col gap-4 flex-1 w-full px-3">
      <NavIcon icon-name="i-lucide-home" class="w-full" is-active/>
      <NavIcon icon-name="i-lucide-book" class="w-full" />
      <NavIcon icon-name="i-lucide-bell" class="w-full" />
      <NavIcon icon-name="i-lucide-box" class="w-full" />
    </nav>

    <div class="mt-auto shrink-0">
      <NavIcon icon-name="i-lucide-user" />
    </div>
    
  </aside>
</template>