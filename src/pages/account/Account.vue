<template>
  <page-content page-title="账户管理">
    <page-container>
      <md-table-card>
        <md-toolbar>
          <h1 class="md-title">账户管理</h1>

          <md-button class="md-icon-button">
            <md-icon>filter_list</md-icon>
          </md-button>

          <md-button class="md-icon-button">
            <md-icon>search</md-icon>
          </md-button>
        </md-toolbar>

        <md-table md-sort="createDate" md-sort-type="desc" @select="onSelect" @sort="onSort">
          <md-table-header>
            <md-table-row>
              <md-table-head name="accountName" md-tooltip="登录依据">账户名</md-table-head>
              <md-table-head name="nickName" md-tooltip="账号昵称">昵称</md-table-head>
              <md-table-head name="mobile" md-tooltip="手机号码 唯一">手机号码</md-table-head>
              <md-table-head name="email">电子邮箱</md-table-head>
              <md-table-head name="createDate" md-sort-by="createDate">创建时间</md-table-head>
            </md-table-row>
          </md-table-header>

          <md-table-body id="table-body">
            <md-table-row v-for="(row, rowIndex) in accounts" :key="rowIndex" :md-item="row" md-auto-select md-selection>
              <md-table-cell v-for="(column, columnIndex) in row" :key="columnIndex" v-if="columnIndex !== 'id'">
                {{ column }}
              </md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>

        <md-table-pagination md-size="5" md-total="10" md-page="1" md-label="Rows" md-separator="of" :md-page-options="[5, 10, 25, 50]" @pagination="onPagination"></md-table-pagination>
      </md-table-card>
    </page-container>
  </page-content>
</template>

<style lang="scss" scoped>
.md-avatar+.md-avatar {
  margin-left: 8px;
}
</style>

<script lang="babel">

  import {ACCOUNT_RESOURCE} from '../../api/account/account-api';

  export default {
    data: () => ({
      accounts: [],
      table_heads: []
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
        debugger;
        this.page = page;
        this.queryPage(page);
      },
      queryPage(params) {
        let self = this;
        let $ = self.$;
        //** 请求资源并渲染表格 */
  
        self.accounts = [];
        self.$axios({
          method: 'get',
          baseURL: ACCOUNT_RESOURCE,
          data: params
        }).then((resp) => {
          if (resp.data.done) {
            let pageContent = resp.data.data;
  
            if (pageContent.numberOfElements > 0) {
              /**
               * 把需要的字段 筛选出来
               */
              $.each(pageContent.content, (index, element) => {
                let acc_view = {};
  
                $.each(self.table_heads, (headIndex, value) => {
                  acc_view[value] = element[value];
                });
                self.accounts.push(acc_view);
              });
            }
          } else {
            console.error('something is wrong with resources access');
            self.$message.error('系统故障，请联系管理员！ಥ_ಥ');
          }
        });
      }
    },
    mounted() {
      let self = this;
      let $ = self.$;
  
      //** 初始化表头信息 */
      self.table_heads.push('id');
      $.each($('.md-table-head'),
          (index, value) => {
            self.table_heads.push($(value).attr('name'));
          });

      self.queryPage({});
  
    }
  };
</script>
