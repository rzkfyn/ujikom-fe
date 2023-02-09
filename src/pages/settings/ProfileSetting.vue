<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import UpdateProfileImageModal from '@/components/profile/modal/UpdateProfileImageModal';
import UpdateCoverImageModal from '@/components/profile/modal/UpdateCoverImageModal';

const route = useRoute();
const router = useRouter();
const store = useStore();
const isDataReady = ref(false);
const showUpdateProfileImageModal = ref(false);
const showUpdateCoverImageModal = ref(false);
const name = ref(null);
const location = ref(null);
const url = ref(null);
const bio = ref(null);
const dateOfBirth = ref('');
const toggleShowUpdateCoverImageModal = () => showUpdateCoverImageModal.value = !showUpdateCoverImageModal.value;
const toggleShowUpdateProfileImageModal = () => showUpdateProfileImageModal.value = !showUpdateProfileImageModal.value;
const profileImageUpdateFinishedHandler = async () => {
  showUpdateProfileImageModal.value = false;
  await store.dispatch('getCurrentUser');
};
const coverImageUpdateFinishedHandler = async () => {
  showUpdateCoverImageModal.value = false;
  await store.dispatch('getCurrentUser');
};
const formSubmitHandler = async (ev) => {
  ev.preventDefault();

  try {
    await store.state.axiosInstance.put(`${store.state.apiBaseURL}/v1/users/profile`, {
      name: name.value,
      location: location.value,
      url: url.value,
      bio: bio.value,
      date_of_birth: dateOfBirth.value
    }, {
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    return console.log(e);
  }

  await store.dispatch('getCurrentUser');
};

onMounted(async () => {
  try {
    await store.dispatch('getAccessToken');
    await store.dispatch('getCurrentUser');
  } catch(_) {
    return router.push({ name: 'Login' });
  }

  name.value = store.state.currentUser.name;
  location.value = store.state.currentUser.profile.location;
  url.value = store.state.currentUser.profile.url;
  bio.value = store.state.currentUser.profile.bio;
  const birthDate = new Date(store.state.currentUser.profile.date_of_birth);
  dateOfBirth.value = `${birthDate.getFullYear()}-${birthDate.getMonth() + 1}-${birthDate.getDate()}`;
});
</script>

<template>
  <div>
    <div class="text-xl text-neutral-600 font-semibold">
      <p>Your Profile</p>
    </div>
    <span class="block w-full rounded-full h-[1px] bg-neutral-200 mt-2 mb-3"></span>
    <div class="flex justify-between">
      <div class="w-7/12 pr-8">
        <form @submit="formSubmitHandler">
          <div class="mb-3">
            <label for="name" class="text-neutral-600 font-semibold block">Name</label>
            <input type="text" name="name" id="name" v-model="name"
              class="w-full rounded focus:outline-none border px-2 py-[2px] mt-1 text-neutral-600"
            >
          </div>
          <div class="mb-3">
            <label for="location" class="text-neutral-600 font-semibold block">Location</label>
            <input type="text" name="location" id="location" v-model="location"
              class="w-full rounded focus:outline-none border px-2 py-[2px] mt-1 text-neutral-600"
            >
          </div>
          <div class="mb-3">
            <label for="url" class="text-neutral-600 font-semibold block">Url</label>
            <input type="text" name="url" id="url" v-model="url"
              class="w-full rounded focus:outline-none border px-2 py-[2px] mt-1 text-neutral-600 placeholder:text-neutral-300"
            >
          </div>
          <div class="mb-3">
            <label for="name" class="text-neutral-600 font-semibold block">Bio</label>
            <textarea type="text" name="name" id="name" v-model="bio" rows="5" spellcheck="false"
              class="w-full rounded focus:outline-none border px-2 py-[2px] mt-1 text-neutral-600 resize-none"
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="dateOfBirth" class="text-neutral-600 font-semibold block">Date of Birth<span class="text-red-600">*</span></label>
            <input type="date" name="dateOfBirth" id="dateOfBirth" v-model="dateOfBirth" required
              class="w-full rounded focus:outline-none border px-2 py-[2px] mt-1 text-neutral-600 placeholder:text-neutral-300"
            >
            <div class="mt-1">
              <div class="pl-2 mb-1">
                <div class="flex items-baseline">
                  <input type="checkbox" name="" id="" class="block pt-3">
                  <div class="ml-1">
                    <label class="text-neutral-600 font-semibold">Display your date of birth</label>
                    <span class="text-neutral-400 text-[.8em] block">Other users can see your date of birth.</span>
                  </div>
                </div>
              </div>
              <div class="pl-2 mb-1">
                <div class="flex items-baseline">
                  <input type="checkbox" name="" id="" class="block pt-3">
                  <div class="ml-1">
                    <label class="text-neutral-400 font-semibold">Only display month and date</label>
                    <span class="text-neutral-400 text-[.8em] block">Only month and date of your date of birth will be displayed.</span>
                  </div>
                </div>
              </div>
              <div class="pl-2">
                <div class="flex items-baseline">
                  <input type="checkbox" name="" id="" class="block pt-3">
                  <div class="ml-1">
                    <label class="text-neutral-400 font-semibold">Only display to your follower</label>
                    <span class="text-neutral-400 text-[.8em] block">Your date of birth will only be displayed to your follower.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <button type="submit"
              class="px-3 py-2 rounded-md bg-indigo-500 text-neutral-100 font-semibold"
            >Update Your Profile</button>
          </div>
        </form>
      </div>
      <div class="w-5/12">
        <div class="text-neutral-600 font-semibold mb-3">
          <p class="mb-2">Profile image</p>
          <div class="group w-48 h-48 rounded-full overflow-hidden border border-neutral-300 relative cursor-pointer" @click="toggleShowUpdateProfileImageModal">
            <img :src="`${store.state.apiBaseURL}/media/images/profile_images/${store.state.currentUser.profile?.profile_media?.profile_image?.file_name}`" alt="profile image"
              class="w-full h-full object-cover object-center"
            >
            <div class="absolute transition-all top-0 right-0 left-0 bottom-0 bg-transparent group-hover:bg-neutral-600/30 flex items-center justify-center">
              <i class="bi bi-pencil text-neutral-200 text-3xl hidden group-hover:block"></i>
            </div>
          </div>
        </div>
        <div class="text-neutral-600 font-semibold">
          <p class="mb-2">Cover image</p>
          <div class="group relative w-full rounded overflow-hidden h-48 border border-neutral-300 cursor-pointer" @click="toggleShowUpdateCoverImageModal">
            <img :src="`${store.state.apiBaseURL}/media/images/cover_images/${store.state.currentUser.profile?.profile_media?.cover_image?.file_name}`" alt="profile image"
              class="w-full object-cover h-full object-center"
            >
            <div class="absolute transition-all top-0 right-0 left-0 bottom-0 bg-transparent group-hover:bg-neutral-600/30 flex items-center justify-center">
              <i class="bi bi-pencil text-neutral-200 text-3xl hidden group-hover:block"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UpdateProfileImageModal
      :visible="showUpdateProfileImageModal"
      @cancelbtn:click="toggleShowUpdateProfileImageModal"
      @profileimageupdate:finished="profileImageUpdateFinishedHandler"
    />
    <UpdateCoverImageModal
      :visible="showUpdateCoverImageModal" 
      @cancelbtn:click="toggleShowUpdateCoverImageModal" 
      @coverimageupdate:finished="coverImageUpdateFinishedHandler"
    />
  </div>
</template>