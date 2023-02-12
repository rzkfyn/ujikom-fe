<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import UserCard from '@/components/UserCardSm';

const store = useStore();
const connectionRecs = ref([]);
const getConnectionRecommendations = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/users/connects?limit=3`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    })
  } catch(e) {
    return console.log(e);
  }

  const { data } = response.data;
  connectionRecs.value = data;
}

onMounted(async () => {
  try {
    await getConnectionRecommendations();
  } catch(_) {  }
});
</script>

<template>
  <div class="w-4/12 shadow rounded-md border-neutral-100 p-3 border ml-3 bg-white self-start top-16 min-h-[50%] sticky pb-3">
    <div v-if="store.state.login">
      <h3 class=" font-semibold text-lg text-neutral-500">People you may know</h3>
      <div class="mt-3">
        <div v-if="connectionRecs[0]">
          <UserCard :user="user" v-for="user, i in connectionRecs" :key="i" />
        </div>
        <div class="px-3 text-indigo-400 cursor-pointer mt-4 mb-3">
          <p class="text-sm">See More</p>
        </div>
      </div>
    </div>
    <div v-else>
      <div>
        <h3 class="text-xl font-semibold text-neutral-600">See more on AppName</h3>
        <p class="text-neutral-500 text-[.8em] mt-2">Signin to your account or Signup to start connects with other people on this app!</p>
      </div>
      <div class="mt-2 flex flex-col">
        <button class="block w-full bg-neutral-400 rounded-xl shadow py-2 font-semibold text-neutral-100">Sign in</button>
        <p class="w-full text-center my-2">or</p>
        <button class="block w-full bg-indigo-400 rounded-xl shadow py-2 font-semibold text-neutral-100">Sign up</button>
      </div>
    </div>
  </div>
</template>