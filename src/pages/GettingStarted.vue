<template>
  <page-content page-title="Getting Started">
    
    <div class="main-content">
      <article>
        <section>
          <h2 class="md-headline">Include Fonts and Icons</h2>

          <p>Use Roboto and Google Icons from Google CDN:</p>
          <code-block lang="xml">
            &lt;link rel=&quot;stylesheet&quot; href=&quot;//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic&quot;&gt;
            &lt;link rel=&quot;stylesheet&quot; href=&quot;//fonts.googleapis.com/icon?family=Material+Icons&quot;&gt;
          </code-block>
        </section>
      </article>

      <article>
        <h2 class="md-headline">Installation</h2>

        <section>
          <h3 class="md-title">NPM</h3>
          <p>Install Vue Material through npm or yarn <br><small>* Others package managers like JSPM and Bower are not supported yet.</small></p>
          <code-block lang="bash">
            $ npm install vue-material --save
            $ yarn add vue-material
          </code-block>
        </section>

        <section>
          <h3 class="md-title">Standalone</h3>
          <p>Download from Github and reference the script and the stylesheet in your HTML:</p>
          <md-button class="md-raised md-primary" href="https://github.com/marcosmoura/vue-material/archive/master.zip" target="_blank" rel="noopener">download</md-button>
        </section>

        <section>
          <h3 class="md-title">CDN</h3>
          <p>Include the Vue Material files from unpkg:</p>
          <md-button class="md-raised md-primary" href="https://unpkg.com/vue-material" target="_blank" rel="noopener">Javascript</md-button>
          <md-button class="md-raised md-primary" href="https://unpkg.com/vue-material/dist/vue-material.css" target="_blank" rel="noopener">CSS</md-button>
        </section>
      </article>

      <article>
        <h2 class="md-headline">Usage</h2>

        <section>
          <h3 class="md-title">AMD Modules</h3>

          <p>Import and use the whole library:</p>
          <code-block lang="xml">
            &lt;link rel=&quot;stylesheet&quot; href=&quot;path/to/vue-material.css&quot;&gt;
          </code-block>

          <code-block lang="javascript">
            var Vue = require('vue')
            var VueMaterial = require('vue-material')

            Vue.use(VueMaterial)
          </code-block>

          <p>Or to import individual components:</p>
          <code-block lang="xml">
            &lt;link rel=&quot;stylesheet&quot; href=&quot;path/to/vue-material/dist/components/mdCore.css&quot;&gt;
            &lt;link rel=&quot;stylesheet&quot; href=&quot;path/to/vue-material/dist/components/mdButton.css&quot;&gt;
            &lt;link rel=&quot;stylesheet&quot; href=&quot;path/to/vue-material/dist/components/mdIcon.css&quot;&gt;
            &lt;link rel=&quot;stylesheet&quot; href=&quot;path/to/vue-material/dist/components/mdSidenav.css&quot;&gt;
            &lt;link rel=&quot;stylesheet&quot; href=&quot;path/to/vue-material/dist/components/mdToolbar.css&quot;&gt;
          </code-block>

          <code-block lang="javascript">
            var Vue = require('vue')
            var VueMaterial = require('vue-material')

            Vue.use(VueMaterial.mdCore) //Required to boot vue material
            Vue.use(VueMaterial.mdButton)
            Vue.use(VueMaterial.mdIcon)
            Vue.use(VueMaterial.mdSidenav)
            Vue.use(VueMaterial.mdToolbar)
          </code-block>

          <p><strong>Note:</strong> If you are using Webpack you can still import the css files inside your modules. And you can also write everything using ES6 with Babel or Bublé.</p>
        </section>

        <section>
          <h3 class="md-title">Standalone</h3>

          <code-block lang="xml">
            &lt;link rel=&quot;stylesheet&quot; href=&quot;path/to/vue-material.css&quot;&gt;
            &lt;script src=&quot;path/to/vue-material.js&quot;&gt;&lt;/script&gt;
          </code-block>

          <code-block lang="javascript">
            // The VueMaterial variable is global
            Vue.use(VueMaterial)
          </code-block>
        </section>
      </article>

      <article>
        <h2 class="md-headline">Codepen Examples</h2>

        <section>
          <h3 class="md-title">Playground</h3>
          <iframe height="620" scrolling="no" title="Empty Setup" src="//codepen.io/vue-material/embed/VmMrYW/?height=620&amp;theme-id=dark&amp;default-tab=html,result&amp;embed-version=2" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 100%;">See the Pen <a href="http://codepen.io/vue-material/pen/VmMrYW/">Empty Setup</a> by Vue Material (<a href="http://codepen.io/vue-material">@vue-material</a>) on <a href="http://codepen.io">CodePen</a>.</iframe>
        </section>

        <section>
          <h3 class="md-title">File Application UI</h3>
          <iframe width="360" height="610" scrolling="no" title="File Application UI" src="//codepen.io/vue-material/embed/WoZpMR/?height=610&amp;theme-id=dark&amp;default-tab=result&amp;embed-version=2" frameborder="no" allowtransparency="true" allowfullscreen="true">See the Pen <a href="http://codepen.io/vue-material/pen/WoZpMR/">Vue Material Example</a> by Vue Material (<a href="http://codepen.io/vue-material">@vue-material</a>) on <a href="http://codepen.io">CodePen</a>.</iframe>
        </section>
      </article>
    </div>

    <md-table-card>
      <md-toolbar>
        <h1 class="md-title">Nutrition</h1>
        <md-button class="md-icon-button">
          <md-icon>filter_list</md-icon>
        </md-button>
  
        <md-button class="md-icon-button">
          <md-icon>search</md-icon>
        </md-button>
      </md-toolbar>
  
      <md-table md-sort="dessert" md-sort-type="desc" @select="onSelect" @sort="onSort">
        <md-table-header>
          <md-table-row>
            <md-table-head md-sort-by="dessert">Dessert (100g serving)</md-table-head>
            <md-table-head md-sort-by="calories" md-numeric md-tooltip="The total amount of food energy and the given serving size">Calories (g)</md-table-head>
            <md-table-head md-sort-by="fat" md-numeric>Fat (g)</md-table-head>
            <md-table-head>
              <md-icon>message</md-icon>
              <span>Comments</span>
            </md-table-head>
          </md-table-row>
        </md-table-header>
  
        <md-table-body>
          <md-table-row v-for="(row, rowIndex) in nutrition" :key="rowIndex" :md-item="row" md-auto-select md-selection>
            <md-table-cell v-for="(column, columnIndex) in row" :key="columnIndex" :md-numeric="columnIndex !== 'dessert' && columnIndex !== 'comment'" v-if="columnIndex !== 'type'">
              {{ column }}
            </md-table-cell>
          </md-table-row>
        </md-table-body>
      </md-table>
  
      <md-table-pagination md-size="5" md-total="10" md-page="1" md-label="Rows" md-separator="of" :md-page-options="[5, 10, 25, 50]" @pagination="onPagination"></md-table-pagination>
    </md-table-card>
  </page-content>
