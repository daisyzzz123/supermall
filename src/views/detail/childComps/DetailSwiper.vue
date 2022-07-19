<!-- 详情页轮播图 -->
<template>
  <swiper class="detail-swiper">
    <swiper-item v-for="item in topImages">
      <img :src="item" alt="" class="imges">
    </swiper-item>
  </swiper>

</template>

<script>
// 这边之所以可以一起导入，是因为swiper文件夹有一个index.js统一导出
import { Swiper, SwiperItem } from 'components/common/swiper/index'


export default {
  name: 'DetailSwiper',
  props: {
    topImages: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    };
  },

  components: {
    Swiper,
    SwiperItem
  },

  computed: {},

  methods: {},

  //mounted() {}
}

</script>
<style scoped>
  .detail-swiper {
    height: 300px;
    overflow: hidden;
  }
  .imges{
    width: 100%;
    height: 100%;
  }
</style>