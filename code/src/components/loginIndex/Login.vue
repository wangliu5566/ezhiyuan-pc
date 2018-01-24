<template>
  <div class="login-main">
    <div class="login-all">
      <div class="login-title">
        <img src="../../assets/images/logo大.png" alt="">
        <span>登录您的账户</span>
      </div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-content">
        <el-form-item  prop="accountNumber" class="login-item">
          <el-input prefix-icon=" " type="text" v-model="ruleForm.accountNumber" 
          auto-complete="off" placeholder="请输入手机号或邮箱" >
          </el-input>
          <img src="../../assets/images/手机.png" alt="">
        </el-form-item>
        <el-form-item  prop="password" class="login-item input-two">
          <el-input prefix-icon=" " type="password" v-model="ruleForm.password" auto-complete="off"
          placeholder="请输入密码"></el-input>
          <img src="../../assets/images/钥匙.png" alt="">
        </el-form-item>
        <el-form-item class="check-box">
          <el-checkbox label="下次自动登录" name="type" v-model="isRemenber"></el-checkbox>
        </el-form-item>
        <el-form-item class="check-box">
          <el-button @click="login('ruleForm')" type="primary" >登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
        </el-form-item>
        <el-form-item>
          <span class="forget-span fl" @click="toPath('/ForgetPsd','忘记密码')">忘记密码？</span>
          <span class="register-span fr"@click="toPath('/Register','注册')">立即注册</span>
        </el-form-item>
      </el-form>
      
    </div>
  </div>
</template>
<script>
import hex_sha1 from '../../../static/js/sha1.js'
export default {
  data() {
      var regPhone=/^1[3|4|5|7|8][0-9]{9}$/;
      var regMail=/^[A-z0-9_]{3,12}@[A-z0-9]{2,12}(\.com|\.cn|\.com\.cn)$/;
      var validateAccountNumber = (rule, value, callback) => {
        if (regPhone.test(value) == false && regMail.test(value) == false) {
          this.ruleForm.accountNumber = '';
          callback(new Error('请输入有效的手机号或者邮箱号'));
        }else{
          callback();
        }
      };
      var validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if (/\D/g.test(value) || value.length < 6 || value.length > 12) {
          callback(new Error('只能输入6-12位数字！'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          accountNumber:localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).MobileNumber ? JSON.parse(localStorage.getItem('userInfo')).MobileNumber : '',
          password: '',
        },
        // rules: {
        //   accountNumber: [
        //     { validator: validateAccountNumber, trigger: 'blur' }
        //   ],
        //   password: [
        //     { validator: validatePassword, trigger: 'blur' }
        //   ],
        // },
        rules: {
          accountNumber: [
            { required: true,message:'账号不能为空！', trigger: 'blur' }
          ],
          password: [
            { required: true, message:'密码不能为空！',trigger: 'blur' }
          ],
        },
        isRemenber:true,
      };
  },
  methods:{
    //登录
    login(ruleForm){
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if(env == 'dev') {
            // hex_sha1(this.ruleForm.password + '')
             this.$http.post("/Passport/Login", {
                account:this.ruleForm.accountNumber,
                password:this.ruleForm.password
              })
              .then((res) => {
                if (res.data.Code == 200) {
                  console.log(res.data)
                  this.$message({
                      message: '登录成功！',
                      type:'success'
                  });
                  localStorage.setItem("userId",JSON.stringify(res.data.Data.Id));
                  localStorage.setItem("userInfo",JSON.stringify(res.data.Data));
                  // console.log(JSON.parse(localStorage.getItem('userInfo')));
                  

                  //保存账号密码
                  localStorage.setItem('account',this.ruleForm.accountNumber);
                  localStorage.setItem('password',this.ruleForm.password);
                  
                  //保存accessToken
                  localStorage.setItem('accessToken',res.data.Data.ExtendData.AccessToken);
                  localStorage.setItem('accessTokenExpTime',res.data.Data.ExtendData.AccessTokenExpirationTime);
                }else{
                  this.$message.warning(res.data.Description);
                }
              })
          }else if(env == 'prod') {
             var winResult = Login('post','/Passport/Login',JSON.stringify(this.combineSystemParams({
                account:this.ruleForm.accountNumber,
                password:this.ruleForm.password
             })),this.ruleForm.accountNumber,this.ruleForm.password,false,this.isRemenber,'');  
             
             console.log(winResult)
             winResult = JSON.parse(winResult);

             if (winResult.Success) {
                this.$message({
                    message: '登录成功！',
                    type:'success'
                });

                localStorage.setItem("userId",JSON.stringify(winResult.Data.Id));
                localStorage.setItem("userInfo",JSON.stringify(winResult.Data));

                //保存账号密码
                localStorage.setItem('account',this.ruleForm.accountNumber);
                localStorage.setItem('password',this.ruleForm.password);
                
                //保存accessToken
                localStorage.setItem('accessToken',winResult.Data.ExtendData.AccessToken);
                localStorage.setItem('accessTokenExpTime',winResult.Data.ExtendData.AccessTokenExpirationTime);
                

                setTimeout(()=>{
                   CloseForm();
                }, 1000)
              }else{
                this.$message.warning(winResult.Description);
              }
          }
        }
      })
    },
    //跳转到相应产品页
    toPath(page,title){
      //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
       //options详细配置见util.js;
       // this.goToUrl(page,{
       //   query:[],
       //   winType:'个人中心',
       //   winTitle:title,
       //   isIndForm:true,
       // });
       if(env == 'prod') SaveArgument(title);
       this.$router.push(page);
    }
  },
  beforeCreate() {
    //设置当前窗口
    if(env == 'prod') {
      SetWidthHeight(500,400);
      SetFormTitle('登录');
    }
  },
  mounted(){
    // console.log(systemParams);
  },
}

</script>
<style lang="less">


</style>
