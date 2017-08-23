/* eslint-disable */
import * as types from '../mutations'

/**
 * 数据实体（存储账户实体信息）
 */
const state = {
    account_name: '',
    account_token: '',
}

/**
 * 单一实体下的 get 操作
 */
const getters = {
    getToken: state => state !== undefined ? state.account_token : ''
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
