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
      <!-- 删除确认弹出框 specify one-->
      <el-dialog title="警告" :visible.sync="dialogDeleteOneVisible" size="tiny">
        <span> {{ this.deleteWarningMessage }} </span>
        <span slot="footer" class="dialog-footer">
          <md-button class="md-raised md-primary" @click="cancelDelete()">取 消</md-button>
          <md-button class="md-raised md-warn" @click="deleteItem()">确 定</md-button>
        </span>
      </el-dialog>
      <!-- 新增面板 -->
      <el-dialog title="新增会员" :visible.sync="dialogAddFormVisible">
        <el-form :model="addMemberForm" :rules="addRules" label-position="" ref="addMemberForm">
          <el-col :span="12">
            <el-form-item label="会员名称" prop="memberName" :label-width="formLabelWidth">
              <el-input v-model="addMemberForm.memberName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobile" :label-width="formLabelWidth">
              <el-input v-model="addMemberForm.mobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
            <el-input v-model="addMemberForm.email"/>
          </el-form-item>
          </el-col>
            <el-col :span="12">
          <el-form-item label="地区" prop="areaCode" :label-width="formLabelWidth">
          <el-input v-model="addMemberForm.areaCode"/>
        </el-form-item>
            </el-col>
          <el-col :span="12">
          <el-form-item label="销售渠道" prop="salesChannelIds" :label-width="formLabelWidth">
            <el-select name="addSalesChannelsSelect"  multiple filterable remote placeholder="输入销售渠道关键词"
                       v-model="addMemberForm.salesChannelIds"
                       :remote-method="querySalesChannel"
                       :loading="loadingSalesChannels">
              <el-option
                v-for="item in channelOptions"
                :key="item.id"
                :label="item.alias"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售代表" prop="sellerAccountId" :label-width="formLabelWidth">
              <el-select filterable remote placeholder="输入销售代表关键词"
                         v-model="addMemberForm.sellerAccountId"
                         :remote-method="queryUserInfo"
                         :loading="loadingSeller">
                <el-option v-for="item in sellerOptions" :key="item.id" :label="item.nickName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
            <el-input type="password" v-model="addMemberForm.password" placeholder="00000000" value="00000000"/>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="再次输入密码" prop="checkPass" :label-width="formLabelWidth">
            <el-input type="password" v-model="addMemberForm.checkPass" value="00000000"/>
          </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
              <el-radio class="radio" v-model="addMemberForm.gender" label="1">男</el-radio>
              <el-radio class="radio" v-model="addMemberForm.gender" label="0">女</el-radio>
            </el-form-item>
          </el-col>
         <el-col :span="12">
          <el-form-item label="用户头像" :label-width="formLabelWidth">
            <el-upload class="avatar-uploader"
                       action="" :show-file-list="false"
                       :before-upload="beforeAvatarUpload"
                       :http-request="addUserIcon"
                       style="display: inline;float:left;">
              <img v-if="userIcon" :src="userIcon" class="avatar" style="height: 180px">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip" style="text-align: center;">用户头像：大小不超过5M</div>
            </el-upload>
          </el-form-item>
          </el-col>
            <el-col :span="12">
            <el-form-item label="公司LOGO" :label-width="formLabelWidth">
            <el-upload class="avatar-uploader"
                       action="" :show-file-list="false"
                       :before-upload="beforeAvatarUpload"
                       :http-request="addUserLogoIcon"
                       style="display: inline;float:left;">
              <img v-if="userLogoIcon" :src="userLogoIcon" class="avatar" style="height: 180px">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip" style="text-align: center;">公司LOGO：大小不超过5M</div>
            </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
          <el-form-item style="float:right">
            <md-button @click="dialogAddFormVisible=false">取消</md-button>
            <md-button class="md-raised md-accent" @click="resetForm('addMemberForm')">重 置</md-button>
            <md-button class="md-raised md-primary" @click="submitAddForm()">提 交</md-button>
          </el-form-item>
          </el-col>
        </el-form>
      </el-dialog>

      <!-- 修改面板 -->
      <el-dialog title="修改会员" :visible.sync="dialogAlterFormVisible">
        <el-form :model="alterMemberForm" :rules="addRules" label-position="" ref="alterMemberForm" label-width="80px">
          <el-col :span="12">
            <el-form-item label="会员编码" prop="memberCode" :label-width="formLabelWidth">
              <el-input v-model="alterMemberForm.memberCode" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员名称" prop="memberName" :label-width="formLabelWidth">
              <el-input v-model="alterMemberForm.memberName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobile" :label-width="formLabelWidth">
              <el-input v-model="alterMemberForm.mobile" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
              <el-input v-model="alterMemberForm.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地区" prop="areaCode" :label-width="formLabelWidth">
              <el-input v-model="alterMemberForm.areaCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售渠道" prop="salesChannelIds" :label-width="formLabelWidth">
              <el-select name="editSalesChannelSelect"  multiple filterable remote placeholder="输入销售渠道关键词"
                         v-model="channelIdsForSelect"
                         :remote-method="querySalesChannel"
                         :loading="loadingSalesChannels">
                <el-option
                  v-for="item in channelOptions"
                  :key="item.id"
                  :label="item.alias"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售代表" prop="sellerAccountId" :label-width="formLabelWidth">
              <el-select filterable remote placeholder="输入销售代表关键词"
                         v-model="alterMemberForm.sellerAccountId"
                         :remote-method="queryUserInfo"
                         :loading="loadingSeller">
                <el-option v-for="item in sellerOptions" :key="item.id" :label="item.nickName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
              <el-radio class="radio" v-model="alterMemberForm.gender" label="1">男</el-radio>
              <el-radio class="radio" v-model="alterMemberForm.gender" label="0">女</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户头像" :label-width="formLabelWidth">
              <el-upload class="avatar-uploader"
                         action="" :show-file-list="false"
                         :before-upload="beforeAvatarUpload"
                         :http-request="addUserIcon"
                         style="display: inline;float:left;">
                <img v-if="userIcon" :src="userIcon" class="avatar" style="height: 180px">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip" style="text-align: center;">用户头像：大小不超过5M</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司LOGO" :label-width="formLabelWidth">
              <el-upload class="avatar-uploader"
                         action="" :show-file-list="false"
                         :before-upload="beforeAvatarUpload"
                         :http-request="addUserLogoIcon"
                         style="display: inline;float:left;">
                <img v-if="userLogoIcon" :src="userLogoIcon" class="avatar" style="height: 180px">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip" style="text-align: center;">公司LOGO：大小不超过5M</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="float:right">
              <md-button @click="dialogAlterFormVisible=false">取消</md-button>
              <md-button class="md-raised md-accent" @click="resetForm('alterMemberForm')">重 置</md-button>
              <md-button class="md-raised md-primary" @click="submitAlterForm()">提 交</md-button>
            </el-form-item>
          </el-col>
        </el-form>
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
                  <span>{{ formatterSalesChannel(props.row) }}</span>
                </el-form-item>
                <el-form-item label="对接人">
                  <span>{{ props.row.account.nickName}}</span>
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
          <el-table-column  prop="salesChannels" label="分销渠道"  :formatter="formatterSalesChannel">
          </el-table-column>
          <el-table-column prop="account.nickName" label="对接人">
          </el-table-column>
          <el-table-column prop="lastLoginDate" label="最后登录时间" sortable="custom" :formatter="formatterLastLoginDate">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template scope="scope">
              <el-button type="text" size="small" @click="showAlterPage(scope.row.id)">编辑</el-button>
              <el-button type="text" size="small" @click="showDeleteDialog(scope.row.id,scope.row.memberName)">删除</el-button>
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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<script>
  import { MEMBER_RESOURCE } from '../../../api/member/member-api.js';
  import { CHANNEL_RESOURCE } from '../../../api/cargo/channel-api.js';
  import { ACCOUNT_RESOURCE } from '../../../api/sys/account-api.js';
  import Qs from 'qs';
  import ElCol from 'element-ui/packages/col/src/col';

  export default {

    components: {ElCol},
    data() {
      // 密码两次输入核对
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.addMemberForm.checkPass !== '') {
            this.$refs.addMemberForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.addMemberForm.password) {
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
        roleForm: {
          name: '',
          alias: '',
          description: '',
          permissions: []
        },
        addRules: {
          memberName: [
            { required: true, message: '请输入会员名称', trigger: 'blur' },
            { min: 2, max: 20, message: '会员名称长度在 2 到 20 个字符', trigger: 'blur' }
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
        selectData: [],
        tableData: [],
        loadingList: false,
        loadingSalesChannels: false,
        dialogDeleteVisible: false,
        dialogAddFormVisible: false,
        dialogAlterFormVisible: false,
        loadingSeller: false,
        formLabelWidth: '120px',
        channelOptions: [],
        sellerOptions: [],
        channelIdsForSelect: [], // 渠道 ID 数组，用于给修改页面的 select 空间以数据绑定的功能实现
        userIcon: '', //用户头像
        userLogoIcon: '', //用户LOGO
        addMemberForm: {
          memberName: '',
          mobile: '',
          gender: '',
          areaCode: '',
          email: '',
          password: '',
          checkPass: '',
          userIcon: '',
          userLogoIcon: '',
          sellerAccountId: ''
        },
        alterMemberForm: {
          id: '',
          memberCode: '',
          memberName: '',
          mobile: '',
          gender: '',
          areaCode: '',
          email: '',
          userIcon: '',
          userLogoIcon: '',
          sellerAccountId: ''
        },
        cannotDelete: true,
        deleteWarningMessage: '',
        dialogDeleteOneVisible: false,
        deleteOneId: ''
      };
    },
    methods: {

      submitAddForm() {
        let self = this;

        self.addMemberForm.userIcon = this.userIcon;
        self.addMemberForm.userLogoIcon = this.userLogoIcon;
        this.$refs['addMemberForm'].validate((valid) => {
          if (valid) {
            self.$axios.post(MEMBER_RESOURCE, self.addMemberForm)
              .then((resp) => {
                if (resp.data.done) {
                  self.$message({ message: '提交成功', type: 'success' });
                  self.dialogAddFormVisible = false;
                  self.$refs['addMemberForm'].resetFields();
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
      showAlterPage(id) {
        // 编辑页面显示
        let self = this;

        this.dialogAlterFormVisible = true;
        this.$axios.get(MEMBER_RESOURCE + '/' + id)
          .then((resp) => {
            if (resp.data.done) {
              self.alterMemberForm = resp.data.data;
              self.channelOptions = resp.data.data.salesChannels;
              self.channelIdsForSelect = resp.data.data.salesChannels.map((item) => item.id);
              this.userIcon = resp.data.data.userIcon;
              this.userLogoIcon = resp.data.data.userLogoIcon;
              this.nickName = resp.data.data.account.nickName;
              self.sellerOptions.push(resp.data.data.account);
            } else {
              console.error('something is wrong with resources access');
              self.$message.error('系统故障，请联系管理员！ಥ_ಥ');
            }
          });
      },
      submitAlterForm() {
        let self = this;

        this.$refs['alterMemberForm'].validate((valid) => {
          if (valid) {
            self.alterMemberForm.salesChannelIds = self.channelIdsForSelect;
            debugger;
            self.$axios.put(MEMBER_RESOURCE, self.alterMemberForm)
              .then((resp) => {
                if (resp.data.done) {
                  self.$message({ message: '提交成功', type: 'success' });
                  self.dialogAlterFormVisible = false;
                  self.$refs['alterMemberForm'].resetFields();
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
      //图片上传
      //图片上传之前
      beforeAvatarUpload(file) {
        const isJPEG = file.type === 'image/jpeg';
        const isJPG = file.type === 'image/jpg';
        const isPNG = file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!(isJPG || isPNG || isJPEG)) {
          this.$message({
            message: '请上传格式为jpeg/jpg/png的图片!',
            type: 'error',
            duration: 2000
          });
        }
        if (!isLt5M) {
          this.$message({
            message: '上传的图片大小不能超过 5MB!',
            type: 'error',
            duration: 2000
          });
        }
        return (isJPG || isPNG || isJPEG) && isLt5M;
      },
      //图片上传请求
      addUserIcon(obj) {
        this.getImgObj(obj, 'userIcon');
      },
      addUserLogoIcon(obj) {
        this.getImgObj(obj, 'userLogoIcon');
      },
      //获取图片
      getImgObj(obj, action) {
        let flag = this.beforeAvatarUpload(obj.file);

        if (!flag) {
          return;
        }
        //上传
        var formData = new FormData();

        formData.append('file', obj.file);
        formData.append('name', 'file');
        this.uploadImg(formData, action);
      },
      /**
       * 上传图片 待实现
       */
      uploadImg(formData, action) {
        if (action === 'userIcon') {
          this.userIcon = 'https://tmallapi.bluemoon.com.cn/img/group1/M00/02/04/wKjwDVoQKjaAYKlwAAPliR3tKRA636.png';
        } else if (action === 'userLogoIcon') {
          this.userLogoIcon = 'https://tmallapi.bluemoon.com.cn/img/group1/M00/02/04/wKjwDVoQKjaAYKlwAAPliR3tKRA636.png';
        }
        /*baseAjax({
          url: api.sys_common.upload_img,
          data: formData,
          contentType: false,
          processData: false,
          async: false,
          cache: false,
          success: function(data) {
            this.lecturer.profilePictureUrl = data.url;
          }.bind(this)
        });*/
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
          this.$axios.delete(MEMBER_RESOURCE,
            {
              data: {
                ids: deleteIds
              }
            }
          ).then((resp) => {
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
      },
      showDeleteDialog(id, name) {
        var message = '是否删除名为 ' + name + ' 的会员？';

        this.deleteOneId = id;
        this.deleteWarningMessage = message;
        this.dialogDeleteOneVisible = true;
      },
      deleteItem() {
        let self = this;

        this.$axios.delete(MEMBER_RESOURCE + '/' + this.deleteOneId)
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
      formatterLastLoginDate(row) {
        if (row && row.lastLoginDate) {
          return this.$moment(new Date(row.lastLoginDate))
            .format('YYYY-MM-DD HH:mm:ss');
        }
        return '';

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
      formatterSalesChannel(row) {
        let salesChannels = '';

        row.salesChannels.forEach(
          (salesChannel) => {
            salesChannels += salesChannel && salesChannel.alias ? salesChannel.alias + ' ' : '';
          }
        );
        return salesChannels.trim();
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
      },
      querySalesChannel(query) {
        let self = this;

        self.loadingSalesChannels = true;

        self.channelOptions = [];
        self.$axios.get(CHANNEL_RESOURCE, {
          params: {
            alias: query + ':Fuzzy'
          }
        }).then((resp) => {
          if (resp.data.done) {
            self.channelOptions = resp.data.data.content;
            self.loadingSalesChannels = false;
          }
        }).catch((error) => {
          console.error(error);
        });
      },
      queryUserInfo(query) {
        let self = this;

        self.loadingSeller = true;
        /**
         *  请求资源并渲染表格
         */
        self.$axios.get(ACCOUNT_RESOURCE, {
          params: {
            nickName: query + ':Fuzzy'
          },
          paramsSerializer: function(params) {
            return Qs.stringify(params, { indices: false });
          }
        }).then((resp) => {
          if (resp.data.done) {
            self.sellerOptions = resp.data.data.content;
            self.loadingSeller = false;
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    },

    mounted() {
      this.queryPage();
    }
  };
</script>

