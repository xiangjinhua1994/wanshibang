
// let baseUrl = "https://captcha.anji-plus.com/captcha-api"
let baseUrl = "https://app.nanheshop.com/api/front"
// let baseUrl = 'https://app-test.yiweiyi.cn';//测试环境请求地址
//  let baseUrl = "https://app-test.yiweiyi.cn/api/front"


export const  myRequest = async (option={})=>{
	return await new Promise((reslove,reject)=>{
		 uni.request({
			url: baseUrl + option.url, 
			data :option.data,
			method:option.method || "GET",
			success: (result) => {
				reslove(result)
			},
			fail:(error)=>{
				reject(error)
			}
		})
	})
}
