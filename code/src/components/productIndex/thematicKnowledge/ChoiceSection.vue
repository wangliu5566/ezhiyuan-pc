<template>
  <div class="choice-main" v-show="index == 102" >
    <el-row >
      <el-col :span="3" style="position: relative;">
        <div class='sidemenu'>
          <div class="side-menu-main-common">
           <!--  <ul class="side-out">
             <li class="side-out-li active" style="background:#1c517d">全部知识分类</li>
             <li v-for="(item,index) in sideMenuData" :class="index == activeIndex ?'side-out-li active':'side-out-li'" @click="getCategoryObject(item,index)" @mouseenter="displayContent(item,index)">
               <span class="side-out-span">{{item.Title}}</span>
             </li>
            </ul> -->
             <ul class="side-out choice-ul" :style="{height:winHeight - 100 + 'px'}">
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
      <!-- <div class="clearfix"></div> -->
      <el-col :span="21">
        <div class="choice-content">
          <h3 >
            精选章节<i class="el-icon-arrow-right" v-show="oneTitle"></i> {{oneTitle}} 
            <i class="el-icon-arrow-right" v-show="twoTitle"></i> 
            <span style="color:#00aeed">{{twoTitle}}</span>
          </h3>
          <ChoiceTable :twoChildId="twoChildId">
          </ChoiceTable>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChoiceTable from '@/components/productIndex/thematicKnowledge/ChoiceSectionTable'
export default {
  props:['index','objectType'],
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
    }
  },
  components:{
    ChoiceTable
  },
  methods:{
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
      console.log(citem.Id)
      this.$http.get("/Content/Search", {
          params: {
            categoryIds: this.oneChildId,
            objectTypes: 108,
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
                console.log(item)
                console.log('in')
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
     * [getList 获取列表的数据]
     * @Author   王柳
     * @DateTime 2017-11-21
     */
    getList() {
      this.$http.get("/Category/ListByGroupName", {
          params: {
            groupName:this.objectType,
          }
        })
        .then((res) => {
          // console.log(res)
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
            objectTypes: 108,
            ps:1000,
            cp:1
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
         this.twoTitle = title;
         this.oneTitle = this.setOneTitle;
       }
    },
  },
  mounted(){
    console.log(this.index)
    console.log(this.objectType)
    this.getList();
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
