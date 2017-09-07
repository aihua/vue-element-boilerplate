<template>
  <page-content page-title="账户管理">
    <page-container>
      <md-table-card>
        <el-table ref="multipleTable" v-loading.body="loading" element-loading-text="拼命加载中" :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange" @sort-change="createDateSort">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="accountName" label="账户" width="180">
          </el-table-column>
          <el-table-column prop="nickName" label="昵称" width="180">
          </el-table-column>
          <el-table-column prop="mobile" label="手机号码">
          </el-table-column>
          <el-table-column prop="email" label="电子邮件">
          </el-table-column>
          <el-table-column prop="createDate" label="创建时间" sortable="custom" :formatter="formatter">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template scope="scope">
              <el-button @click="show" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <md-layout class="footer">
          <md-layout md-align="start">
            <span class="wrapper">
                <md-button class="md-raised md-primary">新增</md-button>
                <md-button id="delete" class="md-raised md-warn" disabled>删除</md-button>
            </span>
          </md-layout>
          <md-layout md-align="center">
            <el-pagination 
                class="page-block"
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" 
                :current-page="pageInfo.number + 1" 
                :page-sizes="[10,50,100]" 
                :page-size="10" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="pageInfo.totalElements">
            </el-pagination>
          </md-layout>
        </md-layout>

      </md-table-card>
    </page-container>

  </page-content>
</template>

<style scoped>
  .wrapper{
    margin-top:30px;
    margin-left:10px;
  }
  .page-block{
    position:absolute;
    bottom:2px;
  }
  .footer{
    height:100px;
    padding-top:-10;
  }
</style>


<script lang="babel">

  import {ACCOUNT_RESOURCE} from '../../api/account/account-api';
  import Qs from 'qs';

  export default {
    data: () => ({
      tableData: [],
      loading: false
    }),
    methods: {
      handleSizeChange() {
        //触发 PageSize 变化后的回调
      },
      handleCurrentChange() {
        //当前也变更后的回调
      },
      handleSelectionChange(selectData) {
        // 这里 selectData是一个数组对象，可以 forEach 遍历出来
        console.info(selectData);
      },
      createDateSort(page) {
        // page 对象包含排序字段以及排序方式
        console.info(page);
      },
      show() {
        console.log(1);
      },
      formatter(row) {
        return this.$moment(new Date(row.createDate))
                  .format('YYYY-MM-DD HH:mm:ss');
      },
      queryPage(data) {
  
        let self = this;

        self.loading = true;
        /**
         *  请求资源并渲染表格
         */
        self.accounts = [];
        self.$axios.get(ACCOUNT_RESOURCE, {
          params: data,
          paramsSerializer: function(params) {
            return Qs.stringify(params, { indices: false });
          }
        }).then((resp) => {
          if (resp.data.done) {
            let pageContent = resp.data.data;
  
            this.pageInfo = pageContent;
            if (pageContent.numberOfElements > 0) {
              this.tableData = pageContent.content;
            }

            self.loading = false;
          } else {
            console.error('something is wrong with resources access');
            self.$message.error('系统故障，请联系管理员！ಥ_ಥ');
          }
        });
      }
    },
    mounted() {
      this.queryPage();
    }
  };
</script>
