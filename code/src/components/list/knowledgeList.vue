<template>
  <div >
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:18 + 'px',minWidth:600 + 'px',overflow:'outo'}">
        <el-table
        v-loading="loading" 
        element-loading-text="数据加载中..."
        ref="sectionListTable"
        :data="tableData"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        >
        <el-table-column type="expand" >
          <template slot-scope="props">
            <div style="width:80%;line-height:20px;margin:0 auto;padding:10px 15px;outline: 1px dashed #ddd;">
              <div  @contextmenu.prevent="" @click="goBookDetail(props.row.ParentId,props.row.Title)">
                {{props.row.Abstracts?'说明：'+props.row.Abstracts:'说明：暂无说明'}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="知识元名称"
          >
          <template slot-scope="props">
              <a href="javascript:void(0)" @click="toExpDetail(props.row.Id,props.row.Title)">
                {{props.row.Title ? props.row.Title : '暂无数据'}}
              </a>
          </template>
        </el-table-column>
        <el-table-column
          label="说明"
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
          label="参考资料"
          >
          <template slot-scope="props">
              <div href="javascript:void(0)">
                {{props.row.Source ? '《' + props.row.Source + '》': '暂无数据'}}
              </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          >
          <template slot-scope="props">
            <el-button @click="toExpDetail(props.row.Id,props.row.Title)"
            style="width: 100px;height: 34px;background-color: #1c517d;color: white;line-height:0">查看详情</el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
      expands: [],

      //table基本数据
      loading:true,
       currentPage: 1,
       totalCount: 0,
       pageSize:10,
       tableData: [],
       searchKey:this.$route.query.id || GetArgument().split('=')[1],
    }
  },
  methods: {
    getRowKeys(row) {
      return row.Id;
    },
    transform(row) {
      return row.isExpand ? 180 : 0;
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
        row.isExpand = false;
        this.expands.splice(this.expands.indexOf(newVal), 1);
        this.$set(this.tableData, index, row);
        return;
      }

      row.isExpand = true;
      this.$set(this.tableData, index, row);
      this.expands.push(newVal);
    },
    /**
     * [下载]
     * @作者     王柳
     * @日期     2017-11-21
     */
    download(e, sectionid, item, index) {

    },
    /**
   * [获取列表数据]
   * @作者     王柳
   * @日期     2017-11-21
   */
    getList(){
    this.loading = true;  
    this.$http.get("/ExplicitWord/Search", {
        params: {
          categoryIds: this.searchKey,
          ps:this.pageSize,
          cp:this.currentPage
        }
      })
      .then((res) => {
        // console.log(res)
        if (res.data.Code == 200) {
          this.loading = false;
          this.tableData = res.data.Data.ItemList;
          this.totalCount =res.data.Data.RecordCount;
        }else{
          this.loading = false;
          this.$message.warning(res.data.Description);
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    /**
     * [toExpDetail 去知识元详情]
     * @Author   罗文
     * @DateTime 2017-12-10
     * @return   {[type]}   [description]
     */
    toExpDetail(id,title) {
       this.goToUrl('/ExplicitWordDetail',{
         query:[{
          expId:id
         }],
         winType:'详情',
         winTitle:title,
         isIndForm:true,
       });
    }
  },
  mounted(){
    this.getList();
     window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    }
  },
  updated(){
    //用于去除首列的折叠箭头
     this.removeExpandTableFirstCol();
  },
   watch:{
    pageSize:function(val,oldVal){
      if (val) {
        this.currentPage = 1;
        this.getList();
      }
    },
  }
}
</script>
<style lang="less">
  
</style>
