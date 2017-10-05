<template>
    <page-content page-title="角色管理">
        <page-container>
            <!-- 面包屑 -->
            <el-breadcrumb separator=">" style="margin-bottom:20px">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 删除确认弹出框 -->
            <el-dialog title="警告" :visible.sync="dialogDeleteVisible" size="tiny">
                <span>确认删除这 {{ this.selectData.length }} 条记录？</span>
                <span slot="footer" class="dialog-footer">
                    <md-button class="md-raised md-primary" @click="dialogDeleteVisible = false">取 消</md-button>
                    <md-button class="md-raised md-warn" @click="deleteSelectData('yes')">确 定</md-button>
                </span>
            </el-dialog>
            <!-- 新增面板 -->
            <el-dialog title="新增角色" :visible.sync="dialogAddFormVisible">
                <el-form :model="roleForm" :rules="addRules" label-position="left" ref="roleForm" label-width="80px">
                    <el-form-item label="角色名" prop="name" :label-width="formLabelWidth">
                        <el-input v-model="roleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="别称" prop="alias" :label-width="formLabelWidth">
                        <el-input v-model="roleForm.alias"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description" :label-width="formLabelWidth">
                        <el-input v-model="roleForm.description"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="permissions" :label-width="formLabelWidth">
                        <el-select multiple filterable remote placeholder="输入权限关键词" v-model="roleForm.permissions" :remote-method="queryPermissions" :loading="loadingPermission">
                            <el-option v-for="item in permsInline" :key="item.id" :label="item.alias" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="float:right">
                        <md-button @click="dialogAddFormVisible=false">取消</md-button>
                        <md-button class="md-raised md-accent" @click="resetForm('roleForm')">重置</md-button>
                        <md-button class="md-raised md-primary" @click="submitAddForm()">提交</md-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 主列表面板 -->
            <md-table-card>
                <el-table v-loading.body="loadingList" element-loading-text="玩命加载中" :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange" @sort-change="createDateSort">
                    <el-table-column type="expand">
                        <template scope="props">
                        <el-form label-position="left" inline class="table-expand">
                            <el-form-item label="角色名">
                            <span>{{ props.row.name }}</span>
                            </el-form-item>
                            <el-form-item label="别称">
                            <span>{{ props.row.alias }}</span>
                            </el-form-item>
                            <el-form-item label="描述">
                            <span>{{ props.row.description }}</span>
                            </el-form-item>
                            <el-form-item label="创建人">
                            <span>{{ props.row.createAccount }}</span>
                            </el-form-item>
                            <el-form-item label="创建时间">
                            <span>{{ formatterCreateDate(props.row) }}</span>
                            </el-form-item>
                            <el-form-item label="权限集合">
                            <span>{{ formatterPermissions(props.row) }}</span>
                            </el-form-item>
                        </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="name" label="角色名">
                    </el-table-column>
                    <el-table-column prop="alias" label="角色别称">
                    </el-table-column>
                    <el-table-column prop="description" label="描述">
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
import { ROLE_RESOURCE } from '../../../api/sys/role-api';
import { PERM_RESOURCE } from '../../../api/sys/permission-api';
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
    submitAddForm() {
      let self = this;

      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          self.$axios.post(ROLE_RESOURCE, self.roleForm)
              .then((resp) => {
                if (resp.data.done) {
                  self.$message({ message: '提交成功', type: 'success' });
                  self.dialogAddFormVisible = false;
                  this.resetForm('roleForm');
                  self.queryPage();
                } else {
                  self.$message({ message: resp.data.err, type: 'error' });
                }
              }).catch((error) => {
                console.error(error);
                self.$message({ message: '服务器故障，请联系管理员', type: 'error' });
              });
        }
      });
    },
    queryPermissions(query) {
      let self = this;

      self.loadingPermission = true;

      self.permsInline = [];
      self.$axios.get(PERM_RESOURCE, {
        params: {
          alias: query + ':Fuzzy'
        }
      }).then((resp) => {
        if (resp.data.done) {
          self.permsInline = resp.data.data.content;
          self.loadingPermission = false;
        }
      }).catch((error) => {
        console.error(error);
      });

    },
    handleSelectionChange(selectData) {
            // 这里 selectData是一个数组对象，可以 forEach 遍历出来
      this.cannotDelete = selectData.length === 0;
      this.selectData = selectData;
    },
    deleteSelectData(data) {
      if (data === undefined) {
        this.dialogDeleteVisible = true;
      } else if (data === 'yes') {
        let deleteIds = [];

        let self = this;

        this.selectData.forEach(function(element) {
          deleteIds.push(element.id);
        });
        this.$axios.delete(ROLE_RESOURCE,
          {
            data: {
              ids: deleteIds
            }
          }).then((resp) => {
            if (resp.data.done) {
              self.$message({ message: '删除成功', type: 'success' });
              self.dialogDeleteVisible = false;
              self.queryPage();
            } else {
              self.$message({ message: resp.data.err, type: 'error' });
            }
          }).catch((error) => {
            console.error(error);
            self.$message({ message: '服务器故障，请联系管理员', type: 'error' });
          });
      }
    },
    queryPage(query) {
      let self = this;

      self.loadingList = true;
      self.tableData = [];
      self.$axios.get(ROLE_RESOURCE, {
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
    formatterCreateDate(row) {
      return this.$moment(new Date(row.createDate))
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
    handleSizeChange() {

    },
    handleCurrentChange() {

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

