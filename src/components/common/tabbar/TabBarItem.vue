<!--  -->
<template>
    <div class="tab-bar-item" @click="itemClick">
        <!-- 因为插槽都是会被替换掉的，所以最好在外面包装一层div，把属性都写到div上面去，直接写在slot可能会被替换掉不起效果 -->
        <div v-if="!isActive">
            <slot name="item-icon"></slot>
        </div>
        <div v-else>
            <slot name="item-icon-active"></slot>
        </div>
        <!-- <div :class="{ active: isActive }"> 方法一:不太好,不能动态绑定颜色
            <slot name="item-text"></slot>
        </div> -->
        <div :style="activeStyle">
            <slot name="item-text"></slot>
        </div>

    </div>
</template>

<script>
export default {
    name: 'TabBarItem',
    props: {
        path: String,
        activeColor:{
            type:String,
            default:'red'
        }
    },
    data() {
        return {
            // isActive:false
        };
    },

    components: {},

    computed: {
        isActive() {
            return this.$route.path.indexOf(this.path) !== -1
        },
        activeStyle(){
            return this.isActive?{color:this.activeColor}:{}
        }
        
    },

    methods: {
        itemClick() {
            this.$router.replace(this.path)
        }
    },

    //mounted: {}
}

</script>
<style scoped>
.tab-bar-item {
    flex: 1;
    text-align: center;
    height: 49px;
    /* line-height: 49px; */
    font-size: 14px;
}

.tab-bar-item img {
    width: 24px;
    height: 24px;
    /* 去除图片下方自带的3像素 */
    vertical-align: middle;
    margin-top: 3px;
    margin-bottom: 2px;
}
/* 因为在这边不能动态改变颜色,所以得在上面动态绑定:style
.active {
    color: red;
} */
</style>