<template>
  <div >
    <div class="pay-methods-main">
      <div class="pay-methods-all">
        <div class="pay-cancel">
          <el-button type="info" class="cancel-btn fr" @click="cancelPay">
            暂不支付
          </el-button>
        </div>
        <div class="clearfix"></div>
        <p class="pay-price">支付金额：¥<span>{{payTotal}}</span></p>
        <div class="pay-radio">
          <el-radio-group v-model="payType" @change="selectChange">
            <el-radio label="alipay">支付宝 
              <span class="pay-radio-span">推荐</span>
            </el-radio><br>
            <el-radio label="weixin">微信</el-radio>
          </el-radio-group>
        </div>
        <div>
          <el-button type="info" class="confirm-btn" @click="payment">
            确定支付
          </el-button>
        </div>
      </div>
    </div>
    <div id="pay" style="display:none"></div>
  </div>
</template>
<script>
import $ from 'jquery';
export default {
  data() {
    return {
      orderId:this.$route.query.id || GetArgument().split('&')[0],
      userId:localStorage.userId,
      payType:'alipay',
      payTotal:this.$route.query.payTotal || GetArgument().split('&')[1],
    }
  },
  methods:{
    //改变支付方式
    selectChange(){
      console.log(this.payType)
    },
    /**
     * [立即支付]
     * @作者     王柳
     * @日期     2017-12-14
     */
    payment(){
      if(this.payType == 'alipay'){
        var systemParams = {
          appId:'2',
          version:'1.0',
          deviceToken:localStorage.deviceToken,
          timestamp:new Date().getTime(),
          appVersion:'1.0.0',
          accessToken:localStorage.accessToken
        }
        var backUrl = "http://phei.kingchannels.cn/Pay/index.html#/PaySuccess?id=" + this.orderId +"&payTotal=" + this.payTotal +"&type=" + this.payType
        if(env == 'dev'){
           window.location.href="http://api.phei.kingchannels.cn/Pay/Index?orderId=" + this.orderId + "&payType=" + this.payType + "&returnUrl=" + encodeURIComponent(backUrl) + "&appId=" + systemParams.appId +"&version=" + systemParams.version +"&deviceToken=" + encodeURIComponent(systemParams.deviceToken) +"&timestamp=" + systemParams.timestamp +"&appVersion=" + systemParams.appVersion +"&accessToken=" + encodeURIComponent(localStorage.accessToken);
        }else if(env == 'prod'){
          SetWidthHeight(1100,800);
          // SetFormTitle('支付成功');
          if(Object.keys(localStorage).indexOf('isOrderPaied') !== -1) {
            localStorage.setItem('isOrderPaied',true);
             window.location.href="http://api.phei.kingchannels.cn/Pay/Index?orderId=" + this.orderId + "&payType=" + this.payType + "&returnUrl=" + encodeURIComponent(backUrl) + "&appId=" + systemParams.appId +"&version=" + systemParams.version +"&deviceToken=" + encodeURIComponent(systemParams.deviceToken) +"&timestamp=" + systemParams.timestamp +"&appVersion=" + systemParams.appVersion +"&accessToken=" + encodeURIComponent(localStorage.accessToken);
          }else{
             window.location.href="http://api.phei.kingchannels.cn/Pay/Index?orderId=" + this.orderId + "&payType=" + this.payType + "&returnUrl=" + encodeURIComponent(backUrl) + "&appId=" + systemParams.appId +"&version=" + systemParams.version +"&deviceToken=" + encodeURIComponent(systemParams.deviceToken) +"&timestamp=" + systemParams.timestamp +"&appVersion=" + systemParams.appVersion +"&accessToken=" + encodeURIComponent(localStorage.accessToken);
          }
        }
      }else if(this.payType == 'weixin'){
          var params = {};
          params = {
            orderId: this.orderId,
            userid:this.userId,
          }
          console.log(params);
          this.$http.post("/Pay/Execute", params)
            .then((res) => {
              console.log(res)
              if(res.data.Success == true){
                if(env == 'dev'){
                  this.$router.push({
                    path:'/PaySuccess',
                    query:{
                       id:this.orderId,
                       payTotal:this.payTotal,
                       type:this.payType
                    }
                  });
                }else if(env == 'prod'){
                    SetWidthHeight(1100,800);
                    if(Object.keys(localStorage).indexOf('isOrderPaied') !== -1) {
                      localStorage.setItem('isOrderPaied',true);
                      this.$router.push({
                        path:'/PaySuccess',
                        query:{
                           id:this.orderId,
                           payTotal:this.payTotal,
                           type:this.payType
                        }
                      });
                    }else{
                      this.$router.push({
                        path:'/PaySuccess',
                        query:{
                           id:this.orderId,
                           payTotal:this.payTotal,
                           type:this.payType
                        }
                      });
                    } 
                } 
              }else{
                this.$message.warning(res.data.Description);
              }
              
          })
      }
      
      // var data = {
      //   orderId:this.orderId,
      //   payType:this.payType,
      //   appId:systemParams.appId,
      //   version:systemParams.version,
      //   deviceToken:systemParams.deviceToken,
      //   timestamp:systemParams.timestamp,
      //   appVersion:systemParams.appVersion,
      //   accessToken:encodeURIComponent(localStorage.accessToken),
      //   returnUrl:encodeURIComponent(backUrl)
      // }
      // console.log("http://api.phei.kingchannels.cn/Pay/Index?orderId=" + this.orderId + "&payType=" + this.payType + "&returnUrl=" + encodeURIComponent("http://phei.kingchannels.cn/Pay/index.html#/PaySuccess?id=" + this.orderId +"&payTotal=" + this.payTotal +"&type=" + this.payType) + "&appId=" + systemParams.appId +"&version=" + systemParams.version +"&deviceToken=" + encodeURIComponent(systemParams.deviceToken) +"&timestamp=" + systemParams.timestamp +"&appVersion=" + systemParams.appVersion +"&accessToken=" + encodeURIComponent(localStorage.accessToken))
     
       // var params = {};
      // params = {
      //   orderId: this.orderId,
      //   userId:this.userId,
      //   payType:this.payType,
      //   returnUrl:encodeURIComponent(backUrl)
      // }
      // console.log(params);
      // this.$http.get("/Pay/Index", {params})
      //   .then((res) => {
      //     if(env == 'dev'){
      //       console.log(res.data);
      //       $('#pay').append(res.data);
      //     }else if(env == 'prod'){
      //         SetWidthHeight(1100,800);
      //         if(Object.keys(localStorage).indexOf('isOrderPaied') !== -1) {
      //           localStorage.setItem('isOrderPaied',true);
      //         }
      //        console.log(res.data);
      //        // $('#pay').append(res.data);
      //     } 
      // })
    },
    //取消支付
    cancelPay(){
       if(env == 'dev'){
          this.$router.push({
            path:'/confirmOrder',
            query:{
              orderId:this.orderId
            }
          })
       }else if(env == 'prod'){
         CloseForm();
       } 
    }
  },

}

</script>
<style lang="less">


</style>
