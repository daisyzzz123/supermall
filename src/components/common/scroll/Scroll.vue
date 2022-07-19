<!--  -->
<template>
<!-- 注意:使用BScroll的时候要设置高度才可以,(还有要有两层div包裹,具体见官网) -->
  <!-- ref这个属性如果是绑定在组件中的那么通过this.$refs.refname获取到的是一个组件对象 -->
  <!-- ref这个属性如果是绑定在普通的元素中的那么通过this.$refs.refname获取到的是一个元素对象 -->
  <div class="wrapper" ref="wrapper">
      <div class="content">
        <slot></slot>
      </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name:'Scroll',
  props:{
    probeType:{
      type:Number,
      default:0
    },
    pullUpLoad:{
      type:Boolean,
      default:false
    }
  },
  data () {
    return {
      scroll:null
    };
  },

  components: {},

  computed: {},

  methods: {
    //这边封装的这几个方法前面最好要加上这个this.scroll && ,因为他有可能this.scroll对象还没有值,他们就调用了这个方法,就会报错
    scrollTo(x,y,time=300){
      this.scroll && this.scroll.scrollTo(x,y,time)
    },
    finishPullUp(){
      this.scroll && this.scroll.finishPullUp();
    },
    refresh(){
      // console.log('----');
      this.scroll && this.scroll.refresh()
    },
    getScrollY(){
      return this.scroll?this.scroll.y:0;
    }
  },

  // updated() {
  //   // 最好不要用这种方式document.querySelector('.wrapper')使用，因为很多地方可能类名会起的一样，导致不起效果
  //   this.scroll=new BScroll(this.$refs.wrapper,{
  //     click:true
  //   })
  // },
  mounted(){
    // 1.创建BScroll对象
    // 最好不要用这种方式document.querySelector('.wrapper')使用，因为很多地方可能类名会起的一样，导致不起效果
    // click的默认值：false ,作用：BetterScroll 默认会阻止浏览器的原生 click 事件。
    this.scroll=new BScroll(this.$refs.wrapper,{
      click:true,
      probeType:this.probeType,
      pullUpLoad:this.pullUpLoad
    })
    // 2.监听滚动的位置
    if(this.probeType===2 ||this.probeType===3){
      this.scroll.on('scroll',(position)=>{
      // console.log(position);
      this.$emit('scroll',position);
      })
    }
    
    //3.监听上拉加载事件
    if(this.pullUpLoad){
      this.scroll.on('pullingUp',()=>{
      this.$emit('pullingUp')
      })
    }
    
  }
}

</script>
<style scoped>
</style>