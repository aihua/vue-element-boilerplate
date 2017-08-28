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
    getGrantedAuthorities: state => state !== undefined ? state.account_authes : ''
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
