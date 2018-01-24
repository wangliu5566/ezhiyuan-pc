<template>
  <div class="login-index">
  	<ul>
  		<li :class="{'active' : index == 0}" @click="selectChange(0)">登录</li>
  		<li :class="{'active' : index == 1}" @click="selectChange(1)">注册</li>
  	</ul>
  	<div class="clearfix"></div>
  	<div class="login-content">
  		<Login :index = 'index'></Login>
  		<Register :index = 'index'></Register>
  	</div>
  </div>
</template>
<script>
import Login from '@/components/loginIndex/Login';
import Register from '@/components/loginIndex/Register';
export default {
  data() {
    return {
      index:0,
    }
  },
  components:{
  	Login,
  	Register
  },
  methods:{
  	//切换登录注册页面
  	selectChange(index){
  		this.index = index;
  	}
  },
  mounted(){
    
  },
}

</script>
<style lang="less">


</style>
