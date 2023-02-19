<script setup>
import { ref, onUpdated } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  user: {
    type: Object,
    default: {},
    required: true
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

const router = useRouter();
const years = ref([
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
]);
const displayUrl = (url) => {
  let result = url.replace(/(http(s?):\/\/(www.)?)/g, '').replace('/', '');
  if (displayUrl?.value?.length > 12) displayUrl.value = `${displayUrl.value.slice(0, 13)}...`;
  return result;
};
</script>

<template>
  <div>
    <div v-if="!isBlockedByMe && !isBlockedMe">
      <div class="mb-2" v-if="user.profile.bio">
        <p class="text-neutral-700">{{ user.profile.bio }}</p>
      </div>
      <div class="flex flex-wrap my-3">
        <div class="flex items-center mr-3 " v-if="user.profile.location">
          <i class="bi bi-geo-alt-fill text-neutral-500"></i>
          <p class="text-neutral-500 ml-1 text-sm">
            {{ user.profile.location }}
          </p>
        </div>
        <div class="flex items-center mr-3 " v-if="user.profile.url">
          <i class="bi bi-link-45deg text-neutral-600 text-lg"></i>
          <p class="text-neutral-500 ml-1 text-sm" :title="user.profile.url">
            <a :href="user.profile.url" target="_blank" class="transition-all text-blue-700 hover:text-sky-500">{{ displayUrl(user.profile.url) }}</a>
          </p>
        </div>
        <div class="flex items-center mr-3 " v-if="user.createdAt">
          <i class="bi bi-calendar3 text-neutral-500 text-sm"></i>
          <p class="text-neutral-500 ml-2 text-sm">
            Joined {{ years[new Date(user.createdAt).getMonth()] }} {{ new Date(user.createdAt).getFullYear() }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex mt-3" v-if="!isBlockedMe">
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