function requestFun (app) {
    /**
     * @description get请求
     * @param
     * @returns
     */
    app.config.globalProperties._get = function (path, data, success, fail, complete) {
        /* console.log("111=websiteUrl:", this.websiteUrl,)
        console.log(path, "222=path:")
        console.log("333=websiteUrl+path:", this.websiteUrl + '/api/front/' + path) */
        data = data || {};
        data.token = uni.getStorageSync('token') || '';
        data.appId = this.getAppId();
        uni.request({
            url: this.websiteUrl + '/api/front/' + path,
            data: data,
            dataType: 'json',
            method: 'GET',
            header: {
                'appId': this.getAppId()
            },
            success: (res) => {
                if (res.statusCode !== 200 || typeof res.data !== 'object') {
                    return false;
                }
                if (res.data.code === -2) {
                    this.showError(res.data.msg, function () {
                        uni.removeStorageSync('token');
                        this.gotoPage('/pages/index/index', 'reLaunch');
                    })
                } else if (res.data.code === -1) {
                    // 登录态失效, 重新登录
                     console.log('登录态失效, 重新登录get请求, 用户信息先不判断,可以点击其他的, 点击完再跳转登录页面 ',path);
                       if(path=="/user/user/getInfo"){}
                       else if(path=="index/checkHome"){
                        this.gotoPage("/pages/login/weblogin")
                       }
                       else{
                        this.doLogin();
                       }
                    //   console.log(path)
                    //   console.log(data)
                    //   console.log(fail,)
   

                   // this.doLogin();
                } else if (res.data.code === 0) {
                    this.showError(res.data.msg, function () {
                        fail && fail(res);
                    });
                    return false;
                } else {
                    success && success(res.data);
                }
            },
            fail: (res) => {
                fail && fail(res);
            },
            complete: (res) => {
                uni.hideLoading();
                complete && complete(res);
            },
        });
    };
    /**
     * @description post请求
     * @param
     * @returns
     */
    app.config.globalProperties._post = function (path, data, success, fail, complete) {
        data = data || {};
        // data.token = '13212312321'
        data.token = uni.getStorageSync('token') || '';
        data.appId = this.getAppId();
        uni.request({
            url: this.websiteUrl + '/api/front/' + path,
            data: data,
            dataType: 'json',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'appId': this.getAppId()
            },
            success: (res) => {
                if (res.statusCode !== 200 || typeof res.data !== 'object') {
                    return false;
                }
                if (res.data.code === -1) {
                    // 登录态失效, 重新登录
                    console.log('登录态失效, 重新登录，post请求');
                    this.gotoPage("/pages/login/weblogin")
                    this.doLogin();
                } else if (res.data.code === 0) {
                          if(res.data.errCode==101 ){
                                 success(res.data)
                          }else{
                                this.showError(res.data.msg, function () {
                                    fail && fail(res);
                                });
                                return false;

                          }
                } else {
                    
                    success && success(res.data);
                }
            },
            fail: (res) => {
                fail && fail(res);
            },
            complete: (res) => {
                uni.hideLoading();
                complete && complete(res);
            },
        });
    };
    // 带返回值的post请求
    app.config.globalProperties._postreturn = function (path, data) {
        return new Promise((resolve, reject) => {
            data = data || {};
            data.token = uni.getStorageSync('token') || '';
            data.appId = this.getAppId();
    
            uni.request({
                url: this.websiteUrl + '/api/front/' + path,
                data: data,
                dataType: 'json',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'appId': this.getAppId()
                },
                success: (res) => {
                    if (res.statusCode !== 200 || typeof res.data !== 'object') {
                        reject(new Error('Invalid response'));
                        return;
                    }
                    if (res.data.code === -1) {
                        // 登录态失效, 重新登录
                        console.log('登录态失效, 重新登录，post请求');
                        this.gotoPage("/pages/login/weblogin")
                        this.doLogin();
                        resolve(res.data);
                    } else if (res.data.code === 0) {
                       // this.showError(res.data.msg);
                       resolve(res.data);
                    } else {
                        resolve(res.data);
                    }
                },
                fail: (err) => {
                    reject(err);
                },
            });
        });
    };

    //post请求
    app.config.globalProperties._postBody = function (path, data, success, fail, complete) {
        data = data || {};
        data.appId = this.getAppId();
        uni.request({
            url: this.websiteUrl + '/api/front/' + path,
            data: data,
            dataType: 'json',
            method: 'POST',
            header: {
                'content-type': 'application/json;charset=UTF-8',
                'token': uni.getStorageSync('token') || ''
            },
            success: (res) => {
                if (res.statusCode !== 200 || typeof res.data !== 'object') {
                    return false;
                }
                if (res.data.code === -1) {
                    // 登录态失效, 重新登录
                    console.log('登录态失效, 重新登录', 11111111);
                    this.gotoPage("/pages/login/weblogin")
                    //this.doLogin();
                } else if (res.data.code === 0) {
                    // order/order/toBuy
                    if(path != 'order/order/toBuy'){
                    this.showError(res.data.msg, function () {
                        fail && fail(res);
                    });
                    return false;
                    }else{
                        fail && fail(res);
                        return false;
                    }
                } else {
                    success && success(res.data);
                }
            },
            fail: (res) => {
                fail && fail(res);
            },
            complete: (res) => {
                uni.hideLoading();
                complete && complete(res);
            },
        });
    };

    /**
     * @description 登录失效 重新登录
     * @param
     * @returns
     */
    app.config.globalProperties.doLogin = function () {
        //token失效清除token
        uni.removeStorageSync('token');

        let pages = getCurrentPages();
        if (pages.length) {
            let currentPage = pages[pages.length - 1];
            if ("pages/login/login" != currentPage.route &&
                "pages/login/weblogin" != currentPage.route &&
                "pages/login/openlogin" != currentPage.route) {
                uni.setStorageSync("currentPage", currentPage.route);
                // uni.setStorageSync("currentPageOptions", currentPage.$page.options);
                uni.setStorageSync("currentPageOptions", currentPage.options);
            }
        }
        console.log('appId=' + this.getAppId())
        //公众号
        // #ifdef  H5
        /* 
        1 开启微信授权
        0 不开启微信授权
         */

        //微信浏览器h5 自动公众号授权登录
        if (this.isWeixin() && uni.getStorageSync('mpState') == 1) {
            window.location.href = this.websiteUrl + '/api/front/user/userMp/login?appId=' + this.getAppId() +
                '&referee_id=' + uni.getStorageSync('referee_id');
        } else {
            const pages = getCurrentPages();    // 获取加载的页面
            const currentPage = pages[pages.length - 1];    // 获取当前页面的对象
            const url = currentPage.route;    // 当前页面url
            // if(url!='pages/user/index/index'){
            //     this.gotoPage("/pages/login/weblogin");
            // }
            // this.gotoPage("/pages/login/weblogin");
        }
        // #endif
        // #ifdef APP-PLUS
        // this.gotoPage("/pages/login/openlogin", 'redirect');
        this.gotoPage("/pages/login/weblogin", 'redirect');
        return;
        // #endif
        // 非公众号,跳转授权页面
        // #ifndef  H5
        /* 
        wxOpen true 开启微信授权 false 不开启微信授权
         */
        let wxOpen = uni.getStorageSync('wxOpen');
        if (wxOpen) {
            // this.gotoPage("/pages/login/login");
            //使用此方法跳转,wx.hideHomeButton才会生效
            wx.reLaunch({
                url: '/pages/login/login'
            })
        } else {
            this.gotoPage("/pages/login/weblogin");
        }
        // #endif
    };

}

export default requestFun