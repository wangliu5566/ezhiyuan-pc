<template>
  <div class="electronic-main" v-show="index == 103">
    <el-row>
      <el-col :span="3" style="position: relative;">
        <div class='sidemenu'>
          <div class="side-menu-main-common">
            <ul class="side-out choice-ul" :style="{height:winHeight + 'px'}">
               <!-- <li v-for="(item,index) in sideMenuData" :class="index == activeIndex ?'side-out-li active':'side-out-li'" @mouseenter="displayContent(item,index)" @mouseleave="isChildListShow = false">
                  <span class="side-out-span">{{item.Title}}</span>
                  <span class="menu-placeholder" v-if="item.children && item.children.length != 0 && item.Id == oneChildId" v-show="isChildListShow"></span>
                  <ul 
                  v-if="item.children && item.children.length != 0 && item.Id == oneChildId " 
                  class="side-in" 
                  v-show="isChildListShow"
                  :style="{width: 0.15 * winWidth +'px',height:winHeight + 'px'}"
                  id="divElec">
                     <li v-for="(ele,i) in item.children" class="side-in-li" @click="getInitCategoryObject(ele.Id,ele.Title)">
                       <span class="side-in-span">{{ele.Title}}</span>
                     </li>
                  </ul>
                </li> -->
                <li v-for="(item,index) in sideMenuData" :class="index == activeIndex ?'side-out-li active':'side-out-li'" @click="getInitCategoryObject(item,index)">
                  <el-tooltip class="item" effect="light" :content="item.Title" placement="top" v-if="winWidth < 1200">
                   <span class="side-out-span">{{item.Title}}</span>
                  </el-tooltip>
                  <span class="side-out-span" v-else>{{item.Title}}</span>
                </li>
             </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="electronic-content">
          <!-- <h3>电子标准</h3> -->
          <h3 >
            电子标准
            <i class="el-icon-arrow-right" v-show="oneTitle"></i><span>{{oneTitle}}</span>
            <!-- <i class="el-icon-arrow-right" v-show="twoTitle"></i> <span>{{twoTitle}}</span> -->
          </h3>
          <ElectronicTable :oneChildId="oneChildId"></ElectronicTable>
        </div> 
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ElectronicTable from '@/components/productIndex/thematicKnowledge/ElectronicTable'
export default {
  props:['index','objectType'],
  data () {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
      sideMenuData: [],
      sideMenuDataAll:[],
      activeIndex:0,

      searchKey:'',
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
    ElectronicTable
  },
  methods:{
    /**
      * [显示相应的子菜单]
      * @作者     王柳
      * @日期     2017-11-22
      */
    // displayContent(item,index){
    //   this.activeIndex = index || 0;
    //   this.oneChildId = item.Id;
    //   this.setOneTitle = item.Title;
    //   this.isChildListShow = true;
      
    //   //避免重复拉去数据
    //   if(item.children && item.children.length != 0){
    //     return;
    //   } 
    //   this.getChildList();
    // },
     /**
     * [getChildList 根据一级或二级分类获取更下层分类]
     * @Author   罗文
     * @DateTime 2017-11-29
     * @param    {[type]}   childid    [不是必填，二级分类的id]
     * @param    {[type]}   child      [不是必填，二级分类本身数据]
     * @param    {[type]}   parentItem [不是必填，一级分类本身数据]
     * @return   {[type]}              [description]
     */
    // getChildList(){
    //   this.$http.get("/Category/ChildList", {
    //       params: {
    //         parentId:this.oneChildId,
    //         type: 'standard',
    //         isSelf:false
    //       }
    //     })
    //     .then((res) => {
    //       if (res.data.Code == 200) {
    //         this.sideMenuData = this.sideMenuData.map((item) => {
    //           if(item.Id == this.oneChildId){
    //              item.children = res.data.Data.ItemList;
    //           }
    //           return item;   
    //         });
    //       }else{
    //         this.$message.warning(res.data.Description);
    //       }
    //     })
    // },
    
    /**
     * [getList 获取列表的数据]
     * @Author   王柳
     * @DateTime 2017-11-21
     */
    getList() {
      this.$http.get("/Category/ListByGroupName", {
          params: {
            groupName: this.objectType,
          }
        })
        .then((res) => {
          if (res.data.Code == 200) {
            // console.log(res)
            this.childId = res.data.Data[6].Id;
            this.getInitChildList();
          }else{
            this.$message.warning(res.data.Description);
          }
        })
    },

    getInitChildList(){
      this.$http.get("/Category/ChildList", {
          params: {
            parentId:this.childId,
            type: 'standard',
            isSelf:false
          }
        })
        .then((res) => {
          if (res.data.Code == 200) {
            this.sideMenuData = res.data.Data.ItemList;
            this.oneChildId = res.data.Data.ItemList[0].Id;
            this.oneTitle = res.data.Data.ItemList[0].Title;
            // this.getAignInitChildList();
            // this.$nextTick(() => {
            //   this.getDivHeight();
            // })
          }else{
            this.$message.warning(res.data.Description);
          }
        })
    },
    // getAignInitChildList(){
    //   this.$http.get("/Content/Search", {
    //       params: {
    //         categoryIds: this.oneChildId,
    //         objectTypes: 103,
    //       }
    //     })
    //     .then((res) => {
    //       if (res.data.Code == 200) {
    //          this.sideMenuData = this.sideMenuData.map((item) => {
    //           if(item.Id == this.oneChildId){
    //              item.children = res.data.Data.ItemList;
    //           }
    //           return item;   
    //         });
    //         this.twoChildId = res.data.Data.ItemList[0].Id;
    //         this.twoTitle = res.data.Data.ItemList[0].Title;
    //         this.$nextTick(() => {
    //           this.getDivHeight();
    //         })
    //       }else{
    //         this.$message.warning(res.data.Description);
    //       }
    //     })
    // },
   
     /**
     * [改变每个分类]
     * @作者     王柳
     * @日期     2017-11-24
     */
    getInitCategoryObject(item,index) {
       this.activeIndex = index || 0;

       if(item){
         this.oneChildId = item.Id;
         this.oneTitle = item.Title;
         // this.oneTitle = this.setOneTitle;
       }
    },
  },
  mounted(){
    this.getList();
    this.getSliderDivHeight();
    
  },
  watch:{
    'objectType':function(nv) {
        this.getList();
    }
  },
 updated(){
    this.getDivHeight();
  }
}
</script>
<style lang="less" >

</style>
