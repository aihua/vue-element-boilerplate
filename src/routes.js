/* Root */
const Introduction = (r) => require.ensure([], () => r(require('./pages/Introduction')), 'base');
const About = (r) => require.ensure([], () => r(require('./pages/About')), 'base');
const Error404 = (r) => require.ensure([], () => r(require('./pages/Error')), 'base');

/* account 模块*/
const Account = (r) => require.ensure([], () => r(require('./pages/account/Account')), 'account');

const main = [
  {
    path: '/',
    name: 'introduction',
    component: Introduction
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
];

const modules = [
  {
    path: '/account',
    name: 'account',
    component: Account
  }
];

const error = [
  {
    path: '*',
    name: 'error',
    component: Error404
  }
];


export default [].concat(main, modules, error);
