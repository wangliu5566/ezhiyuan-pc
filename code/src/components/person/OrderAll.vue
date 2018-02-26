<template>
  <div class="order-all">
   <el-table
      v-loading="loading" 
      element-loading-text="数据加载中..."
      ref="sectionListTable"
      :data="orderList"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      style="width:100%"
     >
        <el-table-column 
        type="expand" 
        class="column-one"
        width="100%"
        >
          <template slot-scope="props">
            <div style="width:100%;height:100%;">
              <ul style="width:60%;float:left" class="order-ul">
                <!-- <li v-if="props.row.OrderDetails[0].Content.ObjectTypeDescription == '电路包'">
                  <span style="display:inline-block;width:48px;heigth:58px">
                    <img :src="item.Content.CoverUrl" alt="" style="width:100%;vertical-align: middle">
                     <img class="title-span-img" v-if="props.row.OrderDetails[0].Content.CoverUrl" :src="props.row.OrderDetails[0].Content.CoverUrl" style="width:100%;vertical-align: middle">
                     <img class="title-span-img" v-else src="../../assets/images/占位符.png" style="width:100%;vertical-align: middle">
                  </span>
                  <span style="display:inline-block;width:16%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
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
                <li  v-for="(item,index) in props.row.OrderDetails" style="height:66px;line-height:66px;padding:10px 0;border-bottom:1px solid #e6ebf5">
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
              <div style="width:40%;height:100%;float:left;overflow:hidden;" class="order-div">
                <div style="width:25%;" class="expands-table-cell">
                  <span>
                     ￥{{formatPrice(props.row.TotalMoney,2)}}
                  </span>
                </div>
                <div style="width:43%;" class="expands-table-cell">
                  <span style="text-align:center">
                   {{props.row.IsPaid == true ? '交易成功' : '未支付'}}
                  </span>
                </div>
                
                <ul style="width:31%;float:left;border-left:1px solid #e6ebf5;overflow:hidden;" v-if="props.row.IsPaid">
                  <!-- 已购买情况 -->
                   <li  v-for="(item,index) in props.row.OrderDetails" style="height:86px;line-height:86px;text-align:center" >
                       <el-button
                           v-if="item.ObjectType == 106"
                           size="small"
                           type="primary"
                           style="width:60%;display:inline" 
                           @click="goOtherPage('/circuitPackage',item.Content.Id,item.Content.Title)"
                           >查看详情
                        </el-button>
                        <el-button 
                         v-else
                         size="small"
                         style="width:60%;display:inline"
                         @click.stop="download(item,index,props.$index)"
                         :type="item.hasDown ? 'primary':''"
                         :disabled="(item.downLoadPercent == 0 && item.startDownLoad) || (item.downLoadPercent != 0 && item.downLoadPercent != 100)">

                            {{ item.hasDown ? '阅读' : (item.downLoadPercent == 0 && !item.startDownLoad? '点击下载' : item.downLoadPercent +'%')}}
                        </el-button>
                   </li>
                </ul>
                <!-- 未购买情况 -->
                 <div class="expands-table-cell" v-else style="width:31%;">
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
              <div href="javascript:void(0)" style="width:100%;font-weight: bold;color:#878d99;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" v-if="props.row.IsPaid == true">
                时间：{{props.row.PayTime ? props.row.PayTime : '暂无数据'}}
              </div>
              <div href="javascript:void(0)" style="width:100%;font-weight: bold;color:#878d99;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" v-else>
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
          <template slot-scope="props">
            <div  v-show="props.row.IsPaid">
              <el-button 
                v-if="!props.row.IsGenerateInvoice" 
                size="small" 
                class="open-invoice"
                @click="toFillInvioce(props.row.Id)">索要发票
              </el-button>
              <span v-else @click="toInvoiceDetail(props.row.Id)" style="cursor:pointer">已开发票</span>
            </div>
          </template>
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
      hasDownLoad:false,
      startDownLoad:false,
      downLoadPercent:0,

      multipleSelection: '',
      idsArr: [],
      
      status:0, //订单状态，0-异常订单，1-已完成，2-已取消 3-正在处理111
      auditState: 0,//审核状态，0-审核不通过，1-审核通过，2-还未审核
      invoiceIsHaved:true,

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
   //跳转到填写发票信息
    toFillInvioce(id){
    if(env == 'dev'){
      this.$router.push({
        path:'/FillInvoice',
        query:{
          id:id
        }
      });
    }else if(env == 'prod'){
      SaveArgument('id=' + id);
      OpenForm(1100,600,'/index.html#/FillInvoice','填写发票信息');
    }  
   },
   //跳转到发票详情
   toInvoiceDetail(id){
    if(env == 'dev'){
      this.$router.push({
        path:'/InvoiceDetail',
        query:{
          id:id
        }
      });
    }else if(env == 'prod'){
      SaveArgument('id=' + id);
      OpenForm(1100,600,'/index.html#/InvoiceDetail','发票详情');
    }
   },
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
    /**
     * [download 下载图书]
     * @Author   罗文
     * @DateTime 2017-12-04
     * @param    {[type]}   item [description]
     * @return   {[type]}        [description]
     */
    download(item,index,pindex) {

      //  CloseMenueStrip();
      // // 验证有没有用户信息和激活码
      // var hasUserId = volidUserId(true);
      // if(!hasUserId) return;
      
      if(item.hasDown) {
          if(item.Content.DefaultFileExtension.indexOf('pdf') !== -1) {
             this.toPdfView(item.Content);
          }else {
             this.toBookView(item.Content); 
          }
      }else {
        //只要一点击就变为0
        item.startDownLoad = true;

    
        if(env == 'dev') {
           var setTime = setInterval(()=>{
                if(item.downLoadPercent >= 100) {
                   item.downLoadPercent = 100;
                   item.hasDown = true;  
                   clearInterval(setTime);
                }else {
                   item.downLoadPercent++;
                }

                this.$set(this.orderList[pindex].OrderDetails,index,item);
            }, 50)
        }else if(env == 'prod') {

          var data = {
              objectId:item.ObjectId,
              isPC:true,
              type:1,  //1 - EPUB  2 - pdf  3 - 视频  4 - 图片
              userid:localStorage.getItem('userId'),
              title:item.Content.Title,
              objectType:item.ObjectType,
              objectTypeDescription:item.Content.ObjectTypeDescription,
              DefaultFileExtension:item.Content.DefaultFileExtension,
              extendData:JSON.stringify(item.Content.ExtendData)
          }

          //下面是配合winform异步获取数据

          //多线程异步下载
          DownLoadProgress('POST','/Content/Authorize',JSON.stringify(Object.assign({},systemParams,data)),(progress,nativeUrl='',err)=>{
            console.log(progress)
              if(err) {
                item.startDownLoad = false;
                this.$message.error(err);
                // OpenForm(480,500,'/index.html#/userCenter','个人信息');
                // localStorage.setItem('fromWhere',3);
              }else {
                item.nativeUrl = nativeUrl;
                //获取下载进度
                if (Math.floor(progress) >= 100) {
                    item.downLoadPercent = 100;
                    item.hasDown = true;
                } else {
                    item.downLoadPercent = Math.floor(progress);
                }

                this.$set(this.orderList[pindex].OrderDetails,index,item);
              }              
          });

        }
      }  
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
      // this.expands = [];
      this.expands.push(newVal);
    },
   
  }
}

</script>
<style lang='less' scoped>
.isDefault{
  width: 90px;
}
.open-invoice{
  border: 1px solid #1c517d;
  color: #1c517d;
  width:86px;
}
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
  @media screen and (max-width: 1210px) {
  .order-all{
    .column-one{
      ul{
         span:nth-child(2){
            width: 20%;
        }
        span:nth-child(3){
            width: 26%;
        }
        span:nth-child(4){
            width: 16%;
        }
        span:nth-child(5){
            width: 10%;
        }
      }
       
    } 
  }
 }
 
}

</style>
