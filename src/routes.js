/* Root */
// const Introduction = (r) => require.ensure([], () => r(require('./pages/Introduction')), 'base');
const Entrance = (r) => require.ensure([], () => r(require('./pages/Entrance')), 'base');
const About = (r) => require.ensure([], () => r(require('./pages/About')), 'base');
const Error404 = (r) => require.ensure([], () => r(require('./pages/Error')), 'base');
const Login = (r) => require.ensure([], () => r(require('./pages/Login')), 'base');

/* erp index */
const ERPIntroduction = (r) => require.ensure([], () => r(require('./pages/erp/ERPIntroduction')), 'erp');
/* account 模块 */
const Account = (r) => require.ensure([], () => r(require('./pages/erp/sys/Account')), 'account');
const Role = (r) => require.ensure([], () => r(require('./pages/erp/sys/Role')), 'role');
const Module = (r) => require.ensure([], () => r(require('./pages/erp/sys/Module')), 'module');
const Permission = (r) => require.ensure([], () => r(require('./pages/erp/sys/Permission')), 'permission');

const main = [
  {
    path: '/',
    name: 'index',
    redirect: '/entrance'
  },
  {
    path: '/entrance',
    name: 'entrance',
    component: Entrance
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/erp',
    name: 'erp-introduction',
    component: ERPIntroduction
  }
];

// ERP 入口
const modules = [
  {
    path: '/erp/sys/account',
    name: 'account',
    component: Account
  },
  {
    path: '/erp/sys/role',
    name: 'role',
    component: Role
  },
  {
    path: '/erp/sys/module',
    name: 'module',
    component: Module
  },
  {
    path: '/erp/sys/permission',
    name: 'permission',
    component: Permission
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
