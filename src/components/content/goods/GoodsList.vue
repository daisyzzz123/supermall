<!--  -->
<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :goodsItem="item"></goods-list-item>
  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem'

export default {
  name:'GoodsList',
  props:{
    goods:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data () {
    return {
    };
  },

  components: {
    GoodsListItem
  },

  computed: {},

  methods: {},

}

</script>
<style scoped>
  .goods{
    display: flex;
    /* 要让它一行显示两个的话，就得在GoodsListItem里面先设置宽度，然后再写flex-wrap: wrap;让他换行 */
    flex-wrap: wrap;
    /* 这个是让两个均等分剩余的空间 */
    justify-content: space-around;
    padding: 2px;
  }
</style>

