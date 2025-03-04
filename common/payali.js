


function initiateAlipayPayment(encodedParamsString) {
    // 解码参数字符串
    const decodedParams = decodeURIComponent(encodedParamsString);
    // 转换为查询参数对象
    const paramsObj = Object.fromEntries(new URLSearchParams(decodedParams));
    
    // 解析biz_content JSON字符串
    const bizContent = JSON.parse(paramsObj.biz_content);
  
    // 组合最终的支付参数对象
    const payParams = {
      app_id: paramsObj.app_id,
      biz_content: bizContent,
      method: paramsObj.method,
      sign: paramsObj.sign,
      sign_type: paramsObj.sign_type,
      timestamp: paramsObj.timestamp,
      version: paramsObj.version,
      // ...如果还有其他参数，可以在这里添加
    };
  
    // 根据环境调用支付宝支付接口
    if (typeof AlipayJSBridge !== 'undefined') { // H5环境
      AlipayJSBridge.call('tradePay', payParams, function(res) {
        if (res.resultCode === '9000') {
          // 支付成功
          uni.showToast({ title: '支付成功' });
        } else {
          // 支付失败
          uni.showToast({ title: '支付失败' });
        }
      });
    } else if (typeof plus !== 'undefined') { // APP环境
      plus.payment.request({
        type: 'Alipay',
        ...payParams,
        success: function() {
          uni.showToast({ title: '支付成功' });
        },
        fail: function() {
          uni.showToast({ title: '支付失败' });
        }
      });
    } else {
      console.error('无法识别的环境，支付宝支付未被支持');
    }
  }