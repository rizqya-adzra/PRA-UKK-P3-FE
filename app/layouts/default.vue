<template>
  <div class="max-w-480 min-h-screen mx-auto flex flex-col justify-start items-center gap-5 bg-[#F6F6F6]">
    <LayoutNavbarUser />
    <div class="px-20 md:px-36 lg:px-80 my-5 w-full">
      <slot />
    </div>
  </div>
</template>