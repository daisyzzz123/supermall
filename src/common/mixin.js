import { debounce } from 'common/utils'
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  // 因为Home.vue以及Detail.vue也都要定义这个变量itemImgListener,所以我们最好写在这边写上,这样那两个文件里面就不需要定义这个变量了
  // 而且不仅可以写data和mounted,还可以混入很多东西,比如methods以及components等
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    //3.监听item里面的图片加载完成--第二种方法
    // 貌似实践证明,写在created里面和写在mounted里面好像是差不多的,没啥区别,都要加上这个this.$refs.scroll && 
    // 因为如果每一张图片加载完成都要refresh()刷新,性能会很差,所以需要使用防抖函数去优化
    const refresh = debounce(this.$refs.scroll.refresh, 20);
    this.itemImgListener = () => { refresh() }
    this.$bus.$on('detailItemImageLoad', this.itemImgListene)

  },
}

// 因为点击返回顶部那个功能很多地方都有用,所以就给他抽离到mixin文件,使用混入方法
export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      // 使用这个this.$refs.scroll.scroll直接获取了子组件scroll对象
      // scrollTo(x,y,毫秒数)
      //第一种:这种方法是BackTop里面没有自己封装scrollTo(x,y,time)方法
      // this.$refs.scroll.scroll.scrollTo(0,0,500)

      // 第二种方法:BackTop里面封装scrollTo(x,y,time=300)方法,有给默认值,所以第三个参数可以不给
      this.$refs.scroll.scrollTo(0, 0, 500)

    }
  },
  components: {
    BackTop
  }
}