<!--  -->
<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl1" class="tab-control" v-show="isTabFixed"></tab-control>
    <!-- 这个:probe-type="3"前面不加:的话,它传出去就是一个字符串3,加了的话就可以是number3,而且驼峰要转成-的形式 -->
    <!-- 如果值是true或false的话,就可以不加上前面的:号,比如pull-up-load="true" 我实践证明好像还是得加上:号-->
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- 在我们需要监听一个组件的原生事件时，必须给对应的事件加上.native修饰符，才能进行监听 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>

</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'

import { getHomeMultidata, getHomeGooods } from 'network/home'
import {debounce} from 'common/utils'
import {backTopMixin} from 'common/mixin'


export default {
  name: 'Home',
  mixins:[backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': { page: 0, list: [] }
      },
      currentType: 'pop',
      // isShowBackTop:false, 弄到混入文件去了
      tabOffetTop:0,
      isTabFixed:false,
      saveY:0
    };
  },

  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    Scroll,
    TabControl,
    GoodsList,
  },

  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },

  methods: {
    /**
     * 事件监听相关方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop';
          break;
        case 1:
          this.currentType = 'new'
          break;
        case 2:
          this.currentType = 'sell'
          break;
      }
      // 这个是设置假的那个tabControl，让他跟真的那个保持一致，两个都要保持一致
      this.$refs.tabControl1.currentIndex=index
      this.$refs.tabControl2.currentIndex=index
    },
    // backClick(){   弄到混入文件去了
    //   // 使用这个this.$refs.scroll.scroll直接获取了子组件scroll对象
    //   // scrollTo(x,y,毫秒数)
    //   //第一种:这种方法是BackTop里面没有自己封装scrollTo(x,y,time)方法
    //   // this.$refs.scroll.scroll.scrollTo(0,0,500)

    //   // 第二种方法:BackTop里面封装scrollTo(x,y,time=300)方法,有给默认值,所以第三个参数可以不给
    //   this.$refs.scroll.scrollTo(0,0,500)

    // },
    contentScroll(position){
      // 1.判断BackTop是否显示
      this.isShowBackTop=(-position.y)>1000

      // 2.决定tabControl是否吸顶(position:fixed)
      this.isTabFixed=(-position.y)>this.tabOffetTop
    },
    loadMore(){
      this.getHomeGooods(this.currentType)
    },
    swiperImageLoad(){
      // 4.获取tabControl的offsetTop
      // 现在这个this.$refs.tabControl获取到的是组件,而组件没有offsetTop属性,所以得想办法拿到里面的元素,元素有这个属性
      // 所有组件都有一个属性$el:用于获取组件中的元素
      // 因为this.$refs.tabControl.$el.offsetTop现在他获取到的高度不太准确（图片还没加载出来就已经计算出高度了），
      // 所以需要在HomeSwiper.vue文件里面去监听轮播图的加载情况
      this.tabOffetTop=this.$refs.tabControl2.$el.offsetTop;
      // console.log(this.$refs.tabControl.$el.offsetTop);
    },
    //防抖函数抽取到了common文件夹里面utils.js
    // debounce(func,delay){
    //   let timer=null;
    //   return function(...args){
    //     if(timer) clearTimeout(timer);
    //     timer=setTimeout(()=>{
    //       func.apply(this,args)
    //     },delay)
    //   }
    //},
    /**
     * 网络请求相关方法
     */
    getHomeMultidata() {
      getHomeMultidata()
        .then(res => {
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
    },
    getHomeGooods(type) {
      const page = this.goods[type].page + 1;
      getHomeGooods(type, page)
        .then(res => {
          // console.log(res);
          //数组的push方法还有这个使用方法push(...res.data.list)，这样可以将后面的数组一个一个的塞到前面那个数组里面，相当于使用for循环例如：[3,4,1,2,3]
          //如果只是使用push(res.data.list)的话，就只是把一个数组塞进去当作一个元素，例如：[3,4,[1,2,3,]]
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;
          // BackTop里面封装finishPullUp方法,获取到数据之后要调用这个方法,不然上拉加载事件只会触发一次
          this.$refs.scroll.finishPullUp()
        })
    }
  },
  // 在这个组件一旦创建好就可以发送网络请求，所以写在生命周期函数created里面请求
  created() {
    //1.请求多个数据
    this.getHomeMultidata()
    //2.请求商品数据
    this.getHomeGooods('pop')
    this.getHomeGooods('new')
    this.getHomeGooods('sell')

    // //3.监听item里面的图片加载完成--第一种方法
    // this.$bus.$on('itemImageLoad',()=>{
    //   // 如果是要写在created()里面的话,在created里面有时候他的dom元素可能还没创建出来,所以你有时候可能是取不到dom元素的,
    //   // 一般要取到dom元素的最好写在mounted()生命周期函数里面
    //   // 所以如果一定要写在created()里面的话,前面最好要加上这个this.$refs.scroll && ,
    //   // 因为他有可能this.$refs.scroll对象还没有值,他们就调用了这个方法,就会报错
    //     this.$refs.scroll && this.$refs.scroll.refresh()
    // })
  },
  mounted() {
    //3.监听item里面的图片加载完成--第二种方法
    // 貌似实践证明,写在created里面和写在mounted里面好像是差不多的,没啥区别,都要加上这个this.$refs.scroll && 
    // 因为如果每一张图片加载完成都要refresh()刷新,性能会很差,所以需要使用防抖函数去优化
    const refresh=debounce(this.$refs.scroll.refresh,20);
    this.$bus.$on('homeItemImageLoad',()=>{
        refresh()
    })
    
  },
  activated() {
    // 这边为什么要再刷新？因为有时候切换回来的时候它会不能滚以及可能突然回到顶部了，而且最好刷新要写在跳转的前面
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0,this.saveY,0)
    
  },

  deactivated() {
    this.saveY=this.$refs.scroll.getScrollY()
  },
}

