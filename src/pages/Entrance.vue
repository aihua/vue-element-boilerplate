<template>
  <page-content page-title="选择入口">
    <page-container>
      <md-card style="width:320px" v-for="mod in this.$store.getters['account/getAllModules']" :key="mod.id">
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
  }
};
</script>
