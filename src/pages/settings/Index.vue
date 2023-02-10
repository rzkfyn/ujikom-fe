<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import TopBar from '@/components/TopBar';

const route = useRoute();
const router = useRouter();
const store = useStore();
const isDataReady = ref(false);

onMounted(async () => {
  try {
    await store.dispatch('getAccessToken');
    await store.dispatch('getCurrentUser');
  } catch(_) {
    return router.push({ name: 'Login' });
  }

  isDataReady.value = true;
});
</script>

<template>
  <div>
    <TopBar :isDataReady="isDataReady"/>
    <div class="flex px-3">
      <div class="rounded shadow w-4/12 sticky mt-8 border border-neutral-200 bg-white self-start top-16 pb-24">
        <div class="p-3">
          <p class="text-neutral-700 font-semibold text-md">Settings</p>
        </div>
        <div class="px-2">
          <div class="border-b pb-2">
            <div :class="`transition-all px-1 text-neutral-600 font-semibold py-1 rounded-md cursor-pointer hover:bg-stone-100 hover:text-neutral-500 ${route.path.replace(/\//g, '').endsWith('settings') || route.path.replace(/\//g, '').endsWith('settingsprofile') ? 'bg-stone-100 border-l-4 border-indigo-200' : ''}`">
              <RouterLink to="/settings/profile" class="flex items-center justify-start">
                <i class="bi bi-person"></i>
                <p class="ml-2 text-sm">Profile Info</p>
              </RouterLink>
            </div>
            <div :class="`transition-all px-1 text-neutral-600 font-semibold py-1 rounded-md cursor-pointer hover:bg-stone-100 hover:text-neutral-500 ${route.path.replace(/\//g, '').endsWith('settingsaccount') ? 'bg-stone-100 border-l-4 border-indigo-200' : ''}`">
              <RouterLink to="/settings/account" class="flex items-center justify-start">
                <i class="bi bi-gear"></i>
                <p class="ml-2 text-sm">Account Setting</p>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded shadow w-full border border-neutral-200 ml-1 px-4 py-4 bg-white mt-16">
        <RouterView />
      </div>
    </div>
  </div>
</template>