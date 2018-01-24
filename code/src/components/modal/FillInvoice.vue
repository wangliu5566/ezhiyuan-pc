<template>
  <div class="fill-invoice-main">
    <div class="fill-invoice-all">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="121px">
        <el-form-item  prop="invoiceType" label="发票类型：">
           <el-radio v-model="ruleForm.invoiceType" :label="1">普通发票</el-radio>
        </el-form-item>
        <el-form-item  prop="invoiceTitle" label="发票抬头：">
            <el-radio-group v-model="ruleForm.invoiceTitle" @change="selectChange">
              <el-radio :label="1">个人</el-radio>
              <el-radio :label="2">单位</el-radio>
            </el-radio-group>
          </el-input>
        </el-form-item>
        <el-form-item  prop="startContent" label="" v-show="showFlag">
          <el-input type="text" v-model="ruleForm.startContent" 
          auto-complete="off" placeholder="请输入公司名称" >
          </el-input>
        </el-form-item>
        <el-form-item  prop="taxpayerCode" label="纳税人识别号：" v-show="showFlag">
          <el-input v-model="ruleForm.taxpayerCode" auto-complete="off"
          placeholder="请输入纳税人识别号"></el-input>
        </el-form-item>
        <el-form-item  prop="taxpayerAddress" label="邮寄地址：">
          <el-input  v-model="ruleForm.taxpayerAdress" auto-complete="off"
          placeholder="请输入邮寄地址"></el-input>
        </el-form-item>
        <el-form-item  prop="taxpayerName" label="接收人姓名：">
          <el-input  v-model="ruleForm.taxpayerName" auto-complete="off"
          placeholder="请输入接收人姓名"></el-input>
        </el-form-item>
        <el-form-item  prop="taxpayerTelephone" label="接收人电话：">
          <el-input  v-model="ruleForm.taxpayerTelephone" auto-complete="off"
          placeholder="请输入接收人电话"></el-input>
        </el-form-item>
        <el-form-item id="lastItem">
           <el-button type="primary" @click="submitInvoice('ruleForm')">确定</el-button>
           <el-button @click="closeWindow">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showFlag:false,
      userId:localStorage.userId,
      orderId:this.$route.query.id || GetArgument().split('=')[1],
      ruleForm: {
          invoiceType:1,
          invoiceTitle:1,
          startContent: '',
          taxpayerCode: '',
          taxpayerAdress: '',
          taxpayerName: '',
          taxpayerTelephone: '',
        },
        rules: {
          startContent: [
            { message:'公司名称不能为空！', trigger: 'blur' }
          ],
          taxpayerCode: [
            { message:'纳税人识别号不能为空！',trigger: 'blur' }
          ],
          taxpayerAddress: [
            { message:'邮寄地址不能为空！',trigger: 'blur' }
          ],
          taxpayerName: [
            { message:'接收人姓名不能为空！',trigger: 'blur' }
          ],
          taxpayerTelephone: [
            { message:'接收人电话不能为空！',trigger: 'blur' }
          ],
        },
    }
  },
  methods:{
    /**
     * [提交发票内容]
     * @作者     王柳
     * @日期     2018-01-12
     */
   submitInvoice(ruleForm){
      var params = {};
      params = {
        OrderId: this.orderId,
        detailedAddress:this.ruleForm.taxpayerAdress,
        reciver:this.ruleForm.taxpayerName,
        mobilePhone:this.ruleForm.taxpayerTelephone,

        InvoiceContentType:this.ruleForm.invoiceType,
        Type:this.ruleForm.invoiceTitle,
        Title:this.ruleForm.startContent,
        Comment:'',
        CropIdentity:this.ruleForm.taxpayerCode,
      }
      this.$refs[ruleForm].validate((valid) => {
        if (valid) { 
          this.$http.post("/Order/SaveInvoiceAddress", params)
            .then((res) => {
              // console.log(res)
              if (res.data.Success == true) {
                 this.$http.post("/Invoice/Create", params)
                  .then((res) => {
                    // console.log(res)
                    if (res.data.Success == true) {
                      this.$message.success('发票申请成功！');
                    }else {
                      this.$message.error(res.data.Description);
                    }
                  })
              }
            })
        }
      })
   },
   //返回到上一级地址
   closeWindow(){
      if(env == 'prod'){
        CloseForm();
      }
   },
  //切换个人/单位
    selectChange(){
      // console.log(this.ruleForm.invoiceTitle)
      if(this.ruleForm.invoiceTitle == 2){
        this.showFlag = true;
        var lastItem = document.getElementById('lastItem');
        lastItem.style.cssText = "margin-top:30px";
      }else{
        this.showFlag = false;
         var lastItem = document.getElementById('lastItem');
         lastItem.style.cssText = "margin-top:140px";
      }
    }
  },
  beforeCreate() {
    //设置当前窗口
    // if(env == 'prod') {
    //   SetWidthHeight(500,390);
    // }
  },
  mounted(){
    
  },
}

</script>
<style lang="less">


</style>
