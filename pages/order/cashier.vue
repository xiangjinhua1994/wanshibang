<template>
	<view style="height:100vh" :data-theme="theme()" :class="theme() || ''" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
		<view class="head_top" :style="'height:' + topBarTop() + 'px;'" style="background-color: #fff;"></view>
		<headTitle title="收银台" bg="#fff" @back="back"></headTitle>
		<view class="tc buy-checkout-top">
			<view class="f28 mb20" style="top: 20rpx;position:relative;">需付款</view>
			<view class="redA8 f50 fb" style="color: #000;font-weight:bold;margin-right: 25rpx;"><text class="f34" style="font-weight:600">￥</text>{{ payPrice || '' }}</view>
		</view>
		<view v-if="showKey" style="position: absolute;background:#fff;width:100%;z-index:120;height:700rpx">
			<payKeyui  :pay_title1="pay_title1sure"  @custom-event="receiveFromChild2" ></payKeyui>
		</view>
		<view class="choosePayWay">请选择支付方式</view>
		<view class="buy-checkout p-0-30">
			<view class="wrapper">
			  <view v-for="(item, index) in checkedPay" :key="index">
				<view
					v-if="item == 20"
					:class="pay_type == 20 ? 'item active' : 'item'"
					@tap="payTypeFunc(20)"
				>
					<view class="d-s-c">
						<view class="icon-box d-c-c mr10"
							><span class="icon iconfont icon-weixin"></span
						></view>
						<text class="key">微信支付：</text>
					</view>
					<!-- <view class="icon-box d-c-c"
						><span class="icon iconfont icon-xuanze"></span
					></view> -->
					<view class="radio d-s-c radio-ui">
						<radio style="transform:scale(0.7)"  color="#000" @click="radioChange(20)"   :checked="radioValue==20"
						  />
					</view>
				</view>
				<view
					v-if="item == 30"
					:class="pay_type == 30 ? 'item active' : 'item'"
					@tap="payTypeFunc(30)"
				>
					<view class="d-s-c">
						<view class="icon-box d-c-c mr10"
							><span class="icon iconfont icon-zhifubao"></span
						></view>
						<text class="key">支付宝支付：</text>
					</view>
					<view class="radio d-s-c radio-ui">
						<radio style="transform:scale(0.7)" color="#000" @click="radioChange(30)"   :checked="radioValue==30"
						  />
					</view>
				</view>
				<view
					v-if="item == 40"
					:class="pay_type == 40 ? 'item active' : 'item'"
					@tap="payTypeFunc(40)"
				>
					<view class="d-s-c">
						<view class="icon-box d-c-c mr10">
							<!-- <span class="icon iconfont icon-zhifubao"></span> -->
							<image class="yhk_pic" src="/static/yhk.png" />
						</view>
						<text class="key">银行卡支付：</text>
					</view>
					<view class="radio d-s-c radio-ui">
						<radio style="transform:scale(0.7)" color="#000" @click="radioChange(40)"   :checked="radioValue==40"
						  />
					</view>
					<!-- <view class="icon-box d-c-c"
						><span class="icon iconfont icon-xuanze"></span
					></view> -->
				</view>
				<view
					v-if="item == 60"
					:class="pay_type == 60 ? 'item active' : 'item'"
					@tap="payTypeFunc(60)"
				>
					<view class="d-s-c">
						<view class="icon-box d-c-c mr10">
							<!-- <span class="icon iconfont icon-zhifubao"></span> -->
							<image class="yhk_pic" src="/static/ysf.png" />
						</view>
						<text class="key">云闪付支付：</text>
					</view>
					<view class="radio d-s-c radio-ui">
						<radio style="transform:scale(0.7)" color="#000" @click="radioChange(60)"   :checked="radioValue==60"
						  />
					</view>
					<!-- <view class="icon-box d-c-c"
						><span class="icon iconfont icon-xuanze"></span
					></view> -->
				</view>
			</view>
				<view v-if="hasBanlance">
					<view v-if="true" class="item">
						<view class="d-s-c">
							<view class="icon-box d-c-c mr10"
								><span class="icon iconfont icon-yue"></span
		
							></view>
							<text class="key">余额抵扣：(剩余：{{ balance }})</text>
						</view>
						<view class="radio d-s-c radio-ui">
							<radio style="transform:scale(0.7)" color="#000" @click="radioChange(10)" value="jj" :checked="balanceType"
							  />
						</view>
						<!-- <switch
							:color="getTheme()"
							style="transform: scale(0.7); margin-right: -20rpx"
							:checked="balanceType"
							@change="switch2Change"
						/> -->
					</view>
				</view>
			</view>
			<view v-if="pay_type == 40  &&  payChannel === 3" @click="isProtocol = !isProtocol" class="d-s-c gray6 p-0-75 mt20">
        <view :class="isProtocol ? 'active agreement' : 'agreement'"></view
        >我已阅读并接受<text class="dominant" @click.stop="xieyi()"
          >《连连银通系统技术服务协议》</text
        >
      </view>
	 <!-- <view v-if="hasBanlance" class="item">
			<view v-if="true" class="item">
				<view class="d-s-c">
					<view class="icon-box d-c-c mr10"
						><span class="icon iconfont icon-yue"></span

					></view>
					<text class="key">余额抵扣：(剩余：{{ balance }})</text>
				</view>
				<view class="radio d-s-c radio-ui">
					<radio style="transform:scale(0.7)" color="#000" @click="radioChange(10)" :value="radioValue" :checked="radioValue==10"
					  />
				</view>
				 
			</view>
		</view> -->
	</view>
    <!-- 协议={{ isProtocol }} -->
		<!-- 吱吱口令弹窗={{ popupShow }} -->
		<view class="bottom-btn" @click="submitPay">
			<button type="default">立即支付</button>
		</view>

		<view class="copy-pup" v-if="popupShow">
			<!-- <view class="copy-pup-text">支付宝吱口令 ↓</view>
			<view class="copy-pup-text">{{ shareToken }}</view> -->
			<button class="copy-pup-btn" @click="copyaa">点击此处去支付宝</button>
		</view>

		<uiPopup v-if="confirmBoxOrder">
			<view class="confirm-box">
			  <view class="confirm-box-title" >提示 </view>
			  <view class="confirm-box-describe"> 您的订单如在规定时间内未支付将被取消，请尽快完成支付 </view>
			  <view class="confirm-box-btn" slot="btnBox">
				<view class="ui-btn btn-more btn-width" @click="closeOrder">确认离开</view>
				<view class="ui-btn btn-more btn-width btn-black" @click="sure_pay">继续支付</view>
			  </view>
			</view>
		  </uiPopup>
		  <uiPopup v-if="confirmBoxOrder2">
			<view class="confirm-box">
			  <view class="confirm-box-title" > 提示 </view>
			  <view class="confirm-box-describe"> 当前用户未勾选协议，是否勾选？ </view>
			  <view class="confirm-box-btn" slot="btnBox">
				<view class="ui-btn btn-more btn-width" @click="confirmBoxOrder2=false">取消</view>
				<view class="ui-btn btn-more btn-width btn-black" @click="close_delectOrder2">确定</view>
			  </view>
			</view>
		  </uiPopup>

	</view>
