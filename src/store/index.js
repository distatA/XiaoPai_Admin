import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        imageUrl:'http://new.schoolpi.net',
        userInfo: JSON.parse(sessionStorage.getItem('userInfo')) ? JSON.parse(sessionStorage.getItem('userInfo')) : {},
        isLogin: JSON.parse(sessionStorage.getItem('isLogin')) ? JSON.parse(sessionStorage.getItem('isLogin')) : false
    },

    getters: {
        // userInfo(state) {
        //     if (!state.userInfo) {
        //         state.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //         state.isLogin = JSON.parse(sessionStorage.getItem('isLogin'));
        //     }
        //     return state.userInfo, state.isLogin
        // }
    },
    //改变state中的值的方法
    mutations: {
        LOGIN(state, value) {
            state.userInfo = value.userInfo;
            state.isLogin = value.isLogin;
            sessionStorage.setItem('userInfo', JSON.stringify(value.userInfo));
            sessionStorage.setItem('isLogin', value.isLogin);
        },
        LOGIN_OUT(state) {
            state.userInfo = null;
            state.isLogin = false;
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('isLogin');
        }
    },
    actions: {
    },
    modules: {
    }
})
