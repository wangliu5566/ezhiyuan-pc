import $ from 'jquery';
export default {
  install(Vue, options) {
    /**
     * [getResourceType 匹配资源类型]
     * @Author   罗文
     * @DateTime 2017-11-22
     * @param    {[Number/String]}   resourceType [资源类型]
     * @return   {[Object]}    {name:'资源名',engName:'英文名'}          [description]
     */
    Vue.prototype.getResourceType = function(resourceType) {
      resourceType = parseInt(resourceType);
      let resource = [{
          type: 101,
          resourceName: '知识元',
          resourceEngName: 'ExplicitWord',
        }, {
          type: 102,
          resourceName: '章节',
          resourceEngName: 'Chapter',
        }, {
          type: 103,
          resourceName: '电子标准',
          resourceEngName: 'ElecStandard',
        }, {
          type: 104,
          resourceName: '图书',
          resourceEngName: 'Book',
        }, {
          type: 105,
          resourceName: 'OA论文',
          resourceEngName: 'Thesis',
        }, {
          type: 106,
          resourceName: '电子电路包',
          resourceEngName: 'ElecCircuitPack',
        }, {
          type: 107,
          resourceName: '课程',
          resourceEngName: 'Course',
        },
        // {
        //     type:108,
        //     resourceName:'图片',
        //     resourceEngName:'',
        // },
        {
          type: 109,
          resourceName: '视频',
          resourceEngName: 'Video',
        }, {
          type: 110,
          resourceName: '音频',
          resourceEngName: '',
        }, {
          type: 111,
          resourceName: '图片',
          resourceEngName: 'Image',
        }, {
          type: 112,
          resourceName: '期刊',
          resourceEngName: '',
        }
      ]

      let mapResource = null;

      resource.forEach((item, index) => {
        if (item.type == resourceType) mapResource = item;
      })


      return mapResource;
    };
    

    /**
     * [getReaderSupportExtension 根据阅读器类型获取其支持的格式]
     * @Author   罗文
     * @DateTime 2017-12-12
     * @param    {[String]}   type [阅读器类型  '所有'  图书   pdf  视频  图片]
     * @return   {[Array]}        [该类型支持的格式]
     */
    Vue.prototype.getReaderSupportExtension = function() {
      let all = ['mp4','bmp','jpg','png','jpeg','gif','epub','pdf'];
      let ext = [];
      
      let video = ['mp4'];  //视频
      let image = ['bmp','jpg','png','jpeg','gif'];  //图片
      let epub = ['epub'];  //图书
      let pdf = ['pdf'];  //pdf
      
      ext = all.map((item)=>{
        if(video.indexOf(item) !== -1) {
           return {
              ext:item,
              reader:'视频',
           }
        }else if(image.indexOf(item) !== -1) {
           return {
              ext:item,
              reader:'图片',
           }
        }else if(epub.indexOf(item) !== -1) {
           return {
              ext:item,
              reader:'图书',
           }
        }else if(pdf.indexOf(item) !== -1) {
           return {
              ext:item,
              reader:'PDF',
           }
        }   
      })
      return ext;

    }


   Vue.prototype.goConfirmBtn = function(path,item) {

   }




    /**
     * [goConfirmBtn 确定订单]
     * @Author   赵雯欣
     * @DateTime 2017-11-22
     * @param    {[type]}   patge [description]
     * @return   {[type]}         [description]
     */
    Vue.prototype.goConfirmBtn = function(path,item) {
      if(env == 'prod') CloseMenueStrip();
      // 验证有没有用户信息和激活码
      var hasUserId = volidUserId(true);
      if(!hasUserId) return;

      var oderObj = { 
        counts: 1,
        objectTypes:item.ObjectType,
        totalMoney:item.MarketPrice,
        objectIds:item.Id,
        userId:localStorage.userId
      };
      
      this.goConfirmOrder(path, oderObj)
    },

     

    /**
     * [goConfirmModal 跳转至确定订单页面]
     * @Author   赵雯欣
     * @DateTime 2017-11-22
     * @param    {[type]}   page [跳转到确定订单页面]
     * @param    {[type]}   arr  [订单列表]
     * @return   {[type]}        [description]
     */
    Vue.prototype.goConfirmOrder = function(page, oderObj) {
      console.log(oderObj)
      this.$http.post('/Order/Create',oderObj)
        .then((res) => {
          // console.log(res)
          if (res.data.Success == true) {
            var orderId = res.data.Data.Id;
            
             if(env == 'dev') {
               this.goToUrl(page,{
                   query:[{
                    orderId:orderId
                   }],
                   winType:'订单',
                   winTitle:'确认订单',
                   isIndForm:true,
                });
             }else {
                SaveArgument('orderId='+orderId);
                OpenForm(1100,600,'/index.html#/confirmOrder','确认订单');
             }       
             
          } else {
            this.$message({
              message: res.data.Description,
              type: 'error'
            });
          }
        })
    };


    /**
     * [addToShoppingCar 新增购物车]
     * @Author   赵雯欣
     * @DateTime 2017-11-22
     * @param    {[type]}   count    [购买数量]
     * @param    {[type]}   price    [单价]
     * @param    {[type]}   objectId [资源编号]
     * @param    {[type]}   userId   [description]
     * @param    {[type]}   type     [资源类型]
     */
    Vue.prototype.addToShoppingCar = function(item,isPay) {
      if(env == 'prod') CloseMenueStrip();
      // 验证有没有用户信息和激活码
      var hasUserId = volidUserId(true);
      if(!hasUserId) return;

      this.$http.post('/ShoppingCart/Create', {
          count: 1,
          price: item.MarketPrice,
          objectId: item.Id,
          userId: localStorage.userId,
          objectType: item.ObjectType
        })
        .then((res) => {
          console.log(res)
          if (res.data.Success) {
            
              this.$message({
                message: '成功加入购物车',
                type: 'success'
              });
              if(isPay){
                this.goToUrl('/shoppingCar',{
                   query:[{
                     userId: localStorage.userId,
                   }],
                   winType:'购物车',
                   winTitle:'购物车',
                   isIndForm:true,
                });
              };
              // location.reload();
             if(env == 'prod') {
              this.getDetail();
              this.getShoppingCarList();
             }
            
            //如果是从详情页加入的购物车，刷新页面
            // if(isFromDetail) {
            //    window.setTimeout(()=>{
            //      location.reload();
            //   }, 1000)
            // }
            
          } else {
            this.$message({
              message: res.data.Description,
              type: 'error'
            });
          }
        })
    };


    /**
     * [getList 获取购物车列表]
     * @Author   赵雯欣
     * @DateTime 2017-11-22
     * @return   {[type]}   [description]
     */
    Vue.prototype.getShoppingCarList = function() {
      this.$http.get("/ShoppingCart/List", {
          params: {
            userId: localStorage.userId
          }
        })
        .then((res) => {
          if (res.data.Success) {
            if(env == 'prod') ChangeShoppingCartCount(res.data.Data.RecordCount);
          }else {
            this.$message.error(res.data.Description);
          }
        })
    },
    /**
     * [goOtherPage 跳转到其他页面]
     * @Author   赵雯欣
     * @DateTime 2017-11-22
     * @param    {[type]}   page   [跳转页面]
     * @param    {[type]}   params [携带的参数]
     * @return   {[type]}          [description]
     */
    Vue.prototype.goOtherPage = function(page, params,title) {
      this.goToUrl(page,{
         query:[{
          id: params
         }],
         winType:'详情',
         winTitle:title,
         isIndForm:true,
      });
    };
    /**
     * [goOtherPage 跳转到知识元详情]
     * @Author   赵雯欣
     * @DateTime 2017-11-22
     * @param    {[type]}   page   [跳转页面]
     * @param    {[type]}   params [携带的参数]
     * @return   {[type]}          [description]
     */
    Vue.prototype.goKnowledgeDetail = function(page, params) {
      this.goToUrl(page,{
         query:[{
          expId: params
         }],
         winType:'详情',
         winTitle:'知识元详情',
         isIndForm:true,
      });
    };
    

    //格式化价格
    Vue.prototype.formatPrice = function(s, n) {
        /*
         * 参数说明：
         * s：要格式化的数字
         * n：保留几位小数
         * */
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
          r = s.split(".")[1];
        var t = "";
        for (var i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
      },
    /**
     * [getFavorite 获取收藏]
     * @Author   赵雯欣
     * @DateTime 2017-11-22
     * @param    {[type]}   objectType [资源类型]
     * @param    {[type]}   objectId   [资源编号]
     * @param    {[type]}   userId     [用户编号]
     * @param    {Function} callback   [回调函数]
     * @return   {[type]}              [description]
     */
    Vue.prototype.getFavorite = function(objectType, objectId, userId, callback) {
        this.$http.get('/Favorite/Check', {
            params: {
              objectType: objectType,
              objectId: objectId,
              userId: userId
            }
          })
          .then((res) => {
            if (res.data.Success) {
              if (res.data.Description == "该用户收藏此资源") {
                callback(true)
              } else if (res.data.Description == "该用户没有收藏此资源") {
                callback(false)
              }
            }
          })
      },
      /**
       * [updateFavorite 收藏和取消收藏]
       * @Author   赵雯欣
       * @DateTime 2017-11-22
       * @param    {[type]}   objectType [资源类型]
       * @param    {[type]}   objectId   [资源编号]
       * @param    {[type]}   userId     [用户编号]
       * @param    {Function} callback   [回调函数]
       * @return   {[type]}              [description]
       */
      Vue.prototype.updateFavorite = function(objectType, objectId, userId, callback) {
        // 验证有没有用户信息和激活码
        var hasUserId = volidUserId(false);
        if(!hasUserId) return;

        this.$http.post('/Favorite/CreateOrUpdate', {
            objectType: objectType,
            objectId: objectId,
            userId: userId
          })
          .then((res) => {
            if (res.data.Success) {
              this.$message({
                message: res.data.Description,
                type: 'success'
              });
              if (res.data.Description == "收藏成功") {
                callback(true)
              } else if (res.data.Description == "取消收藏成功") {
                callback(false)
              }
            }else {
              this.$message({
                message: res.data.Description,
                type: 'error'
              });
            }
          })
      }
    /**
     * [confirmType 处理表格的类型和返回值]
     * @Author   赵雯欣
     * @DateTime 2017-11-21
     * @param    {[type]}   obj  [传入的对象]
     * @param    {[type]}   type [1-类型，2-名称，3-来源]
     * @return   {[type]}        [各类值]
     */
    Vue.prototype.confirmType = function(obj, type) {
        switch (obj.ObjectType) {
          case 104: //得到图书的相关返回值
            if (type == 1) { //返回类型
              return '图书'
            } else if (type == 2) { //返回名称
              return obj.Book.Title ? obj.Book.Title : '暂无'
            } else if (type == 3) { //返回来源
              return obj.Book.Publisher ? obj.Book.Publisher : '暂无'
            } else if (type == 4) { //返回价格
              return obj.Book.MarketPrice ? obj.Book.MarketPrice : '暂无'
            }
            break;
          case 103:
            if (type == 1) {
              return '电路标准'
            } else if (type == 2) {
              return obj.ElecStandard.Title ? obj.ElecStandard.Title : '暂无';
            } else if (type == 3) {
              return obj.ElecStandard.Sponsor ? obj.ElecStandard.Sponsor : '暂无'
            } else if (type == 4) {
              return obj.ElecStandard.MarketPrice ? obj.ElecStandard.MarketPrice : '暂无'
            }
            break;
          case 105:
            if (type == 1) {
              return '论文'
            } else if (type == 2) {
              return obj.Thesis.Title ? obj.Thesis.Title : '暂无';
            } else if (type == 3) {
              return '暂无';
            } else if (type == 4) {
              return obj.Thesis.MarketPrice ? obj.Thesis.MarketPrice : '暂无'
            }
            break;
          case 102:
            if (type == 1) {
              return '章节'
            } else if (type == 2) {
              return obj.Chapter.Title ? obj.Chapter.Title : '暂无';
            } else if (type == 3) {
              return obj.Chapter.Source ? obj.Chapter.Source : '暂无';
            } else if (type == 4) {
              return obj.Chapter.MarketPrice ? obj.Chapter.MarketPrice : '暂无';
            }
            break;
          case 106:
            if (type == 1) {
              return '电路包'
            } else if (type == 2) {
              return obj.ElecCircuitPack.Title ? obj.ElecCircuitPack.Title : '暂无';
            } else if (type == 3) {
              return '暂无';
            } else if (type == 4) {
              return obj.ElecCircuitPack.MarketPrice ? obj.ElecCircuitPack.MarketPrice : '暂无';
            }
            break;
          case 111: //图片
            if (type == 1) {
              return '图片'
            } else if (type == 2) {
              return obj.Image.Title ? obj.Image.Title : '暂无';
            } else if (type == 3) {
              return '暂无';
            } else if (type == 4) {
              return obj.Image.MarketPrice ? obj.Image.MarketPrice : '暂无';
            }
            break;
          case 109: //视频
            if (type == 1) {
              return '视频'
            } else if (type == 2) {
              return obj.Video.Title ? obj.Video.Title : '暂无';
            } else if (type == 3) {
              return '暂无';
            } else if (type == 4) {
              return obj.Video.MarketPrice ? obj.Video.MarketPrice : '暂无';
            }
            break;
        }
      },
      /**
       * [confirmType 处理表格的类型和返回值]
       * @Author   赵雯欣
       * @DateTime 2017-11-21
       * @param    {[type]}   obj  [传入的对象]
       * @param    {[type]}   type [1-类型，2-名称，3-来源]
       * @return   {[type]}        [各类值]
       */
    Vue.prototype.confirmTypes = function(type) {
        switch (type) {
          case 0: //得到图书的相关返回值
            return '全部'
            break;
          case 101: //得到图书的相关返回值
            return '知识元'
            break;
          case 102:
            return '章节'
            break;
          case 103:
            return '电子标准'
            break;
          case 104: //得到图书的相关返回值
            return '图书'
            break;
          case 105:
            return '论文'
            break;
          case 106:
            return '电路包'
            break;
          case 107:
            return '课程'
            break;
          case 108: 
            return '图片'
            break;
          case 109:
            return '视频'
            break;
            case 110: 
            return '音频'
            break;
            case 111: 
            return '动画'
            break;
        }
      }


    

    
    Vue.prototype.addSearchHistory = function(searchItem) {
        if(localStorage.historySearchList && localStorage.historySearchList !== '') {
           localStorage.setItem('historySearchList',localStorage.historySearchList + ',' + searchItem);
        }else {
           // 此时没有搜索历史
           localStorage.setItem('historySearchList', searchItem);
        }
    }

    
    /**
     * [removeExpandTableFirstCol 用于去除首列的折叠箭头]
     * @Author   罗文
     * @DateTime 2017-11-29
     * @return   {[type]}   [description]
     */
    Vue.prototype.removeExpandTableFirstCol = function() {
      // console.log(1)
       var listOfColGroup = document.getElementsByTagName('colgroup');
       for(var i = 0 ; i < listOfColGroup.length ; i ++) {
          listOfColGroup[i].children[0].setAttribute('width', '0');
       }
    }

    /**
     * [获取某个侧边栏最小的高度]
     * @Author   王柳
     * @DateTime 2017-12-17
     */
      Vue.prototype.getDivHeight = function(){
        // var listGroup = document.getElementsByClassName('side-out-li');
        var minHeight = $('.side-out').outerHeight();
        $('#divId').css({
          'height':minHeight + 'px',
          'overflow':'auto'
        });

      }
       /**
     * [获取订单收缩栏的最小高度]
     * @Author   王柳
     * @DateTime 2017-12-17
     */
      Vue.prototype.getOrderDivHeight = function(){
        // var listGroup = document.getElementsByClassName('el-table__expanded-cell');
        var minHeight = $('.order-ul').innerHeight();
        // console.log(minHeight)
        if(minHeight == 'undefined'){
            $('.order-div').css({
              'minHeight':66 + 'px',
              'lineHeight':66 + 'px',
           });
         }else{
           $('.order-div').css({
              'minHeight':minHeight + 'px',
              'lineHeight':minHeight + 'px',
           });

           $('.btns').css('lineHeight','40px');
         } 
      };

      Vue.prototype.setWindow = function() {
        winWidth:window.innerWidth;
        winHeight:window.innerHeight;
        if(this.winWidth <= 1260) {
             this.isShowScale = true; 
         }else {
             this.isShowScale = false;
         }
        if(this.winWidth <= 600) {
             this.isShowTwoScale = true; 
         }else {
             this.isShowTwoScale = false;
         }
        return {
          winWidth:window.innerWidth,
          winHeight:window.innerHeight,
        }
      }

      //设置某侧边栏最大高度，超出部分滚动
      Vue.prototype.getSliderDivHeight = function(){
         var winHeight = window.innerHeight;
         // var minwidth = $('.choice-ul').innerWidth();
          $('.choice-ul').css({
            'maxHeight': winHeight + 'px',
            // 'width': minwidth + 'px',
            'overflow':'auto'
            });
          // console.log($('.choice-ul').innerWidth())
      }

    Vue.prototype.goToUrl = function(path,options = {query:[]}) {
       //router保证开发环境下能访问到路由
       
       //options是路由跳转时可选的配置
       // options = {
       //   query:[   //附带的参数，数组的形式支持传入多个值
       //     // {
       //     //   queryKey:''   
       //     // }
       //   ],   //附带参数
       //   winType:'',  //要打开的窗口类型
       //   winTitle:'',  //要打开的窗口标题 
       //   isIndForm:true,   //是否打开个独立窗口，true - 是 false-否
       // }

       //配置参数
       let query = {};
       let queryStr = '';

       if(options.query.length !== 0) {
          options.query.forEach((item,index)=>{
             let key = Object.keys(item)[0];
             let value = Object.values(item)[0];
             query[key] = value;
             queryStr += key + '='+value + '&';
          })
          
          //去掉最后一个'&'
          queryStr = queryStr.slice(0,-1);
       }


       //开发环境下的跳转
       if(env=="dev"){
         //跳转
         this.$router.push({
           path:path,
           query:query
         })
       }else if(env=="prod"){
        //生成环境下的跳转
         if(options.query.length !== 0) {
            SaveArgument(queryStr);
         }
         loadForm('/index.html#' + path,options.winType,options.winTitle,options.isIndForm)
       } 
    }

    Vue.prototype.goToUrlProduct = function(path,options = {query:[]}) {
       //router保证开发环境下能访问到路由
       
       //options是路由跳转时可选的配置
       // options = {
       //   query:[   //附带的参数，数组的形式支持传入多个值
       //     // {
       //     //   queryKey:''   
       //     // }
       //   ],   //附带参数
       //   winType:'',  //要打开的窗口类型
       //   winTitle:'',  //要打开的窗口标题 
       //   isIndForm:true,   //是否打开个独立窗口，true - 是 false-否
       // }

       //配置参数
       let query = {};
       let queryStr = '';

       if(options.query.length !== 0) {
          options.query.forEach((item,index)=>{
             let key = Object.keys(item)[0];
             let value = Object.values(item)[0];

             query[key] = value;
             queryStr += key;
          })
          
          //去掉最后一个'&'
          queryStr = queryStr;
       }


       //开发环境下的跳转
       if(env=="dev"){
         //跳转
         this.$router.push({
           path:path,
           query:query
         })
       }else if(env=="prod"){
        //生成环境下的跳转
         if(options.query.length !== 0) {
            SaveArgument(queryStr);
         }
         loadForm('/index.html#' + path,options.winType,options.winTitle,options.isIndForm)
       } 
    }
    
    /**
     * [combineSystemParams 合并系统参数]
     * @Author   罗文
     * @DateTime 2017-12-05
     * @param    {[type]}   dataObj [description]
     * @return   {[type]}           [description]
     */
    Vue.prototype.combineSystemParams = function(dataObj) {
         return Object.assign({},dataObj,systemParams);
    }

    
    // /**
    //  * [ApiTransfer 用作网页端开发环境和生产环境的接口转换]
    //  * @Author   罗文
    //  * @DateTime 2017-12-05
    //  * @param    {[String]}   apiname [api接口，必填参数]
    //  * @param    {[Object]}   data    [请求时的数据]
    //  * @return  {String|Object} [url地址或含有处理过的数据的地址]
    //  */
    
    // Vue.prototype.ApiTransfer = function(apiname,data) {
    //   //必填，可以根据false
    //   if(!apiname) {
    //     alert('apiname是必填参数!');
    //     return;
    //   };

    //   //如果没有传参数，表明是计算api部分，只需要返回url
    //   if(!data) return env == 'dev' ? baseUrl + apiname : transferUrl;  
       
    //   //如果传入了data，则最后返回的对象只返回data参数，整合系统参数等 

    //   //这里还要先验证accessToken是否存在且在有效期内
      
      
    //   //开发环境,需要自己配置系统参数
    //   if(env == 'dev') {
    //      return Object.assign({},data,systemParams,{random:Math.random()});   //随机数用作清除缓存
    //   }else if(env == 'prod'){
    //     //生产环境，参数中附加apiname,但不需要系统参数，服务器端配置
    //      return Object.assign({},data,{
    //              apiname:apiname,
    //              random:Math.random()
    //            })
    //   }
    // }



    Vue.prototype.validAccessToken = function(callback) {
       //可以记录在sessionStorage 或 localStorage，  sessionStorage 可能更好
       //如果sessionStorage没有账号和密码，可以认为这个用户没登录
       if(!localStorage.account || !localStorage.password) {
           // this.$router.push('/Login');
           return 
       }

       if(!localStorage.accessToken || !localStorage.accessTokenExpTime || new Date(localStorage.accessTokenExpTime).getTime() - new Date().getTime() < 1000 * 60 * 2 ) {
       
          //AccessToken 不存在 或 过期时间不存在  或 过期时间小于 2分钟，都要重新去登录更新AccessToken
          // var loginUrl = env == 'dev' ? baseUrl + '/Passport/Login' : transferLoginUrl;  
          this.$http.post('/Passport/Login', {
            account: localStorage.account,
            password: localStorage.password,
            apiname:'/Passport/Login'
          })
          .then((res) => {
            if (res.data.Success) {
              localStorage.setItem('accessToken',res.data.Data.ExtendData.AccessToken);
              localStorage.setItem('accessTokenExpTime',res.data.Data.ExtendData.AccessTokenExpirationTime);

              if(callback) callback();
            }
          })
       }
    }


    /**
     * [toBookView 跳转到图书阅读]
     * @Author   罗文
     * @DateTime 2017-12-04
     * @param    {[type]}   item [阅读的EPUB资源]
     * @return   {[type]}        [description]
     */
    Vue.prototype.toBookView = function(item) {
      //保存数据
      SaveArgument(item.Id + '&' + item.ObjectType);
      //保存资源类型
      loadForm('/static/public/reader.html','图书阅读',item.Title,true);
    }


    /**
     * [toBookView 跳转到图书阅读]
     * @Author   罗文
     * @DateTime 2017-12-04
     * @param    {[type]}   item [description]
     * @return   {[type]}        [description]
     */
    Vue.prototype.toPdfView = function(item,packageId,packageName,packageTitle) {
      SaveArgument(item.Id + '&' + item.ObjectType);

      //如果有packageId，则说明是从详情来阅读的
      if(packageId) SavePackageData(item.Id, packageId , packageName,packageTitle);
      loadForm('/static/public/pdf.html','PDF阅读',item.Title,true);
    }



    /**
     * [toVideoOrImgView 去阅读图片或视频]
     * @Author   罗文
     * @DateTime 2017-11-30
     * @param    {[type]}   url [description]
     * @return   {[type]}       [description]
     */
    Vue.prototype.toVideoOrImgView = function(item,packageId,packageTitle) {
      //视频是在线加载的，不需要下载，需要自己请求解密key
      if(!item.ExtendData.AuthorizeToken) {
         this.$message.error('请先购买资源');
         return 
      }
      this.$http.post("/Content/Authorize", this.combineSystemParams({
            id:item.Id,
            authorizeToken:item.ExtendData.AuthorizeToken
          }))
        .then((res) => {
          console.log(res.data)

          if (res.data.Success) {
            if(item.ObjectType == 109) {
               //视频
               SaveArgument(JSON.stringify(Object.assign(res.data.Data,{objectId:item.Id,objectType:item.ObjectType})));
               
               //如果有packageId，则说明是从详情来阅读的
               if(packageId) SavePackageData(item.Id, packageId,'电路包',packageTitle);

               loadForm('/static/public/multimediaView.html','视频阅读',item.Title,true);
            }else {
               //图片
               SaveArgument(res.data.Data.Url + '&' + item.Id  + '&' + item.ObjectType);
               //如果有packageId，则说明是从详情来阅读的
               if(packageId) SavePackageData(item.Id, packageId,'电路包',packageTitle);

               loadForm('/static/public/imgView.html','图片阅读',item.Title,true);
            }
          }else {
            this.$message.error(res.data.Description);
          }
        })
    }

  }
}
