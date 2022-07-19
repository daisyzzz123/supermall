import Toast from './Toast'

const obj={}
//这个install函数在执行的时候会默认传过来一个参数,就是Vue
obj.install=function(Vue){
  // 这个不行是因为元素还没有挂载上去,Toast.$el的值是undefined
  // document.body.appendChild(Toast.$el)
  // 1.创建组件构造器
  const toastContrustor=Vue.extend(Toast)
  // 2.通过new的方式,根据组件构造器,可以创建出来一个组件对象
  const toast=new toastContrustor()
  // 3.将组件对象手动的挂载到某一个元素上
  toast.$mount(document.createElement('div'))
  // 4.这时候Toast.$el对应的就是我们上面创建出来的div
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast=toast
}

 export default obj