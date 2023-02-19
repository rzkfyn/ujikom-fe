<script setup>
import { watch, ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const emit = defineEmits(['close']);
const props = defineProps({
  post: {
    type: Object,
    default: {},
    required: true
  },
  visible: {
    type: Boolean,
    default: false,
    required: true
  },
  triggerFloatingMessage: {
    type: Function,
    default: () => null
  }
});
const store = useStore();
const postText = ref('');
const mentionedUsers = ref([]);
const text = ref(null);
const closeModal = () => emit('close');
const sharePost = async () => {
  console.log('called');
  let response;
  try {
    response = await store.state.axiosInstance.post(`${store.state.apiBaseURL}/v1/posts/${props.post.code}/share`, {
      text: text.value
    }, {
      headers: {
        'Authorization': `Bearer: ${store.state.accessToken.token}`
      }
    });
  } catch(e) {
    console.log(e);
    closeModal();
    return props.triggerFloatingMessage('Something went wrong', 'error');
  }
  console.log(response);

  closeModal();
  return props.triggerFloatingMessage('Post shared', 'success');
};

onMounted(() => {
  for (let i = 0; i < props.post.mentioned_users.length; i ++) {
    mentionedUsers.value.push({
      username: props.post.mentioned_users[i].username,
      key: props.post.mentioned_users[i].MentionedUserOnPost.key
    });
  }

  const replacedText = props.post.text.replace(/\r\n/g, ' <br> ');
  const arrTextPost = replacedText.split(' ');
  const result = arrTextPost.map((item) => {
    if (item.startsWith('@')) {
      const index = mentionedUsers.value.findIndex(({key}) => {
        return key === item
      });

      if (index > -1) {
        return `<span class="transition-all text-indigo-400 cursor-pointer hover:underline" data-username="${props.post.mentioned_users[index].username}">${item}</span>`;
      }
    };

    return item;
  });

  postText.value = result.join(' ');
  console.log('called');
});
</script>

<template>
  <div v-if="visible">
    <div class="fixed top-0 right-0 left-0 bottom-0 bg-neutral-600/30 z-50 flex items-center justify-center cursor-default">
      <div class="bg-white rounded w-[45%] h-[85%] max-h-[85%] max-w-[45%] px-4 overflow-y-auto relative overflow-x-hidden">
        <div class="sticky top-0 bg-white">
          <div class="text-center py-3 border-b sticky">
            <div>
              <h4 class="text-lg text-neutral-500">Share Post</h4>
            </div>
            <div @click="closeModal"
              class="absolute right-0 top-2 w-10 h-10 bg-neutral-100/90 z-10 flex rounded-full justify-center items-center cursor-pointer"
            >
              <i class="bi bi-x text-4xl text-neutral-500"></i>
            </div>
          </div>
          <div class="mt-2 flex items-center py-2"> 
            <div class="w-14 h-14 rounded-full overflow-hidden">
              <img :src="`${store.state.apiBaseURL}/media/images/profile_images/${store.state.currentUser.profile.profile_media.find(({ context }) => context === 'PROFILE_IMAGE').file_name}`" alt="profile"
                class="object-fill object-center"
              >
            </div>
            <div class="ml-3">
              <p class="font-semibold text-neutral-700">{{ store.state.currentUser.name }}</p>
              <p class="text-sm text-neutral-500">@{{ store.state.currentUser.username }}</p>
            </div>
          </div>
        </div>
        <div class="mt-1 pb-5">
          <div>
            <textarea name="" id="" cols="30" rows="1" placeholder="Say something about this post..." v-model="text"
              class="resize-none w-full focus:outline-none p-3 rounded-lg text-neutral-600"
            ></textarea>
          </div>
          <div class="border rounded p-2">
            <div class="mt-3 flex items-center">
              <div class="w-14 h-14 rounded-full overflow-hidden">
                <img :src="`${store.state.apiBaseURL}/media/images/profile_images/${post.user.profile.profile_media.find(({ context }) => context === 'PROFILE_IMAGE').file_name}`" alt="profile"
                  class="object-fill object-center"
                >
              </div>
              <div class="ml-3">
                <p class="font-semibold text-neutral-700">{{ post.user.name }}</p>
                <p class="text-sm text-neutral-500">@{{ post.user.username }}</p>
              </div>
            </div>
            <div class="my-3 font-neutral-700" v-html="postText">
            </div>
            <div v-if="post.media[0]" class="mt-3">
              <div v-if="post.media.length > 1" class="flex w-full rounded-xl overflow-hidden border border-neutral-300">
                <div v-for="postMedia, i in post.media" :key="i" class="w-full">
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
                <div v-for="postMedia, i in post.media" :key="i" class="rounded-xl overflow-hidden max-h-[500px]">
                  <img :src="`${store.state.apiBaseURL}/media/images/posts/${postMedia.file_name}`" :alt="postMedia.file_name"
                    class="rounded-xl border border-neutral-300 max-h-[500px] object-contain object-center"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sticky bottom-0 bg-white py-4 border-t">
          <button @click="sharePost" class="w-full py-2 bg-indigo-400 font-semibold text-neutral-100 rounded-md">Share Now</button>
        </div>
      </div>
    </div>
  </div>
</template>