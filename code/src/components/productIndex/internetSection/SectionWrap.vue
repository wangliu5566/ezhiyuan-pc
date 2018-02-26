<template>
  <div class="choice-main" @click="isHistorySearchShow = false;conMenuShow = false" :style="{width:winWidth + 'px',minWidth:700 + 'px'}" v-loading.fullscreen.lock="loading">
    <el-row >
       <el-col :span="3" style="position: relative;">
        <div class='sidemenu'>
          <div class="side-menu-main-common">
             <ul class="side-out " :style="{height:winHeight + 'px'}">
               <li v-for="(item,index) in sideMenuData" :class="index == activeIndex ?'side-out-li active':'side-out-li'" @mouseenter="displayContent(item,index)" @mouseleave="isChildListShow = false">
                  <el-tooltip class="item" effect="light" :content="item.Title" placement="top" v-if="winWidth < 1200">
                   <span class="side-out-span">{{item.Title}}</span>
                  </el-tooltip>
                  <span class="side-out-span" v-else>{{item.Title}}</span>
                  <span class="menu-placeholder" v-if="item.children && item.children.length != 0 && item.Id == oneChildId" v-show="isChildListShow"></span>
                  <ul 
                  v-if="item.children && item.children.length != 0 && item.Id == oneChildId " 
                  class="side-in" 
                  v-show="isChildListShow"
                  :style="{width: 0.15 * winWidth +'px'}"
                  id="divId">
                     <li v-for="(ele,i) in item.children" class="side-in-li" @click="getInitCategoryObject(ele.Id,ele.Title)">
                       <span class="side-in-span">{{ele.Title}}</span>
                     </li>
                  </ul>
                </li>
             </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="choice-content">
          <div class="input-content">
            <h3 class="choice-content h3 fl">专题知识
              <i class="el-icon-arrow-right" v-show="oneTitle"></i> {{oneTitle}} 
              <i class="el-icon-arrow-right" v-show="twoTitle"></i> 
              <span style="color:#00aeed">{{twoTitle}}</span>
            </h3>
            <div class="hot-input fr" @click.stop=""  @contextmenu="showContextMenu($event)">
              <el-input 
              placeholder="请输入章节名称"
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
          </div>
          <ChoiceTable v-bind:twoChildId="twoChildId"></ChoiceTable>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChoiceTable from '@/components/productIndex/internetSection/IntSectionTable'
export default {
  data () {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
      activeIndex:0,
      sideMenuData: [],
      
      childId:'',
      oneChildId:'',
      oneTitle:'',//对应第一层的标题
      setOneTitle:'',
      twoChildId:'',
      twoTitle:'',//对应第二层的标题
      isChildListShow:false,
      extendData:'',
      type:localStorage.productType,

      searchKey:'',
      historySearchList:[],
      isHistorySearchShow:false,
      conMenuShow:false,
      contextEvent:null,
      loading:false,
    }
  },
  components:{
    ChoiceTable
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
      //搜索知识元
    search(searchKey){
      if (!searchKey) {
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
         this.goToUrl('/ChoiceSearchList',{
            query:[{
            searchKey:searchKey
           }],
           winType:'资源',
           winTitle:"'"+searchKey + "'相关章节搜索",
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
            objectType:102,
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
            objectType:102,
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
      * [显示相应的子菜单]
      * @作者     王柳
      * @日期     2017-11-22
      */
    displayContent(item,index){
      this.activeIndex = index || 0;
      this.oneChildId = item.Id;
      this.setOneTitle = item.Title;
      this.isChildListShow = true;
      
      //避免重复拉去数据
      if(item.children && item.children.length !== 0 ) {
         return;
      }else{
        this.getChildList(item);
      }
    },
     /**
     * [getChildList 根据一级或二级分类获取更下层分类]
     * @Author   罗文
     * @DateTime 2017-11-29
     * @param    {[type]}   childid    [不是必填，二级分类的id]
     * @param    {[type]}   child      [不是必填，二级分类本身数据]
     * @param    {[type]}   parentItem [不是必填，一级分类本身数据]
     * @return   {[type]}              [description]
     */
    getChildList(citem){
      this.$http.get("/Content/Search", {
          params: {
            categoryIds: this.oneChildId,
            // objectTypes:this.type == '互联网+' ? 108 : '',
            objectTypes:108,
            ps:1000,
            cp:1,
          }
        })
        .then((res) => {
          console.log(res)
           if (res.data.Code == 200) {
            // this.twoChildId = res.data.Data.ItemList[0].Id;
            // this.twoTitle = res.data.Data.ItemList[0].Title;
            this.sideMenuData = this.sideMenuData.map((item) => {
              if(item.Id == citem.Id){
                 item.children = res.data.Data.ItemList;
              }
              return item;   
            });
            console.log(this.sideMenuData)
          }else{
            this.$message.error(res.data.Description);
          }
        })
    },
    /**
     * [getList 获取列表的数据]
     * @Author   王柳
     * @DateTime 2017-11-21
     */
    getList() {
      this.loading = true;
      this.$http.get("/Category/ListByGroupName", {
          params: {
            groupName:this.type == '物联网' ? this.extendData.SubjectGroupName : this.extendData.SubjectGroupName,
          }
        })
        .then((res) => {
          this.loading = false;
          if (res.data.Code == 200) {
            this.sideMenuData = res.data.Data;
            this.childId = res.data.Data[0].Id;
            this.oneTitle = res.data.Data[0].Title;
            this.getInitChildList();
          }else{
            this.$message.error(res.data.Description);
          }
        })
    },
    getInitChildList(){
      // console.log(this.oneChildId)
      this.$http.get("/Content/Search", {
          params: {
            categoryIds: this.childId,
            // objectTypes:this.type == '互联网+' ? 108 : '',
            ps:1000,
            cp:1,
            objectTypes:108
          }
        })
        .then((res) => {
           if (res.data.Code == 200) {
            console.log(res)
            this.twoChildId = res.data.Data.ItemList[0].Id;
            this.twoTitle = res.data.Data.ItemList[0].Title;
            this.sideMenuData = this.sideMenuData.map((item) => {
              if(item.Id == this.childId){
                 item.children = res.data.Data.ItemList;
              }
              return item;   
            });
          }else{
            this.$message.error(res.data.Description);
          }
        })
    },
    /**
     * [改变每个分类]
     * @作者     王柳
     * @日期     2017-11-24
     */
    getInitCategoryObject(id,title) {
       this.isChildListShow = false;

       if(id){
         this.twoChildId = id;
         this.oneTitle = this.setOneTitle;
         this.twoTitle = title;
       }
    },
  },
  mounted(){
    if(env == 'dev'){
      this.extendData = JSON.parse(this.$route.query.extendData);
    }else if(env == 'prod'){
      this.extendData = JSON.parse(GetArgument().split('=')[1]);
    };
    this.getList();
     window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    }; 
  },
  updated(){
    this.getDivHeight();
  }
}
</script>
<style lang="less">

</style>
