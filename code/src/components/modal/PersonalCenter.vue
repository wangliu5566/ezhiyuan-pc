<template>
  <div class="personal-main">
    <div class="personal-all">
      <div class="personal-title">
        <div class="personal-title-left fl">
          <div class="personal-img">
            <img :src="userData.UserFace?userData.UserFace:'./static/images/logo大.png'" alt="用户头像">
          </div>
          <span  @click="uploadCoverImg" v-if="!isUploadingCoverImg">修改头像</span>
          <span  v-else>正在上传...</span>
        </div>
        <div class="personal-title-right fl">
            <div >
              <span class="personal-title-span fl" >昵&nbsp;称：</span>
              <el-input type="text" auto-complete="off" v-model="userData.NickName" placeholder="请输入用户名" class="personal-title-input fl">
              </el-input>
            </div>
            <div class="clearfix">
              
            </div>
            <div class="title-right-two">
              <p class="title-right-p fl">所属机构：
                <el-button class="title-right-btn fr" @click="toBind">{{userData.ExtendData.OrganizationTitle && userData.ExtendData.OrganizationTitle !== ''?'查看绑定':'绑定机构'}}</el-button>
              </p>
            </div>
        </div>
      </div>
      <div class="clearfix"></div>
      <el-form :model="userData" status-icon ref="userDataForm" 
      class="personal-content" label-width="60px">
        <el-form-item  label="性别：" class="personal-item" >
           <el-radio-group v-model="userData.Sex">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
            <el-radio label="保密">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  label="年龄：" class="personal-item">
          <el-input type="text" v-model="userData.Age" 
          auto-complete="off" placeholder="请输入年龄" >
          </el-input>
        </el-form-item>
        <el-form-item  label="学历：" class="personal-item input-two">
          <el-select v-model="userData.Education" placeholder="请选择" style="width:100%">
            <el-option
              v-for="(item,index) in Educations"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职业：">
          <el-input v-model="userData.Profession" auto-complete="off"
          placeholder="请输入职业"></el-input>
        </el-form-item>
        <el-form-item >
          <div class="personal-btn fr">
            <el-button @click="cancleUpdate">取消</el-button>
            <el-button @click="updateUserInfo('userDataForm')">确定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="loading-content loading-other" v-show="loading">
        <img src="../../assets/images/loading.gif" alt="">
        <span>上传头像中，请稍等！</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
      return {
        userData:{
          ExtendData:{}
        },
        userId:localStorage.userId,
        Educations:['高中以下','高中','专科','本科','硕士','博士'],

        isUploadingCoverImg:false,
        loading: false,

      };
  },
  methods:{
    /**
     * [getUserDetail 获取用户详情]
     * @Author   罗文
     * @DateTime 2017-11-30
     * @return   {[type]}   [description]
     */
    getUserDetail() {
       this.$http.get("/User/Detail", {
          params:{
            id:this.userId,
          }
        })
        .then((res) => {
          if (res.data.Success) {
            console.log(res)
            this.userData = res.data.Data;
          }else{
            this.$message.warning(res.data.Description);
          }
        })
    },
    /**
     * [updateUserInfo 修改用户信息]
     * @Author   罗文
     * @DateTime 2017-11-30
     * @return   {[type]}   [description]
     */
    updateUserInfo() {
       if(this.userData.Age && this.userData.Age !== '') {
          if(/\D/g.test(this.userData.Age) || this.userData.Age < 15 || this.userData.Age > 90) {
            this.$message.error('年龄只能为15-90的整数');
            return ;
          }
       }
       
       this.$http.post("/User/Update", Object.assign({},this.userData,{userId:this.userId}))
        .then((res) => {
          if (res.data.Success) {
            this.$message.success(res.data.Description);
            if(env == 'prod') {
              setTimeout(()=>{
                CloseForm();
              },1000)
            }
          }else{
            this.$message.warning(res.data.Description);
          }
        })
    },
    //跳转到相应产品页
    toBind(){
       this.$router.push({
        path:'/BindOrganizor',
        query:{
          id:this.userData.Id
        }
       })
    },

    /**
     * [uploadCoverImg 修改用户头像]
     * @Author   罗文
     * @DateTime 2017-12-12
     * @return   {[type]}   [description]
     */
    uploadCoverImg() {
         this.isUploadingCoverImg = true;
         this.loading = true;
         EnableCloseBtn(true);

         setTimeout(()=>{
          UpLoadFile('图片|*.jpg;*.png',(imgUrlData)=>{

              imgUrlData = JSON.parse(imgUrlData);
              if(imgUrlData.Code == 200) {
                 this.userData.UserFace = imgUrlData.Description;
                 SetUserFace(imgUrlData.Description);
              }else {
                 if(imgUrlData.Description !== '未选择任何文件'){
                    this.$message.error(imgUrlData.Description);
                 }
              }

              EnableCloseBtn(false);
              this.loading = false;
              this.isUploadingCoverImg = false;
          })
         },100)
    },
    
    /**
     * [cancleUpdate 取消修改]
     * @Author   罗文
     * @DateTime 2017-12-12
     * @return   {[type]}   [description]
     */
    cancleUpdate() {
       if(env == 'prod') CloseForm();
    }
  },
  beforeCreate() {
    //设置当前窗口
    if(env == 'prod') {
      SetWidthHeight(500,548);
      SetFormTitle('个人信息');
    }
  },
  mounted(){
    this.getUserDetail();
  },
}

</script>
<style lang="less">
  .loading-other {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .loading-other img {
    margin-bottom: 10px;
  }

  .personal-img img {
    width: 100%;
    height: 100%
  }

</style>
