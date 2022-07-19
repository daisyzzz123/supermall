<!--  -->
<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item,index) in cartList" :key="index" :product="item"></cart-list-item>
    </scroll>
  </div>


</template>

<script>
import { mapGetters } from 'vuex'

import Scroll from 'components/common/scroll/Scroll'

import CartListItem from './CartListItem'

export default {
  name: 'CartList',
  data() {
    return {
    };
  },

  components: {
    Scroll,
    CartListItem
  },

  computed: {
    // 这个就是将vuex里面的getter.js里面的内容原封不动的搬到计算属性computed里面来
    // 有下面两种用法
    // ...mapGetters(['cartLength']) //这种是得跟gettes.js里面的方法名一样的
    ...mapGetters(['cartList'])
  },

  methods: {},

  activated() {
    // 这里要在进入活跃的时候给他刷新一次,不然在首页点击加入购物车后,scroll组件没有更新最新的高度,就会导致进入页面的时候不能滚动了
    this.$refs.scroll.refresh()
  },
}

</script>
<style scoped>
  .cart-list{
    height: calc(100vh - 44px - 49px - 44px);
  }
  .content{
    height: 100%;
    overflow: hidden;
  }
</style>