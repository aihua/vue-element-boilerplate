<template>
    <page-content page-title="模块管理">
        <page-container>
            <!-- 面包屑 -->
            <el-breadcrumb separator=">" style="margin-bottom:20px">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>模块管理</el-breadcrumb-item>
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
            <el-dialog title="新增模块" :visible.sync="dialogAddFormVisible">
                <el-form :model="addModuleForm" :rules="addRules" label-position="left" ref="addModuleForm" label-width="80px">
                    <el-form-item label="模块名" prop="name" :label-width="formLabelWidth">
                        <el-input v-model="addModuleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="模块别称" prop="alias" :label-width="formLabelWidth">
                        <el-input v-model="addModuleForm.alias"></el-input>
                    </el-form-item>
                    <el-form-item label="访问路径" prop="url" :label-width="formLabelWidth">
                        <el-input v-model="addModuleForm.url"></el-input>
                    </el-form-item>
                    <el-form-item label="icon" prop="icon" :label-width="formLabelWidth">
                        <el-input v-model="addModuleForm.icon"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description" :label-width="formLabelWidth">
                        <el-input v-model="addModuleForm.description"></el-input>
                    </el-form-item>
                    <el-form-item label="挂载模块" prop="parentId" :label-width="formLabelWidth">
                        <el-select filterable remote placeholder="输入模块关键词" v-model="addModuleForm.parentId" :remote-method="queryParent" :loading="loadingParent">
                            <el-option v-for="item in moduleOptions" :key="item.id" :label="item.alias" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否隐藏" prop="hidden" :label-width="formLabelWidth">
                        <el-switch v-model="addModuleForm.hidden" on-text="是" off-text="否">
                        </el-switch>
                    </el-form-item>
                    <el-form-item style="float:right">
                        <md-button @click="dialogAddFormVisible=false">取 消</md-button>
                        <md-button class="md-raised md-accent" @click="resetForm('addModuleForm')">重 置</md-button>
                        <md-button class="md-raised md-primary" @click="submitAddForm()">提 交</md-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 修改面板 -->
            <el-dialog title="修改模块" :visible.sync="dialogAlterFormVisible">
                <el-form :model="alterModuleForm" :rules="addRules" label-position="left" ref="alterModuleForm" label-width="80px">
                    <el-form-item label="模块名" prop="name" :label-width="formLabelWidth">
                        <el-input v-model="alterModuleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="模块别称" prop="alias" :label-width="formLabelWidth">
                        <el-input v-model="alterModuleForm.alias"></el-input>
                    </el-form-item>
                    <el-form-item label="访问路径" prop="url" :label-width="formLabelWidth">
                        <el-input v-model="alterModuleForm.url"></el-input>
                    </el-form-item>
                    <el-form-item label="icon" prop="icon" :label-width="formLabelWidth">
                        <el-input v-model="alterModuleForm.icon"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description" :label-width="formLabelWidth">
                        <el-input v-model="alterModuleForm.description"></el-input>
                    </el-form-item>
                    <el-form-item label="挂载模块" prop="parentId" :label-width="formLabelWidth">
                        <el-select filterable remote placeholder="输入模块关键词" v-model="alterModuleForm.parent" :remote-method="queryParent" :loading="loadingParent">
                            <el-option v-for="item in moduleOptions" :key="item.id" :label="item.alias" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否隐藏" prop="hidden" :label-width="formLabelWidth">
                        <el-switch v-model="alterModuleForm.hidden" on-text="是" off-text="否">
                        </el-switch>
                    </el-form-item>
                    <el-form-item style="float:right">
                        <md-button @click="dialogAlterFormVisible=false">取 消</md-button>
                        <md-button class="md-raised md-accent" @click="resetForm('alterModuleForm')">重 置</md-button>
                        <md-button class="md-raised md-primary" @click="submitAlterForm()">提 交</md-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 主面板 -->
            <md-table-card>
                <el-table ref="moduleTable" v-loading.body="loadingList" element-loading-text="玩命加载中" :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange" @sort-change="createDateSort">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="name" width="120" label="模块名"></el-table-column>
                    <el-table-column prop="alias" width="100" label="模块别称"></el-table-column>
                    <el-table-column prop="url" width="200" label="模块访问路径"></el-table-column>
                    <el-table-column prop="icon" width="100" label="模块icon"></el-table-column>
                    <el-table-column prop="permission" width="250" label="权限"></el-table-column>
                    <el-table-column prop="parent" label="父级模块" :formatter="formatterParent"></el-table-column>
                    <el-table-column prop="createDate" label=" 创建时间" sortable="custom" :formatter="formatterCreateDate"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template scope="scope">
                            <el-button type="text" size="small" @click="showAlterPage(scope.row.id)">编辑</el-button>
                            <el-button type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <md-layout class="footer">
                    <md-layout md-align="start">
                        <span class="wrapper">
                            <md-button class="md-raised md-primary" @click="dialogAddFormVisible = true">新 增</md-button>
                            <md-button class="md-raised md-warn" @click="deleteSelectData()" :disabled="cannotDelete">删 除</md-button>
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
 
