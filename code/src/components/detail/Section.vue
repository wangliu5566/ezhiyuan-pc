<template>
  <div class="section" v-loading="loading" element-loading-text="数据加载中...">
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:38 + 'px',minWidth:600 + 'px'}">
      <div class="top">
        <el-row>
          <el-col :span="20">
            <div class="section-title">
              <h3>{{dataObj.Title}}
                <span>
                  {{dataObj.CurrentPrice || dataObj.CurrentPrice === 0 ?'￥'+ formatPrice(dataObj.CurrentPrice,2):'暂无'}}
                </span>
                <p>价格 
                  <span class="price-span">
                  {{dataObj.MarketPrice || dataObj.MarketPrice === 0 ?'￥'+formatPrice(dataObj.MarketPrice,2):'暂无'}}
                  </span>
                </p>
                <!-- <p v-show="dataObj.ExtendData.SaleStrategyName ? true : false">价格 
                  <span class="price-span">
                  {{dataObj.MarketPrice || dataObj.MarketPrice === 0 ?'￥'+formatPrice(dataObj.MarketPrice,2):'暂无'}}
                  </span>
                </p> -->
              </h3>
              <el-button v-show="dataObj.ExtendData.SaleStrategyName ? true : false" disabled>
                {{dataObj.ExtendData.SaleStrategyName}}
              </el-button>
              <div class="clearfix"></div>
            </div>
            
            <div class="section-intro">
              <p class="section-author">
                <b>作者中文名：</b>
                <span>{{dataObj.Author?dataObj.Author:'暂无'}}</span>
              </p>
              <!-- <div class="section-author"> -->
              <p class="section-author">
                <b>中文关键词：</b>
                <span>{{dataObj.ExtendData.Keywords ? dataObj.ExtendData.Keywords : '暂无'}}</span>
              </p>
              <!-- </div> -->
              <p class="section-author">
                <b>收录情况：</b>
                <span>{{dataObj.ExtendData.Source ? dataObj.ExtendData.Source : '暂无'}}
                </span>
              </p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="section-right fr">
              <div class="right-title fr">
                <i :class="isFavorite?'el-icon-star-on':'el-icon-star-off'" 
                style="font-size: 24px;margin: 0 16px 4px 0;cursor:pointer"  
                @click="updateFavorite(objectType,sectionId,userId,updateFn)">
                </i>
                <p>{{isFavorite?'已收藏':'点击收藏'}}</p>
              </div>
              <div class="clearfix"></div>
               <div class="right-button">
                   <el-button 
                   v-show="dataObj.ExtendData.IsOrdered ? !dataObj.ExtendData.IsOrdered : !dataObj.ExtendData.IsJoinedCart" 
                   @click="addToShoppingCar(dataObj,true)"
                   >
                     购买
                   </el-button>
                   <el-button 
                   type="primary"
                   style="width: 100px"
                   :disabled="dataObj.ExtendData.IsJoinedCart ? true : false" 
                   v-show="!dataObj.ExtendData.IsOrdered"
                   @click="addToShoppingCar(dataObj)"
                   >
                   {{dataObj.ExtendData.IsJoinedCart ? '已加入购物车':'加入购物车'}}
                   </el-button>
                   <el-button 
                   @click="download(dataObj)" 
                   v-show="dataObj.ExtendData.IsOrdered"
                   :type="hasDownLoad ? 'primary':''"
                   :disabled="(downLoadPercent == 0 && startDownLoad) || (downLoadPercent != 0 && downLoadPercent != 100)">

                      {{ hasDownLoad ? '阅读' : (downLoadPercent == 0 && !startDownLoad? '点击下载' : downLoadPercent +'%')}}
                    </el-button>
               </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="bottom">
        <div class="bottom-one">
          <div class="bottom-title fl"><b>中文摘要：</b></div>
          <div class="bottom-content fl" :style="{width:(0.8 * winWidth - 110)+ 'px'}">
            {{dataObj.Abstracts?dataObj.Abstracts:'暂无'}}
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="bottom-one">
          <div class="bottom-title fl"><b>小节目录：</b></div>
          <ul class="bottom-content fl" :style="{width:(0.8 * winWidth - 110)+ 'px'}" v-if="tableOfContent.length > 0">
             <li v-for="(item,index) in tableOfContent" @click="toBookViewByLib(item)">{{item.Title}}</li>
          </ul>
          <div class="bottom-content fl" :style="{width:(0.8 * winWidth - 110)+ 'px'}" v-else>暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
      sectionId:'',
      userId:localStorage.userId,
      objectType:102, //章节就是102
      isFavorite: false,
      loading:true,
      dataObj: {ExtendData:{}},
      tableOfContent:[],//章节目录
      count: 1,
      hasDownLoad:false,
      startDownLoad:false,
      downLoadPercent:0,
    }
  },
  mounted() {
    window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    }
    this.sectionId = this.$route.query.id || GetArgument().split('=')[1];
    this.getDetail();
    // this.getFavorite(this.objectType,this.sectionId,this.userId,this.updateFn)
  },
  methods: {
    /**
     * [getDetail 获取电路包详情]
     * @Author   赵雯欣
     * @DateTime 2017-11-21
     * @return   {[type]}   [description]
     */
    getDetail() {
      this.loading = true;
      this.$http.get("/Content/Detail", {
          params: {
            id:this.sectionId,
          }
        })
        .then((res) => {
          if (res.data.Success) {
              this.loading = false;
              this.dataObj = res.data.Data;
              // console.log(this.dataObj)
              var isFavorite = res.data.Data.ExtendData.IsFavorited;
              if(isFavorite){
                this.isFavorite = isFavorite;
              }else{
                this.isFavorite = false;
              }
              this.getTableOfSection();

              if(env == 'dev') return;
              //下面是winform下的获取当前文件是否已经下载
              if(localStorage.getItem('userId') && localStorage.getItem('userId') !== '') {
                //异步获取下载
                GetDownLoadedResources(this.sectionId+'',localStorage.getItem('userId'),(hasDownLoadedContent)=>{
                    hasDownLoadedContent = JSON.parse(hasDownLoadedContent);

                    if(hasDownLoadedContent.length !== 0) {
                       //表明此时是已经下载过的了
                       // fileData = hasDownLoadedContent[0];
                       this.hasDownLoad = true;
                    }
                })
              }
          }else {
            this.loading = false;
            this.$message.error(res.data.Description);
          }
        })
    },
    /**
     * [getTableOfSection 获取章节目录]
     * @Author   罗文
     * @DateTime 2017-11-30
     * @return   {[type]}   [description]
     */
    getTableOfSection() {
       this.loading = true;
       this.$http.get("/TableOfContent/List", {
          params: {
            objectId:this.sectionId,
          }
        })
        .then((res) => {
          this.loading = false;
          if (res.data.Success) {
            this.tableOfContent = res.data.Data;
          }else {
            this.tableOfContent = [];
          }
        })
    },
    /**
     * [updateFn 获取和修改收藏的回调函数]
     * @Author   赵雯欣
     * @DateTime 2017-11-21
     * @param    {Boolean}  isFavorite [description]
     * @return   {[type]}              [description]
     */
    updateFn(isFavorite){
      this.isFavorite = isFavorite;
      // console.log(this.isFavorite)
    },

    
    /**
     * [download 下载图书]
     * @Author   罗文
     * @DateTime 2017-12-04
     * @param    {[type]}   item [description]
     * @return   {[type]}        [description]
     */
    download(item) {

      // CloseMenueStrip();
      // 验证有没有用户信息和激活码
      var hasUserId = volidUserId(true);
      if(!hasUserId) return;
      
      if(this.hasDownLoad) {
          this.toBookView(item); 
      }else {
        //只要一点击就变为0
        this.startDownLoad = true;

        if(env == 'dev') {
           // var setTime = setInterval(()=>{
           //      if(this.downLoadPercent >= 100) {
           //         this.downLoadPercent = 100;
           //         this.hasDownLoad = true;  
           //         clearInterval(setTime);
           //      }else {
           //         this.downLoadPercent++;
           //      }
           //  }, 50)
           this.$http.post("/Content/Authorize", {
              id:this.sectionId,
              authorizeToken:item.ExtendData.authorizeToken
            })
            .then((res) => {
              if (res.data.Success) {
                this.tableOfContent = res.data.Data;
              }else {
                this.$message.error(res.data.Description);
              }
            })
        }else if(env == 'prod') {
          this.$http.post("/Content/Authorize", {
            id:this.sectionId,
            authorizeToken:item.ExtendData.AuthorizeToken
          })
          .then((res) => {
            console.log(res.data)
          })

          console.log(GetDeviceKey())
          console.log(GetDevicekToken())

          var data = {
              objectId:item.Id,
              isPC:true,
              type:1,  //1 - EPUB  2 - pdf  3 - 视频  4 - 图片
              userid:localStorage.getItem('userId'),
              title:item.Title,
              objectType:item.ObjectType,
              objectTypeDescription:item.ObjectTypeDescription,
              extendData:JSON.stringify(item.ExtendData)
          }

          //下面是配合winform异步获取数据

          //多线程异步下载
          DownLoadProgress('POST','/Content/Authorize',JSON.stringify(Object.assign({},systemParams,data)),(progress,nativeUrl='',err)=>{
              if(err) {
                this.$message.error(err);
                this.startDownLoad = false;
                // OpenForm(480,500,'/index.html#/userCenter','个人信息');
                // localStorage.setItem('fromWhere',3);
              }else {
                item.nativeUrl = nativeUrl;

                //获取下载进度
                if (Math.floor(progress) >= 100) {
                    this.downLoadPercent = 100;
                    this.hasDownLoad = true;
                } else {
                    this.downLoadPercent = Math.floor(progress);
                }
              }              
          });

        }
      }  
    },

    
    /**
     * [toBookViewByLib 点击目录去阅读]
     * @Author   罗文
     * @DateTime 2017-12-14
     * @return   {[type]}   [description]
     */
    toBookViewByLib(item) {
       if(!this.dataObj.ExtendData.IsOrdered) {
          this.$message.error('请先购买资源！');
          return;
       }

       if(!this.hasDownLoad) {
          this.$message.error('请先下载该资源！');
          return;
       }else {
          //这个时候就根据点击的小节，进行跳转阅读
          localStorage.setItem('sectionLibIndex',item.Title);
          this.toBookView(this.dataObj); 
       }
    }
    
    
  }

}

</script>
<style lang="less">
.section{
  .section-intro{
    margin: 46px 0 52px 0;
    /* font-weight: bold; */
    .section-author{ 
      font-size: 14px;
      margin-bottom: 12px;
    }
     b{
      display: inline-block;
      width: 90px;
      text-align: right;
      }
    span{
      font-weight: 500;
      margin-left: 24px;
      text-align: left;
    }
  }
  .bottom{
    b{
     display: inline-block;
      width: 90px;
      text-align: right;
    }
  }
}
</style>
