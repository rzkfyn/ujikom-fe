<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import TopBar from '@/components/Topbar';
import Followers from '@/components/profile/Followers';
import Following from '@/components/profile/Following';

const router = useRouter();
const route = useRoute();
const store = useStore();
const isDataReady = ref(false);
const { username } = route.params;
console.log(username);
const user = ref({});
const getUser = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/users/${username}`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    })
  } catch(e) {
    return console.log(e);
  }

  const { data } = response.data;
  user.value = data;
};

onMounted(async () => {
  await store.dispatch('getAccessToken');
  await store.dispatch('getCurrentUser');
  await getUser();
  isDataReady.value = true;
});
</script>

<template>
  <div>
    <TopBar :isDataReady="isDataReady">
      <template #default>
        <div class="flex items-center">
          <div class="text-neutral-700 text-2xl mr-4 cursor-pointer" @click="router.push(`/${user.username}`)">
            <i class="bi bi-arrow-left"></i>
          </div>
          <div class="text-neutral-800 text-sm">{{ user.name }}'s connection</div>
        </div>
      </template>
    </TopBar>
    <div class="flex px-8">
      <div class="rounded shadow w-6/12 relative min-h-screen mt-12" v-if="isDataReady">
        <div class="px-3 pb-2 border pt-6 rounded">
          <ul class="flex justify-between px-3">
            <li 
              :class="`${route.path.match('/followers') ? 'text-neutral-600 underline decoration-neutral-400' : 'text-neutral-400'} mr-5 font-semibold cursor-pointer hover:text-neutral-500 transition-all duration-300 w-6/12`" @click="router.push(`/${username}/followers`)"
            >Followers</li>
            <li 
              :class="`${route.path.match('/following') ? 'text-neutral-600 underline decoration-neutral-400' : 'text-neutral-400'} mr-5 font-semibold cursor-pointer hover:text-neutral-500 transition-all duration-300`" @click="router.push(`/${username}/following`)"
            >Following</li>
          </ul>
        </div>
        <div>
          <Followers v-if="route.path.endsWith('/followers') || route.path.endsWith('/followers/')"/>
          <Following v-if="route.path.endsWith('/following') || route.path.endsWith('/following/')"/>
        </div>
      </div>
    </div>
  </div>
</template>