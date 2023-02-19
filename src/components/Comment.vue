<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  comment: {
    type: Object,
    default: {},
    required: true
  }
});
const store = useStore();
const isPostedByMe = ref(false);
const parseTime = (time: string) => {
  const postTime = + new Date(time);
  const timeDiffrence = ((+ new Date()) - postTime) / 1000;
  const days = Math.floor(timeDiffrence / 86400);
  const hours = Math.floor((timeDiffrence - days * 86400) / 3600);
  const minutes = Math.floor(((timeDiffrence - (days * 86400 + hours * 3600))) / 60);
  const seconds = Math.floor((timeDiffrence - (days * 86400 + hours * 3600 + minutes * 60)));

  if (days > 0) return days > 30 ? new Date(postTime).toDateString() : `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return seconds > 10 ? `${seconds}s` : 'just now';
};

onMounted(() => {
  if (store.state.currentUser?.username === props.comment.user.username) isPostedByMe.value = true;
});
</script>

<template>
  <div class="py-2 px-3 flex">
    <div class="w-12 h-12 mr-3 rounded-full overflow-hidden">
      <img :src="`${store.state.apiBaseURL}/media/images/profile_images/${comment.user.profile.profile_media.find(({ context }) => context === 'PROFILE_IMAGE').file_name}`" alt="profile">
    </div>
    <div>
      <div class="bg-neutral-100 py-3 px-4 rounded-3xl">
        <div class="flex items-center font-semibold text-[.95em]">
          <p class="text-neutral-700">{{ comment.user.name }}</p>
          <p class="ml-2 text-neutral-500 font-normal">@{{ comment.user.username }}</p>
        </div>
        <div>
          <p class="w-fit rounded-2xl text-neutral-700 text-[.93em]">
            {{ comment.text }}
          </p>
        </div>
      </div>
      <div class="px-3">
        <p class="text-neutral-400 text-sm">
          {{ parseTime(comment.createdAt) }}
        </p>
      </div>
    </div>
  </div>
</template>