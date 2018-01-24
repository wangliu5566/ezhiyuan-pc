<template>
  <div class="forget-main">
    <div class="forget-all">
      <div class="forget-title">
        <img src="../../assets/images/logo大.png" alt="">
        <span>{{resetPwd}}密码</span>
      </div>
       <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="forget-content">
        <el-form-item  prop="accountNumber" class="forget-item">
          <el-input prefix-icon=" " type="text" v-model="ruleForm.accountNumber" auto-complete="off" 
          placeholder="请输入手机号或/邮箱"></el-input>
          <input type="button" class="forget-code" value="获取验证码" readonly @click="getCode()"
          :disabled="getDisabled">
          <img src="../../assets/images/手机.png" alt="">
        </el-form-item>
        <el-form-item  prop="code" class="forget-item">
          <el-input prefix-icon=" " type="text" v-model="ruleForm.code" auto-complete="off" 
          placeholder="验证码"></el-input>
          <img src="../../assets/images/验证码.png" alt="">
        </el-form-item>
        <el-form-item  prop="password" class="forget-item">
          <el-input prefix-icon=" " type="password" v-model="ruleForm.password" 
          auto-complete="off" placeholder="请输入密码"></el-input>
          <img src="../../assets/images/钥匙.png" alt="">
        </el-form-item>
        <el-form-item  prop="checkPassword" class="forget-item">
          <el-input prefix-icon=" " type="password" v-model="ruleForm.checkPassword" auto-complete="off"
             placeholder="再次确认密码"></el-input>
             <img src="../../assets/images/钥匙.png" alt="">
        </el-form-item>
        <el-form-item style="margin-top:-20px">
          <el-button @click="forget('ruleForm')"  type="primary">确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定</el-button>
        </el-form-item>
<!--         <el-form-item>
          <span class="login-span fr">返回<span @click="login">登陆</span></span>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
export default {
  props:['index'],
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
        accountNumber:localStorage.userInfo ? (JSON.parse(localStorage.userInfo).MobileNumber ? JSON.parse(localStorage.userInfo).MobileNumber : JSON.parse(localStorage.userInfo).Email):'',
        getDisabled:false,

        resetPwd:'忘记',
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
              message: '请输入账号',
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
            { validator: validateCheckPassword, trigger: 'blur' }
          ],
        }
      };
  },
  methods:{
    //返回登录注册页面
    backLogin(){
      //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
       //options详细配置见util.js;
       this.goToUrl('/LoginMain',{
         query:[],
         winType:'个人中心',
         winTitle:'登录',
         isIndForm:true,
       });
    },
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
      // }else if(accountNumber != this.accountNumber){
      //   this.$message({
      //       message: '请输入已登录的手机号或者邮箱号！',
      //       type:'error'
      //   });
      //   this.ruleForm.accountNumber = '';
      // }else{
        this.getDisabled = true;
        this.$http.post("/Sms/Send", {
          type: 2,
          sendAddress:this.ruleForm.accountNumber
        })
        .then((res) => {
          console.log(res)
          if (res.data.Code == 200) {
            this.$message({
                message: '验证码已发送到您的手机，请注意查收！',
                type:'success'
            });
            
            $('.forget-code').css({
              'color':'#ccc',
              'cursor':'default'
            });
            this.remainTime = 60;
            $('.forget-code').val(this.remainTime + '秒');
            this.timer = setInterval(this.reduceTime,1000);
          }else{
            this.$message.warning(res.data.Description);
          }
        })
      // }
    },
     //定时器
    reduceTime(){
      if(this.remainTime < 1){
        this.remainTime = 0;
        clearInterval(this.timer);
        this.getDisabled = false;
        $('.forget-code').css({
          'color':'#00aeed',
          'cursor':'pointer'
        });
        $('.forget-code').val('重新获取验证码');
      }else{
        this.remainTime = this.remainTime -1;
        $('.forget-code').val(this.remainTime + '秒');
      }
    },
    /**
     * [新用户注册]
     * @作者     王柳
     * @日期     2017-11-22
     */
    forget(ruleForm){
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$http.post("/Passport/UpdatePassword", {
            account:this.ruleForm.accountNumber,
            validateCode: this.ruleForm.code,
            password:this.ruleForm.password,
            type:2
          })
          .then((res) => {
            console.log(res)
            if (res.data.Code == 200) {
              this.$message({
                  message: '修改密码成功！',
                  type:'success'
              });
              clearInterval(this.timer);
              var t = setTimeout(() => {
                 // this.backLogin();
                 if(env == 'prod') CloseForm();
              },1000);
            }else{
              this.$message.warning(res.data.Description);
            }
          })
        }
      })
    },
     //跳转到登录页面
    login(){
      clearInterval(this.timer);
      this.$router.push('/Login');
    }
  },
  beforeCreate() {
    //设置当前窗口
    if(env == 'prod') {
      SetWidthHeight(500,425);

      if(env == 'prod' ) {
        if(GetArgument() == 'updatePwd') {
          SetFormTitle('修改密码');
        }else {
          SetFormTitle('忘记密码');
        }
      };
      // SetFormTitle('重置密码');
    }
  },
  mounted(){
     if(env == 'prod' ) {
        if(GetArgument() == 'updatePwd') {
          this.resetPwd = '修改';
        }else {
          this.resetPwd = '忘记';
        }
      };
    // console.log(JSON.parse(localStorage.userInfo))
  },
}

</script>
<style lang="less">


</style>
