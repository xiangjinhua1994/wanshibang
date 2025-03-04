import { createStore } from "vuex";
const store = createStore({
    // 全局属性变量
    state: { // state的作用是定义属性变量。定义一个参数
        theme: uni.getStorageSync("theme") || 0,
        footTab: '',
        points_name: '积分',
        globalEvaluateSwitch: false, // 全局评价开关
        globalAppInviteSwitch: false, // 全局邀请开关
        globalUserInfo: null, // 全局用户信息
        globalGetEmail: false, // 全局允许获取邮箱/登录/注册/绑定
        address:null, // 点击地址时候要显示点击的， 不能用默认的
        mobile:null,
        calTime:'',
        newsTotal:0,
        visitorId:'',
        isFaxianaaa:true,
    },
    // 全局同步方法，在methods{this.$store.commit("changeTheme")}
    mutations: {
        changeTheme (state, value) {
            state.theme = value;
        },
        getNewsTotal (state, value) {
            state.newsTotal = value;
        },
        changefootTab (state, value) {
            state.footTab = value;
        },
        setGlobalEvaluateSwitch (state, value) {
            state.globalEvaluateSwitch = value;
        },
        setGlobalAppInviteSwitch (state, value) {
            state.globalAppInviteSwitch = value;
        },
        setGlobalUserInfo (state, value) {
            state.globalUserInfo = value;
        },
        setGlobalGetEmail (state, value) {
            state.globalGetEmail = value;
        },
        setaddress(state,value){
            state.address=value;
            console.log(state,state.address,'809809')
        },
        setMobile(state,value){
            state.mobile=value;
        },
        calTime(state,value){
            state.calTime=value;
        },
        setVisitorId (state, value) {
            state.visitorId = value;
        },
        isFaxian (state, value) {
            state.isFaxianaaa = value;
        },
    },
    getters: {
        globalToken (state) {
            return uni.getStorageSync('token') || '';
        },
    },
    actions: {
        GlobalInitQuery ({ state, getters, commit, dispatch }, { _vue }) {
            return Promise.all([ dispatch('GetGloablUserInfo', { _vue }),dispatch('getgodsData', { _vue })]);//同时发起请求，都完成后才执行then
            // return Promise.all([dispatch('GetGloablEvaluateSwitchState', { _vue }), dispatch('GetGloablAppInviteSwitchState', { _vue }), dispatch('GetGloablUserInfo', { _vue }), dispatch('GetGloablGetEmailSwitch', { _vue })]);//同时发起请求，都完成后才执行then
        },
        // GetGloablEvaluateSwitchState ({ state, getters, commit }, { _vue }) {
        //     // if (!getters.globalToken) return;
        //     var self = _vue
        //     return new Promise((resolve, reject) => {
        //         self._get(
        //             'settings/appOrderComment',
        //             {
        //                 // url: self.url,
        //             },
        //             function (res) {
        //                 commit('setGlobalEvaluateSwitch', res.data)
        //                 resolve(res)
        //                 // console.log(res, 111)
        //             })
        //     },
        //     )
        // },
        // GetGloablAppInviteSwitchState ({ state, getters, commit }, { _vue }) {
        //     // if (!getters.globalToken) return;
        //     var self = _vue
        //     return new Promise((resolve, reject) => {
        //         self._get(
        //             'settings/appInvite',
        //             {
        //                 // url: self.url,
        //             },
        //             function (res) {
        //                 commit('setGlobalAppInviteSwitch', res.data)
        //                 resolve(res)
        //                 // console.log(res, 111)
        //             })
        //     },
        //     )
        // },
        // 获取全局用户信息-主要是手机号
        GetGloablUserInfo ({ state, getters, commit }, { _vue }) {
            // console.log('获取用户信息的token', getters.globalToken)
            if (!getters.globalToken) return;
            var self = _vue
            return new Promise((resolve, reject) => {
                self._get(
                    'user/index/setting',
                    {
                        source: self.getPlatform(),
                    },
                    function (res) {
                        commit('setGlobalUserInfo', res.data)
                        resolve(res.data)
                        console.log('用户信息88', res.data)
                    })
            },
            )
        },
        getgodsData ({ state, getters, commit }, { _vue }) {
            // console.log('获取用户信息的token', getters.globalToken)
            if (!getters.globalToken) return;
            var self = _vue
            return new Promise((resolve, reject) => {
                self._postBody(
                    'user/index/index',
                     { source: self.getPlatform(), },
                     function (res) {
                       if (res.code == 1) {
                           console.log('dingdan')
                           console.log(res)
                           commit('setVisitorId', res.data.visitorId)
                           commit('isFaxian', res.data.faxian)
                           resolve(res.data.visitorId)
                        //    self.visitorId = res.data.visitorId;
                         // 遍历更新后的订单列表，处理待支付订单的倒计时
                        // self.loading = false; // 数据加载完成后，关闭 loading 状态
                       } else {
                         console.error('数据加载失败:', res.message);
                         // self.loading = false;
                       }
                     }
                   );
            },
            )
        },
        // GetGloablGetEmailSwitch ({ state, getters, commit }, { _vue }) {
        //     // console.log('获取邮箱的token', getters.globalToken)
        //     // if (!getters.globalToken) return;
        //     var self = _vue
        //     return new Promise((resolve, reject) => {
        //         self._get(
        //             'user/index/emailSetting',
        //             {
        //                 source: self.getPlatform(),
        //             },
        //             function (res) {
        //                 commit('setGlobalGetEmail', res.data)
        //                 resolve(res.data)
        //                 /* console.log('获取邮箱开关', state.globalGetEmail) */
        //             })
        //     },
        //     )
        // },
    },
})
export default store