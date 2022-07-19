<!--  -->
<template>
  <div class="bottom-bar">
    <!-- 要监听到组件的点击的话,一定要加上.native,比如@click.native="" -->
    <check-button class="select-all" :is-checked="isSelectAll" @click.native="checkClick"></check-button>
    <span>全选</span>
    <span class="total-price">合计: ¥{{ totalPrice }}</span>
    <span class="buy-product" @click="calcClick">去结算({{ cartLength }})</span>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'

export default {
  name: 'CartBottomBar',
  data() {
    return {
    };
  },

  components: {
    CheckButton
  },

  computed: {
    totalPrice() {
      return this.$store.state.cartList.filter(item => item.checked).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    cartLength() {
      return this.$store.state.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      if (this.$store.state.cartList.length === 0) return false
      // 下面两种方法都可以
      // return !(this.$store.state.cartList.filter(item=>!item.checked).length)  //数字也可以取反,得到的也是true或false
      return !(this.$store.state.cartList.find(item => !item.checked))
    }
  },

  methods: {
    checkClick() {
      // if(this.isSelectAll){ //全部选中
      //   this.$store.state.cartList.forEach(item => {
      //     item.checked=false
      //   });
      // }else{
      //   this.$store.state.cartList.forEach(item => {
      //     item.checked=true
      //   });
      //}
      // 这个是上面的简写
      let flag=!this.isSelectAll
      this.$store.state.cartList.forEach(item => { item.checked = flag })
    },
    calcClick(){
      if (this.$store.state.cartList.length === 0 || !(this.$store.state.cartList.find(item => item.checked))) {
        this.$toast.show('请选择商品后结算',1500)
      }
      
    }
  },

  //mounted() {}
}

</script>
<style scoped>
.bottom-bar {
  width: 100%;
  height: 44px;
  background-color: #eee;
  position: fixed;
  bottom: 49px;
  left: 0;
  box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
  font-size: 14px;
  color: #888;
  line-height: 44px;
  padding-left: 35px;
  box-sizing: border-box;
}

.bottom-bar .select-all {
  position: absolute;
  line-height: 0;
  left: 12px;
  top: 13px;
}

.bottom-bar .total-price {
  margin-left: 15px;
  font-size: 16px;
  color: #666;
}

.bottom-bar .buy-product {
  background-color: orangered;
  color: #fff;
  width: 100px;
  height: 44px;
  text-align: center;
  line-height: 44px;
  float: right;
}
</style>