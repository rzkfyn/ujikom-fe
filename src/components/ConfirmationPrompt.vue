<script setup>
const props = defineProps({
  onYes: {
    type: Function,
    default: () => null,
    required: false
  },
  confirmButtonText: {
    type: String,
    default: 'Ok'
  },
  header: {
    type: String,
    default: 'Are you sure?'
  },
  message: {
    type: String,
    default: '',
    required: true
  }
});
const emit = defineEmits(['close']);
const onConfirmHandler = async () => {
  await props.onYes();
  emit('close');
};
const onCancleButtonClickHandler = () => emit('close');
</script>

<template>
  <div class="fixed z-50 top-0 right-0 left-0 bottom-0 bg-neutral-600/40 flex justify-center items-center">
    <div class="bg-white rounded-lg px-8 py-5 max-w-sm">
      <div>
        <h3 class="text-xl text-neutral-700 font-semibold">{{ header }}</h3>
      </div>
      <div class="my-2">
        <p class="text-lg text-neutral-500">
          {{ message }}
        </p>
      </div>
      <div>
        <button @click="onConfirmHandler"
          class="transition-all block text-md text-center w-full my-3 rounded-xl border py-2 bg-indigo-400 font-semibold text-white hover:bg-indigo-500 hover:text-neutral-100"
        >{{ confirmButtonText }}</button>
        <button @click="onCancleButtonClickHandler"
          class="transition-all block text-neutral-600 text-md text-center w-full my-2 rounded-xl border py-2 font-semibold border-neutral-400 hover:bg-neutral-100"
        >Cancel</button>
      </div>
    </div>
  </div>
</template>