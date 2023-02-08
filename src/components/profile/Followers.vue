<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import UserCard from '@/components/UserCard';

const store = useStore();
const route = useRoute();
const username = ref('');
const userFollowers = ref([]);
const isDataReady = ref(false);
const getUserFollowers = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/users/${username.value}/followers`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
  } catch(_) { }

  const { data } = response.data;
  userFollowers.value = data.reverse();
};

onMounted(async () => {
  username.value = route.params.username;
  await getUserFollowers();
  isDataReady.value = true;
});
</script>

<template>
  <div>
    <div class="px-3" v-if="isDataReady">
      <div v-if="!userFollowers[0]" class="flex justify-center pt-10">
        <div class="text-center">
          <i class="bi bi-wind text-6xl text-neutral-500"></i>
          <p class="mt-2 text-neutral-500 font-semibold">This user doesn't have a follower yet</p>
        </div>
      </div>
      <div v-else>
        <UserCard v-for="user, i in userFollowers" :key="i" :user="user"/>
      </div>
    </div>
  </div>
</template>