<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

const router = useRouter();
const store = useStore();
const name = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const date_of_birth = ref('');
const gender = ref(null);
const errorMessage = ref(null);
const usernameValidationMessage = ref('');
const isUsernameError = ref(false);
const load = ref(false);
const handleFormSubmit = async (ev) => {
  ev.preventDefault();
  load.value = true;

  let response;
  try {
    response = await axios.post(`${store.state.apiBaseURL}/v1/auth/register`, {
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
      date_of_birth: date_of_birth.value,
      gender: gender.value
    },{
      withCredentials: true
    });
  } catch(e) {
    if (e.response) {
      const { data } = e.response;
      const { message } = data;
      errorMessage.value = message;
    } else {
      errorMessage.value = 'Something went wrong ;_;. Please try again later.'
    }

    load.value = false;
  }

  if (response.status === 201) return router.push('/verifyemail');
}

watch(username, async (value) => {
  if (!value) {
    isUsernameError.value = false;
    usernameValidationMessage.value = '';
    return;
  }

  if (value.length < 3) {
    isUsernameError.value = true;
    usernameValidationMessage.value = 'username is too short!';
    return;
  }

  let response;
  try {
    response = await axios.post(`${store.state.apiBaseURL}/v1/users/username`, {
      username: username.value
    });
  } catch(e) {
    isUsernameError.value = true;
    usernameValidationMessage.value = 'something went wrong';
    return;
  }

  const { data } = response;
  isUsernameError.value = !data.isAvailable;
  usernameValidationMessage.value = data.isAvailable ? 'username is available' : 'username isn\'t available';
});
</script>

<template>
  <div class="flex justify-between min-h-screen items-center w-full px-4">
    <div class="w-6/12 px-3 rounded-md shadow bg-white py-7">
      <div class="text-center">
        <h3 class="text-xl font-semibold text-neutral-600 mb-1">
          Create New Account
        </h3>
        <p class="text-[.85em] text-neutral-400">Fill the details below to create new account</p>
      </div>
      <div class="mt-3 w-8/12 mx-auto">
        <form @submit="handleFormSubmit">
          <div class="mb-3">
            <label for="name" class="mb-[2px] block text-neutral-600 font-semibold">Name</label>
            <input type="text" name="name" id="name" placeholder="Your full name" v-model="name"
              class="w-full rounded focus:outline-none border border-neutral-300 text-sm px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-400"
            >
          </div>
          <div class="flex mb-5 justify-between">
            <div class="w-[48%]">
              <label for="username" class="mb-[2px] block text-neutral-600 font-semibold">Username</label>
              <input type="text" name="username" id="username" placeholder="username" v-model="username" autocomplete="off"
                class="w-full rounded focus:outline-none border border-neutral-300 text-sm px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-40"
              >
              <span :class="`text-[.7em] block absolute ${isUsernameError ? 'text-red-700' : 'text-green-700'}`">{{ usernameValidationMessage }}</span>
            </div>
            <div class="w-[48%]">
              <label for="email" class="mb-[2px] block text-neutral-600 font-semibold">Email</label>
              <input type="email" name="email" id="email" placeholder="Enter your email" v-model="email"
                class="w-full rounded focus:outline-none border border-neutral-300 text-sm px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-400"
              >
            </div>
          </div>
          <div class="mb-4">
            <label for="date_of_birth" class="mb-[2px] block text-neutral-600 font-semibold">Date of birth</label>
            <input type="date" name="date_of_birth" id="date_of_birth" v-model="date_of_birth" max="2011-12-31"
              class="w-full rounded focus:outline-none border border-neutral-300 text-sm px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-400"
            >
          </div>
          <div class="mb-4">
            <label for="gender" class="mb-[2px] block text-neutral-600 font-semibold">Gender</label>
            <div class="flex justify-start text-neutral-500 mt-1">
              <div class="flex items-center">
                <input type="radio" name="gender" id="male" value="MALE" v-model="gender">
                <label for="male" class="cursor-pointer text-[.8em] block ml-1 font-semibold">Male</label>
              </div>
              <div class="flex items-center ml-5">
                <input type="radio" name="gender" id="female" value="FEMALE" v-model="gender">
                <label for="female" class="cursor-pointer text-[.8em] block ml-1 font-semibold">Female</label>
              </div>
            </div>
          </div>
          <div class="mb-4">
            <label for="password" class="mb-[2px] block text-neutral-600 font-semibold">Password</label>
            <input type="password" name="password" id="password" placeholder="New password" v-model="password"
            class="w-full rounded focus:outline-none border border-neutral-300 text-sm px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-400"
            >
          </div>
          <div class="mb-6">
            <label for="password_confirmation" class="mb-[2px] block text-neutral-600 font-semibold">Confirm Password</label>
            <input type="password" name="password_confirmation" id="password_confirmation" placeholder="Confirm your password" v-model="password_confirmation"
            class="w-full rounded focus:outline-none border border-neutral-300 text-sm px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-400"
            >
          </div>
          <div v-if="errorMessage" class="text-center text-red-500 text-[.8em] mb-2">
            {{ errorMessage }}
          </div>
          <div class="mb-4">
            <button 
              class="w-full flex justify-center rounded text-sm text-center py-2 font-semibold text-neutral-100 transition-all bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-700"
            >
            <svg :class="`${load ? 'block' : 'hidden'} animate-spin mr-3 h-5 w-5 text-white`" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Sign Up</span>
            </button>
            <p class="text-center text-[.75em] mt-2 text-neutral-500">
              Already have an account? <RouterLink :to="{ name: 'Login' }" class="text-indigo-500">Sign In</RouterLink>
            </p>
          </div>
        </form>
      </div>
    </div>
    <div class="w-7/12 flex items-center justify-center">
      <div>
        <h3 class="text-3xl font-bold">App Name</h3>
        <p class="text-lg">
          Create your account to start 
        </p>
      </div>
    </div>
  </div>
</template>