<template>
	<view :data-theme="theme()" :class="theme() || ''" class="coupon_bg" v-if="!loading">
		<!-- #ifdef APP-PLUS -->
		<header-bar></header-bar>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="titleBar">
			<view class="head_top" :style="'height:' + statusBarHeight + 'px;'"></view>
			<view class="tc d-c-c f32 pr" :style="'height:' + titleBarHeight + 'px;z-index:100'">
				<view class="reg180" @click="goback"><text class="icon iconfont icon-jiantou"></text></view>
				<view>优惠券</view>
			</view>
			<view :style="'height:' + titleHeight + 'px;opacity:' + opacity + ';'" class="top_bg"></view>
		</view>
		<view :style="'height:' + titleHeight + 'px;'">
			<view class="head_top" :style="'height:' + statusBarHeight + 'px;'"></view>
			<view :style="'height:' + titleBarHeight + ' px;'"></view>
		</view>
		<!-- #endif -->
		<view class="coupon-detail-top">
			<view class="top_box">
				<!-- 优惠券 -->
				<view class="item-wrap">
					<view :class="'coupon-item coupon-item-' + detail.colorText">
						<!-- <view class="coupon_type">{{ detail.supplier && detail.supplier.name == '平台优惠券' ? '平台通用' : detail.name }}</view> -->
						<view class="operation d-b-c w-b">
							<view class="flex-1 coupon-content">
								<view class="mb20 text-ellipsis">
									<text class="f40 fb">{{ detail.name }}</text>
								</view>
								<view class="f22 gray9 mb20">
									<template v-if="detail.expireType == 10">
										有效期：领取{{ detail.expireDay }}天内有效
									</template>
									<template v-if="detail.expireType == 20">
										有效期：{{ detail.startTimeText }}至{{ detail.endTimeText }}
									</template>
								</view>
								<view v-if="detail.bigPrice != 0" class="f22">(最大优惠{{ detail.bigPrice }}元)</view>
							</view>
							<view class="right-box d-c-c d-c">
								<view class="theme-price mb10" v-if="detail.couponType == 10">
									<text class="f24">￥</text>
									<text class="f52 fb">{{ detail.reducePrice * 1 }}</text>
								</view>
								<view class="mb10 theme-price" v-if="detail.couponType == 20">
									<text class="f52 fb">{{ detail.discount / 10 }}</text>
									<text class="f24">折</text>
								</view>
								<view class="f24 mb10">{{ detail.minPrice > 0 ? '满' + detail.minPrice * 1 + '元可用' : '无门槛' }}</view>
								<view v-if="detail.state.value == 1" class="f26 coupon-btn theme-btn" @click="receiveCoupon()">领取</view>
								<button type="default" v-else class="f26 coupon-btn btn-gray white" @click="receiveCoupon()">{{ detail.state.text }}</button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!--  -->
			<view class="redF6 f26 fb pt30 d-c-c" v-if="applyRange != 10">
				<image class="decorate" src="/static/icon/coupons_arrow.png" mode="aspectFill"></image>
				<text class="ml10 mr10">指定以下商品使用</text>
				<image class="decorate" src="/static/icon/coupons_arrow.png" mode="aspectFill"></image>
			</view>
			<!-- 商品列表 -->
			<view class="o-h pro_list" v-if="applyRange != 10">
				<view class="d-b-c f-w">
					<view class="pro_item" v-for="(item, index) in listData" :key="index" @click="gotoPage('/pages/product/detail/detail?productId=' + item.productId)">
						<view class="pro_item_image"><image :src="item.productImage || '/static/default.png'" mode="aspectFill"></image></view>
						<view class="f26 gray3 text-ellipsis mt20 mb23 tc">{{ item.productName }}</view>
						<view class="fb redF6 tc">
							<text class="f22">￥</text>
							<text class="f32">{{ item.productPrice }}</text>
						</view>
						<view class="d-c-c"><button class="add_btn">加入购物车</button></view>
					</view>
				</view>
				<!-- 没有记录 -->
				<view class="d-c-c p30 ww100" v-if="listData.length == 0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">亲，暂无相关记录哦</text>
				</view>
				<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
			</view>
		</view>
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
			loading: true,
			statusBarHeight: 0,
			titleBarHeight: 0,
			titleHeight: 0,
			opacity: 0,
			couponId: 0,
			listData: [],
			detail: {},
			applyRange: 10,
			/*最后一页码数*/
			last_page: 0,
			/*当前页面*/
			page: 1,
			/*每页条数*/
			list_rows: 10,
			no_more: false
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
	onPageScroll(e) {
		if (e.scrollTop < 100) {
			this.opacity = e.scrollTop / 100;
		} else {
			this.opacity = 1;
		}
	},
	onReady() {
		uni.setNavigationBarColor({
			frontColor: '#000000',
			backgroundColor: '#FFFFFF'
		});
	},
	onLoad(e) {
		this.couponId = e.couponId;
		this.applyRange = e.applyRange;
		this.GetStatusBarHeight();
	},
	onShow() {
		this.page = 1;
		this.listData = [];
		/*获取数据*/
		this.getData();
	},
	onReachBottom() {
		let self = this;
		if (self.applyRange == 20) {
			return;
		}
		if (self.page < self.last_page) {
			self.page++;
			self.getData();
		}
		self.no_more = true;
	},
	methods: {
		GetStatusBarHeight() {
			const SystemInfo = uni.getSystemInfoSync();
			// #ifdef MP-WEIXIN
			let that = this;
			let statusBarHeight = SystemInfo.statusBarHeight;
			this.statusBarHeight = uni.getMenuButtonBoundingClientRect().top;
			this.titleBarHeight = uni.getMenuButtonBoundingClientRect().height;
			this.titleHeight = this.statusBarHeight + this.titleBarHeight + 8;
			// #endif
			// #ifndef MP-WEIXIN
			this.statusBarHeight = SystemInfo.statusBarHeight;
			this.titleHeight = this.statusBarHeight;
			// #endif
		},
		getData() {
			let self = this;
			self.loading = true;
			uni.showLoading({
				title: '加载中'
			});
			let params = {
				couponId: self.couponId
			};
			if (self.applyRange != 20) {
				params.pageIndex = self.page || 1;
				params.PageSize = self.list_rows;
			}
			self._get('coupon/coupon/detail', params, function(res) {
				uni.hideLoading();
				self.loading = false;
				self.detail = res.data;
				if (self.applyRange == 20) {
					self.listData = res.data.productList;
				} else if (self.applyRange == 30) {
					self.listData = self.listData.concat(res.data.productList);
					// self.last_page = res.data.productList;
					// if (res.data.productList.last_page <= 1) {
					// 	self.no_more = true;
					// }
				}
			});
		},
		receiveCoupon() {
			let self = this;
			if (self.detail.state.value == 0) {
				return false;
			}
			self._post(
				'user/coupon/receive',
				{
					couponId: self.detail.couponId
				},
				function(result) {
					uni.showToast({
						title: '领取成功',
						icon: 'success',
						mask: true,
						duration: 2000
					});
					self.detail.state.value = 0;
					self.detail.state.text = '已领取';
				}
			);
		},
		goback() {
			uni.navigateBack();
		}
	}
};
</script>

