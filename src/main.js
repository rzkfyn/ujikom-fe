import { createApp } from 'vue';
import '@/index';
import router from '@/router';
import store from '@/store';
import App from '@/App';

createApp(App)
  .use(router)
  .use(store)
  .mount('#app');
