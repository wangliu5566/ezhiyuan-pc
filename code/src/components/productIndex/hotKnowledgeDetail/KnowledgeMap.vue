<template>
  <div>
    <el-radio-group v-model="ralationLevel">
      <el-radio-button label="1">一级</el-radio-button>
      <el-radio-button label="2">二级</el-radio-button>
      <el-radio-button label="3">三级</el-radio-button>
    </el-radio-group>
    <div ref="echartTree" class="echarts-content"  style="height:800px"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  data () {
    return {
       //echarts相关
      echartOption:null,
      echartDraggable:true,
      myChart:null,
      echartTitle:'',
      ralationLevel:1,

      //用来存放知识地图各层级数据
      relationLevel1Data:[],
      firstNodesIds:[],
      relationLevel2Data:[],
      secondNodesIds:[],
      relationLevel3Data:[],
    }
  },

  methods:{
    /**
        * [setOptions 设置echarts数据]
        * @Author   罗文
        * @DateTime 2017-11-21
        * @param    {[type]}   data [description]
        */
       setOptions(data,links,draggable) {
          let _this = this;
          this.echartOption = {
          title: {
            text: _this.echartTitle,
            x: 'center'
          },
          tooltip: {
            show : true,   //默认显示
            showContent:true, //是否显示提示框浮层
            trigger:'item',//触发类型，默认数据项触发
            triggerOn:'mousemove',//提示触发条件，mousemove鼠标移至触发，还有click点击触发
            confine:false,//是否将 tooltip 框限制在图表的区域内。
            transitionDuration:0.4,//提示框浮层的移动动画过渡时间，
          },
          series : [ 
            {
              type : 'graph', //关系图
              name : "知识元", //系列名称
              layout : 'force', //图的布局，类型为力导图，'circular' 采用环形布局，
              legendHoverLink : true,//是否启用图例 hover(悬停) 时的联动高亮。
              hoverAnimation : true,//是否开启鼠标悬停节点的显示动画
              force : { //力引导图基本配置
                  repulsion : 100,//节点之间的斥力因子。
                  gravity : 0,//节点受到的向中心的引力因子。该值越大节点越往中心点靠拢
                  edgeLength :100,//边的两个节点之间的距离，
                  layoutAnimation : true
              //因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死  
              },
              roam : true,//是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
              draggable : draggable,//节点是否可拖拽，只在使用力引导布局的时候有用。
              focusNodeAdjacency : false,//是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
              edgeSymbol: [ 'arrow'],
              edgeSymbolSize : 10,//边两端的标记大小，可以是一个数组分别指定两端，也可以是单个统一指定。
                symbolSize:60,

              itemStyle : {//图形样式
                  normal : { //默认样式
                      label : {
                          show : true
                      },
                      borderType : 'solid', //图形描边类型，默认为实线， 
                      borderWidth : 2, //图形的描边线宽。为 0 时无描边。
                      opacity : 1,
                      color:'#00ff00'
                  }
              },
              lineStyle : { //==========关系边的公用线条样式。
                  normal : {
                      width : '1',
                      type : 'solid', //线的类型 
                      curveness : 0, //线条的曲线程度，从0到1
                      opacity : 1
                  }
              },
              label : { //=============图形上的文本标签
                  normal : {
                      show : true,//是否显示标签。
                      position : 'inside',//标签的位置。['50%', '50%'] [x,y]
                      textStyle : { //标签的字体样式
                          color : '#fff', //字体颜色
                          fontStyle : 'normal',//文字字体的风格 
                          fontWeight : 'bold',
                          fontFamily : 'sans-serif', //文字的字体系列
                          fontSize : 13, //字体大小
                      }
                  },
              },

              categories : [ //symbol name：用于和 legend 对应以及格式化 tooltip 的内容。 label有效
              {
                  symbol : 'rect',
              }, {
                  symbol : 'rect'
              }, {
                  symbol : 'roundRect'
              }, {
              //     symbol : 'roundRect'
              // }, {
                  symbol : 'roundRect'
              } ],
              //name:影响图形标签显示,value:影响选中后值得显示,category:所在类目的index,symbol:类目节点标记图形,
              data : [...data],
              links : [...links],
          }],

        }
       },
 renderEcharts(echartNodes) {

            this.myChart = echarts.init(this.$refs[echartNodes]);
        this.myChart.setOption(this.echartOption);

        this.myChart.on('click', function (params) {
            //这里面可以判断是不是点击的知识元
            console.log(params.name);
        });
       },
       /**
        * [getList 获取知识地图或知识树数据]
        * @Author   罗文
        * @DateTime 2017-11-21
        * @param    {[Number]}   type  [1-知识地图 2- 知识束]
        * @param    {[Number]}   id    [当前知识元id]
        * @param    {Number}   level [知识地图下的相关层级]
        * @return   {[type]}         [description]
        */
    getList() {
         this.$http.get("/ExplicitWordRelation/Map", {
            params: {
              id: 12421,
              type: 1,
              level: 1,
            }
          })
          .then((res) => {
            if(res.data.Code == 200) {
                //请求成功，根据type渲染知识地图或知识束
                if(res.data.Data.length === 0) return;

               
                   this.renderMap(res.data.Data);
                
            }else {
              this.$message.error(res.data.Description);
            }
          })
    },


    /**
        * [getListByLevel 进入知识地图时候获取各个层级的数据]
        * @Author   罗文
        * @DateTime 2017-11-21
        * @param    {[Number]}   type  [1-知识地图 2- 知识束]
        * @param    {[Number]}   id    [当前知识元id]
        * @param    {Number}   level [知识地图下的相关层级]
        * @return   {[type]}         [description]
        */
    getListByLevel(level) {
         this.$http.get("/ExplicitWordRelation/Map", {
            params: {
              id: 12421,
              type: 1,
              level: 1,
            }
          })
          .then((res) => {
            if(res.data.Code == 200) {
                //保存每次请求的层级对应的数据
                switch (level) {
                  case 1:
                    this.relationLevel1Data = res.data.Data;
                    this.firstNodesIds = this.relationLevel1Data.map((item)=>{
                      return item.Id;
                   })
                    break;

                  case 2:
                    this.relationLevel2Data = res.data.Data;
                  this.secondNodesIds = this.relationLevel2Data.map((item)=>{
                      return item.Id;
                   })

                    break;
                    
                  case 3:
                    this.relationLevel3Data = res.data.Data;
                    break;    

                  default:
                    // statements_def
                    break;
                }
            }else {
              this.$message.error(res.data.Description);
            }
          })
    },
        
        /**
         * [renderMap 根据知识地图组织数据]
         * @Author   罗文
         * @DateTime 2017-11-21
         * @param    {[Array]}   data [要绘制的数据]
         * @return   {[type]}        [description]
         */
    renderMap(data) {
      let newData = []; //处理成新的数组，满足echarts
      let links = [];
      let hash = [];   //存放所有的知识元名称，不能重复

      data.forEach((item,index)=>{
              if(hash.indexOf(item.FirstWordTitle) == -1 ) {
                 hash.push(item.FirstWordTitle);
                 newData.push({
                  nodeData:item,   //节点数据
                  nodeId:item.FirstWordId, //节点知识元Id
                  name:item.FirstWordTitle,
                 })
              }

              if(hash.indexOf(item.SecondWordTitle) == -1 ) {
                 hash.push(item.SecondWordTitle);
                 newData.push({
                  nodeData:item,
                  nodeId:item.SecondWordId,
                  name:item.SecondWordTitle,
                 })
              }

      })
          
      newData = newData.map((item)=>{
          //处理根节点颜色改变
              if(item.nodeId == this.expId) {
                 item.itemStyle = {
                  normal : { //默认样式
                      label : {
                          show : true
                      },

                      color:'#ff0000',
                  }
                 }

             //     item.label = { //=============图形上的文本标签
              //     normal : {
              //         textStyle : { //标签的字体样式
              //             color : '#fff', //字体颜色
              //         }
              //     },
              // }
              }
              
              //处理二层节点
              if(this.ralationLevel == 2) {
                 //说明这是第二层的节点，重新变个色
               if(this.firstNodesIds.indexOf(item.nodeData.Id) == -1) {
                    item.itemStyle = {
                    normal : { //默认样式
                        label : {
                            show : true
                        },

                        color:'#eb9e05',
                    }
                   }
               }
        }
              
              //处理三层节点
        if(this.ralationLevel == 3) {
               //说明这是第三层的节点，重新变个色
               if(this.firstNodesIds.indexOf(item.nodeData.Id) == -1) {
                    item.itemStyle = {
                    normal : { //默认样式
                        label : {
                            show : true
                        },

                        color:'#eb9e05',
                    }
                   }
               }

               if(this.secondNodesIds.indexOf(item.nodeData.Id) == -1) {
                    item.itemStyle = {
                    normal : { //默认样式
                        label : {
                            show : true
                        },

                        color:'#0000ff',
                    }
                   }

               }
        }


              return item;
      })
        

          //处理关系数组
          links = data.map((item)=>{
             return {
                source : item.SecondWordTitle,
                target : item.FirstWordTitle
             }
          })



      this.setOptions(newData,links,true);
          this.renderEcharts('echartTree');
    },
     /**
         * [ChainCombine 下面这坨代码，就是为了把线性的知识链转换成几条长短不一的链，保持最长的链在横线上]
         * @Author   罗文
         * @DateTime 2017-11-22
         * @param    {[type]}   chain [description]
         */
    ChainCombine(chain) {

          // let chain = [ {
          //   start: 'E',
          //   end: 'D'
          // }, {
          //   start: 'A',
          //   end: 'B'
          // },{
          //   start: 'D',
          //   end: 'B'
          // }, {
          //   start: 'B',
          //   end: 'C'
          // }];
          //        alert(chain[0].start);

          let result = new Array();
          for(let i = 0; i < chain.length; i++) {
            let item = new Array();
            item[0] = chain[i].FirstWordTitle;
            item[1] = chain[i].SecondWordTitle;

            //判断这两个元素是否已经在列表中了

            if(result.length == 0) {
              result.push(item);
            } else {
              var startExist = this.IsExist(result, item[0]);
              var endExist = this.IsExist(result, item[1]);

              if(!startExist && !endExist) {
                //如果两个都不在数据中，则添加到数组
                result.push(item);
                continue;
              }

              //追加到列表后面
              let lastList = this.FindLast(result, item[0]);
              //添加到列表前面
              let firstList = this.FindFirst(result, item[1]);

              if(lastList != null || firstList != null) {
                if(lastList != null) {
                  lastList.push(item[1]);
                } else {
                  //在第0个位置插入
                  firstList.splice(0, 0, item[0]);
                }
              } else {
                //需要处理，end在数据中的情况
                var inList = this.FindIn(result, item[1]);
                if(inList != null) {
                  result.push(item);
                }
              }
            }
          }

          return result;
        },

        FindIn(list, value) {
          for(let i = 0; i < list.length; i++) {
            var subList = list[i];
            for(let j = 0; j < subList.length; j++) {
              if(subList[j] == value)
                return subList;
            }
          }
          return null;
        },

        FindFirst(list, value) {
          for(let i = 0; i < list.length; i++) {
            var subList = list[i];
            if(subList[0] == value)
              return subList;
          }
          return null;
        },

        FindLast(list, value) {
          for(let i = 0; i < list.length; i++) {
            var subList = list[i];
            if(subList[subList.length - 1] == value)
              return subList;
          }
          return null;
        },

        IsExist(list, value) {
          for(let i = 0; i < list.length; i++) {
            var subList = list[i];
            for(let j = 0; j < subList.length; j++) {
              if(subList[j] == value)
                return true;
            }
          }
          return false;
        },
  },
  mounted() {
    //请求知识地图
    this.getList();
  },

}
</script>
<style scoped>

</style>
