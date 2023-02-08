<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Post from '@/components/Post';

const props = defineProps({
  user: {
    type: Object,
    default: {}
  }
});
const store = useStore();
const isUserExist = ref(true);
const userPosts = ref([]);
const isDataReady = ref(false);
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
    <div v-if="user.isBlockedMe" class="pr-4 pl-6 text-xl text-neutral-600 text-start mt-6 border-t pt-6">
      <p class="font-semibold text-2xl">
        You're <span class="text-red-600">BLOCKED</span>
      </p>
      <p>
        You can't see {{ user.username }}'s posts.
      </p>
    </div>
    <div v-else-if="user.isBlockedByMe" class="pr-4 pl-6 text-xl text-neutral-600 text-start mt-6 border-t pt-6">
      <p class="font-semibold text-2xl">
        You <span class="text-red-600">BLOCKED</span> @{{ user.username }}.
      </p>
      <p>
        Seeing {{ user.username }}'s posts will not unblock them, do you want to see {{ user.username }}'s posts?
      </p>
    </div>
    <div v-else class="mt-20">
      <div v-if="isUserExist && isDataReady">
        <div v-if="!userPosts[0]" class="flex justify-center pt-10">
          <div class="text-center">
            <i class="bi bi-inboxes text-6xl text-neutral-500"></i>
            <p class="mt-2 text-neutral-500 font-semibold">There's no post yet</p>
          </div>
        </div>
        <div v-else>
          <Post v-for="post, i in userPosts" :key="i" :post="post" :user="user"/>
        </div>
      </div>
      <div v-if="!isUserExist">
        <div class="flex items-center justify-center text-2xl mt-8 pt-12 border-t">
          <p class="text-neutral-700">
            User with username <span class="text-neutral-500">{{ username }}</span> is not found.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>