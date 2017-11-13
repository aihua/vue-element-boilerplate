<template>
  <page-content page-title="会员管理">
    <page-container>
      <!-- 面包屑 -->
      <el-breadcrumb separator=">" style="margin-bottom:20px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 删除确认弹出框 -->
      <el-dialog title="警告" :visible.sync="dialogDeleteVisible" size="tiny">
        <span>确认删除这 {{ this.selectData.length }} 条记录？</span>
        <span slot="footer" class="dialog-footer">
                    <md-button class="md-raised md-primary" @click="dialogDeleteVisible = false">取 消</md-button>
                    <md-button class="md-raised md-warn" @click="deleteSelectData('yes')">确 定</md-button>
                </span>
      </el-dialog>
      <!-- 主列表面板 -->
      <md-table-card>
        <el-table v-loading.body="loadingList" element-loading-text="玩命加载中" :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange" @sort-change="createDateSort">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="会员编码">
                  <span>{{ props.row.memberCode}}</span>
                </el-form-item>
                <el-form-item label="会员姓名">
                  <span>{{ props.row.memberName }}</span>
                </el-form-item>
                <el-form-item label="手机号码">
                  <span>{{ props.row.mobile }}</span>
                </el-form-item>
                <el-form-item label="会员邮箱">
                  <span>{{ props.row.email }}</span>
                </el-form-item>
                <el-form-item label="分销渠道">
                  <span>{{ props.row.email }}</span>
                </el-form-item>
                <el-form-item label="对接人">
                  <span>{{ props.row.email}}</span>
                </el-form-item>
                <el-form-item label="最后登录时间">
                  <span>{{ formatterLastLoginDate(props.row) }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="memberCode" label="会员编码">
          </el-table-column>
          <el-table-column prop="memberName" label="会员姓名">
          </el-table-column>
          <el-table-column prop="mobile" label="手机号码">
          </el-table-column>
          <el-table-column prop="email" label="会员邮箱">
          </el-table-column>
          <el-table-column prop="description" label="分销渠道">
          </el-table-column>
          <el-table-column prop="description" label="对接人">  
          </el-table-column>
          <el-table-column prop="createDate" label="最后登录时间" sortable="custom" :formatter="formatterLastLoginDate">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template scope="scope">
              <el-button type="text" size="small">编辑</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <md-layout class="footer">
          <md-layout md-align="start">
                        <span class="wrapper">
                            <md-button class="md-raised md-primary" @click="dialogAddFormVisible = true">新增</md-button>
                            <md-button class="md-raised md-warn" @click="deleteSelectData()" :disabled="cannotDelete">删除</md-button>
                        </span>
          </md-layout>
          <md-layout md-align="center">
            <el-pagination class="page-block" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.number===NaN?0:pageInfo.number + 1" :page-sizes="[10,50,100]" :page-size="pageInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalElements===NaN?0:pageInfo.totalElements">
            </el-pagination>
          </md-layout>
        </md-layout>
      </md-table-card>
    </page-container>
  </page-content>
</template>

<<style lang="scss">
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

  /** 展开 **/
  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

<script>
  import { MEMBER_RESOURCE } from '../../../api/member/member-api.js';
  import Qs from 'qs';

  export default {

    data() {
      return {
        pageInfo: {
          number: 0,
          totalElements: 0
        },
        roleForm: {
          name: '',
          alias: '',
          description: '',
          permissions: []
        },
        addRules: {
          name: [
            { required: true, message: '请输入角色名', trigger: 'blur' }
          ],
          alias: [
            { required: true, message: '请输入别称', trigger: 'blur' }
          ]
        },
        cannotDelete: true,
        selectData: [],
        tableData: [],
        loadingList: false,
        dialogDeleteVisible: false,
        dialogAddFormVisible: false,
        loadingPermission: false,
        formLabelWidth: '120px',
        permsInline: []
      };
    },
    methods: {

      handleSelectionChange(selectData) {
        // 这里 selectData是一个数组对象，可以 forEach 遍历出来
        this.cannotDelete = selectData.length === 0;
        this.selectData = selectData;
      },
      queryPage(query) {
        let self = this;

        self.loadingList = true;
        self.tableData = [];
        self.$axios.get(MEMBER_RESOURCE, {
          params: query,
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
            self.loadingList = false;
          } else {
            console.error('something is wrong with resources access');
            self.$message.error('系统故障，请联系管理员！ಥ_ಥ');
          }
        });
      },
      formatterLastLoginDate(row) {
        return this.$moment(new Date(row.lastLoginDate))
          .format('YYYY-MM-DD HH:mm:ss');
      },
      formatterPermissions(row) {
        let perms = '';

        row.permissions.forEach(
          (perm) => {
            perms += perm && perm.alias ? perm.alias + ' ' : '';
          }
        );
        return perms;
      },
      handleSizeChange(size) {
        this.queryPage({size: size});
      },
      handleCurrentChange(currPage) {
        this.queryPage({page: currPage});
      },
      createDateSort() {

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted() {
      this.queryPage();
    }
  };
</script>

