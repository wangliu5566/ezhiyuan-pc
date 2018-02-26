<template>
  <div class="collect">
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:60 + 'px',minWidth:600 + 'px'}">
      <!-- <div class="filter-line" >
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
      @selection-change="handleSelectionChange"
      @row-click="aaa">
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column
        label="类型"
        align="center"
        width="180"
        :render-header="renderHeader"
        >
        <template slot-scope="scope">
          <span>{{scope.row.Content.ObjectTypeDescription ? scope.row.Content.ObjectTypeDescription : '暂无'}}</span>
        </template>
      </el-table-column>
        <el-table-column label="名称">
           <template slot-scope="scope">
            <div style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
              <span style="cursor:pointer;" @click="toDetail(scope.row.ObjectId,scope.row.Content.ObjectType,scope.row.Content.Title)">
              {{scope.row.Content.Title}}
              </span>
            </div>
          </template>
        </el-table-column>
         <!-- <el-table-column label="来源" empty-text="不详">
          <template slot-scope="scope">
            <div style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
               <span>{{scope.row.Content.ExtendData.Source ? scope.row.Content.ExtendData.Source : '暂无'}}</span>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column 
        label="收藏时间" 
        width="280"
        prop="Content.ExtendData.RelationCreateTime"
        >
        </el-table-column>
      </el-table>
      <div style="margin-top:20px">
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

    aaa(row, event, column) {
       console.log(row)
    },
    /**
     * [getList 获取我的收藏列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-20
     * @return   {[type]}   [objectType：全部：0，电路标准：103，图书：104，视频：109，图片：111，章节：102，电路包：106，论文：105]
     */
    getList() {
      this.loading = true;
      this.$http.get("/Favorite/List", {
          params:{
            objectType: this.objectType,
            ps: this.pageSize,
            cp: this.page,
            fp: this.pageSize,
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
     * [deleteFn 删除]
     * @Author   赵雯欣
     * @DateTime 2017-11-21
     * @return   {[type]}   [description]
     */
    deleteFn(){
    this.$confirm('是否确定要删除该收藏吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then(() => {
      this.$http.post("/Favorite/Delete", {
          objectIds:this.multipleSelection,
          userId: this.userId
        })
        .then((res) => {
          if (res.data.Success) {
            this.multipleSelection = '';
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getList()
          }
        })
      }).catch(() => {});
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
        arr1.push(item.ObjectId)
      })
      this.multipleSelection = arr1.join(",")
    },
      /**
     * [跳转到各详情页]
     * @Author   王柳
     * @DateTime 2017-11-23
     */
    toDetail(id,type,title) {
      var path = '';
      switch (type){
        // case '知识元':
        //   path = '/KnowledgeSearchList';
        //   break;
        case 102:
          path = '/section';
          break;
        case 103:
          path = '/eStandard';
          break;
        case 105:
          path = '/paperDetail';
          break;
        case 106:
          path = '/circuitPackage';
          break;
        case 104:
          path = '/circuitPackage';
          break;
        case 109:
          path = '/circuitPackage';
          break;
        case 111:
          path = '/circuitPackage';
          break;
      }
       this.goToUrl(path,{
         query:[{
          id:id
         }],
         winType:type,
         winTitle:title,
         isIndForm:false,
       }); 
    },
  },
  watch:{
    objectType:function(val, oldVal){
      if(val!=oldVal){
        this.getList();
      }
    },
     pageSize:function(val,oldVal){
      if (val) {
        this.page= 1;
        this.getList();
      }
    },
    // multipleSelection:function(val,oldVal){
    //   if (val != '') {
    //     this.disabled = false;
    //   }
    // },
  }
}

</script>
<style lang="less">
.collect {
  text-align: left;
}

</style>
