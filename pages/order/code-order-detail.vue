<template>
	<view  :data-theme='theme()'  :class="'order-datail pb100' + theme()" v-if="!loadding">
		<!--详情状态-->
		<view class="order-state d-s-c">
			<view class="icon-box">
				<span v-if="detail.deliveryStatus == 0" class="icon iconfont icon-icon"></span>
				<span v-if="detail.deliveryStatus == 1" class="icon iconfont icon-xuanze"></span>
			</view>
			<view class="state-cont flex-1">
				<view class="state-txt d-b-c">
					<text class="desc f34" v-if="detail.deliveryStatus == 0">待发货</text>
					<text class="desc f34" v-if="detail.deliveryStatus == 1">已发货</text>
				</view>
				<view class="status-price pt10">市场价格：¥ {{ detail.productPrice }}
				</view>
			</view>
			<view class="dot-bg"></view>
		</view>

		<!--物流地址-->
		<view class="order-express p30 d-s-c">
			<view class="icon-box">
				<image style="width: 42rpx;height: 42rpx;" src="../../static/icon/address_icon.png" mode=""></image>
			</view>
			<view class="cont-text flex-1 o-h ml20 f30">
				<view class="express-text f32">{{ detail.name }}<text class="f26 gray9">
						{{ detail.mobile }}</text></view>
				<view class="gray3 f26 pt10">
					{{ detail.region.province }}{{ detail.region.city }}{{ detail.region.region }}{{ detail.detail }}
				</view>
			</view>
			<view class="icon iconfont icon-jiantou"></view>
		</view>

		<!-- 物流信息 -->
		<view class="group bg-white" v-if="detail.deliveryStatus == 1"
			@click="gotoExpress(detail.orderId)">
			<view class="d-b-c">
				<view class="f28">
					<view class="p-20-0">
						<text class="gray9">物流公司：</text>
						<text>{{ detail.expressName }}</text>
					</view>
					<view class="p-20-0">
						<text class="gray9">物流单号：</text>
						<text>{{ detail.expressNo }}</text>
					</view>
				</view>
				<view><text class="icon iconfont icon-jiantou"></text></view>
			</view>
		</view>

		<!--购物列表-->
		<view class="shops group bg-white">
			<view class="list">
				<view class="one-product p-20-0">
					<view class="d-s-c">
						<view class="cover">
							<image :src="detail.productImage" mode="aspectFit"></image>
						</view>
						<view class="flex-1">
							<view class="p-0-30 text-ellipsis-2 gray3 f30">
								{{ detail.productName }}
							</view>
							<view class="pt10 p-0-30 gray6 f24">
								{{detail.productAttr}}
							</view>
							<view class="pt10 p-0-30 d-b-c">
								<template>
									<view class="f22">
										¥
										<text class="f40">{{ detail.productPrice }}</text>
									</view>
								</template>
								<view class="f24 gray9">x1</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!--订单信息-->
		<view class="group bg-white f26">
			<view class="p-20-0">
				<text class="">订单编号：</text>
				<text>{{ detail.orderNo }}</text>
			</view>
			<view class="p-20-0">
				<text class="">下单时间：</text>
				<text>{{ detail.createTime }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*是否显示支付类别弹窗*/
				isPayPopup: false,
				/*订单id*/
				orderId: 0,
				/*订单详情*/
				detail: {
					orderStatus: [],
					address: {
						region: []
					},
					product: [],
					payType: [],
					deliveryType: [],
					payStatus: []
				},
				extractStore: {},
				/*是否显示拼团*/
				is_fightgroup: false,
			};
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
			/*获取数据*/
			getData() {
				let self = this;
				let orderId = self.orderId;
				self._post(
					'card/order/detail', {
						orderId: orderId
					},
					function(res) {
						self.detail = res.data;
						self.loadding = false;
						uni.hideLoading();
					}
				);
			},
			/*查看物流*/
			gotoExpress(orderId) {
				this.gotoPage('/pages/order/express/code-express?orderId=' + orderId);
			},
		}
	};
</script>

<style scoped>
	page {}

	.order-express {
		background: #ffffff;
		margin: 0 20rpx;
		border-radius: 12rpx;
		margin-top: 20rpx;
	}

	.order-express .icon-box .iconfont {
		font-size: 50rpx;
	}

	.order-datail {
		padding-bottom: 90rpx;
		background-color: #F2F2F2;
	}

	.order-datail .fight-users {
		margin: 0 auto;
	}

	.order-datail .fight-users .user-box {
		width: 80rpx;
		height: 80rpx;
		margin: 10rpx;
		border-radius: 50%;
		border: 1px dashed #cccccc;
	}

	.order-datail .fight-users {
		padding: 30rpx;
	}

	.order-datail .fight-users .user-box image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.order-datail .fight-users .user-box .leader {
		position: absolute;
		top: -20rpx;
		left: 50%;
		margin-left: -30rpx;
		width: 60rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		color: #ffffff;
		border-radius: 30rpx;
		border: 1px solid #ffffff;
		background: red;
	}

	.order-datail .fight-users .user-box.user-who {
		font-size: 50rpx;
		color: #999999;
	}

	.state-cont .countdown-datetime {
		margin-top: 16rpx;
	}

	.state-cont .countdown-datetime text {
		padding: 4rpx 8rpx;
		border-radius: 4rpx;
		background: rgba(0, 0, 0, .4);
	}

	.icon-dianpu1 {
		margin-right: 15rpx;
	}

	.kefu {
		border-top: 1rpx solid #cacaca;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.kefu .icon-kefu2 {
		color: #1296db;
		margin-right: 8rpx;
	}

	.group {
		margin: 0 20rpx;
		margin-top: 20rpx;
		border-radius: 12rpx;
	}

	.foot-btns button {
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 30rpx;
	}
</style>