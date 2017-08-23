import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
// import * as getters from './getters'
import account from './modules/account';
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  actions,
  // getters,
  modules: {
    account
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
