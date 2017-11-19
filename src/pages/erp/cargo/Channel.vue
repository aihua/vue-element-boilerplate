<template>
  <page-content page-title="销售渠道管理">
    <page-container>
      <!-- 面包屑 -->
      <el-breadcrumb separator=">" style="margin-bottom:20px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>销售渠道管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 删除确认弹出框 -->
      <el-dialog title="警告" :visible.sync="dialogDeleteVisible" size="tiny">
        <span>确认删除这 {{ this.selectData.length }} 条记录？</span>
        <span slot="footer" class="dialog-footer">
                    <md-button class="md-raised md-primary" @click="dialogDeleteVisible = false">取 消</md-button>
                    <md-button class="md-raised md-warn" @click="deleteSelectData('yes')">确 定</md-button>
                </span>
      </el-dialog>

      <!-- 删除确认弹出框 specify one-->
      <el-dialog title="警告" :visible.sync="dialogDeleteOneVisible" size="tiny">
        <span> {{ this.deleteWarningMessage }} </span>
        <span slot="footer" class="dialog-footer">
          <md-button class="md-raised md-primary" @click="cancelDelete()">取 消</md-button>
          <md-button class="md-raised md-warn" @click="deleteItem()">确 定</md-button>
        </span>
      </el-dialog>
      <!-- 新增面板 -->
      <el-dialog title="新增渠道" :visible.sync="dialogAddFormVisible">
        <el-form :model="addChannelForm" :rules="addRules" label-position="left" ref="addChannelForm" label-width="80px">
          <el-form-item label="渠道名" prop="name" :label-width="formLabelWidth">
            <el-input v-model="addChannelForm.name"></el-input>
          </el-form-item>
          <el-form-item label="渠道别称" prop="alias" :label-width="formLabelWidth">
            <el-input v-model="addChannelForm.alias"></el-input>
          </el-form-item>
          <el-form-item style="float:right">
            <md-button @click="dialogAddFormVisible=false">取消</md-button>
            <md-button class="md-raised md-accent" @click="resetForm('addChannelForm')">重置</md-button>
            <md-button class="md-raised md-primary" @click="submitAddForm()">提交</md-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 修改面板 -->
      <el-dialog title="修改渠道" :visible.sync="dialogAlterFormVisible">
        <el-form :model="alterChannelForm" :rules="addRules" label-position="left" ref="alterChannelForm" label-width="80px">
          <el-form-item label="渠道名" prop="name" :label-width="formLabelWidth">
            <el-input v-model="alterChannelForm.name"></el-input>
          </el-form-item>
          <el-form-item label="渠道别称" prop="alias" :label-width="formLabelWidth">
            <el-input v-model="alterChannelForm.alias"></el-input>
          </el-form-item>
          <el-form-item style="float:right">
            <md-button @click="dialogAlterFormVisible=false">取消</md-button>
            <md-button class="md-raised md-accent" @click="resetForm('alterChannelForm')">重 置</md-button>
            <md-button class="md-raised md-primary" @click="submitAlterForm()">提 交</md-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 主列表面板 -->
      <md-table-card>
        <el-table v-loading.body="loadingList" element-loading-text="玩命加载中" :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange" @sort-change="createDateSort">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="渠道名">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="渠道别称">
                  <span>{{ props.row.alias }}</span>
                </el-form-item>
                <el-form-item label="创建人">
                  <span>{{ props.row.createAccount }}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{ formatterCreateDate(props.row) }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="渠道名">
          </el-table-column>
          <el-table-column prop="alias" label="渠道别称">
          </el-table-column>
          <el-table-column prop="createAccount" label="创建人">
          </el-table-column>
          <el-table-column prop="createDate" label="创建时间" sortable="custom" :formatter="formatterCreateDate">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template scope="scope">
              <el-button type="text" size="small" @click="showAlterPage(scope.row.id)">编辑</el-button>
              <el-button type="text" size="small" @click="showDeleteDialog(scope.row.id,scope.row.name)">删除</el-button>
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
    width: 10%;
  }
</style>

<script>
  import { CHANNEL_RESOURCE } from '../../../api/cargo/channel-api';
  import Qs from 'qs';

  export default {

    data() {
      return {
        pageInfo: {
          number: 0,
          totalElements: 0
        },
        addChannelForm: {
          name: '',
          alias: ''
        },
        addRules: {
          name: [
            { required: true, message: '请输入渠道名', trigger: 'blur' }
          ],
          alias: [
            { required: true, message: '请输入渠道别称', trigger: 'blur' }
          ]
        },
        alterChannelForm: {
          id: '',
          name: '',
          alias: ''
        },
        cannotDelete: true,
        selectData: [],
        tableData: [],
        loadingList: false,
        dialogDeleteVisible: false,
        dialogAddFormVisible: false,
        dialogAlterFormVisible: false,
        loadingPermission: false,
        formLabelWidth: '120px',
        deleteWarningMessage: '',
        dialogDeleteOneVisible: false,
        deleteOneId: ''
      };
    },
    methods: {
      submitAddForm() {
        let self = this;

        this.$refs['addChannelForm'].validate((valid) => {
          if (valid) {
            self.$axios.post(CHANNEL_RESOURCE, self.addChannelForm)
              .then((resp) => {
                if (resp.data.done) {
                  self.$message({ message: '提交成功', type: 'success' });
                  self.dialogAddFormVisible = false;
                  this.resetForm('addChannelForm');
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
      submitAlterForm() {
        let self = this;

        this.$refs['alterChannelForm'].validate((valid) => {
          if (valid) {
            self.$axios.put(CHANNEL_RESOURCE, self.alterChannelForm)
              .then((resp) => {
                if (resp.data.done) {
                  self.$message({ message: '提交成功', type: 'success' });
                  self.dialogAlterFormVisible = false;
                  self.$refs['alterChannelForm'].resetFields();
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
          this.$axios.delete(CHANNEL_RESOURCE,
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
      showDeleteDialog(id, name) {
        var message = '是否删除名为 ' + name + ' 的渠道？';

        this.deleteOneId = id;
        this.deleteWarningMessage = message;
        this.dialogDeleteOneVisible = true;
      },
      deleteItem() {
        let self = this;

        this.$axios.delete(CHANNEL_RESOURCE + '/' + this.deleteOneId)
        .then((resp) => {
          if (resp.data.done) {
            self.$message({ message: '删除成功', type: 'success' });
            self.dialogDeleteOneVisible = false;
            self.deleteOneId = '';
            self.deleteWarningMessage = '';
            self.queryPage();
          } else {
            self.$message({ message: resp.data.err, type: 'error' });
          }
        });
      },
      cancelDelete() {
        this.dialogDeleteOneVisible = false;
        this.deleteOneId = '';
        this.deleteWarningMessage = '';
      },

      queryPage(query) {
        let self = this;

        self.loadingList = true;
        self.tableData = [];
        self.$axios.get(CHANNEL_RESOURCE, {
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
      showAlterPage(id) {
        // 编辑页面显示
        let self = this;

        this.dialogAlterFormVisible = true;
        this.$axios.get(CHANNEL_RESOURCE + '/' + id)
          .then((resp) => {
            if (resp.data.done) {
              self.alterChannelForm = resp.data.data;
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

