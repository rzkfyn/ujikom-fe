<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { nanoid } from 'nanoid';

const props = defineProps({
  user: {
    type: Object,
    default: {}
  },
  getUser: {
    type: Function,
    default: () => null
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
const showMenu = ref(false);
const togglerClass = nanoid(20);
const isFollowedByMe = computed(() => {
  const index = props.user.followers.findIndex((follower) => follower.username === store.state.currentUser.username)
  return index > -1 ? true : false;
});
const toggleShowMenu = () => showMenu.value = !showMenu.value;
const followBtnClickHandler = async () => {
  if (!store.state.login) return router.push({ name: 'Login' });
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/users/${props.user.username}/follow`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      },
      withCredentials: true
    });
  } catch(e) {
    console.log(e);
  }

  if (response.status === 200) await props.getUser();
};
const unfollowBtnClickHandler = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/users/${props.user.username}/unfollow`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    console.log(e);
  }

  if (response.status === 200) await props.getUser();
};
const blockUser = async () => {
  try {
    await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/users/${props.user.username}/block`);
  } catch(e) {
    console.log(e);
  }

  await props.getUser();
};
const unblockUser = async () => {
  try {
    await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/users/${props.user.username}/unblock`);
  } catch(e) {
    console.log(e);
  }

  await props.getUser();
};


onMounted(() => {
  document.addEventListener('click', (ev) => {
    const target = ev.target;
    if (target.classList.contains(`${togglerClass}`) || target.parentElement.classList.contains(`${togglerClass}`)) return;
    showMenu.value = false;
  });
});

</script>

<template>
  <div class="mt-4 px-4 flex items-center">
    <div class="mr-2">
      <button v-if="isBlockedByMe" title="unblock user" @click="unblockUser"
        class="group text-[.8em] font-semibold text-white py-[6px] px-3 rounded-full border border-transparent bg-red-500 hover:bg-neutral-100 hover:border hover:border-red-500 hover:text-red-500"
      >
        <span class="group-hover:hidden">Blocked</span>
        <span class="hidden group-hover:inline">Unblock</span>
      </button>
      <button v-if="!isBlockedByMe && !isFollowedByMe && !isBlockedMe" @click="followBtnClickHandler" :title="store.state.login ? 'follow user' : 'login to follow user'"
        class="text-[.8em] text-white py-1 px-3 rounded-full shadow bg-indigo-500 hover:bg-indigo-400 hover:text-neutral-300"
      >Follow</button>
      <button v-else-if="!isBlockedMe && isFollowedByMe" @click="unfollowBtnClickHandler" class="text-[.8em] text-white py-1 px-3 rounded-xl shadow bg-neutral-500 hover:bg-neutral-400 hover:text-neutral-300">Unfollow</button>
    </div>
    <div class="relative">
      <div @click="toggleShowMenu" :class="`group flex items-center py-2 px-3 rounded-2xl border-neutral-500 cursor-pointer ${togglerClass}`">
        <span class="block w-[5px] h-[5px] bg-neutral-700 rounded-full"></span>
        <span class="block w-[5px] h-[5px] bg-neutral-700 rounded-full ml-2"></span>
        <span class="block w-[5px] h-[5px] bg-neutral-700 rounded-full ml-2"></span>
      </div>
      <div v-if="showMenu" :class="`absolute bg-white rounded shadow-md border border-neutral-200 top-2 whitespace-nowrap left-6 p-2 select-none z-10`">
        <ul class="text-neutral-600">
          <li v-if="!isBlockedByMe" @click="blockUser" class="transition-all flex items-center hover:text-neutral-600 p-1 text-neutral-500 text-sm rounded cursor-pointer hover:bg-neutral-100">
            <i class="bi bi-person-x text-base"></i>
            <span class="ml-2">Block {{ user.username }}</span>
          </li>
          <li v-else @click="unblockUser" class="transition-all flex items-center hover:text-neutral-600 p-1 text-neutral-500 text-sm rounded cursor-pointer hover:bg-neutral-100">
            <i class="bi bi-person-x text-base"></i>
            <span class="ml-2">Unblock {{ user.username }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>