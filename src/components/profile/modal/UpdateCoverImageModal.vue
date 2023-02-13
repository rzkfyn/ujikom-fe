<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const store = useStore();
const axiosInstance = axios.create();
const coverImage = ref('');
const newCoverImage = ref('');
const files = ref([]);
const emit = defineEmits(['cancelbtn:click', 'coverimageupdate:finished']);
const hideModal = () => {
  emit('cancelbtn:click');
};
const coverImageInputHandler = (ev) => {
  files.value = ev.target.files;
  const [ file ] = ev.target.files;
  if (!file) return;
  const url = URL.createObjectURL(file);
  coverImage.value = url;
  newCoverImage.value = file.name;
};
const formSubmitHandler = async (ev) => {
  ev.preventDefault();
  const formData = new FormData();
  const [ file ] = files.value;

  formData.append('cover_image', file);
  let response;
  try {
    response = await axiosInstance.put(`${store.state.apiBaseURL}/v1/users/profile/cover-image`, formData, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
  } catch(e) { }

  if (response.status === 200) emit('coverimageupdate:finished');
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
  try {
    await store.dispatch('getAccessToken');
    await store.dispatch('getCurrentUser');
  } catch(_) { }

  coverImage.value = `${store.state.apiBaseURL}/media/images/cover_images/${store.state.currentUser.profile.profile_media.find(({ context }) => context === 'COVER_IMAGE').file_name ?? 'default.png'}`;
});
</script>

<template>
  <div class="flex justify-center items-center fixed right-0 left-0 bottom-0 top-0 bg-neutral-800/40 z-50" v-if="visible">
    <div class="bg-white p-4 rounded shadow w-6/12 min-w-[250px]">
      <div>
        <h4 class="text-neutral-700 font-semibold">Change Your Profile's Cover Image</h4>
      </div>
      <div class="mx-auto w-10/12 h-48 rounded-lg shadow mt-3 overflow-hidden bg-cover bg-no-repeat">
        <img :src="coverImage" alt="cover image" class="w-full h-full object-cover object-center">
      </div>
      <form @submit="formSubmitHandler">
        <div class="text-center mt-4">
          <label for="cover_image" class="cursor-pointer hover:bg-neutral-300 transition-all block rounded  text-neutral-500 py-1 text-sm font-semibold w-full bg-neutral-200 mb-1 ">
            Upload image
          </label>
          <input type="file" name="cover_image" id="cover_image" class="hidden" accept="image/*" @input="coverImageInputHandler">
        </div>
        <span class="block bg-neutral-400 w-full h-[2px] rounded-full mt-1 mb-3"></span> 
        <div class="text-center">
          <button :class="`${newCoverImage ? 'bg-indigo-500 text-neutral-100 hover:bg-indigo-600 hover:text-neutral-200' : 'bg-indigo-200' } block rounded text-neutral-400 py-1 text-sm font-semibold w-full mb-1`" type="submit">Confirm</button>
          <button @click="hideModal" class="block hover:bg-neutral-300 transition-all rounded text-neutral-500 py-1 text-sm font-semibold w-full bg-neutral-200 mb-1">Cancel</button>
        </div>
      </form>
    </div>
  </div> 
</template>