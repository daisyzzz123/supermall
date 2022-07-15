<!--  -->
<template>
  <div class="nav-bar">
    <!-- 这边要是具名插槽，到时候才能指定我替换的是哪一个插槽 -->
    <div class="left"><slot name="left"></slot></div>
    <div class="center"><slot name="center"></slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
export default {
  name:'NavBar',
  data () {
    return {
    };
  },

  components: {},

  computed: {},

  methods: {},

  //mounted: {}
}

</script>
<style scoped>
  .nav-bar{
    display: flex;
    height: 44px;
    line-height: 44px;
    text-align: center;
    box-shadow: 0 1px 1px rgba(100,100,100,.1);
  }
  .left,.right{
    width: 60px;
  }
  .center{
    flex: 1;
    /* text-align: center; */
  }
</style>