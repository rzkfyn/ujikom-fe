<script setup>
const emit = defineEmits(['close']);

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'success'
  }
});
</script>

<template>
  <div :class="`flex transition-all duration-300 right-0 left-0 bottom-20 justify center items-center justify-center fixed ${visible ? 'translate-y-0' : 'translate-y-10 opacity-0'}`">
    <div 
      :class="`py-1 px-4 rounded-md font-semibold text-lg 
      ${type === 'success' ? 'bg-indigo-400 text-neutral-100' : ''}
      ${type === 'error' ? 'bg-red-400/90 text-neutral-100' : ''}
      `"
    >
      {{ message }}
    </div>
  </div>
</template>