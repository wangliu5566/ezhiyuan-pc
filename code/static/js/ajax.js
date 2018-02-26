
// var baseUrl="http://api.phei.kingchannels.cn";
var baseUrl="http://218.249.32.176:50680";
// var baseUrl="http://demo.api.phei.kingchannels.cn";

var env = "prod";    //dev  -- 开发环境   prod -- 生产环境
var deviceToken = '';

function setDeviceToken() {
    if(env == 'prod') {
        // deviceToken = GetDevicekToken();
        // localStorage.setItem('deviceToken',deviceToken);
        if(localStorage.deviceToken && localStorage.deviceToken !== '') {
           deviceToken = localStorage.deviceToken;
        }else {
           deviceToken = GetDevicekToken();
           localStorage.setItem('deviceToken',deviceToken);
        }
        // deviceToken = GetDevicekToken();
        // localStorage.setItem('deviceToken',deviceToken);
    }else{
        localStorage.setItem('deviceToken','abcdefghijklmn0123456789');
        deviceToken = localStorage.deviceToken;
    }
    return deviceToken;
}


//系统参数
var systemParams = {
    appId:'2',
    version:'1.0',
    deviceToken:deviceToken ? deviceToken : setDeviceToken(),
    timestamp:new Date().getTime(),
    appVersion:'1.0.0',
    accessToken:localStorage.accessToken
}
// console.log(JSON.stringify(systemParams))

//如果accessToken发生变化，立即更新
setInterval(()=>{
   systemParams.deviceToken = setDeviceToken();
   systemParams.accessToken = localStorage.accessToken;
},500)



