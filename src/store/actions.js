import * as types from './mutations';

/**
 * @param {*多实体聚合 set 操作（异步）} param0
 */
export const myAction = ({ commit }) => {
  commit(types.SET_TOKEN);
};
