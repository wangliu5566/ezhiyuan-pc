<template>
  <div class="index-main">
    <el-row class="index-main-all" :style="{width:winWidth + 'px',height:winHeight +'px',}" v-if="!isShowScale">
      <img src="./../assets/images/背景.png" alt="" class="index-main-img">
      <el-col :span="7">
        <div class="index-left" :style="{width:0.22 * winWidth + 'px',height:winHeight +'px',}">
          <img src="./../assets/images/图钉.png" alt="" class="left-top-small-img">
          <div class="left-top" :style="{width:0.18 * winWidth + 'px',height:0.7 * winHeight +'px',margin:'0 auto',marginTop:0.05 * winHeight + 'px',}">
            <div class="left-top-all" :style="{width:0.15 * winWidth + 'px',margin:'0 auto'}">
              <img src="./../assets/images/E知元LOGO.png" alt="" class="left-top-img fl">
              <h3 class="left-top-h3 fl" :style="{fontSize:0.016 * winWidth + 'px'}">E知元产品介绍
              </h3>
            </div>
            <div class="clearfix"></div>
            <div class="left-top-content" :style="{width:0.15 * winWidth + 'px',margin:'0 auto',marginTop:0.04 * winHeight + 'px',fontSize:0.008 * winWidth + 'px'}">
              <p>
                E知元以探索知识服务新路径为目标，基于优质内容资源，利用知识导航、知识地图、知识检索等核心功能将相关知识系统汇合，使用户能够利用零碎时间整理，巩固专业知识，提高知识水平和业务能力。
              </p>
              <p>
                精选电子工业出版社的电子技术专业教材、手册、标准、视频、图片等多种资源进行结构化及知识化加工，采用多种方式展现知识体系，并提供各类资源的专业阅读功能，以辅助用户学习相关专业与技术。
              </p>
            </div>
          </div>
          <div class="clearfix"></div>
          <div class="left-bottom" :style="{width:0.12 * winWidth + 'px',margin:'0 auto',marginTop:0.18 * winHeight + 'px',}">
            <img src="./../assets/images/电子工业出版社.png"  alt="">
          </div>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="index-right" :style="{width:0.75 * winWidth + 'px',height:winHeight +'px'}">
          <div class="index-all" style="width:70%;margin:0 auto">
            <div class="right-title">
              <h3 :style="{marginTop:0.05* winHeight + 'px',marginBottom:0.02 * winHeight + 'px'}">E知元</h3>
              <div class="right-title-div">
                E知元以探索知识服务新路径为目标，基于优质内容资源，利用知识导航、知识地图、知识检索等核心功能将相关知识系统汇合，使用户能够利用零碎时间整理，巩固专业知识，提高知识水平和业务能力。
              </div>
            </div>
            <ul class="right-list" :style="{marginTop:0.06 * winHeight + 'px'}">
              <li class="list-item fl " :style="{width:0.13 * winWidth +'px',height:0.29 * winHeight +'px'}" v-for="(item,index) in categoryList" @click="toIndexPath(index,item.ExtendData,item.Title,item.type)">
                 <img :src="item.imgBigSrc" alt="" class="list-big-img">
                 
                 <img :src="item.imgSmallSrcPaied" alt="" class="list-small-img" v-if="item.ExtendData.IsOrdered " v-show="!IsOrderedShow">
                 <img :src="item.imgSmallSrc" alt="" class="list-small-img" v-else v-show="!IsOrderedShow">
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <el-row class="index-main-all" v-else :style="{width:winWidth + 'px',height:winHeight +'px',}">
      <img src="./../assets/images/背景.png" alt="" class="index-main-img">
      <el-col :span="24">
        <div class="index-right" :style="{width: winWidth + 'px',height:winHeight +'px'}">
          <div class="index-all" style="width:80%;margin:0 auto">
            <div class="right-title">
              <h3 :style="{marginTop:0.05* winHeight + 'px',marginBottom:0.02 * winHeight + 'px'}">E知元</h3>
              <div class="right-title-div">
                E知元以探索知识服务新路径为目标，基于优质内容资源，利用知识导航、知识地图、知识检索等核心功能将相关知识系统汇合，使用户能够利用零碎时间整理，巩固专业知识，提高知识水平和业务能力。
              </div>
            </div>
            <ul class="right-list" :style="{marginTop:0.06 * winHeight + 'px'}">
              <li class="list-item fl " :style="{width:0.13 * winWidth +'px',height:0.29 * winHeight +'px'}" v-for="(item,index) in categoryList" @click="toIndexPath(index,item.ExtendData,item.Title,item.type)">
                 <img :src="item.imgBigSrc" alt="" class="list-big-img">
                 
                 <img :src="item.imgSmallSrcPaied" alt="" class="list-small-img" v-if="item.ExtendData.IsOrdered" v-show="!IsOrderedShow">
                 <img :src="item.imgSmallSrc" alt="" class="list-small-img" v-else v-show="!IsOrderedShow">
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <!-- <el-col :span="7">
        <div class="index-left" :style="{width:0.25 * winWidth + 'px',height:winHeight +'px',}">
          <img src="./../assets/images/图钉.png" alt="" class="left-top-small-img">
          <div class="left-top" :style="{width:0.2 * winWidth + 'px',height:0.7 * winHeight +'px',margin:'0 auto',marginTop:0.05 * winHeight + 'px',}">
            <div class="left-top-all" :style="{width:0.18 * winWidth + 'px',margin:'0 auto'}">
              <img src="./../assets/images/E知元LOGO.png" alt="" class="left-top-img fl">
              <h3 class="left-top-h3 fl" :style="{fontSize:0.02 * winWidth + 'px'}">E知元产品介绍
              </h3>
            </div>
            <div class="clearfix"></div>
            <div class="left-top-content" :style="{width:0.18 * winWidth + 'px',margin:'0 auto',marginTop:0.04 * winHeight + 'px',fontSize:0.01 * winWidth + 'px'}">
                E知元以探索知识服务新路径为目标，基于优质内容资源，利用知识导航、知识地图、知识检索等核心功能将相关知识系统汇合，使用户能够利用零碎时间整理，巩固专业知识，提高知识水平和业务能力。<br>
                &nbsp;精选电子工业出版社的电子技术专业教材、手册、标准、视频、图片等多种资源进行结构化及知识化加工，采用多种方式展现知识体系，并提供各类资源的专业阅读功能，以辅助用户学习相关专业与技术。
            </div>
          </div>
          <div class="clearfix"></div>
          <div class="left-bottom" :style="{width:0.12 * winWidth + 'px',margin:'0 auto',marginTop:0.18 * winHeight + 'px',}">
            <img src="./../assets/images/电子工业出版社.png"  alt="">
          </div>
        </div>
      </el-col> -->
      <!-- <el-col :span="17">
        <div class="index-right" :style="{width:winWidth + 'px',height:winHeight +'px'}">
          <div class="index-all" style="width:70%;margin:0 auto">
            <div class="right-title">
              <h3 :style="{marginTop:0.08 * winHeight + 'px',marginBottom:0.02 * winHeight + 'px'}">E知元</h3>
              <div class="right-title-div">
                E知元以探索知识服务新路径为目标，基于优质内容资源，利用知识导航、知识地图、知识检索等核心功能将相关知识系统汇合，使用户能够利用零碎时间整理，巩固专业知识，提高知识水平和业务能力。
              </div>
            </div>
            <ul class="right-list" :style="{marginTop:0.09 * winHeight + 'px'}">
              <li class="list-item fl " :style="{width:0.2 * winWidth +'px',height:0.2 * winHeight +'px'}" v-for="(item,index) in categoryList" @click="toIndexPath(index,item.ExtendData,item.Title)">
                 <img :src="item.imgBigSrc" alt="" class="list-big-img">
                 <img :src="item.imgSmallSrcPaied" alt="" class="list-small-img" v-if="item.ExtendData.IsOrdered" v-show="!IsOrderedShow">
                 <img :src="item.imgSmallSrc" alt="" class="list-small-img" v-else v-show="!IsOrderedShow">
              </li>
            </ul>
          </div>
        </div>
      </el-col> -->
    </el-row>
    
    <!-- <div class="index-content">
      <el-button type="info" @click="toPath('/Login')">登录</el-button>
      <el-button type="info" @click="toPath('/Register')">注册</el-button>
      <el-button type="info" @click="toPath('/EditPassword')">修改密码</el-button>
      <el-button type="info" @click="toPath('/ForceUpdate')">强制更新</el-button>
    </div>
    <div style="margin-top: 20px;">
      <el-button type="primary" @click="toPath('/ChoiceSearchList')">精选章节搜索列表</el-button>
      <el-button type="primary" @click="toPath('/ElectronicSearchList')">电子标准搜索列表</el-button>
      <el-button type="primary" @click="toPath('/KnowledgeSearchList')">知识元搜索列表</el-button>
      <el-button type="primary" @click="toPath('/OAsearchList')">OA论文搜索列表</el-button>
      <el-button type="primary" @click="toPath('/CircuitSearchList')">电路设计包搜索列表</el-button>
    </div>
    <div style="margin-top: 20px;">
      <el-button type="primary" @click="toPath('/collect')">我的收藏</el-button>
      <el-button type="primary" @click="toPath('/history')">阅读历史</el-button>
      <el-button type="primary" @click="toPath('/information')">消息中心</el-button>
      <el-button type="primary" @click="toPath('/shoppingCar')">购物车</el-button>
      <el-button type="primary" @click="toPath('/orderWrap')">订单</el-button>
      <el-button type="primary" @click="toPath('/downLoadManager')">下载管理</el-button>
    </div>
     <div style="margin-top: 20px;">
      <el-button type="primary" @click="toPath('/paperList')">论文列表</el-button>
      <el-button type="primary" @click="toPath('/PersonalCenter')">个人资料</el-button>
      <el-button type="primary" @click="toPath('/BindOrganizor')">绑定机构</el-button>
    </div>
    <div style="margin-top: 20px;">
      <el-button type="primary" @click="toPath('/circuitPackage')">电子电路包详情</el-button>
      <el-button type="primary" @click="toPath('/section')">章节详情</el-button>
      <el-button type="primary" @click="toPath('/paperDetail')">论文详情</el-button>
      <el-button type="primary" @click="toPath('/eStandard')">电子保准详情</el-button>
    </div>
    <div style="margin-top: 20px;">
      <el-button type="primary" @click="toPath('/Update')">检查更新</el-button>
      <el-button type="primary" @click="toPath('/help')">帮助与反馈</el-button>
      <el-button type="primary" @click="toPath('/CopyRight')">专题知识版权声明</el-button>
      <el-button type="primary" @click="toPath('/ClearCache')">清除缓存</el-button>
    </div> -->
    
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
      isShowScale:false,
      IsOrderedShow:false,
      categoryList:[],
      imgSrcData:[{
        imgBigSrc: './static/images/电子电路+.png',
        imgSmallSrcPaied:'./static/images/已购买.png',
        imgSmallSrc:'./static/images/未购买.png',
        Title:'电子电路',
        type:1
      },{
        imgBigSrc: './static/images/物联网.png',
        imgSmallSrcPaied:'./static/images/已购买.png',
        imgSmallSrc:'./static/images/未购买.png',
        Title:'物联网',
        type:2
      },{
        imgBigSrc: './static/images/互联网+  图.png',
        imgSmallSrcPaied:'./static/images/已购买.png',
        imgSmallSrc:'./static/images/未购买.png',
        Title:'互联网+',
        type:3
      }],
    }
  },
  methods:{
    //跳转到相应产品页
    toIndexPath(index,extendData,title,type){
      if(env == "prod"){
        SaveArgument(extendData);
        SetProductType(type);
      };   //0-未指定 1-电子电路  2-物联网  3-互联网+
      this.goToUrl('/Eresource',{
         query:[{
          extendData:JSON.stringify(extendData)
         }],
         winType:'资源',
         winTitle:title,
         isIndForm:true,
       });
    },
    //跳转到相应路由页面
    toPath(page){
       //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
       //options详细配置见util.js;
       this.goToUrl(page,{
         query:[],
         winType:'详情',
         winTitle:'详情',
         isIndForm:true,
       });
    },
    //获取所有产品分类
    getAllCategory(){
      this.$http.get("/Content/Search", {
          params: {
            objectTypes:123,
          }
        })
        .then((res) => {
          if (res.data.Code == 200) {
            // var categoryList = res.data.Data.ItemList;
            // for(let i = 0; i < categoryList.length; i ++){
            //     if(categoryList[i].ExtendData.CustomName == '电子电路'){
            //       this.categoryList[0] = categoryList[i];
            //       if(this.categoryList[0].ExtendData.IsOrdered == 'true'){
            //         this.IsOrderedShow = true;
            //       }else{
            //         this.IsOrderedShow = false;
            //       }
            //     }else if(categoryList[i].ExtendData.CustomName == '物联网'){
            //       this.categoryList[1] = categoryList[i];
            //       if(this.categoryList[1].ExtendData.IsOrdered == 'true'){
            //         this.IsOrderedShow = true;
            //       }else{
            //         this.IsOrderedShow = false;
            //       }
            //     }else if(categoryList[i].ExtendData.CustomName == '互联网+'){
            //       this.categoryList[2] = categoryList[i];
            //       if(this.categoryList[2].ExtendData.IsOrdered == 'true'){
            //         this.IsOrderedShow = true;
            //       }else{
            //         this.IsOrderedShow = false;
            //       }
            //     }
            // }
            this.categoryList = res.data.Data.ItemList;
            if(this.categoryList.length == 0){
              this.categoryList = this.categoryList.concat(this.imgSrcData);
            }else{
              this.categoryList.reverse().forEach((item,index) => {
                this.imgSrcData.forEach((citem,cindex) => {
                    if(index == cindex){
                      item = Object.assign({},item,citem);
                      this.$set(this.categoryList,index,item);
                    }
                })
              })
              // this.categoryList.forEach((item,index) => {
              //   this.imgSrcData.forEach((citem,cindex) => {
              //       if(index == cindex){
              //         item = Object.assign({},item,citem);
              //         this.$set(this.categoryList,index,item);
              //       }
              //   })
              // })
            }
            console.log(this.categoryList)
          }else{
            this.$message.warning(res.data.Description);
          }
        })
    }
  },

  mounted() {
    //  ShowDevTools();
    // console.log(GetArgument()   +"1651")
     window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    };
    this.getAllCategory();
    if(!localStorage.productType) localStorage.setItem('productType','电子电路');
  }
}
</script>
<style lang="less" scoped>

</style>
