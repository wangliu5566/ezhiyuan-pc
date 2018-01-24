<template>
  <div class="paper-list">
    <div class="filter-line" :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:18 + 'px',minWidth:600 + 'px'}">
      <el-select v-model="year" placeholder="年份">
        <el-option
          v-for="item in options1"
          :key="item.year"
          :label="item.label"
          :value="item.year">
        </el-option>
      </el-select>
      <el-select v-model="number" placeholder="期号">
        <el-option
          v-for="item in options2"
          :key="item.number"
          :label="item.label"
          :value="item.number">
        </el-option>
      </el-select>
    </div>
    <el-table 
    v-loading="loading" 
    element-loading-text="数据加载中..."
    ref="sectionListTable" 
    :data="listData" 
    :row-key="getRowKeys" 
    :expand-row-keys="expands"
    :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:18 + 'px',minWidth:600 + 'px'}">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div style="width:80%;line-height:20px;margin:10px auto;padding:10px 15px;outline: 1px dashed #ddd;">
             <div @contextmenu.prevent="" style="line-height:20px">
              <span style="color:#000">中&nbsp;文&nbsp;摘&nbsp;要：</span>
              {{props.row.Abstracts? props.row.Abstracts:'暂无'}}
            </div>
            <div class="mysource" style="margin-top:10px" @click="goBookDetail(props.row.ParentId,props.row.Title)">
              <span style="color:#000">中文关键词：</span>
              {{props.row.ExtendData.Keywords?props.row.ExtendData.Keywords:'暂无'}}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="论文名">
        <template slot-scope="props">
          <div style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
             <a href="javascript:void(0)" @click="goOtherPage('/paperDetail',props.row.Id,props.row.Title);">{{props.row.Title}}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="作者">
        <template slot-scope="props">
          <div href="javascript:void(0)">
          {{props.row.Author?props.row.Author:'暂无'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="简介" align="center">
        <template slot-scope="props">
          <a href="javascript:void(0)" style="cursor:pointer" @click="expandRowKeys(props.row.Id,props.row)">
               {{props.row.isExpand?'收起':'展开'}}
                 <i class="el-icon-arrow-down" :style="{transition:'all .5s',transform:'rotate('+transform(props.row)+'deg)'}">
                 </i>
            </a>
        </template>
      </el-table-column>
      <el-table-column label="状 态" align="center">
        <template slot-scope="props">
          <!-- <el-button @click="goOtherPage('/paperDetail',props.row.Id,props.row.Title)"
          style="width: 100px;height: 34px;background-color: #1c517d;color: white;line-height:0">查看详情
          </el-button> -->

          <el-button 
           size="small"
           style="width: 100px"
            v-if="props.row.ExtendData.IsOrdered ? !props.row.ExtendData.IsOrdered : !props.row.ExtendData.IsJoinedCart"
           @click="addToShoppingCar(props.row,true)"
           >
             购买
          </el-button>
           <el-button 
           size="small"
           type="primary"
           style="width: 100px"
           :disabled="props.row.ExtendData.IsJoinedCart ? true : false" 
           v-show="!props.row.ExtendData.IsOrdered"
           @click="addToShoppingCar(props.row)"
           >
           {{props.row.ExtendData.IsJoinedCart ? '已加入购物车':'加入购物车'}}
          </el-button>
          <el-button 
           size="small"
           style="width: 100px;margin-left:12px"
           @click.stop="download(props.row,props.$index)" 
           v-if="props.row.ExtendData.IsOrdered"
           :type="props.row.hasDown ? 'primary':''"
           :disabled="(props.row.downLoadPercent == 0 && props.row.startDownLoad) || (props.row.downLoadPercent != 0 && props.row.downLoadPercent != 100)">

            {{ props.row.hasDown ? '阅 读' : (props.row.downLoadPercent == 0 && !props.row.startDownLoad? '点击下载' : props.row.downLoadPercent +'%')}}

           </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 15px;">
      <div class="page">
        <el-pagination 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page="currentPage" 
        :page-sizes="[10, 20, 30, 40]" 
        :page-size="pageSize" 
        layout="total, sizes, prev, pager, next" 
        :total="totalCount">
        </el-pagination>
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
      //select选择数据
      options1:[{
        label:'',
        year:''
      }],
      year: '',
      options2:[{
        label: '',
        number: ''
      }],
      number: '',
      magazineId: '', //所属期刊编号

      loading:true,
      listData: [],
      currentPage: 1,
      totalCount: 0,
      pageSize:10,
      userId:localStorage.userId,
      activeName: 'second',
      expands: [],
    }
  },
  mounted() {
    this.magazineId = this.$route.query.id || GetArgument().split('=')[1];
    this.getDetail();
    this.getYearAndNumber();

    window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    }
  },
  updated() {
    //用于去除首列的折叠箭头
    this.removeExpandTableFirstCol();
     
  },
  methods: {
    //获取论文的年号和期数
    getYearAndNumber(){
      this.$http.get("/Magazine/YearAndNumber", {
          params: {
            magazineId:this.magazineId,
          }
        })
        .then((res) => {
          if (res.data.Success == true) {
            // console.log(res)
            var arr1 = [];
            var arr2 = [];
            res.data.Data.Years.forEach((item) => {
              arr1.push({
                label:item + '年',
                year:item
              })
            });

            res.data.Data.Numbers.reverse().forEach((item) => {
              arr2.push({
                label:'第' + item + '期',
                number:item
              })
            });
            // arr1.unshift({
            //   label:'全部',
            //   year:'0'
            // });
            // arr2.unshift({
            //   label:'全部',
            //   number:'0'
            // });
            this.options1 = arr1;
            this.options2 = arr2;
            console.log(this.options1,this.options2)
          }
        })
    },
    /**
     * [getDetail 获取我的收藏列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-20
     * @return   {[type]}   [objectType：全部：0，图书：104，视频：109，图片：111，章节：102，电路包：106，论文：105]
     */
    getDetail() {
      this.loading = true;
      this.$http.get("/Content/Search", {
          params: {
            objectTypes: 105,
            packageId:this.magazineId,
            year: this.year,
            number: this.number,
            ps: this.pageSize,
            cp:this.currentPage,
          }
        })
        .then((res) => {
          if (res.data.Success) {
            console.log(1111)
            this.loading = false;
            this.listData = res.data.Data.ItemList;
            this.totalCount = res.data.Data.RecordCount;

            let listIds = [];

             this.listData = this.listData.map((item)=>{
                listIds.push(item.Id)

                return Object.assign({},item,{
                     hasDown:false,
                     downLoadPercent:0,
                     startDownLoad:false,
                   })
             })


             //下面是winform下的获取当前文件是否已经下载
            if(localStorage.getItem('userId') && localStorage.getItem('userId') !== '' && env == 'prod') {
                GetDownLoadedResources(listIds.join(','),localStorage.getItem('userId'),(hasDownLoadedContent)=>{
                    
                    hasDownLoadedContent = JSON.parse(hasDownLoadedContent);
                    console.log(hasDownLoadedContent)

                    if(hasDownLoadedContent.length !== 0) {
                       //表明此时是已经下载过的了
                       hasDownLoadedContent.forEach((getItem,getIndex)=>{
                         this.listData.forEach((bookItem,bookIndex)=>{
                             if(getItem.ObjectId == bookItem.Id) {
                                 bookItem['hasDown'] = true;
                                 this.$set(this.listData,bookIndex,bookItem);
                             }
                         })
                       })
                    }
                })
              }
          }else{
            this.loading = false;
            this.$message.warning(res.data.Description);
          }
        })
    },
    //分页
     handleSizeChange(val) {
      this.pageSize = val;
      this.getDetail();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDetail();
    },

    getRowKeys(row) {
      return row.Id;
    },
    transform(row) {
      return row.isExpand ? 180 : 0;
    },

    //设置展开项
    expandRowKeys(newVal, row) {
      var index = 0;
      this.listData.forEach((item, index1) => {
        if (item.Id == newVal) {
          index = index1;
        }
      })

      if (this.expands.indexOf(newVal) != -1) {
        row.isExpand = false;
        this.expands.splice(this.expands.indexOf(newVal), 1);
        this.$set(this.listData, index, row);
        return;
      }

      row.isExpand = true;
      this.$set(this.listData, index, row);
      this.expands.push(newVal);
    },
    //模拟下载事件
    download(item,index) {
        item.currentPage = this.currentPage;

        if(item.hasDown) {
            this.toPdfView(item);
         }else {
            //只要一点击就变为0
            item.startDownLoad = true;
            this.$set(this.listData,index,item);

            if(env == 'dev') {
               var setTime = setInterval(()=>{
                    if(item.downLoadPercent >= 100) {
                       item.downLoadPercent = 100;
                       item.hasDown = true;  
                       this.$set(this.listData,index,item)
                       clearInterval(setTime);
                    }else {
                       item.downLoadPercent++;
                       this.$set(this.listData,index,item)
                    }
                }, 50)
            }else if(env == 'prod') {

             var data = {
                    objectId:item.Id,
                    isPC:true,
                    type:2,  //1 - EPUB  2 - pdf  3 - 视频  4 - 图片
                    userid:localStorage.getItem('userId'),
                    title:item.Title,
                    objectType:item.ObjectType,
                    objectTypeDescription:item.ObjectTypeDescription,
                    DefaultFileExtension:item.DefaultFileExtension,
                    extendData:JSON.stringify(item.ExtendData)
                }


             //多线程异步下载
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

                      this.$set(this.listData,index,item);
                      
                    }              
                });
              }
          }  
      },
  },
  watch: {
    year: function(val, oldVal) {
      if (val != oldVal) {
        this.getDetail()
      }
    }, 
    number: function(val, oldVal) {
      if (val != oldVal) {
        this.getDetail()
      }
    },
     pageSize:function(val,oldVal){
      if (val) {
        this.currentPage = 1;
        this.getDetail();
      }
    },
  }
}

</script>
<style lang="less" scoped>
.paper-list {
  .el-table {
    border: 1px solid #e6ebf5;
    border-bottom: none;
    @media screen and (max-width: 1130px) {
      .el-button:nth-child(1){
        margin-left: 14px;
      }
      .el-button:nth-child(2){
        margin-top: 4px;
      }
   }
  }
}

</style>
