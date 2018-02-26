<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import './assets/css/Product.less';
export default {
  name: 'app',
  mounted() {
    // if(env == 'prod') ShowDevTools();

    //轮询检查accessToken
    setInterval(()=>{
       this.validAccessToken();
    }, 1000 * 60)
  }
}
</script>

<style lang="less">

</style>
