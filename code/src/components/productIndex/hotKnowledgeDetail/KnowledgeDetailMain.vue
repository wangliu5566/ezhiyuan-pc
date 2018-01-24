<template>
  <div >
     <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="知识元详情" name="1" style="text-align:left">
       <KnowledgeDetail></KnowledgeDetail>
      </el-tab-pane>
      <el-tab-pane label="知识地图" name="2">
        <KnowledgeMap></KnowledgeMap>
      </el-tab-pane>
      <el-tab-pane label="知识束" name="3">
        <KnowledgeTree></KnowledgeTree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import KnowledgeDetail from '@/components/productIndex/hotKnowledgeDetail/KnowledgeDetail'
import KnowledgeTree from '@/components/productIndex/hotKnowledgeDetail/KnowledgeTree'
import KnowledgeMap from '@/components/productIndex/hotKnowledgeDetail/KnowledgeMap'
export default {
  data () {
    return {
      activeName: '1',
      
    }
  },
  components:{
    KnowledgeDetail,
    KnowledgeTree,
    KnowledgeMap
  },
  methods: {
     //切换tab的事件
     handleClick(tab, event) {
        console.log(tab, event)
       //一进入这个页面，就获取一二三层对应的数据
       // if(tab.index == 1) {
       //    if(this.relationLevel1Data.length == 0) {
       //      this.getListByLevel(this.expId,1);
       //    }

       //    if(this.relationLevel2Data.length == 0) {
       //      this.getListByLevel(this.expId,2);
       //    }

       //    if(this.relationLevel3Data.length == 0) {
       //      this.getListByLevel(this.expId,3);
       //    }
       // }
     },
  },
  mounted() {
    
  },
}
</script>
<style lang="less" scoped>

</style>
