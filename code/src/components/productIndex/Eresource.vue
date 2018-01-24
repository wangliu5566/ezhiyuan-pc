<template>
  <div class="e-resource" :style="{width:winWidth + 'px', height:winHeight + 'px'}" v-if="!isShowTwoScale">
    <div 
    :style="{width:0.21 * winWidth + 'px', height:0.147 * winWidth + 'px',marginTop:0.05 * winWidth + 'px',minWidth:100 + 'px',}"
    @click="toPath(extendData.CustomTitle == '电子电路' ?'/KnowledgeNav' : extendData.CustomTitle == '物联网' ?'IntKnowledgeWrap' : '/InternetPlusWrap','知识导航',extendData)"
    >
      <img src="../../assets/images/知识导航图.png" class="resource-item-bg">
      <img src="../../assets/images/知识导航icon.png" alt="">
      <img src="../../assets/images/知识导航字.png" alt="">
    </div>

    <div :style="{width:0.21 * winWidth + 'px', height:0.147 * winWidth + 'px',marginTop:0.05 * winWidth + 'px',minWidth:100 + 'px',}"
      @click="toPath('/HotTop','热度排行',extendData.CustomTitle,extendData)"
    > 
      <img src="../../assets/images/热度排行图.png" class="resource-item-bg">
      <img src="../../assets/images/热度排行icon.png" alt="">
      <img src="../../assets/images/热度排行字.png" alt="">
    </div>

    <div :style="{width:0.21 * winWidth + 'px', height:0.147 * winWidth + 'px',marginTop:0.05 * winWidth + 'px',minWidth:100 + 'px',}"
      @click="toPath(extendData.CustomTitle == '电子电路' ? '/ThematicKnowledge' : '/SectionWrap','专题知识',extendData)"
    >
      <img src="../../assets/images/专题知识图.png" class="resource-item-bg">
      <img src="../../assets/images/专题知识icon.png" alt="">
      <img src="../../assets/images/专题知识字.png" alt="">
    </div>

    <el-button @click="toPath('/Index','主页')"  class="index-btn">
      返回主页
    </el-button>
  </div>
  
  <div class="e-resourceS" v-else  :style="{width:winWidth + 'px', height:winHeight + 'px'}">
    <div 
    :style="{width:200 + 'px', height:200 + 'px',minWidth:100 + 'px',}"
   @click="toPath(extendData.CustomTitle == '电子电路' ?'/KnowledgeNav' : extendData.CustomTitle == '物联网' ?'IntKnowledgeWrap' : '/InternetPlusWrap','知识导航',extendData)"
    >
      <img src="../../assets/images/知识导航图.png" class="resource-item-bg">
      <img src="../../assets/images/知识导航icon.png" alt="">
      <img src="../../assets/images/知识导航字.png" alt="">
    </div>

    <div :style="{width:200 + 'px', height:200 + 'px',minWidth:100 + 'px',}"
       @click="toPath('/HotTop','热度排行',extendData.CustomTitle,extendData)"
    > 
      <img src="../../assets/images/热度排行图.png" class="resource-item-bg">
      <img src="../../assets/images/热度排行icon.png" alt="">
      <img src="../../assets/images/热度排行字.png" alt="">
    </div>

    <div :style="{width:200 + 'px', height:200 + 'px',minWidth:100 + 'px',}"
      @click="toPath(extendData.CustomTitle == '电子电路' ? '/ThematicKnowledge' : '/SectionWrap','专题知识',extendData)"
    >
      <img src="../../assets/images/专题知识图.png" class="resource-item-bg">
      <img src="../../assets/images/专题知识icon.png" alt="">
      <img src="../../assets/images/专题知识字.png" alt="">
    </div>

    <el-button @click="$router.push('/Index')"  class="index-btn">
      返回主页
    </el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
      isShowTwoScale:false,
      isInternet:true,
      // type:this.$route.query.type || JSON.parse(GetArgument()),
      extendData:'',
    }
  },
  methods:{
    //跳转到相应导航页
    toPath(path,title,extendData){
     //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
     //options详细配置见util.js;
     this.goToUrl(path,{
       query:[{
        extendData:JSON.stringify(this.extendData)
       }],
       winType:'资源',
       winTitle:title,
       isIndForm:false,
     });
    }
  },

  mounted() {
    if(env == 'dev'){
      this.extendData = JSON.parse(this.$route.query.extendData);
    }else if(env == 'prod'){
      this.extendData = JSON.parse(GetArgument().split('=')[1]);
    };
    // ShowDevTools();
    // console.log(GetArgument());
    localStorage.setItem('productType',this.extendData.CustomTitle);
    if(this.extendData.CustomTitle == '互联网+'){
      this.isInternet = false;
    };
    window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    }
  }
}
</script>
<style lang="less">
</style>
