/* Third Party */
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'babel-polyfill';
require('es6-promise').polyfill();
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

/* Configs */
import './config.js';
import routes from './routes.js';
import App from './App';
import './core';
import axios from 'axios';

import PageContent from './components/PageContent';
import PageContainer from './components/PageContainer';
import DocsComponent from './components/DocsComponent';
import ExampleBox from './components/ExampleBox';
import ApiTable from './components/ApiTable';
import CodeBlock from './components/CodeBlock';


Vue.prototype.$axios = axios;

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
  routes
});

let ECShop = Vue.component('app', App);
let handleSectionTheme = (currentRoute) => {
  let theme = 'default';
  let name = currentRoute.name;

  if (name) {
    if (name === 'getting-started') {
      theme = 'indigo';
    } else if (name.indexOf('themes') >= 0) {
      theme = 'cyan';
    } else if (name.indexOf('ui-elements') >= 0) {
      theme = 'purple';
    } else if (name === 'changelog') {
      theme = 'orange';
    } else if (name === 'about') {
      theme = 'green';
    } else if (name === 'error') {
      theme = 'red';
    }
  }

  Vue.material.setCurrentTheme(theme);
};

ECShop = new ECShop({
  el: '#app',
  router
});

handleSectionTheme(router.currentRoute);

router.beforeEach((to, from, next) => {
  Vue.nextTick(() => {
    let mainContent = document.querySelector('.main-content');

    if (mainContent) {
      mainContent.scrollTop = 0;
    }

    ECShop.closeSidenav();

    next();
  });
});

router.afterEach((to) => {
  handleSectionTheme(to);
});
