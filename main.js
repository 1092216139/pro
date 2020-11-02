import Vue from 'vue'
import App from './App'
// 引入封装好的请求
import req from '@/common/request.js'
// 引入uni-simple-router设置全局的路由拦截
import Router from './router'
import {RouterMount} from 'uni-simple-router'

Vue.config.productionTip = false

Vue.prototype.$req = req //挂载封装好的请求

App.mpType = 'app'

// const app = new Vue(App).$mount('#app')
const app = new Vue({
	...App
})

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
RouterMount(app, '#app');

app.$mount(); //为了兼容小程序及app端必须这样写才有效果
