<template>
  <page-content page-title="商城登录入口">
    <div class="login-wrap">
      <div class="ms-login">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="demo-loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码" v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')"></el-input>
          </el-form-item>
          <div class="login-btn">
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          </div>
          <p style="font-size:12px;line-height:30px;color:#999;">Tips : 请输入用户名和密码。</p>
        </el-form>
      </div>
    </div>
  </page-content>
</template>

<script>

import * as types from '../../store/mutations';
import { ACCOUNT_LOGIN, MODULE_TREE } from '../../api/account/account-api';

export default {
  data: function() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      const self = this;
      let store = this.$store;

      debugger;
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.$axios({
            method: 'post',
            baseURL: ACCOUNT_LOGIN,
            data: {
              username: this.loginForm.username,
              password: this.loginForm.password
            }
          }).then(function(resp) {

            self.$message({ message: '登录成功^_^', type: 'success' });

            console.debug('storing token...');

            let authToken = resp.headers.authorization;

            try {
              store.commit('account/' + types.SET_TOKEN, {
                account_token: authToken,
                account_name: self.loginForm.username
              });
            } catch (error) {
              console.error(error);
            }

            console.debug('storing roles & granted permission...');
            try {
              let payload = self.$base64url.decode(authToken.split('.')[1]);

              store.commit('account/' + types.SET_AUTHES, JSON.parse(payload).perms);
            } catch (error) {
              console.error(error);
            }

            console.debug('initializing an granted url access array...');

            self.$axios.get(MODULE_TREE)
              .then((resp) => {
                if (resp.data.done) {
                  store.commit('account/' + types.SET_MODULES, resp.data.data);
                } else {
                  console.error('something is wrong with resources access');
                  self.$message.error('系统故障，请联系管理员！ಥ_ಥ');
                }
              });
            self.$router.push('/');

          }).catch(function(error) {

            if (error.message === 'Network Error') {
              self.$message.error('网络故障，请联系管理员！ಥ_ಥ');
            } else if (error.response.status === 401) {
              self.$message.error('用户名或密码错误！ಥ_ಥ');
            } else {
              self.$message.error('服务器异常请联系管理员！ಥ_ಥ');
            }

          });
        } else {
          console.warn('参数校验失败');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 160px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
}
</style>
