<template>
  <div class="forget-main">
    <div class="forget-all">
      <div class="forget-title">
        <img src="../../assets/images/logo大.png" alt="">
        <span>修改密码</span>
      </div>
       <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="forget-content">
        <el-form-item  prop="oldPassword" class="forget-item">
          <el-input prefix-icon=" " type="password" v-model="ruleForm.oldPassword" auto-complete="off" 
          placeholder="请输入旧密码"></el-input>
          <img src="../../assets/images/钥匙.png" alt="">
        </el-form-item>
        <el-form-item  prop="newPassword" class="forget-item">
          <el-input prefix-icon=" " type="password" v-model="ruleForm.newPassword" 
          auto-complete="off" placeholder="请输入密码"></el-input>
          <img src="../../assets/images/钥匙.png" alt="">
        </el-form-item>
        <el-form-item  prop="checkNewPassword" class="forget-item">
          <el-input prefix-icon=" " type="password" v-model="ruleForm.checkNewPassword" auto-complete="off"
             placeholder="再次确认密码"></el-input>
             <img src="../../assets/images/钥匙.png" alt="">
        </el-form-item>
        <el-form-item style="margin-top:40px">
          <el-button @click="editPassword('ruleForm')"  type="primary">确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定</el-button>
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
        } else if (value !== this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          oldPassword: '',
          newPassword: '',
          checkNewPassword:''
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
          oldPassword: [
            { 
              required: true,
              message: '请输入旧密码',
              trigger: 'blur'
           }
          ],
          newPassword: [
             {  required: true,min:6,max:16,trigger: 'blur',message: '请输入6-16位字符！', }
          ],
          checkNewPassword: [
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
     * [修改密码]
     * @作者     王柳
     * @日期     2017-11-22
     */
    editPassword(ruleForm){
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$http.post("/Passport/UpdatePassword", {
            oldPassword:this.ruleForm.oldPassword,
            password: this.ruleForm.newPassword,
            type:3
          })
          .then((res) => {
            console.log(res)
            if (res.data.Code == 200) {
              this.$message({
                  message: '修改密码成功！',
                  type:'success'
              });
              
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
      SetFormTitle('修改密码');
    }
  },
  mounted(){
    
  },
}

</script>
<style lang="less">


</style>