</template>

<script>
import { pay } from '@/common/pay.js';

import UiPopup from '@/pages/component/ui-popup.vue';
import payKeyui from '../user/set/payment/paykeyui.vue';
import headTitle from '@/pages/component/headTitle.vue';

export default {
	components: {
	  UiPopup,
	  payKeyui,
	  headTitle,
    },
	data() {
		return {
			confirmBoxOrder2:false,
			startX: '', // 触摸起始点横坐标
      		deltaX:'',
      payChannel: 0,
			balance: '',
			balanceType: false,
			type: 0,
			loading: true,
			orderId: 0,
			orderType: 0,
			pay_type: 30, //10余额 20微信(小程序微信官方支付和h5微信公众号支付) 30支付宝
			checkedPay: [],
			payPrice: '',
			popupShow: false,
			shareToken: '', // 吱口令
           isProtocol: false,
		   confirmBoxOrder: false,
		   radioValue:false,
		   showKey:false,
		   passwordArr:[],
		   pay_title1sure:{
            title:'请输入支付密码',
           describe:""
        }
		};
	},
	computed: {
		hasBanlance() {
			if (this.orderType == 30) {
				return false;
			}
			// if(this.balance == '' || this.balance == 0){
			// 	return false;
			// }
			let n = this.checkedPay.indexOf(10);
			if (n == -1) {
				return false;
			} else {
				return true;
			}
		},
	},
	onBackPress(options) {
		console.log(options,'options88')
		if (options.from === 'navigateBack') {
			return true;
		}
        return true;
	},
	onLoad(e) {
		console.log('getCurrentPages()', getCurrentPages());
		let self = this;
		// #ifdef MP
		wx.enableAlertBeforeUnload({
			message: '您的订单如在规定时间内未支付将被取消，请尽快完成支付',
			success: function (res) {
				console.log('方法注册成功：', res);
			},
			fail: function (errMsg) {
				console.log('方法注册失败：', errMsg);
			},
		});
		// #endif
		this.orderId = e.orderId;
		if (e.orderType) {
			this.orderType = e.orderType;
		}
		this.paySource = this.getPlatform();
		this.getData();
    this.isProtocol = uni.getStorageSync('isProtocol') || false;
	},
	onShow(){
		let self = this;
		self._post('user/order/checkOrderStatus', {
						orderId: self.orderId
					},
					function(res) {
						if(res.data==1){
							// 已支付
							self.gotoPage(
								'/pages/order/pay-success/pay-success?orderId=' + self.orderId,
								'reLaunch'
							);
						}
						console.log(res,'res8888')
					}
				);
	},
	// onBackPress(options) {
	// 	console.log(options,'options88')
	// 	if (options.from === 'navigateBack') {
	// 		return false;
	// 	}
	// 	this.back();
	// 	return true;
	// },
	methods: {
		close_delectOrder2(){
			this.isProtocol = true;
			this.confirmBoxOrder2 = false;
		},
		receiveFromChild2(data){
			console.log("===子传父==")
			console.log(data,'ioio')

			this.passwordArr=data;
			if(this.passwordArr.length==6){
				this.submit()
			}
		},
		radioChange(item){
			 this.pay_type = item;
			console.log(item,'item')
			this.radioValue = item;
			if(item==10){
				this.balanceType = true;
			}else{
				this.balanceType = false;
			}
		},
		touchStart(event) {
				// 记录触摸起始点的横坐标
				this.startX = event.touches[0].clientX;
				},
				touchMove(event) {
				// 计算滑动距离
				const currentX = event.touches[0].clientX;
				this.deltaX = currentX - this.startX;
				},
				touchEnd() {
			// 判断滑动方向
				if (this.deltaX > 100) {
					// 向右滑动逻辑   这里只建议写一些性能消耗小的逻辑，比如：this.status = !this.status 因为当他的横坐标大于或小于50时，每隔一个数字都会执行一次，所以...非常消化性能
					console.log('向右滑动逻辑',this.deltaX,this.startX)
					// this.$emit('close');
					// uni.navigateBack();
					this.back();
				} else if (this.deltaX < -50) {
					// 向左滑动逻辑   这里只建议写一些性能消耗小的逻辑，比如：this.status = !this.status 因为当他的横坐标大于或小于50时，每隔一个数字都会执行一次，所以...非常消化性能
					console.log('向左滑动逻辑',this.deltaX)
				}
				this.startX = 0;
				this.deltaX = 0;
				// 清除触摸起始点记录，这里也可以写一些比较复杂的逻辑，每滑动一次松后执行。
			},
			/*跳转产品详情*/
		gotoDetail(e) {
			let url = '/pages/product/detail/detail?productId=' + e;
			this.gotoPage(url);
		},
		closeOrder(){
			let self = this;
			self.confirmBoxOrder =false;
			console.log('898989jj')
			let backUrl = "/"+ getCurrentPages()[getCurrentPages().length-2].route;//获取上一次跳转过来的路由
			console.log(backUrl,'backUrl89898')
			self.gotoPage('/pages/order/myorder?dataType=payment&appId=10001');

			// self.gotoPage(`/pages/order/order-detail?orderId=${self.orderId}&appId=10001`)
			console.log('898989jj')


			// history.back();
			//#ifdef APP-PLUS
			// uni.navigateBack()
			// history.go(-1)
			// history.back()
			// uni.navigateBack({
			// 	delta: 1
			// });
			

			//#endif
			//#ifdef H5
				// uni.navigateBack();
				// history.back();
				// uni.navigateBack()
			//#endif
			// uni.navigateBack();


				// 			uni.reLaunch({
			// 				ulr: '/pages/order/order-detail?orderId=' + self.orderId,
			// 			});
			// uni.navigateBack();
			// uni.navigateBack({
			// 	delta: 1
			// });
			// #ifndef H5
				// uni.navigateBack();
				// // #endif
				// // #ifdef H5
				// history.go(-1);
				// #endif

		},
		back() {
			let self = this;
			  self.showKey = false;
              self.confirmBoxOrder=true;

			// uni.showModal({
			// 	title: '提示',
			// 	content: '您的订单如在规定时间内未支付将被取消，请尽快完成支付',
			// 	cancelText: '继续支付',
			// 	confirmText: '确认离开',
			// 	success: function (res) {
			// 		if (res.confirm) {
			// 			uni.reLaunch({
			// 				ulr: '/pages/order/order-detail?orderId=' + self.orderId,
			// 			});
			// 		} else if (res.cancel) {

			// 			// #ifndef H5
			// 			uni.navigateBack();
			// 			// #endif
			// 			// #ifdef H5
			// 			history.go(-1);
			// 			// #endif

			// 		}
			// 	},
			// });
		},

		sure_pay(){ // 继续支付
			this.confirmBoxOrder=false

		},




		getTheme() {
			let name = this.theme();
		},
		getData() {
			let self = this;
			self.loading = true;
			uni.showLoading({
				title: '加载中',
			});
			let url = 'user/order/toPay';
			if (self.orderType == 20) {
				url = 'plus/package/package/toPay';
			}
			if (self.orderType == 30) {
				url = 'balance/plan/toPay';
			}
			/* 确认支付定金 */
			if (self.orderType == 40) {
				url = 'plus/advance/order/toPay';
			}
			//paySource: self.paySource,
			let params = {
				orderId: self.orderId,
				paySource:"android"
			};
			
			self._get(url, params, function (res) {
               console.log("支付请求")
				console.log(res)
				self.loading = false;
				let list = [];
				res.data.payTypes.forEach((item) => {
					list.push(item * 1);
				});
				self.checkedPay = list;
				self.payPrice = res.data.payPrice;
				console.log('ordertype', self.orderType);
				self.balance = res.data.balance || '';
				self.payChannel = res.data.payChannel;
				console.log("支付方式")
				console.log(self.checkedPay[0])

				if (self.checkedPay[0] != 10) {
					self.pay_type = self.checkedPay[0] || self.checkedPay[1] || 20;
					//self.radioValue=self.pay_type
					console.log("支付方式")
					console.log(self.pay_type)

				} else {
					self.pay_type = self.checkedPay[1] || self.checkedPay[0];

				}
				uni.hideLoading();


			});
		},
		switch2Change(e) {
			this.balanceType = e.detail.value;
		},
		submitPay(){
			// console.log('支付',this.pay_type)
			// if(!this.pay_type){
			// 	uni.showToast({
			// 		title: '请选择支付方式',
			// 		duration: 2000
			// 	});
			// 	return;
			// }
			if(this.pay_type==10){
				let self = this;
			    self.showKey = true;

			}else{
				this.submit()
			}
		},
		submit() {
			let self = this;
			self.loading = true;
			uni.showLoading({
				title: '加载中',
			});

			console.log(self.orderType)

			console.log(self.pay_type)
			let url = 'user/order/pay';
			if (self.orderType == 20) {
				url = 'plus/package/package/pay';
			}
			if (self.orderType == 30) {
				url = 'balance/plan/pay';
			}
			/* 支付定金 */
			if (self.orderType == 40) {
				url = 'plus/advance/order/pay';
			}
			let use_balance = self.balanceType == true ? 1 : 0;
			if (self.payPrice == 0) {
				use_balance = 1;
			}
			let payType = self.pay_type;
			if (payType == 10) {
				// payType = 0;
			} else if(payType == 40  && self.payChannel === 3){
			if(!self.isProtocol){
			self.loading = false;
			uni.hideLoading();
			self.confirmBoxOrder2 = true;
			// uni.showModal({
			// 	title: '提示',  
			// 	content: '当前用户未勾选协议，是否勾选？',  
			// 	confirmText: '确定',  
			// 	cancelText: '取消',  
			// 	success: (res) => {  
			// 	if (res.confirm) {  
			// 		self.isProtocol = true
			// 	} else if (res.cancel) {  
					
			// 	}  
			// 	},  
			// })
			return
			}
      }
			let params = {
				orderId: self.orderId,
				paySource: "android",  // self.getPlatform() // 以前是这个，
				payType: payType,
				useBalance: use_balance,
				orderType:10,
				payPassword:this.passwordArr.join(''),
			};

			console.log(params)
			console.log(url)
			self._postBody(url, params, async function (res) {
				self.loading = false;
				if(payType == 40){
					uni.setStorageSync('isProtocol', true);
					uni.navigateTo({
						url: '/pages/webview/webview2?url=' + res.data.payment,
					});
					//#ifdef H5
					// window.location.href = res.data.payment
					// #endif
					//#ifdef APP-PLUS
					// plus.runtime.openURL(res.data.payment)
					// #endif
						} else if(payType == 30) {		
							uni.navigateTo({
								url: '/pages/webview/webview2?url=' + res.data.payment,
							}); 
					} else if(payType == 20) {		
							uni.navigateTo({
								url: '/pages/webview/webview2?url=' + res.data.payment,
							}); 
					} else {		
							pay(res, self, self.paySuccess, self.payError); //  里面还有其他的支付， 别人封装的， 
					} 
				
				},false,
				(res) => {
					self.showKey = false;
					console.log(res,'8980');
					// self.confirmBoxOrder = true;
				});
		},
		close() {
			this.popupShow = false;
		},

		setClipboardData(data) {
			return new Promise((success, fail) => {
				// #ifndef H5
				uni.setClipboardData({ data, success, fail });
				// #endif

				// #ifdef H5
				const textarea = document.createElement('textarea');
				textarea.value = data;
				textarea.readOnly = true;
				document.body.appendChild(textarea);
				textarea.select();
				textarea.setSelectionRange(0, data.length);
				document.execCommand('copy');
				textarea.remove();
				success(data);
				// #endif
			});
		},
		paySuccess(result) {
			console.log("======33333===")
			console.log(result)
			let self = this;
			if (self.orderType == 30) {
				let pages = getCurrentPages();
				if (pages && pages.length > 1) {
					let currentPage = pages[pages.length - 2];
					if (currentPage && currentPage.route) {
						self.gotoPage(currentPage.route, 'redirect');
						return;
					}
				}
				self.gotoPage('pages/order/recharge', 'redirect');
			} else if (self.orderType == 60) {
				self.gotoPage('/pages/user/my_shop/my_shop', 'reLaunch');
			} else if (self.orderType == 20) {
				self.gotoPage('/pages/user/index/index');
			} else if (self.orderType == 40) {
				self.gotoPage('/pages/order/myorder', 'reLaunch');
			} else {


				console.log("=========")
				self.gotoPage(
					'/pages/order/pay-success/pay-success?orderId=' + result.data.orderId,
					'reLaunch'
				);
			}
		},
		payError(result) {
			console.log(result);
			let self = this;
			let url = '/pages/order/myorder';
			if (
				self.orderType == 50 ||
				self.orderType == 40 ||
				self.orderType == 30 ||
				self.orderType == 20
			) {
				self.navigateBack();
			} else if (self.orderType == 60) {
				self.gotoPage('/pages/user/my_shop/my_shop', 'redirect');
			} else {
				self.gotoPage('/pages/order/myorder', 'redirect');
			}
		},
		payTypeFunc(n) {
			this.pay_type = n;
		},
    xieyi() {
      uni.navigateTo({
        url: '/pages/webview/webview?url=https://static.lianlianpay.com/accpweb/agreement/OpenAccountAgree_NOT_ACS.html',
      })
    },
	},
};
</script>

