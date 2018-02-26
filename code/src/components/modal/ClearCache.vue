<template>
  <div class="cache-main">
    <div class="cache-all">
      <div class="cache-title">
        <div class="title-progress fl">
          <el-progress type="circle" :percentage="percentage"></el-progress>
        </div>
        <div class="title-div fl"> 
          共<span class="title-span">{{totalCache}}M</span>缓存
        </div>
      </div>
      <!-- <div class="clearfix"></div>
      <div class="cache-content">
         <el-checkbox-group v-model="checkList" @change="selectChange">
          <el-checkbox :label="1">图书文件：
            <span style="color:red">{{formatPrice(cache.Epub,2)}}</span> M
          </el-checkbox>
          <el-checkbox :label="2">PDF文档：
            <span style="color:red">{{formatPrice(cache.PDF,2)}}</span> M
          </el-checkbox>
        </el-checkbox-group>
      </div> -->
      <div class="clearfix"></div>
      <div class="content-button fr">
          <el-button @click="cancleClear">取消</el-button>
          <el-button @click="clearCache(selectType)">清除</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cache:{},
      checkList:[],
      percentage:0,
      isDisabled:true,
      selectType:'',
      totalCache:0
    }
  },
  methods:{
    selectChange(){
      if(this.checkList.length == 1){
        this.isDisabled = false;
        if(this.checkList[0] == 1){
          this.selectType = 1;
        }else if(this.checkList[0] == 2){
          this.selectType = 2;
        }
      }else if(this.checkList.length == 2){
        this.isDisabled = false;
        this.selectType = 0;
      }else{
        this.isDisabled = true;
      }
      // console.log(this.checkList)
    },
    /**
     * [getCache 获取缓存信息]
     * @Author   罗文
     * @DateTime 2017-12-10
     * @return   {[type]}   [description]
     */
  	getCache() {
      if(env == 'dev') {
        this.cache = JSON.parse('{"PDF":"114.704","Epub":"441.454","FreeSpace":"444.36","TotalSpace":"528.64","OccupiedSpace":"84.28"}');
        var totalCache = parseFloat(this.cache.OccupiedSpace) + parseFloat(this.cache.FreeSpace);
        this.totalCache = this.formatPrice(totalCache,2);
        var percentage = Math.ceil(this.cache.OccupiedSpace/this.cache.TotalSpace * 100);
        var timer = setInterval(() => {
           if(this.percentage >= percentage){
              this.percentage = percentage;
              clearInterval(timer);
           }else{
              this.percentage ++;
           }
        },50)
       
      }else {
        this.cache = JSON.parse(GetFileSize());
        var totalCache = parseFloat(this.cache.OccupiedSpace);
        this.totalCache = this.formatPrice(totalCache,2);
        var percentage = Math.ceil(this.cache.OccupiedSpace/this.cache.TotalSpace * 100);
        var timer = setInterval(() => {
           if(this.percentage >= percentage){
              this.percentage = percentage;
              clearInterval(timer);
           }else{
              this.percentage ++;
           }
        },50)
      }
    },

    /**
     * [clearCache 清除缓存]
     * @Author   罗文
     * @DateTime 2017-12-10
     * @return   {[type]}   [description]
     */
    clearCache(type) {
      console.log(type)
       ClearCache(type,(res)=>{
         if(res) {
           this.$message.success('清除完成！');
           this.getCache();
         }else {
           this.$message.error('清除失败！');
         }
       })
    },

    /**
     * [cancleClear 取消清除]
     * @Author   罗文
     * @DateTime 2017-12-10
     * @return   {[type]}   [description]
     */
    cancleClear() {
      CloseForm();
    }
  },
  beforeCreate() {
    //设置当前窗口
    if(env == 'prod') {
      SetWidthHeight(500,410);
    }
  },
  mounted(){
    this.getCache();
  },

}

</script>
<style lang="less">


</style>
