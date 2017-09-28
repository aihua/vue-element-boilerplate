import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
// import * as getters from './getters'
import account from './modules/account';
import createLogger from 'vuex/dist/logger';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  actions,
  // getters,
  modules: {
    account
  },
  strict: debug,
  plugins: debug ? [createLogger(), createPersistedState({ key: 'ecshop' })] : [createPersistedState({ key: 'xshop' })]
});
