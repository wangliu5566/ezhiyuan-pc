<template>
  <div class="upadate-main bind-code">
    <div class="bind-content">
     <!--  <p><el-button size="small" style="margin-right:50px" @click="backToPerson">返 回</el-button></p> -->
      <h4>已绑定机构</h4>
      <ul v-if="userData.ExtendData.OrganizationTitle && userData.ExtendData.OrganizationTitle !== ''">
        <li v-for="(item,index) in userData.ExtendData.OrganizationTitle.split(',')"><span>{{item}}</span>  
          <!-- <span @click="reBind(item.Id)">解绑 &nbsp;</span> -->
        </li>
      </ul>

      <ul v-else>
        <li>暂未绑定任何机构</li>
      </ul>

      <p v-if="!isAddOrganShow" class="bind-add-show">
        <el-button 
        size="small" 
        type="primary" 
        style="float:right;margin-right:10px;width: 80px;padding:9px"
        @click="isAddOrganShow = true"
        ><i class="el-icon-plus"></i>绑定机构</el-button>
        <el-button size="small"  @click="backToPerson">返 回</el-button>
      </p>
      <p v-else>
        <el-input size="small" v-model="code" placeholder="请输入验证码"></el-input>
        <el-button size="small" type="primary" @click="BindOrganizeCode" style="margin-left:10px">绑定</el-button>
        <el-button size="small" @click="isAddOrganShow = false">取消</el-button>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      code:'',
      userData:{
        ExtendData:{}
      },
      isAddOrganShow:false
    }
  },
  methods:{
    /**
     * [getUserDetail 获取用户详情]
     * @Author   罗文
     * @DateTime 2017-11-30
     * @return   {[type]}   [description]
     */
    getUserDetail() {
       this.$http.get("/User/Detail", {
            params:{
              id:this.userId,
            }
          })
          .then((res) => {
            if (res.data.Success) {
              console.log(res.data)
              this.userData = res.data.Data;
            }else{
              this.$message.warning(res.data.Description);
            }
        })
     },

     /**
      * [BindOrganizeCode 绑定验证码]
      * @Author   罗文
      * @DateTime 2017-11-30
      */
  	 BindOrganizeCode() {
        if(this.code == '') {
           this.$message.error('请输入验证码！');
           return;
        }

        this.$http.post("/User/BindOrganization", {
            validateCode:this.code,
            userId: this.userId
        })
        .then((res) => {
          if (res.data.Success) {
            this.$message.success(res.data.Description);
            this.getUserDetail();
            this.code = '';
            this.isAddOrganShow = false;
          }else {
            this.$message.error(res.data.Description);
          }
        })
     },
     
     /**
      * [reBind 解绑机构]
      * @Author   罗文
      * @DateTime 2017-11-30
      * @return   {[type]}   [description]
      */
     reBind(id) {
       this.$http.post("/UserOrganization/Delete", {
              organizationId:id,
              userId:this.userId
            })
          .then((res) => {
            if (res.data.Success) {
              this.getUserDetail();
            }else{
              this.$message.error(res.data.Description);
            }
        })
     },
     
     /**
      * [backToPerson 返回按钮]
      * @Author   罗文
      * @DateTime 2017-12-03
      * @return   {[type]}   [description]
      */
     backToPerson() {
        this.$router.push('/PersonalCenter');
     }
  },
  beforeCreate() {
    //设置当前窗口
    if(env == 'prod') {
      SetWidthHeight(500,410);
      SetFormTitle('绑定机构');
    }
  },
  mounted(){
     this.userId = this.$route.query.id;
     this.getUserDetail();
  },
}

</script>
<style lang="less" scoped>
   .bind-content {
      margin: 40px auto 0;
      width: 90%;
      height: 100%;
      overflow: hidden;
      button {
        width: 80px;
      };

      p {
        margin: 15px 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      };

      ul {
        margin: 10px auto;
        overflow-x: hidden;
        width:70%;
        height: 50%;

        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 40px;
          span:nth-of-type(2) {
            color:#1c517d;
            cursor: pointer;
          };
        }
      }

      .bind-add-show {
          display: flex;
          justify-content: flex-end;
          align-items: center;
      }
   }
   // .bind-code-title {
   //    display: flex;
   //    justify-content: center;
   //    align-items: center;
   //    height: 87%;
   //    width: 100%;
   //    p {
   //      display: flex;
   //      justify-content: flex-start;
   //      align-items: center;
   //      width: 80%;
   //      span {
   //        display: inline-block;
   //        width: 40%;
   //      }
   //    }
   // }

   // .bind-code-btns {
   //    display: flex;
   //    justify-content: flex-end;
   //    align-items: center;
   //    button {
   //      width: 80px;
   //    }
   // }

</style>
