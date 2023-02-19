<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Post from '@/components/Post';

const store = useStore();
const savedPosts = ref([]);
const isDataReady = ref(false);
const getSavedPosts = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/posts/saved`);
  } catch(e) {
    return console.log(e);
  }

  if (response.status === 200) {
    const { data } = response.data;
    savedPosts.value = data;
  }
};

onMounted(async () => {
  try {
    await getSavedPosts();
  } catch(e) {
    console.log(e);
  }

  isDataReady.value = true;
});
</script>

<template>
  <div>
    <div v-if="isDataReady">
      <div class="text-neutral-600 font-semibold px-6 py-3 border-b sticky top-14 bg-white z-20 shadow">
        <h2 class="text-xl">Saved Posts</h2>
      </div>
      <div v-if="savedPosts[0]" class="mt-4">
        <Post v-for="post, i in savedPosts" :key="i" :post="post" @post:unsave="getSavedPosts"/>
      </div>
    </div>
  </div>
</template>