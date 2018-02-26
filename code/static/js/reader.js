       document.getElementById('bookContIframe').addEventListener('load', function() {
          iframeOnload(document.getElementById('bookContIframe'));
       },false)

       document.addEventListener('click', ()=>{
         CloseMenueStrip();
         EnableTabIcon(1); //1-epub 2-pdf 3多媒体
       }, false)


    //----------------------------------------------------------------下面是暴露给winform使用的方法--------------------------------------
    //关闭程序清除用户数据
    function clearLocalStorage(type) {
        if(type == 1) {
            localStorage.removeItem('userId');
        }else if(type == -1) {
            localStorage.removeItem('searchArr');
        } 
    }

    // 打开目录或地图列表
    function openLibCate(type) {
        // 0 - 目录  1 - 地图列表
        if(type == 1) return;
        $vm.openLibCate(type);
        // setExplicitWordLabelLevel(0)
        // 
        // searchExpLabelByOrder('可靠性',-1);
    }

    //设置本文对应的文内搜索内容
    function setActiveOptions(isSearching) {
         if(!isSearching) {

           //清理文内检索数据
           $vm.clearCurBookSearchData();

           //初始化上次搜索内容的样式
             var listOfSearchSpan = $($vm.$data.bookIframeWindow.document.body).find('.search-content');
             $(listOfSearchSpan).each((index,item)=>{
                 var nodeParent = $(item).parent();
                 var nodeText = $(nodeParent).text();
                 $(item).remove();
                 $(nodeParent).text(nodeText);
             })
         }
    }

    // 改变背景色
    function setBgColor(color) {
        $vm.closeLibOper();
        $vm.setBgColor(color);
    }

    // 改变字体大小
    function setFontSize(type) {
        $vm.closeLibOper();
        $vm.setFontSize(type)
            // type = -1 --缩小  1 -- 放大
        // searchExpLabelByOrder('可靠性',1);
    }

    // 单双栏切换
    function togglePageCol() {
        $vm.togglePageCol();
        $vm.closeLibOper();
    }

    //上一章、下一章
    function changeIframeSrc(type) {
        $vm.closeLibOper();
        if(type == -1) {
            //上一章
            if($vm.$data.curSectionIndex == 0) {
               $vm.$data.message.showMessage('warming','已经是第一章！'); 
               return;
            }

            $vm.changeIframeSrc('', $vm.$data.curSectionIndex - 1);
            return;
        }

        if(type == 1) {
            if($vm.$data.curSectionIndex == $vm.$data.tableofSections.length - 1) {
               $vm.$data.message.showMessage('warming','已经是最后一章！');  
               return;
            }

            $vm.changeIframeSrc('', $vm.$data.curSectionIndex + 1);
            return;
        }
        
    }

    //页码
    function togglePageNum() {
        $vm.closeLibOper();
        if ($vm.$data.pageNumShow) {
            $vm.$data.message.showMessage('info','已关闭页码！');
        } else {
            $vm.$data.message.showMessage('info','已开启页码！');
        }
        $vm.togglePageNum();
    }
    
    //添加收藏
    function addCollect() {
        $vm.closeLibOper();
        $vm.addCollect();
    } 

    
    //文内检索
    function bookSearch() {
        $vm.closeLibOper();
        $vm.openBookSearch() 
    }

    
    /**
     * [setExplicitWordLabelLevel 设置展示标签的层级]
     * @Author   罗文
     * @DateTime 2017-12-07
     * @param    {[type]}   level   [显示标签级别 0 - 关闭  1 - 2  -3]
     * @param    {[type]}   keyword [关键词，备用]
     */
    function setExplicitWordLabelLevel(level = 0,keyword) {
        console.log(level,keyword)
        $vm.getExplicitWordLabelList(level);
    }

    /**
     * [searchExpLabelByOrder description]
     * @Author   罗文
     * @DateTime 2017-12-07
     * @param    {[String]}   text [当前标签]
     * @param    {[Number]}   type [上一个或下一个 1 - 下一个  -1 - 上一个]
     * @return   {[type]}        [description]
     */
    var sameLables = []; //保存与活跃标签一致的所有标签
    var activeText = ''  //保存活跃标签的文字
    function searchExpLabelByOrder(text,type) {
        sameLables = []
        console.log(text,type);
       //如果当前活跃标签与之前的一致，则
       $($vm.$data.bookIframeWindow.document.body).find('.exp-lablel').each((index,item)=>{
           if($(item).text() == text) {
              sameLables.push(item);
           }
       })
       

       for(var i = 0 ; i < sameLables.length ; i ++) {
          if($(sameLables[i]).hasClass('active-lable')) {

               if(type == 1) {
                 console.log(i)
                 //下一个
                 //如果已经是最后一项
                   if(i == sameLables.length - 1) {
                      $vm.$data.message.showMessage('info','已经是最后一个！');
                      return;
                   }
                   
               }else if(type == -1) {
                  //上一个
                  
                   if(i == 0) {
                     $vm.$data.message.showMessage('info','已经是第一个！');
                     return;
                   } ;
                   //如果已经是第一项
               }


               //移除当前活跃，跳转下个活跃
               $(sameLables[i]).removeClass('active-lable');
               $(sameLables[i]).css('opacity',0.5);
               // $(sameLables[i]).css('outline','none');

               $(sameLables[i + type]).addClass('active-lable');
               $(sameLables[i + type]).css('opacity',1);
               // $(sameLables[i + type]).css('outline','2px solid red');

               $vm.$data.bookIframeWindow.document.body.scrollLeft = $(sameLables[i + type]).parent().offset().left;

               break;
  
           }
       }

    }

    
    /**
     * [toBookDetail 查看详情]
     * @Author   罗文
     * @DateTime 2017-12-07
     * @return   {[type]}   [description]
     */
    function toBookDetail() {
        // 根据type判断是跳转哪个详情
        // 有102 - 章节 104 - 图书  103 - 标准
        SaveArgument('id='+$vm.$data.sectionid);

        switch ($vm.$data.sectionType) {
            case '102':
                loadForm('/index.html#/section','详情',$vm.$data.sectionLibList[0].Title,true);
                break;
            case '103':
                loadForm('/index.html#/eStandard','详情',$vm.$data.sectionLibList[0].Title,true);
                break;
            case '104':
                // loadForm('/index.html#/ExplicitWordDetail','详情',$(this).text(),true);
                break;        
            default:
                // statements_def
                break;
        }
    }

    // //添加笔记
    // function addNote() {
    //     $vm.closeLibOper();
    //     $vm.openNoteWindow() 
    // }

    //失焦后再次聚焦验证收藏按钮
    function volidCollected() {
        //检查收藏
        $vm.gethasCollect();
        // //检查书签
        // if($vm.$data.pageNumShow) {
        //     ChangeFavoriteIcon(true, '图文',3);
        // }else {
        //     ChangeFavoriteIcon(false, '图文',3);
        // }
    }

    //文内检索时，文内检索窗口通知阅读窗口发生位置变化
    function resetPosByBookSearch(pos) {
        //如果只是index发生变化
        var _this = $vm;
        var curPos = parseInt(pos);
        
         $(_this.$data.bookIframeWindow.document.body).children().each((index,citem)=>{
             // if(tags.indexOf($(item).get(0).nodeName.toLowerCase()) !== -1) {
                 var fontNum = 0;
                 var nextFontNum = 0;
                 //计算出这个节点之前的字数和
                 $(citem).prevAll().each((nindex, nitem)=>{
                    fontNum += $(nitem).text().length;
                 })

                 $(citem).next().prevAll().each((nindex, nitem)=>{
                   nextFontNum += $(nitem).text().length;
                 });

                 
                 if((curPos >= fontNum && curPos < nextFontNum)) {
                    //滚动到这个位置
                    _this.$data.countLeft =  $(citem).next().offset().left;
                    _this.$data.bookIframeWindow.document.body.scrollLeft = _this.$data.countLeft;
                 }
             // }
         })

    }

    //每次切换iframe的src执行页面初始化渲染
    function init(iframeEle) {
        var _this = $vm;

        _this.$data.bookIframeWindow = iframeEle.contentWindow;
        _this.$data.countLeft = 0;
        _this.togglePageCol(-1);
        _this.setFontSize();
        
        //获取winform记录的用户之前的背景色
        var otherBg = GetBookBackGroundColor();
        _this.setBgColor(otherBg);
        _this.togglePageNum(-1);
        _this.getSectionTop();
        _this.setIframeReadingSectionName();
        _this.setIframeImg();
        //获取知识标签
        _this.getExplicitWordLabelList(1);
        _this.$data.bookIframeWindow.addEventListener('scroll', _this.setIframeReadingSectionName, false);
        setTimeout(()=>{
            //清理文内检索数据
            _this.clearCurBookSearchData();
            
            EnableTabIcon(1); //1-epub 2-pdf 3多媒体
        }, 500)

        setInterval(function(){
            _this.scrollToLibIndex();  //滚动到某小节的位置
        },300)
    }

    // //iframe 的 onload事件
    function iframeOnload(iframeEle) {
        //获取iframe里的onload事件 
        //设置段落样式
        var _this = $vm;
        
        $(iframeEle.contentWindow.document.body).css({
            margin:'0 auto',
            letterSpacing:'1px',
            overflow:'hidden',
            width:_this.$data.winWidth +'px',
            height:_this.$data.winHeight-10 +'px'
        })

        $(iframeEle.contentWindow.document.body).append($('<a href="" id="achor"></a>'))



        

        $(iframeEle.contentWindow.document.body).children('p').css('line-height','250%');

        //初始化页面
        init(iframeEle);
        //左侧目录栏收起
        $(iframeEle.contentWindow.document.body).on('click', function(e) {
            _this.$data.conMenuShow = false;
            _this.$data.isProgressBarShow = false;
            CloseMenueStrip();
            EnableTabIcon(1); //1-epub 2-pdf 3多媒体

            if(_this.$data.libLeft >= -280) {
               var type = _this.isShowLibList?0:1;
               // 0 - 当前为图书状态  1- 当前为地图状态
               _this.openLibCate(type);
            }
        })
        

        //页码不跳转，并且备注跳转位置
        $(iframeEle.contentWindow.document.body).on('click','a', function(e) {
            e.preventDefault();

            if($(this).attr('href').indexOf('http://') !== -1) return;

            //此时点击的是备注，提取其对应锚点信息
            var href = $(this).attr('href');
                href = href.slice(1);
            

            //找到对应的跳转目标锚点
            var listOFIframeNodes = $(iframeEle.contentWindow.document).find('a[id="'+href+'"]');
            // 获取目标锚点的left
            var scrollLeft = listOFIframeNodes[0].offsetLeft;


             if (_this.$data.scrollTimer)
                clearTimeout(_this.$data.scrollTimer)

             _this.$data.scrollTimer = setTimeout(() => {
                // 获取目标a标签在左半屏还是右半屏
                var aimAtLeftOrRightInScreen = scrollLeft % (_this.$data.winWidth * 0.95);

                //获取翻滚了多少页
                var scrollLeftCount = (scrollLeft - scrollLeft % (_this.$data.winWidth * 0.95)) / (_this.$data.winWidth * 0.95);
                    
                    //这里还需要判断是从前往后跳还是从后往前跳
                    if($(listOFIframeNodes).parent().hasClass('footnote')) {
                        //这个时候是从前往后跳
                        if(!_this.$data.isTwoCol) {
                           //因为存在正文跳注释少一页的bug，所以需要判断跳转后，本页中是否有这个元素，没有就多跳一页
                           _this.$data.countLeft = (scrollLeftCount) * (_this.$data.winWidth * 0.95);

                           //这里获取当前屏幕下的所有段落标签
                           
                           _this.$nextTick(function() {
                               var eleMin = _this.getScreenStartEle()[0];
                               var eleMax = _this.getScreenEndEle()[0];
                              
                               //利用jquery判断这两个节点之间的所有节点，是否含有要查询的节点

                               var nodesArr = $(eleMin).nextUntil($(eleMax).next());
                   
                               var arr = [];
                                   arr.push(eleMin);

                               for(var i = 0 ; i < nodesArr.length ; i ++) {
                                   arr.push(nodesArr[i]);
                               }
                 
                            
                               var count = 0;

                               for(var i = 0 ; i < arr.length ; i ++) {
                                   if($(arr[i]).find('a[id="'+href+'"]').length !== 0) {
                                      count ++;
                                   }
                               }

                               if(count === 0) {
                                 _this.$data.countLeft = (scrollLeftCount + 1) * (_this.$data.winWidth * 0.95);
                                 iframeEle.contentWindow.document.body.scrollLeft = _this.$data.countLeft;
                               }
                           })



                        }else {
                           if(aimAtLeftOrRightInScreen/_this.$data.winWidth * 0.95 <= 0.5) {
                            //如果是左半屏    
                               _this.$data.countLeft = (scrollLeftCount ) * (_this.$data.winWidth * 0.95);
                            }else {
                            //如果是右半屏
                               _this.$data.countLeft = (scrollLeftCount +1) * (_this.$data.winWidth * 0.95);
                            } 
                        }
                    }else {
                        //这个时候是从后往前
                        _this.$data.countLeft = scrollLeftCount  * (_this.$data.winWidth * 0.95);
                    }

                iframeEle.contentWindow.document.body.scrollLeft = _this.$data.countLeft;
                // _this.flexMove1(iframeEle.contentWindow.document.body, _this.$data.countLeft)

                
            }, 100)



        })

        
        //右键
        $(iframeEle.contentWindow.document).on('contextmenu', function(e) {
            e.preventDefault();
            _this.$data.conMenuShow = true;
            _this.openOrCloseContextMenu(true);
            openContextMenu(e)
        })


        //查看文中的图片
        $(iframeEle.contentWindow.document.body).on('click', 'img', function(e) {
            if(e.target.src.indexOf('/static/images') !== -1) return;
            if (env == "dev") {
                window.location.href = ymUrl + '/imgView?imgSrc=' + e.target.src;
            } else if (env == "prod") {
                if(_this.$data.canIaddNote) {
                    SaveArgument(e.target.src);
                    // SaveArgument('imgSrc='+e.target.src)
                    loadForm('/static/public/imgView.html','图片详情','文内图片',false);
                }
            }
        })

        //右键操作,打开menu
        function openContextMenu(e, type) {
            e.preventDefault();
            if (type == -1) return;

            _this.$data.conMenuLeft = e.pageX - _this.$data.bookIframeWindow.document.body.scrollLeft + 0.05 * _this.$data.winWidth;
            _this.$data.conMenuTop = e.pageY;
            _this.$data.conMenuShow = true;

            // 先将所有按钮止于不可用
            _this.$data.menuListDisable = {
                copy: false,
                collect: false,
                bookSearch: true,
            }
            //复制按钮
            if(_this.$data.bookIframeWindow.document.getSelection().toString() !== '') {
                _this.$data.menuListDisable.copy = true;
            }

            // 判断收藏按钮
            if(!_this.$data.hasCollect) {
               _this.$data.menuListDisable.collect = true;   
            }
            
        }

        
        //重定义复制事件
        $(_this.$data.bookIframeWindow).on('copy',function(e) {
            e.preventDefault();
            _this.closeMenuAndDo(e,'copy');
        })


        //滚动翻页
        $(iframeEle.contentWindow).on('mousewheel', function(e) {
                var type = null;
                if (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0) {
                    type = 1;
                } else {
                    type = -1;
                }
                

               _this.openOrCloseContextMenu(false);
                //获取向右还是向左 1- 向左 -1 -向右
               _this.pageExchange(type);

        })

        //键盘左右键翻页
        $(iframeEle.contentWindow).on('keydown', function(e) {
                // e.preventDefault();
                var type = null;
                if (e.keyCode == 37) {
                    type = -1;
                } else if(e.keyCode == 39){
                    type = 1;
                }
                
               _this.openOrCloseContextMenu(false);
                //获取向右还是向左 1- 向左 -1 -向右
               _this.pageExchange(type);
        })

        //隐藏左右翻页
        $(iframeEle.contentWindow).on('mousemove', function(e) {
                _this.$data.bodyMouseenter = false;
        })

        $(iframeEle.contentWindow.document.body).on('dragstart',function(e) {
                e.preventDefault();
        })

        
        //知识标签的相关事件
        var isCurLabelActive = false;
        $(iframeEle.contentWindow.document.body).on('mouseenter','.exp-lablel', function(e) {
                isCurLabelActive  = false;
                console.log($(this).css('opacity'))
                if($(this).css('opacity') == 1) {
                  isCurLabelActive = true;
                }

                $(this).css('opacity',1);
        }).on('mouseleave','.exp-lablel', function(e) {
                if(!isCurLabelActive) $(this).css('opacity',0.5);
        }).on('click','.exp-lablel', function(e) {

                ChangeLableName($(this).text());
                
                //移除所有的活跃标签
                $(iframeEle.contentWindow.document.body).find('.exp-lablel').each((index,item)=>{
                    $(item).removeClass('active-lable')
                    $(item).css('opacity',0.5);
                    // $(item).css('outline','none');
                 })

                isCurLabelActive = true;
                
                //添加当前活跃标签
                $(this).css('opacity',1);
                $(this).addClass('active-lable');
               

                SaveArgument('expId='+$(this).attr('data-lableId'));
                loadForm('/index.html#/ExplicitWordDetail','详情',$(this).text(),true);
        })

        //文内检索功能
        setSearchResult();
        


        var prevSearchKeyword = '';
        var prevIndex = 0;
        var prevActiveIndex = 'xxx';

        function setSearchResult() {
            //轮询搜索项是否改变
            
                setInterval(()=>{
                    if(localStorage.getItem('searchArr')) {
                        var searchArr = JSON.parse(localStorage.getItem('searchArr'));

                        if(searchArr.length !== 0) {
                          searchArr.forEach((item,index)=>{
                            
                              if(item.formId == $vm.$data.formId && item.sectionId == $vm.$data.sectionid ) {

                                 if(item.searchKeyword !== '') {

                                    if(item.searchKeyword !==  prevSearchKeyword) {
                                      bookSearchResult(item.searchKeyword);

                                      prevSearchKeyword = item.searchKeyword;
                                    }

                                    //如果只是index发生变化
                                    if(parseInt(item.searchIndex) != prevIndex) {

                                        var curPos = parseInt(item.searchIndex);

                                        var tags = ['h1','h2','h3','h4','h5','h6','p','div','br'];
                                        var isCircle = true;
                                        
                                         $(iframeEle.contentWindow.document.body).children().each((index,citem)=>{
                                             // if(tags.indexOf($(item).get(0).nodeName.toLowerCase()) !== -1) {
                                                 var fontNum = 0;
                                                 var nextFontNum = 0;
                                                 //计算出这个节点之前的字数和
                                                 $(citem).prevAll().each((nindex, nitem)=>{
                                                    fontNum += $(nitem).text().length;
                                                 })

                                                 $(citem).next().prevAll().each((nindex, nitem)=>{
                                                   nextFontNum += $(nitem).text().length;
                                                 });

                                                 
                                                 if((curPos >= fontNum && curPos < nextFontNum)) {
                                                    //滚动到这个位置
                                                    _this.$data.countLeft =  $(citem).next().offset().left;
                                                    iframeEle.contentWindow.document.body.scrollLeft = _this.$data.countLeft;

                                                    
                                                 }
                                             // }
                                         })

                                        prevIndex = curPos;
                                   }

                                   //如果点击的那一条发生了变化
                                   // if(parseInt(item.clickIndex) !== prevActiveIndex) {
                                      addCurSearchkey(parseInt(item.clickIndex));
                                      prevActiveIndex = parseInt(item.clickIndex);
                                   // }

                                   return;
                                }

                                if(item.searchKeyword === '') {
                                    if(item.searchKeyword ==  prevSearchKeyword) return;
                   
                                    prevSearchKeyword = item.searchKeyword;
                                    //初始化上次搜索内容的样式
                                     var listOfSearchSpan = $(iframeEle.contentWindow.document.body).find('.search-content');
                                     $(listOfSearchSpan).each((index,item)=>{
                                         var nodeParent = $(item).parent();
                                         var nodeText = $(nodeParent).text();
                                         $(item).remove();
                                         $(nodeParent).text(nodeText);
                                     })

                                }
                              }
                          })
                        }  
                    }
                    


                }, 500)
        }


        //文内检索结果设置
        function  bookSearchResult(searchKeyword) {
             //初始化上次搜索内容的样式
             var listOfSearchSpan = $(iframeEle.contentWindow.document.body).find('.search-content');
             $(listOfSearchSpan).each((index,item)=>{
                 var nodeParent = $(item).parent();
                 var nodeText = $(nodeParent).text();
                 $(item).remove();
                 $(nodeParent).text(nodeText);
             })

             if(!searchKeyword) return ;
                
            //这时候依然有搜索项
            changeBookResult(searchKeyword);

        }

        // 搜索
         function changeBookResult(searchKeyword) {
             var reg = new RegExp(searchKeyword,'g');
                
                //搜索的字段包含[ ,不包含 <
                if(searchKeyword.indexOf('\[') !== -1 || searchKeyword.indexOf('<') !== -1) {
                   //为了保证跨页码和注释标签能搜索到，需要把匹配的段落全部整合成text不带样式
                    $(iframeEle.contentWindow.document.body).children().each((index,item)=>{
                        if(reg.test($(item).text())) {
                           $(item).text($(item).text().replace(reg, '&lt;span style="background:yellow" class="search-content"&gt;' + searchKeyword.replace(/\\/g,'') + '&lt;/span&gt;'));
                           
                           // if($(item).text().indexOf('&lt;') !== -1) {
                           var tmp = $(item).text().replace(/&lt;/g,'<');
                               tmp = tmp.replace(/&gt;/g,'>');
                               
                               if($(item).hasClass('footnote')) {
                                  $('<p class="footnote">'+tmp+'</p>').insertAfter($(item));
                               }else {
                                  $('<p style="line-height: 200%; font-size: 16px;">'+tmp+'</p>').insertAfter($(item));
                               }
                               $(item).remove();
                           // }

                        }
                    })

                }else {
                    var content = $(iframeEle.contentWindow.document.body).html();
                        content = content.replace(reg, '<span style="background:yellow" class="search-content">' + searchKeyword + '</span>');

                     $(iframeEle.contentWindow.document.body).html(content);
                }

         }
         
         /**
          * [addCurSearchkey 添加当前项不同的颜色]
          * @Author   罗文
          * @DateTime 2017-09-29
          */
         function addCurSearchkey(clickIndex) {
             $(iframeEle.contentWindow.document.body).find('.search-content').each((index,item)=>{
                if($(item).hasClass('search-active')) {
                   $(item).removeClass('search-active');
                   $(item).css('border-bottom','none');
                }

                if(clickIndex == index) {
                    console.log('in');
                   $(item).addClass('search-active');
                   $(item).css('border-bottom','5px solid red');
                }
             })
         }

    }



    // ----------------------------------------------------------------下面是多个模态框-------------------------------------------------------


     // 设备切换
    showEquipement = function(){
        $vm.closeLibOper();
        $("#affeected").modal("hide");
        $("#equipement").modal("show").css("marginTop","150px");
        
        //获取用户自身的设备名和设备列表
        var deviceInfo = JSON.parse(GetDeviceInfo());
        $('#myEqu').text(deviceInfo.DeviceTitle);
        //获取列表
        
        //下面是配合winform异步获取数据
        //userid:localStorage.getItem('userId')
        ApiTransfer('get','/device/list',JSON.stringify({userid:localStorage.getItem('userId')}),(winResult)=>{
            winResult=JSON.parse(winResult)
            if(winResult.Success){     
                var itemList = winResult.Data.ItemList;
                if(itemList.length > 15) $("#equipement").modal("show").css("marginTop","70px");

                var listStr = '';
                itemList.forEach((item,index)=>{
                   var itemStr = JSON.stringify(item);
                   if(item.Title !== deviceInfo.DeviceTitle) {
                      listStr += `<label><input type="radio" name="equipList" itemdata='${itemStr}'>${item.Title}</label>`;
                   }
                })
                
                $('#equipList').empty();
                $('#equipList').append(listStr);
            }else {
               ShowMessage(winResult.Description)
            }
        });


        
  
    }
  
    //设备切换事件
    $('#changeEquip').on('click',function() {
            // 获取到目标设备信息
            if($('input:radio[name="equipList"]:checked').length == 0 ) {
                var message = new Message(); 
                message.showMessage('error','请选择切换的设备！');
                return;
            }; 

            var deviceInfo = JSON.parse(GetDeviceInfo());
            var clickDeviceData = JSON.parse($('input:radio[name="equipList"]:checked').attr('itemdata'));
            
            //要传入另一个设备的参数
            
            var data = {
                resourceid:$vm.$data.sectionid,
                fileid:$vm.$data.fileId,
                position:0,
                url:'',
                sourcedeviceid:null,
                targetdeviceid:clickDeviceData.Id,
                tag:'',
                state:1,
                resourcetype:2,
                userid:localStorage.getItem('userId'),
            }



            //获取资源的URL
                ApiTransfer('get','/file/stream',JSON.stringify({
                      fileid:data.fileid,
                      isPC:true,
                      userid:localStorage.getItem('userId')
                  }),(winResult)=>{
                    winResult=JSON.parse(winResult)
                    data.url = winResult.Data
                    data.sourcedeviceid = deviceInfo.DeviceId;

                    //发送设备切换的数据
                    changeDevice(data) 
                    
                });

              $("#equipement").modal("hide");
        })

    //发送数据
    function changeDevice(data) {
        ApiTransfer('post','/umengpush/changewindow',JSON.stringify(data),(winResult)=>{
            winResult = JSON.parse(winResult);

            var message = new Message();
            if(winResult.Code == 200) {
              message.showMessage('success','切换成功');
            }else {
              message.showMessage('error',winResult.Description)
            };
        });
    }