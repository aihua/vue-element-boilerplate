<template>
    <page-content page-title="商城登录入口">
        <div class="login-wrap">
            <div class="ms-login">
                <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="demo-loginForm">
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" placeholder="username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" placeholder="password" v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')"></el-input>
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

      self.$refs[formName].validate((valid) => {
        if (valid) {
          localStorage.setItem('account_name', self.loginForm.username);
          self.$axios({
            method: 'post',
            baseURL: 'http://127.0.0.1:8083/auth/token',
            data: {
              username: this.loginForm.username,
              password: this.loginForm.password
            }
          }).then(function(resp) {
            localStorage.setItem('account_token', resp.headers.authorization);
            self.$message.info('登录成功');
            self.$router.push('/');
          }).catch(function(error) {
            if (error.response.status === 401) {
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
