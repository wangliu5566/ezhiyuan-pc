<template>
  <div @click="isHistorySearchShow = false;conMenuShow = false" class="circuit-search-list">
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:18 + 'px',minWidth:600 + 'px'}">
      <el-row style="margin-bottom:10px">
        <el-col :span="12">
          <p class="hot-p fl">找到
            <span>{{totalCount}}</span>条"
            <span>{{searchKey}}</span>"相关电子电路包
          </p>
        </el-col>
        <el-col :span="12">
          <div class="input-p fr">
             <div class="hot-input fr" @click.stop="" @contextmenu="showContextMenu($event)">
                <el-input 
                placeholder="请输入电路包名称"
                @focus="getHistorySearchList"
                v-model="newSearchKey" 
                @keyup.enter.native="search(newSearchKey)"
                >
                <el-button slot="append" icon="el-icon-search" @click="search(newSearchKey)"></el-button>
                </el-input>
                <!-- <i class="el-icon-search close-search"  @click="search(newSearchKey)"></i> -->

                <ul v-show="isHistorySearchShow" class="history-search-list">
                 <li v-for="(item,index) in historySearchList" @click="searchHistory(item.Title)">
                   {{item.Title}}
                 </li>

                 <li class="delete-history" v-show="historySearchList.length !== 0" @click="clearHistorySearch">清空历史记录 <i class="el-icon-delete"></i>
                 </li>
               </ul>
              </div>
          </div>
        </el-col>
      </el-row>
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
            <div style="width:80%;line-height:20px;margin:10px auto;padding:10px 15px;outline: 1px dashed #ddd;">
              <div  @contextmenu.prevent="" style="line-height:20px">
                {{props.row.Abstracts?'中文摘要：'+props.row.Abstracts:'中文摘要：暂无简介'}}
              </div>
              <!-- <div class="mysource" style="margin-top:10px" @click="goBookDetail(props.row.ParentId,props.row.Title)">   {{props.row.Keywords?'中文关键词：'+props.row.Keywords:'中文关键词：暂无关键词'}}
              </div> -->
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
          >
          <template slot-scope="props">
              <a href="javascript:void(0)" @click="goOtherPage('/circuitPackage',props.row.Id,props.row.Title);">
                {{props.row.Title ? props.row.Title : '暂无数据'}}
              </a>
          </template>
        </el-table-column>
        <el-table-column
          label="设计人物"
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
             <!-- <el-button @click="goOtherPage('/circuitPackage',props.row.Id,props.row.Title)"
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
             v-if="!props.row.ExtendData.IsOrdered"
             @click="addToShoppingCar(props.row)"
             >
             {{props.row.ExtendData.IsJoinedCart ? '已加入购物车':'加入购物车'}}
            </el-button>


            <el-button 
            size="small"
            type="primary"
            style="width: 100px;margin-left:14px"
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

    <contextMenu 
     :conMenuShow="conMenuShow" 
     :contextEvent="contextEvent"
     @resetContentMenuShow="resetContentMenuShow"
     >
     </contextMenu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
      historySearchList:[],
      isHistorySearchShow:false,
      expands: [],
      //table基本数据
       loading:true,
       currentPage: 1,
       totalCount: 0,
       pageSize:10,
       tableData: [],
       searchKey:this.$route.query.searchKey || GetArgument().split('=')[1],
       newSearchKey:'',
       conMenuShow:false,
      contextEvent:null,
    }
  },
  methods: {
    /**
     * [showContextMenu 右键菜单]
     * @Author   罗文
     * @DateTime 2017-12-13
     * @param    {[type]}   $event [description]
     * @return   {[type]}          [description]
     */
    showContextMenu($event) {
      this.contextEvent = $event;
      this.conMenuShow = false;
      this.$nextTick(()=>{
        this.conMenuShow = true;
      })
    },
    /**
     * [resetContentMenuShow 菜单那边回应的点击响应]
     * @Author   罗文
     * @DateTime 2017-12-13
     * @param    {[type]}   state [description]
     * @return   {[type]}         [description]
     */
    resetContentMenuShow(res) {
      this.searchKey = res;
      this.conMenuShow = false;
    }, 
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
    getDetail(item){
      this.loading = true;
      this.$http.get("/Content/Search", {
        params: {
          keyword:this.searchKey,
          objectTypes:106,
          ps: this.pageSize,
          cp: this.currentPage,
        }
      })
      .then((res) => {
        // console.log(res)
        if (res.data.Code == 200) {
          this.loading = false;
          this.tableData = res.data.Data.ItemList;
          this.totalCount =res.data.Data.RecordCount;
        }else if(res.data.Code == 21){
          this.loading = false;
          this.$message.warning('搜索关键字不能超过10个字！');
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
     search(newSearchKey){
      if (!this.newSearchKey) {
        this.$message.error('搜索关键字不能为空！');
      }else if(this.newSearchKey.length >= 20){
        this.$message.error('搜索关键字不能超过20个字！');
      } else {
        this.searchKey = newSearchKey;
        this.isHistorySearchShow = false;
        //解决自动聚焦的bug
        document.getElementsByClassName('el-input__inner')[0].blur();
        
        this.getDetail();
        //添加一条搜索历史
        this.addSearchHistory(this.searchKey);
        
        if(env == 'prod'){
          SetTabTitle('"' + this.searchKey + '"' + '相关章节搜索',GetFormId());
        };
      }
    },
     searchHistory(item){
      this.isHistorySearchShow = false;
      //解决自动聚焦的bug
        document.getElementsByClassName('el-input__inner')[0].blur();
      this.searchKey = item;
      this.newSearchKey = item;
      this.getDetail(item);
      
      if(env == 'prod'){
        SetTabTitle('"' + this.searchKey + '"' + '相关章节搜索',GetFormId());
      };
    },
    //获取知识元历史搜索记录
    getHistorySearchList() {
       //localStorage.historySearchList 的格式是  JSON.stringify(数组) 后的字符串数组
        if(!localStorage.userId) return;

        this.$http.get("/History/SearchList", {
          params: {
            ps:10,
            cp:1,
            objectType:106,
            ActionType:2,
          }
        })
        .then((res) => {
          if (res.data.Success) {
              this.isHistorySearchShow = true;
              this.historySearchList = res.data.Data.ItemList;
          }else{
             this.$message.error(res.data.Description)
          }
        })
       // let searchList = localStorage.historySearchList ? localStorage.historySearchList : '';
       // if(searchList != ''){
       //  this.isHistorySearchShow = true;
       //  let arr = searchList.split(',');
       //  let newArr = Array.from(new Set(arr));
       //  this.historySearchList = newArr;
       // }
    },
    
    /**
     * [clearHistorySearch 清空历史记录]
     * @Author   罗文
     * @DateTime 2017-11-24
     * @return   {[type]}   [description]
     */
    clearHistorySearch() {
        this.$http.post("/History/Clear", {
            objectType:106,
            actionType:2,
          })
        .then((res) => {
          if (res.data.Success) {
              this.historySearchList = [];
              this.isHistorySearchShow = false;
          }else{
             this.$message.error(res.data.Description)
          }
        })

        // localStorage.removeItem('historySearchList');
        // this.historySearchList = [];
    },
  },
  mounted(){
    this.getDetail();
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
    searchKey:function(val,oldVal){
      if (val) {
        this.currentPage = 1;
        this.getDetail();
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
.circuit-search-list{
  .el-table {
  @media screen and (max-width: 1130px) {
      .el-button:nth-child(1){
        margin-left: 14px;
      }
      .el-button:nth-child(2){
        margin-top: 4px;
      }
   }
  }
  .OA-img{
    width: 100%;
    height: 100%;
    img{
      width: 100%;
    }
  }
} 
</style>
