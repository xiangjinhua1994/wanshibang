<template>
	<view  :data-theme='theme()' :class="theme() || ''">
		<view class="top-tabbar">
			<view :class="state_active == 0 ? 'tab-item active' : 'tab-item'" @click="stateFunc(0)">全部订单</view>
			<view :class="state_active == 1 ? 'tab-item active' : 'tab-item'" @click="stateFunc(1)">待发货</view>
			<view :class="state_active == 2 ? 'tab-item active' : 'tab-item'" @click="stateFunc(2)">已发货</view>
		</view>
		<!--列表-->
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			@scrolltolower="scrolltolowerFunc">
			<view :class="topRefresh ? 'top-refresh open' : 'top-refresh'">
				<view class="circle" v-for="(circle, n) in 3" :key="n"></view>
			</view>
			<view class="order-list">
				<view class="item" v-for="(item, index) in listData" :key="index">
					<view class="order-head d-b-c">
						<view>
							<text class="shop-name flex-1 fb">订单号：{{ item.orderNo }}</text>
						</view>
						<view class="state">
							<text class="red" v-if="item.deliveryStatus == 0">待发货</text>
							<text class="red" v-if="item.deliveryStatus == 1">已发货</text>
						</view>
					</view>
					<!--一个商品显示-->
					<view class="one-product d-s-c" @click="gotoOrder(item.orderId)">
						<view class="cover">
							<image :src="item.productImage" mode="aspectFit"></image>
						</view>
						<view class="pro-info flex-1">{{ item.productName }}</view>
						<view class="total-count">
							<view class="left-shadow"></view>
							<view class="price theme-price f22">
								¥
								<text class="f40 theme-price">{{ item.productPrice }}</text>
							</view>
							<view class="count">共1件</view>
						</view>
					</view>
				</view>
				<view class="d-c-c p30" v-if="listData.length == 0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">亲，暂无相关记录哦</text>
				</view>
				<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
			</view>
		</scroll-view>
		<!-- <tabBar></tabBar> -->
		<keep-alive>
			<tabBar></tabBar>
		</keep-alive>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*状态选中*/
				state_active: 0,
				/*顶部刷新*/
				topRefresh: false,
				/*数据*/
				listData: [],
				/*数据类别*/
				dataType: 'all',
				/*是否显示支付类别弹窗*/
				isPayPopup: false,
				/*支付方式*/
				pay_type: 20,
				/*订单id*/
				order_id: 0,
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
				/*有没有等多*/
				no_more: false,
				/*是否正在加载*/
				loading: true,
				/*是否显示核销二维码*/
				isCodeImg: false,
				codeImg: '',
			};
		},
		computed: {
			/*加载中状态*/
			loadingType() {
				if (this.loading) {
					return 1;
				} else {
					if (this.listData.length != 0 && this.no_more) {
						return 2;
					} else {
						return 0;
					}
				}
			}
		},
		onLoad(e) {
			if (typeof e.dataType != 'undefined') {
				this.dataType = e.dataType;
			}

			if (this.dataType == 'wait') {
				this.state_active = 1;
			} else if (this.dataType == 'send') {
				this.state_active = 2;
			} 
		},
		mounted() {
			this.init();
			/*获取订单列表*/
			this.getData();
		},
		methods: {
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.phoneHeight = res.windowHeight;
						// 计算组件的高度
						let view = uni.createSelectorQuery().select('.top-tabbar');
						view.boundingClientRect(data => {
							let h = self.phoneHeight - data.height;
							self.scrollviewHigh = h;
						}).exec();
					}
				});
			},

			/*状态切换*/
			stateFunc(e) {
				let self = this;
				if (self.state_active != e) {
					self.page = 1;
					self.loading = true;
					self.state_active = e;
					switch (e) {
						case 0:
							self.listData = [];
							self.dataType = 'all';
							break;
						case 1:
							self.listData = [];
							self.dataType = 'wait';
							break;
						case 2:
							self.listData = [];
							self.dataType = 'send';
							break;
					}
					self.getData();
				}
			},

			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {
				let self = this;
				if (self.no_more) {
					return;
				}
				self.page++;
				if (self.page <= self.last_page) {
					self.getData();
				} else {
					self.no_more = true;
				}
			},

			/*获取数据*/
			getData() {
				let self = this;
				self.loading = true;
				let dataType = self.dataType;
				self._postBody(
					'card/order/lists', {
						dataType: dataType,
						pageIndex: self.page,
						pageSize: self.list_rows
					},
					function(res) {
						self.loading = false;
						self.listData = self.listData.concat(res.data.records);
						self.last_page = res.data.lastPage;
						if (res.data.lastPage <= 1) {
							self.no_more = true;
						} else {
							self.no_more = false;
						}
					}
				);
			},

			/*跳转页面*/
			gotoOrder(e) {
				this.gotoPage('/pages/order/code-order-detail?orderId=' + e);
			},

			/*隐藏支付方式*/
			hidePopupFunc() {
				this.isPayPopup = false;
			},

			/*去支付*/
			payTypeFunc(payType) {
				let self = this;
				self.isPayPopup = false;
				uni.showLoading({
					title: '加载中'
				});
				self._post(
					'user.order/pay', {
						payType: payType,
						order_id: self.order_id,
						pay_source: self.getPlatform()
					},
					function(res) {
						pay(res, self);
					}
				);
			},

			/*支付方式选择*/
			onPayOrder(orderId) {
				let self = this;
				self.isPayPopup = true;
				self.order_id = orderId;
			},

			/*确认收货*/
			orderReceipt(order_id) {
				let self = this;
				wx.showModal({
					title: '提示',
					content: '您确定要收货吗?',
					success: function(o) {
						if (o.confirm) {
							uni.showLoading({
								title: '正在处理'
							});
							self._post(
								'card.order/receipt', {
									order_id: order_id
								},
								function(res) {
									uni.hideLoading();
									uni.showToast({
										title: res.msg,
										duration: 2000,
										icon: 'success'
									});
									self.listData = [];
									self.getData();
								}
							);
						} else {
							uni.showToast({
								title: '取消收货',
								duration: 1000,
								icon: 'none'
							});
						}
					}
				});
			},

			/*取消订单*/
			cancelOrder(e) {
				let self = this;
				let order_id = e;
				wx.showModal({
					title: '提示',
					content: '您确定要取消吗?',
					success: function(o) {
						if (o.confirm) {
							uni.showLoading({
								title: '正在处理'
							});
							self._get(
								'card.order/cancel', {
									order_id: order_id
								},
								function(res) {
									uni.hideLoading();
									uni.showToast({
										title: '操作成功',
										duration: 2000,
										icon: 'success'
									});
									self.listData = [];
									self.getData();
								}
							);
						}
					}
				});
			},

			/*去评论*/
			gotoEvaluate(e) {
				this.gotoPage('/pages/order/evaluate/evaluate?order_id=' + e);
			},

			/*核销码*/
			onQRCode(e) {
				let self = this;
				uni.showLoading({
					title: '加载中'
				});
				let order_id = e;
				self._get(
					'user.order/qrcode', {
						order_id: order_id,
						source: self.getPlatform()
					},
					function(res) {
						uni.hideLoading();
						self.isCodeImg = true;
						self.codeImg = res.data.qrcode;
					}
				);
			},
			/*关闭核销二维码*/
			hideCodePopupFunc() {
				this.isCodeImg = false;
			},

			/*分享拼团*/
			gotoAssembleShare(e) {
				let url = '/pages/plus/assemble/fight-group-detail/fight-group-detail?assemble_bill_id=' + e;
				this.gotoPage(url);
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}

	.top-tabbar {
		height: 96rpx;
	}

	.order-list .order-head .state-text {
		padding: 10rpx 12rpx;
		margin-right: 21rpx;
		border-radius: 4rpx;
		background: #FFE7E4;
		font-size: 22rpx;
		color: #F6220C;
	}

	.shop-name {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
	}

	.order-list .item {
		margin-bottom: 30rpx;
		padding: 30rpx;
		background: #ffffff;
	}

	.order-list .product-list,
	.order-list .one-product {
		padding: 30rpx 0 27rpx 0;
		height: 150rpx;
	}

	.one-product .pro-info {
		padding: 0 21rpx 0 37rpx;
		display: -webkit-box;
		width: 361rpx;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 26rpx;
		color: #333333;
	}

	.order-list .cover,
	.order-list .cover image {
		width: 150rpx;
		height: 150rpx;
		border-radius: 8rpx;
	}

	.order-list .total-count {
		padding-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
	}

	.total-count .count {
		padding-top: 16rpx;
		color: #999999;
		font-size: 22rpx;
	}

	.product-list .total-count {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.9);
	}

	.product-list .total-count .left-shadow {
		position: absolute;
		top: 0;
		bottom: 0;
		left: -24rpx;
		width: 24rpx;
		overflow: hidden;
	}

	.product-list .total-count .left-shadow::after {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 24rpx;
		right: -12rpx;
		display: block;
		content: '';
		background-image: radial-gradient(rgba(0, 0, 0, 0.2) 10%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0) 80%);
	}

	.order-list .order-bts {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.order-list .order-bts button {
		margin: 0;
		padding: 0 30rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin-left: 20rpx;
		font-size: 32rpx;
		border: 1px solid #F6220C;
		border-radius: 30px;
		background: #ffffff;
		white-space: nowrap;
		color: #F6220C;
		font-family: PingFang SC;
	}

	.order-list .order-bts button::after {
		display: none;
	}

	.order-list .order-bts button.btn-border-red {
		border: 1px solid $dominant-color;
		font-size: 24rpx;
		color: $dominant-color;
	}

	.order-list .order-bts button.btn-red {
		background: linear-gradient(90deg, #FF6B6B 4%, #F6220C 100%);
		border-radius: 30rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		color: #ffffff;
		border: none;
	}

	.buy-checkout {
		width: 100%;
	}

	.buy-checkout .item {
		min-height: 50rpx;
		line-height: 50rpx;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
	}

	.buy-checkout .iconfont.icon-weixin {
		color: #04be01;
		font-size: 50rpx;
	}

	.buy-checkout .iconfont.icon-yue {
		color: #f0de7c;
		font-size: 50rpx;
	}

	.buy-checkout .item.active .iconfont.icon-xuanze {
		color: #04be01;
	}

	.item-dianpu {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		line-height: 30rpx;
	}

	.item-dianpu .icon-jiantou {
		font-size: 24rpx;
		color: #333333;
	}

	.item-d-l {
		display: flex;
	}

	.icon-dianpu1 {
		margin-right: 20rpx;
		color: #333333;
		font-size: 32rpx;
	}
</style>