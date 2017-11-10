<template>
    <page-content page-title="权限管理">
        <page-container>
            <!-- 面包屑 -->
            <el-breadcrumb separator=">" style="margin-bottom:20px">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 主面板 -->
            <md-table-card>
                <el-table ref="moduleTable" v-loading.body="loadingList" element-loading-text="玩命加载中" :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange" @sort-change="createDateSort">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="name" label="权限名称">
                    </el-table-column>
                    <el-table-column prop="alias" label="权限别称">
                    </el-table-column>
                    <el-table-column prop="createDate" label="创建时间" sortable="custom" :formatter="formatterCreateDate">
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template scope="scope">
                            <el-button type="text" size="small">编辑</el-button>
                            <el-button type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <md-layout class="footer">
                    <md-layout md-align="center">
                        <el-pagination class="page-block" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.number===NaN?0:pageInfo.number + 1" :page-sizes="[10,50,100]" :page-size="pageInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalElements===NaN?0:pageInfo.totalElements">
                        </el-pagination>
                    </md-layout>
                </md-layout>
            </md-table-card>
        </page-container>
    </page-content>
</template>
<<style>
/** 表格底部 **/
.wrapper {
  margin-top: 30px;
  margin-left: 10px;
}

.page-block {
  position: absolute;
  bottom: 2px;
}

.footer {
  height: 100px;
  padding-top: -10;
}
</style>

<<script>

import { PERM_RESOURCE } from '../../../api/sys/permission-api';
import Qs from 'qs';

export default {
  data() {
    return {
      loadingList: false,
      dialogAddFormVisible: false,
      tableData: []
    };
  },
  methods: {
    handleSizeChange(size) {
      this.queryPage({size: size});
    },
    handleCurrentChange(currPage) {
      this.queryPage({page: currPage});
    },
    handleSelectionChange() {

    },
    createDateSort() {

    },
    formatterCreateDate(row) {
      return this.$moment(new Date(row.createDate))
                  .format('YYYY-MM-DD HH:mm:ss');
    },
    queryPage(query) {
      let self = this;

      self.loadingList = true;
        /**
         *  请求资源并渲染表格
         */
      self.tableData = [];
      self.$axios.get(PERM_RESOURCE, {
        params: query,
        paramsSerializer: function(params) {
          return Qs.stringify(params, { indices: false });
        }
      }).then((resp) => {
        if (resp.data.done) {
          let pageContent = resp.data.data;

          this.pageInfo = pageContent;
          if (pageContent.numberOfElements > 0) {
            self.tableData = pageContent.content;
          }
          self.loadingList = false;
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
