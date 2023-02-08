<script setup>
import axios from 'axios';
import { useStore } from 'vuex';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['cancelbtn:click', 'profileaboutupdate:finished']);
const router = useRouter();
const store = useStore();
const axiosInstance = axios.create();
const name = ref('');
const bio = ref('');
const location = ref('');
const hideModal = () => {
  emit('cancelbtn:click');
};
const formSubmitHandler = async (ev) => {
  ev.preventDefault();

  let response;
  try {
    response = await axiosInstance.put(`${store.state.apiBaseURL}/v1/users/profile`, {
      name: name.value, bio: bio.value, location: location.value
    }, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    const { data } = e.response;
    console.log(data.message)
  }

  if (response.status === 200) emit('profileaboutupdate:finished');
};

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const currentDate = + new Date();
    if (store.state.accessToken.exp >= currentDate) {
      config.headers.Authorization = `Bearer ${store.state.accessToken.token}`;
    } else {
      const response = await axios.get(`${store.state.apiBaseURL}/v1/auth/refresh-token`, {
        withCredentials: true
      });
      const { data } = response.data;
      const { access_token } = data;
      const { exp } = jwtDecode(access_token);

      config.headers.Authorization = `Bearer ${access_token}`;
      store.commit('setAccessToken', { token: access_token, exp });
    }
  } catch(_) {
    return router.push({ name: 'Login' });
  }
  return config;
});

onMounted(async () => {
  if (!store.state.currentUser.userName) {
    try {
      await store.dispatch('getCurrentUser');
    } catch(_) { }
  }

  name.value = store.state.currentUser.name
  bio.value = store.state.currentUser.profile.bio;
  location.value = store.state.currentUser.profile.location;
});

</script>

<template>
  <div class="flex justify-center items-center fixed right-0 left-0 bottom-0 top-0 bg-neutral-800/40" v-if="visible">
    <div class="bg-white p-4 rounded shadow w-5/12 min-w-[250px]">
      <div>
        <h4 class="text-neutral-700 font-semibold">Update Your Profile About</h4>
      </div>
      <div class="mt-4">
        <form @submit="formSubmitHandler">
          <div class="mb-4">
            <label for="name" class="mb-1">Name</label>
            <input type="text" name="name" id="name" v-model="name"
            class="w-full rounded focus:outline-none border border-neutral-300 text-sm px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-400"
            >
          </div>
          <div class="mb-4">
            <label for="location" class="mb-1">Location</label>
            <input type="text" name="location" id="location" v-model="location"
            class="w-full rounded focus:outline-none border border-neutral-300 text-sm px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-400"
            >
          </div>
          <div class="mb-4">
            <label for="location" class="mb-1">Bio</label>
            <textarea type="text" name="location" id="location" v-model="bio" rows="5"
            class="w-full rounded focus:outline-none border border-neutral-300 text-sm resize-none px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-400"
            ></textarea>
          </div>
          <span class="block bg-neutral-400 w-full h-[2px] rounded-full mt-1 mb-3"></span> 
          <div class="text-center">
            <button class="bg-indigo-500 text-neutral-100 hover:bg-indigo-600 hover:text-neutral-200 block rounded py-1 text-sm font-semibold w-full mb-1" type="submit">Confirm</button>
            <button @click="hideModal" class="block hover:bg-neutral-300 transition-all rounded text-neutral-500 py-1 text-sm font-semibold w-full bg-neutral-200 mb-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
