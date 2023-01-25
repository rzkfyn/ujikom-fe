import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      apiBaseURL: 'http://localhost:3000',
      login: false,
      accessToken: ''
    }
  },
  mutations: {
    setLoginState(state, loginState) {
      state.login = loginState;
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    }
  }
});

export default store;
