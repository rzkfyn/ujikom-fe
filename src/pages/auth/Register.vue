<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();
const name = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const date_of_birth = ref('');
const gender = ref('');
const handleFormSubmit = async (ev) => {
  ev.preventDefault();
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
    console.log(e.response);
  }

}
</script>

<template>
  <div class="flex justify-between min-h-screen items-center w-full px-3">
    <div class="w-6/12 p-4 rounded-md shadow">
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
          <div class="flex mb-4 justify-between">
            <div class="w-[48%]">
              <label for="username" class="mb-[2px] block text-neutral-600 font-semibold">Username</label>
              <input type="text" name="username" id="username" placeholder="username" v-model="username"
              class="w-full rounded focus:outline-none border border-neutral-300 text-sm px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-40"
              >
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
            <input type="date" name="date_of_birth" id="date_of_birth" v-model="date_of_birth"
            class="w-full rounded focus:outline-none border border-neutral-300 text-sm px-2 py-1 text-neutral-500 focus:ring-1 focus:ring-indigo-400"
            >
          </div>
          <div class="mb-4">
            <label for="gender" class="mb-[2px] block text-neutral-600 font-semibold">Gender</label>
            <div class="flex justify-between text-neutral-500 mt-1">
              <div class="flex items-center">
                <input type="radio" name="gender" id="male" value="MALE">
                <label for="male" class="cursor-pointer text-[.8em] block ml-1 font-semibold">Male</label>
              </div>
              <div class="flex items-center">
                <input type="radio" name="gender" id="female" value="FEMALE">
                <label for="female" class="cursor-pointer text-[.8em] block ml-1 font-semibold">Female</label>
              </div>
              <div class="flex items-center">
                <input type="radio" name="gender" id="pnts" values="">
                <label for="pnts" class="cursor-pointer text-[.8em] block ml-1 font-semibold">Prefer not to say</label>
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
          <div class="mb-4">
            <button 
            class="w-full rounded text-sm text-center py-2 font-semibold text-neutral-100 bg-indigo-400"
            >Sign Up</button>
            <p class="text-center text-[.75em] mt-2 text-neutral-500">
              Already have an account? <RouterLink :to="{ name: 'Login' }" class="text-indigo-500">Sign In</RouterLink>
            </p>
          </div>
        </form>
      </div>
    </div>
    <div class="w-7/12">
      <h3 class="text-3xl text-center">There will be something here</h3>
    </div>
  </div>
</template>