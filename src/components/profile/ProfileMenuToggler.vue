<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { nanoid } from 'nanoid';

defineProps({
  user: {
    type: Object,
    default: {}
  },
  isMe: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['updateProfileAboutBtn:click']);
const router = useRouter();
const showMenu = ref(false);
const togglerClass = ref(nanoid(16));
const toggleUpdateProfileAboutMode = () => {
  emit('updateProfileAboutBtn:click');
};
const toggleShowMenu = () => {
  showMenu.value = !showMenu.value;
};
document.addEventListener('click', (ev) => {
  if (ev.target.classList.contains(togglerClass.value)) return;
  showMenu.value = false;
});
</script>

<template>
  <div v-if="isMe" class="mt-2">
    <div :class="`group flex items-center py-3 px-3 rounded-2xl border border-neutral-500 cursor-pointer relative ${togglerClass}`" @click="toggleShowMenu">
      <span class="block w-[5px] h-[5px] bg-neutral-700 rounded-full"></span>
      <span class="block w-[5px] h-[5px] bg-neutral-700 rounded-full ml-2"></span>
      <span class="block w-[5px] h-[5px] bg-neutral-700 rounded-full ml-2"></span>
      <div class="absolute right-[-115px] bg-white rounded shadow p-2 top-1 scale-100 group-hover:scale-100 z-20" v-if="showMenu">
        <ul class="text-neutral-600">
          <li @click="toggleUpdateProfileAboutMode" class="transition-all hover:text-neutral-600 p-1 text-sm rounded cursor-pointer hover:bg-neutral-100">
            <i class="bi bi-pencil-square"></i>
            <span class="ml-2">Edit profile</span>
          </li>
          <li class="transition-all hover:text-neutral-600 p-1 text-sm rounded cursor-pointer hover:bg-neutral-100">
            <i class="bi bi-gear"></i>
            <span class="ml-2" @click="router.push('/settings')">Profile settings</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
