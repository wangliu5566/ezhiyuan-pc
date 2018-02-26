import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',redirect: '/Index'
    },
    {
      path: '/Index',
      name:'首页',
      component: resolve => require(['@/components/Index'], resolve)
    },
    //登录页面
    {
      path: '/Login',
      name:'登录',
      component: resolve => require(['@/components/loginIndex/Login'], resolve)
    },
    //注册页面
    {
      path: '/Register',
      name:'注册',
      component: resolve => require(['@/components/loginIndex/Register'], resolve)
    },
    //忘记密码页面
    {
      path: '/ForgetPsd',
      name:'忘记密码',
      component: resolve => require(['@/components/loginIndex/ForgetPsd'], resolve)
    },
    //修改密码页面
    {
      path: '/EditPassword',
      name:'修改密码',
      component: resolve => require(['@/components/loginIndex/EditPassword'], resolve)
    },
     //个人资料
    {
      path: '/PersonalCenter',
      name:'个人资料',
      component: resolve => require(['@/components/modal/PersonalCenter'], resolve)
    },
    {
      path: '/BindOrganizor',
      name:'绑定机构',
      component: resolve => require(['@/components/modal/BindOrganizor'], resolve)
    },
    //E智元
    {
      path: '/Eresource',
      name:'E知元首页',
      component: resolve => require(['@/components/productIndex/Eresource'], resolve),
    },
    {
      path: '/KnowledgeNav',
      name:'知识导航',
      component: resolve => require(['@/components/productIndex/KnowledgeNav'], resolve),
      beforeEnter: (to, from, next) => {
        if(localStorage.productType == 2) {
           next('/IntKnowledgeWrap')
        }else {
           next();
        }
      },
    },
    {
      path: '/HotTop',
      name:'热度排行',
      component: resolve => require(['@/components/productIndex/HotTop'], resolve),
    },
    {
      path: '/ThematicKnowledge',
      name:'专题知识',
      component: resolve => require(['@/components/productIndex/ThematicKnowledge'], resolve),
      beforeEnter: (to, from, next) => {
        if(localStorage.productType == 2) {
           next('/SectionWrap')
        }else {
           next();
        }
      },
    },
    //物联网知识导航
    {
      path: '/IntKnowledgeWrap',
      component: resolve => require(['@/components/productIndex/internetKnowledgeNav/IntKnowledgeWrap'], resolve)
    },
    //物联网章节
    {
      path: '/SectionWrap',
      component: resolve => require(['@/components/productIndex/internetSection/SectionWrap'], resolve)
    },
    //互联网+知识导航
    {
      path: '/InternetPlusWrap',
      component: resolve => require(['@/components/productIndex/internetPlusNav/InternetPlusWrap'], resolve)
    },
    //搜索结果页
    {
      path: '/ChoiceSearchList',
      name:'精选章节列表',
      component: resolve => require(['@/components/searchResult/ChoiceSearchList'], resolve)
    },
    {
      path: '/ElectronicSearchList',
      name:'电子标准搜索列表',
      component: resolve => require(['@/components/searchResult/ElectronicSearchList'], resolve)
    },
    {
      path: '/KnowledgeSearchList',
      name:'知识元搜索列表',
      component: resolve => require(['@/components/searchResult/KnowledgeSearchList'], resolve)
    },
    {
      path: '/OAsearchList',
      name:'OA论文搜索列表',
      component: resolve => require(['@/components/searchResult/OAsearchList'], resolve)
    },
    {
      path: '/CircuitSearchList',
      name:'电路设计包搜索列表',
      component: resolve => require(['@/components/searchResult/CircuitSearchList'], resolve)
    },
    {
      path: '/KnowledgeDetailMain',
      name:'电路设计包搜索列表',
      component: resolve => require(['@/components/productIndex/hotKnowledgeDetail/KnowledgeDetailMain'], resolve)
    },
    //详情
    {
      path: '/ExplicitWordDetail',
      // beforeEnter: (to, from, next) => {
      //     if(!to.query.expId) {
      //        alert('未传入知识元id');
      //        next({ path: from.fullPath })
      //     }else {
      //        next();
      //     }
      //   },
      name:'知识元详情',
      component: resolve => require(['@/components/ExplicitWordDetail'], resolve)
    },
    {
      path: '/circuitPackage',
      name: '电子电路包详情',
      component: resolve => require(['@/components/detail/CircuitPackage.vue'], resolve)
    },{
      path: '/eStandard',
      name: '电子标准详情',
      component: resolve => require(['@/components/detail/eStandard.vue'], resolve)
    },{
      path: '/paperDetail',
      name: '论文详情',
      component: resolve => require(['@/components/detail/PaperDetail.vue'], resolve)
    },{
      path: '/section',
      name: '章节详情',  
      component: resolve => require(['@/components/detail/Section.vue'], resolve)
    },
    //列表
    {
      path: '/paperList',
      name: '论文列表',
      component: resolve => require(['@/components/list/PaperList.vue'], resolve)
    },{
      path: '/knowledgeList',
      name: '知识元列表',
      component: resolve => require(['@/components/list/knowledgeList.vue'], resolve)
    },{
      path: '/ElectronicList',
      name: '电子标准列表',
      component: resolve => require(['@/components/list/ElectronicList.vue'], resolve)
    },
    //个人中心
    {
      path: '/collect',
      name: '我的收藏',
      component: resolve => require(['@/components/person/Collect.vue'], resolve)
    },{
      path: '/history',
      name: '阅读历史',
      component: resolve => require(['@/components/person/History.vue'], resolve)
    },{
      path: '/information',
      name: '消息中心',
      component: resolve => require(['@/components/person/Information.vue'], resolve)
    },
    {
      path: '/shoppingCar',
      name: '购物车',
      component: resolve => require(['@/components/person/ShoppingCar.vue'], resolve)
    },{
      path: '/orderWrap',
      name: '订单',
      component: resolve => require(['@/components/person/OrderWrap.vue'], resolve)
    },{
      path: '/confirmOrder',
      name: '确定订单',
      component: resolve => require(['@/components/person/ConfirmOrder.vue'], resolve)
    },{
      path: '/downLoadManager',
      name: '下载管理',
      component: resolve => require(['@/components/person/DownLoadManager.vue'], resolve)
    },{
      path: '/Update',
      name: '检查更新',
      component: resolve => require(['@/components/modal/Update.vue'], resolve)
    },{
      path: '/help',
      name: '帮助与反馈',
      component: resolve => require(['@/components/modal/Help.vue'], resolve)
    },{
      path: '/CopyRight',
      name: '专题知识版权声明',
      component: resolve => require(['@/components/modal/CopyRight.vue'], resolve)
    },{
      path: '/ClearCache',
      name: '清除缓存',
      component: resolve => require(['@/components/modal/ClearCache.vue'], resolve)
    },{
      path: '/PayMethods',
      name: '支付方式',
      component: resolve => require(['@/components/modal/PayMethods.vue'], resolve)
    },{
      path: '/PaySuccess',
      name: '支付成功',
      component: resolve => require(['@/components/modal/PaySuccess.vue'], resolve)
    },{
      path: '/InformationDetail',
      name: '消息详情',
      component: resolve => require(['@/components/modal/InformationDetail.vue'], resolve)
    },{
      path: '/FillInvoice',
      name: '填写发票',
      component: resolve => require(['@/components/modal/FillInvoice.vue'], resolve)
    },{
      path: '/InvoiceDetail',
      name: '发票详情',
      component: resolve => require(['@/components/modal/InvoiceDetail.vue'], resolve)
    },{
      path: '/ForceUpdate',
      name: '强制更新',
      component: resolve => require(['@/components/modal/ForceUpdate.vue'], resolve)
    },
      
  ]
})
