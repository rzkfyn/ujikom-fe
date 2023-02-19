<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});
const store = useStore();
const mentionedUsers = ref([]);
const postText = ref('');
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
        return `<span class="transition-all text-indigo-400 cursor-pointer hover:underline" data-username="${mentionedUsers.value[index].username}">${item}</span>`;
      }
    };

    return item;
  });

  postText.value = result.join(' ');
});
</script>

<template>
  <div>
    <div class="border rounded-md p-2 mt-2">
      <div>
        <div class="flex">
          <div class="min-w-[56px] max-w-[56px] h-14 rounded-full overflow-hidden bg-cover bg-no-repeat border bg-center">
            <img 
              :src="`${store.state.apiBaseURL}/media/images/profile_images/${post.user.profile.profile_media.find(({context}) => context === 'PROFILE_IMAGE').file_name ?? 'default.png'}`"
              alt="profile"
              class="w-full h-full object cover object center"
            >
          </div>
          <div class="flex ml-2 flex-col mt-3">
            <div class="flex items-center">
              <p @click=""
                class="mr-1 text-neutral-800 font-semibold hover:underline cursor-pointer"
              >{{ post.user.name }}</p>
              <p class="flex text-neutral-500">
                <span>@{{ post.user.username }}</span>
                <span class="mx-1">•</span>
                <span>{{ parseTime(post.createdAt) }}</span>
              </p>
            </div>
            <div class="mt-1" v-html="postText">
            </div>
            <div v-if="post.media[0]" class="mt-1">
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
      </div>
    </div>
  </div>
</template>