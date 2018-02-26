


//解决document.elementFromPoint 获取元素为null的bug
var check = false,
    isRelative = true;
    
function elementFromPoint1(x, y,element) {
    if (!document.elementFromPoint) return null;
    if (!check) {
        var sl;
        if ((sl = element.scrollTop) > 0) {
            isRelative = (document.elementFromPoint(0, sl + window.innerHeight - 1) == null);
        } else if ((sl = element.scrollLeft) > 0) {
            isRelative = (document.elementFromPoint(sl + window.innerWidth - 1, 0) == null);
        }
        check = (sl > 0);
    }
    if (!isRelative) {
        x += element.scrollLeft;
        y += element.scrollTop;
    }
    return document.elementFromPoint(x, y);
}



//清除用户数据
function clearLocalStorage() {
  console.log('clear')
   localStorage.removeItem('userId');
   localStorage.removeItem('userInfo');
   localStorage.removeItem('accessToken');
   localStorage.removeItem('account');
   localStorage.removeItem('password');
   ChangeShoppingCartCount(0);
}


//如果用户自动登录了，保存用户数据
if(env == 'prod') {
   var winResult = GetUserInfo();

   if(winResult !== '')  {
      winResult = JSON.parse(winResult);
      if(winResult.Success) {
         localStorage.setItem('userId',winResult.Data.Id);
         localStorage.setItem("userInfo",JSON.stringify(winResult.Data));
         //保存accessToken
         localStorage.setItem('accessToken',winResult.Data.ExtendData.AccessToken);
         localStorage.setItem('accessTokenExpTime',winResult.Data.ExtendData.AccessTokenExpirationTime);
         localStorage.setItem('account',winResult.Data.Account);
         localStorage.setItem('passWord',winResult.Data.PassWord);
      }else {
         clearLocalStorage();
      }
   }else {
       clearLocalStorage();
       if(ChangeShoppingCartCount) ChangeShoppingCartCount(0);
   }
}


//验证是否已经保存用户数据
function volidUserId(isDownload=false) {

   if(!localStorage.getItem('userId') || localStorage.getItem('userId') == '') {
       if(env== 'prod')OpenLoginForm();

       if(env== 'dev')alert('没有登录')
       return false;
   }


   //这个时候用户是已经登录过的，验证该用户是否有激活，是否已经绑定第三方等，主要区分第三方用户
   if(isDownload) {
      // //判断是否有用户数据，根据用户数据判断是否需要提示
      // if(!localStorage.getItem('userInfo')) {
      //    //这里还需要判断是否是第三方用户，如果是则打开绑定手机，如果不是则打开个人中心
      //   var allUserInfo = GetAllUser();
      //   allUserInfo = JSON.parse(allUserInfo);
      //   var data = {};

      //   allUserInfo.forEach((item,index)=>{
      //       if(item.Id == localStorage.getItem('userId')) {
      //          data = item;
      //       }
      //   })

      //   localStorage.setItem('userInfo',JSON.stringify(data));
      // }


      // var userInfo = localStorage.getItem('userInfo');
      
      // userInfo = JSON.parse(userInfo);
      // //判断是不是第三方
      // if(!userInfo.MobileNumber && !userInfo.Email) {
      //   OpenForm(480,500,'/index.html#/userCenter','个人信息');
      //   localStorage.setItem('fromWhere',2);
      //   return false;
      // }else {
      //   //此时不是第三方，验证有没有激活码或激活码是否过期
      //   if(!userInfo.ActivatedCode && userInfo.UserType != 1) {
      //      OpenForm(480,500,'/index.html#/userCenter','个人信息');
      //      localStorage.setItem('fromWhere',1);
      //      return false;
      //   }
      // }
   }

   return true;
}


document.addEventListener('selectstart', (e)=>{
     e.preventDefault();
}, false)

document.addEventListener('click', ()=>{
     if(env == 'prod') CloseMenueStrip();
}, false)

document.addEventListener('contextmenu', (e)=>{
     e.preventDefault();
}, false)