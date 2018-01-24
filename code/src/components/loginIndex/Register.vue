<template>
  <div class="register-main">
    <div class="register-all">
      <div class="register-title">
        <img src="../../assets/images/logo大.png" alt="">
        <span>注册专属账户</span>
      </div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="register-content">
        <el-form-item  prop="accountNumber" class="register-item">
          <el-input prefix-icon=" " type="text" v-model="ruleForm.accountNumber" auto-complete="off" 
          placeholder="请输入手机号或/邮箱"></el-input>
          <input type="button" class="register-code" value="获取验证码" @click="getCode()" 
          :disabled="getDisabled">
          <img src="../../assets/images/手机.png" alt="">
        </el-form-item>
        <el-form-item  prop="code" class="register-item">
          <el-input prefix-icon=" " type="text" v-model="ruleForm.code" auto-complete="off" placeholder="验证码"></el-input>
          <img src="../../assets/images/验证码.png" alt="">
        </el-form-item>
        <el-form-item  prop="password" class="register-item">
          <el-input prefix-icon=" " type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
          <img src="../../assets/images/钥匙.png" alt="">
        </el-form-item>
        <el-form-item  prop="checkPassword" class="register-item">
          <el-input prefix-icon=" " type="password" v-model="ruleForm.checkPassword" auto-complete="off"
             placeholder="再次确认密码"></el-input>
          <img src="../../assets/images/钥匙.png" alt="">
        </el-form-item>
        <el-form-item style="margin-top:-20px">
          <el-button @click="register('ruleForm')" type="primary" :disabled="isRegDisabled">注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</el-button>
        </el-form-item>
        <el-form-item>
          <span class="login-span fr">已有账号，马上<span @click="backToLogin">登录</span></span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
export default {
  data() {
      var validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if (/\D/g.test(value) || value.length < 6 || value.length > 12) {
          callback(new Error('只能输入6-12位数字！'));
        } else {
          callback();
        }
      };
      var validateCheckPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        isRegDisabled:false,
        getDisabled:false,
        remainTime:60,
        timer:'',
        ruleForm: {
          accountNumber: '',
          code: '',
          password:'',
          checkPassword:''
        },
        // rules: {
        //   accountNumber: [
        //     { 
        //       required: true,
        //       message: '请输入手机号或邮箱',
        //       trigger: 'blur'
        //     }
        //   ],
        //   code: [
        //     { 
        //       required: true,
        //       message: '请输入验证码',
        //       trigger: 'blur'
        //    }
        //   ],
        //   password: [
        //     { validator: validatePassword, trigger: 'blur' }
        //   ],
        //   checkPassword: [
        //     { validator: validateCheckPassword, trigger: 'blur' }
        //   ],
        // }
         rules: {
          accountNumber: [
            { 
              required: true,
              message: '请输入手机号或邮箱',
              trigger: 'blur'
            }
          ],
          code: [
            { 
              required: true,
              message: '请输入验证码',
              trigger: 'blur'
           }
          ],
          password: [
            {  required: true,min:6,max:16,trigger: 'blur',message: '请输入6-16位字符！', }
          ],
          checkPassword: [
            {  required: true,validator:validateCheckPassword,trigger: 'blur' }
          ],
        }
      };
  },
  methods:{
    /**
     * [获取验证码]
     * @作者     王柳
     * @日期     2017-11-22
     */
    getCode(){
      // var regPhone=/^1[3|4|5|7|8][0-9]{9}$/;
      // var regMail=/^[A-z0-9_]{3,12}@[A-z0-9]{2,12}(\.com|\.cn|\.com\.cn)$/;
      // var accountNumber = this.ruleForm.accountNumber;
      // if(regPhone.test(accountNumber) == false && regMail.test(accountNumber) == false){
      //   this.$message({
      //       message: '请输入有效的手机号或者邮箱号！',
      //       type:'error'
      //   });
      //   this.ruleForm.accountNumber = '';
      // }else{
        this.getDisabled = true;
        this.$http.post("/Sms/Send", {
          type: 1,
          sendAddress:this.ruleForm.accountNumber
        })
        .then((res) => {
          console.log(res)
          if (res.data.Code == 200) {
            this.$message({
                message: '验证码已发送到您的手机或邮箱，请注意查收！',
                type:'success'
            });
            
            $('.register-code').css({
              'color':'#ccc',
              'cursor':'default'
            });
            this.remainTime = 60;
            $('.register-code').val(this.remainTime + '秒');
            this.timer = setInterval(this.reduceTime,1000);
          }else{
            this.$message.warning(res.data.Description);
          }
        })
      // }
    },
    //定时器1
    reduceTime(){
      if(this.remainTime < 1){
        this.remainTime = 0;
        clearInterval(this.timer);
        this.getDisabled = false;
        $('.register-code').css({
          'color':'#00aeed',
          'cursor':'pointer'
        });
        $('.register-code').val('重新获取验证码');
      }else{
        this.remainTime = this.remainTime -1;
        $('.register-code').val(this.remainTime + '秒');
      }
    },
    /**
     * [新用户注册]
     * @作者     王柳
     * @日期     2017-11-22
     */
    register(ruleForm){
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.isRegDisabled = true;
          this.$http.post("/Passport/Register", {
            account:this.ruleForm.accountNumber,
            validateCode: this.ruleForm.code,
            password:this.ruleForm.password
          })
          .then((res) => {
            if (res.data.Code == 200) {
              this.$message({
                  message: '注册成功！',
                  type:'success'
              });
              clearInterval(this.timer);
              this.login();

            }else{
              this.isRegDisabled = false;
              this.$message.warning(res.data.Description);
            }
          })
        }
      })
    },
    //跳转到登录页面
    login(){
      if(env == 'dev') {
        this.$router.push('/Login');
        return;
      }

      var winResult = Login('post','/Passport/Login',JSON.stringify(this.combineSystemParams({
          account:this.ruleForm.accountNumber,
          password:this.ruleForm.password
       })),this.ruleForm.accountNumber,this.ruleForm.password,false,true,'');

       winResult = JSON.parse(winResult);

       if (winResult.Success) {

          localStorage.setItem("userId",JSON.stringify(winResult.Data.Id));
          localStorage.setItem("userInfo",JSON.stringify(winResult.Data));
          
          //保存accessToken
          localStorage.setItem('accessToken',winResult.Data.ExtendData.AccessToken);
          localStorage.setItem('accessTokenExpTime',winResult.Data.ExtendData.AccessTokenExpirationTime);
          
          setTimeout(()=>{
            // OpenForm(500,410,'/index.html#/PersonalCenter','补充个人信息');
            // CloseForm();
            this.$router.push('/PersonalCenter');
          }, 1000)
        }else{
          this.$message.warning(winResult.Description);
        }
    },

    /**
     * [backToLogin 返回登录]
     * @Author   罗文
     * @DateTime 2017-12-11
     * @return   {[type]}   [description]
     */
    backToLogin() {
      clearInterval(this.timer);
       this.$router.push('/Login');
    }
  },
  beforeCreate() {
    //设置当前窗口
    if(env == 'prod') {
      SetWidthHeight(500,445);
      SetFormTitle('注册');
    }
  },
  mounted(){
    
  },
}

</script>
<style lang="less">


</style>
