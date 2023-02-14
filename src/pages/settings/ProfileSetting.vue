<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import UpdateProfileImageModal from '@/components/profile/modal/UpdateProfileImageModal';
import UpdateCoverImageModal from '@/components/profile/modal/UpdateCoverImageModal';
import FloatingMessage from '@/components/FloatingMessage';

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
const showChangesWarn = ref(false);
const toggleShowUpdateCoverImageModal = () => showUpdateCoverImageModal.value = !showUpdateCoverImageModal.value;
const toggleShowUpdateProfileImageModal = () => showUpdateProfileImageModal.value = !showUpdateProfileImageModal.value;
const showFloatingMessage = ref(false);
const floatingMessageType = ref('');
const floatingMessage = ref('');
const triggerFloatingMessage = (message, type) => {
  setTimeout(() => {
    floatingMessage.value = message;
    floatingMessageType.value = type;
    showFloatingMessage.value = true;
  
    setTimeout(() => {
      showFloatingMessage.value = false;
    }, 1300);
  }, 300);
};
const profileImageUpdateFinishedHandler = async () => {
  showUpdateProfileImageModal.value = false;
  await store.dispatch('getCurrentUser');
};
const coverImageUpdateFinishedHandler = async () => {
  showUpdateCoverImageModal.value = false;
  await store.dispatch('getCurrentUser');
};
const updateProfile = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.put(`${store.state.apiBaseURL}/v1/users/profile`, {
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
    triggerFloatingMessage(e.response.data.message, 'error');
    return showChangesWarn.value = false;
  }

  if (response.status === 200) {
    triggerFloatingMessage('Profile updated successfully', 'success');
    await store.dispatch('getCurrentUser');
    showChangesWarn.value = false;
  };
};
const checkIsDataChanges = () => {
  let result = false;

  if ((name.value?.trim() === '' ? null : name.value) !== store.state.currentUser.name) result = true;
  if ((location.value?.trim() === '' ? null : location.value) !== store.state.currentUser.profile.location) result = true;
  if ((url.value?.trim() === '' ? null : url.value) !== store.state.currentUser.profile.url) result = true;
  if ((bio.value?.trim() === '' ? null : bio.value) !== store.state.currentUser.profile.bio) result = true;
  const birthDate = new Date(store.state.currentUser.profile.date_of_birth);
  if (dateOfBirth.value !== `${birthDate.getFullYear()}-${birthDate.getMonth() + 1}-${birthDate.getDate()}`) result = true;

  return result;
};
const resetValue = () => {
  name.value = store.state.currentUser.name;
  location.value = store.state.currentUser.profile.location;
  url.value = store.state.currentUser.profile.url;
  bio.value = store.state.currentUser.profile.bio;
  const birthDate = new Date(store.state.currentUser.profile.date_of_birth);
  dateOfBirth.value = `${birthDate.getFullYear()}-${birthDate.getMonth() + 1}-${birthDate.getDate()}`;
};
onMounted(async () => {  
  try {
    await store.dispatch('getAccessToken');
    if (!store.state.currentUser.username) await store.dispatch('getCurrentUser');
  } catch(_) {
    return router.push({ name: 'Login' });
  }

  name.value = store.state.currentUser.name;
  location.value = store.state.currentUser.profile.location;
  url.value = store.state.currentUser.profile.url;
  bio.value = store.state.currentUser.profile.bio;
  const birthDate = new Date(store.state.currentUser.profile.date_of_birth);
  dateOfBirth.value = `${birthDate.getFullYear()}-${birthDate.getMonth() + 1}-${birthDate.getDate()}`;
  isDataReady.value = true;
});
watch(() => [name.value, location.value, url.value, bio.value, dateOfBirth.value], () => {
  if (checkIsDataChanges()) {
    showChangesWarn.value = true;
  } else {
    showChangesWarn.value = false;
  }
});
</script>

