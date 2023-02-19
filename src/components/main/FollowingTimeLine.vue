<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Post from '@/components/Post.vue';

const store = useStore();
const isDataReady = ref(false);
const posts = ref([]);
const getPosts = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/posts?following=true`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    return console.log(e);
  }

  const { data } = response.data;
  posts.value = data;
};

onMounted(async () => {
  await getPosts();
  isDataReady.value = true;
});
</script>

<template>
  <div>
    <div v-if="isDataReady">
      <Post v-for="post, i in posts" :key="i" :post="post" />
    </div>
    <div v-else>

    </div>
  </div>
</template>