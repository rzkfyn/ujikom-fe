import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import store from '../store';
import Index from '@/pages/Index';
import Register from '@/pages/auth/Register';
import Login from '@/pages/auth/Login';
import Profile from '@/pages/profile/Index';
import Posts from '@/pages/profile/Posts';
import Followers from '@/pages/profile/Followers';
import Following from '@/pages/profile/Following';

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
    children: [
      {
        path: '/:username',
        component: Posts,
        name: 'Profile'
      },
      {
        path: '/:username/posts',
        component: Posts
      },
      {
        path: '/:username/followers',
        component: Followers
      },
      {
        path: '/:username/following',
        component: Following
      }
    ]
  }
];

const router = createRouter({
  routes,
  history: createWebHistory()
});

router.beforeEach(async (to, from, next) => {
  if (to.name !== 'Login' && to.name !== 'Register' && to.name !== 'Profile') {
    try {
      await axios.get(`${store.state.apiBaseURL}/v1/auth/refresh-token`, {
        withCredentials: true
      });
    } catch(e) {
      if (to.name !== 'Profile') return next({ name: 'Login' });
    }

    return next();
  }

  if (to.name === 'Login' || to.name === 'Register') {
    try {
      await axios.get(`${store.state.apiBaseURL}/v1/auth/refresh-token`, {
        withCredentials: true
      });
    } catch(_) {
      return next();
    }
    
    return next({ name: 'Home' });
  }

  next();
});

export default router;
