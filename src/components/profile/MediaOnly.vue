<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Post from '@/components/Post.vue';

const props = defineProps({
  user: {
    type: Object,
    default: {}
  },
  isBlockedMe: {
    type: Boolean,
    default: false
  },
  isBlockedByMe: {
    type: Boolean,
    default: false
  }
});
const store = useStore();
const userPosts = ref([]);
const isDataReady = ref(false);
const mediaOnlyPosts = computed(() => {
  const result = userPosts.value.filter(({ media }) => media[0]);
  return result;
});
const getUserPosts = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/users/${props.user.username}/posts`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
  } catch(e) { 
    return userPosts.data = [];
  }
  const { data } = response.data;
  userPosts.value = data.reverse();
};

onMounted(async () => {
  await getUserPosts();
  isDataReady.value = true;
});
</script>

<template>
  <div>
    <div v-if="isDataReady" class="mt-16">
      <div v-if="mediaOnlyPosts[0]">
        <Post v-for="post, i in mediaOnlyPosts" :key="i" :post="post" />
      </div>
    </div>
  </div>
</template>