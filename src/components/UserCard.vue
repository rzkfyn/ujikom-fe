<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { nanoid } from 'nanoid';

const props = defineProps({
  user: {
    type: Object,
    default: {}
  }
});

const router = useRouter();
const route = useRoute();
const store = useStore();
const userDetailData = ref({});
const isFollowingMe = ref(false);
const showManageFollowerMenu = ref(false);
const togglerClass = nanoid(20);
const isBlockedByMe = ref(false);
const toggleShowManageFollowerMenu = () => {
  showManageFollowerMenu.value = !showManageFollowerMenu.value;
};
const isFollowedByMe = (userId) => {
  const index = isFollowedByMe.value = store.state.currentUser.following.findIndex((user) => user.id === userId);
  return index > -1;
};
const followOrUnfollowUser = async (username, context = 'follow') => {
  await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/users/${username}/${context}`, {
    headers: {
      'Authorization': `Bearer ${store.state.accessToken.token}`
    }
  });
  await store.dispatch('getCurrentUser');
};
const handleFollowBtnClick = async (username) => {
  try {
    await followOrUnfollowUser(username);
  } catch(e) {
    console.log(e);
  }
};
const handleUnfollowBtnClick = async (username) => {
  try {
    await followOrUnfollowUser(username, 'unfollow');
  } catch(e) {
    console.log(e);
  }
};
const getUserDetailData = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/users/${props.user.username}`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    return console.log(e);
  }

  const { data } = response.data;
  userDetailData.value = data;
};
const isUserFollowingMe = () => {
  const index = userDetailData.value.following.findIndex((user) => user.id === store.state.currentUser.id);
  isFollowingMe.value = index > -1;
};
const isUserBlockedByMe = () => {
  const index = props.user.blocker.findIndex((user) => user.id === store.state.currentUser.id);
  console.log(props.user.blocker);
  isBlockedByMe.value = index > -1;
}
const removeFollower = async (username) => {
  try {
    await store.state.axiosInstance.delete(`${store.state.apiBaseURL}/v1/users/${username}/follow`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    console.log(e);
  }
  await getUserDetailData();
  isUserFollowingMe();
};

onMounted(async () => {
  await getUserDetailData();
  isUserFollowingMe();
  isUserBlockedByMe();

  document.addEventListener('click', (ev) => {
    if (ev.target.classList.contains(togglerClass) || ev.target.parentElement.classList.contains(togglerClass)) return;
    showManageFollowerMenu.value = false;
  });
});
</script>

<template>
  <div class="flex border-b justify-between items-center pt-3 pb-4">
    <div class="flex">
      <div class="h-14 w-14 rounded-full border overflow-hidden">
        <img :src="`${store.state.apiBaseURL}/media/images/profile_images/${user.profile.profile_media.find(({ context }) => context === 'PROFILE_IMAGE').file_name ?? 'default.png'}`" alt="profile" class="w-full h-full">
      </div>
      <div class="text-[.9em] ml-3 mt-2">
        <div>
          <p @click="router.push({ name: 'Profile', params: { username: user.username } })" class="text-neutral-700 font-semibold hover:underline cursor-pointer">{{ user.name }}</p>
          <p class="text-neutral-500 flex items-center">
            <span>@{{ user.username }}</span>
            <span v-if="isBlockedByMe" class="ml-2 text-[.8em] bg-neutral-200/80 px-3 rounded">blocked</span>
            <span v-if="isFollowingMe" class="ml-2 text-[.8em] bg-neutral-200/80 px-3 rounded">follows you</span>
            <span v-if="user.id === store.state.currentUser.id" class="ml-2 text-[.8em] bg-neutral-200/80 px-3 rounded">you</span>
          </p>
        </div>
        <div class="text-neutral-700 text-sm">
          {{ user.profile.bio }}
        </div>
      </div>
    </div>
    <div class="flex">
      <button v-if="isBlockedByMe"
        class="group text-sm text-neutral-400 py-1 px-3 border border-neutral-300 hover:border-red-400 rounded-full"
      >
        <span class="">Blocked</span>
      </button>
      <button v-else-if="isFollowedByMe(user.id)" @click="handleUnfollowBtnClick(user.username)"
        class="group text-sm text-neutral-400 py-1 px-3 border border-neutral-300 hover:border-red-400 rounded-full"
      >
        <span class="group-hover:hidden">Following</span>
        <span class="hidden group-hover:inline text-red-400">Unfollow</span>
      </button>
      <button v-else-if="!(user.id === store.state.currentUser.id) && !isFollowedByMe(user.id)" @click="handleFollowBtnClick(user.username)"
      class="text-sm text-neutral-500 bg-neutral-500/10 px-3 py-1 border border-neutral-400 rounded-xl"
      >{{ isFollowingMe ? 'Follow Back' : 'Follow' }}</button>
      <div v-if="isFollowingMe && route.path.match('/followers') && route.params.username === store.state.currentUser.username" 
        class="ml-1 relative"
      >
        <div :class="`rounded-full p-3 hover:bg-neutral-300/30 cursor-pointer flex items-center ${togglerClass}`" @click="toggleShowManageFollowerMenu">
          <span class="block w-1 h-1 bg-neutral-700 mr-1 rounded-full"></span>
          <span class="block w-1 h-1 bg-neutral-700 mr-1 rounded-full"></span>
          <span class="block w-1 h-1 bg-neutral-700 rounded-full"></span>          
        </div>
        <div v-if="showManageFollowerMenu" class="absolute bg-white rounded shadow top-3 -left-[190px] p-2 select-none">
          <ul class="text-neutral-600">
            <li @click="removeFollower(user.username)" class="transition-all flex items-center hover:text-neutral-600 p-1 text-neutral-500 text-sm rounded cursor-pointer hover:bg-neutral-100">
              <i class="bi bi-person-dash text-base"></i>
              <span class="ml-2">Remove from follower list</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>