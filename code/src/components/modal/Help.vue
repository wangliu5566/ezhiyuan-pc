<template>
  <div class="help-main">
    <div class="help-all">
      <div class="help-title">
        <div class="help-img">
          <img src="../../assets/images/pc-code.jpg" alt="">
        </div>
        <p>版本：<span>{{appVersion}}</span></p>
      </div>
      <div class="help-content">
        <div class="help-content-left fl">
          <div class="left-one">
            <img src="../../assets/images/电话.png" alt="">
            <span>010-88254237</span>
          </div>
         <!--  <div class="left-two">
            <img src="../../assets/images/用户收手册.png" alt="">
            <span>用户手册</span>
          </div> -->
        </div>
        <div class="help-content-right fl">
          <div class="right-one">
            <img src="../../assets/images/邮箱.png" alt="">
            <span>dig-pub@phei.com.cn</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      appVersion:''
    }
  },
  methods:{
  	 /**
     * [获取最新APP版本]
     * @作者     王柳
     * @日期     2017-12-18
     */
    getNewUpdate(){
      if(env == 'dev'){
        this.$http.get("/Upgrade/Check", {
          params:{
            type: 2,
          }
        })
        .then((res) => {
          console.log(res)
          if (res.data.Success == true) {
            this.appVersion = res.data.Data.Version;
          }else {
            this.$message.error(res.data.Description);
          }
        })
      }else if(env == 'prod'){
         ApiTransfer('get','/Upgrade/Check',JSON.stringify({type:2}),(winResult)=>{
            winResult = JSON.parse(winResult)
            console.log(winResult);
            if(winResult.Success){
              this.appVersion = winResult.Data.Version;
            }else{
              ShowMessage(winResult.Description)
            }
        });
       } 
    },
  },
  beforeCreate() {
    //设置当前窗口
    if(env == 'prod') {
      SetWidthHeight(500,410);
    }
  },
  mounted(){
    this.getNewUpdate();
  },
}

</script>
<style lang="less">


</style>
