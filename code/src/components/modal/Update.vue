<template>
  <div class="upadate-main">
    <div class="upadate-all">
      <div class="upadate-title">
        <div class="upadate-img">
          <img src="../../assets/images/软件更新提示.png" alt="">
        </div>
        <p v-show="!isUpdate">{{updateDescription}}</p>
        <p v-show="isUpdate"><el-progress :text-inside="true" :stroke-width="16" :percentage="percentage"></el-progress></p>
      </div>
      <div class="upadate-content">
        <h3>【更新日志】</h3>
        <p v-show="!isLog">{{updateLogTitle}}</p>
        <ul v-show="isLog">
          <li v-for="(item,index) in logData">版本：{{item.Version}}</li>
        </ul>
        <div class="update-button fr">
          <el-button @click="cancelUpdate">取消</el-button>
          <el-button :disabled="isDisabled" @click="appUpdate" type="primary">下载更新</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isDisabled:false,
      isUpdate:false,
      isLog:false,

      updateDescription:'',
      updateLogTitle:'',
      percentage:0,
      logData:[],
      versionNum:'',
      versionUrl:''
    }
  },
  methods:{
    //取消下载
    cancelUpdate(){
      if(env == 'prod'){
        CloseForm();
      }
    },
    /**
     * [获取APP更新日志]
     * @作者     王柳
     * @日期     2017-12-18
     */
    getAppUpdateLog(){
      if(env == 'dev'){
        this.$http.get("/Upgrade/List", {
          params:{
            type: 2,
          }
        })
        .then((res) => {
          // console.log(res)
          if (res.data.Success == true) {
            if(res.data.Data.ItemList.length == 0){
              this.updateLogTitle = '暂无更新日志';
            }else{
              this.isLog = true;
              this.logData = res.data.Data.ItemList.slice(0,6);
              this.versionNum = res.data.Data.ItemList[res.data.Data.ItemList.length - 1].VersionNumber;
              // console.log(this.versionNum)
            }
          }else {
            this.$message.error(res.data.Description);
          }
        })
      }else if(env == 'prod'){
        ApiTransfer('get','/Upgrade/List',JSON.stringify({type:2}),(winResult)=>{
            winResult = JSON.parse(winResult)
            console.log(winResult);
            if(winResult.Success){
                if(winResult.Data.ItemList.length == 0){
                  this.updateLogTitle = '暂无更新日志';
                }else{
                  this.isLog = true;
                  this.logData = winResult.Data.ItemList.slice(0,6);
                }
            }else{
                ShowMessage(winResult.Description)
            }
        });
      }
    },
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
          // console.log(res)
          if (res.data.Code == 200) {
            if(res.data.Data.VersionNumber <=  this.versionNum){
              this.updateDescription = '已经是最新版本了';
              this.isDisabled = true;
            }else{
              this.updateDescription = '有更新版本，请下载更新';
              this.isDisabled = false;
              this.versionUrl = res.data.Data.Url;
            }
          }else if(res.data.Code == 20){
              this.updateDescription = '没有任何版本信息';
              this.isDisabled = true;
          }else {
            this.$message.error(res.data.Description);
          }
        })
      }else if(env == 'prod'){
         ApiTransfer('get','/Upgrade/Check',JSON.stringify({type:2}),(winResult)=>{
            winResult = JSON.parse(winResult)
            console.log(winResult);
            if(winResult.Code == 200){
                 var curVerData = GetCurrentVersion();
                     curVerData = JSON.parse(curVerData);
                     console.log(curVerData)

                 if(winResult.Data.VersionNumber <= curVerData.VersionNumber) {
                    this.updateDescription = '已经是最新版本了';
                    this.isDisabled = true;
                 }else {
                    this.updateDescription = '有更新版本，请下载更新';
                    this.isDisabled = false;
                    this.versionUrl = winResult.Data.Url;
                 };
            }else if(winResult.Code == 20){
              this.updateDescription = '没有任何版本信息';
              this.isDisabled = true;
            }else{
                ShowMessage(winResult.Description)
            }
        });
       } 
    },
    /**
     * [App更新]
     * @作者     王柳
     * @日期     2017-12-18
     */
    appUpdate(){
      this.isUpdate = true;
      this.isDisabled = true;
      if(env == 'dev'){
        var setTime = setInterval(()=>{
            if(this.percentage >= 100) {
               this.percentage = 100;

               clearInterval(setTime);
               this.isUpdate = false;
               this.updateDescription = '已经是最新版本了';

            }else {
               this.percentage++;
            }
        }, 50);
      }else if(env == 'prod'){
        DownLoadUrl(this.versionUrl,(progress,nativeUrl,err) =>{
            // console.log(progress,nativeUrl,err1)
             if(err) {
                  ShowMessage(err);
                  this.isUpdate = false;
                  this.isDisabled = false;
              }else {
                  this.isUpdate = true;
                  if(Math.floor(progress) >= 100) {
                    this.percentage = 100;
                    this.isUpdate = false;
                    this.updateDescription = '已经是最新版本了';
                    this.$message.success('已经是最新版本了');
                    ExcuteUpdate(nativeUrl);
                  }else{
                    this.percentage = Math.floor(progress);
                  }
              }
          })
      }
    }
  },
  beforeCreate() {
    //设置当前窗口
    if(env == 'prod') {
      SetWidthHeight(500,410);
    }
  },
  mounted(){
    this.getAppUpdateLog();
    this.getNewUpdate();
  },
}

</script>
<style lang="less">


</style>
