<template>
    <div class="information-detail-main">
      <div class="information-detail-all">
        <p class="infor-title">
         {{messageData.Title}}<span>{{messageData.CreateTime}}</span>  
       </p>
       <p class="infor-content">
         {{messageData.Contents}}
       </p>
      </div> 
    </div>
</template>

<script>
  export default {
    data(){
      return {
         messageData:{},
      }
    },
    beforeCreate() {
      //设置当前窗口
      if(env == 'prod') {
        SetWidthHeight(486,436);
      }
    },
    mounted(){
      this.$http.get("/Message/Detail", {
          params: {
            id: this.$route.query.id || GetArgument(),
          }
        })
        .then((res) => {
           if (res.data.Success == true) {
              this.messageData = res.data.Data;
           }else{
              this.$message.error(res.data.Description);
           }
        })
    }
  }
</script>

<style lang='less'>
</style>