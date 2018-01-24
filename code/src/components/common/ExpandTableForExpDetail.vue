<template>
  <div >
    <el-table
      v-loading="loading" 
      element-loading-text="数据加载中..."
      ref="expListTable"
      :data="ResourceList"
      style="margin:0 0 40px;"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      >
      <el-table-column type="expand">
        <template slot-scope="props">
            <div style="width:80%;line-height:20px;margin:10px auto;padding:10px 15px;outline: 1px dashed #ddd;">
               <div  @contextmenu.prevent="" style="line-height:20px">
                 {{props.row.Content.Abstracts ? '简介：' + props.row.Content.Abstracts:'简介：暂无'}}
               </div>
               <div class="mysource" style="margin-top:10px" @click="goBookDetail(props.row.Content.ParentId,props.row.Content.Title)">
               {{props.row.Content.ExtendData.Source ? '来源：《 ' + props.row.Content.ExtendData.Source + " 》":'来源：暂无'}}
               </div>
            </div>
        </template>
      </el-table-column>
      <el-table-column
        label="内容标题"
        >
        <template slot-scope="props">
          <div style="width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
             <a href="javascript:void(0)" @click="beforeToBookView(props.row.Content);">
            <!-- 因为资源类型大概有13种，所以每种资源数据的字段不一样，需要根据ObjectType去映射获取 -->
            {{props.row ? props.row.Content.Title:'暂未获取到内容标题'}}
            </a>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="类型"
        align="center"

        :render-header="renderHeader"
        >

