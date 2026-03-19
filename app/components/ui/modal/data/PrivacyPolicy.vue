<template>
  <div class="space-y-5">
    <div v-for="section in PRIVACY_POLICY.sections" :key="section.id" class="group">
      <div class="flex items-center gap-3">
        <span class="flex-none size-7 bg-black text-white text-sm font-bold rounded-full flex items-center justify-center">
          {{ section.id }}
        </span>
        <h4 class="font-bold uppercase tracking-wide">
          {{ section.heading }}
        </h4>
      </div>
      <div class="pl-10">
        <p class="text-sm text-justify leading-relaxed text-gray-600">
          {{ section.content }}
        </p>
      </div>
    </div>
  </div>
</template>