<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { nanoid } from 'nanoid';
import { useRoute } from 'vue-router';
import MediaViewer from '@/components/MediaViewer';

defineProps({
  user: {
    type: Object,
    default: {}
  },
  isUserExist: {
    type: Boolean,
    default: true
  },
  isMe: {
    type: Boolean,
    default: false
  }
});

const store = useStore();
const route = useRoute();
const { username } = route.params;
const emits = defineEmits(['updateProfileImageBtn:click']);
const showMenu = ref(false);
const showMediaViewer = ref(false);
const togglerClass = ref(nanoid(20));
const toggleShowMenu = () => showMenu.value = !showMenu.value;
const toggleShowMediaViewer = () => showMediaViewer.value = !showMediaViewer.value;
const toggleUpdateProfileImageMode = () => emits('updateProfileImageBtn:click');
const isProfileImageExist = computed(() => store.state.currentUser.profile.profile_media.find(({ context }) => context === 'PROFILE_IMAGE').file_name !== null);
const removeProfileImage = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.delete(`${store.state.apiBaseURL}/v1/users/profile/profile-image`, { headers: { 'Authorization': `Bearer ${store.state.accessToken.token}` } });
  } catch(e) {
    return console.log(e);
  }

  if (response.status === 200) await store.dispatch('getCurrentUser');
};

document.addEventListener('click', (ev) => {
  if (ev.target.classList.contains(togglerClass.value)) return;
  showMenu.value = false;
});
</script>

<template>
  <div class="flex items-center bg-transparent">
    <div class="w-[102px] h-[102px] rounded-full relative bg-neutral-100 flex justify-center items-center mt-[-35px]">
      <div class="w-24 h-24 rounded-full relative overflow-hidden cursor-pointer group select-none">
        <img 
          :src="`${store.state.apiBaseURL}/media/images/profile_images/${isMe ? store.state.currentUser.profile.profile_media.find(({ context }) => context === 'PROFILE_IMAGE').file_name ?? 'default.png' : user?.profile?.profile_media?.find(({ context }) => context === 'PROFILE_IMAGE')?.file_name ?? 'default.png'}`" alt="profile"
          class="transition-all w-full block object-center h-full"
        >
        <div :class="`absolute cursor-pointer right-0 left-0 top-0 bottom-0 bg-transparent group-hover:bg-neutral-300/30 origin-center transition-all flex items-center justify-center rounded-full ${togglerClass}`" @click="() => !isMe ? toggleShowMediaViewer() : toggleShowMenu()">
          <div v-if="isMe" :class="togglerClass">
            <i :class="`bi bi-camera-fill text-transparent group-hover:text-neutral-500 ${togglerClass}`"></i>
          </div>
        </div>
      </div>
      <div v-if="isMe && showMenu" class="absolute bg-white rounded shadow top-12 -right-[125px] py-2 px-1 select-none">
        <ul>
          <li @click="toggleShowMediaViewer" class="transition-all hover:text-neutral-600 p-1 text-neutral-500 text-sm rounded cursor-pointer hover:bg-neutral-100">
            <i class="bi bi-person-square"></i>
            <span class="ml-2">View profile image</span>
          </li>
          <li @click="toggleUpdateProfileImageMode" class="transition-all hover:text-neutral-600 p-1 text-neutral-500 text-sm rounded cursor-pointer hover:bg-neutral-100 mb-1 flex">
            <i class="bi bi-file-image"></i>
            <span class="block ml-2" v-if="isProfileImageExist">Change profile image</span>
            <span class="block ml-2" v-else>Upload profile image</span>
          </li>
          <li @click="removeProfileImage" v-if="isProfileImageExist" class="transition-all hover:text-red-600 p-1 text-red-500 text-sm rounded cursor-pointer hover:bg-neutral-100 mb-1 flex">
            <i class="bi bi-trash"></i>
            <span class="block ml-2">Remove profile image</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="text-neutral-600 font-semibold ml-4 mt-[-10px]">
      <p class="text-2xl">
        {{ isUserExist ? user.name : 'User not found' }}
      </p>
      <p class="-mt-1 text-neutral-500">
        @{{ isUserExist ? user.username : username }} 
      </p>
    </div>
    <MediaViewer 
      :show="showMediaViewer"
      :source="`media/images/profile_images/${isUserExist ? user.profile.profile_media.find(({ context }) => context === 'PROFILE_IMAGE').file_name ?? 'default.png' : 'default.png'}`"
      @mediaviewer:close="toggleShowMediaViewer"
    />
  </div>
</template>