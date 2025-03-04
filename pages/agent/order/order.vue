<template>
	<view>

		<view class="top-tabbar">
			<view :class="state_active == item.value? 'tab-item active' : 'tab-item'" @click="stateFunc(item.value)" v-for="(item,index) in tableList"
			 :key="index">{{item.text}}</view>
		</view>

		<!--列表-->
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
		 @scrolltolower="scrolltolowerFunc">
			<view class="p-0-30 bg-white">
				<view class="border-b p-20-0" v-for="(item,index) in tableData" :key="index">
					<view class="d-b-c f24">
						<text>订单号{{ item.orderMaster.orderNo }}</text>
						<text class="blue" v-if="item.isSettled==1"> 已结算</text>
						<text class="gray" v-else>未结算</text>
					</view>
					<view class="d-b-c mt20">
						<view class="agent-order-photo">
							<image :src="item.avatarUrl" mode="aspectFill"></image>
						</view>
						<view class="flex-1 ml20 f24">
							<view class="d-b-c">
								<text class="gray3">{{ item.nickName }}</text>
								<text class="red" v-if="item.firstUserId == userId ">+￥{{ item.firstMoney }}</text>
								<text class="red" v-if="item.secondUserId == userId ">+￥{{ item.secondMoney }}</text>
								<text class="red" v-if="item.thirdUserId == userId ">+￥{{ item.thirdMoney }}</text>
							</view>
							<view class="d-b-c">
								<text class="gray9">消费金额：￥{{ item.orderPrice }}</text>
								<text class="gray9">{{item.createTime}}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 没有记录 -->
				<view class="d-c-c p30" v-if="tableData.length==0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">亲，暂无相关记录哦</text>
				</view>
				<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more.vue";
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
				state_active: -1,
				/*数据列表*/
				tableData: [],
				settled: -1,
				page: 1,
				no_more: false,
				loading: true,
				tableList: [],
				list_rows: 15,
				userId: 0
			}
		},
		computed: {
			/*加载中状态*/
			loadingType() {
				if (this.loading) {
					return 1;
				} else {
					if (this.tableData.length != 0 && this.no_more) {
						return 2;
					} else {
						return 0;
					}
				}
			}
		},
		mounted() {
			/*初始化*/
			this.init();
			this.userId = this.getUserId();
			/*获取数据*/
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
			
			/*获取数据*/
			getData() {
				let self = this;
				self.loading = true;
				self._postBody('plus/agent/order/lists', {
					isSettled: self.state_active,
					pageIndex: self.page || 1,
					pageSize: self.list_rows,
				}, function(res) {
					self.loading = false;
					// 导航栏数据
					self.tableList = [{
						value: -1,
						text: res.data.words.order.all,
					}, {
						value: 0,
						text: res.data.words.order.unsettled,
					}, {
						value: 1,
						text: res.data.words.order.settled,
					}];
					self.tableData = self.tableData.concat(res.data.list.records);
					self.last_page = res.data.list.lastPage;
					if (self.last_page <= 1) {
						self.no_more = true;
					}
				});
			},

			/*切换*/
			stateFunc(e) {
				let self = this;
				if(e!=self.state_active){
					self.tableData = [];
					self.page = 1;
					self.state_active = e;
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
			}
		}
	}
</script>

<style>
	.agent-order-photo,
	.agent-order-photo image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
</style>