<style>
page {
}

.coupon_bg {
	background: linear-gradient(0deg, #fffdd7 0%, #fee6df 100%);
}

.titleBar {
	position: fixed;
	width: 100%;
	top: 0;
	z-index: 100;
}

.top_bg {
	width: 750rpx;
	position: absolute;
	background: linear-gradient(41deg, #fff4f1 13%, #fdfff7 48%, #f6fffb 75%, #fff2ee 100%);
	z-index: 99;
	top: 0;
}

.top_box {
	background: rgba(0, 0, 0, 0.05);
	padding: 28rpx 30rpx 30rpx 30rpx;
	border-radius: 20rpx;
	margin-top: 10rpx;
	margin-bottom: 5rpx;
}

.coupon-wrap {
	padding: 30rpx;
}

.coupon-detail-top {
}

.decorate {
	width: 16rpx;
	height: 16rpx;
}

.add_btn {
	width: 181rpx;
	height: 40rpx;
	background: #f6220c;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #ffffff;
	padding: 0;
	border: none;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 22rpx;
}

.add_btn .icon-jia {
	color: #ffffff;
	font-size: 18rpx;
}

.pro_list {
	padding: 0 30rpx;
	padding-bottom: 80rpx;
}

.pro_item {
	width: 335rpx;
	border-radius: 12rpx;
	overflow: hidden;
	background-color: #ffffff;
	margin-top: 20rpx;
}

.pro_item_image > image {
	width: 335rpx;
	height: 270rpx;
}

.head_top {
	position: relative;
	line-height: 30px;
	color: #ffffff;
	font-size: 32rpx;
}

.reg180 {
	padding-right: 20rpx;
	text-align: right;
	transform: rotateY(180deg);
	position: absolute;
	bottom: 0;
	height: 100%;
	display: flex;
	align-items: center;
	left: 0;
}

.icon-jiantou {
	color: #333333;
	font-size: 32rpx;
}
</style>
