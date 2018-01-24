<template>
  <div class="thematic-main" @click="isHistorySearchShow = false;conMenuShow = false" :style="{width:wrapMinWidth + 'px',minWidth:700 + 'px'}">
		<div class="thematic-container">
			<div class="thematic-header" >
				<ul class="thematic-select fl">
					<li v-for="(item,cindex) in title" @click="selectChange(item.index,cindex,item.objectType)">
            <span :class="item.isActive ? 'active' : ''">{{item.navInfo}}</span>
          </li>
				</ul>

        <div class="thematic-input">
           <div class="hot-input fr" @click.stop="" @contextmenu="showContextMenu($event)">
              <el-input 
              :placeholder="'请输入'+renderInputPlace()+'名称'"
              @focus="getHistorySearchList(index)" 
              v-model="searchKey" 
              @keyup.enter.native="search(searchKey)"
              >
              <el-button slot="append" icon="el-icon-search" @click="search(searchKey)"></el-button>
              </el-input>
              
             <!--  <i class="el-icon-search close-search"  @click="search(searchKey)"></i> -->

              <ul v-show="isHistorySearchShow" class="history-search-list">
                 <li v-for="(item,cindex) in historySearchList" @click="search(item.Title)">
                   {{item.Title}}
                 </li>

                 <li class="delete-history" v-show="historySearchList.length !== 0" @click="clearHistorySearch(index)">清空历史记录 <i class="el-icon-delete"></i>
                 </li>
              </ul>
            </div>
            <div class="clearfix"></div>
        </div>
      </div>  
			<div class="clearfix"></div>
			<div class="thematic-content">
				<ChoiceSection :index = 'index' :objectType="objectType"></ChoiceSection>
        <div class="clearfix"></div>
				<ElectronicStandard :index = 'index' :objectType="objectType"></ElectronicStandard>
        <div class="clearfix"></div>
				<OApaper :index = 'index' :objectType="objectType"></OApaper>
        <div class="clearfix"></div>
				<CircuitDesign :index = 'index' :objectType="objectType"></CircuitDesign>
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
import ChoiceSection from '@/components/productIndex/thematicKnowledge/ChoiceSection';
import ElectronicStandard from '@/components/productIndex/thematicKnowledge/ElectronicStandard';
import OApaper from '@/components/productIndex/thematicKnowledge/OApaper';
import CircuitDesign from '@/components/productIndex/thematicKnowledge/CircuitDesign';

import $ from 'jquery';
export default {
  data() {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
      extendData:'',
    	title: [{
        navInfo: '精选章节',
        isActive: true,
        index:102,
        objectType:'ElecCircuitSubject',
      }, {
        navInfo: '电子标准',
        isActive: false,
        index:103,
        objectType:'ElecCircuitStandard'
      }, {
        navInfo: 'OA论文',
        isActive: false,
        index:105,
        objectType:'ElecCircuitTraining'
      }, {
        navInfo: '电路设计包',
        isActive: false,
        index:106,
        objectType:'ElecCircuitPackage'
      }],
      index:102,
      objectType:'ElecCircuitSubject',

      searchKey:'',

      historySearchList:[],
      isHistorySearchShow:false,
      conMenuShow:false,
      contextEvent:null,
    }
  },
  components:{
  	ChoiceSection,
  	ElectronicStandard,
  	OApaper,
  	CircuitDesign,
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
    renderInputPlace() {
       let arr = ['精选章节','电子标准','OA论文','电路设计包'];
       let index = [102,103,105,106];

       return arr[index.indexOf(this.index)];
    },
    /**
     * [搜索]
     * @作者     王柳
     * @日期     2017-11-24
     */
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


        let path = '';
        let winTitle = '';
        if(this.index == 102){
          path = '/ChoiceSearchList';
          winTitle = '相关章节搜索';
        }else if(this.index == 103){
          path = '/ElectronicSearchList';
          winTitle = '相关标准搜索';
        }else if(this.index == 105){
          path = '/OAsearchList';
          winTitle = '相关论文搜索';
        }else if(this.index == 106){
          path = '/CircuitSearchList';
          winTitle = '相关电路包搜索';
        }

        //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
        //options详细配置见util.js;
        this.searchKey = '';
         this.goToUrl(path,{
           query:[{
            searchKey:searchKey
           }],
           winType:'资源',
           winTitle:"'"+searchKey + "'" + winTitle,
           isIndForm:false,
         });
      }
    },



    //获取知识元历史搜索记录
    getHistorySearchList(index) {
        
       //localStorage.historySearchList 的格式是  JSON.stringify(数组) 后的字符串数组
        if(!localStorage.userId) return;

        this.$http.get("/History/SearchList", {
          params: {
            ps:10,
            cp:1,
            objectType:index ,
            ActionType:2,
          }
        })
        .then((res) => {
          if (res.data.Success) {
            console.log('in')
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
    clearHistorySearch(type) {
        this.$http.post("/History/Clear", {
            objectType:type,
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
  	 * [选择知识类型]
  	 * @作者     王柳
  	 * @日期     2017-11-21
  	 */
  	selectChange(index,clickIndex,type){
  		this.index = index;
      this.objectType = type;
      // this.$set(this.objectType,type);
      // console.log(this.objectType)
      //改变导航栏颜色
      this.title.forEach((item,cindex)=>{
         item.isActive = false;
         if(cindex == clickIndex) {
           console.log(item)
           item.isActive = true;
         }

         this.$set(this.title,cindex,item);
       })
  	},
    
  },
  mounted(){
   
    if(env == 'dev'){
      this.extendData = JSON.parse(this.$route.query.extendData);
    }else if(env == 'prod'){
      this.extendData = JSON.parse(GetArgument().split('=')[1]);
    };
  	 window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    }
  },
  // updated(){
  //   if(env == 'dev'){
  //     this.extendData = JSON.parse(this.$route.query.extendData);
  //   }else if(env == 'prod'){
  //     this.extendData = JSON.parse(GetArgument().split('=')[1]);
  //   };
  // },
  watch:{
    'index':function(nv) {
       this.searchKey = '';
     }
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
<style lang="less" scoped>



</style>
