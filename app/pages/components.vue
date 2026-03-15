<template>
  <div class="min-h-screen bg-gray-100">

    <LayoutNavbarUser />

    <div class="flex">
      <LayoutSidebarAdmin />
      <main class="flex-1 p-10">
        <h1 class="text-2xl font-bold Montserrat">Konten Utama Nanti Di Sini</h1>
      </main>
    </div>
    
  </div>

  <div class="min-h-screen bg-neutral-900 p-20 flex flex-col items-start gap-6">

    <h1 class="text-white text-xs font-mono">✦ Button - Primary</h1>
    <UiButton label="Sign In" />
    <UiButton label="Sign In" :showIcon="false" />
    <UiButton label="Sign In" color="black" />
    <UiButton label="Sign In" color="black" :showIcon="false" />

    <h1 class="text-white text-xs mt-4 font-mono">✦ Button - Export</h1>
    <UiButton label="Export to Excel" variant="export" color="green" />
    <UiButton label="Export to PDF" variant="export" color="red" />

    <h1 class="text-white text-xs mt-4 font-mono">✦ Button - Gradient</h1>
    <UiButton label="YUK! BUAT ASPIRASI" variant="imperative" color="gradient" />

  </div>

</template>