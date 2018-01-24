<template>
  <div class="side-menu-main">
    <ul class="side-out">
      <li v-for="(item,index) in menuList" class="side-out-li" @mouseover="displayContent(index)">
        <span class="side-out-span">{{item.Title}}</span>
        <ul v-if="item.children?true:false" class="side-in" v-show="item.isOpenChildren">
           <li v-for="(ele,i) in item.children" class="side-in-li">
             <span class="side-in-span">{{ele.label}}</span>
            </li>
        </ul>
       </li>
     </ul>
     <!-- <el-menu1
      class="el-menu-vertical-demo">
        <template v-for="(item,index) in menuList">
           <template v-if="!item.children.length">
            <el-menu-item :name="item.path">
              <i  :type="item.icon" size="16"></i >
              {{ item.label }}
            </el-menu-item>
          </template>
          <template v-else>
            <el-submenu :name="item.path">
              <template slot="title">
                <i  :type="item.icon" size="16"></i >
                {{ item.label }}
              </template>
              <template v-for="(el,i) in item.children"  class="menu-two">
                <el-menu-item :name="el.path">
                  <i  :type="el.icon" size="16"></i >{{ el.label}}
                </el-menu-item>
              </template>
            </el-submenu>
         </template>
        </template>
    </el-menu> -->
    <!-- <Button @click="haha">haha</Button> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      
    }
  },
  props: [
    'menuList'
  ],
  methods: {
    //显示相应的子菜单
    displayContent(index){
      console.log(index)
      this.menuList.forEach((citem,cindex) => {
        citem.isOpenChildren = false;
        if(index == cindex){
          citem.isOpenChildren = true;
        }
      })
    },
    // haha(){
    //   console.log(this.menuList)
    // }
  },
  mounted(){
    
  }
}

</script>
<style lang="less">


</style>
