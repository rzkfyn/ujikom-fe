<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import CoverImage from '@/components/profile/CoverImage';
import TopBar from '@/components/TopBar';
import ProfileTop from '@/components/profile/ProfileTop';
import ProfileInfo from '@/components/profile/ProfileInfo';
import ProfileMenuToggler from '@/components/profile/ProfileMenuToggler';
import ManageUser from '@/components/profile/ManageUser';
import UpdateProfileAboutModal from '@/components/profile/modal/UpdateProfileAboutModal';
import UpdateProfileImageModal from '@/components/profile/modal/UpdateProfileImageModal';
import UpdateCoverImageModal from '@/components/profile/modal/UpdateCoverImageModal';
import Posts from '@/components/profile/Posts';
import Followers from '@/components/profile/Followers';
import Following from '@/components/profile/Following';
import LeftBar from '@/components/LeftBar';
import RightBar from '@/components/RightBar';
import MediaOnly from '../../components/profile/MediaOnly.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();
const isDataReady = ref(false);
const profileImage = ref('')
const username = ref('');
const isUserExist = ref(true);
const showUpdateProfileAboutModal = ref(false);
const showUpdateProfileImageModal = ref(false);
const showUpdateCoverImageModal = ref(false);
const user = ref({});
const isMe = ref(false);
const isBlockedMe = ref(false);
const isBlockedByMe = ref(false);
const toggleShowUpdateProfileImageModal = () => {
  showUpdateProfileImageModal.value = !showUpdateProfileImageModal.value;
  if (!showUpdateProfileImageModal.value) profileImage.value = `${store.state.apiBaseURL}/media/images/profile_images/${store.state.currentUser.profile.profile_image.file_name}`;
};
const toggleShowUpdateProfileAboutModal = () => {
  showUpdateProfileAboutModal.value = !showUpdateProfileAboutModal.value;
};
const toggleShowUpdateCoverImageModal = () => {
  showUpdateCoverImageModal.value = !showUpdateCoverImageModal.value;
};
const profileAboutUpdateFinishedHandler = async () => {
  showUpdateProfileAboutModal.value = false;
  await rerfreshData();
};
const profileImageUpdateFinishedHandler = async () => {
  showUpdateProfileImageModal.value = false;
  await rerfreshData();
};
const coverImageUpdateFinishedHandler = async () => {
  showUpdateCoverImageModal.value = false;
  await rerfreshData();
};
const rerfreshData = async () => {
  await store.dispatch('getCurrentUser');
  await getUser();
};
const getUser = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/users/${username.value}`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    const status = e.response?.status;
    if (status === 404) return isUserExist.value = false;
  }
  const { data } = response.data;
  user.value = data;
  isUserExist.value = true;
};

onMounted(async () => {
  try {
    await store.dispatch('getAccessToken');
  } catch(_) {
  }
  if (store.state.accessToken.token) {
    try {
      await store.dispatch('getCurrentUser');
    } catch(_) {
    }
  }

  username.value = route.params.username;
  await getUser();
  isMe.value = user.value.username === store.state.currentUser.username;
  document.querySelector('title').innerText = `${user.value.name ? `${user.value.name} (${username.value})` : username.value}`
  isDataReady.value = true;
});

watch(route, async () => {
  username.value = route.params.username;
  await getUser();
});

watch(user, (val) => {
  isMe.value = val?.username === store.state.currentUser.username;
  const blockedByMeIndex = val.blocker.findIndex(({ id }) => id === store.state.currentUser.id);
  const blockedMeIndex = val.blocking.findIndex(({ id }) => id === store.state.currentUser.id);
  isBlockedByMe.value = blockedByMeIndex > -1;
  isBlockedMe.value = blockedMeIndex > -1;
});
</script>

<template>
  <div>
    <TopBar :isDataReady="isDataReady">
      <template #default>
        <div class="flex items-center">
          <div class="text-neutral-700 text-2xl mr-4 cursor-pointer" @click="router.back()">
            <i class="bi bi-arrow-left"></i>
          </div>
          <div class="text-neutral-800 text-sm">{{ isUserExist ? `${user.name} (${user.username})` : 'User not found'}}</div>
        </div>
      </template>
    </TopBar>
    <div class="flex min-h-screen px-8 justify-between" v-if="isDataReady">
      <LeftBar />
      <div class="shadow w-7/12 relative mt-16 bg-white mr-2 rounded-md" v-if="isDataReady">
        <CoverImage :user="user" :isMe="isMe" :isUserExist="isUserExist" @updateCoverImageBtn:click="toggleShowUpdateCoverImageModal"/>
        <div class="px-3 flex justify-between">
          <ProfileTop :user="user" :isMe="isMe" :isUserExist="isUserExist" @updateProfileImageBtn:click="toggleShowUpdateProfileImageModal" />
          <ProfileMenuToggler :user="user" :isMe="isMe" @updateProfileAboutBtn:click="toggleShowUpdateProfileAboutModal" />
        </div>
        <div class="px-4 mt-3" v-if="isUserExist">
          <ProfileInfo :user="user" :isBlockedByMe="isBlockedByMe" :isBlockedMe="isBlockedMe"/>
        </div>
        <ManageUser v-if="!isMe && isUserExist" :user="user" :getUser="getUser" :isBlockedByMe="isBlockedByMe" :isBlockedMe="isBlockedMe"/>
        <div class="mt-3 sticky top-[54px] z-10" v-if="isUserExist">
          <div class="absolute left-0 bg-white/90 right-0 py-3 px-4 border-t border-b" v-if="!isBlockedByMe && !isBlockedMe">
            <ul class="flex justify-start">
                <li @click="() => router.push(`/${username}/posts`)"
                  :class="`mr-10 font-semibold cursor-pointer hover:text-neutral-300 transition-all duration-300 ${route.path.replace(/\//g, '').endsWith('posts') || route.path.replace(/\//g, '').endsWith(username)  ? 'text-neutral-700' : 'text-neutral-500'}`" 
                >Posts</li>
                <li @click="() => router.push(`/${username}/about`)"
                  :class="`mr-10 font-semibold cursor-pointer hover:text-neutral-300 transition-all duration-300 ${route.path.replace(/\//g, '').endsWith('about') ? 'text-neutral-700' : 'text-neutral-500'}`" 
                >About</li>
                <li @click="() => router.push(`/${username}/media`)"
                  :class="`mr-10 font-semibold cursor-pointer hover:text-neutral-300 transition-all duration-300 ${route.path.replace(/\//g, '').endsWith('media') ? 'text-neutral-700' : 'text-neutral-500'}`" 
                >Media</li>
              </ul>
          </div>
        </div>
        <div>
          <Posts :user="user" :isBlockedByMe="isBlockedByMe" :isBlockedMe="isBlockedMe" 
            v-if="route.path === `/${user.username}` || route.path === `/${user.username}/` || route.path === `/${user.username}/posts`" 
          />
          <MediaOnly :user="user" :isBlockedByMe="isBlockedByMe" :isBlockedMe="isBlockedMe" 
            v-if="route.path === `/${user.username}/media`"
          />
          <Followers v-if="route.path === `/${user.username}/followers`" />
          <Following v-if="route.path === `/${user.username}/following`" />
        </div>
      </div>
      <RightBar/>
      <div v-if="isMe">
        <UpdateProfileAboutModal 
          :visible="showUpdateProfileAboutModal" 
          @cancelbtn:click="toggleShowUpdateProfileAboutModal" 
          @profileaboutupdate:finished="profileAboutUpdateFinishedHandler"
        />
        <UpdateProfileImageModal
          :visible="showUpdateProfileImageModal"
          @cancelbtn:click="toggleShowUpdateProfileImageModal"
          @profileimageupdate:finished="profileImageUpdateFinishedHandler"
        />
        <UpdateCoverImageModal
          :visible="showUpdateCoverImageModal" 
          @cancelbtn:click="toggleShowUpdateCoverImageModal" 
          @coverimageupdate:finished="coverImageUpdateFinishedHandler"
        />
      </div>
    </div>
  </div>
</template>