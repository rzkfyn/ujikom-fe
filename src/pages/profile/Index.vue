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
import Followers from '../../components/profile/Followers.vue';
import Following from '../../components/profile/Following.vue';

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
  await getUser();
};
const profileImageUpdateFinishedHandler = async () => {
  showUpdateProfileImageModal.value = false;
  await getUser();
};
const coverImageUpdateFinishedHandler = async () => {
  showUpdateCoverImageModal.value = false;
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
  if (!store.state.currentUser.username) {
    try {
      await store.dispatch('getCurrentUser');
    } catch(_) { 
      
    }
  }

  username.value = route.params.username;
  await getUser();
  isDataReady.value = true;
  document.querySelector('title').innerText = `${user.value.name ? `${user.value.name} (${username.value})` : username.value}`
});

watch(route, async () => {
  username.value = route.params.username;
  await getUser();
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
    <div class="flex min-h-screen px-8">
      <div class="rounded shadow w-6/12 relative mt-8" v-if="isDataReady">
        <CoverImage :user="user" :isUserExist="isUserExist" @updateCoverImageBtn:click="toggleShowUpdateCoverImageModal"/>
        <div class="px-3 flex justify-between">
          <ProfileTop :user="user" :isUserExist="isUserExist" @updateProfileImageBtn:click="toggleShowUpdateProfileImageModal" />
          <ProfileMenuToggler :user="user" @updateProfileAboutBtn:click="toggleShowUpdateProfileAboutModal" />
        </div>
        <div class="px-4 mt-3" v-if="isUserExist">
          <ProfileInfo :user="user" />
        </div>
        <ManageUser v-if="!user?.isMe && isUserExist" :user="user" :getUser="getUser"/>
        <div class="mt-3 relative" v-if="isUserExist">
          <div class="absolute left-0 right-0 py-3 px-4 border-t border-b" v-if="!user.isBlockedByMe && !user.isBlockedMe">
            <ul class="flex justify-start">
                <li class="mr-5 font-semibold text-neutral-700 cursor-pointer hover:text-neutral-300 transition-all duration-300" @click="router.push(`/${username}/posts`)">Posts</li>
                <li class="mr-5 font-semibold text-neutral-500 cursor-pointer hover:text-neutral-300 transition-all duration-300" @click="router.push(`/${username}/posts`)">About</li>
                <li class="mr-5 font-semibold text-neutral-500 cursor-pointer hover:text-neutral-300 transition-all duration-300" @click="router.push(`/${username}/posts`)">Media</li>
              </ul>
          </div>
        </div>
        <div>
          <Posts :user="user" v-if="route.path === `/${user.username}` || route.path === `/${user.username}/` || route.path === `/${user.username}/posts`" />
          <Followers v-if="route.path === `/${user.username}/followers`" />
          <Following v-if="route.path === `/${user.username}/following`" />
        </div>
      </div>
      <div v-if="user.isMe">
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