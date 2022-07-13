import Vue from 'vue'
import VueRouter from 'vue-router'

const Home=()=>import('views/home/Home')
const Category=()=>import('views/category/Category')
const Profile=()=>import('views/profile/Profile')
const Shopcart=()=>import('views/shopcart/Shopcart')

//1.安装插件
Vue.use(VueRouter)
//2.创建router
const routes=[
  {
    path:'',
    redirect: '/home'
  },
  {
    path:'/home',
    component:Home
  },
  {
    path:'/category',
    component:Category
  },
  {
    path:'/profile',
    component:Profile
  },
  {
    path:'/shopcart',
    component:Shopcart
  }
]

const router=new VueRouter({
  routes,
  mode:'history'
})
//3.导出router
export default router