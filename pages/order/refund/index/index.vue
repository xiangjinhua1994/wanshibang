<template>
	<view class="refund-list" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
		<!-- <view class="top-tabbar">
			<view :class="state_active==-1?'tab-item active':'tab-item'">
				退款/售后
			</view>
			<view :class="state_active==0?'tab-item active':'tab-item'" @click="stateFunc(0)">
				待处理
			</view>

		</view> -->
		<view style="position: fixed;top:0;left:0;width: 100%;z-index: 9999;background-color: #fff;">
			<view class="head_top" :style="'height:' + topBarTop() + 'px;'" style="background-color: #fff;"></view>
			<headTitle title="退款/售后" bg="#fff">
			</headTitle>
		</view>
		
		<view class="d-c-c p30" v-if="tableData.length==0">
			<dataNull></dataNull>
		</view>
		<scroll-view scroll-y="true" v-if="tableData.length>0" style="height:99vh" class="scroll-Y" lower-threshold="50"
			@scrolltoupper="scrolltoupperFunc" @scrolltolower="scrolltolowerFunc">
			<!-- <view :class="topRefresh?'top-refresh open':'top-refresh'">
				<view class="circle" v-for="(circle,n) in 3" :key="n"></view>
			</view> -->
			<view class="list" style="margin-top: 180rpx;">
				<view style="margin-bottom: 40rpx;padding-left:44rpx;padding-top:44rpx;padding-right:32rpx;border-radius:28rpx" class="item bg-white" v-for="(item,index) in tableData" :key="index">
					<view class="orderNo">
						<text>订单编号</text>
						<text style="margin-left: 10rpx;">{{item.orderNo}}</text>
						<text class="red" style="position: absolute;right:52rpx" v-if="item.stateText=='进行中'">{{item.stateText}}</text>
						<text style="position: absolute;right:52rpx" v-else>{{item.stateText}}</text>
					</view>
					<view class="one-product d-s-c pt20">
						<view class="cover">
							<image :src="item.orderProduct.productImage" mode="aspectFit"></image>
						</view>
						<view class="flex-1">
							<view class="pro-info2" style="margin-left:32rpx">{{item.orderProduct.productName}}</view>
							<!-- <view class="pt10 p-0-30">
								<text class="f24 gray9">
								</text>
							</view> -->
							<view class="pt20" style="display: flex;padding-left:32rpx;align-items: center;justify-content: space-between;">
								<view>
									申请数量:
									<text>{{item.refundNumber}}</text>
								</view>
								<view>
									退款金额:
									<text >¥{{item.applyMoney}}</text>
								</view>
							</view>
						</view>

					</view>
					
					<!-- <view class="d-e-c pt10">
						<view>
							订单实付金额：
							<text class="red">¥{{item.orderProduct.totalPayPrice}}</text>
						</view>
					</view> -->
					<view style="position: relative;padding-bottom:40rpx;width:100%;display: flex;justify-content: flex-end;align-items: center;">
						<view class="" style="width:144rpx;height:80rpx; border: 1.5rpx solid #000000;border-radius:60rpx;line-height: 80rpx;position: relative;text-align:center" @click="gotoRefundDetail(item.orderRefundId)">
							查看详情
							<!-- <view class="order-btn"
								@click="gotoRefundDetail(item.orderRefundId)">查看详情</view> -->
						</view>

					</view>
					
				</view>

				<!-- <view class="">
					<view class="bottom-refresh">
						<view class="d-c-c p30" v-if="tableData.length!=0&&no_more">
							<text class="gray3">亲, 没有更多了</text>
						</view>
						<view v-if="loading" class="d-c-c p30">
							<text class="gray3">加载中...</text>
						</view>
					</view>
				</view> -->
				<!-- 没有记录 -->
				
				<!-- <uni-load-more v-else :loadingType="loadingType"></uni-load-more> -->
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more.vue";
	import headTitle from '@/pages/component/headTitle.vue';
	import dataNull from '@/pages/component/dataNull.vue';

	export default {
		components: {
			startX: '', // 触摸起始点横坐标
      		deltaX:'',
			uniLoadMore,
			headTitle,
			dataNull
		},
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*选中状态*/
				state_active: -1,
				/*页面数据*/
				tableData: [],
				list_rows: 10,
				last_page: 0,
				page: 1,
				no_more: false,
				loading: true,
				/*顶部刷新*/
				topRefresh: false,

			}
		},
		computed: {
			/*加载中状态*/
			// loadingType() {
			// 	if (this.loading) {
			// 		return 1;
			// 	} else {
			// 		if (this.tableData.length != 0 && this.no_more) {
			// 			return 2;
			// 		} else {
			// 			return 0;
			// 		}
			// 	}
			// }
		},
		mounted() {
			this.init();
			/*获取页面数据*/
			this.getData();

		},
		onPullDownRefresh() {
			/*下拉到顶，页面值还原初始化*/
			//this.restoreData();
			//this.getData();
		},
		onBackPress(options) {
		console.log(options,'options88')
    // const pages = getCurrentPages();
    // const prevPage = pages[pages.length - 2]; // 上一个页面
		if (options.from === 'navigateBack') {
        this.gotoPage('/pages/user/index/index');
      // this.gotoPage('/pages/order/order-detail?orderId=' + this.order_id);
      // uni.navigateBack({
      //       delta: 1,
      //       success: () => {
      //         prevPage.$vm.getNews(); // 直接调用上个页面的刷新方法
      //       }
      //     });
			return true;
		}
    return true;
  
	},
		methods: {
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
				if (this.deltaX > 200) {
					// 向右滑动逻辑   这里只建议写一些性能消耗小的逻辑，比如：this.status = !this.status 因为当他的横坐标大于或小于50时，每隔一个数字都会执行一次，所以...非常消化性能
					console.log('向右滑动逻辑',this.deltaX,this.startX)
					this.gotoPage('/pages/user/index/index');
				} else if (this.deltaX < -50) {
					// 向左滑动逻辑   这里只建议写一些性能消耗小的逻辑，比如：this.status = !this.status 因为当他的横坐标大于或小于50时，每隔一个数字都会执行一次，所以...非常消化性能
					//console.log('向左滑动逻辑',this.deltaX)
				}
				this.startX = 0;
				this.deltaX = 0;
				// 清除触摸起始点记录，这里也可以写一些比较复杂的逻辑，每滑动一次松后执行。
			},
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.phoneHeight = res.windowHeight;
						// 计算组件的高度
						let view = uni.createSelectorQuery().select('.head_top');
						view.boundingClientRect(data => {
							let h = self.phoneHeight - data.height;
							self.scrollviewHigh = h;
						}).exec();
					}
				});
			},
			/*页面数据*/
			getData() {
				let self = this;
				self.loading = true;
				let page = self.page;
				let state = self.state_active;
				let list_rows = self.list_rows;
				self._postBody('user/refund/lists', {
					state: state,
					pageIndex: page || 1,
					pageSize: list_rows,
				}, function(res) {
					self.loading = false;
					self.tableData = self.tableData.concat(res.data.records);
					console.log(self.tableData);
					self.last_page = res.data.lastPage;
					if (self.last_page <= 1) {
						self.no_more = true;
						return false;
					}
				});

			},
			/*返回页面数据*/
			getData2() {
				let self = this;
				self.loading = true;
				let page = self.page;
				let state = self.state_active;
				let list_rows = self.list_rows;
				self._postBody('user/refund/lists', {
					state: state,
					pageIndex: page || 1,
					pageSize: list_rows,
				}, function(res) {
					self.loading = false;
					self.tableData = res.data.records;
					console.log(self.tableData);
					self.last_page = res.data.lastPage;
					if (self.last_page <= 1) {
						self.no_more = true;
						return false;
					}
				});
			},
			/*类别切换*/
			// stateFunc(e) {
			// 	let self = this;
			// 	if (self.state_active != e) {
			// 		self.tableData = [];
			// 		self.loading = true;
			// 		self.page = 1;
			// 		self.state_active = e;
			// 		self.getData();
			// 	}
			// },
			/*查看售后详情*/
			gotoRefundDetail(e) {
				this.gotoPage('/pages/order/refund/detail/detail?orderRefundId=' + e);
			},
			/*可滚动视图区域到顶触发*/
			scrolltoupperFunc() {
				console.log('到顶了');
				/* let self = this;
				self.topRefresh = true;
				self.no_more = false;
				setTimeout(function() {
					self.topRefresh = false;
				}, 2000);
				self.tableData = [];
				self.page = 1;
				self.getData(); */
			},

			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {
				console.log('到底了');
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
			}

		}
	}
</script>

<style lang="scss" scoped>
.uni-scroll-view-content{
	//height:auto !important;
}
.scroll-Y{
	//height: 80vh !important;
	//min-height: 80vh;
}

.orderNo{
	font-family: Hiragino Sans GB, Hiragino Sans GB;
font-weight: normal;
font-size: 28rpx;
color: #000000;
line-height: 28rpx;
text-align: left;
font-style: normal;
text-transform: none;

}
.list{
	margin-left: 24rpx;
	margin-right:24rpx;
	margin-top:40rpx;
}
.pro-info2{
	width: 440rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	//border: 1rpx solid red;

}

</style>
