<template>
  <div>
  <el-table
      v-loading="loading" 
      element-loading-text="数据加载中..."
      ref="expListTable"
      :data="tableData"
      style="width: 97%;margin:0 20px 40px;min-width:635px"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      >
      <el-table-column type="expand" >
        <template slot-scope="props" >
            <div v-if="props.row.sections.length > 0">
              <ul class="subject-table-of-content">
                 <li v-for="(item,index) in props.row.sections">
                   {{item.Title}}
                 </li>
              </ul>
            </div>
            <div v-else style="text-align:center;margin:15px auto">暂无数据</div>
        </template>
      </el-table-column>
      <el-table-column
        label="专题名称"
        >
        <template slot-scope="props">
          <div style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
              {{props.row.Title}}
          </div>
        </template>
      </el-table-column>


      <el-table-column
        label="目录"
        align="center"
        >
        <template slot-scope="props">
            <a href="javascript:void(0)" style="cursor:pointer" @click="expandRowKeys(props.row.Id,props.row)">
               {{props.row.isExpand?'收起':'展开'}}
                 <i class="el-icon-arrow-down" :style="{transition:'all .5s',transform:'rotate('+transform(props.row)+'deg)'}">
                 </i>
            </a>
        </template>
      </el-table-column>
      <el-table-column
        label="来源"
        align="center"
        >
        <template slot-scope="props">
            <div style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
              <div href="javascript:void(0)">
              {{props.row.ExtendData.Source ? props.row.ExtendData.Source : '暂无数据'}}
              </div>
            </div>
        </template>
      </el-table-column>
      <el-table-column
        label="状 态"
        align="center"
        >
        <template slot-scope="props">
         <el-button
           size="small"
           type="primary"
           style="margin-right:10px;"
           @click.stop="goOtherPage('/section',props.row.Id,props.row.Title)">查看详情
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
import $ from 'jquery';
export default {
   props:['twoChildId'],
   data () {
    return {
       winWidth:window.innerWidth,
       winHeight:window.innerHeight, 
       expandData:[],   //
       //基本数据
      tableData:[],
      pageSize:10,
      currentPage:1,
      totalCount:0,
      loading:false,

       expands: [],
    }
  },
  methods:{
   getRowKeys(row) {
      return row.Id;
    },
    transform(row) {
      return row.isExpand ? 180 : 0;
    },
    //设置展开项
    expandRowKeys(newVal,row) {
        if(row.sections && row.sections.length !== 0) {
           this.doExpand(newVal,row);
           return;
        }
        //如果没拉过数据，就去拉数据，回调打开1
        this.getTableOfData(row,()=>{
            this.doExpand(newVal,row);
        })
      },
     /**
      * [doExpand 执行展开操作]
      * @Author   罗文
      * @DateTime 2017-11-24
      */
     doExpand(newVal,row) {
       var index = 0;
         this.tableData.forEach((item,index1)=>{
            if(item.Id == newVal) {
               index = index1;
            }
         })

         if(this.expands.indexOf(newVal) != -1) {
           row.isExpand = true;
           this.expands.splice(this.expands.indexOf(newVal),1);
           this.$set(this.tableData,index,row);
           return;
         }

         row.isExpand = false;
         this.$set(this.tableData,index,row);
         this.expands.push(newVal);
     }, 
    
     //获取目录数据
     getTableOfData(row,callback){
         this.$http.get("/TableOfContent/List", {
            params: {
              objectId: row.Id,
            }
          })
          .then((res) => {
            if(res.data.Success == true){
              row.sections = res.data.Data;
               if(callback) callback();
            }else{
              row.sections = [];
              if(callback) callback();
            }
          })
     },
      /**
   * [获取列表数据]
   * @作者     王柳
   * @日期     2017-11-21
   */
     getList() {
        this.loading = true;
        this.$http.get("/Content/Search", {
          params: {
            packageId: this.twoChildId ? this.twoChildId : 1,
            objectTypes: 102,
            ps: this.pageSize,
            cp: this.currentPage,
          }
        })
        .then((res) => {
          this.loading = false;
          console.log(res)
           if (res.data.Success == true) {
               
               //请求专题下的数据
               this.tableData = res.data.Data.ItemList;
               this.totalCount =res.data.Data.RecordCount;
               this.tableData = this.tableData.map((item)=>{
                  return Object.assign({},item,{sections:[]});
              });
               //下面是winform下的获取当前文件是否已经下载
              if(localStorage.getItem('userId') && localStorage.getItem('userId') !== '' && env == 'prod') {
                  GetDownLoadedResources(listIds.join(','),localStorage.getItem('userId'),(hasDownLoadedContent)=>{
                      
                      hasDownLoadedContent = JSON.parse(hasDownLoadedContent);

                      if(hasDownLoadedContent.length !== 0) {
                         //表明此时是已经下载过的了
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
           }else{
              this.$message.error(res.data.Description);
           }
        })
     }, 
      //分页
     handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
      //模拟下载事件
     download(item,index,row,rowIndex) {
         if(item.hasDown) {
            this.toBookView(item); 
          }else {
            //只要一点击就变为0
            item.startDownLoad = true;
            this.$set(this.tableData[rowIndex].Sections,index,item)
            if(env == 'dev') {
               var setTime = setInterval(()=>{
                    if(item.downLoadPercent >= 100) {
                       item.downLoadPercent = 100;
                       item.hasDown = true;  
                       this.$set(this.tableData[rowIndex].Sections,index,item)
                       clearInterval(setTime);
                    }else {
                       item.downLoadPercent++;
                       this.$set(this.tableData[rowIndex].Sections,index,item)
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
                    this.$set(this.tableData[rowIndex].Sections,index,item)
                  }              
              });

            }
          }
     },
     setWindow() {
      this.winWidth = window.innerWidth;
      this.winHeight = window.innerHeight;
    },
  },
  mounted() {
    console.log(this.twoChildId)
    this.getList();

    window.onresize = () => {
        this.setWindow();
    }
  },
  watch:{
    twoChildId:function(val,oldVal){
      this.currentPage = 1;
      this.getList();
    },
    pageSize:function(val,oldVal){
      if (val) {
        this.currentPage = 1;
        this.getList();
      }
    },
  },
  updated() {
     //用于去除首列的折叠箭头
     this.removeExpandTableFirstCol();
     

     let _this = this;
     //每次点击专题下的目录，请求这个目录下的数据，因为其组件不提供click类似的方法，change方式太麻烦，就采用绑定数据的方式
     $('.el-collapse-item').on('click',function(e) {
         //请求当前这个章节的目录数据
         let parentIndex = $(this).attr('data-parentIndex');
         let index = $(this).attr('data-index');
         //避免重复拉取
         if(_this.listOfItemTableHasExpand[index]) return;

         _this.loading = true;
         _this.$http.get("/TableOfContent/List", {
            params: {
              objectId: $(this).attr('data-id'),
            }
          })
          .then((res) => {
               
             if (res.data.Success == true) {
                //将获取到的目录数据绑定到该章节下
                _this.listOfItemTableHasExpand[index] = true;
                _this.$nextTick(()=>{
                   _this.$set(_this.listOfItemTableContent,index,res.data.Data)
                   _this.loading = false;
                   // _this.$set(_this.tableData[parentIndex].Sections[index],'tableOfContent',res.data.Data);
                })

                // console.log(_this.tableData)
             }else{
                _this.loading = false;
                _this.$message.error(res.data.Description);
             }
          })
     })
  },
}
</script>
<style scoped>
   .user-center-cont {
    display: flex;
    justify-content: center;
    align-items: center;
   }

   .user-center-main {
      width: 464px;
      height: 460px;
      border: 1px solid #ddd;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      overflow: hidden;
    }


   .noTableData {
      display:flex;
      justify-content: center;
      align-items: center;
      height:100px;
      width:100%;
  }

  .expand-detail-overflow {
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
     width:100%;
     height:40px;
     line-height: 40px;
     cursor:pointer;

  }
  
</style>
