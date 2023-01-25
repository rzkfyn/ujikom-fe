import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import store from '../store';
import Index from '@/pages/Index';
import Register from '@/pages/auth/Register';
import Login from '@/pages/auth/Login';
import Profile from '@/pages/profile/Index';

const routes = [
  {
    path: '/',
    component: Index,
    name: 'Home'
  },
  {
    path: '/register',
    component: Register,
    name: 'Register'
  },
  {
    path: '/login',
    component: Login,
    name: 'Login'
  },
  {
    path: '/:username',
    component: Profile,
    name: 'Profile'
  }
];

const router = createRouter({
  routes,
  history: createWebHistory()
});

router.beforeEach(async (to, from, next) => {
  if (to.name !== 'Login' && to.name !== 'Register') {
    let response;
    try {
      response = await axios.get(`${store.state.apiBaseURL}/v1/auth/refresh-token`, {
        withCredentials: true
      });
    } catch(e) {
      return next({ name: 'Login' });
    }

    if (response.status === 200) {
      return next();
    }

    return next({ name: 'Login' });
  }

  try {
    await axios.get(`${store.state.apiBaseURL}/v1/auth/refresh-token`, {
      withCredentials: true
    });
  } catch(_) {
    return next();
  }
  
  return next({ name: 'Home' });
});

export default router;
