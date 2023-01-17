<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const userNotifications = ref([]);
const store = useStore();
const route = useRoute();
const router = useRouter();
const unReadNotifications = ref(0);
const b = computed(() => route.path);
const getUnReadNotifications = (notifications) => {
  let result = 0;
  for (const notification of notifications) {
    if (!notification.seen_at) result += 1;
  }

  return result;
}
const getUserNotifications = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/notifications`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    })
  } catch(e) {
    return console.log(e);
  }

  const { data } = response.data;
  userNotifications.value = data;
};

onMounted(async () => {
  if (store.state.login) {
    await getUserNotifications();
    unReadNotifications.value = getUnReadNotifications(userNotifications.value);

    setInterval(async () => {
      try {
        await getUserNotifications();
        unReadNotifications.value = getUnReadNotifications(userNotifications.value);
      } catch(e) {
        return console.log(e);
      }
    }, 3000);
  };
});
</script>

<template>
  <div class="w-3/12 rounded mr-2 mt-16 sticky top-16 self-start h-[80%] flex flex-col justify-start">
    <div v-if="store.state.login">
      <div class="rounded-md shadow py-2 px-3 flex bg-white">
        <div @click="router.push({ name: 'Profile', params: { username: store.state.currentUser.username }})"
          class="w-12 h-12 overflow-hidden rounded-full cursor-pointer"
        >
          <img :src="`${store.state.apiBaseURL}/media/images/profile_images/${store.state.currentUser.profile.profile_media.find(({ context }) => context === 'PROFILE_IMAGE').file_name ?? 'default.png'}`" alt="profile"
            class="w-full h-full object-cover object-center"
          >
        </div>
        <div class="flex flex-col justify-center ml-3">
          <p @click="router.push({ name: 'Profile', params: { username: store.state.currentUser.username }})"
            class="text-neutral-600 font-semibold text-sm cursor-pointer hover:underline transition-all hover:text-neutral-500 decoration-neutral-200"
          >{{ store.state.currentUser.name }}</p>
          <p @click="router.push({ name: 'Profile', params: { username: store.state.currentUser.username }})"
            class="text-neutral-500 font-semibold text-[.8em] cursor-pointer hover:underline transition-all hover:text-neutral-400 decoration-neutral-200"
          >@{{ store.state.currentUser.username }}</p>
        </div>
      </div>
      <div class="pb-36 rounded-md shadow-neutral-300 mt-3 bg-white justify-self-end">
        <ul>
          <li :class="`transition-all px-3 py-2 cursor-pointer ${route.path.replace(/\//g, '') === '' ? 'bg-indigo-200/30 rounded border-l-4 border-indigo-300 text-neutral-500' : ''} text-neutral-600 hover:bg-indigo-200/30 hover:text-neutral-400 relative`">
            <RouterLink :to="{ name: 'Home' }" class="flex items-center">
              <i class="bi bi-house-door text-xl"></i>
              <p class="ml-3 font-semibold">Home</p>
            </RouterLink>
          </li>
          <li :class="`transition-all px-3 py-2 cursor-pointer ${route.path.replace(/\//g, '') === 'notifications' ? 'bg-indigo-200/30 rounded border-l-4 border-indigo-300 text-neutral-500' : ''} text-neutral-600 hover:bg-indigo-200/30 hover:text-neutral-400 relative`">
            <RouterLink :to="{ name: 'Notification' }" class="flex items-center">
              <i class="bi bi-bell text-xl"></i>
              <p class="ml-3 font-semibold">Notifications</p>
              <div v-if="unReadNotifications > 0" class="h-4 w-4 bg-red-500 rounded-full text-neutral-100 flex items-center justify-center text-[.6em] absolute left-2 top-2">
                <span>{{ unReadNotifications }}</span>
              </div>
            </RouterLink>
          </li>
          <li :class="`transition-all px-3 py-2 cursor-pointer ${route.path.replace(/\//g, '') === 'saved' ? 'bg-indigo-200/30 rounded border-l-4 border-indigo-300 text-neutral-500' : ''} text-neutral-600 hover:bg-indigo-200/30 hover:text-neutral-400 relative`">
            <RouterLink :to="{ name: 'SavedPosts' }" class="flex items-center">
              <i class="bi bi-bookmark text-xl"></i>
              <p class="ml-3 font-semibold">Saved Posts</p>
            </RouterLink>
          </li>
          <li class="transition-all flex items-center px-3 py-2 rounded cursor-pointer text-neutral-600 hover:bg-indigo-200/30 hover:text-neutral-400">
            <i class="bi bi-chat text-xl"></i>
            <p class="ml-3 font-semibold">Messages</p>
          </li>
        </ul>
        <div class="w-full px-3 py-2">
          <span class="block h-[1px] w-full rounded-full bg-neutral-200"></span>
        </div>
      </div>
    </div>
  </div>
</template>