</template>

<style lang="scss" scoped>
  .main-content {
    position: relative;
  }

  article {
    max-width: 960px;
  }

  section + section,
  article + article {
    margin-top: 36px;
  }

  .code-block,
  .md-tabs {
    max-width: 100%;
  }

  .md-tab {
    border-top: 1px solid rgba(#000, .12);
    padding: 0;
  }

  iframe {
    height: auto;
    min-height: 620px;
  }
</style>

<script lang="babel">
  export default {
    data: () => ({
      nutrition: [
        {
          dessert: 'Frozen yogurt',
          type: 'ice_cream',
          calories: '159',
          fat: '6.0',
          comment: 'Icy'
        },
        {
          dessert: 'Ice cream sandwich',
          type: 'ice_cream',
          calories: '237',
          fat: '9.0',
          comment: 'Super Tasty'
        },
        {
          dessert: 'Eclair',
          type: 'pastry',
          calories: '262',
          fat: '16.0',
          comment: ''
        },
        {
          dessert: 'Cupcake',
          type: 'pastry',
          calories: '305',
          fat: '3.7',
          comment: ''
        },
        {
          dessert: 'Gingerbread',
          type: 'other',
          calories: '356',
          fat: '16.0',
          comment: ''
        }
      ]
    }),
    methods: {
      onSelect(data) {
        console.info('selected');
        this.selectedData = data;
        this.$forceUpdate();
      },
      onSort(sort) {
        this.sort = sort;
      },
      onPagination(page) {
        this.page = page;
      }
    }
  };
</script>

