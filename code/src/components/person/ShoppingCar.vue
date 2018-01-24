<template>
  <div class="shopping-car">
    <div :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:26 + 'px',minWidth:1200 + 'px'}">
      <el-table 
      v-loading="loading" 
      element-loading-text="数据加载中..."
      :data="orderList" 
      @selection-change="handleSelectionChange"
      >
        <el-table-column 
        type="selection" 
        width="55">
          <template >
             <img  src="../../assets/images/章节icon.png">
             <img  src="../../assets/images/章节icon.png">
          </template>
        </el-table-column>
        <el-table-column 
        label="资源名称" 
        width="350">
          <template slot-scope="scope">
            <div style="min-width:213px">
              <span class="title-span-one fl">
                <img class="title-span-img" v-if="scope.row.RelatedObject.Content.CoverUrl" :src="scope.row.RelatedObject.Content.CoverUrl">
                <img class="title-span-img" v-else src="../../assets/images/占位符.png">
              </span>
              <div style="width:60%;min-width:73px;height:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:72px">
                 {{scope.row.RelatedObject.Content.Title}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
        label="单价" 
        width="150"
        >
          <template slot-scope="scope">
            <span>
               ￥{{formatPrice(scope.row.RelatedObject.Content.CurrentPrice,2)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.RelatedObject.Content.ObjectTypeDescription ? scope.row.RelatedObject.Content.ObjectTypeDescription :'暂无'}}</span>
          </template>
        </el-table-column>
        <el-table-column 
        prop="Count" 
        label="数量" 
        align="center"
        width="106">
          <template slot-scope="scope">
            <div class="count-btns">
              <button disabled v-if="scope.row.Count==1" 
               class="button" style="background:#ddd;cursor: default;">-
              </button>
              <button class="button" v-if="scope.row.Count > 1" 
                @click="updateShoppingCar(--scope.row.Count,scope.row)">-
              </button>
              <button disabled class="count-span">{{scope.row.Count?scope.row.Count:0}}</button>
              <button class="button" disabled style="background:#ddd;cursor: default;"
               @click="updateShoppingCar(++scope.row.Count,scope.row)">+
              </button>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
        prop="Price" 
        label="实付款"
        align="center">
            <template slot-scope="scope">
               ￥{{formatPrice(scope.row.RelatedObject.Content.CurrentPrice * scope.row.Count,2)}}
            </template>
        </el-table-column>
        <el-table-column 
        label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click.native.prevent="deleteFn(scope.row.Id)"
            style="width: 100px;height: 32px;line-height:0;background-color:white;border:1px solid #d8dce5;color:#5a5e66">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
      <div class="clearfix"></div>

      <div class="shop-footer">
        <div class="shop-footer-delete fl">
          <el-button size="small" v-if="idsArr.length>0" @click="deleteFn()">删除选中</el-button>
          <el-button size="small" disabled v-if="idsArr.length==0">删除选中</el-button>
        </div>
        <div class="shop-footer-check fr">
          <span>已选资源：<span class="shop-span-count">{{payTotalCount}}</span>个</span>
          <span style="margin:0 40px 0 30px;">合计：￥<span class="shop-span-count">{{formatPrice(payTotal,2)}}</span></span>
          <el-button type="primary" @click="creatOrder">提交订单</el-button>
        </div>
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
      imgSrc:'./../../assets/images/占位符.png',

      userId:localStorage.userId,
      pageSize:10,
      currentPage:1,
      totalCount:0,
      orderList: [],
      loading:true,

      multipleObejectId: '',
      multipleType:'',
      multipleCount:'',
      multipleId:'',
      
      idsArr: [],
      payTotalCount:0,
      payTotal: 0,
      payTotalMoney:0,
      orderId:''
    }
  },
  mounted() {
    this.getList();
    window.onresize = ()=> {
       this.winWidth = this.setWindow().winWidth;
       this.winHeight = this.setWindow().winHeight;
    }
  },
  watch:{
     pageSize:function(val,oldVal){
      if (val) {
        this.currentPage = 1;
        this.getList();
      }
    },
  },
  methods: {
    //生成订单并跳转到支付页面
    creatOrder(){
      var params = {};
      params = {
        // totalMoney: this.payTotal,
        // userId: this.userId,
        // objectIds: this.multipleObejectId,
        // objectTypes:this.multipleType,
        // counts:this.multipleCount,
        shoppingCartIds:this.multipleId
      }
      if(this.multipleObejectId == ''){
         this.$message({
          type: 'warning',
          message: '您还未选中订单，请先选择!'
        });
      }else{
        this.$http.post("/Order/Create", params)
        .then((res) => {
          // console.log(res)
          if (res.data.Success == true) {
            this.orderId = res.data.Data.Id;
       
             //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
             //options详细配置见util.js;
             
             if(env == 'dev') {
               this.goToUrl('/confirmOrder',{
                 query:[{
                  orderId:this.orderId
                 }],
                 winType:'订单',
                 winTitle:'确认订单',
                 isIndForm:true,
               });
             }else if(env == 'prod'){
                SaveArgument('orderId='+this.orderId);
                OpenForm(1100,600,'/index.html#/confirmOrder','确认订单');
                this.getList();
             } 
          }else {
            this.$message.error(res.data.Description);
          }
        })
      }
    },

    /**
     * [getList 获取购物车列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-22
     * @return   {[type]}   [description]
     */
    getList() {
      this.loading = true; 
      this.$http.get("/ShoppingCart/List", {
          params: {
            cp: this.currentPage,
            ps: this.pageSize,
            userId: this.userId
          }
        })
        .then((res) => {
          if (res.data.Success) {
            this.loading = false;
            // console.log(res)
            this.orderList = res.data.Data.ItemList;
            //默认购买数量为1
            this.orderList = this.orderList.map((item)=>{
                return Object.assign({},item,{Count:1,IsDisabled:false})
            });
            // console.log(this.orderList)
            this.totalCount = res.data.Data.RecordCount;
            if(env == 'prod'){
              ChangeShoppingCartCount(res.data.Data.RecordCount);
            } 
          }else {
            this.loading = false;
            this.$message.error(res.data.Description);
          }
        })
    },
    //分页
     handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    /**
     * [updateShoppingCar 修改购物车信息]
     * @Author   赵雯欣
     * @DateTime 2017-11-22
     * @return   {[type]}   [description]
     */
    updateShoppingCar(count, obj) {
      // console.log(obj)
      // obj.IsDisabled = false;
      // this.payTotalCount = count;
      // if(this.payTotalCount >= 99){
      //    this.$message({
      //     type: 'warning',
      //     message: '选择的资源总数不能超过99个!'
      //   });
      //    this.payTotalCount = 99;
      //    obj.IsDisabled = true;
      // };
      // var payTotal = this.payTotalMoney +( +(this.formatPrice((obj.RelatedObject.Content.MarketPrice * count),2)));
      // // console.log(payTotal)
      //  this.payTotal = payTotal;
  
      // this.$http.post("/ShoppingCart/Update", {
      //     id: obj.Id, //购物车编号
      //     count: count,
      //     saleStrategyId: obj.SaleStrategyId,
      //   })
      //   .then((res) => {
      //     // console.log(res)
      //     if (res.data.Success == true) {
           
      //     }else{
      //       this.$message.error(res.data.Description);
      //     }
      //   })
    },
    /**
     * [handleSelectionChange 确定多选的ids集合]
     * @Author   赵雯欣
     * @DateTime 2017-11-20
     * @param    {[type]}   val [description]
     * @return   {[type]}       [description]
     */
    handleSelectionChange(val) {
      // console.log(val)
      this.idsArr = val;
      var arr1 = [];
      var arr2 = [];
      var arr3 = [];
      var arr4 = [];
      var payTotalCount = 0;
      var payTotal = 0;
      val.forEach((item) => {
        arr1.push(item.ObjectId);
        arr2.push(item.RelatedObject.ObjectType);
        arr3.push(item.Count);
        arr4.push(item.Id);
        payTotal += (item.Count * item.RelatedObject.Content.CurrentPrice);
        payTotalCount += item.Count;
      });
      this.payTotalCount = payTotalCount;
      if(this.payTotalCount >= 99){
         this.$message({
          type: 'warning',
          message: '选择的资源总数不能超过99个!'
        });
         this.payTotalCount = 99;
      };
      // this.payTotal += +(this.formatPrice(payTotal,2));
      this.payTotal = this.formatPrice(payTotal,2);
      this.payTotalMoney = this.payTotal;
      // console.log(this.payTotal)
      this.multipleObejectId = arr1.join(",");
      this.multipleType = arr2.join(",");
      this.multipleCount = arr3.join(",");
      this.multipleId = arr4.join(",");
    },
    /**
     * [deleteFn 删除购物车]
     * @Author   赵雯欣
     * @DateTime 2017-11-22
     * @return   {[type]}   [单个删除的id]
     */
    deleteFn(id) {
      this.$confirm('确认要删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post("/ShoppingCart/Delete", {
            ids:id?id:this.multipleId, //购物车编号
          })
          .then((res) => {
            // console.log(res)
            if (res.data.Success ==true) {
            this.multipleId=''
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList();
            }
          })
      }).catch(() => {});
    },
  }
}

</script>
<style lang='less'>


</style>
