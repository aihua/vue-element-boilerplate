/* Third Party */
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'babel-polyfill';
require('es6-promise').polyfill();
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import base64url from 'base64url';
import assert from 'assert';
import { sync } from 'vuex-router-sync';
import $ from 'jquery';

/* Configs */
import './config.js';
import routes from './routes.js';
import App from './App';
import './core';
import axios from 'axios';
import store from './store';

import PageContent from './components/PageContent';
import PageContainer from './components/PageContainer';
import DocsComponent from './components/DocsComponent';
import ExampleBox from './components/ExampleBox';
import ApiTable from './components/ApiTable';
import CodeBlock from './components/CodeBlock';
import VueMoment from 'vue-moment';
import moment from 'moment';

/** base url */
import { IS_LOGGING } from './api/account/account-api';

/**
 * 第三方插件除了 import 以外还需要如此引入
 */
Vue.prototype.$axios = axios;
Vue.prototype.$base64url = base64url;
Vue.prototype.$assert = assert;
Vue.prototype.$baseurl = { IS_LOGGING: IS_LOGGING };
Vue.prototype.$ = $;

Vue.component('page-content', PageContent);
Vue.component('docs-component', DocsComponent);
Vue.component('example-box', ExampleBox);
Vue.component('api-table', ApiTable);
Vue.component('code-block', CodeBlock);
Vue.component('page-container', PageContainer);

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VueMoment, { moment });

let router = new VueRouter({
  mode: 'hash',
  base: window.location.pathname,
  store,
  routes
});

let ECShopApp = Vue.component('app', App);
let handleSectionTheme = (currentRoute) => {
  let theme = 'default';
  let name = currentRoute.name;

  if (name) {
    if (name === 'about') {
      theme = 'green';
    } else if (name === 'error') {
      theme = 'red';
    }
  }
  Vue.material.setCurrentTheme(theme);
};

ECShopApp = new ECShopApp({
  el: '#app',
  store,
  router
});

sync(store, router);

handleSectionTheme(router.currentRoute);


/**
 * 附带鉴权功能的跳转
 *
 * @param next 跳转器
 * @param to 下一跳 route
 * @param next 转发函数
 */
router.beforeEach((to, from, next) => {
  /**
   * nextTick 下次 DOM 更新循环结束后执行回调
   *
   * 解释： Vue 异步更新原理
   *
   * 默认情况下，Vue 的 DOM 更新是异步执行的，当数据发生变化（vm.sdata = 'new_value'），
   * DOM 并不会马上触发更新，而是打开一个队列，然后把同一个事件循环（event loop）中观测到的数据变化推送到队列里，
   * 一次事件循环只有一次数据集合的推送。那么最终在下一次进入事件循环的时候，
   * Vue 会清空队列并进行必要的 DOM 更新。而这个时候特殊 nextTick 执行的时机。
   *
   * @see https://012-cn.vuejs.org/guide/best-practices.html
   */

  // TODO 如何配置无需授权的 url ？
  if (to.name === 'login') {
    Vue.nextTick(() => {
      ECShopApp.closeSidenav();
      next(true);
    });
    return;
  }

  // 本地校验 token 是否过期
  try {
    let token = ECShopApp.$store.getters['account/getToken'];

    ECShopApp.$assert.notEqual(token, '', '用户未登录');
    let payload = ECShopApp.$base64url.decode(token.split('.')[1]);

    if (JSON.parse(payload).exp < new Date().getTime()) {
      debugger;
      store.clear();
      Vue.nextTick(() => {
        ECShopApp.closeSidenav();
        ECShopApp.$message.warning('检测到您的本地会话过期，请重新登录哦^_^');
        next({ path: '/login' });
      });
      return;
    }
  } catch (error) {
    ECShopApp.$message.warning('检测到你尚未登录，请登录哦^_^');
    Vue.nextTick(() => {
      ECShopApp.closeSidenav();
      next({ path: '/login' });
    });
    return;
  }
  // 服务端验证 token 是否失效
  ECShopApp.$axios({
    method: 'post',
    baseURL: ECShopApp.$baseurl.IS_LOGGING
  }).then((resp) => {
    console.debug(resp);
    Vue.nextTick(() => {
      ECShopApp.closeSidenav();
      next(true);
    });
  }).catch((error) => {
    // 确定 token 已经失效
    if (error.response !== undefined && error.response.status === 403) {
      ECShopApp.$store.commit('account/RESET');
      Vue.nextTick(() => {
        ECShopApp.closeSidenav();
        ECShopApp.$message.warning('检测到您的会话失效，请重新登录哦^_^');
        next({ path: '/login' });
      });
    }
  });


});

router.afterEach((to) => {
  handleSectionTheme(to);
});


/**
 * axios request 拦截器
 */
ECShopApp.$axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    if (ECShopApp.$store.getters['account/getToken']) {
      config.headers.Authorization = `${store.getters['account/getToken']}`;
    }
    return config;
  },
  (err) => {
    // Do something with request error
    return Promise.reject(err);
  }
);
// Add a response interceptor
ECShopApp.$axios.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {
    // Do something with response error
    if (error.response) {
      switch (error.response.status) {
        case 403:
          // exception 是用来区分授权失效还是访问受限，访问受限并不会需要你重新登录
          if (!error.response.data.exception) {
            // 授权失效
            ECShopApp.$store.commit('account/RESET');
            router.replace({
              path: 'login',
              query: { redirect: router.currentRoute.fullPath }
            });
          } else {
            // 访问受限
            ECShopApp.$message.warning('你没有权限访问此模块');
          }
        default:
        //do nothing
      }
    }
    return Promise.reject(error);
  }
);
