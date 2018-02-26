<template>
  <div class="confirm-order">
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:26 + 'px',minWidth:1000 + 'px'}">
      <el-table
      v-loading="loading" 
      element-loading-text="数据加载中..."
      ref="sectionListTable"
      :data="orderList"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      :default-expand-all="true">
      <el-table-column 
      type="expand" 
      class="column-one">
        <template slot-scope="props">
          <div style="width:100%">
            <ul style="width:82%;float:left" class="order-ul">
              <li v-for="(item,index) in props.row.OrderDetails" style="height:66px;line-height:66px;padding:10px 0;border-bottom:1px solid #e6ebf5">
                <span style="display:inline-block;width:48px;margin-right:1%;margin-left:10px">
                  <img v-if="item.Content.CoverUrl" :src="item.Content.CoverUrl" alt="" style="width:100%;vertical-align: middle">
                  <img class="title-span-img" v-else src="../../assets/images/占位符.png" style="width:100%;vertical-align: middle">
                </span>
                <span style="display:inline-block;width:19%;text-align:left;text-overflow:hidden;word-wrap:nowrap">
                {{item.Content.Title ? (item.Content.Title.length>10?
             item.Content.Title.slice(0,8).concat('...'):item.Content.Title):'暂无标题'}}
                </span>
                <span style="display:inline-block;width:21%;text-align:center">
                  {{formatPrice(item.Content.CurrentPrice,2)}}
                </span>
                <span style="display:inline-block;width:26%;text-align:center">
                {{item.Content.ObjectTypeDescription}}
                </span>
                <span style="display:inline-block;width:22%;text-align:center">
                {{item.Count}}
                </span>
              </li>
            </ul>
            <div style="width:18%;float:right;text-align:center;border-left:1px solid #e6ebf5" class="order-div">
              <span>
                {{formatPrice(props.row.UndiscountTotalMoney,2)}}
              </span>
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
          label="单价（元）"
          align="center"
          >
          <template slot-scope="props">
              <div href="javascript:void(0)" style="width:100%;font-weight: bold;color:#878d99;font-size:12px">
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
        <!-- <template slot-scope="props">
            <a href="javascript:void(0)">
              {{props.row.CreateTime ? props.row.CreateTime : '暂无数据'}}
            </a>
        </template> -->
      </el-table-column>
      <el-table-column
        label="实付款（元）"
        align="center"
        >
      </el-table-column>
    </el-table>

      <div class="confirm-footer">
       <!--  <div class="confirm-price fl">
          总付款：
          <span style="color:red;font-size: 20px;">
            {{payTotal?'￥'+payTotal:'0'}}
          </span>
        </div> -->
        <div class="confirm-price fl">
          <div class="confirm-total fl">
            资源总额:
            <span>
              {{payTotal?'￥'+payTotal:'0'}}
            </span>
          </div>
           <div class="confirm-total fl">
            优惠:
            <span>
              {{Benefit?'￥'+Benefit:'0'}}
            </span>
          </div>
           <div class="confirm-total fl">
            
            <span class="confirm-num-span">
              合计:
              {{ShouldPaidMoney?'￥'+ShouldPaidMoney:'0'}}
            </span>
          </div>
        </div>
        <el-button type="info" @click="toPayMethods" class="confirm-btn fr">
          立即支付
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
export default {
  data() {
    return {
      winWidth:window.innerWidth,
      winHeight:window.innerHeight,
      orderList: [],
      orderDetails:{},
      payTotal:0,
      Benefit:0,
      ShouldPaidMoney:0,

      orderId:this.$route.query.orderId || GetArgument().split('=')[1],
      userId:localStorage.userId,

      loading:true,
      expands:[],
    }
  },
  methods:{
    //跳转到支付方式页面
    toPayMethods(){
       // if(env == 'dev') {
       //    this.$router.push({
       //      path:'/PayMethods',
       //      query:{
       //        id:this.orderId,
       //        payTotal:this.ShouldPaidMoney,
       //      }
       //    })
       // }else if(env == 'prod') {
       //    SaveArgument(this.orderId+'&'+this.ShouldPaidMoney);
       //    OpenForm(500,420,'/index.html#/PayMethods','选择支付方式');
       // }
       if(env == 'prod') SetFormTitle('选择支付方式');
       
       this.$router.push({
          path:'/PayMethods',
          query:{
            id:this.orderId,
            payTotal:this.ShouldPaidMoney,
          }
        })

    },
    
    /**
     * [获取订单详情]
     * @作者     王柳
     * @日期     2017-11-30
     */
    getOrderDetail(){
      var params = {};
      params = {
        id: this.orderId,
      }
      this.$http.get("/Order/Detail", {params})
        .then((res) => {
          console.log(res)
          if (res.data.Success == true) {
            this.loading = false;
            var payTotal = 0;
            var Benefit = 0;
            var ShouldPaidMoney = 0;
            payTotal = res.data.Data.UndiscountTotalMoney;
            // Benefit = res.data.Data.ExtendData.Benefit ? res.data.Data.ExtendData.Benefit : '0';
            // ShouldPaidMoney = res.data.Data.ExtendData.ShouldPaidMoney ? res.data.Data.ExtendData.ShouldPaidMoney : res.data.Data.TotalMoney;
             
            ShouldPaidMoney = res.data.Data.TotalMoney ? res.data.Data.TotalMoney : '0';
            Benefit = payTotal - ShouldPaidMoney;
            this.payTotal = this.formatPrice(payTotal,2);
            this.Benefit = this.formatPrice(Benefit,2);
            this.ShouldPaidMoney = this.formatPrice(ShouldPaidMoney,2);
            var orderList = [];
            orderList.push(res.data.Data);
            this.orderList = orderList;
          }else {
            this.loading = false;
            this.$message.error(res.data.Description);
          }
        })
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
      console.log(newVal, row)
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
      this.expands.push(newVal);
    },
    /**
     * [点击章节名称进行的跳转]
     * @作者     王柳
     * @日期     2017-11-21
     */
    beforeToBookView(row) {
      if (!row.hasDown) {
        this.$message({
            message: '请先下载该章节！',
            type: 'warning'
        });
      } else {
        this.toBookView(row.Id,row);
      }
    },
    
  },
  mounted() {
    this.getOrderDetail();
    window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    };
  },
  updated() {
    //用于去除首列的折叠箭头
    this.removeExpandTableFirstCol();
    this.getOrderDivHeight();
  },
}

</script>
<style lang='less'>
.confirm-order {
  .bottom{
    height: 50px;
    border:1px solid #ddd;
    margin-top: 120px;
    padding-left: 20px;
    line-height: 50px;
    font-size: 18px;
    font-weight: 700;
  }
  .order-ul{
    li:last-child{
      border-bottom: none;
    };
  }
}

</style>
