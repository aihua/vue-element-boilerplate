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


/**
 * 第三方插件除了 import 以外还需要如此引入
 */
Vue.prototype.$axios = axios;
Vue.prototype.$base64url = base64url;
Vue.prototype.$assert = assert;

Vue.component('page-content', PageContent);
Vue.component('docs-component', DocsComponent);
Vue.component('example-box', ExampleBox);
Vue.component('api-table', ApiTable);
Vue.component('code-block', CodeBlock);
Vue.component('page-container', PageContainer);

Vue.use(VueRouter);
Vue.use(ElementUI);

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

/**
 * 鉴权
 * true: 资源可以访问
 * false: 资源不可访问
 * @param next 跳转器
 * @param to 下一跳 route
 * @param vueApp 根组件
 */
const handleResourcesAccess = (next, to, vueApp) => {
  // 检验本地 Token 是否过期
  if (to.name === 'login') {
    return true;
  }
  try {
    let token = vueApp.$store.getters['account/getToken'];

    vueApp.$assert.notEqual(token, '', '用户未登录');

    let payload = vueApp.$base64url.decode(token.split('.')[1]);

    if (JSON.parse(payload).exp * 1000 < new Date().getTime()) {
      vueApp.$message.warning('检测到您的会话过期，请重新登录哦^_^');
      next({ path: '/login' });
      return false;
    }
  } catch (error) {
    vueApp.$message.warning('检测到你尚未登录，请登录哦^_^');
    next({ path: '/login' });
    return false;
  }
  // 是否已经登录

  // TODO 是否包含有该资源的访问权限？
  return true;
};


handleSectionTheme(router.currentRoute);

router.beforeEach((to, from, next) => {
  if (!handleResourcesAccess(next, to, ECShopApp)) {
    return;
  }
  Vue.nextTick(() => {
    ECShopApp.closeSidenav();
    next(true);
  });
});

router.afterEach((to) => {
  handleSectionTheme(to);
});
