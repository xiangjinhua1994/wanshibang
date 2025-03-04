<template>
	<view class="seckill-product-wrap"  :data-theme='theme()' :class="theme() || ''">
		<!--活动广告-->
		<view class="top-box">
			<!--活动类别-->
			<view class="active-top-tab">
				<scroll-view scroll-X="true" show-scrollbar="false" class="scroll-X  mb30">
					<view class="tab-list d-s-c">
						<view class="tab-item" :class="{ active: type_active == index }" v-for="(item, index) in activeList" :key="index"
						 @click="tabTypeFunc(index)">
							{{ item.title }}
						</view>
					</view>
				</scroll-view>
				<view class="ad-activity" v-if="listData.detail">
					<image :src="listData.detail.filePath" mode=""></image>
				</view>
				<!--活动时间-->
				<view class="ad-datetime ww100 pt40 pb10 d-c-c" v-if="listData.detail">
					<Countdown ref='countdown' :config="countdownConfig" @returnVal="returnValFunc"></Countdown>
				</view>
				<view class="every-day-time d-c-c mb20">
					<text>每日活动时间：{{currActive.dayStartTime}}至{{currActive.dayEndTime}}</text>
				</view>
			</view>
		</view>
		<view class="seckill-list-wrap" v-if="!loading">
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50">
				<!--列表-->
				<view class="list p-0-20">
					<view class="item d-stretch" v-for="(item, index) in listData.list" :key="index">
						<view class="product-cover">
							<image :src="item.filePath" mode="aspectFit"></image>
						</view>
						<view class="d-b-c d-c flex-1 ml26">
							<view class="product-title ww100">{{ item.productName }}</view>
							<view class="price ww100 red">
								<text class="f24">秒杀价：￥</text>
								<text class="num f36 fb">{{ item.seckillPrice }}</text>
								<text class="ml20 text-d-line gray9 f24">￥{{ item.productPrice }}</text>
							</view>
							<view class="slider-box ww100 d-b-c">
								<view class="left flex-1">
									<text class="already-sale">已抢购{{ item.totalSales }}件</text>
									<view class="slider">
										<view class="slider-inner" :style="'width:' + (item.productSales / (item.productSales + item.stock)) * 100 + '%;'"></view>
									</view>
								</view>
								<view class="right-btn ml30">
									<button v-if="status == 0 && item.stock > 0" type="primary" @click="gotoDetail(item.productId)">马上抢</button>
									<button v-if="status == 1" type="default" class="btn-gray">未开始</button>
									<button v-if="status == 2" type="default" class="btn-gray">已结束</button>
									<button v-if="item.stock == 0 && status == 0" type="default" class="btn-gray">已抢光</button>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 没有记录 -->
				<view class="d-c-c p30" v-if="listData.list.length == 0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">亲，暂无相关记录哦</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import Countdown from '@/components/countdown/countdown.vue';
	export default {
		components: {
			Countdown
		},
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*活动列表*/
				activeList: [],
				/*当前活动角标*/
				type_active: 0,
				/*类别选中*/
				currActive: {},
				/*产品列表*/
				listData: [],
				/*活动详情*/
				detailData: {},
				/*是否正在加载*/
				loading: true,
				/*倒计时配置*/
				countdownConfig: {
					/*开始时间*/
					startstamp: 0,
					/*结束时间*/
					endstamp: 0
				},
				status: -1, //1未开始 2已过期 0进行中
			};
		},
		computed: {},
		onShow() {
			this.getActive();
		},
		mounted() {
			this.init();

		},
		onPullDownRefresh() {},
		methods: {
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
						// 计算组件的高度
						let view = uni.createSelectorQuery().select('.top-box');
						view.boundingClientRect(data => {
							let h = _this.phoneHeight - data.height + 43;
							_this.scrollviewHigh = h;
						}).exec();
					}
				});
			},

			/*类别切换*/
			tabTypeFunc(e) {
				this.type_active = e;
				this.currActive = this.activeList[e];
				this.getData();
			},
			goback() {
				uni.navigateBack({

				})
			},
			/*获取活动类别*/
			getActive() {
				let self = this;
				let param = {};
				self.loading = true;
				self._get(
					'plus/seckill/product/active', {
						param
					},
					function(res) {
						self.activeList = res.data;
						if (self.activeList && self.activeList.length > 0) {
							self.currActive = self.activeList[0];
							self.getData();
						}
					}
				);
			},

			/*获取数据*/
			getData() {
				let self = this;
				self.loading = true;
				self._get(
					'plus/seckill/product/product', {
						seckillActivityId: self.currActive.seckillActivityId
					},
					function(res) {
						self.listData = res.data;
						self.countdownConfig.endstamp = res.data.detail.endTime;
						self.countdownConfig.startstamp = res.data.detail.startTime;
						uni.hideLoading();
						self.loading = false;
					}
				);
			},

			/*跳转产品详情*/
			gotoDetail(e) {
				this.$refs.countdown.clear();
				this.gotoPage('/pages/product/detail/detail?productId=' + e);
			},

			/*跳转搜索页面*/
			gotoSearch() {
				this.getData();
			},

			/*倒计时返回值*/
			returnValFunc(e) {
				this.status = e;
				// 如果原来未开始变成已开始
				if(this.listData.detail.status_text == '未开始' && e == 0){
					this.countdownConfig.endstamp = this.listData.detail.end_time;
					this.countdownConfig.startstamp = this.listData.detail.start_time;
				}
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #F2F2F2;
	}

	.top-box {
		position: relative;
	}

	.seckill-product-wrap .tab-item {
		flex: 0;
		padding: 0 30rpx;
		font-size: 33rpx;
		height: 86rpx;
		line-height: 86rpx;
		white-space: nowrap;
		color: #333333;
	}

	.seckill-product-wrap .tab-item.active {
		color: #F6220C;
		font-size: 33rpx;
		opacity: 1;
		position: relative;
	}

	.seckill-product-wrap .tab-item.active::after {
		content: "";
		width: 120rpx;
		height: 4rpx;
		background: #F6220C;
		border-radius: 2rpx;
		position: absolute;
		border: 30rpx;

	}

	.seckill-product-wrap .every-day-time text {
		padding: 8rpx 16rpx;
		font-size: 26rpx;
		color: #333;
		opacity: 0.5;
	}

	.seckill-product-wrap .ad-activity {
		position: relative;
		overflow: hidden;
	}

	.seckill-product-wrap .ad-activity image {
		width: 750rpx;
		height: 367rpx;
		border-radius: 12rpx;
	}

	.seckill-list-wrap {}

	.seckill-list-wrap .list .item {
		padding: 30rpx;
		display: flex;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		background: #ffffff;
	}

	.seckill-list-wrap .product-cover,
	.seckill-list-wrap .product-cover image {
		width: 200rpx;
		height: 200rpx;
	}

	.active-top-tab .ad-datetime::v-deep .box {
		height: 40rpx;
		padding: 4rpx;
		line-height: 40rpx;
		text-align: center;
		border-radius: 8rpx;
		font-size: 28rpx;
		background: #F6220C;
		color: #FFFFFF;
	}

	.active-top-tab .ad-datetime::v-deep text {
		color: #333;
		font-size: 28rpx;
	}

	.seckill-list-wrap .product-title {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 26rpx;
	}

	.seckill-list-wrap .already-sale {
		padding: 4rpx 0;
		color: #8228EB;
		font-size: 22rpx;
	}

	.seckill-list-wrap .slider-box .slider {
		margin-top: 11rpx;
		height: 8rpx;
		background: #F2F2F2;
		border-radius: 5rpx;
	}

	.seckill-list-wrap .slider-box .slider-inner {
		height: 8rpx;
		background: linear-gradient(-90deg, #CB2BFF 0%, #7727E7 100%);
		border-radius: 4rpx;
	}

	.seckill-list-wrap .right-btn button {
		background: linear-gradient(90deg, #FF6B6B 4%, #F6220C 100%);
		color: #ffffff;
		height: 60rpx;
		border-radius: 30rpx;
		line-height: 60rpx;
	}
	
	.seckill-list-wrap .right-btn button.btn-gray{
		background: #CCCCCC;
		color: #FFFFFF;
	}

	.reg180 {
		padding-right: 20rpx;
		text-align: right;
		transform: rotateY(180deg);
		position: absolute;
		bottom: 0;
	}

	.icon-jiantou {
		color: #FFFFFF;
		font-size: 30rpx;
	}

	.head_top {
		position: absolute;
		top: 0;
		z-index: 20;
		padding-top: var(--status-bar-height);
		height: 30px;
		line-height: 30px;
		color: #FFFFFF;
		font-size: 28rpx;
	}

	.tab-item.active::after {
		content: '';
		width: 60%;
		height: 4rpx;
		background: #F2F2F2;
		border-radius: 2rpx;
		position: absolute;
		bottom: 5rpx;
	}
</style>
