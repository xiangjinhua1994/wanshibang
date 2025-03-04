import pro_url from './production.js';
var app_url = '';
var h5_url = '';
// 如果是本地测试环境
if (process.env.NODE_ENV === 'development') {
    //#ifdef H5
     app_url = '/api';
   // app_url = '/';
    h5_url = window.location.protocol + '//' + window.location.host;
    //#endif
}
// 如果是生产环境，h5环境下直接读取url
if (process.env.NODE_ENV === 'production') {
    //#ifdef H5
    app_url = pro_url.url;
    if (app_url == '') {
        app_url = window.location.protocol + '//' + window.location.host;
    }
    h5_url = pro_url.h5_url
    //#endif
}
// 非h5都读生产环境
//#ifndef H5
app_url = pro_url.url;
//#endif
// console.log('app_url=' + app_url);
export default {
    /*项目请求地址*/
    app_url: app_url,
    /* 项目访问地址(部署的H5地址) */
    h5_url: h5_url,
    /*appid*/
    appId: 10001,
    //h5发布路径
    h5_addr: '/h5',
    //inonfont 字体url
    font_url: 'https://at.alicdn.com/t/c/font_4197023_t7j01i1rx6j.ttf?t=1699249073419',
    /* 商城名 */
    pro_name: pro_url.pro_name,
    /* 商城拼音缩写(匹配logo) */
    pro_name_py: pro_url.pro_name_py


    // 上线前需修改,
    // production---
    // 1.url    接口请求地址
    // 2.h5_url  h5线上地址
    // 3.pro_name 商城名
    // 4.pro_name_py 商城拼音缩写
}
