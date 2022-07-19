<!--  -->
<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <!-- 商品的列表 -->
    <cart-list></cart-list>
    <!-- 底部的汇总 -->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
  
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'

import {mapGetters} from 'vuex'

export default {
  name:'Shopcart',
  data () {
    return {
    };
  },

  components: {
    NavBar,
    CartList,
    CartBottomBar
  },

  computed: {
    // 这个就是将vuex里面的getter.js里面的内容原封不动的搬到计算属性computed里面来
    // 有下面两种用法
    // ...mapGetters(['cartLength']) //这种是得跟gettes.js里面的方法名一样的
    ...mapGetters({ //这种是可以自定义名字的
      length:'cartLength'
    })
  },

  methods: {
    // 还有一个就是将vuex里面的getter.js里面的内容原封不动的搬到方法属性methods里面来,就是...mapActions([]),用法和上面那种一样
    // 还有就是注意使用这个的时候也要记得在上面导入,import {mapActions} from 'vuex'
  },

  //mounted: {}
}

</script>
<style scoped>
  .nav-bar{
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 500;
    position: relative;
    z-index: 9;
  }
</style>