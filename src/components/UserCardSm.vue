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
const store = useStore();
const userDetailData = ref({});
const isFollowingMe = ref(false);
const showManageFollowerMenu = ref(false);
const togglerClass = nanoid(20);
const isBlockedByMe = ref(false);
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
  isBlockedByMe.value = index > -1;
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
  <div class="flex justify-between items-center py-1 px-1 mb-2">
    <div class="flex">
      <div class="h-10 w-10 rounded-full border overflow-hidden">
        <img :src="`${store.state.apiBaseURL}/media/images/profile_images/${user.profile.profile_media.find(({ context }) => context === 'PROFILE_IMAGE').file_name ?? 'default.png'}`" alt="profile" 
          class="w-full h-full"
        >
      </div>
      <div class="ml-3">
        <div>
          <p @click="router.push({ name: 'Profile', params: { username: user.username } })" 
            class="text-neutral-700 font-semibold hover:underline cursor-pointer text-sm">
            {{ user.name }}
          </p>
          <p class="text-neutral-500 flex items-center -mt-1">
            <span class="text-[.8em] font-normal">@{{ user.username }}</span>
            <div v-if="isFollowingMe" class="h-4 bg-neutral-200 flex justify-center items-center ml-3 px-2 rounded">
              <span class="text-[.6em] font-normal rounded text-neutral-700">follows you</span>
            </div>
          </p>
        </div>
      </div>
    </div>
    <div class="flex">
      <button v-if="isFollowedByMe(user.id)" @click="handleUnfollowBtnClick(user.username)"
        class="group text-[.8em] text-neutral-400 py-1 px-2 border border-neutral-300 hover:border-red-400 rounded-xl"
      >
        <span class="group-hover:hidden">Following</span>
        <span class="hidden group-hover:inline text-red-400">Unfollow</span>
      </button>
      <button v-else-if="!(user.id === store.state.currentUser.id) && !isFollowedByMe(user.id)" @click="handleFollowBtnClick(user.username)"
      class="text-[.8em] text-neutral-500 bg-neutral-500/10 px-2 py-1 border border-neutral-400 rounded-xl"
      >{{ isFollowingMe ? 'Follow Back' : 'Follow' }}</button>
    </div>
  </div>
</template>