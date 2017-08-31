/* eslint-disable */
import * as types from '../mutations'

/**
 * 数据实体（存储账户实体信息）
 */
const state = {
    account_name: '',
    account_token: '',
    account_authes: '',
    account_modules: []
}

/**
 * 单一实体下的 get 操作
 */
const getters = {
    getToken: state => state !== undefined ? state.account_token : '',
    getGrantedAuthorities: state => state !== undefined ? state.account_authes : '',
    getModules: state => state !== undefined ? state.account_modules : ''
}

/**
 * 单一实体下的  set 操作 （异步）
 */
const actions = {

}

/**
 * 单一实体下的  set 操作 （同步）
 */
const mutations = {
    [types.SET_TOKEN](state, account_info) {
        state.account_token = account_info.account_token;
        state.account_name = account_info.account_name;
    },
    [types.SET_AUTHES](state, perms) {
        state.account_authes = perms;
    },
    [types.SET_MODULES](state, modules) {
        state.account_modules = modules;
    },
    [types.RESET](s) {
        const initial = state;
        Object.keys(initial).forEach(key => {
            s[key] = initial[key];
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
