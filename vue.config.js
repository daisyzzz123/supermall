// 这里可以配置别名，到时候写路径的时候就不用写../之类的东西了
// 这里的配置到时候会自动和node_modules里面的配置合并起来
module.exports={
  configureWebpack:{
    resolve:{
        extensions:[],//这个这边配置了，使用的地方就可以不用写后缀名了，但是他默认已经配置了，所以我们就不配置了
        alias:{
          'assets':'@/assets',
          'common':'@/common',
          'components':'@/components',
          'network':'@/network',
          'views':'@/views'
        }
    }
  }
}