<!--                 :filters="filterData"
        :filter-method="filterTag"
        :filter-change="filterChange(filterData)"
        filter-placement="bottom-end"
        :filter-multiple="false" -->
        <template slot-scope="props">
            {{props.row ? props.row.Content.ObjectTypeDescription:'暂未获取到类型数据'}}
        </template>
      </el-table-column>

      <el-table-column
        label="内容说明"
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
        label="状 态"
        align="center"
        >
        <template slot-scope="props">
         <!--  <el-button 
          size="small" 
          :data-bookData="JSON.stringify(props.row.Content)" 
          :type="props.row.hasDown?'primary':''" 
          style="padding: 8px 15px;width:80px;margin-right:38px"
          :disabled="props.row.startDownLoad && props.row.downLoadPercent !== 100 ?true:false" 
          @click.stop="download($event,props.row.Content.Id,props.row.Content,props.$index)">

          查看详情
         </el-button> -->
         <!--  {{props.row.hasDown?'阅 读': (props.row.downLoadPercent == 0 && !props.row.startDownLoad ? '点击下载': props.row.downLoadPercent + '%')}} -->

            <!-- <el-button 
                size="small"
                style="width: 100px"
                @click="goConfirmBtn('/confirmOrder',props.row.Content)"
                v-if="!props.row.Content.ExtendData.IsOrdered"
                >
              购买
            </el-button> -->
            <el-button 
                size="small"
                style="width: 100px"
                v-show="!props.row.Content.ExtendData.IsJoinedCart ? true : false" 
                @click="addToShoppingCar(props.row.Content,true)"
                v-if="!props.row.Content.ExtendData.IsOrdered"
                >
              购买
            </el-button>
            <el-button 
             size="small"
             type="primary"
             style="width: 100px"
             :disabled="props.row.Content.ExtendData.IsJoinedCart ? true : false" 
             v-if="!props.row.Content.ExtendData.IsOrdered"
             @click="addToShoppingCar(props.row.Content)"
             >
             {{props.row.Content.ExtendData.IsJoinedCart ? '已加入购物车':'加入购物车'}}
            </el-button>

            <el-button 
             size="small"
             style="width: 100px;margin-left:12px"
             @click="download(props.row,props.$index,props.row.Content.DefaultFileExtension)" 
             v-if="props.row.Content.ExtendData.IsOrdered && (props.row.Content.ObjectType == 102 || props.row.Content.ObjectType == 103 || props.row.Content.ObjectType == 105)"
             :type="props.row.hasDown ? 'primary':''"
             :disabled="(props.row.downLoadPercent == 0 && props.row.startDownLoad) || (props.row.downLoadPercent != 0 && props.row.downLoadPercent != 100)">

              {{ props.row.hasDown ? '阅 读' : (props.row.downLoadPercent == 0 && !props.row.startDownLoad? '点击下载' : props.row.downLoadPercent +'%')}}

            </el-button>
            
            <el-button 
            size="small"
            type="primary"
            style="width: 100px;margin-left:14px"
            v-if="props.row.Content.ExtendData.IsOrdered && props.row.Content.ObjectType !== 102 && props.row.Content.ObjectType !== 103 && props.row.Content.ObjectType !== 105 &&  props.row.Content.ObjectType !== 106 "
            @click="goOtherPage('/section',props.row.Content.Id,props.row.Content.Title)">  查看详情
            </el-button>

             <el-button 
            size="small"
            type="primary"
            style="width: 100px;margin-left:14px"
            v-if="props.row.Content.ExtendData.IsOrdered && props.row.Content.ObjectType == 106 "
            @click="goOtherPage('/circuitPackage',props.row.Content.Id,props.row.Content.Title)">  查看详情
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
  props:['expId'],
  data () {
    return {
      ResourceList:[],
      pageSize:10,
      currentPage:1,
      totalCount:0,
      loading:true,

      //筛选类型
      filterData:[{
        text:'章节',
        value:'102'
      },{
        text:'图书',
        value:'104'
      },{
        text:'标准',
        value:'103'
      },{
        text:'论文',
        value:'105'
      }],
      activeName: 'second',
      expands: [],
      isFileter:false,
      objectType:''
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
                      this.objectType = command;
                      // this.getResourceData();
                      this.getDetail();
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
                ]
              ),
           ],''),
        ]);
    },
     /**
      * [获取知识元相关资源列]
      * @Author   王柳
      * @DateTime 2017-12-17
      */
     getDetail(){
      console.log('in')
      this.loading = true;
      this.$http.get("/Search", {
          params: {
            sourceObjectId: this.expId,
            ps: this.pageSize,
            cp: this.currentPage,
            objectTypes:this.objectType
          }
        })
        .then((res) => {
          if (res.data.Code == 200) {
            console.log(res)
            this.loading = false;
            let listIds = [];
            this.ResourceList = [];
            this.ResourceList = res.data.Data.ItemList;
            this.totalCount = res.data.Data.RecordCount;
            // console.log(this.ResourceList)

            this.ResourceList.forEach((item, index) => {
              item['hasDown'] = false;
              item['downLoadPercent'] = 0;
              item['isExpand'] = false;
              item['startDownLoad'] = false;
              listIds.push(item.Content.Id);
            })
            

            //下面是winform下的获取当前文件是否已经下载
            if(localStorage.getItem('userId') && localStorage.getItem('userId') !== '' && env == 'prod') {
                GetDownLoadedResources(listIds.join(','),localStorage.getItem('userId'),(hasDownLoadedContent)=>{
                    
                    hasDownLoadedContent = JSON.parse(hasDownLoadedContent);

                    console.log(hasDownLoadedContent);
                    
                    if(hasDownLoadedContent.length !== 0) {
                       //表明此时是已经下载过的了
                       // fileData = hasDownLoadedContent[0];
                       hasDownLoadedContent.forEach((getItem,getIndex)=>{
                         this.ResourceList.forEach((bookItem,bookIndex)=>{
                             if(getItem.ObjectId == bookItem.Content.Id) {
                                 bookItem['hasDown'] = true;
                                 this.$set(this.ResourceList,bookIndex,bookItem);
                             }
                         })
                       })
                    }
                })
              }



            this.expands = [];
          } else {
            this.loading = false;
            this.$message.error(res.data.Description);
          }

        })
    },
    //分页
     handleSizeChange(val) {
      this.pageSize = val;
      this.getDetail();
    },
    handleCurrentChange(val) {
      console.log(222)
      this.currentPage = val;
      this.getDetail();
    },

  	getRowKeys(row) {
	        return row.Id;
	  },
	  transform(row) {
        return row.isExpand ? 180 : 0;
      },
	  //点击章节名称进行的跳转
    beforeToBookView(row) {
      // 这里主要区分章节、标准、期刊、电路包、未知类型跳往章节详情
      let path = '/section';
      switch (row.ObjectType) {
        case 106:
          path = '/circuitPackage';
          break;
        case 102:
          // 章节
          break;
        case 103:
          // 标准
          path = '/eStandard';
          break;
        case 105:
          // 论文
          path = '/paperDetail';
          break;      
        default:

          break;
      }

      //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
      //options详细配置见util.js;
       this.goToUrl(path,{
         query:[{
            id:row.Id,
          }],
         winType:'详情',
         winTitle:row.Title,
         isIndForm:true,
       });
    },
     
     /**
      * [goBookDetail 跳转到资源详情界面]
      * @Author   罗文
      * @DateTime 2017-11-24
      * @param    {[Number]}   id    [资源id]
      * @param    {[String]}   title [资源标题]
      * @return   {[type]}         [description]
      */
     goBookDetail(id,title){  //链接到图书洗详情
        // if(env == 'dev') {
        //    this.$router.push({path:"/bookDetail",query:{bookId:id}})
        // }else if(env == 'prod') {
        //    SaveArgument('bookId='+id);
        //    loadForm('/index.html#/bookDetail','详情',title,true)
        // }
      },

      //设置展开项
      expandRowKeys(newVal, row) {
        var index = 0;
        //匹配
        this.ResourceList.forEach((item, index1) => {
            if (item.Id == newVal) {
                index = index1;
            }
        })

        if (this.expands.indexOf(newVal) != -1) {
            row.isExpand = false;
            this.expands.splice(this.expands.indexOf(newVal), 1);
            this.$set(this.ResourceList, index, row);
            return;
        }

        row.isExpand = true;
        this.$set(this.ResourceList, index, row);
        this.expands.push(newVal);
      },

      
      /**
       * [toDetail 跳转到各自的详情]
       * @Author   罗文
       * @DateTime 2017-12-10
       * @param    {[type]}   item [description]
       * @return   {[type]}        [description]
       */
      toDetail(item) {
        //如果是查看详情，则跳转到相应的列表
        let path = '';

        switch (item.ObjectType) {
          case 102:
            path = '/section';
            break;
          case 103:
            path = '/eStandard';
            break;
          case 105:
            path = '/paper';
            break;
          case 106:
            path = '/circuitPackage';
            break;      
          default:
            // statements_def
            break;
        }

        //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
        //options详细配置见util.js;
       this.goToUrl(path,{
         query:[{
            id:item.Id,
          }],
         winType:'详情',
         winTitle:item.Title,
         isIndForm:true,
       });
      },


     /**
     * [download 下载图书]
     * @Author   罗文
     * @DateTime 2017-12-04
     * @param    {[Object]}   item  [本条数据]
     * @param    {[Number]}   index [本条数据的索引]
     * @param    {[String]}   extension  [文件后缀]
     * @return   {[type]}         [description]
     */
    download(item,index,extension) {
       //  CloseMenueStrip();
      // // 验证有没有用户信息和激活码
      // var hasUserId = volidUserId(true);
      // if(!hasUserId) return;
       item.currentPage = this.currentPage;
       //根据不同的资源类型，进行不同的操作

      if(item.hasDown) {
        if(extension == '.pdf') {
          this.toPdfView(item.Content);
        }else {
          this.toBookView(item.Content); 
        }
      }else {
        //只要一点击就变为0
        item.startDownLoad = true;
        this.$set(this.ResourceList,index,item)
        if(env == 'dev') {
           var setTime = setInterval(()=>{
                if(item.downLoadPercent >= 100) {
                   item.downLoadPercent = 100;
                   item.hasDown = true;  
                   this.$set(this.ResourceList,index,item);
                   clearInterval(setTime);
                }else {
                   item.downLoadPercent++;

                   this.ResourceList.forEach((citem,cindex)=>{
                       if(citem.Content.Id == item.Content.Id) {
                          this.$set(this.ResourceList,cindex,item);
                       }
                    })
                }
            }, 50)
        }else if(env == 'prod') {

          var data = {
              objectId:item.Content.Id,
              isPC:true,
              type:extension == '.pdf'? 2 : 1,  //1 - EPUB  2 - pdf  3 - 视频  4 - 图片
              userid:localStorage.getItem('userId'),
              title:item.Content.Title,
              objectType:item.Content.ObjectType,
              objectTypeDescription:item.Content.ObjectTypeDescription,
              DefaultFileExtension:item.Content.DefaultFileExtension,
              extendData:JSON.stringify(item.Content.ExtendData)
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

                
                this.ResourceList.forEach((citem,cindex)=>{
                   if(citem.Content.Id == item.Content.Id) {
                      this.$set(this.ResourceList,cindex,item);
                   }
                })
              }              
          });

        }
      
      }
    },

	},
  mounted(){
    this.getDetail();
  },
  updated() {
     //用于去除首列的折叠箭头
    this.removeExpandTableFirstCol();
  },
  watch:{
    pageSize:function(val,oldVal){
      if (val) {
        this.currentPage = 1;
        this.getDetail();
      }
    },

    expId:function(nv) {
       this.getDetail();
    }
  }

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
/* @media screen and (max-width: 600px) {
  .el-button:nth-child(1){
    margin-left: 15px;
  }
  .el-button:nth-child(2){
    margin-top: 4px;
  }
} */
  .noTableData {
      display:flex;
      justify-content: center;
      align-items: center;
      height:100px;
      width:100%;
  }
</style>
