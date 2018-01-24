<template>
  <div class="exp-detail" 
  :style="{width:0.9 * winWidth + 'px',marginLeft:0.05 * winWidth + 'px',marginRight:0.05 * winWidth + 'px',marginTop:18 + 'px',minWidth:600 + 'px'}"
  v-loading="loading" 
  element-loading-text="数据加载中...">
    <div style="margin-top: 20px">
      <el-radio-group v-model="activeName" size="medium">
        <el-radio-button label="1">知识元详情</el-radio-button>
        <el-radio-button label="2">知识地图</el-radio-button>
        <el-radio-button label="3">知识束</el-radio-button>
        <el-radio-button label="4">深度阅读</el-radio-button>
      </el-radio-group>
    </div>
    <div v-show="activeName == 1">
      <h2>{{expDetail.Title}}</h2>
      <p>
        <b>别名：</b><span>暂无</span>
      </p>
      <p>
        <b>简介：</b>{{expDetail.Abstracts ? expDetail.Abstracts : '暂无'}}
      </p>
      <p>
        <b>相关知识元：</b>
        <span v-for="(item,index) in expDetail.RelatedWordList" @click="toExpDetail(item)"
        style="cursor:pointer" class="expDetail-span">
          {{item.Title}}
        </span>
      </p>
      <p>
        <b>参考资料：</b> {{expDetail.Source ? '《 ' + expDetail.Source + ' 》' : '无'}}
      </p>
    </div>
    <div v-show="activeName == 2">
      <!--  <el-radio-group v-model="ralationLevel">
        <el-radio-button label="1">一级</el-radio-button>
        <el-radio-button label="2">二级</el-radio-button>
        <el-radio-button label="3">三级</el-radio-button>
      </el-radio-group> -->
      <div class="exp-map-control">
        <div class="exp-cut" @click="rollback(1)" v-show="mapRollbackData.length > 0">
          <img src="../assets/images/回退icon.png" height="18" width="18" alt=""> 回退
        </div>
        <div class="exp-cut" @click="captureImage">
          <img src="../assets/images/截图icon.png" height="18" width="18" alt=""> 截图
        </div>
        <div class="exp-map-level">
          <i>
            显示级别
          </i>
          <span :class="ralationLevel == 1 ? 'active':''" @click="getList(1,1)">1</span>
          <b></b>
          <span :class="ralationLevel == 2 ? 'active':''" @click="getList(1,2)">2</span>
          <b></b>
          <span :class="ralationLevel == 3 ? 'active':''" @click="getList(1,3)">3</span>
        </div>
      </div>
      <div :style="{width:winWidth * 0.9 + 'px', height:winHeight- 200 +  'px',margin:'0 auto',overflow:'hidden'}" >
        <div 
        ref="echartTree" 
        class="echarts-content" 
        :style="{width:winWidth * 0.9 + 'px', height:winHeight- 200 +  'px',margin:'0 auto',transform:'scale('+mapScale+')'}" 
        v-show="mapDataList.length !== 0">
        </div>

        <div class="echart-no-data" :style="{width:winWidth * 0.9 + 'px', height:winHeight - 200  + 'px'}" v-show="mapDataList.length == 0">
          暂无数据
        </div>
      </div>
    </div>
    <div v-show="activeName == 3">
      <div class="exp-map-control">
        <div class="exp-cut"  @click="rollback(2)" v-show="beamRollbackData.length > 0">
          <img src="../assets/images/回退icon.png" height="18" width="18" alt=""> 回退
        </div>
        <div class="exp-cut" @click="captureImage">
          <img src="../assets/images/截图icon.png" height="18" width="18" alt=""> 截图
        </div>
        <div>
          <el-select v-model="value" placeholder="选择知识元">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div 
      ref="echartChainTree" 
      class="echarts-content" 
      :style="{width:winWidth * 0.9 + 'px', height:winHeight - 200 + 'px',margin:'0 auto'}" 
      v-show="beamDataList.length !== 0"
      >
      </div>
      <div class="echart-no-data" :style="{width:winWidth * 0.9 + 'px', height:winHeight - 200  + 'px'}" v-show="beamDataList.length == 0">
        暂无数据
      </div>
    </div>
    <div v-show="activeName == 4" style="margin-top:20px">
      <div 
      class="echarts-content" 
      :style="{width:winWidth * 0.9 + 'px', height:winHeight + 'px',margin:'0 auto',minWidth:600 + 'px'}"
      >
         <!-- 展开表格 -->
         <expand-table  :expId="expId"></expand-table>
      </div>
    </div>
  </div>
