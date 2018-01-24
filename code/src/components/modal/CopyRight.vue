<template>
  <div class="right-main">
    <div class="right-all">
      <div class="content-one">
        <span class="content-one-span fl">版权说明：</span>
        <div class="content-one-div fl"> 
          本产品包含的专题知识内容，均来自电子工业出版社合法拥有版权和有权使用的作品。电子工业出版社在此申明：未经电子工业出版社授权，任何人不得转载、摘编或利用其它方式使用上述作品。
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="content-two">
        <h3>国内作译者<span class="content-two-span">（按姓氏笔画排序）：</span></h3>
        <ul>
          <li v-for="(item,index) in dataOne">{{item.title}}</li>
        </ul>
      </div>
      <div class="clearfix"></div>
      <div class="content-three">
        <h3>团队作译者<span class="content-three-span">：</span></h3>
        <ul>
           <li v-for="(item,index) in dataTwo">{{item.title}}</li>
        </ul>
      </div>
      <div class="clearfix"></div>
      <p class="content-one-p">国外作译者</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataOne:[{
        title:'丁震生'
      },{
        title:'余宗光'
      },{
        title:'马群刚'
      },{
        title:'王天喜'
      },{
        title:'王  丹'
      },{
        title:'王文丽'
      },{
        title:'王  玉'
      },{
        title:'王石与'
      },{
        title:'王西宁'
      },{
        title:'王  伟'
      },{
        title:'王兆红'
      },{
        title:'王  军'
      },{
        title:'王宁利'
      },{
        title:'王怀军'
      },{
        title:'丁震生'
      },{
        title:'余宗光'
      },{
        title:'马群刚'
      },{
        title:'王天喜'
      },{
        title:'王  丹'
      },{
        title:'王文丽'
      },{
        title:'王  玉'
      },{
        title:'王石与'
      },{
        title:'王西宁'
      },{
        title:'王  伟'
      },{
        title:'王兆红'
      },{
        title:'王  军'
      },{
        title:'王宁利'
      },{
        title:'王怀军'
      }],
      dataTwo:[{
        title:'国家集成电路封测产业链技术创新战略联盟'
      },{
        title:'中国电子科技集团电科院电子电路柔性制造中心'
      },{
        title:'北京电子学会表面安装技术委员会'
      },{
        title:'江苏省经济和信息化委员会'
      },{
        title:'江苏省半导体行业协会'
      }]
    }
  },
  methods:{
  	
  },
  beforeCreate() {
    //设置当前窗口
    if(env == 'prod') {
      SetWidthHeight(500,466);
    }
  },
  mounted(){
    
  },
}

</script>
<style lang="less">


</style>
