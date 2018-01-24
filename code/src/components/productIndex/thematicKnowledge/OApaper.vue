<template>
  <div class="OA-main" v-show="index == 105" >
    <div :style="{width:0.9 * wrapMinWidth + 'px',paddingLeft:0.05 * winWidth + 'px',paddingRight:0.05 * winWidth + 'px',minWidth:1100 + 'px'}">
      <el-row>
        <el-col :span="24">
          <h3 >OA论文</h3>
          <el-table
            v-loading="loading" 
            element-loading-text="数据加载中..."
            ref="sectionListTable"
            :data="tableData"
            :row-key="getRowKeys"
            :expand-row-keys="expands">
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
                <div class="OA-img" style="margin-bottom:-10px;width:90px">
                  <!-- <img :src="props.row.CoverUrl" alt=""> -->
                  <img  v-if="props.row.CoverUrl" :src="props.row.CoverUrl">
                  <img  v-else src="../../../assets/images/占位符.png">
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="论文专题"
              >
              <template slot-scope="props">
                  <a href="javascript:void(0)" @click="goOtherPage('/paperList',props.row.Id,props.row.Title)">
                    {{props.row.Title ? props.row.Title : '暂无数据'}}
                  </a>
              </template>
            </el-table-column>
            <el-table-column
              label="简介"
              align="center"
              >
              <template slot-scope="props">
                  <a href="javascript:void(0)" style="cursor:pointer" @click="expandRowKeys(props.row.Id,props.row)">
                      简介 <i class="el-icon-arrow-down" :style="{transition:'all .5s',transform:'rotate('+transform(props.row)+'deg)'}">
                     </i>
                  </a>
              </template>
            </el-table-column>
            <el-table-column
              label="ISSN号"
              >
              <template slot-scope="props">
                  <div href="javascript:void(0)">
                    {{props.row.ExtendData.Issn ? props.row.ExtendData.Issn : '暂无数据'}}
                  </div>
              </template>
            </el-table-column>
            <el-table-column
              label="CN号"
              >
              <template slot-scope="props">
                  <div href="javascript:void(0)">
                    {{props.row.ExtendData.CN ? props.row.ExtendData.CN : '暂无数据'}}
                  </div>
              </template>
            </el-table-column>
            <el-table-column
              label="出版载体"
              >
              <template slot-scope="props">
                  <div href="javascript:void(0)">
                    {{props.row.Title ? props.row.Title : '暂无数据'}}
                  </div>
              </template>
            </el-table-column>
            <el-table-column
              label="出版刊期"
              >
              <template slot-scope="props">
                  <div href="javascript:void(0)">
                    {{props.row.Title ? props.row.Title : '暂无数据'}}
                  </div>
              </template>
            </el-table-column>
            <el-table-column
              label="主管单位"
              >
              <template slot-scope="props">
                  <div href="javascript:void(0)">
                    {{props.row.ExtendData.ChargeUnit ? props.row.ExtendData.ChargeUnit : '暂无数据'}}
                  </div>
              </template>
            </el-table-column>
            <el-table-column
              label="主办单位"
              >
              <template slot-scope="props">
                  <div href="javascript:void(0)">
                    {{props.row.ExtendData.HostUnit ? props.row.ExtendData.HostUnit : '暂无数据'}}
                  </div>
              </template>
            </el-table-column>
            <el-table-column
              label="发行范围"
              >
              <template slot-scope="props">
                  <div href="javascript:void(0)">
                    {{props.row.ExtendData.Bkintroduction ? props.row.ExtendData.Bkintroduction : '暂无数据'}}
                  </div>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              >
              <template slot-scope="props">
                <el-button type="primary" size="small" style="margin-left:-5px" @click="goOtherPage('/paperList',props.row.Id,props.row.Title)">查看详情</el-button>
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
        </el-col>
      </el-row>
    </div> 
  </div>
</template>

<script>
// import OATable from '@/components/productIndex/thematicKnowledge/OApaperTable'
export default {
  props:['index'],
  data () {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
      activeName: 'second',
      expands: [],
      //table基本数据
       currentPage: 1,
       totalCount: 0,
       pageSize:10,
       tableData: [],
       loading:true,
    }
  },
  methods:{
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
      this.$http.get("/Content/Search", {
        params: {
          objectTypes:112,
          ps: this.pageSize,
          cp: this.currentPage,
        }
      })
      .then((res) => {
        if (res.data.Code == 200) {
          this.loading = false;
          // console.log(res.data)

          this.tableData = res.data.Data.ItemList;
          this.totalCount =res.data.Data.RecordCount;
        }else{
          this.loading = false;
          this.$message.warning(res.data.Description);
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
  },

  mounted() {
    this.getList();
    window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    }
  },
  updated() {
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
  },
  computed: {
    wrapMinWidth: function() {
      return {
        winWidth: this.winWidth,
      }
    }
  }
}
</script>
<style lang="less">

</style>
