
/*eslint-disable*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import { post, get } from './axios/index'
Vue.config.productionTip = false
Vue.use(elementUI)
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$echarts = echarts;



// token不存在跳转
import axios from 'axios'
axios.interceptors.response.use(response => {
    if (response.data.code === -1) {
        router.replace({
            path: '/login',
        })
    }
    return response
});

//相同路径报错
import Router from 'vue-router'
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};
import formCreate from "@form-create/element-ui"
import { maker } from "@form-create/element-ui"

import { VueEditor } from 'vue2-editor'
Vue.use(formCreate)
Vue.use(maker)
//时间转时间戳
Vue.filter('dateFormat', function (originVal) {
    var date = originVal * 1000
    const dt = new Date(date)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
//路由守卫
router.beforeEach((to, from, next) => {
    if (window.localStorage.getItem("token") || to.path === '/login') {
        next()
    } else {
        next({
            path: '/login'
        })
    }
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
