<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { nanoid } from 'nanoid';

defineProps({
  isDataReady: {
    type: Boolean,
    default: false
  }
});

const store = useStore();
const router = useRouter();
const showMenu = ref(false);
const togglerClass = nanoid(20);
const toggleShowMenu = () => {
  showMenu.value = !showMenu.value;
};
const logout = async () => {
  try {
    await axios.post(`${store.state.apiBaseURL}/v1/auth/logout`, {}, {
      withCredentials: true 
    });
  } catch (_) {}

  return router.push('/login');
};

onMounted(() => {
  document.addEventListener('click', (ev) => {
    if (ev.target?.classList?.contains(`${togglerClass}`) || ev.target?.parentElement?.classList?.contains(`${togglerClass}`)) return;
    showMenu.value = false;
  });
});
</script>

<template>
  <div :class="`fixed right-0 left-0 top-0 px-4 bg-white z-50 flex items-center justify-between shadow ${store.state.login ? 'py-2' : 'py-4'}`">
    <div>
      <slot>
      </slot>
    </div>
    <div>
      <div v-if="!store.state.login">
        <div class="text-sm text-neutral-600 font-semibold cursor-pointer hover:text-neutral-400 transition-all">
          <RouterLink :to="{ name: 'Register' }">signin/signup</RouterLink>
        </div>
      </div>
      <div v-else>
        <div class="text-sm text-neutral-600 font-semibold cursor-pointer hover:text-neutral-400 transition-all">
          <div @click="toggleShowMenu" v-if="isDataReady" :class="`w-10 h-10 rounded-full overflow-hidden ${togglerClass}`">
            <img :src="`${store.state.apiBaseURL}/media/images/profile_images/${store.state.currentUser.profile.profile_media?.find(({ context }) => context === 'PROFILE_IMAGE').file_name ?? 'default.png'}`" alt="profile"
              class="w-full h-full"
            >
          </div>
          <div class="absolute right-10 border px-2 bg-white top-6 font-normal rounded py-2" v-if="showMenu">
            <ul class="select-none">
              <li @click="router.push(`/${store.state.currentUser.username}`)" class="min-w-fit transition-all hover:text-neutral-600 p-1 text-neutral-500 text-sm rounded cursor-pointer hover:bg-neutral-100">
                <i class="bi bi-person-square"></i>
                <span class="ml-2">View your profile</span>
              </li>
              <li @click="logout" class="transition-all hover:text-neutral-600 p-1 text-neutral-500 text-sm rounded cursor-pointer hover:bg-neutral-100 mb-1 flex">
                <i class="bi bi-box-arrow-left text-md"></i>
                <span class="block ml-2">SignOut</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>