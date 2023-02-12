<script setup>
import { useStore } from 'vuex';

defineProps({
  source: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['mediaviewer:close']);
const store = useStore();
const closeBtnClickHandler = () => emit('mediaviewer:close');
</script>

<template>
  <div class="fixed right-0 left-0 top-0 bottom-0 flex items-center justify-center bg-neutral-800/30 z-40" v-if="show">
    <div class="absolute right-10 text top-20 text-white text-4xl cursor-pointer" @click="closeBtnClickHandler">x</div> 
    <div class="w-1/2 text-center">
      <img :src="`${store.state.apiBaseURL}/${source}`" alt="cover image" 
        class="h-full object-cover object-top max-h-[500px] min-h-[250px] mx-auto rounded-xl border border-neutral-200"
      > 
    </div>
  </div>
</template>

