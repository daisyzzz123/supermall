<!--  -->
<template>
  <div class="goods-item" @click="itemCick">
    <!-- @load="imageLoad"这个是用来监听图片加载完成的事件的 -->
    <img :src="showImage" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>

export default {
  name:'GoodsListItem',
  props:{
    goodsItem:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  data () {
    return {
    };
  },

  components: {},

  computed: {
    showImage(){
      // 下面两种都可以
      return (this.goodsItem.show && this.goodsItem.show.img) || this.goodsItem.image
      // return this.goodsItem.image || this.goodsItem.show.img
    }
  },

  methods: {
    imageLoad(){
      // $bus在这边打印出来是undefined,所以需要在main.js里面给vue实例的原型上面添加这个属性,并赋值一个vue实例,vue实例是可以作为事件总线的
      // this.$bus.$emit()这个是事件总线用法,但是vue2已经很少使用这种方法了,还有其它方法可以实现跨组件发射事件,比如vuex,还有一个一个传过去
      // 这边加上了if判断是为了使得在详情页监听图片加载的时候，首页不需要进行刷新，反之也是一个道理，所以需要把他们区分开来
      // 这是一种方法，还有一种方法是这边不需要if判断，只有这一句this.$bus.$emit('itemImageLoad')，
      // 但是要在首页那边的deactivated()离开函数里面去取消那个监听事件，以及在activated()进入函数开启监听事件
      // 而详情页那边要在destroyed()离开函数里面去取消那个监听事件，以及在mounted()进入函数开启监听事件,是因为详情页没有keep-alive,所以没有这两个deactivated()和activated()生命周期函数
      // 使用this.$bus.$on('homeItemImageLoad',|this.itemImgListener=|()=>{refresh()})开启全局事件的监听
      // 使用this.$bus.$off('itemImageLoad',this.itemImgListener)取消全局事件的监听
      // 但是使用第二种方法的时候,感觉在这两个Home.vue以及Detail.vue里面有好几行重复代码,所以又需要在那两个文件里面使用到mixin(混入)
      // 使用的时候先把common/mixin.js导入,然后在与data和methods同级写上mixins:[itemListenerMixin],然后就可以了,不需要再在mounted里面写任何东西
      if(this.$route.path.indexOf('/home')!==-1){
        this.$bus.$emit('homeItemImageLoad')
      }else if(this.$route.path.indexOf('/detail')!==-1){
        this.$bus.$emit('detailItemImageLoad')
      }
        
    },
    itemCick(){
      // 第一种方法：动态路由
      this.$router.push('/detail/'+this.goodsItem.iid)
      // 第二种方法：（记得把router里面的index的:id删掉）在使用的时候就是用这个this.$route.params.iid取出来
      // this.$router.push({
      //   path:'/deatil',
      //   query:{
      //     iid:this.goodsItem.iid
      //   }
      // })
    }
  },

}

</script>
<style scoped>
  .goods-item {
    padding-bottom: 40px;
    /* 子绝父相 */
    position: relative;
    /* GoodsList里面所说的是在这边设置宽度 */
    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    /* 子绝父相 */
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>