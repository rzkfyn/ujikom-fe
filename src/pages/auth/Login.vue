<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const uid = ref('');
const password = ref('');
const errormsg = ref(null);
const handleFormSubmit = async (ev) => {
  ev.preventDefault();

  let response;
  try {
    response = await axios.post(`${store.state.apiBaseURL}/v1/auth/login`, {
      uid: uid.value, password: password.value
    },{
      withCredentials: true
    });
  } catch(e) {
    const { data } = e.response;
    return errormsg.value = data.message;
  }
  const { data } = response;
  const { access_token } = data.data;

  store.commit('setLoginState', access_token);
  store.commit('setAccessToken', true);

  return router.push({ name: 'Home' });
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="p-6 max-w-sm rounded-md shadow">
      <div class="text-center">
        <h3 class="text-2xl font-semibold text-neutral-600">Sign In</h3>
        <p class="text-[.75em] text-neutral-400 mt-1">Welcome back! Fill the details below to sign in to your account</p>
      </div>
      <div class="mt-6">
        <form @submit="handleFormSubmit">
          <div class="mb-3">
            <label for="name" class="mb-[2px] block text-neutral-600 font-semibold">Username or email</label>
            <input type="text" name="name" id="name" placeholder="Enter your username or email" v-model="uid"
            class="w-full rounded focus:outline-none border border-neutral-300 text-sm px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-400"
            >
          </div>
          <div class="mb-[2px]">
            <label for="password" class="mb-[2px] block text-neutral-600 font-semibold">Password</label>
            <input type="password" name="password" id="password" placeholder="New password" v-model="password"
            class="w-full rounded focus:outline-none border border-neutral-300 text-sm px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-400"
            >
          </div>
          <div class="mb-6 flex justify-end">
            <RouterLink to="/" class="text-[.7em] text-indigo-400">forgot password</RouterLink>
          </div>
          <div class="mb-4">
            <p class="text-[.8em] text-center text-red-400 my-2" v-if="errormsg">{{ errormsg }}</p>
            <button 
            class="w-full rounded text-sm text-center py-2 font-semibold text-neutral-100 bg-indigo-400"
            >Sign In</button>
            <p class="text-center text-[.75em] mt-2 text-neutral-500">
              Don't have an account? <RouterLink :to="{ name: 'Register' }" class="text-indigo-500">Sign Up</RouterLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>