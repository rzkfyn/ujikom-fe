<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { nanoid } from 'nanoid';
import FloatingMessage from '@/components/FloatingMessage';

const props = defineProps({
  post: {
    type: Object,
    required: true,
    defult: {}
  }
});
const emit = defineEmits([ 'post:unsave' ]);
const router = useRouter();
const store = useStore();
const refPost = ref({});
const togglerClass = ref(nanoid(20));
const likedByMe = ref(false);
const savedByMe = ref(false);
const showMenu = ref(false);
const isPostedByMe = ref(false);
const isPostDeleted = ref(false);
const postText = ref(false);
const toggleShowMenu = () => showMenu.value = !showMenu.value;
const mentionedUsers = ref([]);
const floatingMessage = ref('');
const showFloatingMessage = ref(true);
const floatingMessageType = ref('');
const triggerFloatingMessage = (message, type) => {
  floatingMessage.value = message;
  showFloatingMessage.value = true;
  floatingMessageType.value = type;
  setTimeout(() => {
    showFloatingMessage.value = false;
  }, 1300);
};
const isDataReady = ref(false);
const parseTime = (time) => {
  const postTime = + new Date(time);
  const timeDiffrence = ((+ new Date()) - postTime) / 1000;
  const days = Math.floor(timeDiffrence / 86400);
  const hours = Math.floor((timeDiffrence - days * 86400) / 3600);
  const minutes = Math.floor(((timeDiffrence - (days * 86400 + hours * 3600))) / 60);
  const seconds = Math.floor((timeDiffrence - (days * 86400 + hours * 3600 + minutes * 60)));

  if (days > 0) return days > 30 ? new Date(postTime).toDateString() : `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return seconds > 10 ? `${seconds}s` : 'just now';
};
const postFrom = ref(parseTime(refPost.value.createdAt));
const toggleLikePost = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/posts/${refPost.value.code}/${likedByMe.value ? 'unlike' : 'like'}`, {
      headers: {
        'Authorization': `Bearer: ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    return console.log(e);
  }
  
  if (response.status === 200) await refreshPost();
};
const savePost = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/posts/${refPost.value.code}/save`, {
      headers: {
        'Authorization': `Bearer: ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    return console.log(e);
  }
  
  if (response.status === 200) {
    triggerFloatingMessage('Post saved', 'success');
    await refreshPost();
  };
};
const unsavePost = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.delete(`${store.state.apiBaseURL}/v1/posts/${refPost.value.code}/save`, {
      headers: {
        'Authorization': `Bearer: ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    return console.log(e);
  }
  
  if (response.status === 200) {
    emit('post:unsave');
    triggerFloatingMessage('Post unsaved', 'success');
    await refreshPost();
  };
};
const refreshPost = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.get(`${store.state.apiBaseURL}/v1/posts/${refPost.value.code}`, {
      headers: {
        'Authorization': `Bearer: ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    return console.log(e);
  }

  const { data } = response.data;
  if (data.media[0]) {
    data.media = data.media.reverse();
  }

  refPost.value = data;
};
const deletePost = async () => {
  let response;
  try {
    response = await store.state.axiosInstance.delete(`${store.state.apiBaseURL}/v1/posts/${refPost.value.code}/delete`);
  } catch(e) {
    return console.log(e);
  }

  if (response.status === 200) isPostDeleted.value = true;
};

watch(refPost, (val) => {
  const likedByMeIndex = refPost.value.likers.findIndex((user) => user.id === store.state.currentUser.id);
  const savedByMeIndex = refPost.value.saved_by_users.findIndex((user) => user.id === store.state.currentUser.id);

  for (let i = 0; i < val.mentioned_users.length; i ++) {
    mentionedUsers.value.push({
      username: val.mentioned_users[i].username,
      key: val.mentioned_users[i].MentionedUserOnPost.key
    });
  }

  const replacedText = val.text.replace(/\r\n/g, ' <br> ');
  const arrTextPost = replacedText.split(' ');
  const result = arrTextPost.map((item) => {
    if (item.startsWith('@')) {
      const index = mentionedUsers.value.findIndex(({key}) => {
        return key === item
      });

      if (index > -1) {
        return `<span class="transition-all text-indigo-400 cursor-pointer hover:underline" data-username="${mentionedUsers.value[index].username}">${item}</span>`;
      }
    };

    return item;
  });
  postText.value = result.join(' ');

  likedByMe.value = likedByMeIndex > -1;
  savedByMe.value = savedByMeIndex > -1;
});

onMounted(() => {
  refPost.value = props.post;
  console.log(props.post, refPost.value);
  const likedByMeIndex = refPost.value.likers.findIndex((user) => user.id === store.state.currentUser.id);
  const savedByMeIndex = refPost.value.saved_by_users.findIndex((user) => user.id === store.state.currentUser.id);
  if (store.state.login) {
    isPostedByMe.value = refPost.value.user.id === store.state.currentUser.id;
  }
  document.addEventListener('click', (ev) => {
    if (ev.target.classList.contains(togglerClass.value)) return;
    showMenu.value = false
    if (ev.target.dataset?.username) return router.push({ name: 'Profile', params: { username: ev.target.dataset.username } });
  });

  likedByMe.value = likedByMeIndex > -1;
  savedByMe.value = savedByMeIndex > -1;
  isDataReady.value = true;

  setInterval(() => {
    postFrom.value = parseTime(props.post.createdAt);
  }, 1000);
});
</script>

<template>
  <div class="flex items mb-4 border-b pt-2 pb-4 px-4" v-if="!isPostDeleted && isDataReady">
    <div class="min-w-[56px] max-w-[56px] h-14 rounded-full overflow-hidden bg-cover bg-no-repeat border bg-center">
      <img 
        :src="`${store.state.apiBaseURL}/media/images/profile_images/${isPostedByMe ? store.state.currentUser.profile?.profile_media?.find((media) => media.context === 'PROFILE_IMAGE').file_name ?? 'default.png' : refPost.user?.profile?.profile_media?.find((media) => media.context === 'PROFILE_IMAGE').file_name ?? 'default.png'}`"
        alt="profile"
        class="w-full h-full object cover object center"
      >
    </div>
    <div class="flex flex-col ml-2 mt-1 w-full">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <p class="mr-1 text-neutral-800 font-semibold hover:underline cursor-pointer" @click="router.push(`/${refPost.user.username}`)">{{ refPost.user.name }}</p>
          <p class="flex text-neutral-500">
            <span>@{{ refPost.user.username }}</span>
            <span class="mx-1">•</span>
            <span>{{ postFrom }}</span>
          </p>
        </div>
        <div class="relative">
          <div :class="`flex items-center cursor-pointer group py-3 relative ${togglerClass} hover:bg-neutral-300/20 px-2 rounded-full`" @click="toggleShowMenu">
            <span class="w-1 h-1 bg-neutral-500 group-hover:bg-neutral-400 transition-all rounded-full mr-1"></span>
            <span class="w-1 h-1 bg-neutral-500 group-hover:bg-neutral-400 transition-all rounded-full mr-1"></span>
            <span class="w-1 h-1 bg-neutral-500 group-hover:bg-neutral-400 transition-all rounded-full"></span>
          </div>
          <div class="absolute left-5 border px-1 bg-white top-3 font-normal rounded py-2 z-10 min-w-[145px]" v-if="showMenu">
            <ul class="select-none text-[.95em]">
              <li @click="() => savedByMe ? unsavePost() : savePost()"
                class="group min-w-fit px-2 whitespace-nowrap transition-all hover:text-neutral-600 p-1 text-neutral-500 rounded cursor-pointer hover:bg-neutral-100"
              >
                <div v-if="savedByMe" class="flex">
                  <i class="bi bi-bookmark-check-fill group-hover:hidden"></i>
                  <i class="bi bi-bookmark-x-fill hidden text-red-400 group-hover:block"></i>
                  <span class="ml-2 group-hover:hidden">Saved</span>
                  <span class="ml-2 hidden group-hover:block text-red-400">Unsave Post</span>
                </div>
                <div v-else class="flex">
                  <i class="bi bi-bookmark"></i>
                  <span class="ml-2">Save Post</span>
                </div>
              </li>
              <li @click="deletePost"
                class="min-w-fit flex px-2 transition-all whitespace-nowrap hover:text-red-500 p-1 rounded cursor-pointer hover:bg-neutral-100 text-red-600" v-if="isPostedByMe">
                <i class="bi bi-trash"></i>
                <span class="ml-2">Delete Post</span>
              </li>
              <li class="transition-all px-2 whitespace-nowrap hover:text-neutral-600 p-1 text-neutral-500 rounded cursor-pointer hover:bg-neutral-100 mb-1 flex">
                <i class="bi bi-flag"></i>
                <span class="block ml-2">Report Post</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="text-neutral-700 whitespace-pre-line" v-html="postText">
      </div>
      <div v-if="refPost.media[0]" class="mt-1">
        <div v-if="refPost.media.length > 1" class="flex w-full rounded-xl overflow-hidden border border-neutral-300">
          <div v-for="postMedia, i in refPost.media" :key="i" class="w-full">
            <div
              :class="`flex-1 h-[250px] bg-cover ${i === 0 ? 'border-indigo-600/70 border-r-2' : ''}`"
            >
              <img :src="`${store.state.apiBaseURL}/media/images/posts/${postMedia.file_name}`" :alt="postMedia.file_name"
                class="border border-neutral-200 w-full h-full object-cover"
              >
            </div>
          </div>
        </div>
        <div v-else class="mt-1">
          <div v-for="postMedia, i in refPost.media" :key="i" class="rounded-xl overflow-hidden max-h-[500px]">
            <img :src="`${store.state.apiBaseURL}/media/images/posts/${postMedia.file_name}`" :alt="postMedia.file_name"
              class="rounded-xl border border-neutral-300 max-h-[500px] object-contain object-center"
            >
          </div>
        </div>
      </div>
      <div class="flex mt-2 text-sm">
        <div :class="`${ likedByMe ? 'text-red-500' : 'text-neutral-500'} cursor-pointer flex justify-start items-center mr-8 transition-all hover:text-red-500`">
          <div @click="toggleLikePost" class="pt-[2px]">
            <i class="bi bi-heart text-lg" v-if="!likedByMe"></i>
            <i class="bi bi-heart-fill text-lg" v-else></i>
          </div>
          <div class="ml-2 hover:underline decoration-red-400">
            <span class="text-lg">{{ refPost?.likers?.length }}</span>
          </div>
        </div>
        <div class="text-neutral-500 flex justify-start items-center mr-8">
          <div class="pt-1">
            <i class="bi bi-chat-left text-lg"></i>
          </div>
          <div class="ml-2">
            <span class="text-lg">0</span>
          </div>
        </div>
        <div class="text-neutral-500 flex justify-start items-center">
          <div class="-scale-x-100 -mt-[2px]">
            <i class="bi bi-reply text-2xl"></i>
          </div>
          <div class="ml-2 text-lg">
            <span>0</span>  
          </div>
        </div>
      </div>
    </div>
    <FloatingMessage 
      :visible="showFloatingMessage"
      :message="floatingMessage"
      :type="floatingMessageType"
      @close="() => showFloatingMessage = false" />
  </div>
</template>;