<script>
import { MODULE_RESOURCE } from '../../../api/sys/module-api';
// 解决多个同名字段的提交
import Qs from 'qs';

export default {
  data() {
    return {
      moduleOptions: [],
      tableData: [],
      selectData: [],
      addModuleForm: {
        name: '',
        alias: '',
        url: '',
        parentId: '',
        icon: '',
        description: '',
        hidden: false
      },
      alterModuleForm: {
        name: '',
        alias: '',
        url: '',
        parentId: '',
        icon: '',
        description: '',
        hidden: false
      },
      pageInfo: {
        number: 0,
        totalElements: 0
      },
      loadingList: false,
      loadingParent: false,
      formLabelWidth: '120px',
      dialogDeleteVisible: false,
      dialogAddFormVisible: false,
      dialogAlterFormVisible: false,
      cannotDelete: true,
      addRules: {
        name: [{ required: true, message: '请输入模块名', trigger: 'blur' }],
        alias: [{ required: true, message: '请输入别称', trigger: 'blur' }]
      }
    };
  },
  methods: {
    submitAddForm() {
      let self = this;

      this.$refs['addModuleForm'].validate((valid) => {
        if (valid) {
          self.$axios
            .post(MODULE_RESOURCE, self.addModuleForm)
            .then((resp) => {
              if (resp.data.done) {
                self.$message({ message: '提交成功', type: 'success' });
                self.dialogAddFormVisible = false;
                self.$refs['addModuleForm'].resetFields();
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
      });
    },
    submitAlterForm() {
      let self = this;

      this.$refs['alterModuleForm'].validate((valid) => {
        if (valid) {
          self.$axios
            .put(MODULE_RESOURCE, self.alterModuleForm)
            .then((resp) => {
              if (resp.data.done) {
                self.$message({ message: '提交成功', type: 'success' });
                self.dialogAlterFormVisible = false;
                self.$refs['alterModuleForm'].resetFields();
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
      });
    },
    showAlterPage(id) {
      // 编辑页面显示
      console.log(id);
      let self = this;

      this.dialogAlterFormVisible = true;
      this.$axios.get(MODULE_RESOURCE + '/' + id).then((resp) => {
        if (resp.data.done) {
          self.alterModuleForm = resp.data.data;
        } else {
          console.error('something is wrong with resources access');
          self.$message.error('系统故障，请联系管理员！ಥ_ಥ');
        }
      });
    },
    handleSizeChange(size) {
      this.queryPage({ size: size });
    },
    handleCurrentChange(currPage) {
      this.queryPage({ page: currPage });
    },
    handleSelectionChange(selectData) {
      // 这里 selectData是一个数组对象，可以 forEach 遍历出来
      this.cannotDelete = selectData.length === 0;
      this.selectData = selectData;
    },
    queryPage(query) {
      let self = this;

      self.loadingList = true;
      /**
         *  请求资源并渲染表格
         */
      self.tableData = [];
      self.$axios
        .get(MODULE_RESOURCE, {
          params: query,
          paramsSerializer: function(params) {
            return Qs.stringify(params, { indices: false });
          }
        })
        .then((resp) => {
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
    },
    createDateSort(page) {
      // page 对象包含排序字段以及排序方式
      console.info(page);
    },
    formatterCreateDate(row) {
      return this.$moment(new Date(row.createDate)).format(
        'YYYY-MM-DD HH:mm:ss'
      );
    },
    formatterParent(row) {
      return row && row.parent ? row.parent.name : '';
    },
    queryParent(query) {
      let self = this;

      self.loadingParent = true;
      /**
         *  请求资源并渲染表格
         */
      self.moduleOptions = [];
      self.$axios
        .get(MODULE_RESOURCE, {
          params: {
            alias: query + ':Fuzzy'
          },
          paramsSerializer: function(params) {
            return Qs.stringify(params, { indices: false });
          }
        })
        .then((resp) => {
          if (resp.data.done) {
            self.moduleOptions = resp.data.data.content;
            self.loadingParent = false;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteSelectData(data) {
      if (data === undefined) {
        this.dialogDeleteVisible = true;
      } else if (data === 'yes') {
        debugger;
        let deleteIds = [];

        let self = this;

        this.selectData.forEach(function(element) {
          deleteIds.push(element.id);
        });
        this.$axios
          .delete(MODULE_RESOURCE, {
            data: {
              ids: deleteIds
            }
          })
          .then((resp) => {
            if (resp.data.done) {
              self.$message({ message: '删除成功', type: 'success' });
              self.dialogDeleteVisible = false;
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
