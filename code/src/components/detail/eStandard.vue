<template>
  <div class="e-standard" v-loading="loading" element-loading-text="数据加载中...">
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:38 + 'px',minWidth:1000 + 'px'}">
       <div class="top">
          <el-row>
            <el-col :span="20">
              <div class="standard-img fl">
                <img :src="dataObj.CoverUrl" alt="">
              </div>
              <div class="standard-right fl">
                <div class="standard-right-title">
                  <h3>{{dataObj.Title}}
                    <span>
                      {{dataObj.CurrentPrice || dataObj.CurrentPrice === 0 ?'￥'+formatPrice(dataObj.CurrentPrice,2):'暂无'}}
                    </span>
                    <p v-show="dataObj.ExtendData.SaleStrategyName ? true : false">价格 
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
                
                <div class="section-intro">
                  <div class="standard-intro-one fl">
                    <p class="section-author">标准编号：
                      <span>
                         {{dataObj.ExtendData.StandardCode?dataObj.ExtendData.StandardCode:'暂无'}}
                      </span>
                    </p>
                    <p class="section-author">批准日期：
                      <span>
                        {{dataObj.ExtendData.ApproveDate?dataObj.ExtendData.ApproveDate:'暂无'}}
                      </span>
                    </p>
                    <p class="section-author">主管部门：
                      <span>
                        {{dataObj.ExtendData.HostUnit?dataObj.ExtendData.HostUnit:'暂无'}}
                      </span>
                    </p>
                  </div>
                  <div class="standard-intro-two fl">
                     <p class="section-author">实施日期：
                      <span>
                        {{dataObj.ExtendData.ImplementDate?dataObj.ExtendData.ImplementDate:'暂无'}}
                      </span>
                    </p>
                     <p class="section-author">首发日期：
                      <span>
                        {{dataObj.ExtendData.ReleaseDate?dataObj.ExtendData.ReleaseDate:'暂无'}}
                      </span>
                    </p>
                     <p class="section-author">归口单位：
                        <span>
                         {{dataObj.ExtendData.ChargeUnit?dataObj.ExtendData.ChargeUnit:'暂无'}}
                       </span>
                     </p>
                  </div>
                </div>
                <div class="clearfix"></div>
                <div class="standard-intro-three">
                  <p class="section-author">起草单位：
                    <span>
                      {{dataObj.ExtendData.DraftingDept?dataObj.ExtendData.DraftingDept:'暂无'}}
                    </span>
                  </p>
                  <p class="section-author">起草人：
                    <span>
                      {{dataObj.ExtendData.DraftingUser?dataObj.ExtendData.DraftingUser:'暂无'}}
                    </span>
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="section-right fr">
                <div class="right-title">
                  <i :class="isFavorite?'el-icon-star-on':'el-icon-star-off'" 
                  style="font-size: 24px;margin: 0 16px 4px 0;cursor:pointer"  @click="updateFavorite(objectType,sectionId,userId,updateFn)"></i>
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
                     @click.stop="addToShoppingCar(dataObj)">{{dataObj.ExtendData.IsJoinedCart ? '已加入购物车':'加入购物车'}}

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
        <div class="bottom">
          <div class="bottom-one">
            <div class="bottom-title fl">中文摘要：</div>
            <div class="bottom-content fl" :style="{width:(0.8 * winWidth - 110)+ 'px'}">
              {{dataObj.Abstracts?dataObj.Abstracts:'暂无'}}
            </div>
          </div>
          <!-- <div class="clearfix"></div>
          <div class="bottom-one">
            <div class="bottom-title fl">小节目录：</div>
            <div class="bottom-content fl" :style="{width:(0.8 * winWidth - 110)+ 'px'}">
              {{dataObj.Author?dataObj.Author:'暂无'}}
            </div>
          </div> -->
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
      objectType: '', //电路标准 103
      isFavorite: false,

      loading:true,
      dataObj: {
        ExtendData:{}
      },
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
    // this.getFavorite(this.objectType, this.sectionId, this.userId, this.updateFn)
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
            id: this.sectionId,
          }
        })
        .then((res) => {
          if (res.data.Success) {
            this.loading = false;
            // console.log(res.data)
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
    updateFn(isFavorite) {
      this.isFavorite = isFavorite
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
          this.toBookView(item); 
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
          console.log(data)
          //下面是配合winform异步获取数据

          //多线程异步下载
          DownLoadProgress('POST','/Content/Authorize',JSON.stringify(Object.assign({},systemParams,data)),(progress,nativeUrl='',err)=>{
            console.log(data)
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

</style>
