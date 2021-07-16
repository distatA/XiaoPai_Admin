/* eslint-disable */
import axios from "axios"
import Router from 'vue-router'

axios.defaults.baseURL = "http://new.schoolpi.net";
axios.defaults.timeout = 500000;
//请求拦截器
//请求拦截器,加上token登陆参数
axios.interceptors.request.use(config => {
    if (config.method === 'post') {
        config.data = {
            ...config.data,
            token: window.localStorage.getItem('token')
        }
    } else if (config.method === 'get') {
        config.params = {
            ...config.params,
            token: window.localStorage.getItem('token')
        }
    }
    // 在最后必须 return config
    return config
},
    error => {

        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
            console.log("shibai")
        }
    });
//返回拦截器
axios.interceptors.response.use(response => {
    if (response.data.code === -1) {
        // Router.replace({
        //     path: '/menu/menu',
        // })
    }
    return response
});

//get请求
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params: params })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err)
            })
    })
}
//post请求
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err)
            })
    })
}
