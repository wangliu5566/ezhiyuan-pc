<template>
  <div class="chioce-search-main" @click="isHistorySearchShow = false;conMenuShow = false">
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:28 + 'px',fontSize:14 + 'px',minWidth:600 + 'px'}">
      <el-row style="margin-bottom:10px">
        <el-col :span="12">
          <p class="hot-p fl">找到
            <span>{{totalCount}}</span>条"
            <span>{{searchKey}}</span>"相关章节
          </p>
        </el-col>
        <el-col :span="12">
          <div class="input-p fr">
            <div class="hot-input fr" @click.stop="" @contextmenu="showContextMenu($event)">
              <el-input placeholder="请输入章节名称" @focus="getHistorySearchList" v-model="newSearchKey" @keyup.enter.native="search(newSearchKey)">
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
      <el-table v-loading="loading" element-loading-text="数据加载中..." ref="sectionListTable" :data="tableData" :row-key="getRowKeys" :expand-row-keys="expands">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div style="width:80%;line-height:20px;margin:10px auto;padding:10px 15px;outline: 1px dashed #ddd;">
              <div @contextmenu.prevent="" style="line-height:20px">
                {{props.row.Abstracts?'说明：'+props.row.Abstracts:'说明：暂无说明'}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="章节名称" align="center">
          <template slot-scope="props">
            <a href="javascript:void(0)" @click="goOtherPage('/section',props.row.Id,props.row.Title);">
                {{props.row.Title ? props.row.Title : '暂无数据'}}
              </a>
          </template>
        </el-table-column>
        <el-table-column label="说明" align="center">
          <template slot-scope="props">
            <a href="javascript:void(0)" style="cursor:pointer" @click="expandRowKeys(props.row.Id,props.row)">
                 <i class="el-icon-arrow-down" :style="{transition:'all .5s',transform:'rotate('+transform(props.row)+'deg)'}">
                 </i>
              </a>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class="operate">
          <template slot-scope="props">
            <!-- <el-button 
             @click="goOtherPage('/section',props.row.Id,props.row.Title)"
             style="width: 100px;height: 34px;background-color: #1c517d;color: white;line-height:0">查看详情
            </el-button> -->
            <!-- <el-button 
                size="small"
                style="width: 100px"
                @click="goConfirmBtn('/confirmOrder',props.row)"
                v-if="!props.row.ExtendData.IsOrdered"
                >
              购买
            </el-button> -->
            <el-button size="small" style="width: 100px" v-if="props.row.ExtendData.IsOrdered ? !props.row.ExtendData.IsOrdered : !props.row.ExtendData.IsJoinedCart" @click="addToShoppingCar(props.row,true)">
              购买
            </el-button>
            <!-- <el-button 
             size="small"
             style="width: 100px"
             v-show="!props.row.ExtendData.IsJoinedCart ? true : false" 
             @click="addToShoppingCar(props.row,false)"
             >
               购买
            </el-button> -->
            <el-button size="small" type="primary" style="width: 100px" :disabled="props.row.ExtendData.IsJoinedCart ? true : false" v-show="!props.row.ExtendData.IsOrdered" @click="addToShoppingCar(props.row)">
              {{props.row.ExtendData.IsJoinedCart ? '已加入购物车':'加入购物车'}}
            </el-button>
            <el-button size="small" style="width: 100px" @click="download(props.row,props.$index)" v-if="props.row.ExtendData.IsOrdered" :type="props.row.hasDown ? 'primary':''" :disabled="(props.row.downLoadPercent == 0 && props.row.startDownLoad) || (props.row.downLoadPercent != 0 && props.row.downLoadPercent != 100)">
              {{ props.row.hasDown ? '阅 读' : (props.row.downLoadPercent == 0 && !props.row.startDownLoad? '点击下载' : props.row.downLoadPercent +'%')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;">
        <div class="page">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <contextMenu :conMenuShow="conMenuShow" :contextEvent="contextEvent" @resetContentMenuShow="resetContentMenuShow">
    </contextMenu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
      historySearchList: [],
      isHistorySearchShow: false,
      expands: [],
      //table基本数据
      loading: true,
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      tableData: [],
      searchKey: this.$route.query.searchKey || GetArgument().split('=')[1],
      newSearchKey: '',

      conMenuShow: false,
      contextEvent: null,
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
      this.$nextTick(() => {
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
    //合并列
    // arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    //   console.log({ row, column, rowIndex, columnIndex })
    //   if (rowIndex > -1 ) {
    //     if (columnIndex === 0) {
    //       return [0, 1];
    //     } 
    //     // else if (columnIndex === 1) {
    //     //   return [0, 0];
    //     // }
    //   }
    // },
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
    getDetail(serchKey) {
      this.loading = true;
      this.$http.get("/Content/Search", {
          params: {
            keyword: this.searchKey,
            objectTypes: 102,
            ps: this.pageSize,
            cp: this.currentPage,
          }
        })
        .then((res) => {
          // console.log(res)
          if (res.data.Code == 200) {
            this.loading = false;
            this.tableData = res.data.Data.ItemList;
            this.totalCount = res.data.Data.RecordCount;

            let listIds = [];

            this.tableData.forEach((item, index) => {
              item['hasDown'] = false;
              item['downLoadPercent'] = 0;
              item['startDownLoad'] = false;
              listIds.push(item.Id);
            })

            //下面是winform下的获取当前文件是否已经下载
            if (localStorage.getItem('userId') && localStorage.getItem('userId') !== '' && env == 'prod') {
              GetDownLoadedResources(listIds.join(','), localStorage.getItem('userId'), (hasDownLoadedContent) => {

                hasDownLoadedContent = JSON.parse(hasDownLoadedContent);

                console.log(hasDownLoadedContent);

                if (hasDownLoadedContent.length !== 0) {
                  //表明此时是已经下载过的了
                  // fileData = hasDownLoadedContent[0];
                  hasDownLoadedContent.forEach((getItem, getIndex) => {
                    this.tableData.forEach((bookItem, bookIndex) => {
                      if (getItem.ObjectId == bookItem.Id) {
                        bookItem['hasDown'] = true;
                        this.$set(this.tableData, bookIndex, bookItem);
                      }
                    })
                  })
                }
              })
            }
          } else if (res.data.Code == 21) {
            this.loading = false;
            this.$message.warning('搜索关键字不能超过10个字！');
          } else {
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
    search(newSearchKey) {
      if (!newSearchKey) {
        this.$message.error('搜索关键字不能为空！');
      } else if (this.newSearchKey.length >= 20) {
        this.$message.error('搜索关键字不能超过20个字！');
      } else {
        this.searchKey = newSearchKey;
        this.isHistorySearchShow = false;
        //解决自动聚焦的bug
        document.getElementsByClassName('el-input__inner')[0].blur();


        this.getDetail(newSearchKey);
        //添加一条搜索历史
        this.addSearchHistory(this.searchKey);

        if (env == 'prod') {
          SetTabTitle('"' + this.searchKey + '"' + '相关章节搜索', GetFormId());
        };
      }
    },
    searchHistory(item) {
      this.isHistorySearchShow = false;
      //解决自动聚焦的bug
      document.getElementsByClassName('el-input__inner')[0].blur();
      this.searchKey = item;
      this.newSearchKey = item;
      this.getDetail(item);

      if (env == 'prod') {
        SetTabTitle('"' + this.searchKey + '"' + '相关章节搜索', GetFormId());
      };
    },
    //获取知识元历史搜索记录
    getHistorySearchList() {
      //localStorage.historySearchList 的格式是  JSON.stringify(数组) 后的字符串数组
      if (!localStorage.userId) return;

      this.$http.get("/History/SearchList", {
          params: {
            ps: 10,
            cp: 1,
            objectType: 102,
            ActionType: 2,
          }
        })
        .then((res) => {
          if (res.data.Success) {
            this.isHistorySearchShow = true;
            this.historySearchList = res.data.Data.ItemList;
          } else {
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
          objectType: 102,
          actionType: 2,
        })
        .then((res) => {
          if (res.data.Success) {
            this.historySearchList = [];
            this.isHistorySearchShow = false;
          } else {
            this.$message.error(res.data.Description)
          }
        })

      // localStorage.removeItem('historySearchList');
      // this.historySearchList = [];
    },


    /**
     * [download 下载图书]
     * @Author   罗文
     * @DateTime 2017-12-04
     * @param    {[Object]}   item  [本条数据]
     * @param    {[Number]}   index [本条数据的索引]
     * @param    {[Number]}   objectType  [资源类型 102 ||  103  - 图书资源  108 - 图片资源  109 - 视频资源  104 - pdf]
     * @return   {[type]}         [description]
     */
    download(item, index) {
      //  CloseMenueStrip();
      // // 验证有没有用户信息和激活码
      var hasUserId = volidUserId(true);
      if (!hasUserId) return;
      item.currentPage = this.currentPage;
      //根据不同的资源类型，进行不同的操作

      if (item.hasDown) {
        console.log(item)
        this.toBookView(item);
      } else {
        //只要一点击就变为0
        item.startDownLoad = true;
        this.$set(this.tableData, index, item)
        if (env == 'dev') {
          var setTime = setInterval(() => {
            if (item.downLoadPercent >= 100) {
              item.downLoadPercent = 100;
              item.hasDown = true;
              this.$set(this.tableData, index, item);
              clearInterval(setTime);
            } else {
              item.downLoadPercent++;

              if (this.currentPage == item.currentPage)
                this.$set(this.tableData, index, item);
            }
          }, 50)
        } else if (env == 'prod') {

          var data = {
            objectId: item.Id,
            isPC: true,
            type: 1, //1 - EPUB  2 - pdf  3 - 视频  4 - 图片
            userid: localStorage.getItem('userId'),
            title: item.Title,
            objectType: item.ObjectType,
            objectTypeDescription: item.ObjectTypeDescription,
            DefaultFileExtension: item.DefaultFileExtension,
            extendData: JSON.stringify(item.ExtendData)
          }
          //下面是配合winform异步获取数据

          //多线程异步下载
          DownLoadProgress('POST', '/Content/Authorize', JSON.stringify(Object.assign({}, systemParams, data)), (progress, nativeUrl = '', err) => {
            if (err) {
              item.startDownLoad = false;
              this.$message.error(err);
              // OpenForm(480,500,'/index.html#/userCenter','个人信息');
              // localStorage.setItem('fromWhere',3);
            } else {
              item.nativeUrl = nativeUrl;

              //获取下载进度
              if (Math.floor(progress) >= 100) {
                item.downLoadPercent = 100;
                item.hasDown = true;
              } else {
                item.downLoadPercent = Math.floor(progress);
              }


              if (this.currentPage == item.currentPage)
                this.$set(this.tableData, index, item);

            }
          });

        }
      }


    },
  },
  mounted() {
    this.getDetail();
    window.onresize = () => {
      this.winWidth = this.setWindow().winWidth;
      this.winHeight = this.setWindow().winHeight;
    }
  },
  updated() {
    //用于去除首列的折叠箭头
    this.removeExpandTableFirstCol();
  },
  watch: {
    searchKey: function(val, oldVal) {
      if (val) {
        this.currentPage = 1;
        this.getDetail();
      }
    },
    pageSize: function(val, oldVal) {
      if (val) {
        this.currentPage = 1;
        this.getDetail();
      }
    },
  }
}

</script>
<style lang="less" scoped>
.chioce-search-main {
  .el-table {
    @media screen and (max-width: 1130px) {
      .el-button:nth-child(1) {
        margin-left: 14px;
      }
      .el-button:nth-child(2) {
        margin-top: 4px;
      }
    }
  }
}

</style>
