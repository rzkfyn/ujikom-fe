import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import store from '../store';
import Index from '@/pages/Index';
import Register from '@/pages/auth/Register';
import Login from '@/pages/auth/Login';
import Profile from '@/pages/profile/Index';
import Connection from '@/pages/profile/Connection';
import Setting from '@/pages/settings/Index';
import ProfileSetting from '@/pages/settings/ProfileSetting';
import VerifyEmail from '@/pages/auth/VerifyEmail';

const routes = [
  {
    path: '/',
    component: Index,
    name: 'Home'
  },
  {
    path: '/login',
    component: Login,
    name: 'Login'
  },
  {
    path: '/register',
    component: Register,
    name: 'Register'
  },
  {
    path: '/verifyemail/:code?',
    component: VerifyEmail,
    name: 'VerifyEmail'
  },
  {
    path: '/notifications',
    component: Index,
    name: 'Notification'
  },
  {
    path: '/saved',
    component: Index,
    name: 'SavedPosts'
  },
  {
    path: '/settings',
    component: Setting,
    children: [
      {
        path: '/settings',
        component: ProfileSetting
      },
      {
        path: '/settings/profile',
        component: ProfileSetting
      },
      {
        path: '/settings/account',
        component: ProfileSetting
      }
    ]
  },
  {
    path: '/:username',
    component: Profile,
    children: [
      {
        path: '/:username',
        component: Profile,
        name: 'Profile'
      },
      {
        path: '/:username/posts',
        component: Profile,
      },
      {
        path: '/:username/about',
        component: Profile,
      },
      {
        path: '/:username/media',
        component: Profile,
      }
    ]
  },
  {
    path: '/:username/followers',
    component: Connection
  },
  {
    path: '/:username/following',
    component: Connection
  },
];

const router = createRouter({
  routes,
  history: createWebHistory()
});

router.beforeEach(async (to, from, next) => {
  if (to.name !== 'Login' && to.name !== 'Register' && to.name !== 'Profile' && to.name !== 'Home' && to.name !== 'VerifyEmail') {
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
