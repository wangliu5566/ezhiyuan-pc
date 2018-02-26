<template>
  <div class="upadate-main">
    <div class="upadate-all">
      <div class="upadate-title">
        <div class="upadate-img">
          <img src="../../assets/images/软件更新提示.png" alt="">
        </div>
        <p>该版本存在重大更新，请下载更新。</p>
      </div>
      <div class="upadate-content">
        <div class="update-button" style="margin:100px auto 0 auto;width:180px">
          <el-button @click="cancelUpdate">退出</el-button>
          <el-button @click="toUpdate" type="primary">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      
    }
  },
  methods:{
    //取消下载
    cancelUpdate(){
      if(env == 'prod'){
        ExitProgram();
      }
    },
    //前往更新页面
    toUpdate(){
      if(env == 'prod'){
        SetFormTitle('检查更新');
      }
      this.$router.push('/Update');
    }
  },
  beforeCreate() {
    //设置当前窗口
    if(env == 'prod') {
      SetWidthHeight(500,410);
    }
  },
  mounted(){

  },
}

</script>
<style lang="less">


</style>