</template>
<script>
import ExpandTable from './common/ExpandTableForExpDetail.vue';
import echarts from 'echarts';

export default {
  data() {
    return {
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
      activeName: '1',
      oldActiveNames:['1'], //用于知识地图各个知识元的互相切换操作时的回退操作
      expands: [],
      expId: this.$route.query.expId ||GetArgument().split('=')[1], //知识元id
      expDetail: {},
      loading:true,
      //echarts相关
      echartOption: null,
      echartDraggable: true,
      myChart: null,
      echartTitle: '',
      ralationLevel: 1,

      //用来存放知识地图各层级数据
      relationLevel1Data: [],
      firstNodesIds: [],
      relationLevel2Data: [],
      secondNodesIds: [],
      relationLevel3Data: [],


      mapDataList:[],
      beamDataList:[],


      //用于存放回退的id集合，每次新增一个知识元就在尾部添加一条数据
      mapRollbackData:[],
      beamRollbackData:[],

      //知识链下拉框
      options: [],
      value: '',
      resizeTimer:null,


      mapScale:1,
    }
  },

  components: {
    'expand-table': ExpandTable,
  },

  methods: {
    /**
     * [toExpDetail 去知识元详情]
     * @Author   罗文
     * @DateTime 2017-11-23
     * @param    {[type]}   id [description]
     * @return   {[type]}      [description]
     */
    toExpDetail(item) {

       //路由跳转，不区分dev和prod环境  goToUrl(path,[options]);
       //options详细配置见util.js;
       this.goToUrl('/ExplicitWordDetail',{
         query:[{
          expId:item.Id
         }],
         winType:'详情',
         winTitle:item.Title,
         isIndForm:true,
       });
       // location.reload();
    },
    /**
     * [initExpDetail 进入页面或切换知识元节点的初始化工作]
     * @Author   罗文
     * @DateTime 2017-11-30
     * @return   {[type]}   [description]
     */
    initExpDetail() {
       //获取知识元详情
        this.getDetail();
        

        //进入页面，获取知识地图一二三层数据，并收集id集合
        this.handleClick(1);
        //进入页面，获取知识地图 和知识束数据
        this.getList(1, this.ralationLevel);
        this.getList(2);

    },
    /**
     * [getDetail 获取知识元详情]
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
          if (res.data.Code == 200) {
            this.loading = false;
            this.expDetail = res.data.Data;

            if(env == 'prod') SetTabTitle(this.expDetail.Title,GetFormId())
          } else {
            this.$message.error(res.data.Description);
          }
        })
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
    getList(type, level = 1) {
      this.ralationLevel = level;
      this.$http.get("/ExplicitWordRelation/Map", {
          params: {
            id: this.expId,
            type: type,
            level: level,
          }
        })
        .then((res) => {
          if (res.data.Code == 200) {
            this.loading = false;
            //请求成功，根据type渲染知识地图或知识束
            if (res.data.Data.length === 0) return;

            if (type == 1) {
              this.mapDataList = res.data.Data;
              this.renderMap(res.data.Data);
            } else if (type == 2) {
              this.renderBeam(res.data.Data);
              this.beamDataList = res.data.Data;
            }
          } else {
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
    getListByLevel(level = 1) {
      this.$http.get("/ExplicitWordRelation/Map", {
          params: {
            id: this.expId,
            type: 1,
            level: level,
          }
        })
        .then((res) => {
          if (res.data.Code == 200) {
            //保存每次请求的层级对应的数据
            switch (level) {
              case 1:
                this.relationLevel1Data = res.data.Data;
                this.firstNodesIds = this.relationLevel1Data.map((item) => {
                  return item.Id;
                })
                break;

              case 2:
                this.relationLevel2Data = res.data.Data;
                this.secondNodesIds = this.relationLevel2Data.map((item) => {
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
          } else {
            this.$message.error(res.data.Description);
          }
        })
    },


    //切换tab的事件
    handleClick(index) {
      //一进入这个页面，就获取一二三层对应的数据
      if (index == 1) {
        if (this.relationLevel1Data.length == 0) {
          this.getListByLevel(1);
        }

        if (this.relationLevel2Data.length == 0) {
          this.getListByLevel(2);
        }

        if (this.relationLevel3Data.length == 0) {
          this.getListByLevel(3);
        }
      }
    },
    
    /**
     * [rollback 回退]
     * @Author   罗文
     * @DateTime 2017-12-14
     * @param    {[Number]}   type [1 - 回滚知识地图  2 - 回滚知识束]
     * @return   {[type]}        [description]
     */
    rollback(type) {
       if(type == 1) {
          //已结回滚到最后
          if(this.mapRollbackData.length == 0) return;
           //先存储当前知识元id
           this.expId = this.mapRollbackData.pop();
           this.beamRollbackData = [];
       }else {
          //已结回滚到最后
         if(this.beamRollbackData.length == 0) return;
         //先存储当前知识元id
         this.expId = this.beamRollbackData.pop();
         this.mapRollbackData = [];
       }



       //重绘地图
       this.resetMap();
    },
    

    /**
     * [captureImage 截图]
     * @Author   罗文
     * @DateTime 2017-12-10
     * @return   {[type]}   [description]
     */
    captureImage() {
       if(env == 'prod') {
          console.log(CaptureImage());
       }
    }, 
    
    /**
     * [resetMap 回退操作，重新渲染]
     * @Author   罗文
     * @DateTime 2017-12-10
     * @return   {[type]}   [description]
     */
    resetMap() {
       //销毁现有画布
      this.myChart.dispose();
      
      this.ralationLevel = 1;
      //重新获取每层数据
      this.relationLevel1Data = [];
      this.relationLevel2Data = [];
      this.relationLevel3Data = [];

      this.handleClick(1);

      
      //获取新的知识元地图
      this.getList(1,1);
      this.getList(2,1);
      //获取知识元详情
      this.getDetail();
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
      let hash = []; //存放所有的知识元名称，不能重复

      data.forEach((item, index) => {
        if (hash.indexOf(item.FirstWordTitle) == -1) {
          hash.push(item.FirstWordTitle);
          newData.push({
            nodeData: item, //节点数据
            nodeId: item.FirstWordId, //节点知识元Id
            name: item.FirstWordTitle,
          })
        }

        if (hash.indexOf(item.SecondWordTitle) == -1) {
          hash.push(item.SecondWordTitle);
          newData.push({
            nodeData: item,
            nodeId: item.SecondWordId,
            name: item.SecondWordTitle,
          })
        }

      })

      newData = newData.map((item) => {
        //处理根节点颜色改变
        if (item.nodeId == this.expId) {
          item.itemStyle = {
            normal: { //默认样式
              label: {
                show: true
              },

              borderColor:'#f32d37',

              color: '#fe6d67',
            }
          }
        }


        //处理二层节点
        if (this.ralationLevel == 2) {
          //说明这是第二层的节点，重新变个色
          if (this.firstNodesIds.indexOf(item.nodeData.Id) == -1) {
            item.itemStyle = {
              normal: { //默认样式
                label: {
                  show: true
                },
                borderColor:'#629fb7',
                color: '#7ccae3',
              }
            }
          }
        }

        //处理三层节点
        if (this.ralationLevel == 3) {
          //说明这是第三层的节点，重新变个色
          if (this.firstNodesIds.indexOf(item.nodeData.Id) == -1) {
            item.itemStyle = {
              normal: { //默认样式
                label: {
                  show: true
                },
                borderColor:'#629fb7',
                color: '#7ccae3',
              }
            }
          }

          if (this.secondNodesIds.indexOf(item.nodeData.Id) == -1) {
            item.itemStyle = {
              normal: { //默认样式
                label: {
                  show: true
                },
                borderColor:'#8799a2',
                color: '#b3c8ce',
              }
            }

          }
        }


        return item;
      })


      //处理关系数组
      links = data.map((item) => {
        return {
          source: item.SecondWordTitle,
          target: item.FirstWordTitle
        }
      })



      this.setOptions(newData, links, true);
      this.renderEcharts('echartTree');
    },

    /**
     * [renderMap 根据知识束组织数据]
     * @Author   罗文
     * @DateTime 2017-11-21
     * @param    {[Array]}   data [要绘制的数据]
     * @return   {[type]}        [description]
     */
    renderBeam(data) {
      let newData = []; //处理成新的数组，满足echarts
      let links = [];
      let hash = []; //存放所有的知识元名称，不能重复
      
      this.options = [];

      data.forEach((item, index) => {
        if (hash.indexOf(item.FirstWordTitle) == -1) {
          hash.push(item.FirstWordTitle);
          this.options.push({
            label:item.FirstWordTitle,
            value:item.FirstWordId
          })
        }

        if (hash.indexOf(item.SecondWordTitle) == -1) {
          hash.push(item.SecondWordTitle);
          this.options.push({
            label:item.SecondWordTitle,
            value:item.SecondWordId
          })
        }
      })
      
      if(!this.value) this.value = this.options[0].value;

      

      let arr = [];
      let chain = [];
      let max = 0;

      chain = this.ChainCombine(data);


      //找出最大值
      chain.forEach((item, index) => {
        if (index < chain.length - 1) {
          if (item.length < chain[index + 1].length) {
            max = index + 1;
          }
        }

        item.forEach((citem, cindex) => {
          //处理关系links
          if(cindex < item.length - 1 ) {
             links.push({
                source: citem.title,
                target: item[cindex + 1].title
              })
          }
          
        })
      })

      //渲染最长链
      chain[max].forEach((item, index) => {
        arr.push({
          name: item.title,
          nodeId: item.nodeId,
          x: 300 * index,
          y: 300,
        })
      })

      //渲染其他链
      chain.forEach((item, index) => {
        if (index !== max) {
          chain[index].forEach((citem, cindex) => {

            let titles = [];

            chain[max].forEach((nitem, nindex)=>{
               titles.push(nitem.title);
            })

            //如果不存在这个知识元
            if (titles.indexOf(citem.title) == -1) {
              for (var i = 0; i < arr.length; i++) {
                if (arr[i].name == citem.title) break;

                if (i == arr.length - 1) {
                  arr.push({
                    name: citem.title,
                    // x: 300 * (cindex + 1) + 300,
                    // y: 300 * (index + 1) + 300
                  })
                }
              }
            }
          })
        }
      })


      arr = arr.map((item)=>{
          if (item.nodeId == this.expId) {
              item.itemStyle = {
                normal: { //默认样式
                  label: {
                    show: true
                  },

                  borderColor:'#f32d37',
                  color: '#fe6d67',
                }
              }
            }

            return item;
       })

      this.setOptions(arr, links, false);
      this.renderEcharts('echartChainTree');

    },

    renderEcharts(echartNodes) {
      this.myChart = echarts.init(this.$refs[echartNodes]);
      this.myChart.setOption(this.echartOption);
      
      let _this = this;
      this.myChart.on('click', function(params) {
        //这里面可以判断是不是点击的知识元
        //切换根节点
        if(params.data.nodeId !== _this.expId) {
            //先存储当前知识元id
            if(params.data.nodeData) {
               //此时是知识地图
               _this.mapRollbackData.push(_this.expId);
            }else {
               _this.beamRollbackData.push(_this.expId);
            }

            _this.expId = params.data.nodeId;
            if(env == 'prod') SetTabTitle(params.data.name,GetFormId());
            
            //重绘地图
            _this.resetMap();
        }
      });


       this.myChart.on('datazoom', function (param) {
            console.log(1111)
            console.log(param.dataZoom.start);
        });

    },

    /**
     * [setOptions 设置echarts数据]
     * @Author   罗文
     * @DateTime 2017-11-21
     * @param    {[type]}   data [description]
     */
    setOptions(data, links, draggable) {
      if(data.length > 100) data = data.slice(0,100);
      let _this = this;
      this.echartOption = {
        title: {
          text: _this.echartTitle,
          x: 'center'
        },
        
        tooltip: {
          show: true, //默认显示
          showContent: true, //是否显示提示框浮层
          trigger: 'item', //触发类型，默认数据项触发
          triggerOn: 'mousemove', //提示触发条件，mousemove鼠标移至触发，还有click点击触发
          confine: false, //是否将 tooltip 框限制在图表的区域内。
          transitionDuration: 0.4, //提示框浮层的移动动画过渡时间，
        },
        series: [{
          type: 'graph', //关系图
          name: "知识元", //系列名称
          layout: 'force', //图的布局，类型为力导图，'circular' 采用环形布局，
          legendHoverLink: true, //是否启用图例 hover(悬停) 时的联动高亮。
          hoverAnimation: true, //是否开启鼠标悬停节点的显示动画
          force: { //力引导图基本配置
            repulsion: 350, //节点之间的斥力因子。
            gravity: 0.05, //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢
            edgeLength: 100, //边的两个节点之间的距离，
            layoutAnimation: true
            //因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死  
          },
          roam: 'move', //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          nodeScaleRatio : 0.8,//鼠标漫游缩放时节点的相应缩放比例，当设为0时节点不随着鼠标的缩放而缩放
          draggable: draggable, //节点是否可拖拽，只在使用力引导布局的时候有用。
          focusNodeAdjacency: false, //是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
          edgeSymbol: ['arrow'],
          edgeSymbolSize: 10, //边两端的标记大小，可以是一个数组分别指定两端，也可以是单个统一指定。
          symbolSize: 66,

          itemStyle: { //图形样式
            normal: { //默认样式
              label: {
                show: true
              },
              borderType: 'solid', //图形描边类型，默认为实线， 
              borderWidth: 2, //图形的描边线宽。为 0 时无描边。
              opacity: 1,
              color: '#1ab9f0',
              borderColor:'#1499c1',
            }
          },
          lineStyle: { //==========关系边的公用线条样式。
            normal: {
              width: '1',
              type: 'solid', //线的类型 
              curveness: 0, //线条的曲线程度，从0到1
              opacity: 1
            }
          },
          label: { //=============图形上的文本标签
            normal: {
              show: true, //是否显示标签。
              position: 'inside', //标签的位置。['50%', '50%'] [x,y]
              textStyle: { //标签的字体样式
                color: '#444', //字体颜色
                fontStyle: 'normal', //文字字体的风格 
                fontWeight: 'bold',
                fontFamily: 'sans-serif', //文字的字体系列
                fontSize: 12, //字体大小
              },
              formatter: function(val) { //让series 中的文字进行换行 
                if (val.name.length != 0 && val.name.length > 5) {
                  if (val.name.length <= 10) {
                    return val.name.slice(0, 4) + '\n' + val.name.slice(5, val.name.length)
                  } else {
                    return val.name.slice(0, 4) + '\n' + val.name.slice(5, 9) + '...'
                  }
                } else {
                  return val.name;
                }
              },
            },

          },

          categories: [ //symbol name：用于和 legend 对应以及格式化 tooltip 的内容。 label有效
            {
              symbol: 'rect',
            }, {
              symbol: 'rect'
            }, {
              symbol: 'roundRect'
            }, {
              //     symbol : 'roundRect'
              // }, {
              symbol: 'roundRect'
            }
          ],
          //name:影响图形标签显示,value:影响选中后值得显示,category:所在类目的index,symbol:类目节点标记图形,
          data: [...data],
          links: [...links],
        }],

      }
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
      for (let i = 0; i < chain.length; i++) {
        let item = new Array();
        item[0] = chain[i].FirstWordTitle;
        item[1] = chain[i].SecondWordTitle;

        //判断这两个元素是否已经在列表中了

        if (result.length == 0) {
          result.push(item);
        } else {
          var startExist = this.IsExist(result, item[0]);
          var endExist = this.IsExist(result, item[1]);

          if (!startExist && !endExist) {
            //如果两个都不在数据中，则添加到数组
            result.push(item);
            continue;
          }

          //追加到列表后面
          let lastList = this.FindLast(result, item[0]);
          //添加到列表前面
          let firstList = this.FindFirst(result, item[1]);

          if (lastList != null || firstList != null) {
            if (lastList != null) {
              lastList.push(item[1]);
            } else {
              //在第0个位置插入
              firstList.splice(0, 0, item[0]);
            }
          } else {
            //需要处理，end在数据中的情况
            var inList = this.FindIn(result, item[1]);
            if (inList != null) {
              result.push(item);
            }
          }
        }
      }

      result.forEach((item,index)=>{
         let itemLen = item.length;
         item.forEach((citem,cindex)=>{

            for(let i = 0 ; i < chain.length ; i ++) {
                if(citem == chain[i].FirstWordTitle) {
                   // console.log(citem);
                   item.push({
                     title:chain[i].FirstWordTitle,
                     nodeId:chain[i].FirstWordId,
                   })

                   // item.splice(cindex,1);
                   break;
               }else if(citem == chain[i].SecondWordTitle) {
                   // console.log(citem)
                   item.push({
                     title:chain[i].SecondWordTitle,
                     nodeId:chain[i].SecondWordId,
                   })

                   // item.splice(cindex,1);
                   break;
               }
            }
         })

         item.splice(0,itemLen);

      })

      return result;
    },

    FindIn(list, value) {
      for (let i = 0; i < list.length; i++) {
        var subList = list[i];
        for (let j = 0; j < subList.length; j++) {
          if (subList[j] == value)
            return subList;
        }
      }
      return null;
    },

    FindFirst(list, value) {
      for (let i = 0; i < list.length; i++) {
        var subList = list[i];
        if (subList[0] == value)
          return subList;
      }
      return null;
    },

    FindLast(list, value) {
      for (let i = 0; i < list.length; i++) {
        var subList = list[i];
        if (subList[subList.length - 1] == value)
          return subList;
      }
      return null;
    },

    IsExist(list, value) {
      for (let i = 0; i < list.length; i++) {
        var subList = list[i];
        for (let j = 0; j < subList.length; j++) {
          if (subList[j] == value)
            return true;
        }
      }
      return false;
    },

  },


  // 12421,31041
  mounted() {
    // console.log(this.expId)
    this.initExpDetail();
   
    window.onresize = () => {
      this.winWidth = this.setWindow().winWidth;
      this.winHeight = this.setWindow().winHeight;
      
      if(this.resizeTimer) clearTimeout(this.resizeTimer);

      this.resizeTimer = setTimeout(()=>{
         if(this.myChart) this.myChart.resize();
      },200)
    }


  },

  beforeDestroy () {
    if(this.myChart) this.myChart.clear();
  },

  updated() {
    let _this = this;
    //阻止echart自身的缩放，自定义缩放比例
    if(!this.$refs.echartTree.children[0])  return ;
    this.$refs.echartTree.children[0].onmousewheel = function(e) {
      e.preventDefault()
      var type = 1;

      if(e.wheelDelta < 0 || e.detail > 0){
          type = -1 ;
      }else {
          type = 1 ;
      }

      if(type == 1) {  //放大
        if(_this.mapScale >= 2) {
          return 
        }

        _this.mapScale *= 1.1;
     

      }else if(type == -1){  //缩小
        if(_this.mapScale <= 0.6) {
          return 
        }//缩小到最小

        _this.mapScale /= 1.1;
      }

    }
  },

  watch: {

    'activeName': function(nv) {
      //这段代码逻辑有点问题 --- 罗文注

      if (this.firstNodesIds.length == 0 && this.secondNodesIds.length == 0) {
        if (nv == 2 && this.ralationLevel !== 1) {
          //请求知识地图
          this.getList(1, this.ralationLevel);
          return;
        } else if (nv == 3) {
          //请求知识束
          this.getList(2);
          return;
        }
      } else {
        //解决进入组件不请求第一层级的知识地图的bug
        if (nv == 2 && this.ralationLevel == 1) {
          this.getList(1, this.ralationLevel);
          return;
        }

        if (nv == 3) {
          //请求知识束
          this.getList(2);
        }
      }

      if(nv == 4) {
         window.onresize();
      }
    },

    'value':function(nv) {
      this.expId = nv;

      this.beamRollbackData.push(this.expId);
       
      //重绘地图
      this.resetMap();

      if(env == 'dev') return;
      this.options.forEach((item,index)=>{
         if(item.value == nv) SetTabTitle(item.label,GetFormId());
      })
      
      
    }
  }
}

</script>
<style scoped>
  .echart-no-data {
    display: flex;
    justify-content: center;
    align-items: center;
  }


</style>
