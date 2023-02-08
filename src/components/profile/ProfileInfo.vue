<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
  user: {
    type: Object,
    default: {}
  }
});

const router = useRouter();
const years = ref([
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
]);
</script>

<template>
  <div>
    <div v-if="!user.isBlockedByMe && !user.isBlockedMe">
      <div class="mb-2" v-if="user.profile.bio">
        <p class="text-neutral-700 text-sm">{{ user.profile.bio }}</p>
      </div>
      <div class="flex flex-wrap">
        <div class="flex items-center mr-3 " v-if="user.profile.location">
          <i class="bi bi-geo-alt-fill text-neutral-500 text-[.8em]"></i>
          <p class="text-neutral-500 text-sm fonst-semibold ml-1">
            {{ user.profile.location }}
          </p>
        </div>
        <div class="flex items-center mr-3 " v-if="user.createdAt">
          <i class="bi bi-calendar3 text-neutral-500 text-sm"></i>
          <p class="text-neutral-500 text-[.8em] fonst-semibold ml-2">
            Joined {{ years[new Date(user.createdAt).getMonth()] }} {{ new Date(user.createdAt).getFullYear() }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex mt-3" v-if="!user.isBlockedMe">
      <div @click="router.push(`/${user.username}/followers`)" class="flex items-center mr-3 text-sm cursor-pointer group decoration-slate-400 hover:underline">
        <span class="text-neutral-600 font-semibold">{{ user.followers.length }}</span>
        <span class="transition-all text-neutral-500 fonst-semibold ml-1 group-hover:text-neutral-700">Followers</span>
      </div>
      <div @click="router.push(`/${user.username}/following`)" class="flex items-center mr-3 text-sm cursor-pointer group decoration-slate-400 hover:underline">
        <span class="text-neutral-600 font-semibold">{{ user.following.length }}</span>
        <p class="text-neutral-500 fonst-semibold ml-1">Following</p>
      </div>
    </div>
  </div>
</template>