<style lang="scss">
.choosePayWay{
	width: 196rpx;
	height: 52rpx;
	font-family: Hiragino Sans GB, Hiragino Sans GB;
	font-weight: normal;
	font-size: 28rpx;
	color: #040404;
	line-height: 52rpx;
	text-align: left;
	font-style: normal;
	text-transform: none;
	margin-left: 28rpx;
	margin-bottom: 12rpx;
}
.copy-pup {
	position: fixed;
	bottom: 0;
	height: 260rpx;
	width: 100%;
	background-color: #ffffff;
	.copy-pup-text {
		padding-top: 20rpx;
		text-align: center;
		font-size: 32rpx;
	}
	.copy-pup-btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		font-size: 40rpx;
		background: #1678ff;
		@include font_color('text_color2');
	}
}
.buy-checkout-top {
	padding: 24rpx 0;
	.f28{
		font-weight: normal;
		font-size: 28rpx;
		color: #040404;
		line-height: 52rpx;
		font-style: normal;
		text-transform: none;
	}
	.f44{
		font-weight: 500;
		font-size: 44rpx;
		color: #000000;
		line-height: 52rpx;
		font-style: normal;
		text-transform: none;
	}
}

.agreement {
  border-radius: 50%;
  width: 28rpx;
  height: 28rpx;
  border: 2rpx solid;
  @include border_color('border_color');
  background: #fff;
  position: relative;
  margin-right: 10rpx;
  box-sizing: border-box;
}

