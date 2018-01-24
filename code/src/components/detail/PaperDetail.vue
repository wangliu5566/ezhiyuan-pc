<template>
  <div class="paper" v-loading="loading" element-loading-text="数据加载中...">
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:38 + 'px',minWidth:700 + 'px'}">
      <div class="top">
        <el-row>
          <el-col :span="20">
            <div class="paper-title">
              <h3>{{dataObj.Title}}
                <span>
                  {{dataObj.CurrentPrice || dataObj.CurrentPrice === 0 ?'￥'+formatPrice(dataObj.CurrentPrice,2):'暂无'}}
                </span>
                <p v-show="dataObj.ExtendData.SaleStrategyName ? true : false" class="paper-title-p">价格 
                  <span class="price-span">
                  {{dataObj.MarketPrice || dataObj.MarketPrice === 0 ?'￥'+formatPrice(dataObj.MarketPrice,2):'暂无'}}
                  </span>
                </p>
              </h3>
              <el-button v-show="dataObj.ExtendData.SaleStrategyName ? true : false" disabled>
                {{dataObj.ExtendData.SaleStrategyName}}
              </el-button>
              <div class="clearfix"></div>
            </div>
            <div class="clearfix"></div>
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
                <!-- <ul>
                  <li>{{dataObj.ExtendData.Keywords ? dataObj.ExtendData.Keywords : '暂无'}}</li>
                </ul> -->
              <!-- </div> -->
              <p class="section-author">
                <b>收录情况：</b>
                <span>{{dataObj.ExtendData.Source ? dataObj.ExtendData.Source : '暂无'}}
                </span>
              </p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="section-right fr" >
              <div class="right-title ">
                <i :class="isFavorite?'el-icon-star-on':'el-icon-star-off'" 
                style="font-size: 24px;margin: 0 16px 4px 0;cursor:pointer;" @click="updateFavorite(objectType,sectionId,userId,updateFn)"></i>
                <p style="font-size:14px">{{isFavorite?'已收藏':'点击收藏'}}</p>
              </div>
              <div class="clearfix"></div>
               <div class="right-button ">
                   <el-button 
                   v-show="dataObj.ExtendData.IsOrdered ? !dataObj.ExtendData.IsOrdered : !dataObj.ExtendData.IsJoinedCart"  
                   @click="addToShoppingCar(dataObj,true)"
                   >
                     购买
                   </el-button>
                   <el-button 
                   type="primary" 
                   @click.stop="addToShoppingCar(dataObj)"
                   style="width: 100px"
                   :disabled="dataObj.ExtendData.IsJoinedCart ? true : false" 
                   v-show="!dataObj.ExtendData.IsOrdered"
                   >
                   {{dataObj.ExtendData.IsJoinedCart ? '已加入购物车':'加入购物车'}}
                   </el-button>
                   <el-button 
                     @click.stop="download(dataObj)" 
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
      sectionId: '',
      userId:localStorage.userId,
      objectType:105, //论文的类型为105
      isFavorite: false,

      loading:true,
      dataObj: {ExtendData:{}},
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
    if(this.paperId!=''){
      this.getDetail()
    }else{
      alert('请传入论文详情的Id')
    }
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
          this.loading = false;

          if (res.data.Success) {
            this.dataObj = res.data.Data;
            var isFavorite = res.data.Data.ExtendData.IsFavorited;
            if(isFavorite){
              this.isFavorite = isFavorite;
            }else{
              this.isFavorite = false;
            }


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
          }else{
            this.loading = false;
            this.$message.error(res.data.Description);
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
      this.isFavorite =isFavorite
    },
    /**
     * [goConfirmBtn 确定订单]
     * @Author   赵雯欣
     * @DateTime 2017-11-22
     * @param    {[type]}   patge [description]
     * @return   {[type]}         [description]
     */
    goConfirmBtn(path) {
     var oderObj = Object.assign({},{ 
        counts: this.count,
        objectTypes:this.objectType,
        totalMoney:this.dataObj.MarketPrice,
        objectIds:this.sectionId,
        userId:this.userId
      });
      
      this.goConfirmOrder(path, oderObj)
    },



    /**
     * [download 下载图书]
     * @Author   罗文
     * @DateTime 2017-12-04
     * @param    {[type]}   item [description]
     * @return   {[type]}        [description]
     */
    download(item) {
      //  CloseMenueStrip();
      // // 验证有没有用户信息和激活码
      // var hasUserId = volidUserId(true);
      // if(!hasUserId) return;
      
      if(this.hasDownLoad) {
          this.toPdfView(item,item.Id,'标准'); 
      }else {
        //只要一点击就变为0
        this.startDownLoad = true;

        if(env == 'dev') {
           var setTime = setInterval(()=>{
                if(this.downLoadPercent >= 100) {
                   this.downLoadPercent = 100;
                   this.hasDownLoad = true;  
                   clearInterval(setTime);
                }else {
                   this.downLoadPercent++;
                }
            }, 50)
        }else if(env == 'prod') {

          var data = {
              objectId:item.Id,
              isPC:true,
              type:1,  //1 - EPUB  2 - pdf  3 - 视频  4 - 图片
              userid:localStorage.getItem('userId'),
              title:item.Title,
              objectType:item.ObjectType,
              objectTypeDescription:item.ObjectTypeDescription,
              DefaultFileExtension:item.DefaultFileExtension,
              extendData:JSON.stringify(item.ExtendData)
          }

          //下面是配合winform异步获取数据

          //多线程异步下载
          DownLoadProgress('POST','/Content/Authorize',JSON.stringify(Object.assign({},systemParams,data)),(progress,nativeUrl='',err)=>{
              if(err) {
                this.startDownLoad = false;
                this.$message.error(err);
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
    
    
  }

}

</script>
<style lang="less">
.paper{
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
