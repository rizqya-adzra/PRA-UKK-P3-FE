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

    <h1 class="text-white text-xs font-mono">✦ Input - auth & searchbar</h1>
    <UiInput label="Email" placeholder="Masukkan email" variant="auth" />
    <UiInput label="Password" placeholder="Masukkan password" variant="auth" type="password" showForgot />
    <UiInput placeholder="Cari aspirasi..." variant="search" icon="i-lucide-search" />

    <h1 class="text-white text-xs mt-4 font-mono">✦ Button - Primary</h1>
    <UiButton label="Sign In" />
    <UiButton label="Sign In" :showIcon="false" />
    <UiButton label="Sign In" color="black" />
    <UiButton label="Sign In" color="black" :showIcon="false" />

    <h1 class="text-white text-xs mt-4 font-mono">✦ Button - Export</h1>
    <UiButton label="Export to Excel" variant="export" color="green" />
    <UiButton label="Export to PDF" variant="export" color="red" />

    <h1 class="text-white text-xs mt-4 font-mono">✦ Button - Gradient</h1>
    <UiButton label="YUK! BUAT ASPIRASI" variant="imperative" color="gradient" />

    <h1 class="text-white text-xs mt-4 font-mono">✦ Dropdown</h1>
    <UiDropdownCategory />
    <UiDropdownStatus />    
    <UiDropdownSelect />    
    <UiDropdownDate />    

    <h1 class="text-white text-xs mt-4 font-mono">✦ Label - Solid</h1>
    <UiLabel text="Fasilitas" variant="solid" color="purple" />
    <UiLabel text="Lingkungan" variant="solid" color="light-green" />
    <UiLabel text="Pendidikan" variant="solid" color="red" />
    <UiLabel text="Karater" variant="solid" color="orange" />
    <UiLabel text="Ibadah" variant="solid" color="pink" />

    <h1 class="text-white text-xs mt-4 font-mono">✦ Label - Outline</h1>
    <UiLabel text="Menunggu" variant="outline" color="orange" />
    <UiLabel text="Diproses" variant="outline" color="blue" />
    <UiLabel text="Selesai" variant="outline" color="dark-green" />
    <UiLabel text="Dibatalkan" variant="outline" color="red" />

  </div>

</template>