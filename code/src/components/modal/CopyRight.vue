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
      <div class="content-four">
        <h3>国外作译者<span class="content-four-span">：</span></h3>
        <ul>
           <li v-for="(item,index) in dataThree">{{item.title}}</li>
        </ul>
      </div>
      <!-- <p class="content-one-p">国外作译者</p> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataOne:[{
        title:'丁镇生'
      },{
        title:'于宗光'
      },{
        title:'马群刚'
      },{
        title:'王天曦'
      },{
        title:'王  丹'
      },{
        title:'王文利'
      },{
        title:'王  玉'
      },{
        title:'王世堉'
      },{
        title:'王西宁'
      },{
        title:'王  伟'
      },{
        title:'王兆宏'
      },{
        title:'王  军'
      },{
        title:'王伶俐'
      },{
        title:'王怀军'
      },{
        title:'王  昊'
      },{
        title:'王  忠'
      },{
        title:'王  茹'
      },{
        title:'王洪艳'
      },{
        title:'王洪博'
      },{
        title:'王  统'
      },{
        title:'王夏莲'
      },{
        title:'王瑞庭'
      },{
        title:'王  毅'
      },{
        title:'王豫明'
      },{
        title:'牛甲顿'
      },{
        title:'毛忠宇'
      },{
        title:'文继国'
      },{
        title:'尹飞飞'
      },{
        title:'龙续明'
      },{
        title:'卢  俊'
      },{
        title:'卢益锋'
      },{
        title:'由鲜举'
      },{
        title:'史建卫'
      },{
        title:'付红志'
      },{
        title:'代翔宇'
      },{
        title:'冯新宇'
      },{
        title:'巩海洪'
      },{
        title:'朱文立'
      },{
        title:'朱贻伟'
      },{
        title:'刘元安'
      },{
        title:'刘  哲'
      },{
        title:'刘晓辉'
      },{
        title:'刘  臻'
      },{
        title:'闫焉服'
      },{
        title:'孙长杰'
      },{
        title:'孙余凯'
      },{
        title:'孙洪文'
      },{
        title:'孙晓伟'
      },{
        title:'孙  倩'
      },{
        title:'孙  海'
      },{
        title:'孙  磊'
      },{
        title:'李少平'
      },{
        title:'李  忆'
      },{
        title:'李  冰'
      },{
        title:'李  宏'
      },{
        title:'李  劲'
      },{
        title:'李  炜'
      },{
        title:'李  洁'
      },{
        title:'李桂宏'
      },{
        title:'李晓麟'
      },{
        title:'杨  力'
      },{
        title:'杨士勇'
      },{
        title:'杨立吾'
      },{
        title:'杨丽琼'
      },{
        title:'杨  林'
      },{
        title:'杨明辉'
      },{
        title:'杨举岷'
      },{
        title:'杨  萌'
      },{
        title:'杨  梁'
      },{
        title:'来  萍'
      },{
        title:'吴冬梅'
      },{
        title:'吴永乐'
      },{
        title:'吴  亮'
      },{
        title:'邱华盛'
      },{
        title:'邱碧秀'
      },{
        title:'何小琦'
      },{
        title:'绉雅冰'
      },{
        title:'汪修慈'
      },{
        title:'沈卓身'
      },{
        title:'张广威'
      },{
        title:'张文典'
      },{
        title:'张玉兴'
      },{
        title:'张伟伟'
      },{
        title:'张启华'
      },{
        title:'张  健'
      },{
        title:'张海程'
      },{
        title:'张  铮'
      },{
        title:'张  鸿'
      },{
        title:'张嘉琛'
      },{
        title:'张增照'
      },{
        title:'张弘达'
      },{
        title:'陈亚孚'
      },{
        title:'陈  宇'
      },{
        title:'陈珍海'
      },{
        title:'陈  晖'
      },{
        title:'陈铖颖'
      },{
        title:'陈  燕'
      },{
        title:'邵志标'
      },{
        title:'范  军'
      },{
        title:'范宝峡'
      },{
        title:'尚开明'
      },{
        title:'易幼文'
      },{
        title:'罗  昕'
      },{
        title:'罗道军'
      },{
        title:'周  杨'
      },{
        title:'周学功'
      },{
        title:'周润景'
      },{
        title:'周德俭'
      },{
        title:'郑  睿'
      },{
        title:'项琦明'
      },{
        title:'胡  宁'
      },{
        title:'胡湘洪'
      },{
        title:'钟宏基'
      },{
        title:'段书选'
      },{
        title:'侯  阳'
      },{
        title:'施明哲'
      },{
        title:'姜培安'
      },{
        title:'宣大荣'
      },{
        title:'贺光辉'
      },{
        title:'统雷雷'
      },{
        title:'秦石强'
      },{
        title:'袁正红'
      },{
        title:'聂国健'
      },{
        title:'贾松良'
      },{
        title:'贾忠中'
      },{
        title:'顾建忠'
      },{
        title:'顾霭云'
      },{
        title:'恩云飞'
      },{
        title:'钱省三'
      },{
        title:'徐  民'
      },{
        title:'高  军'
      },{
        title:'郭永辉'
      },{
        title:'郭远东'
      },{
        title:'唐天同'
      },{
        title:'黄进永'
      },{
        title:'黄祥彬'
      },{
        title:'曹白杨'
      },{
        title:'章晓文'
      },{
        title:'梁  峰'
      },{
        title:'寇晓静'
      },{
        title:'鲁永宝'
      },{
        title:'曾  波'
      },{
        title:'曾  峰'
      },{
        title:'温粤军'
      },{
        title:'谢少锋'
      },{
        title:'谢世健'
      },{
        title:'雷绍充'
      },{
        title:'简维廷'
      },{
        title:'蔡  坚'
      },{
        title:'廖燕平'
      },{
        title:'樊融融'
      },{
        title:'暴  杰'
      },{
        title:'潘计划'
      },{
        title:'潘华强'
      },{
        title:'潘  勇'
      },{
        title:'戴  澜'
      },{
        title:'魏  琰'
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
      }],
      dataThree:[{
        title:'（美）布朗（Brown，R.）'
      },{
        title:'（美）布朗（Brown，R.）'
      },{
        title:'（美）安瑞（Andry，P.）'
      },{
        title:'（加）贝兹（Betz，V.）'
      },{
        title:'（加）马夸特（Marquardt，A.）'
      },{
        title:'（加）罗斯（Rose，J.）'
      },{
        title:'（美）Charles A.Harper'
      },{
        title:'（美）Steven H.Voldman'
      },{
        title:'（美）罗德（Rohde，U.L.）'
      },{
        title:'（美）Hal Greenhouse'
      },{
        title:'（美）萨尔曼（Salman，E.）'
      },{
        title:'（美）郭位 '
      },{
        title:'（美）弗里德曼（Friedman，E.G.）'
      },{
        title:'（德）鲁道夫（Rudolph，M.）'
      },{
        title:'Sonia Ben Dhia'
      },{
        title:'Mohamed Ramdani'
      },{
        title:'Etienne Sicard'
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
