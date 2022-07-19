import Vue from 'vue'
import Vuex from 'vuex'
import { ADD_COUNTER, ADD_TO_CART } from './mutation-types'
import getters from './getters'

// 1.安装插件
Vue.use(Vuex)

// 2.创建store对象
const state = {
  cartList: []
}

const store = new Vuex.Store({
  state,
  mutations: {//这个mutations也可以单独的抽离到js文件中去,这边就先不抽离了
    // mutations唯一的目的就是修改state中的状态
    // mutations中的每个方法尽可能完成的事件比较单一一点
    [ADD_COUNTER](state, payLoad) {
      payLoad.count++
    },
    [ADD_TO_CART](state, payLoad) {
      // 让他默认选中
      payLoad.checked = true
      state.cartList.push(payLoad)
    }
  },
  // 有异步操作或者有判断逻辑的,就不要放在mutations里面做,最好放在actions里面做
  actions: {//这个actions也可以单独的抽离到js文件中去,这边就先不抽离了
    addCart(context, payLoad) {
      // payLoad新添加的商品
      // 1.查找之前的数组中是否有该商品
      // 以下两种方法都可以
      // let oldProduct=null
      // for(let item of state.cartList){
      //   if(item.iid===payLoad.iid){
      //     oldProduct=item
      //   }
      // }
      return new Promise((resolve, reject) => {
        let oldProduct = context.state.cartList.find(item => item.iid === payLoad.iid)

        // 2.判断oldProduct
        if (oldProduct) {//数量加1
          // oldProduct.count+=1
          // context.commit('addCounter',oldProduct)
          context.commit(ADD_COUNTER, oldProduct)
          resolve('数量加1')
        } else {//添加新商品
          // 原本数组里面的对象是没有count这个属性的,就是这里给它添加上的
          payLoad.count = 1
          // context.state.cartList.push(payLoad)
          // context.commit('addToCart',payLoad)
          context.commit(ADD_TO_CART, payLoad)
          resolve('添加新商品')
        }
      })


    }
  },
  // 这个getters是已经单独的抽离到js文件中去了
  getters
})

// 3.挂载到vue实例上
export default store