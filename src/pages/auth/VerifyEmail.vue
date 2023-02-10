<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const route = useRoute();
const router = useRouter();
const store = useStore();
const code = ref(null);
const emailVerified = ref(false);
const errorMessage = ref(null);
const verifyemail = async (code) => {
  let response;
  try {
    response = await store.state.axiosInstance.post(`${store.state.apiBaseURL}/v1/users/email/verify`, {
      verification_code: code
    });
  } catch(e) {
    if (e.response) {
      console.log(e.response);
      const { data } = e.response;
      return errorMessage.value = data.message;
    } else {
      return errorMessage.value = 'Something went wrong. Please ty again later ;_;';
    }
  }

  if (response.status === 200) emailVerified.value = true;
};

onMounted(async () => {
  document.getElementsByTagName('title')[0].innerText = 'Verify Your Email';
  try {
    await store.dispatch('getAccessToken');
    await store.dispatch('getCurrentUser');
    console.log('a');
  } catch(e) {
    console.log(e);
  }
  
  code.value = route.params.code;
  console.log(route.params);
  if (code.value) {
    try {
      await verifyemail(code.value);
    } catch(e) {
      console.log(e);
    }
  }

  const intervalId = setInterval(async () => {
    if (emailVerified.value) return;
    try {
      await store.dispatch('getAccessToken');
      await store.dispatch('getCurrentUser')
    } catch(_) {
      return
    }
    
    if (store.state.currentUser.email_verified_at !== null) {
      clearInterval(intervalId);
      return router.push({ name: 'Home' });
    }
  }, 3000);
});
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <div class="py-8 rounded-md bg-white border px-4 w-4/12">
      <div v-if="!emailVerified && !errorMessage">
        <div class="w-24 h-24 mx-auto">
          <img src="/images/letter.png" alt="letter.png" class="h-full w-full">
        </div>
        <div class="text-neutral-600 text-center">
          <h3 class="font-semibold my-3">Account Registered Successfully, Please Check Your Email To Verify Your Email Address.</h3>
        </div>
        <div class="text-center text-neutral-400 text-sm mt-4">
          <p>We've sent a mail to your email address. Follow the link to verify your email and activate your account.</p>
        </div>
        <div class="mt-3 text-center">
          <p class="text-sm text-indigo-400 cursor-pointer">resend email</p>
        </div>
      </div>
      <div v-else-if="errorMessage && !emailVerified">
        <div class="text-red-500 text-center">
          <i class="bi bi-x-circle text-6xl"></i>
        </div>
        <div class="text-center mt-5">
          <h3 class="text-lg font-semibold">Email Verification Failed</h3>
          <p class="text-red-400">{{ errorMessage }}</p>
        </div>
        <div v-if="errorMessage !== 'Email is already verified'" class="text-sm mt-3 text-center">
          <p>You can request a new <span class="text-sm text-indigo-400 cursor-pointer">email verification link</span></p>
        </div>
      </div>
      <div v-else>
        <div class="text-green-500 text-center">
          <i class="bi bi-check-circle text-6xl"></i>
        </div>
        <div class="text-center mt-5">
          <h3 class="text-lg font-semibold">Email Verification Success</h3>
          <p class="text-neutral-400">Thank you! You may now close this page</p>
        </div>
      </div>
    </div>
  </div>
</template>