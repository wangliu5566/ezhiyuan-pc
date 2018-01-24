<template>
  <div class="invoice-detail-main">
    <div class="invoice-detail-all">
        <p>
          <span class="right-span">发票类型：</span>
          <span class="left-span">普通发票</span>
        </p>
        <p>
          <span class="right-span">开具状态：</span>
          <span class="left-span">{{invoiveDetail.State == 1 ? '未开' : '已开'}}</span>
        </p>
        <p>
          <span class="right-span">发票抬头：</span>
          <span class="left-span">{{invoiveDetail.Type == 1 ? '个人' : '单位'}}</span>
        </p>
        <p>
          <span class="right-span">纳税人识别号：</span>
          <span class="left-span">{{invoiveDetail.CropIdentity ? invoiveDetail.CropIdentity : '暂无数据'}}</span>
        </p>
        <p>
          <span class="right-span">邮寄地址：</span>
          <span class="left-span">{{invoiveDetail.AddressInfo ? invoiveDetail.AddressInfo.DetailedAddress : '暂无数据'}}</span>
        </p>
        <p>
          <span class="right-span">接收人姓名：</span>
          <span class="left-span">{{invoiveDetail.AddressInfo ? invoiveDetail.AddressInfo.Reciver : '暂无数据'}}</span>
        </p>
        <p>
          <span class="right-span">接收人电话：</span>
          <span class="left-span">{{invoiveDetail.AddressInfo ? invoiveDetail.AddressInfo.MobilePhone : '暂无数据'}}</span>
        </p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isDisabled:false,
      orderId:this.$route.query.id || GetArgument().split('=')[1],
      invoiveDetail:{}
    }
  },
  methods:{
    /**
     * [获取订单详情]
     * @作者     王柳
     * @日期     2018-01-17
     */
    getInvoiveDetail(){
      var params = {};
      params = {
        OrderId: this.orderId,
      }
       this.$http.get("/Invoice/GetByOrderId", {params})
        .then((res) => {
          console.log(res)
          if (res.data.Success == true) {
            this.invoiveDetail = res.data.Data;
          }else{
            this.$message.error(res.data.Description);
          }
       })
    }
  },
  mounted(){
    this.getInvoiveDetail();
  },
}

</script>
<style lang="less">


</style>
