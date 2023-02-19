<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const userNotifications = ref([]);
const store = useStore();
const route = useRoute();
  const router = useRouter();
const notificationFrom = ref(null);
const getNotifMessage = (context) => {
  if (context === 'FOLLOW') return 'starting following you';
  if (context === 'LIKE') return 'liked your post';
  if (context === 'SHARE') return 'shared your post';
};
const getUserNotifications = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/notifications`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    return console.log(e);
  }

  const { data } = response.data;
  userNotifications.value.push(...data);
  userNotifications.value.reverse();
};
const parseTime = (time) => {
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

onMounted(async () => {
  await getUserNotifications();
});
</script>

<template>
  <div class="pt-3 px-3">
    <div v-for="notification, i in userNotifications" :key="i">
      <div class="px-4 mb-1 bg-neutral-100/50 flex justify-between items-center py-2">
        <div class="flex items-center">
          <div class="w-14 h-14 border rounded-full overflow-hidden items-center">
            <img :src="`${store.state.apiBaseURL}/media/images/profile_images/${notification.fired_by_user.profile.profile_media.find(({ context }) => context === 'PROFILE_IMAGE').file_name}`" alt="profile"
              class="w-full h-full object-center"
            >
          </div>
          <div class="ml-5">
            <p class="font-semibold text-neutral-600">{{ notification.fired_by_user.username }} {{ getNotifMessage(notification.event) }}</p>
            <p class="font-semibold text-sm text-neutral-500">{{ parseTime(notification.createdAt) }} ago</p>
          </div>
        </div>
        <div class="flex self-start justify-self-end py-2">
          <span class="w-1 h-1 bg-neutral-700 rounded-full"></span>
          <span class="w-1 h-1 bg-neutral-700 rounded-full ml-1"></span>
          <span class="w-1 h-1 bg-neutral-700 rounded-full ml-1"></span>
        </div>
      </div>
    </div>
  </div>
</template>