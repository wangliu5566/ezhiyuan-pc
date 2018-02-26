<template>
  <div class="order-all">
   <el-table
      v-loading="loading" 
      element-loading-text="数据加载中..."
      ref="sectionListTable"
      :data="orderList"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      style="width:100%">
        <el-table-column 
        type="expand" 
        class="column-one"
        width="100%"
        >
          <template slot-scope="props">
            <div style="width:100%;height:100%;">
              <ul style="width:60%;float:left" class="order-ul">
               <!-- <li v-if="props.row.OrderDetails[0].Content.ObjectTypeDescription == '电路包'" style="padding:10px 0;border-bottom:1px solid #e6ebf5">
                  <span style="display:inline-block;width:48px;heigth:58px">
                    <img :src="item.Content.CoverUrl" alt="" style="width:100%;vertical-align: middle">
                     <img class="title-span-img" v-if="props.row.OrderDetails[0].Content.CoverUrl" :src="props.row.OrderDetails[0].Content.CoverUrl" style="width:100%;vertical-align: middle">
                     <img class="title-span-img" v-else src="../../assets/images/占位符.png" style="width:100%;vertical-align: middle">
                  </span>
                  <span style="display:inline-block;width:16%;overflow:hidden;text-overflow:hidden;word-wrap:nowrap">
                  {{props.row.OrderDetails[0].Content.Title.length >6 ? props.row.OrderDetails[0].Content.Title.slice(0,4).concat('...') : props.row.OrderDetails[0].Content.Title}}
                  </span>
                  <span style="display:inline-block;width:28%;text-align:center">
                   ￥{{formatPrice(props.row.OrderDetails[0].Content.MarketPrice,2)}}
                  </span>
                  <span style="display:inline-block;width:20%;text-align:center">
                  {{props.row.OrderDetails[0].Content.ObjectTypeDescription}}
                  </span>
                  <span style="display:inline-block;width:22%;text-align:center">
                  {{props.row.OrderDetails[0].Count ? props.row.OrderDetails[0].Count :'0'}}
                  </span>
                </li> -->
                <li v-for="(item,index) in props.row.OrderDetails" style="height:66px;line-height:66px;padding:10px 0;border-bottom:1px solid #e6ebf5">
                  <span style="display:inline-block;width:48px;margin-left:10px">
                    <!-- <img :src="item.Content.CoverUrl" alt="" style="width:100%;vertical-align: middle"> -->
                     <img class="title-span-img" v-if="item.Content.CoverUrl" :src="item.Content.CoverUrl" style="width:100%;vertical-align: middle">
                     <img class="title-span-img" v-else src="../../assets/images/占位符.png" style="width:100%;vertical-align: middle">
                  </span>
                  <span style="display:inline-block;width:16%;text-align:left;text-overflow:hidden;word-wrap:nowrap">
                   {{item.Content.Title.length >6 ? item.Content.Title.slice(0,4).concat('...') : item.Content.Title}}
                  </span>
                  <span style="display:inline-block;width:28%;text-align:center">
                   ￥{{formatPrice(item.Content.CurrentPrice,2)}}
                  </span>
                  <span style="display:inline-block;width:20%;text-align:center">
                  {{item.Content.ObjectTypeDescription}}
                  </span>
                  <span style="display:inline-block;width:22%;text-align:center">
                  {{item.Count ? item.Count :'0'}}
                  </span>
                </li>
              </ul>
              <div style="width:40%;height:100%;float:left" class="order-div">
                <div style="width:25%;" class="expands-table-cell">
                  <span>
                    ￥{{formatPrice(props.row.TotalMoney,2)}}
                  </span>
                </div>
                <div style="width:44%;" class="expands-table-cell">
                  <span style="text-align:center">
                   {{props.row.IsPaid == true ? '交易成功' : '未支付'}}
                  </span>
                </div>
                <div class="expands-table-cell" style="width:31%;">
                  <!-- <div > -->
                    <el-button
                       size="small"
                       type="primary"
                       style="width:45%;min-width:77px;display:inline" @click="immediatePay(props.row.Id,props.row.TotalMoney)">立即支付
                    </el-button>
                    <el-button
                       size="small"
                       type="primary"
                       style="width:45%;min-width:77px;display:inline;background: white;color:#666;border:none"@click="cancelOrder(props.row.Id)">取消订单
                    </el-button>
                  <!-- </div> -->
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="资源名称"
          >
          <template slot-scope="props">
              <div style="width:100%;font-weight: bold;color:#878d99;font-size:12px">
               订单编号：{{props.row.ExternalId ? props.row.ExternalId : '暂无数据'}}
              </div>
          </template>
        </el-table-column>
        <el-table-column
          label="单价"
          align="center"
          >
          <template slot-scope="props">
              <div href="javascript:void(0)" style="width:100%;font-weight: bold;color:#878d99;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                时间：{{props.row.CreateTime ? props.row.CreateTime : '暂无数据'}}
              </div>
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          align="center"
          >
          <template slot-scope="props">
            <a href="javascript:void(0)" style="cursor:pointer" @click="expandRowKeys(props.row.Id,props.row)">
               {{props.row.isExpand?'收起':'展开'}}
               <i class="el-icon-arrow-down" :style="{transition:'all .5s',transform:'rotate('+transform(props.row)+'deg)'}">
               </i>
            </a>
          </template>
        </el-table-column>
         <el-table-column
          label="数量"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="实付款"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="交易状态"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          >
        </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props:['orderList'],
  data() {
    return {
      loading:false,
      userId:localStorage.userId,
      timer:'',

      multipleSelection: '',
      idsArr: [],
      
      status:0, //订单状态，0-异常订单，1-已完成，2-已取消 3-正在处理
      auditState: 0,//审核状态，0-审核不通过，1-审核通过，2-还未审核

      expands:[],
    }
  },
  beforeCreate(){
    
  },
  mounted() {

  },
  updated() {
    //用于去除首列的折叠箭头
    this.removeExpandTableFirstCol();
  },
  methods: {

    //立即支付
    immediatePay(id,ShouldPaidMoney){
      if(env == 'dev') {
          this.$router.push({
            path:'/PayMethods',
            query:{
              id:id,
              payTotal:this.formatPrice(ShouldPaidMoney,2),
            }
          })
       }else if(env == 'prod') {
          //利用localStorage来监听是否支付成功
          localStorage.setItem('isOrderPaied',false);
          this.timer = setInterval(()=>{
            if(localStorage.isOrderPaied == 'true'){
                localStorage.removeItem('isOrderPaied');
                location.reload();
                this.$emit('cancleOrder','刷新');
              }
            },200);
          
          SaveArgument(id+'&'+this.formatPrice(ShouldPaidMoney,2));
          OpenForm(1100,600,'/index.html#/PayMethods','选择支付方式'); 
       }
    },
    //取消订单
    cancelOrder(id){
      this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post("/Order/Delete", {
            id:id, //订单编号
          })
          .then((res) => {
            console.log(res)
            if (res.data.Success ==true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });

              this.$emit('cancleOrder','刷新');
              // location.reload();
            }
          })
      }).catch(() => {});
    },

    getRowKeys(row) {
      return row.Id;
    },
    transform(row) {
      return row.isExpand ? 180 : 0;
    },
    /**
     * [设置展开项]
     * @作者     王柳
     * @日期     2017-11-21
     */
    expandRowKeys(newVal, row) {
      var index = 0;
      this.orderList.forEach((item, index1) => {
        if (item.Id == newVal) {
            index = index1;
        }
      });

      if (this.expands.indexOf(newVal) != -1) {
        row.isExpand = false;
        this.expands.splice(this.expands.indexOf(newVal), 1);
        this.$set(this.orderList, index, row);
        return;
      }
      row.isExpand = true;
      this.$set(this.orderList, index, row);
      // row.isExpand = false;
      // this.expands = [];
      this.expands.push(newVal);
    },
   
  }
}

</script>
<style lang='less' scoped>
.btns{
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
.el-table__expanded-cell{
  height: 100%;
}
.expands-table-cell{
  display: flex;
  align-items: center;
  justify-content: center;
  height:100%;
  float:left;
  /* overflow:hidden; */
  border-left:1px solid #e6ebf5
}
.order-all {
  @media screen and (max-width: 1560px) {
    .btns{
      text-align: center;

    }
    .el-button:nth-child(1){
      margin-left: 18px;
    }
    .el-button:nth-child(2){
      margin-top: 4px;
    }
 }
}

</style>
