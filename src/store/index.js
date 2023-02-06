import { createStore } from 'vuex';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const axiosInstance = axios.create();
const store = createStore({
  state() {
    return {
      apiBaseURL: 'http://localhost:3000',
      login: false,
      accessToken: {
        token: '', exp: ''
      },
      currentUser: {},
      axiosInstance
    }
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setLoginState(state, loginState) {
      state.login = loginState;
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    }
  },
  actions: {
    async getCurrentUser({ commit, state }) {
      let response;
      try {
        response = await axios.get(`${state.apiBaseURL}/v1/users`, {
          headers: {
            'Authorization': `Bearer ${state.accessToken.token}`
          }
        });
      } catch(e) {
        throw e;
      }

      const { data } = response.data;      
      commit('setCurrentUser', data);
    },
    async getAccessToken({ commit, state }) {
      try {
        const response = await axios.get(`${state.apiBaseURL}/v1/auth/refresh-token`, {
          withCredentials: true
        });
        const { data } = response.data;
        const { access_token } = data;
        const decoded = jwtDecode(access_token);
        const { exp } = decoded;
        commit('setAccessToken', { token: access_token, exp });
        state.login = true;
      } catch(e) {
        throw e;
      }
    }
  }
});

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const currentDate = + new Date();
    if (store.state.accessToken.exp >= currentDate) {
      config.headers.Authorization = `Bearer ${store.state.accessToken.token}`;
    } else {
      const response = await axios.get(`${store.state.apiBaseURL}/v1/auth/refresh-token`, {
        withCredentials: true
      });
      const { data } = response.data;
      const { access_token } = data;
      const { exp } = jwtDecode(access_token);

      config.headers.Authorization = `Bearer ${access_token}`;
      store.commit('setAccessToken', { token: access_token, exp });
    }
  } catch(_) {
  }
  return config;
});

export default store;
