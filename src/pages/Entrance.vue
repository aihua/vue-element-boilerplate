<template>
  <page-content page-title="选择入口">
    <page-container>
      <md-card style="width:320px" v-for="mod in this.$store.getters['module/getAllModules']" :key="mod.id">
        <md-card-media-cover md-solid>
          <md-card-media md-ratio="1:1">
            <img src="assets/card-sky.jpg" alt="Skyscraper">
          </md-card-media>

          <md-card-area>
            <md-card-header>
              <div class="md-title">{{ mod.alias }}</div>
            </md-card-header>

            <md-card-actions>
              <md-button @click="clickCallback(mod.name, mod.url)">点击进入</md-button>
            </md-card-actions>
          </md-card-area>
        </md-card-media-cover>
      </md-card>
    </page-container>
  </page-content>
</template>

<script>
import * as types from '../store/mutations';

export default {
  methods: {
    clickCallback(entryName, url) {
      this.$store.commit('module/' + types.SET_CURR_ENTRY_NAME, entryName);
      this.$router.push(url);
    }
  },
  mounted() {
    try {
      debugger;
      let token = this.$store.getters['account/getToken'];

      this.$assert.notEqual(token, '', '用户未登录');
      let payload = this.$base64url.decode(token.split('.')[1]);

      if (JSON.parse(payload).exp < new Date().getTime()) {
        this.store.clear();
        this.$router.push('/login');
      }
    } catch (error) {
      this.$message.warning('检测到你尚未登录，请登录哦^_^');
      this.$router.push('/login');
    }
  }
};
</script>
