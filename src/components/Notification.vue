<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

defineProps({
  notification: {
    type: Object,
    default: {}
  }
});

const router = useRouter();
const store = useStore();
const getNotifMessage = (context) => {
  if (context === 'USER_FOLLOW') return 'starting following you';
  if (context === 'POST_LIKE') return 'liked your post';
  if (context === 'POST_SHARE') return 'shared your post';
};
const parseTime = (time) => {
  const postTime = + new Date(time);
  const timeDiffrence = ((+ new Date()) - postTime) / 1000;
  const days = Math.floor(timeDiffrence / 86400); 
  const hours = Math.floor((timeDiffrence - days * 86400) / 3600);
  const minutes = Math.floor(((timeDiffrence - (days * 86400 + hours * 3600))) / 60);
  const seconds = Math.floor((timeDiffrence - (days * 86400 + hours * 3600 + minutes * 60)));

  if (days > 0) return days > 30 ? new Date(postTime).toDateString() : `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return seconds > 10 ? `${seconds}s ago` : 'just now';
};
</script>

<template>
  <div class="px-4 mb-1 bg-neutral-100/50">
    <div class="flex justify-between items-center py-2">
      <div class="flex items-start">
        <div class="text-red-400 self-start text-xl mr-2" v-if="notification.event === 'POST_LIKE'">
          <i class="bi bi-heart-fill"></i>
        </div>
        <div class="text-indigo-400 self-start text-2xl mr-1" v-if="notification.event === 'USER_FOLLOW'">
          <i class="bi bi-person-fill"></i>
        </div>
        <div class="ml-2">
          <p class="font-semibold text-neutral-600">
            <RouterLink :to="{ name: 'Profile', params: { username: notification.fired_by_user.username } }">
              <span class="hover:underline">
                {{ notification.fired_by_user.username }}
              </span>
            </RouterLink>
            <span class="ml-1">{{ getNotifMessage(notification.event) }}</span>
          </p>
          <p class="font-semibold text-sm text-neutral-500">{{ parseTime(notification.createdAt) }}</p>
        </div>
      </div>
      <div class="flex self-start justify-self-end py-2">
        <span class="w-1 h-1 bg-neutral-700 rounded-full"></span>
        <span class="w-1 h-1 bg-neutral-700 rounded-full ml-1"></span>
        <span class="w-1 h-1 bg-neutral-700 rounded-full ml-1"></span>
      </div>
    </div>
    <div class="pl-8">
      <div @click="() => router.push({ name: 'Profile', params: { username: notification.fired_by_user.username },  })"
        class="px-6 py-3 rounded-md border border-neutral-200 transition-all cursor-pointer hover:bg-neutral-100"
      >
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div class="w-14 h-14 rounded-full overflow-hidden">
              <img alt="profile"
                :src="`${store.state.apiBaseURL}/media/images/profile_images/${notification.fired_by_user.profile.profile_media.find(({ context }) => context === 'PROFILE_IMAGE').file_name}`"
                class="w-full h-full object-center"
              >
            </div>
            <div class="ml-4 text-start">
              <p class="font-semibold text-neutral-600 -mb-1 hover:underline cursor-pointer">{{ notification.fired_by_user.name }}</p>
              <p class="text-neutral-500 text-sm cursor-pointer">@{{ notification.fired_by_user.username }}</p>
            </div>
          </div>
          <div>
            <button 
              class="bg-indigo-500/60 text-neutral-100 px-3 py-[6px] font-semibold text-sm rounded-md hover:bg-indigo-500/80"
            >Follow Back</button>
          </div>
        </div>
        <div class="mt-2 text-neutral-500">
          {{ notification.fired_by_user.profile.bio }}
        </div>
      </div>
    </div>
  </div>
</template>