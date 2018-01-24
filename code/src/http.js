/**
 * 统一配置axios
 * 使用qs.stringify解决axios跨域问题
 * 配置axios请求类型为post时，使用qs.stringify来实现跨域访问，以及每次请求携带token
 * 配置请求成功后res，实现诸如登录失败，登录超时，账户密码错误和请求错误等拦截器
 */

import axios from 'axios'
import qs from 'qs'
import { MessageBox } from 'element-ui'
import router from './router/index'
import Vue from 'vue';

// import * as types from './store/types'

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = baseUrl;
// var baseUrl = 'http://demo.api.phei.kingchannels.cn';
// if(env == 'prod') {
  // var baseUrl = 'http://demo.api.phei.kingchannels.cn';
  // var baseUrl = 'http://api.phei.kingchannels.cn';
// }else {
//   var baseUrl = 'http://bridge.kingchannels.cn';
// }

// var platformName = 'phei_server_ezhiyuan';

// if (baseUrl) {
//   var regExp = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/g;
//   if (baseUrl.match(regExp)) {
//     // axios.defaults.baseURL = baseUrl+'/bridge';
//     axios.defaults.baseURL = baseUrl;
//   } else {
//     alert('域名配置不正确，请检查 \n文件路径：/static/config.js')
//   }
// } else {
//   alert('域名不存在，请检查 \n文件路径：/static/config.js')
// }

// axios.defaults.baseURL = baseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.withCredentials = true //axios跨域携带cookie的配置

// http request 拦截器

axios.interceptors.request.use(
  config => {
    // 如果方法为post，使用qs.stringify实现跨域访问


    if (config.method === 'post') {
      // console.log(1)
      // console.log(systemParams)
      // console.log(config.data)
      // if(env == 'prod') {
      // console.log(Object.assign({},config.data,systemParams))
        config.data = qs.stringify(Object.assign({},config.data,systemParams));
      //   return config;
      // }
      
      // 

      // if (!config.data.ApiName) {
      //   let urlArr = config.url.split(baseUrl)
      //   config.data.ApiName = urlArr[0];
      // }

      // if (!config.data.ApiName) {
      //   Message.error('请传入请求接口的ApiName')
      // }

      // config.data.PlatformName = platformName;
      // config.data.random = Math.random();
      // config.data.deviceToken = localStorage.deviceToken;

      // config.data = qs.stringify(config.data);


    } else if (config.method === 'get') {
      // console.log(2)
      // config.params = Object.assign({},config.params,systemParams);
      // if(env == 'prod') {
        config.params = Object.assign({},config.params,systemParams);
      //   return config;
      // }

      // if (!config.params.ApiName) {
      //   let urlArr = config.url.split(baseUrl)
      //   config.params.ApiName = urlArr[0];
      // }
      // if (!config.params.ApiName) {
      //   Message.error('请传入请求接口的ApiName')
      // }
      // config.params.random = Math.random();
      // config.params.PlatformName = platformName;

      // config.params.deviceToken = localStorage.deviceToken;


      // console.log(config.params)

    }

    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
/**
 * @DateTime  2017-05-08T09:19:43+0800
 * 拦截器也可以判定返回的response成功时的状态码进行拦截
 */
axios.interceptors.response.use(
  res => {
    // console.log(res.config._retry)
    // res.data.Code =34;
    if (res.data.Code == 17 && res.data.Description.indexOf('AccessToken错误') !== -1) { //连接超时
       res.data.Description = '您的登录已超时，请重新登录！';
       return res;
       // Vue.prototype.validAccessToken(()=>{
       //    systemParams.deviceToken = setDeviceToken();
       //    systemParams.accessToken = localStorage.accessToken;
       //    axios.request(res.config);
       // });
    } else { //请求成功
      return res;
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          // store.commit(types.LOGOUT);
          router.replace({
            path: 'login',
            query: { redirect: router.currentRoute.fullPath }
          })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    // return Promise.reject(error.response.data)
  });

export default axios;
