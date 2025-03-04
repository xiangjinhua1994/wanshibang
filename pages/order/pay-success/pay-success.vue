<template >
	<view class="pay-success" v-if="!loadding">
		<view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>

           	<headTitle title="提示"    style="z-index:1000"></headTitle>
		
		<view class="success-icon d-c-c d-c">
			<text class="paySuccessImg"><image class="paySuccessImg" src="/static/paySuccess.png"></image></text>
			<text class="name">支付成功</text>
		</view>
		<view class="success-price d-c-c">
			{{payType(detail.payType)}}￥<text class="num">{{detail.payPrice}}</text>
		</view>
		<view class="order-info mt30 f28" v-if="detail.pointsBonus > 0">
			<view class="d-b-c p20 border-b">
				<text class="gray9">积分赠送</text>
				<text class="gray3">{{detail.pointsBonus}}</text>
			</view>
		</view>
		<view class="success-btns d-b-c">
			<button class=" mr36 revise_bottom_sty  back_family" @click="goHome">回到首页</button>
			<button type="primary" class=" ml10 revise_bottom revise_bottom_sty " @click="goMyorder">查看订单</button>
		</view>
		<!--推荐-->
		<view><recommendProduct :location="30"></recommendProduct></view>
	</view>
</template>

<script>
	import recommendProduct from '@/components/recommendProduct/recommendProduct.vue';

	import headTitle from '@/pages/component/headTitle.vue'
	export default {
		components: {
			recommendProduct,
			headTitle
		},
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*订单id*/
				orderId: 0,
				/*订单详情*/
				detail: {},
			}
		},
		onLoad(e) {
			this.orderId = e.orderId;
		},

		
		mounted() {
			uni.showLoading({
				title: '加载中'
			});
			/*获取订单详情*/
			this.getData();
		},
		methods: {
			// 付款类型
			payType(type) {
				if (type == 10) {
					return '余额付款';
				} else if (type == 20) {
					return '微信付款';
				} else if (type == 30) {
					return '支付宝付款';
				} else if (type == 40) {
					return '银行卡付款';
				}else{
					return '';
				}
			},
			/*获取订单详情*/
			getData() {
				let self = this;
				self._post('user/order/paySuccessDetail', {
						orderId: self.orderId
					},
					function(res) {
						self.detail = res.data;
						self.loadding = false;
						uni.hideLoading();
						/*显示表单*/
						if(res.data.showTable){
							self.showSuccess('您的订单需要补充相关信息，请在订单详情补充',function(){
								self.gotoPage('/pages/order/order-detail?orderId='+self.orderId);
							});
						}
					}
				);
			},
			/*返回首页*/
			goHome(){
				this.gotoPage('/pages/index/index');
			},
			/*返回我的订单*/
			goMyorder(){  // 跳转我的订单
				this.gotoPage('/pages/order/myorder?appId=10001');
			}
		}
	}
</script>

<style   scoped>
.paySuccessImg{
	width: 320rpx;
	height: 320rpx;
	display: inline-block;
}
.back_family{
	 border: 1px solid #000000;
	 margin-right: 36rpx;
}
	.revise_bottom {

		background-color: black;
		
	}
   .revise_bottom_sty{
	font-size: 28rpx;
	border-radius: 40rpx;
	width: 240rpx;
	height: 64rpx;
	line-height: 64rpx;
   }

	.pay-success .success-icon {
		display: flex;
		padding: 60rpx 60rpx 12rpx 60rpx;
	}

	.pay-success .success-icon .iconfont {
		padding: 30rpx;
		background: #04BE01;
		border-radius: 50%;
		font-size: 80rpx;
		color: #FFFFFF;
	}

	.pay-success .success-icon .name {
		margin-top: 60rpx;
		font-size: 30rpx;
		font-family: Hiragino Sans GB, Hiragino Sans GB;
		font-weight: bold;
		font-size: 40rpx;
		color: #040404;
		line-height: 52rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
	}

	.pay-success .success-price {
		font-size: 28rpx;
		font-family: Hiragino Sans GB, Hiragino Sans GB;
		font-weight: normal;
		font-size: 28rpx;
		color: #040404;
		line-height: 52rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;

	}

	.pay-success .success-price .num {
		font-size: 28rpx;
		font-weight: normal;
	}

	.pay-success .order-info {
		background: #FFFFFF;
	}

	.pay-success .success-btns {
		margin-top: 24rpx;
		padding: 0 120rpx;
	}

	.pay-success .success-btns button {
		font-size: 32rpx;
	}

	.pay-success .success-btns button[type="default"] {
		border: 1px solid #04BE01;
		color: #04BE01;
	}
</style>
