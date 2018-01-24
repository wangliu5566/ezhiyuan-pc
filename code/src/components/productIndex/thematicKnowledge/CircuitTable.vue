<template>
    <div>
        <el-table
        v-loading="loading" 
        element-loading-text="数据加载中..."
        ref="sectionListTable"
        :data="tableData"
        style="width: 96%;margin:0 20px 40px;"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        class="circuit-table">
        <el-table-column type="expand" >
          <template slot-scope="props">
            <div style="width:80%;line-height:20px;margin:10px auto;padding:10px 15px;outline: 1px dashed #ddd;">
              <div  @contextmenu.prevent="" style="line-height:20px">
                {{props.row.Abstracts?'设计任务：'+props.row.Abstracts:'设计任务：暂无设计任务'}}
              </div>
            </div>
          </template>
        </el-table-column>
         <el-table-column
          label="封面"
          >
          <template slot-scope="props">
              <div class="OA-img" style="margin-bottom:-10px;width:100px">
                <img :src="props.row.CoverUrl" alt="">
              </div>
          </template>
        </el-table-column>
        <el-table-column
          label="电路包设计名称"
          width="150"
          >
          <template slot-scope="props">
              <a href="javascript:void(0)" @click="beforeToBookView(props.row);">
                {{props.row.Title ? props.row.Title : '暂无数据'}}
              </a>
          </template>
        </el-table-column>
        <el-table-column
          label="设计任务"
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
          label="操作"
          align="center"
          >
          <template slot-scope="props">
            <!-- <el-button 
                size="small"
                style="width: 100px"
                @click="goConfirmBtn('/confirmOrder',props.row)"
                v-if="!props.row.ExtendData.IsOrdered"
                >
              购买
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
            type="primary"
            style="width: 100px;"
            v-if="props.row.ExtendData.IsOrdered"
            @click="goOtherPage('/circuitPackage',props.row.Id,props.row.Title)">  查看详情
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
  props:['childId'],
  data () {
    return {
      activeName: 'second',
      expands: [],

      pageSize:10,
      currentPage:1,
      totalCount:0,
      tableData:[],
      loading:true,
      
    }
  },
  methods: {
      /**
     * [获取每个分类的数据]
     * @作者     王柳
     * @日期     2017-12-07
     */
    getDetail(){
      this.loading = true;
      this.$http.get("/Content/Search", {
          params: {
            categoryIds: this.childId,
            objectTypes: 106,
            ps:this.pageSize,
            cp:this.currentPage
          }
        })
        .then((res) => {
          if (res.data.Code == 200) {
            this.loading = false;
            // console.log(11)
            // console.log(res.data)
            this.tableData = res.data.Data.ItemList;
            this.totalCount = res.data.Data.RecordCount;
          }else{
            this.loading = false;
            this.$message.warning(res.data.Description);
          }
        })
    },
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
    /**
     * [点击章节名称进行的跳转]
     * @作者     王柳
     * @日期     2017-11-21
     */
      beforeToBookView(row) {
        //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
        //options详细配置见util.js;
         this.goToUrl('/circuitPackage',{
           query:[{
              id:row.Id,
            }],
           winType:'详情',
           winTitle:row.Title,
           isIndForm:true,
         });
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

  },
  mounted(){
    this.getDetail();
  },
  watch:{
    childId:function(val,oldVal){
      this.currentPage = 1;
      this.getDetail();
    },
    pageSize:function(val,oldVal){
      if (val) {
        this.currentPage = 1;
        this.getDetail();
      }
    },
  },
  updated() {
    //用于去除首列的折叠箭头
    this.removeExpandTableFirstCol();
     
  },
}
</script>
<style lang="less" scoped>
  @media screen and (max-width: 1130px) {
      .el-button:nth-child(1){
        margin-left: 14px;
      }
      .el-button:nth-child(2){
        margin-top: 4px;
      }
   }
   @media screen and (max-width: 736px) {
      .el-button:nth-child(1){
        margin-left: 14px;
      }
      .el-button:nth-child(2){
        margin: 4px 0 0 12px;
      }
   }
</style>
