<template>
  <div class="max-w-480 mx-auto min-h-screen flex bg-[#F6F6F6]">
    
    <aside class="sticky top-0 h-screen shrink-0 overflow-y-auto">
      <LayoutSidebarAdmin />
    </aside>

    <main class="flex-1 py-14 px-8 min-w-0">
      <slot />
    </main>

  </div>
</template>