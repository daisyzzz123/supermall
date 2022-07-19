import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import LazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false
//添加事件总线对象
Vue.prototype.$bus=new Vue()

//安装toast插件
Vue.use(toast)//使用这一句就是默认去调用文件里面的install方法

// fastclick这个是用来解决移动端300ms的延迟,也可以直接禁止缩放,解决此问题
FastClick.attach(document.body)

//使用图片懒加载的插件
// Vue.use(VueLazyLoad) 这个是没有传配置的使用,也可以自己传配置对象
Vue.use(LazyLoad,{
  // 这里一般是使用require,不能使用import
  loading:require('./assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