</script>
<!-- 加上这个scoped之后，下面写的样式只会对当前这个文件生效，要是没加这个的话，要是子组件的类名跟这个文件的类名重复的话，对所有的都起作用 -->
<style scoped>
#home {
  /* 滚动的第二种方案 padding-top: 44px;这一句是需要注释的，第一张方案不用注释这一句*/
  /* padding-top: 44px; */
  /* vh:viewport height 视口高度，100vh就是100%的视口 */
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* 下面这些没有用了是因为使用了better-scroll这个插件，它只会在指定的那个区域里面滚动，所以可以不设置以下的样式 */
  /* 在使用浏览器原生滚动时，为了让顶部导航栏不跟着一起滚动就需要设置下面这些属性 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
/* 因为使用了better-scroll这个插件,使用这个的话吸顶效果已经不起作用了,只能使用其它方法了 */
/* .tab-control { */
  /* 移动端一般都是支持这个属性的，但是pc端很多都不支持，所以pc端得使用其它方法实现这个效果，滚动到一定的位置后变成固定位置 */
  /* position: sticky;
  top: 44px;
  z-index: 9;
} */
/* 滚动的第一种方案 */
.content{
  overflow: hidden;
  /* 因为不同屏幕显示的高度是不一样的，所以我们不能写死高度，只能动态的设置高度，有两种方法，这种比较好 */
  /* 使用定位(子绝父相)，让它相对于顶部有44px，对底部有49px，这样中间剩下的空间刚好是我们需要的 */
  position: absolute;
  top: 44px;
  bottom: 49px;
}
/* 滚动的第二种方案 */
/* .content{ */
  /* 注意：calc(100% - 93px)，使用这个的时候，减号前面后面都要加上一个空格，不然不起效果 */
  /* height: calc(100% - 93px); */
  /* overflow: hidden; */
  /* margin-top: 44px; */
/* } */

  .tab-control{
    position: relative;
    /* 设置相对定位之后，z-index才起效果，因为z-index只对定位的元素起效果，而且相对定位是会保持在原来的位置 */
    z-index: 9;
  }
</style>