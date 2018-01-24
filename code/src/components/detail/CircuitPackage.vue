<template>
  <div class="circuit-package" v-loading="loading" element-loading-text="数据加载中...">
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:38 + 'px',minWidth:800 + 'px'}">
      <div class="top">
        <div class="standard-img fl">
          <img :src="dataObj.CoverUrl" alt="">
        </div>
        <div class="standard-right fl" :style="{width:(0.9 * winWidth - 192) + 'px',minWidth:350 + 'px'}">
          <el-row>
            <el-col :span="20">
              <div class="circuit-title-left">
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
            </el-col>
            <el-col :span="4">
              <div class="circuit-title-right fr" >
                <i :class="isFavorite?'el-icon-star-on':'el-icon-star-off'" 
                style="font-size: 24px;margin-bottom:4px;cursor:pointer" @click="updateFavorite(objectType,sectionId,userId,updateFn)"></i>
                <p>{{isFavorite?'已收藏':'点击收藏'}}</p>
              </div>
              <div class="clearfix"></div>
            </el-col>
          </el-row>
          <div class="clearfix"></div>
          <div class="section-intro">
            <span class="standard-intro-span fl">设计任务：</span>
            <div class="standard-intro-div fl">
              {{dataObj.Abstracts ? dataObj.Abstracts :'暂无'}}
            </div>
          </div>
          <div class="clearfix"></div>
          <div class="right-button fr">
             <el-button 
             v-show="dataObj.ExtendData.IsOrdered ? !dataObj.ExtendData.IsOrdered : !dataObj.ExtendData.IsJoinedCart" 
             @click="addToShoppingCar(dataObj,true)"
             >
               购买
             </el-button>
            <!--  <el-button 
             @click="goConfirmBtn('/confirmOrder',dataObj)"
             v-show="!dataObj.ExtendData.IsOrdered"
             >
               直接购买
             </el-button> -->
             <el-button 
             type="primary"
             :disabled="dataObj.ExtendData.IsJoinedCart ? true : false" 
             v-show="!dataObj.ExtendData.IsOrdered"
             @click="addToShoppingCar(dataObj)"
             >
             {{dataObj.ExtendData.IsJoinedCart ? '已加入购物车':'加入购物车'}}
             </el-button>
         </div>
        </div>
      </div>
      <div class="list">



        <el-table 
         v-loading="loading" 
        element-loading-text="数据加载中..."
        :data="tableData" 
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        :default-expand-all="true"
        >

         <el-table-column type="expand" >
            <template slot-scope="props" >
              <div class="boxs" @contextmenu.prevent="" v-if="props.row.ObjectType == 111">
                <div class="pics" v-for="(item,index) in props.row.imgList">
                  <img 
                  :src="item.CoverUrl" 
                  alt="" 
                  :style="{width: 0.077 * winWidth +'px',minWidth:150 + 'px'}"
                  @click="toVideoOrImgView(item,dataObj.Id,dataObj.Title)"
                  >
                </div>
              </div>
            </template>
         </el-table-column>
          <el-table-column label="内容标题">
            <template slot-scope="props">
              <span>{{props.row.Title}}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="type" min-width="120">
            <template slot-scope="props">
              <span>{{props.row.ObjectTypeDescription == '图书' ? (props.row.DefaultFileExtension == '.pdf' ? 'PDF':'图书') : props.row.ObjectTypeDescription}}</span>
            </template>
          </el-table-column>

          <el-table-column label="" prop="type" min-width="120">
            <template slot-scope="props">
              <a href="javascript:void(0)" v-if="props.row.ObjectType == 111" style="cursor:pointer" @click="expandRowKeys(props.row.Id,props.row)">
                 {{!props.row.isExpand ? '收起':'展开'}}
                 <i class="el-icon-arrow-down" :style="{transition:'all .5s',transform:'rotate('+transform(props.row)+'deg)'}">
                 </i>
              </a>
            </template>
          </el-table-column>


          <el-table-column label="操作">
            <template slot-scope="props">
              <!-- <el-button 
              type="primary"
              v-show="!dataObj.ExtendData.IsOrdered" 
              style="width: 100px;height: 34px;line-height:0"
              @click="toVideoView(props.row)"
              >
               购买
              </el-button> -->
              
              <el-button 
              type="primary"
              v-show="props.row.ObjectType == 109" 
              style="width: 100px;height: 34px;line-height:0"
              @click="toVideoOrImgView(props.row,dataObj.Id,dataObj.Title)"
              >
               阅读
              </el-button>

              <el-button 
              :type="props.row.hasDown ? 'primary' : ''" 
              v-if="props.row.ObjectType == 104" 
              style="width: 100px;height: 34px;line-height:0;margin-left:0"
              :disabled="(props.row.downLoadPercent == 0 && props.row.startDownLoad ) || (props.row.downLoadPercent != 0 && props.row.downLoadPercent != 100)"
              @click="download(props.row,props.$index,(props.row.ObjectType == 109 ? 3 : (props.row.ObjectType == 111 ? 4:2)))"
              >
              {{props.row.hasDown ?'阅读' : (props.row.downLoadPercent == 0 && !props.row.startDownLoad? '点击下载' : props.row.downLoadPercent +'%')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
      objectType: 106, //电路包就是106
      isFavorite: false,

      loading:true,
      tableData: [],
      count:1,
      dataObj: {ExtendData:{}},
      packageId:null,
      expands: ['img'],
      expRepeatIndex:0
    }
  },
  mounted() {
     window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    }
    this.sectionId = this.$route.query.id || GetArgument().split('=')[1];
    this.getDetail();
    this.getPackageTableData();
    // this.getFavorite(this.objectType,this.sectionId,this.userId,this.updateFn)
  },
  methods: {
    /**
     * [获取电路包Tabel数据]
     * @作者     王柳
     * @日期     2017-11-29
     */
    getPackageTableData(){
      this.loading = true;
      this.$http.get("/Content/Search", {
        params: {
          packageId: this.sectionId,
        }
      })
      .then((res) => {
        this.loading = false;
        if (res.data.Success) {
          console.log(res)
          this.tableData = res.data.Data.ItemList;
          let ids = [];

          var newTableData  = [];
          var imgList = [];
          var imgObj = {
              ObjectTypeDescription:'图片',
              ObjectType:111,
              Title:'相关配套'
          }

          res.data.Data.ItemList.forEach((item,index)=>{
              if(item.ObjectType == 104) {
                ids.push(item.Id);
                if(item.DefaultFileExtension == '') {
                   item.Title = '配套教案';
                }else {
                   item.Title = '设计说明';

                   newTableData.push(Object.assign({},item,{
                          hasDown:false,
                          downLoadPercent:0,
                          startDownLoad:false
                    }));
                }
                item.DefaultFileExtension = '.pdf';
              }

              if(item.ObjectType == 109)  {
                 item.Title = '视频讲解';
                 newTableData.push(Object.assign({},item,{
                      hasDown:false,
                      downLoadPercent:0,
                      startDownLoad:false
                }));
              }

              //如果匹配到图片，要整合到一个图片集合中
              if(item.ObjectType == 111 ) {
                imgList.push(item);
              }
              
          })


          this.tableData = [...newTableData,Object.assign({imgList:imgList,Id:'img'},imgObj)];


          console.log(this.tableData)



          if(env == 'dev') return;
          //下面是winform下的获取当前文件是否已经下载
          if(localStorage.getItem('userId') && localStorage.getItem('userId') !== '') {
            //异步获取下载
            GetDownLoadedResources(ids.join(','),localStorage.getItem('userId'),(hasDownLoadedContent)=>{
              console.log(hasDownLoadedContent);
                hasDownLoadedContent = JSON.parse(hasDownLoadedContent);
                
                console.log(hasDownLoadedContent);

                if(hasDownLoadedContent.length !== 0) {
                   //表明此时是已经下载过的了
                   // fileData = hasDownLoadedContent[0];
                   hasDownLoadedContent.forEach((getItem,getIndex)=>{
                     this.tableData.forEach((bookItem,bookIndex)=>{
                         if(getItem.ObjectId == bookItem.Id) {
                             bookItem['hasDown'] = true;
                             this.$set(this.tableData,bookIndex,bookItem);
                         }
                     })

                   })
                }

            })
          }

        }
      })
    },
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
          // console.log(res)
          if (res.data.Success) {
            this.loading = false;
            this.dataObj = res.data.Data;
            var isFavorite = res.data.Data.ExtendData.IsFavorited;
            if(isFavorite){
              this.isFavorite = isFavorite;
            }else{
              this.isFavorite = false;
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
      this.isFavorite = isFavorite;
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
     * [设置展开项]
     * @作者     王柳
     * @日期     2017-11-21
     */
    expandRowKeys(newVal, row) {
      var index = 0;
      this.tableData.forEach((item, index1) => {
        if (item.Id == newVal) {
            index = index1;
        }
      });


      if (this.expands.indexOf(newVal) != -1) {
        row.isExpand = true;
        this.expands.splice(this.expands.indexOf(newVal), 1);
        this.$set(this.tableData, index, row);
        return;
      }


      row.isExpand = false;
      this.$set(this.tableData, index, row);
      this.expands.push(newVal);
    },

    getRowKeys(row) {
      // console.log(this.expRepeatIndex)
      // if(row.Id !== 'img') {
        return row.Id;
      // }else {
      //   return row.Id +'-'+ (this.expRepeatIndex ++);
      // }
    },
    transform(row) {
      return row.isExpand ? 180 : 0;
    },

  
    
    /**
     * [download 下载图书]
     * @Author   罗文
     * @DateTime 2017-12-04
     * @param    {[Object]}   item  [本条数据]
     * @param    {[Number]}   index [本条数据的索引]
     * @param    {[Number]}   type  [本条资源类型 2 - pdf  3 - 视频  4 - 图片]
     * @return   {[type]}         [description]
     */
    download(item,index,type) {
      //  CloseMenueStrip();
      // // 验证有没有用户信息和激活码
      // var hasUserId = volidUserId(true);
      // if(!hasUserId) return;
      
      if(item.hasDown) {
        if(type == 2) {
          this.toPdfView(item,this.dataObj.Id,'电路包',this.dataObj.Title);
        }else {
          this.toVideoOrImgView(item,this.dataObj.Id,'电路包',this.dataObj.Title);
        }
      }else {
        //只要一点击就变为0
        item.startDownLoad = true;
        this.$set(this.tableData,index,item)
        if(env == 'dev') {
           var setTime = setInterval(()=>{
                if(item.downLoadPercent >= 100) {
                   item.downLoadPercent = 100;
                   item.hasDown = true;  
                   this.$set(this.tableData,index,item);
                   clearInterval(setTime);
                }else {
                   item.downLoadPercent++;
                   this.$set(this.tableData,index,item);
                }
            }, 50)
        }else if(env == 'prod') {

          var data = {
              objectId:item.Id,
              isPC:true,
              type:type,  //1 - EPUB  2 - pdf  3 - 视频  4 - 图片
              userid:localStorage.getItem('userId'),
              title:item.Title,
              objectType:item.ObjectType,
              objectTypeDescription:item.ObjectTypeDescription,
              DefaultFileExtension:item.DefaultFileExtension,
              extendData:JSON.stringify(item.ExtendData)
          }
          //下面是配合winform异步获取数据

          //多线程异步下载1
          DownLoadProgress('POST','/Content/Authorize',JSON.stringify(Object.assign({},systemParams,data)),(progress,nativeUrl='',err)=>{
              if(err) {
                item.startDownLoad = false;
                this.$message.error(err);
                // OpenForm(480,500,'/index.html#/userCenter','个人信息');
                // localStorage.setItem('fromWhere',3);
              }else {
                item.nativeUrl = nativeUrl;

                //获取下载进度
                if (Math.floor(progress) >= 100) {
                    item.downLoadPercent = 100;
                    item.hasDown = true;
                } else {
                    item.downLoadPercent = Math.floor(progress);
                }

                this.$set(this.tableData,index,item);
              }              
          });

        }
      }  
    },
    




  },

  updated() {
     let expandCell = document.querySelectorAll('.el-table__expanded-cell');
     for(let i = 0 ; i < expandCell.length ; i ++) {
        if(expandCell[i].children.length == 0) {
          expandCell[i].parentNode.removeChild(expandCell[i]);
        }
        
     }
     //用于去除首列的折叠箭头
     this.removeExpandTableFirstCol();
  },
}

</script>
<style lang="less">
.circuit-package {
  .top {
    /* overflow: hidden; */
  }
  .pictrue {
    width: 150px;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .word {
    width: 100%;
    overflow: hidden;
  }

  .title {
    font-size: 18px;
    font-weight: 700;
    height: 40px;
    padding-top: 10px;
  }

  .float {
    text-align: right;
    font-size: 14px;
  }

  .price {
    font-weight: 700;
    color: red;
    font-size: 18px;
  }

  .list {
    margin-top: 20px;
  }
  .el-table {
    border: 1px solid #e6ebf5;
    border-bottom: none;
  }

  .boxs {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    text-align: center;
    /*border: 1px solid #e6ebf5;*/
    border-top: none;
    margin: 10px auto;
  }

  .pics {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #eee;
    margin: 15px;
    float: left;
    img {
      min-width: 150px;
      max-width: 300px;
      cursor: pointer;
      border: 1px solid #eee;
    }
  }

  .package-img-item {
    width: 100%;
    height: 200px;
    background: red;
  }
}

</style>