.agreement.active::after {
  content: '';
  width: 16rpx;
  height: 16rpx;
  // background-color: #EE1413;
  @include background_color('background_color');
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.buy-checkout {
	.wrapper{
		border-radius: 28rpx;
		background-color: #ffffff;
		border: 2rpx solid #fff;
	.item {
		margin-top: 20rpx;
		background-color: #ffffff;
		margin-bottom: 28rpx;
		border-bottom: none;
		border-radius: 2rpx;
	}
}
}

.bottom-btn {
	position: fixed;
	bottom: 50rpx;
	//background-color: #040404;
	//@include background_color('background_color');
	//@include font_color('text_color2');
	width: 100%;
	//border: 1rpx solid red;
	//padding-bottom: env(safe-area-inset-bottom);
	//border-radius:60rpx;
}

.bottom-btn > button {
	//width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	background-color: #040404;
//	@include background_color('background_color');
	@include font_color('text_color2');
	border: none;
	border-radius: 40rpx;
	font-size: 35rpx;
	font-weight: bold;
	display: flexd;
	justify-content: center;
	align-items: center;
	border-radius: 60rpx;
	margin-right: 50rpx;
	margin-left: 50rpx;

}
.pay {
	display: block;
	height: 88rpx;
	line-height: 88rpx;
	font-size: 30rpx;
	color: #ffffff;
	text-align: center;
	border-radius: 8rpx;
	color: #ffffff;
	background: #04be01;
}
.yhk_pic {
	width: 50rpx;
	height: 50rpx;
}
</style>
