<template>
  <div class="knowledge-main"
  @click="isHistorySearchShow = false;conMenuShow = false"
  :style="{width:winWidth + 'px',minWidth:800 + 'px'}" 
  v-loading.fullscreen.lock="loading"
  @mousemove.prevent="overmove"
  >
    <el-row>
      <el-col :span="3" style="position: relative;z-index:10">
        <div class="grid-content">
          <div class="side-menu-main">
            <ul class="side-out" :style="{height:winHeight + 'px'}">
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
                     <li v-for="(ele,i) in item.children" class="side-in-li" @click="getChildListAndWordList(ele.Id,ele.Title)">
                       <span class="side-in-span">{{ele.Title}}</span>
                     </li>
                  </ul>
                </li>
             </ul>
          </div>
        </div>
      </el-col>
      <!-- 搜索及历史记录 -->
      <el-col :span="21">
        <div class="input-content">
          <h3 class="knowledge-contet fl">知识导航
              <i class="el-icon-arrow-right" v-show="oneTitle"></i> {{oneTitle}} 
              <i class="el-icon-arrow-right" v-show="twoTitle"></i> 
              <span style="color:#00aeed">{{twoTitle}}</span>
          </h3>
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

            <div 
              ref="echartTree" 
              id="jsmindContainer" 
              class="echarts-content jsmind-content" 
              :style="{height:winHeight - 115 + 'px',width:winWidth - 100+ 'px',minWidth:600 + 'px',left:left +'px',top:top +'px'}"
              @click="jsmindNodeClick($event)"
              @mousedown.stop="startmove"
            ></div>
