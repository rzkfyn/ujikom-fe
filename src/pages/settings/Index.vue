<script setup>
import TopBar from '@/components/TopBar';
</script>

<template>
  <div>
    <TopBar isDataReady="true"/>
    <div class="flex min-h-screen px-3 mt-8">
      <div class="rounded shadow w-4/12 relative mt-8 border border-neutral-200">
        <div class="p-3">
          <p class="text-neutral-700 font-semibold text-md">Settings</p>
        </div>
        <div class="px-2">
          <div class="border-b pb-2">
            <div class="transition-all px-1 text-neutral-600 font-semibold py-1 flex items-center justify-start rounded-md cursor-pointer hover:bg-stone-100 hover:text-neutral-500 bg-stone-100 border-l-4 border-indigo-200">
              <i class="bi bi-person"></i>
              <p class="ml-2 text-sm">Profile Info</p>
            </div>
            <div class="transition-all px-1 text-neutral-600 font-semibold py-1 flex items-center justify-start rounded-md cursor-pointer hover:bg-stone-100 hover:text-neutral-500">
              <i class="bi bi-gear"></i>
              <p class="ml-2 text-sm">Account Setting</p>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded shadow w-full border border-neutral-200 min-h-screen mt-8 ml-1 px-4 py-4">
        <RouterView />
      </div>
    </div>
  </div>
</template>