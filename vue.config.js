const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 设置代理，防止跨越 资深同时 孙卫其
  // devServer: {
  //   proxy: {
  //     // 将/api路由转发到目标服务器地址http://localhost:3000
  //     '/api': 'http://localhost:3000'
  //   }
  // }
})
