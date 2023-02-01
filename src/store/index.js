import { createStore } from 'vuex';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const store = createStore({
  state() {
    return {
      apiBaseURL: 'http://localhost:3000',
      login: false,
      accessToken: {
        token: '', exp: ''
      },
      currentUser: {}
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
      const { user } = data;
      commit('setCurrentUser', user);
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

export default store;
