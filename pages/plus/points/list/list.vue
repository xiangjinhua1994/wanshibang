<template>
	<view class="prodcut-list-wrap" :data-theme="theme()" :class="theme() || ''">
		<view class="point_top">
			<image src="../../../../static/point_bg.png" mode=""></image>
			<view class="tc pr">
				<view class="f60 fb white">{{ my_points }}</view>
				<view class="f26 white">我的积分</view>
			</view>
		</view>
		<view class="p-0-20 bg-white f32 gray3 fb ponit_title">好物兑换</view>
		<view class="list">
			<view class="item" v-for="(item, index) in listData" :key="index" @click="gotoList(item)">
				<view class="product-cover"><image :src="item.imagePath" mode="aspectFit"></image></view>
				<view class="product-info flex-1">
					<view class="product-title">{{ item.productName }}</view>
					<view class="already-sale d-b-c">
						<text>还剩{{ item.stock }}件</text>
					</view>
					<view class="price">
						<template v-if="item.sku[0].pointMoney != 0">
							¥
							<text class="num">{{ item.sku[0].pointMoney }}</text>
							<text class="f30">+</text>
						</template>

						<text class="num">{{ item.sku[0].pointNum }}</text>
						<text class="f26">积分</text>
					</view>
				</view>
				<view class="d-c-e"><view class="point_btn" :class="item.stock > 0 ? '' : 'btn-gray'">兑换</view></view>
			</view>
		</view>
		<!-- 没有记录 -->
		<view class="d-c-c p30" v-if="listData.length == 0 && !loading">
			<text class="iconfont icon-wushuju"></text>
			<text class="cont">亲，暂无相关记录哦</text>
		</view>
		<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
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
			/*是否加载完成*/
			loading: true,
			/*数据列表*/
			listData: [],
			/*最后一页码数*/
			last_page: 0,
			/*当前页面*/
			page: 1,
			/*每页条数*/
			list_rows: 10,
			no_more: false,
			my_points: 0
		};
	},
	onShow() {
		this.page = 1;
		this.listData = [];
		this.getData();
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
	onReachBottom() {
		let self = this;
		if (self.page < self.last_page) {
			self.page++;
			self.getData();
		}
		self.no_more = true;
	},
	methods: {
		/*获取数据*/
		getData() {
			let self = this;
			self.loading = true;
			self._postBody(
				'plus/points/product/index',
				{
					pageIndex: self.page || 1,
					pageSize: self.list_rows
				},
				function(res) {
					self.loading = false;
					self.listData = self.listData.concat(res.data.list.records);
					self.my_points = res.data.points;
					self.last_page = res.data.list.lastPage;
					if (res.data.list.lastPage <= 1) {
						self.no_more = true;
					}
				}
			);
		},

		/*跳转产品列表*/
		gotoList(e) {
			if (e.stock > 0) {
				this.gotoPage('/pages/plus/points/detail/detail?pointProductId=' + e.pointProductId);
			} else {
				this.showSuccess('该商品已售完');
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ffffff;
}

.point_top {
	position: relative;
	width: 750rpx;
	height: 240rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.point_top image {
	position: absolute;
	width: 750rpx;
	height: 240rpx;
	z-index: 0;
}

.prodcut-list-wrap .list {
	background: #ffffff;
	padding-left: 20rpx;
}

.ponit_title {
	padding-top: 40rpx;
}

.prodcut-list-wrap .list .item {
	padding: 30rpx 0;
	display: flex;
	border-bottom: 1px solid #dddddd;
}

.prodcut-list-wrap .product-cover,
.prodcut-list-wrap .product-cover image {
	width: 150rpx;
	height: 150rpx;
	border-radius: 12rpx;
}

.prodcut-list-wrap .product-info {
	flex: 1;
	margin-left: 26rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.prodcut-list-wrap .product-title {
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	font-size: 32rpx;
	width: 380rpx;
}

.prodcut-list-wrap .price {
	color: #f6220c;
	font-size: 20rpx;
	line-height: 28rpx;
}

.prodcut-list-wrap .price .num {
	padding: 0 4rpx;
	font-size: 36rpx;
}

.prodcut-list-wrap .already-sale {
	color: #999;
	font-size: 26rpx;
	margin-bottom: 18rpx;
}

.prodcut-list-wrap .already-sale .btn-red {
	line-height: 2;
	font-size: 28rpx;
}

.point_btn {
	width: 120rpx;
	height: 50rpx;
	background: linear-gradient(90deg, #7b45ff 0%, #961eff 100%);
	border-radius: 25rpx;
	font-size: 26rpx;
	color: #ffffff;
	line-height: 50rpx;
	text-align: center;
	margin-right: 30rpx;
}
.point_btn.btn-gray {
	background: #cccccc;
	color: #ffffff;
}
</style>
