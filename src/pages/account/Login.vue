<template>
    <page-container>
        <md-toolbar class="md-dense">
            <md-button class="md-icon-button">
                <md-icon>home</md-icon>
            </md-button>

            <h2 class="md-title" style="flex: 1">登录界面</h2>
        </md-toolbar>
        <md-layout gutter="33" class="login-wrapper">
            <md-layout/>
            <md-layout>
                <form ref="baseForm" class="base-form" novalidate @submit.stop.prevent="submit">
                    <md-input-container>
                        <md-icon class="md-primary">account_box</md-icon>
                        <label>用户名</label>
                        <md-input type="text" required></md-input>
                    </md-input-container>

                    <md-input-container md-has-password>
                        <md-icon class="md-primary">vpn_key</md-icon>
                        <label>密码</label>
                        <md-input type="password" required></md-input>
                    </md-input-container>

                    <md-button class="md-primary" @click="submitForm('baseForm')">登录</md-button>
                </form>
            </md-layout>
            <md-layout/>
        </md-layout>
    </page-container>
</template>
<style lang="scss" scoped>
.login-wrapper {
    padding-top: 100px
}

.base-form {
    width: 100%
}

.md-primary {
    float: right
}
</style>

<script>

export default {
  methods: {
    submitForm(formName) {

      const self = this;

      self.$refs[formName].validate((valid) => {
        if (valid) {
          console.info('参数校验通过');
          localStorage.setItem('account_name', self.ruleForm.username);
          self.$axios({
            method: 'post',
            baseURL: 'http://127.0.0.1:8083/auth/token',
            data: {
              username: this.ruleForm.username,
              password: this.ruleForm.password
            }
          }).then(function(resp) {
                        // TODO 请求真正的昵称
            console.debug('登录成功！');
            localStorage.setItem('account_token', resp.headers.authorization);
            self.$router.push('/readme');
          }).catch(function(error) {
            console.debug(error);
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
