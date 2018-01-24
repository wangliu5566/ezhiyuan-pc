<template>
  <ul class="context-menu" :style="{left:conMenuLeft+'px',top:conMenuTop + 'px'}" v-show="conMenuShow">
      <li :class="menuListDisable.paste?'':'menu-disabled'" @click="closeMenuAndDo($event,'paste')">粘贴</li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      conMenuLeft: 100,
      conMenuTop: 100,
      menuListDisable: {
          paste: true,
      },
    }
  },
  props: [
    'conMenuShow',
    'contextEvent'
  ],
  methods: {
    //右键菜单操作
    closeMenuAndDo(e, operate) {
        e = e || this.contextEvent;
        if(e.target.className !== '') {
          this.$emit('resetContentMenuShow','');
          return;
        }

        switch (operate) {
            case 'paste':  //粘贴
                //添加到剪贴板
                if(env == 'prod') {
                  this.$emit('resetContentMenuShow',GetClip())
                }else {
                  this.$emit('resetContentMenuShow','这是粘贴操作')
                }
                // 将复制的文字交给后台      
                break;           
            default:
                // statements_def
                break;
        }

        
    },
    //右键操作,打开menu
    openContextMenu(e) {
       e = e || this.contextEvent;
       //目前只支持输入框右键粘贴
       if(e.target.nodeName != 'INPUT' && e.target.nodeName != 'input') {
          this.$emit('resetContentMenuShow','');
          return;
       };

       //目前只支持输入框
       this.conMenuLeft = e.pageX;
       this.conMenuTop = e.pageY;

       // 先将某些按钮止于不可用
       this.menuListDisable = {
          paste: true,
       }
    },
  },
  mounted(){
  },

  watch:{
    'conMenuShow':function(nv) {
       this.openContextMenu(this.contextEvent);
    }
  }
}

</script>
<style lang="less">


</style>
