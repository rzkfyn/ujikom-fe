<script setup>
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import Main from '@/components/main/Main';
import TopBar from '@/components/TopBar';
import LeftBar from '@/components/LeftBar';
import RightBar from '@/components/RightBar';
import Notifications from '@/components/main/Notifications';
import SavedPosts from '@/components/main/SavedPosts';

const route = useRoute();
const store = useStore();
const isDataReady = ref(false);

onMounted(async () => {
  try {
    await store.dispatch('getAccessToken');
    await store.dispatch('getCurrentUser');
  } catch(_) { }

  isDataReady.value = true;
});
</script>

<template>
  <div>
    <TopBar :isDataReady="isDataReady" />
    <div class="flex justify-between min-h-screen px-5" v-if="isDataReady">
      <LeftBar />
      <div class="shadow-xl w-7/12 bg-white mt-16 rounded-md min-h-screen" v-if="isDataReady">
        <Main :isDataReady="isDataReady" v-if="route.path.replace(/\//g, '') === ''" />
        <Notifications :isDataReady="isDataReady" v-if="route.path.replace(/\//g, '') === 'notifications'" />
        <SavedPosts :isDataReady="isDataReady" v-if="route.path.replace(/\//g, '') === 'saved'" />
      </div>
      <div>
      </div>
      <RightBar />
    </div>
  </div>
</template>
