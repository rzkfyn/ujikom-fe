<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Notification from '@/components/Notification';

const userNotifications = ref([]);
const store = useStore();
const getUserNotifications = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/notifications`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    })
  } catch(e) {
    return console.log(e);
  }

  const { data } = response.data;
  userNotifications.value.push(...data);
  userNotifications.value.reverse();
};

const setNotificationAsSeen = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/notifications/seen`, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    return console.error(e);
  };

  if (response.status === 200);
};

onMounted(async () => {
  try {
    await getUserNotifications();
    await setNotificationAsSeen();
  } catch(e) {
    return console.log(e);
  }
});
</script>

<template>
  <div class="pt-3 px-3">
    <div v-if="userNotifications[0]">
      <Notification v-for="notification, i in userNotifications" :key="i" :notification="notification" />
    </div>
  </div>
</template>