<template>
  <page-content page-title="账户管理">
    <page-container>
      <!-- 面包屑 -->
      <el-breadcrumb separator=">" style="margin-bottom:20px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账户管理模块</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 删除确认弹出框 -->
      <el-dialog title="警告" :visible.sync="dialogVisible" size="tiny">
        <span>确认删除这 {{ this.selectData.length }} 条记录？</span>
        <span slot="footer" class="dialog-footer">
          <md-button class="md-raised md-primary" @click="dialogVisible = false">取 消</md-button>
          <md-button class="md-raised md-warn" @click="deleteSelectData('yes')">确 定</md-button>
        </span>
      </el-dialog>
      <!-- 新增面板 -->
      <el-dialog title="新增账户" :visible.sync="dialogAddFormVisible">
        <el-form :model="addAccountForm" :rules="addRules" label-position="left" ref="addAccountForm" label-width="80px">
          <el-form-item label="账户名" prop="accountName" :label-width="formLabelWidth">
            <el-input v-model="addAccountForm.accountName"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickName" :label-width="formLabelWidth">
            <el-input v-model="addAccountForm.nickName"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile" :label-width="formLabelWidth">
            <el-input v-model="addAccountForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
            <el-input v-model="addAccountForm.email"/>
          </el-form-item>
          <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
            <el-input type="password" v-model="addAccountForm.password"/>
          </el-form-item>
          <el-form-item label="再次输入密码" prop="checkPass" :label-width="formLabelWidth">
            <el-input type="password" v-model="addAccountForm.checkPass"/>
          </el-form-item>
          <el-form-item label="角色" prop="roles" :label-width="formLabelWidth">
            <el-select multiple filterable remote placeholder="输入角色关键词" 
                v-model="addAccountForm.roles"
                :remote-method="queryRoles"
                :loading="loadingRoles">
                <el-option
                    v-for="item in rolesInline"
                    :key="item.id"
                    :label="item.alias"
                    :value="item.id">
                  </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="float:right">
            <md-button @click="dialogAddFormVisible=false">取消</md-button>
            <md-button class="md-accent" @click="resetForm('addAccountForm')">重置</md-button>
            <md-button class="md-raised md-primary" @click="submitAddForm()">提交</md-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 查看面板 -->

      <!-- 主列表面板 -->
      <md-table-card>
        <el-table ref="multipleTable" v-loading.body="loadingList" element-loading-text="玩命加载中" :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange" @sort-change="createDateSort">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="账户名">
                  <span>{{ props.row.accountName }}</span>
                </el-form-item>
                <el-form-item label="昵称">
                  <span>{{ props.row.nickName }}</span>
                </el-form-item>
                <el-form-item label="手机号码">
                  <span>{{ props.row.mobile }}</span>
                </el-form-item>
                <el-form-item label="电子邮件">
                  <span>{{ props.row.email }}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{ formatterCreateDate(props.row) }}</span>
                </el-form-item>
                <el-form-item label="角色">
                  <span>{{ formatterRole(props.row) }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="accountName" label="账户">
          </el-table-column>
          <el-table-column prop="nickName" label="昵称">
          </el-table-column>
          <el-table-column prop="mobile" label="手机号码">
          </el-table-column>
          <el-table-column prop="email" label="电子邮件">
          </el-table-column>
          <el-table-column prop="roles" label="角色" :formatter="formatterRole">
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
          <md-layout md-align="start">
            <span class="wrapper">
              <md-button class="md-raised md-primary" @click="dialogAddFormVisible = true">新增</md-button>
              <md-button class="md-raised md-warn" @click="deleteSelectData()" :disabled="cannotDelete">删除</md-button>
            </span>
          </md-layout>
          <md-layout md-align="center">
            <el-pagination class="page-block" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.number===NaN?0:pageInfo.number + 1" :page-sizes="[10,50,100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalElements===NaN?0:pageInfo.totalElements">
            </el-pagination>
          </md-layout>
        </md-layout>

      </md-table-card>
    </page-container>

  </page-content>
</template>

<style scoped>
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


<script lang="babel">

  import {ACCOUNT_RESOURCE} from '../../../api/sys/account-api';
  import {ROLE_RESOURCE} from '../../../api/sys/role-api';
  import Qs from 'qs';

  export default {
    data() {
      // 密码两次输入核对
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.addAccountForm.checkPass !== '') {
            this.$refs.addAccountForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.addAccountForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
  
      return {
        pageInfo: {
          number: 0,
          totalElements: 0
        },
        tableData: [],
        selectData: [],
        dialogVisible: false,
        loadingList: false,
        loadingRoles: false,
        dialogAddFormVisible: false,
        formLabelWidth: '120px',
        rolesInline: [],
        addAccountForm: {
          accountName: '',
          nickName: '',
          mobile: '',
          email: '',
          password: '',
          checkPass: '',
          roles: []
        },
        addRules: {
          accountName: [
            { required: true, message: '请输入帐号', trigger: 'blur' },
            { min: 2, max: 20, message: '帐号长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          nickName: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 2, max: 20, message: '昵称长度在 2 到 10 个字符（支持中文）', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { min: 11, max: 11, message: '手机号码为11位', trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' },
            { required: true, min: 8, max: 30, message: '密码长度在 8 到 30 个字符', trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, min: 3, max: 5, trigger: 'blur' },
            { required: true, min: 8, max: 30, message: '密码长度在 8 到 30 个字符', trigger: 'blur' }
          ]
        },
        cannotDelete: true
      };
    },
    methods: {
      // 新增数据
      submitAddForm() {
        const self = this;
  
        self.$refs['addAccountForm'].validate((valid) => {
          if (valid) {
            self.$axios.post(ACCOUNT_RESOURCE, self.addAccountForm)
              .then((resp) => {
                if (resp.data.done) {
                  self.$message({ message: '提交成功', type: 'success' });
                  self.dialogAddFormVisible = false;
                  self.$refs['addAccountForm'].resetFields();
                  self.queryPage();
                } else {
                  self.$message({ message: resp.data.err, type: 'error' });
                }
              })
              .catch((error) => {
                console.error(error);
                self.$message({ message: '服务器故障，请联系管理员', type: 'error' });
              });
          }
        }
        );
      },
      handleSizeChange() {
        //触发 PageSize 变化后的回调
      },
      handleCurrentChange() {
        //当前也变更后的回调
      },
      handleSelectionChange(selectData) {
        // 这里 selectData是一个数组对象，可以 forEach 遍历出来
        this.cannotDelete = selectData.length === 0;
        this.selectData = selectData;
      },
      createDateSort(page) {
        // page 对象包含排序字段以及排序方式
        console.info(page);
      },
      show() {
        console.log(1);
      },
      formatterCreateDate(row) {
        return this.$moment(new Date(row.createDate))
                  .format('YYYY-MM-DD HH:mm:ss');
      },
      // 引入标签样式？
      formatterRole(row) {
        let roles = '';
  
        row.roles.forEach(
          (role) => {
            roles += role.alias + ' ';
          }
        );
        return roles.trim();
      },
      queryPage(data) {
  
        let self = this;

        self.loadingList = true;
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
            self.loadingList = false;
          } else {
            console.error('something is wrong with resources access');
            self.$message.error('系统故障，请联系管理员！ಥ_ಥ');
          }
        });
      },
      queryRoles(query) {
        let self = this;

        self.loadingRoles = true;

        self.rolesInline = [];
        self.$axios.get(ROLE_RESOURCE, {
          params: {
            alias: query + ':Fuzzy'
          }
        }).then((resp) => {
          if (resp.data.done) {
            self.rolesInline = resp.data.data;
            self.loadingRoles = false;
          }
        }).catch((error) => {
          console.error(error);
        });
  
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      deleteSelectData(data) {
        if (data === undefined) {
          this.dialogVisible = true;
        } else if (data === 'yes') {
          let deleteIds = [];

          let self = this;
  
          this.selectData.forEach(function(element) {
            deleteIds.push(element.id);
          });
          this.$axios.delete(ACCOUNT_RESOURCE,
            {
              data: {
                ids: deleteIds
              }
            }
          ).then((resp) => {
            if (resp.data.done) {
              self.$message({ message: '删除成功', type: 'success' });
              self.dialogVisible = false;
              self.queryPage();
            } else {
              self.$message({ message: resp.data.err, type: 'error' });
            }
          })
          .catch((error) => {
            console.error(error);
            self.$message({ message: '服务器故障，请联系管理员', type: 'error' });
          });
        }
      }
    },
    mounted() {
      this.queryPage();
    }
  };
</script>
