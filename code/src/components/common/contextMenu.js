import contextMenu from './contextMenu.vue'
const context ={
    install:function (Vue) {
        Vue.component('contextMenu',contextMenu)
    }
}
export default context