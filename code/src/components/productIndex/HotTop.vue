<template>
  <div class="hop-top" @click="isHistorySearchShow = false;conMenuShow = false" :style="{width:winWidth + 'px',minWidth:776 + 'px'}" v-loading.fullscreen.lock="loading">

    <el-row>
      <el-col :span="3" style="position: relative;">
        <div class="grid-content sidemenu">
          <div class="side-menu-main-common">
            <ul class="side-out" :style="{height:winHeight - 5 + 'px'}">
               <!-- <li class="side-out-li active">全部知识分类</li> -->
               <li v-for="(item,index) in sideMenuData" :class="index == activeIndex ?'side-out-li active':'side-out-li'" @click="displayContent(item,index)"
               @mouseenter="showContent(item,index)">
                  <el-tooltip class="item" effect="light" :content="item.Title" placement="top" v-if="winWidth < 1200">
                   <span class="side-out-span">{{item.Title}}</span>
                  </el-tooltip>
                  <span class="side-out-span" v-else>{{item.Title}}</span>
                </li>
             </ul>
          </div>
        </div>
      </el-col>
      <!-- 搜索及历史记录 -->

      <el-col :span="21">
        <div class="input-content">
           <div class="hot-input fr" @click.stop="" @contextmenu="showContextMenu($event)">
              <el-input 
              placeholder="请输入知识元名称" 
              @focus="getHistorySearchList" 
              v-model="searchKey" 
              @keyup.enter.native="search(searchKey)"
              >
              <el-button slot="append" icon="el-icon-search" @click="search(searchKey)"></el-button>
              </el-input>
              <!-- <i class="el-icon-search close-search"  @click="search(searchKey)"></i> -->

              <ul v-show="isHistorySearchShow" class="history-search-list">
                 <li v-for="(item,index) in historySearchList" @click="search(item.Title)">
                   {{item.Title}}
                 </li>

                 <li class="delete-history" v-show="historySearchList.length !== 0" @click="clearHistorySearch">清空历史记录 <i class="el-icon-delete"></i>
                 </li>
              </ul>
            </div>
            <div class="clearfix"></div>
        </div>

        <div class="hot-exp-content" :style="{height:winHeight - 100 + 'px'}">
          <ul v-if="contentData.length != 0">
             <li 
             v-for="(item,index) in contentData"
             :style="{color:contentColors[contentRandom[index % 10]],fontSize:contentRandom[index] + 14 + 'px',top: index % 2 == 0 ? '5px':'-5px'}"
             @click="toExpDetail(item)">
               {{item.Title}}
             </li>
          </ul>
          <ul v-else style="margin:0 auto;text-align: center">
             <li >暂无数据</li>
          </ul>
        </div>
      </el-col>
    </el-row>

    <contextMenu 
     :conMenuShow="conMenuShow" 
     :contextEvent="contextEvent"
     @resetContentMenuShow="resetContentMenuShow"
     >
     </contextMenu>
  </div>
</template>

