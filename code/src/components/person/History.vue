<template>
  <div class="history">
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:60 + 'px',minWidth:600 + 'px'}">
      <!-- <div class="filter-line">
        筛选类型：
        <el-select v-model="objectType">
          <el-option
            v-for="item in options"
            :key="item.objectType"
            :label="item.label"
            :value="item.objectType">
          </el-option>
        </el-select>
      </div> -->
      <el-table 
      v-loading="loading" 
      element-loading-text="数据加载中..."
      :data="tableData" 
      :default-sort = "{prop: 'CreateTime', order: 'descending'}"
      @selection-change="handleSelectionChange" 
      style="width: 100%">
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column 
        label="类型" 
        width="180"
        align="center"
        :render-header="renderHeader">
           <template slot-scope="scope">
            <span>{{scope.row.Content.ObjectTypeDescription ? scope.row.Content.ObjectTypeDescription : '暂无'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称">
           <template slot-scope="scope">
            <span style="cursor:pointer;" @click="download(scope.row.Content)">
            {{scope.row.Content.Title}}
            </span>
          </template>
        </el-table-column>
         <!-- <el-table-column prop="address" label="来源" empty-text="不详">
          <template slot-scope="scope">
            <span>{{scope.row.Content.ExtendData.Source ? scope.row.Content.ExtendData.Source :'不详'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column 
        label="时间" 
        width="180"
        sortable
        prop="CreateTime">
          <template slot-scope="scope">
            <span>{{scope.row.Content.ExtendData.RelationCreateTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;">
        <el-button size="small" v-if="multipleSelection !=''"  @click="deleteFn()">删除选中</el-button>
        <el-button size="small" disabled v-if="multipleSelection == ''">删除选中</el-button>
        <div class="page">
          <el-pagination 
          @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :current-page="page" 
          :page-sizes="[10, 20, 30, 40]" 
          :page-size="pageSize" 
          layout="total, sizes, prev, pager, next" 
          :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>


    <div class="loading-content" style="background:black" v-show="downloadLoading">
    </div>
    <div class="loading-content load-other" style="background:transparent;color:white" v-show="downloadLoading" v-cloak>
      <p>正在为您下载 {{downLoadFileName}}，请稍候...{{downLoadPercent}} %</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
       objectType: '',
      
      loading:true,
      tableData: [],
      userId:localStorage.userId,
      pageSize: 10,
      page: 1,
      totalCount:0,
      multipleSelection:'',
      downloadLoading: false,
      downLoadPercent: 0,
      downLoadFileName: '',
    }
  },
  mounted() {
    this.getList();
    window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    }
  },
  methods: {
     renderHeader(h, { _self }) {
      return h(
        'div',{
          style:{
            height:'30px',
            cursor:'pointer',
            textAlign:'left',
          }
        },
        [
          h('el-dropdown', {
              props: {
                trigger: 'click',
              },
              on: {
                  'command': command => {
                      this.objectType = command;
                      // this.getResourceData();
                      this.getList();
                  }
              }
            },[
              h('span', {
                attrs: { class:"el-dropdown-link" },
                },[
                  h('span',{
                    style:{
                      color:'#5a5e66',
                      marginRight:'10px',
                    }
                  },'类型'),
                  h('img', {
                      attrs: { src:"./static/images/筛选.png" },
                    }, ''
                  ),
                ]),

              h('el-dropdown-menu', {
                slot:'dropdown'
                },[
                  h('el-dropdown-item',{
                    props:{
                      command:''
                    }
                  },'全部'),
                  h('el-dropdown-item',{
                    props:{
                      command:102
                    }
                  }, '章节'),
                  h('el-dropdown-item',{
                    props:{
                      command:103
                    }
                  }, '标准'),
                  // h('el-dropdown-item',{
                  //   props:{
                  //     command:104
                  //   }
                  // }, '图书'),
                  h('el-dropdown-item',{
                    props:{
                      command:105
                    }
                  }, '论文'),
                  h('el-dropdown-item',{
                    props:{
                      command:106
                    }
                  }, '电路包'),
                  // h('el-dropdown-item',{
                  //   props:{
                  //     command:109
                  //   }
                  // }, '视频'),
                  // h('el-dropdown-item',{
                  //   props:{
                  //     command:111
                  //   }
                  // }, '图片'),
                ]
              ),
           ],''),
        ]);
    },

    /**
     * [getList 获取我的浏览列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-20
     * @return   {[type]}   [objectType：全部：0，图书：104，视频：109，图片：111，章节：102，电路包：106，论文：105]
     */
    getList() {
      // this.loading = true;
      this.$http.get("/History/List", {
          params: {
            objectType: this.objectType,
            actionType:3,
            ps: this.pageSize,
            cp: this.page,
            userId: this.userId
          }
        })
        .then((res) => {
          if (res.data.Success) {
            console.log(res)
            this.loading = false;
            this.tableData = res.data.Data.ItemList;
            this.totalCount = res.data.Data.RecordCount;
          }else {
             this.loading = false;
            this.$message.error(res.data.Description);
          }
        })
    },
    /**
     * [handleSizeChange 处理分页每页的条数]
     * @Author   赵雯欣
     * @DateTime 2017-11-20
     * @param    {[type]}   val [description]
     * @return   {[type]}       [description]
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList()
    },
    /**
     * [handleCurrentChange 处理当前页]
     * @Author   赵雯欣
     * @DateTime 2017-11-20
     * @param    {[type]}   val [description]
     * @return   {[type]}       [description]
     */
    handleCurrentChange(val) {
      this.page = val;
      this.getList()
    },
    /**
     * [handleSelectionChange 确定多选的ids集合]
     * @Author   赵雯欣
     * @DateTime 2017-11-20
     * @param    {[type]}   val [description]
     * @return   {[type]}       [description]
     */
    handleSelectionChange(val) {
      var arr1 = []
      val.forEach((item)=>{
        arr1.push(item.ObjectId);
      })

      this.multipleSelection = arr1.join(",")
    },
    /**
     * [deleteFn 删除]
     * @Author   赵雯欣
     * @DateTime 2017-11-21
     * @return   {[type]}   [description]
     */
    deleteFn(){
      this.$confirm('是否确定要删除该阅读历史吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then(() => {
        this.$http.post("/History/Delete", {
            objectIds:this.multipleSelection,
            actionType:3
          })
          .then((res) => {
            if (res.data.Success) {
              this.multipleSelection = '';
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getList();
            }
          })
      }).catch(() => {});
    },

    /**
     * [download 下载资源，要区分视频和图片]
     * @Author   罗文
     * @DateTime 2017-12-12
     * @param    {[Object]}   item [资源对象]
     * @return   {[type]}        [description]
     */

    download(item) {
      let ext = this.getReaderSupportExtension();
      let reader = '';
      ext.forEach((citem,cindex)=>{
          if(item.DefaultFileExtension.indexOf(citem.ext) !== -1) {
             reader = citem.reader;
          }
      })

      //根据不同的类型，执行不同的阅读
      if(reader == '视频' || reader == '图片') {
         this.toVideoOrImgView(item);
      }else if(reader == 'PDF' || reader == '图书') {
         this.execDownload(item,reader);
      }else {
         this.$message.warning('暂不支持该种格式的阅读！');
      }

    },
    
    /**
     * [execDownload 执行下载操作，或进行下载前检查]
     * @Author   罗文
     * @DateTime 2017-12-12
     * @param    {[Object]}   item [资源对象]
     * @return   {[type]}        [description]
     */
    execDownload(item,reader) {
       this.isFileDownLoad(item,reader,(type)=>{
          this.downLoadPercent = 0;
          this.downloadLoading = true;
          this.downLoadFileName = item.Title;

          var data = {
              objectId:item.Id,
              isPC:true,
              type:reader == '图书' ? 1 : 2,  //1 - EPUB  2 - pdf  3 - 视频  4 - 图片
              userid:localStorage.getItem('userId'),
              title:item.Title,
              objectType:item.ObjectType,
              objectTypeDescription:item.ObjectTypeDescription,
              DefaultFileExtension:item.DefaultFileExtension,
              extendData:JSON.stringify(item.ExtendData)
          }


          //多线程异步下载
          DownLoadProgress('POST','/Content/Authorize',JSON.stringify(Object.assign({},systemParams,data)),(progress,nativeUrl,err)=>{
                if(err) {
                    this.$message.error(err);
                    this.downloadLoading = false;
                }else {
                    item.nativeUrl = nativeUrl;
                    //获取下载进度
                    if (Math.floor(progress) >= 100) {
                        this.downLoadPercent = 100;
                        this.downloadLoading = false;
                        if(reader == '图书' ) {
                          this.toBookView(item);
                        }else if(reader == 'PDF') {
                          this.toPdfView(item);
                        }
                    } else {
                        this.downLoadPercent = Math.floor(progress);
                    }
                }
          });


       }); 
    },

    //验证是否下载过该章节/地图
    isFileDownLoad(item,reader,downloadFn) {
        // fileType - 1 章节  2 - 地图
        //异步获取下载,根据文件id
        
        GetDownLoadedResources(item.Id+'',localStorage.getItem('userId'),(hasDownLoadedContent) => {
          hasDownLoadedContent = JSON.parse(hasDownLoadedContent);
          if (hasDownLoadedContent.length == 0) {
            //需要重新下载
            downloadFn();
          }else {
             if(reader == '图书' ) {
                this.toBookView(item);
             }else if(reader == 'PDF') {
                this.toPdfView(item);
             }
          } 
        })
    },


  },
  watch:{
    objectType:function(val, oldVal){
      if(val!=oldVal){
        this.getList()
      }
    },
     pageSize:function(val,oldVal){
      if (val) {
        this.page = 1;
        this.getList();
      }
    },
  }
}

</script>
<style lang="less">
.history {
  text-align: left;
}

</style>
