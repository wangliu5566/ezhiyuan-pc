function token(obj,secret){
          var keyArr = [];
          var objStr = ''; 
          if(obj instanceof Object && !(obj instanceof Array)){
             for(var k in obj){
                keyArr.push(k)
             }; //按键排列
             keyArr.sort()
             
             for(var i= 0;i < keyArr.length ; i++){
              for(var j in obj){
                if(j == keyArr[i]){
                  keyArr[i] = {};
                       keyArr[i][j] = obj[j] 
                }
              }
             }
             var tokeyStr = '';
             keyArr.forEach(function(item,index){
                   for(var m in item){
                      if(index !== keyArr.length-1){
                      tokeyStr += (m+'='+item[m])
                     }else{
                      tokeyStr += (m+'='+item[m])
                     }
                   }
             })

             for(var n in obj){
                objStr += (n+'='+obj[n]+'&')
             }



             if(secret){
              return {
                secret:secret,
                url:objStr+"token="+hex_sha1(tokeyStr+secret),
                token:hex_sha1(tokeyStr+secret),
                params:objStr.slice(0,-1)
              };
             }else{
              return {
                url:objStr+"token="+hex_sha1(tokeyStr),
                token:hex_sha1(tokeyStr),
                params:objStr.slice(0,-1)
              }
             }

          }else{
             return "请传入一个对象！"
          } 
        }