<template>
  <div class="relative">
    <div class="text-xl text-neutral-600 font-semibold">
      <p>Your Profile</p>
    </div>
    <span class="block w-full rounded-full h-[1px] bg-neutral-200 mt-2 mb-3"></span>
    <div :class="`flex justify-between mt-5  ${showChangesWarn ? 'pb-16' : ''}`">
      <div class="w-7/12 pr-8" v-if="isDataReady">
        <form>
          <div class="mb-4">
            <label for="name" class="text-neutral-600 font-semibold block">Name</label>
            <input type="text" name="name" id="name" v-model="name"
              class="w-full rounded focus:outline-none border px-2 py-[2px] mt-1 text-neutral-600"
            >
          </div>
          <div class="mb-4">
            <label for="location" class="text-neutral-600 font-semibold block">Location</label>
            <input type="text" name="location" id="location" v-model="location"
              class="w-full rounded focus:outline-none border px-2 py-[2px] mt-1 text-neutral-600"
            >
          </div>
          <div class="mb-4">
            <label for="url" class="text-neutral-600 font-semibold block">Url</label>
            <input type="text" name="url" id="url" v-model="url" placeholder="example.com"
              class="w-full rounded focus:outline-none border px-2 py-[2px] mt-1 text-neutral-600 placeholder:text-neutral-300"
            >
          </div>
          <div class="mb-4">
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
            <div class="mt-1 w-full">
              <div class="pl-2 mb-1">
                <div class="flex items-baseline">
                  <input type="checkbox" name="" id="" class="block pt-3">
                  <div class="ml-2">
                    <label class="text-neutral-600 font-semibold">Display your date of birth</label>
                    <span class="text-neutral-400 text-[.8em] block">Other users can see your date of birth.</span>
                  </div>
                </div>
              </div>
              <div class="pl-2 mb-2">
                <div class="w-full">
                  <div class="ml-1">
                    <label class="text-neutral-600 font-semibold">Select who can see your date of birth</label>
                    <select name="" id=""
                      class="w-full rounded focus:outline-none border px-2 py-[2px] mt-1 text-neutral-600 placeholder:text-neutral-300"
                    >
                      <option value="" class="rounded-none">Year, Month, and Day</option>
                      <option value="" class="rounded-none">Month and Day Only</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="pl-2">
                <div class="w-full">
                  <div class="ml-1">
                    <label class="text-neutral-600 font-semibold">Select what to show</label>
                    <select name="" id=""
                      class="w-full rounded focus:outline-none border px-2 py-[2px] mt-1 text-neutral-600 placeholder:text-neutral-300"
                    >
                      <option value="" class="rounded-none">People you follow each other</option>
                      <option value="" class="rounded-none">People you follow only</option>
                      <option value="" class="rounded-none">People who follow you only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="w-5/12" v-if="isDataReady">
        <div class="text-neutral-600 font-semibold mb-3">
          <p class="mb-2">Profile image</p>
          <div class="group w-48 h-48 rounded-full overflow-hidden border border-neutral-300 relative cursor-pointer" @click="toggleShowUpdateProfileImageModal">
            <img :src="`${store.state.apiBaseURL}/media/images/profile_images/${store.state.currentUser.profile?.profile_media?.find(({ context }) => context === 'PROFILE_IMAGE').file_name ?? 'default.png'}`" alt="profile image"
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
            <img :src="`${store.state.apiBaseURL}/media/images/cover_images/${store.state.currentUser.profile?.profile_media?.find(({ context }) => context === 'COVER_IMAGE').file_name ?? 'default.png'}`" alt="profile image"
              class="w-full object-cover h-full object-center"
            >
            <div class="absolute transition-all top-0 right-0 left-0 bottom-0 bg-transparent group-hover:bg-neutral-600/30 flex items-center justify-center">
              <i class="bi bi-pencil text-neutral-200 text-3xl hidden group-hover:block"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div 
      :class="`transition-all origin-bottom sticky duration-300 flex right-10 left-10 justify-between items-center bg-white rounded border border-neutral-300 py-4 px-5 shadow z-20 bottom-20 ${showChangesWarn ? 'translate-y-8 opacity-100' : 'translate-y-10 opacity-0'}`"
    >
      <div>
        <h4 class="text-neutral-600 font-semibold text-md">Careful, you have unsaved changes!</h4>
      </div>
      <div class="flex items-center">
        <div>
          <button @click="resetValue"
            class="text-red-400 border border-red-300 px-3 py-1 rounded-lg"
          >Reset</button>
        </div>
        <div class="ml-5">
          <button @click="updateProfile"
            class="bg-green-500 px-3 py-1 rounded-md text-white"
          >Save Changes</button>
        </div>
      </div>
    </div>
    <FloatingMessage 
      :visible="showFloatingMessage" 
      :message="floatingMessage" 
      :type="floatingMessageType"
    />
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