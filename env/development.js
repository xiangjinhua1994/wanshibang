// let url = 'http://127.0.0.1:8889';

// let url = 'https://k3215738i1.zicp.fun';//本地穿透

// let url = 'http://192.168.0.9:8890';//测试环境请求地址


// let url = 'https://app-test.yiweiyi.cn';//测试环境请求地址


let url = 'https://app.nanheshop.com';//正式环境请求地址app.yiweiyi.cn



//

if (process.env.NODE_ENV != 'development') {
    url = '/api';
}
export default {
    url
}