<script>
import $ from 'jquery';
export default {
  data () {
    return {
      loading:false,
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
    	activeIndex:0,
      extendData:'',

      contentData:[],
      contentColors:['#ac74b5','#c7d868','#f05a66','#45b3a8','#14a6fb','#f29c51','#00aeed','#67c23a','#eb9e05','#fa5555'],
      contentRandom:[],   //每个知识元的随机参数，只能配置一次，不然每次update都会更新

      sideMenuData: [],
      searchKey:'',
      childId:'',
      minWidth:'',
      randomWidth:'',
      type:localStorage.productType,

      historySearchList:[],
      isHistorySearchShow:false,

      conMenuShow:false,
      contextEvent:null,
    }
  },
  methods:{
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
    showContent(item,index){
      
    },
    /**
      * [显示相应的子菜单]
      * @作者     王柳
      * @日期     2017-11-22
      */
    displayContent(item,index){
      this.activeIndex = index || 0;
      this.childId = item.Id;
      this.getChildList();
    },
     //获取某个子分类数据
    getChildList(){
      this.loading = true;
      this.$http.get("/ExplicitWord/Search", {
         params:{
          categoryIds:this.childId,
        }
      })
        .then((res) => {
          this.loading = false;
          if (res.data.Code == 200) {
            this.contentData = res.data.Data.ItemList;
            console.log(this.contentData)
          }else{
            
            this.$message.warning(res.data.Description);
          }
        })
    },
    /**
     * [getList 获取列表的数据]
     * @Author   王柳
     * @DateTime 2017-11-21
     */
    getList() {
      this.loading = false;
      this.$http.get("/Category/ListByGroupName", {
          params: {
            groupName:this.type == '电子电路' ? this.extendData.HotGroupName : this.type == '物联网' ? this.extendData.HotGroupName : this.extendData.LearningGroupName
            // groupName:this.type == '电子电路' || this.type == '互联网+' ? 'ElecCircuitHot' : this.extendData.HotGroupName
          }
        })
        .then((res) => {
          this.loading = false;
          if (res.data.Code == 200) {
            this.sideMenuData = res.data.Data;
            this.childId = res.data.Data[0].Id;
            this.getChildList();
          }else{
            
            this.$message.warning(res.data.Description);
          }
        })
    },
    //搜索知识元
    search(searchKey){
      if (!searchKey ) {
        this.$message.error('搜索关键字不能为空！');
      }else if(searchKey.length >= 20){
        this.$message.error('搜索关键字不能超过20个字！');
      } else {
        //添加一条搜索历史
        this.addSearchHistory(this.searchKey);

        this.isHistorySearchShow = false;
        //解决自动聚焦的bug
         document.getElementsByClassName('el-input__inner')[0].blur();

        //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
        //options详细配置见util.js;
        this.searchKey = '';
       this.goToUrl('/KnowledgeSearchList',{
         query:[{
            searchKey:searchKey
           }],
           winType:'资源',
           winTitle:"'"+searchKey + "'相关知识元搜索",
           isIndForm:false,
       });
      }
    },

    //获取知识元历史搜索记录
    getHistorySearchList() {
       //localStorage.historySearchList 的格式是  JSON.stringify(数组) 后的字符串数组
        if(!localStorage.userId) return;

        this.$http.get("/History/SearchList", {
          params: {
            ps:10,
            cp:1,
            objectType:101,
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
            objectType:101,
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

    /**
     * [toExpDetail 去知识元列表]
     * @Author   罗文
     * @DateTime 2017-11-23
     * @param    {[type]}   id [description]
     * @return   {[type]}      [description]
     */
    toExpList(searchKey) {
      this.isHistorySearchShow = false;
       //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
      //options详细配置见util.js;
       this.goToUrl('/KnowledgeSearchList',{
         query:[{
          searchKey:searchKey
         }],
         winType:'资源',
         winTitle:'知识元搜索',
         isIndForm:false,
       }); 
    },

    /**
     * [toExpDetail 去知识元详情]
     * @Author   罗文
     * @DateTime 2017-11-23
     * @param    {[type]}   id [description]
     * @return   {[type]}      [description]
     */
    toExpDetail(item) {

       //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
       //options详细配置见util.js;
       this.goToUrl('/ExplicitWordDetail',{
         query:[{
          expId:item.Id
         }],
         winType:'详情',
         winTitle:item.Title,
         isIndForm:true,
       });
    },
    
    /**
     * [获取初始化窗口大小]
     * @作者 王柳
     * @日期 2017-11-22
     */

    setWidth(){
      this.minWidth = $(window).width()-260 +'px';
      // console.log(this.minWidth)
    },
    getRandomWidth(){
      this.randomWidth = Math.floor(Math.random() * 50);
      // console.log(Math.random() * 20)
    }
  },
  mounted(){
    if(env == 'dev'){
      this.extendData = JSON.parse(this.$route.query.extendData);
    }else if(env == 'prod'){
      this.extendData = JSON.parse(GetArgument().split('=')[1]);
    };
    console.log(this.extendData);
    console.log(this.type)
    this.getList();

    //初始化窗口大小
    this.setWidth();
    //动态监测浏览器窗口变化
    $(window).resize(()=>{
      this.setWidth();
    });
    //得到随机宽度
    this.getRandomWidth();


    //每次加载生成知识元的随机数，只生成一次
    for(let i = 0 ; i < 50 ; i ++) {
      this.contentRandom.push(Math.ceil(Math.random() * 10));
    }


    window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    }
  },
  watch:{
    searchKey:function(val,oldVal){
      if (oldVal && !val) {
        this.getChildList();
      }
    }
  }
}
</script>
<style lang="less" scoped>
   /* .side-out-li:not(.active):hover  {
    outline: none;
    background: #00aeed;
    color:white
     }; */
</style>
