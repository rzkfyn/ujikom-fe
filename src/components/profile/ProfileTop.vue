<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { nanoid } from 'nanoid';
import { useRoute } from 'vue-router';

defineProps({
  user: {
    type: Object,
    default: {}
  },
  isUserExist: {
    type: Boolean,
    default: true
  }
});

const store = useStore();
const route = useRoute();
const { username } = route.params;
const emits = defineEmits(['updateProfileImageBtn:click']);
const showMenu = ref(false);
const togglerClass = ref(nanoid(20));
const toggleShowMenu = () => {
  showMenu.value = !showMenu.value;
};
const toggleUpdateProfileImageMode = () => {
  emits('updateProfileImageBtn:click');
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
        <img :src="`${store.state.apiBaseURL}/media/images/profile_images/${isUserExist ? user.profile.profile_media.profile_image.file_name : 'default.png'}`" alt="profile"
        class="transition-all w-full block"
        >
        <div :class="`absolute cursor-pointer right-0 left-0 top-0 bottom-0 bg-transparent group-hover:bg-neutral-300/30 origin-center transition-all flex items-center justify-center rounded-full ${togglerClass}`" @click="toggleShowMenu">
          <div v-if="user.isMe" :class="togglerClass">
            <i :class="`bi bi-camera-fill text-transparent group-hover:text-neutral-500 ${togglerClass}`"></i>
          </div>
        </div>
      </div>
      <div v-if="user.isMe && showMenu" class="absolute bg-white rounded shadow top-10 -right-[135px] py-2 px-1 select-none">
        <ul>
          <li class="transition-all hover:text-neutral-600 p-1 text-neutral-500 text-sm rounded cursor-pointer hover:bg-neutral-100">
            <i class="bi bi-person-square"></i>
            <span class="ml-2">View profile image</span>
          </li>
          <li @click="toggleUpdateProfileImageMode" class="transition-all hover:text-neutral-600 p-1 text-neutral-500 text-sm rounded cursor-pointer hover:bg-neutral-100 mb-1 flex">
            <i class="bi bi-file-image"></i>
            <span class="block ml-2">Change profile image</span>
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
  </div>
</template>