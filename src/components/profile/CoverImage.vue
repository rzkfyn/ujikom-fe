<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { nanoid } from 'nanoid';

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
const emits = defineEmits(['updateCoverImageBtn:click']);
const showMenu = ref(false);
const togglerClass = ref(nanoid(20));
const toggleShowMenu = () => {
  showMenu.value = !showMenu.value;
};
const toggleUpdateCoverImageMode = () => {
  emits('updateCoverImageBtn:click');
};

document.addEventListener('click', (ev) => {
  if (ev.target.classList.contains(togglerClass.value)) return;
  showMenu.value = false;
});
</script>

<template>
  <div class="relative bg-neutral-600 w-full h-[250px] overflow-hidden">
    <img :src="`${store.state.apiBaseURL}/media/images/cover_images/${isUserExist ? user.profile.profile_media.cover_image.file_name : 'default.png'}`" alt="cover image" 
      class="w-full h-full object-cover object-top"
    >
    <div :class="`group hover:bg-neutral-300/30 transition-all absolute left-0 right-0 top-0 bottom-0 bg-neutral-300/0 cursor-pointer flex justify-center items-center ${togglerClass}`" @click="toggleShowMenu">
      <div class="relative" v-if="user?.isMe">
        <i class="bi bi-camera-fill text-transparent text-2xl group-hover:text-neutral-500"></i>
      </div>
    </div>
    <div class="absolute bg-white rounded shadow top-[50%] right-[22%] p-1 select-none" v-if="user?.isMe && showMenu">
      <ul>
        <li class="flex transition-all hover:text-neutral-600 p-1 text-neutral-500 text-sm rounded cursor-pointer hover:bg-neutral-100">
          <i class="bi bi-card-image"></i>
          <span class="ml-2">View cover image</span>
        </li>
        <li @click="toggleUpdateCoverImageMode" class="flex transition-all hover:text-neutral-600 p-1 text-neutral-500 text-sm rounded cursor-pointer hover:bg-neutral-100">
          <i class="bi bi-images"></i>
          <span class="ml-2">Change cover image</span>
        </li>
      </ul>
    </div>
  </div>
</template>