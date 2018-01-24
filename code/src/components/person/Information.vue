<template>
  <div class="information">
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:60 + 'px',minWidth:600 + 'px'}">
     <el-table 
     v-loading="loading" 
      element-loading-text="数据加载中..."
      :data="tableData" 
      @selection-change="handleSelectionChange"
      :default-sort = "{prop: 'CreateTime', order: 'descending'}">
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <!-- <el-table-column prop="Id" label="编号" width="100"></el-table-column> -->
        <el-table-column prop="Title" label="名称" ></el-table-column>
        <el-table-column 
        prop="IsReaded" 
        label="状态"
        align="center"
        :render-header="renderHeader">
           <template slot-scope="scope">
            <span>{{scope.row.IsReaded?"已读":"未读"}}</span>
          </template>
        </el-table-column>
        <el-table-column 
        prop="CreateTime" 
        label="时间"
        sortable>
        </el-table-column>
        
        <el-table-column label="操作"  width="120">
          <template slot-scope="scope">
            <el-button size="small" @click="toInformationDetail(scope.row)" style="border-color:#1c517d;color:#1c517d">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
       <div style="margin-top: 15px;">
        <!-- <el-button size="small" v-if="multipleSelection!=''"  @click="setRead">标为已读</el-button>
        <el-button size="small" disabled v-if="multipleSelection==''">标为已读</el-button> -->
        <el-button size="small" v-if="multipleSelection!=''"  @click="deleteFn">删除选中</el-button>
        <el-button size="small" disabled v-if="multipleSelection==''">删除选中</el-button>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,

      loading:true,
      tableData: [],
      userId:localStorage.userId,
      pageSize: 10,
      page: 1,
      totalCount:0,
      multipleSelection:'',

      readType:''
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
          }
        },
        [
          h('el-dropdown', {
              props: {
                trigger: 'click',
              },
              on: {
                  'command': command => {
                      this.readType = command;
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
                  },'状态'),
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
                      command:2
                    }
                  },'全部'),
                  h('el-dropdown-item',{
                    props:{
                      command:0
                    }
                  }, '未读'),
                  h('el-dropdown-item',{
                    props:{
                      command:1
                    }
                  }, '已读'),
                ]
              ),
           ],''),
        ]);
    },
    /**
     * [getList 获取我的收藏列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-20
     * @return   {[type]}   [objectType：全部：0，图书：104，视频：109，图片：111，章节：102，电路包：106，论文：105]
     */
    getList() {
      this.loading = true;
      this.$http.get("/Message/List", {
          params: {
            ps: this.pageSize,
            cp: this.page,
            userId: this.userId,
            readType:this.readType
          }
        })
        .then((res) => {
          if (res.data.Success) {
            this.loading = false;
            this.tableData = res.data.Data.ItemList;
            console.log(res.data.Data.ItemList)
            this.totalCount = parseInt(res.data.Data.RecordCount);
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
        arr1.push(item.Id)
      })
      this.multipleSelection = arr1.join(",")
    },
    /**
     * [setRead 标为已读]
     * @Author   赵雯欣
     * @DateTime 2017-11-21
     */
    setRead(){
      this.$confirm('您确定将该消息标记为已读吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      this.$http.post("/Message/SetIsRead", {
          ids:this.multipleSelection,
        })
        .then((res) => {
          // console.log(res)
          if (res.data.Success == true) {
            this.multipleSelection = '';
            this.$message({
              message: '标记成功',
              type: 'success'
            });
            this.getList();
          }else{
              this.$message.error(res.data.Description);
           }
        });
      }).catch(() => {});
    },
    /**
     * [deleteFn 删除]
     * @Author   赵雯欣
     * @DateTime 2017-11-21
     * @return   {[type]}   [description]
     */
    deleteFn(){
       this.$confirm('您确定将该消息永久删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      this.$http.post("/Message/Delete", {
          ids:this.multipleSelection,
        })
        .then((res) => {
          if (res.data.Success) {
            this.multipleSelection = '';
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getList()
          }else{
              this.$message.error(res.data.Description);
           }
        });
      }).catch(() => {});
    },
    /**
     * [toInformationDetail 跳转到消息详情，数据直接从列表来]
     * @Author   罗文
     * @DateTime 2017-11-30
     * @param    {[type]}   path  [description]
     * @param    {[type]}   query [description]
     * @return   {[type]}         [description]
     */
    toInformationDetail(row) {
      if(env == 'dev'){
        this.goOtherPage('/InformationDetail',row.Id);
      }else if(env == 'prod') {
        console.log(row.Id)
        SaveArgument( row.Id + '');
        OpenForm(486,436,'/index.html#/InformationDetail','消息详情');
      } 
    }
  },
  watch:{
    objectType:function(val, oldVal){
      if(val!=oldVal){
        this.getList()
      }
    }
  }
}

</script>
<style lang="less">
.information {
  text-align: left;
}

</style>
