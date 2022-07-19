<!-- 详情页 -->
<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <!-- 注意：使用scroll组件的时候一定要给一个高度 -->
    <scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">
      <!-- 属性： topImages 传入值：top-images，驼峰要转成-分割的，不然可能会出错 -->
      <detail-swiper v-if="topImages != ''" :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <!-- 在我们需要监听一个组件的原生事件时，必须给对应的事件加上.native修饰符，才能进行监听 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>

    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>

    <!-- <toast :message="message" :isShow="isShow"></toast> -->
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
// import Toast from 'components/common/toast/Toast'


import { getDetail, getRecommend, Goods, Shop, GoodsParam } from 'network/detail'
import { debounce } from 'common/utils'
import {backTopMixin} from 'common/mixin'

export default {
  name: 'Detail',
  mixins:[backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      currentIndex:0,
      // isShowBackTop:false 弄到混入文件去了
      // message:'',
      // isShow:false
    };
  },

  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    // Toast
  },

  computed: {},

  methods: {
    // 这边这个方法是监听调用DetailGoodsInfo.vue里面发射出来的事件
    imageLoad() {
      this.$refs.scroll.refresh()

      // 实现点击详情页顶部的导航栏可以跳转到相应的位置
    // 这个要写在获取到数据之后，不能写到mounted里面，因为那时候mounted可能都还没有数据
    // 但是呢，赋值完数据之后，还是等一会他才能更新渲染出来,所以我们需要用到this.$nextTick(() => {})，
    // 这个方法的作用是等到真正更新渲染完成后去回调一次里面的那个回调函数
    // 而且这些都要写在获取详情页数据的方法里面，写在其它地方都不行
    // 但是根据最新的数据，对应的dom是已经被渲染出来了，但是图片依然是没有加载完（目前获取到的offsetTop是不包含图片高度的）
    // 一般offsetTop值不对的时候，都是因为图片问题
    // 这边是监听所有图片都加载完的方法，所以在这边使用是没有问题的
      this.themeTopYs=[]
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      console.log(this.themeTopYs);

    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    // 这个是实现滑动内容与详情页顶部导航栏的联动效果
    contentScroll(position){
      // 1.获取y值
      const positionY=-position.y
      // 2.用positionY和主题中的值进行对比
      let length=this.themeTopYs.length
      for(let i=0;i<length;i++){
        if(this.currentIndex!==i && ((i<length-1 && positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1]) || (i===length-1 && positionY>=this.themeTopYs[i]))){
          this.currentIndex=i
          this.$refs.nav.currentIndex=this.currentIndex
        }
      }

      // 1.判断BackTop是否显示  这一句话不能抽离到混入文件去,因为methods里面的具体的方法只会覆盖,不会合并,其它的生命周期函数可以合并
      this.isShowBackTop=(-position.y)>1000 

    },
    // backClick(){  弄到混入文件去了
    //   // 使用这个this.$refs.scroll.scroll直接获取了子组件scroll对象
    //   // scrollTo(x,y,毫秒数)
    //   //第一种:这种方法是BackTop里面没有自己封装scrollTo(x,y,time)方法
    //   // this.$refs.scroll.scroll.scrollTo(0,0,500)

    //   // 第二种方法:BackTop里面封装scrollTo(x,y,time=300)方法,有给默认值,所以第三个参数可以不给
    //   this.$refs.scroll.scrollTo(0,0,500)

    // }

    addToCart(){
      // 1.获取购物车需要展示的信息
      const product={}
      product.image=this.topImages[0]
      product.title=this.goods.title
      product.desc=this.goods.desc
      product.price=this.goods.realPrice
      product.iid=this.iid
      // 2.将商品添加到购物车中
      // 这个官方规定不要直接修改state里面的值,最好通过mutations来修改state里面的值,所以下面这句不建议这么写
      // this.$store.cartList.push(product)
      // 这个是使用mutations来实现的,但是因为里面有判断逻辑,所以又给写到actions里面去了,所以这边注释掉
      // this.$store.commit('addCart',product)
      // 写在actions的使用方法
      this.$store.dispatch('addCart',product).then(res=>{
        // this.isShow=true
        // this.message=res
        // setTimeout(()=>{
        //   this.isShow=false
        //   this.message=''
        // },1500)
        this.$toast.show(res,1500)
      })
    }
  },

  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求详情页的数据
    getDetail(this.iid).then(res => {
      // console.log(res);
      const data = res.result
      // 1.获取顶部的轮播图数据
      this.topImages = data.itemInfo.topImages
      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 3.获取店铺信息
      this.shop = new Shop(data.shopInfo)
      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo
      // 5.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      // 6.取出评论信息
      if (data.rate.cRate != 0) {
        this.commentInfo = data.rate.list[0]
      }

    // 实现点击详情页顶部的导航栏可以跳转到相应的位置
    // 这个要写在获取到数据之后，不能写到mounted里面，因为那时候mounted可能都还没有数据
    // 但是呢，赋值完数据之后，还是等一会他才能更新渲染出来,所以我们需要用到this.$nextTick(() => {})，
    // 这个方法的作用是等到真正更新渲染完成后去回调一次里面的那个回调函数
    // 而且这些都要写在获取详情页数据的方法里面，写在其它地方都不行
    // 但是根据最新的数据，对应的dom是已经被渲染出来了，但是图片依然是没有加载完（目前获取到的offsetTop是不包含图片高度的），所以写在这里也不太对
    // 一般offsetTop值不对的时候，都是因为图片问题
    // this.$nextTick(() => {
    //   this.themeTopYs=[]
    //   this.themeTopYs.push(0)
    //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    //   console.log(this.themeTopYs);
    // })
    })
    
    // 3.获取推荐信息
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list
    })



    

  },

  mounted() {
    //3.监听item里面的图片加载完成--第二种方法
    // 貌似实践证明,写在created里面和写在mounted里面好像是差不多的,没啥区别,都要加上这个this.$refs.scroll && 
    // 因为如果每一张图片加载完成都要refresh()刷新,性能会很差,所以需要使用防抖函数去优化
    const refresh = debounce(this.$refs.scroll.refresh, 20);
    this.$bus.$on('detailItemImageLoad', () => {
      refresh()
    })
  },
}

</script>
<style scoped>
/* 这个的样式是用来隐藏详情页里面的底部tab栏，这是一种方法，还有一种更好点的方法，就是在路由zhong设置meta，在App.vue中使用v-if */
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

/* 这个给scroll给定高度有两种方法，另一种见首页，有写 */
.content {
  /* 注意要加上这一句overflow: hidden;不然鼠标也可以滚动,就会看起来非常奇怪 */
  overflow: hidden;
  /* 注意：减号前后一定要加空格，不然不起效果 */
  /* 而且要使用100%正确的话，要给父元素加上height: 100vh;不然100%就是内容撑开的那些高度了，就还是不能滚动的 */
  height: calc(100% - 44px - 49px);
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>