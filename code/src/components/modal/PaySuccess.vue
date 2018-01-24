<template>
  <div class="pay-success-main">
    <div class="pay-success-all">
      <div class="pay-success-top">
        <div class="pay-success-title">
          <div class="pay-success-img">
            <img src="../../assets/images/支付成果.png" alt="">
          </div>
          <p>恭喜您，支付成功</p>
        </div>
        <div class="clearfix"></div>
        <div class="pay-success-content">
          <p>
            <span class="right-span">您的支付方式：</span>
            <span class="left-span">{{type == 'alipay' ? '支付宝' : '微信'}}</span>
          </p>
          <p><span class="right-span">您的订单编号：</span><span class="left-span">{{orderId}}</span></p>
          <p><span class="right-span">支付金额：</span><span class="left-span">¥{{payTotal}}</span></p>
        </div>
      </div>
     <!--  <div class="pay-success-button">
          <el-button type="primary" @click="toOrder">查看订单详情</el-button>
          <el-button  @click="toFillInvioce">索要发票</el-button>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isDisabled:false,
      userId:localStorage.userId,
      orderId:this.$route.query.id || GetArgument().split('=')[1],
      payTotal:this.$route.query.payTotal || GetArgument().split('=')[1],
      type:this.$route.query.type || GetArgument().split('=')[1],
    }
  },
  methods:{
    /**
     * [查看订单]
     * @作者     王柳
     * @日期     2017-12-15
     */
   // toOrder(){
   //    if(env == 'dev'){
   //      this.$router.push({
   //        path:'/orderWrap',
   //        query:{
   //           id:this.userId
   //        }
   //      });
   //    }else if(env == 'prod'){
   //       CloseForm();
   //       if(Object.keys(localStorage).indexOf('isOrderPaied') !== -1) {
   //          localStorage.setItem('isOrderPaied',true);
   //       }
   //    }
   // },
   // toFillInvioce(){
   //   if(env == 'prod'){
   //       CloseForm();
   //       SetFormTitle('填写发票信息');
   //       if(Object.keys(localStorage).indexOf('isOrderPaied') !== -1) {
   //          localStorage.setItem('isOrderPaied',true);
   //       }
   //   }
   //   this.$router.push('/FillInvoice'); 
   //  }
  },
  beforeCreate() {
    // 设置当前窗口标题
    if(env == 'prod') {
      SetFormTitle('支付成功');
    }
  },
  mounted(){
   
  },
}

</script>
<style lang="less">


</style>