<!--              <div 
              ref="echartTree" 
              id="jsmindContainer" 
              class="echarts-content jsmind-content" 
              :style="{height:winHeight - 115 + 'px',textAlign:'center',lingHeight:winHeight + 'px'}"
              @click="jsmindNodeClick($event)"
              v-else>
              暂无数据
            </div> -->
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
import echarts from 'echarts';
import $ from 'jquery';
export default {
  data () {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
    	sideMenuData: [],
      activeIndex:0,
      childId:'',
      oneChildId:'',
      twoChildId:'',
      searchKey:'',

      oneTitle:'',//对应第一层的标题
      setOneTitle:'',
      twoTitle:'',//对应第二层的标题

      isChildListShow:false,
      historySearchList:[],
      isHistorySearchShow:false,
      extendData:'',
      type:localStorage.productType,

      loading:false,
      conMenuShow:false,
      contextEvent:null,


      left:0,
      top:0,
      moveFlag:false,
      prevLeft:0,
      prevTop: 0,

      echartData:[],
      parentData:null,
      myChart:null,
      echartOption:null,
      jsMind:null,   //用于保存思维导图对象
      jsmindInit:{
        /* 元数据，定义思维导图的名称、作者、版本等信息 */
        "meta":{
            "name":"example",
            "author":"hizzgdev@163.com",
            "version":"0.2"
        },
        /* 数据格式声明 */
        "format":"node_tree",
        /* 数据内容 */
        "data":{
          //   "id":"root","topic":"jsMind","children":[
          //     {"id":"easy","topic":"Easy","direction":"left","expanded":false,"children":[
          //         {"id":"easy1","topic":"Easy to show"},
          //         {"id":"easy2","topic":"Easy to edit"},
          //         {"id":"easy3","topic":"Easy to store"},
          //         {"id":"easy4","topic":"Easy to embed"}
          //     ]},
          //     {"id":"open","topic":"Open Source","direction":"right","expanded":true,"children":[
          //         {"id":"open1","topic":"on GitHub"},
          //         {"id":"open2","topic":"BSD License"}
          //     ]},
          //     {"id":"powerful","topic":"Powerful","direction":"right","children":[
          //         {"id":"powerful1","topic":"Base on Javascript"},
          //         {"id":"powerful2","topic":"Base on HTML5"},
          //         {"id":"powerful3","topic":"Depends on you"}
          //     ]},
          //     {"id":"other","topic":"test node","direction":"left","children":[
          //         {"id":"other1","topic":"I'm from local variable"},
          //         {"id":"other2","topic":"I can do everything"}
          //     ]}
          // ]
        }
      },
      jsmindOptions: {
         container : 'jsmindContainer',         // [必选] 容器的ID
         editable : false,       // 是否启用编辑
         theme : 'epc',           // 主题
         mode :'full',           // 显示模式
         support_html : true,    // 是否支持节点里的HTML元素
         view:{
             hmargin:50,        // 思维导图距容器外框的最小水平距离
             vmargin:20,         // 思维导图距容器外框的最小垂直距离
             line_width:2,       // 思维导图线条的粗细
             line_color:'#999'   // 思维导图线条的颜色
         },
         layout:{
             hspace:20,          // 节点之间的水平间距
             vspace:30,          // 节点之间的垂直间距
             pspace:40           // 节点收缩/展开控制器的尺寸
         },
         shortcut:{
             enable:false,        // 是否启用快捷键
         },
      },

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
         //路由跳转1，不区分dev和prod环境  goToUrl(path,[options]);
         //options详细配置见util.js;
         this.searchKey = '';
         this.goToUrl('/KnowledgeSearchList',{
           query:[{
            searchKey:searchKey
           }],
           winType:'资源',
           winTitle:"'"+searchKey + "'知识元搜索",
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
      * [显示相应的子菜单]
      * @作者     王柳
      * @日期     2017-11-22
      */
    displayContent(item,index){
       this.activeIndex = index || 0;
       this.isChildListShow = true;
      //切换分类，销毁echarts
      this.oneChildId = item.Id;
      this.setOneTitle = item.Title;
      if(item.children && item.children.length !== 0 ) {
         return;
      }else{
        this.getChildList(item);
      }
    },
     /**
      * [getChildListByCategoryId 根据二级分类id获取右侧思维导图数据]
      * @Author   罗文
      * @DateTime 2017-11-24
      * @param    {[Number]}   childId [二级分类id]
      * @return   {[type]}           [description]
      */
    // getChildListByCategoryId(item){
    //   // //如果有item，说明是点击每个小分类在拿数据，此时要验证是否已经拿过这个id的数据了
    //   //  for(let i = 0 ; i < this.echartData.length ; i ++) {
    //   //     if(!this.echartData[i].ParentId || this.echartData[i].ParentId == item.Id) {
    //   //        return;
    //   //     }
    //   //  }


    //   //获取分类下数据
    //   this.$http.get("/ExplicitWord/Search", {
    //       params: {
    //         categoryIds:item.Id
    //       }
    //     })
    //     .then((res) => {
    //       console.log(res)
    //       if (res.data.Code == 200) {
    //         //根据echats需求，重组数据
    //         if(res.data.Data.ItemList.length == 0) return;

    //         let echartData = [];
            
    //         //整合现有的echart数据，包括分类和知识元，最后一层是知识元
    //         res.data.Data.ItemList = res.data.Data.ItemList.map((citem)=>{
    //             return Object.assign({},citem,{ParentId:item.Id})
    //         })

            
    //         this.echartData = [...this.echartData,...res.data.Data.ItemList];

    //         //复制源数组
    //         echartData = this.echartData.slice(0);
            
    //         //处理成echarts需要的格式
    //         echartData = this.array2Nodes(this.dealEchartData(echartData),item);



    //         this.jsmindInit.data = echartData[0];
    //         this.jsMind.show(this.jsmindInit);
    //       }else{
    //         this.$message.warning(res.data.Description);
    //       }
    //     })
    // },
     /**
     * [getChildListAndWordList 获取第三层数据及其知识元]
     * @Author   罗文
     * @DateTime 2017-12-11
     * @return   {[type]}   [description]
     */
    getChildListAndWordList(id,title) {
      if(id){
        this.oneTitle = this.setOneTitle;
        this.twoTitle = title;
      }
       // this.loading = true;
        this.isChildListShow = false;
       this.$http.get("/Category/ChildListAndWordList", {
          params: {
            categoryId: id ? id : this.twoChildId,
            isSelf:true
          }
        })
        .then((res) => {
           this.loading = false;
          if (res.data.Code == 200) {

              //此时点击的是二级菜单，开始渲染思维导图
               //清空已有数据
              // this.echartData = [];
              this.echartData = res.data.Data;
              let echartData = [];

              
              res.data.Data.forEach((item,index)=>{
                 let data = {
                        id:item.Id,
                        parentId:item.ParentId,
                        topic:item.Title,
                        direction:index % 2 == 0 ? 'left':'right',
                        data:item,
                        children:[]
                     }
                 item.ExplicitWordList.forEach((citem,cindex)=>{
                    data.children.push({
                        id:citem.Id,
                        topic:citem.Title,
                        data:citem,
                        direction:cindex % 2 == 0 ? 'left':'right',
                    })
                 })

                 echartData.push(data);
              })


              //复制源数组
              // echartData = this.echartData.slice(0);
              
              // //处理成echarts需要的格式
              // echartData = this.array2Nodes(this.dealEchartData(echartData,0),childItem);
              echartData = this.array2Nodes(echartData);


              this.jsmindInit.data = echartData[0];
              //初始化思维导图
              if(!this.jsMind) {
                this.jsMind = new jsMind(this.jsmindOptions);
              }
              
              this.jsMind.show(this.jsmindInit);

              this.jsMind.expand_to_depth(1);
              this.jsMind.resize();
              
              //缩小两次
              if(!this.hasZoomOut) {
                this.jsMind.view.zoomOut();
                this.jsMind.view.zoomOut();
                this.hasZoomOut = true;
              }
            
          }else{
            this.$message.warning(res.data.Description);
          }
        })
    },
      /**
      * [滑动鼠标时获取某个分类数据]
      * @Author   李志明
      * @DateTime 2017-12-17
      */
    getChildList(citem){
      this.$http.get("/Category/ChildList", {
          params: {
            parentId:this.oneChildId,
          }
        })
        .then((res) => {
          console.log(res)
          if (res.data.Code == 200) {
              //此时是左侧根据一级菜单获取二级菜单
              this.sideMenuData = this.sideMenuData.map((item) => {
                if(item.Id == citem.Id){
                  item.children = res.data.Data.ItemList;
                }
                return item;   
              });
          }else{
            this.$message.warning(res.data.Description);
          }
        })
    },
    /**
     * [getList 获取列表的数据]
     * @Author   罗文
     * @DateTime 2017-11-21
     * @return   {[type]}   [description]
     */
    getList() {
      this.loading = true;
      this.$http.get("/Category/ListByGroupName", {
          params: {
            groupName:this.extendData.LearningGroupName,
          }
        })
        .then((res) => {
          this.loading = false;
          if (res.data.Code == 200) {
            // console.log(res)
            this.sideMenuData = res.data.Data;

            this.childId = this.sideMenuData[0].Id;
            this.oneTitle = this.sideMenuData[0].Title;

            this.getInitChildList();
          }else{
            this.loading = false;
            this.$message.warning(res.data.Description);
          }
        })
    },
    /**
     * [获取初始值渲染页面]
     * @Author   王柳
     * @DateTime 2017-12-17
     */
    getInitChildList(){
      this.loading = true;
      this.$http.get("/Category/ChildList", {
          params: {
            parentId:this.childId,
            type: 'learning',
            isSelf:false
          }
        })
        .then((res) => {
          this.loading = false;
          // console.log(res)
          if (res.data.Code == 200) {
              this.twoChildId = res.data.Data.ItemList[0].Id;
              this.twoTitle = res.data.Data.ItemList[0].Title;
              //此时是左侧根据一级菜单获取二级菜单
              this.sideMenuData = this.sideMenuData.map((item) => {
                if(item.Id == this.childId){
                  item.children = res.data.Data.ItemList;
                }
                return item;   
              });
              this.getChildListAndWordList();
            }else{
            this.$message.warning(res.data.Description);
          }
        })
    },

    /**
     * [dealEchartData description]
     * @Author   罗文
     * @DateTime 2017-11-22
     * @param    {[Array]}   data [服务器返回的线性数据]
     * @return   {[Array]}         [处理成echarts要的数据]
     */
    dealEchartData(data) {
      

       // return data.map((item)=>{
       //    return {
       //       topic:item.Title,
       //       id:item.Id,
       //       parentId:item.ParentId,
       //       data:item,
       //       expanded:false,
       //       direction:"left",
       //    }
       // })
       let arr = [];
       data.forEach((item,index)=>{
          arr.push({
             topic:item.Title,
             id:item.Id,
             parentId:item.ParentId,
             data:item,
             expanded:false,
             direction: index % 2 == 1 ? 'left' :'right',
          })
       })

       return arr;
    },
    
    /**
     * [jsmindNodeClick description]
     * @Author   罗文
     * @DateTime 2017-12-01
     * @param    {[type]}   $event [事件对象]
     * @return   {[type]}          [description]
     */
    jsmindNodeClick(e) {
      //此时已经渲染了思维导图
      if(e.target.nodeName != 'DIV') {
         if(this.jsMind.get_selected_node()) {
            let nodesInfo = this.jsMind.get_selected_node();
            console.log(nodesInfo)
            //如果是根节点，就算了，别搞事情了
            // if(nodesInfo.isroot) return;
            if(nodesInfo.isroot){

            };
            //如果这个节点是分类节点，也就是第一层的，就看看是否已经拿过数据了
            if(nodesInfo.children && nodesInfo.children.length !== 0){
              return
            }else {
              //如果是分类节点，但是没拿过数据，就该去拿数据了
              let expId = this.jsMind.get_selected_node().id;
              if(nodesInfo.data.data.Level) {
                 this.getChildListByCategoryId(nodesInfo.data.data);
              }else {
                //如果是知识元节点，就该去看详情了
                 
                //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
                //options详细配置见util.js;
                 this.goToUrl('/ExplicitWordDetail',{
                   query:[{
                    expId:expId
                   }],
                   winType:'详情',
                   winTitle:nodesInfo.data.data.Title,
                   isIndForm:true,
                 });
              }
            }
         }
      }
    },



    startmove(e) {
      this.moveFlag = true;
      
      var jsmindContainer = document.getElementById('jsmindContainer');
      this.prevLeft = e.pageX - jsmindContainer.offsetLeft;
      this.prevTop = e.pageY - jsmindContainer.offsetTop + 30;


    },
    overmove(e) {
      if(this.moveFlag) {
          this.left = e.pageX - this.prevLeft;
          this.top = e.pageY - this.prevTop;
      }
    },
    endmove(e) {
      this.moveFlag = false;
    },


    
    /**
     * [array2Nodes 将线性数据转为层级数据]
     * @Author   罗文
     * @DateTime 2017-11-22
     * @param    {[type]}   nodesArray [description]
     * @return   {[type]}              [description]
     */
    array2Nodes(nodesArray,item) {
          var i, l,  
              key = "id",  
              parentKey = "parentId",  
              childKey = "children";  
          if (!key || key == "" || !nodesArray) return [];  
        
          if (nodesArray instanceof Array) {  
              var r = [];  
              var tmpMap = {};  
              for (i = 0, l = nodesArray.length; i < l; i++) {  
                  tmpMap[nodesArray[i][key]] = nodesArray[i];  
              }

              // console.log(Object.keys(tmpMap));

              for (i = 0 ; i < nodesArray.length; i++) {  
                  if (tmpMap[nodesArray[i][parentKey]] && nodesArray[i][key] != nodesArray[i][parentKey]) {  
                      if (!tmpMap[nodesArray[i][parentKey]][childKey])  
                          tmpMap[nodesArray[i][parentKey]][childKey] = [];  
                      tmpMap[nodesArray[i][parentKey]][childKey].push(nodesArray[i]);  
                  } else {  
                      r.push(nodesArray[i]);  
                  }  
              }  
              return r;  
          } else {  
              return [nodesArray];  
          }  
      },
  },

  mounted() {
    if(env == 'dev'){
      this.extendData = JSON.parse(this.$route.query.extendData);
    }else if(env == 'prod'){
      this.extendData = JSON.parse(GetArgument().split('=')[1]);
    };
    this.getList();


    let _this = this;
    document.addEventListener('mouseup', function(e) {
      _this.endmove(e);
    }, false)


    window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    }
  },
  updated(){
    this.getDivHeight();
  }
}
</script>
<style lang="less">
   
</style>
