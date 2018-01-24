<template>
  <div class="order-wrap">
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:26 + 'px',minWidth:1200 + 'px'}" v-loading.fullscreen.lock="loading">
      <div style="position: relative;margin-bottom: 20px;">
        <el-radio-group v-model="paidType">
          <el-radio-button :label="0">全部订单</el-radio-button>
          <el-radio-button :label="2">待付款</el-radio-button>
          <el-radio-button :label="1">已付款</el-radio-button>
        </el-radio-group>
        <div class="input-right">
          <el-input 
          v-model="orderId" 
          placeholder="请输入订单编号"
          @keyup.enter.native="search()">
          </el-input>
          <i class="el-icon-search close-search"  @click="search()"></i>
        </div>
      </div>

      <!-- 组件 -->
      <div v-if="paidType==0">
        <orderAll :orderList="orderList"></orderAll>
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
      <div v-if="paidType==2">
        <orderWillPay :orderList="orderList" v-on:cancleOrder="cancleOrder" v-on:setPaidType="setPaidType"></orderWillPay>
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
      <div v-if="paidType==1">
        <orderPaid :orderList="orderList"></orderPaid>
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
    </div>
  </div>
</template>
<script>
  import orderAll from "./OrderAll.vue"
  import orderWillPay from "./OrderWillPay.vue"
  import orderPaid from "./OrderPaid.vue"
export default {
  data() {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,

      
      orderId:'',
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      orderList: [],
      orderDetails:[],
      paidType:1,//支付类型 0-全部 1-已经支付 2-未支付
      loading:true,
    }
  },
  components:{
    orderAll,
    orderWillPay,
    orderPaid
  },
  mounted() {
    this.getList();
    window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    };
  },
  methods: {
    //设置setPaidType
    setPaidType(isPaid) {
      this.isPaid = isPaid;
    },
     /**
     * [getList 获取订单列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-22
     * @return   {[type]}   [description]
     */
    getList() {
      this.loading = true;
      this.$http.get("/Order/List", {
          params: {
            cp: this.currentPage,
            ps: this.pageSize,
            orderId:this.orderId,
            paidType:this.paidType,
          }
        })
        .then((res) => {
          if (res.data.Success == true) {
            this.loading = false;
            this.orderList = res.data.Data.ItemList;
            this.totalCount = res.data.Data.RecordCount;
           
            
            // if(this.paidType == 1 && this.totalCount !== 0) {
               let listIds = [];
               this.orderList.forEach((item,index)=>{
                  item.OrderDetails.forEach((citem,cindex)=>{
                      citem['hasDown'] = false;
                      citem['downLoadPercent'] = 0;
                      citem['startDownLoad'] = false;
                      listIds.push(citem.Content.Id);
                  })
               })

               

               //下面是winform下的获取当前文件是否已经下载
              if(localStorage.getItem('userId') && localStorage.getItem('userId') !== '' && env == 'prod') {
                  GetDownLoadedResources(listIds.join(','),localStorage.getItem('userId'),(hasDownLoadedContent)=>{
                      
                      hasDownLoadedContent = JSON.parse(hasDownLoadedContent);

                      
                      if(hasDownLoadedContent.length !== 0) {
                         //表明此时是已经下载过的了
                         // fileData = hasDownLoadedContent[0];
                         hasDownLoadedContent.forEach((getItem,getIndex)=>{

                             this.orderList.forEach((item,index)=>{
                                item.OrderDetails.forEach((citem,cindex)=>{
                                    if(getItem.ObjectId == citem.Content.Id) {
                                       citem['hasDown'] = true;
                                       this.$set(this.orderList[index].OrderDetails,cindex,citem);
                                   }
                                })

                             })

                         })
                      }
                  })
                }

            // }
          }else {
            this.loading = false;
            this.$message.error(res.data.Description);
          }
        })
    },

    /**
     * [cancleOrder 取消订单]
     * @Author   罗文
     * @DateTime 2017-12-21
     * @return   {[type]}   [description]
     */
    cancleOrder() {
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
     /**
     * [搜索]
     * @作者     王柳
     * @日期     2017-11-24
     */
    search(){
      if (!this.orderId) {
        this.$message.error('搜索订单编号不能为空！');
      } else {
        this.getList();
      }
    },
    
  },
  watch:{
    paidType:function(val,oldVal){
      this.loading = true;
      this.getList();
    },
    orderId:function(val,oldVal){
      if(oldVal && !val){
        this.getList(this.paidType);
      }
    },
    pageSize:function(val,oldVal){
      if (val) {
        this.currentPage = 1;
        this.getList();
      }
    },
  }
}

</script>
<style lang="less">
.order-wrap{
  .input-right{
    width: 300px;
    position: absolute;
    top:10px;
    right:0;
  }

  .el-icon-search{
    font-size: 22px;
  }
}
</style>
