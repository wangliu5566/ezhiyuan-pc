<template>
  <div class="circuit-main" v-show="index == 106">
    <el-row>
      <el-col :span="3">
        <div class='sidemenu'>
          <div class="side-menu-main-common">
            <ul class="side-out choice-ul">
              <!-- <li class="side-out-li active" style="background:#1c517d">全部知识分类</li> -->
              <li v-for="(item,index) in sideMenuData" :class="index == activeIndex ?'side-out-li active':'side-out-li'" @click="getCategoryObject(item,index)" @mouseenter="displayContent(item,index)">
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
        <div class="circuit-content">
          <h3>电路设计包</h3>
          <CircuitTable :childId="childId"></CircuitTable>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CircuitTable from '@/components/productIndex/thematicKnowledge/CircuitTable'
export default {
  props:['index','objectType'],
  data () {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
      sideMenuData: [],
      childId:'',
      activeIndex:0,
    }
  },
  components:{
    CircuitTable
  },
  methods:{
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
          console.log(res)
          if (res.data.Code == 200) {
            this.sideMenuData = res.data.Data;
            // console.log( this.sideMenuData)
            this.childId = res.data.Data[0].Id;
            // this.getCategoryObject();
          }else{
            this.$message.warning(res.data.Description);
          }
        })
    },
    displayContent(item,index){
      
    },
    /**
     * [获取每一个子分类的数据]
     * @作者     王柳
     * @日期     2017-11-24
     */
    getCategoryObject(item,index) {
      this.activeIndex = index || 0;
       if(item){
         this.childId = item.Id;

         window.scrollTo(0,0);
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
}
</script>
<style lang="less">

</style>
