<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import getCaretCoordinates from 'textarea-caret';
import Post from '@/components/Post';
import Following from '@/components/main/FollowingTimeLine';

const store = useStore();
const router = useRouter();
const onPage = ref('forYou');
const postText = ref('');
const posts = ref([]);
const rows = ref(2);
const postMedia = ref([]);
const files = ref([]);
const getRandomPosts = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/posts`, {
      headers: {  
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    })
  } catch(e) {
    return console.log(e);
  }

  const { data } = response.data;
  posts.value.push(...data);
};
const createNewPost = async () => {
  if (!postText.value && !files.value[0]) return;

  const formData = new FormData();
  formData.append('text', postText.value);
  for (const uploadedFile of files.value) {
    formData.append('media', uploadedFile);
  }

  try {
    const response = await store.state.axiosInstance.post(`${store.state.apiBaseURL}/v1/posts`, formData ,{
      headers: {
        'Authorization': `Bearer ${store.state.accessToken.token}`
      }
    });
    console.log(response);
    const currentDate = + new Date();
    console.log(store.state.accessToken.exp >= currentDate);
  } catch(_) { 
    console.log(_);
  }
  postText.value = '';
  postMedia.value = [];
  files.value = [];
};
const postMediaInputHandler = (ev) => {
  files.value.push(...ev.target.files);

  let results = [];
  for(const file of ev.target.files) {
    const url = URL.createObjectURL(file);
    results.push(url);
  }
  postMedia.value.push(...results);
};
const deleteImage = (index) => {
  postMedia.value.splice(index, 1);
  files.value.splice(index, 1);
};
const toggleOnPageTo = (to) => onPage.value = to;

watch(postText, (val) => {
  rows.value = 2 + (val.split('\n').length - 1);
});

onMounted(async () => {
  document.querySelector('title').innerText = 'Home';

  try {
    await getRandomPosts();
  } catch(_) {}

  document.addEventListener('scroll', () => {
    const maxScrollY = document.body.offsetHeight - window.innerHeight;

    if ((maxScrollY - 200) < scrollY) posts.value.push(...posts.value);
  });  

  document.getElementById('post-input').addEventListener('input', function(ev) {
    var caret = getCaretCoordinates(this, this.selectionEnd);
    console.log('(top, left, height) = (%s, %s, %s)', caret.top, caret.left, caret.height);

    console.log(showUser(ev.target.value));
  });
});

const showUser = (text) => {
  if (text.startsWith('@')) {
    if (text.split('@')[text.split('@').length - 1].match(' ')) return false;
    return text.split('@')[text.split('@').length - 1];
  }
  if (text.split('@').length === 2) return false;
  if (text.split('@')[text.split('@').length - 1].match(' ')) return false;

  return text.split('@')[text.split('@').length - 1];
}
</script>

<template>
  <div>
    <div v-if="store.state.login" class="px-3 shadow py-3 rounded sticky top-14 bg-white/80 z-20  ">
      <ul class="flex justify-between font-semibold text-neutral-600">
        <li @click="toggleOnPageTo('forYou')"
          :class="`flex flex-col items-center text-center flex-1 cursor-pointer ${onPage === 'forYou' ? 'text-neutral-500' : ''}`"
        >
          <p>For You</p>
          <span 
            :class="`block w-12 h-[2px] rounded-full bg-neutral-400 -m-1 ${onPage === 'forYou' ? 'scale-100' : 'scale-0'} transition-all`"
          ></span>
        </li>
        <li @click="toggleOnPageTo('following')"
          :class="`flex flex-col items-center text-center flex-1 cursor-pointer ${onPage === 'following' ? 'text-neutral-500' : ''}`"
        >
          <p>Following</p>
          <span 
            :class="`block w-12 h-[2px] rounded-full bg-neutral-400 -m-1 ${onPage === 'following' ? 'scale-100' : 'scale-0'} transition-all`"
          ></span>
        </li>
      </ul>
    </div>
    <div v-if="store.state.login" class="border-b border-neutral-200 pb-3">
      <div class="flex items-center px-3 pt-2 w-full">
        <div class="group self-start w-14 h-14 rounded-full overflow-hidden cursor-pointer relative" @click="router.push(`/${store.state.currentUser.username}`)">
          <img alt="profile" :title="store.state.currentUser.username"
            :src="`${store.state.apiBaseURL}/media/images/profile_images/${store.state.currentUser?.profile?.profile_media.find(({ context }) => context === 'PROFILE_IMAGE').file_name ?? 'default.png'}`"  
            class="place-items-center w-full cursor-pointer object-cover h-full object-center"
          >
        </div>
        <div class="ml-2 w-10/12">
          <textarea id="post-input" :rows="rows" @keypress="textAreaKeyPresshandler"
            type="text" v-model="postText" placeholder="Post something..."
            class="px-3 py-2 focus:outline-none text-neutral text-neutral-500 w-full resize-none h-fit text-lg"
          ></textarea>
          <div class="flex w-full flex-wrap justify-between" v-if="postMedia[0]">
            <div v-for="media, i in postMedia" :key="i" :class="`${postMedia.length === 1 ? 'w-full h-full max-h-[550px]' : 'h-[250px] w-[48%]'} rounded-lg border border-neutral-200 overflow-hidden mb-3 relative`">
              <div class="absolute top-2 left-2 w-6 h-6 bg-neutral-500/60 flex items-center justify-center rounded-full text-neutral-100 cursor-pointer" @click="deleteImage(i)">
                X
              </div>
              <img :src="media" alt="img" class="h-full w-full object-fill object-center">
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-between w-full px-5 items-center">
        <div class="flex ml-16 items-center text-indigo-400/90">
          <div>
            <label for="images" class="cursor-pointer transition-all hover:text-indigo-800/80">
              <i class="bi bi-image"></i>
            </label>
            <input type="file" name="images" id="images" class="hidden" accept="image/*" @input="postMediaInputHandler" multiple>
          </div>
          <div class="ml-4">
            <i class="bi bi-play-btn text-lg"></i>
          </div>
        </div>
        <button @click="createNewPost()"
          :class="`${postText || files[0] ? 'bg-indigo-400/90 hover:bg-indigo-400/80 active:bg-indigo-200/80' : 'bg-neutral-300'} text-sm px-4 py-1 font-semibold text-neutral-100 rounded-full`"
        >Post</button>
      </div>
    </div>
    <div v-if="!store.state.login" class="sticky top-[48px] z-10">
      <div class="py-1 px-3 bg-neutral-100/40">
        <input type="text" name="" id="" placeholder="Explore appname"
          class="w-full rounded-full py-[6px] px-3 pl-10 border border-neutral-300 focus:outline-none"
        >
        <div class="absolute left-7 top-[11px]">
          <i class="bi bi-search text-neutral-500"></i>
        </div>
      </div>
    </div>
    <div v-if="onPage === 'forYou'">
      <div v-if="posts[0]" class="bg-white">
        <Post v-for="post, i in posts" :key="i" :post="post"/>
      </div>
    </div>
    <div v-else>
      <Following />
    </div>
  </div>
</template>