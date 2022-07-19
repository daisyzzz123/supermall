import Vue from 'vue'
import Vuex from 'vuex'
import {ADD_COUNTER,ADD_TO_CART} from './mutation-types'

// 1.安装插件
Vue.use(Vuex)

// 2.创建store对象
const store=new Vuex.Store({
  state:{
    cartList:[]
  },
  mutations:{
    // mutations唯一的目的就是修改state中的状态
    // mutations中的每个方法尽可能完成的事件比较单一一点
    [ADD_COUNTER](state,payLoad){
      payLoad.count++
    },
    [ADD_TO_CART](state,payLoad){
      state.cartList.push(payLoad)
    }
  },
  // 有异步操作或者有判断逻辑的,就不要放在mutations里面做,最好放在actions里面做
  actions:{
    addCart(context,payLoad){
      // payLoad新添加的商品
      // 1.查找之前的数组中是否有该商品
      // 以下两种方法都可以
      // let oldProduct=null
      // for(let item of state.cartList){
      //   if(item.iid===payLoad.iid){
      //     oldProduct=item
      //   }
      // }
      let oldProduct=context.state.cartList.find(item=>item.iid===payLoad.iid)

      // 2.判断oldProduct
      if(oldProduct){
        // oldProduct.count+=1
        // context.commit('addCounter',oldProduct)
        context.commit(ADD_COUNTER,oldProduct)
      }else{
        // 原本数组里面的对象是没有count这个属性的,就是这里给它添加上的
        payLoad.count=1
        // context.state.cartList.push(payLoad)
        // context.commit('addToCart',payLoad)
        context.commit(ADD_TO_CART,payLoad)
      }
      
    }
  }
})

// 3.挂载到vue实例上
export default store