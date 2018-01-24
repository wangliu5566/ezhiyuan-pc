<template>
  <div>
    <div>
      <h2>{{expDetail.Title}}</h2>
      <p>
        <span>别名：</span>
        <span>参考资料：</span>
      </p>
      <p>
        简介：{{expDetail.Abstracts}}
      </p>
      <p>
        相关知识点：
        <span v-for="(item,index) in expDetail.RelatedWordList">
          {{item.Title}}
        </span>
      </p>

        <p>深度阅读：</p>

          
          <!-- 展开表格 -->
        <expand-table
           :listData="ResourceList"
        >
          
        </expand-table>

    </div>
  </div>
</template>

<script>
import ExpandTable from '@/components/common/ExpandTableForExpDetail.vue';
export default {
  data () {
    return {
      expId:12421,  //知识元id
      expDetail:{},
      ResourceList: [],
    }
  },
  components:{
    ExpandTable
  },
  methods:{
   /**
        * [getDetail 获取知识元Id]
        * @Author   罗文
        * @DateTime 2017-11-22
        * @return   {[type]}   [description]
        */
       getDetail() {
          //获取知识元详情
          this.$http.get("/ExplicitWord/Detail", {
            params: {
              id: this.expId,
            }
          })
          .then((res) => {
            console.log(res.data)
            if(res.data.Code == 200) {
                this.expDetail = res.data.Data;
            }else {
              this.$message.error(res.data.Description);
            }
          })


           //获取知识元相关资源列表
           this.$http.get("/ExplicitWordObject/ObjectList", {
            params: {
              explicitWordId: this.expId,
              ps:999
            }
          })
          .then((res) => {
            if(res.data.Code == 200) {
              let listIds = [];
                this.ResourceList = res.data.Data.ItemList;
                console.log(this.ResourceList)
                this.ResourceList.forEach((item,index)=>{
                   item['hasDown'] = false;
                   item['downLoadPercent'] = 0;
                   item['isExpand'] = false;
                   item['startDownLoad'] = false;
                  })
                this.expands = [];
            }else {
              this.$message.error(res.data.Description);
            }
          })
       },
  },
  mounted() {
    this.getDetail();
  },

}
</script>
<style scoped>

</style>
