<!--  -->
<template>
  <nav-bar class="detail-nav">
    <div slot="left" class="back" @click="backClick">
      <img src="~assets/img/common/back.svg" alt="">
    </div>
    <div slot="center" class="title">
      <div v-for="(item,index) in titles" class="title-item" :class="{active:index===currentIndex}" @click="itemClick(index)">{{item}}</div>
    </div>
  </nav-bar>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'

export default {
  name: 'DetailNavBar',
  data() {
    return {
      titles:['商品','参数','评论','推荐'],
      currentIndex:0
    };
  },

  components: {
    NavBar
  },

  computed: {},

  methods: {
    itemClick(index){
      this.currentIndex=index
      this.$emit('titleClick',index)
    },
    backClick(){
      // 这两种方法都行，都可以回退
      // this.$router.go(-1) 
      this.$router.back()
    }
  },

  //mounted() {}
}

</script>
<style scoped>
  .title{
    display: flex;
    font-size: 13px;
  }
  .title-item{
    flex: 1;
  }
  .active{
    color: var(--color-tint);
  }
  .back img{
    margin-top: 12px;
  }
</style>