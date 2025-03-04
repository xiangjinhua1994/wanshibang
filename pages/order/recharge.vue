<template>
	<view  :data-theme='theme()' :class="theme() || ''" class="index" v-if="!loading">
		<view class="index-head">
			<view class="index-head-top">
				<view class="f32">请选择充值金额:</view>
			</view>
			<view class="index-head-bottom">
				<view :class="active==index?'index-head-bottom-item-active':'index-head-bottom-item'" @click="select(index)" v-for="(item,index) in tableData"
				 :key="index">
					<text class="f40">{{item.money}}</text><text class="f22">元</text>
					<view class="givemoney" v-if="item.giveMoney > 0">送{{item.giveMoney}}元</view>
				</view>
			</view>
			<view class="head-top-botm">注：充值金额只能消费，不能提现;</view>
		</view>
		<view class="index-body">
			<template v-if="settings.isPlan == 1">
				<view class="index-head-top">
					<view class="f32 p-0-20">可自定义充值金额:</view>
				</view>
				<view class="index-body-top" @click="select(-1)">
					<view class="">其他金额</view>
					<input type="text" v-model="userMoney" placeholder="请输入您要充值的金额" />
				</view>
				<view class="gray p-0-30">最低充值金额：{{settings.minMoney}}元</view>
			</template>
			<view class="index-body-bottom">
				<view class="index-body-bottom-info">
					<view class="f32 mb23">充值说明</view>
					<text class="gray f26">{{settings.describe}}</text>
				</view>
			</view>
		</view>
		<view class="btn">
			<button type="default" @click="payFunc">确认支付</button>
		</view>
	</view>
</template>

<script>
	import {
		pay
	} from '@/common/pay.js';
	export default {
		data() {
			return {
				tableData: [],
				settings: {},
				active: -1,
				/*套餐id*/
				planId: 0,
				/*自定义金额*/
				userMoney: '',
				loading: true
			}
		},
		watch: {
			userMoney(val) {
				if (val != '') {
					this.active = -1;
					this.planId = 0;
				}
			}
		},
		mounted() {
			/*获取数据*/
			this.getData();
		},
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				self.loading = true;
				uni.showLoading({
					title: '加载中'
				})
				self._get(
					'balance/plan/index', {
						paySource: self.getPlatform()
					},
					function(data) {
						self.loading = false;
						uni.hideLoading();
						self.tableData = data.data.list;
						self.settings = data.data.settings;
					}
				);
			},
			//选择套餐
			select(index) {
				this.active = index;
				this.userMoney = '';
			},
			payFunc() {
				let self = this;
				uni.showLoading({
					title: '加载中',
					mask: true
				});

				if (self.active != -1) {
					self.planId = self.tableData[self.active]['planId'];
				}

				if (self.planId == 0 && self.userMoney == '') {
					uni.showToast({
						icon: 'none',
						title: '请选择充值套餐或输入要充值的金额'
					});
					return;
				}

        if(parseFloat(self.userMoney) < self.settings.minMoney){
          uni.showToast({
            icon: 'none',
            title: `最低充值金额不得低于${self.settings.minMoney}元`
          });
          return;
        }

				self._post('balance/plan/submit', {
					planId: self.planId,
					userMoney: self.userMoney
				}, function(result) {
					uni.hideLoading();
					self.gotoPage('/pages/order/cashier?orderId=' + result.data.orderId+ '&orderType=30');
				});
			},
		}
	}
</script>

<style>
	page {
		background: #FFFFFF;
	}

	.gray {
		color: #808080;
	}

	.font-28 {
		font-size: 28rpx;
	}

	.font-36 {
		font-size: 36rpx;
	}

	.index {
		width: 750rpx;
	}

	.index-head {
		width: 750rpx;
		margin: 0 auto;
		padding: 30rpx 20rpx;
		padding-bottom: 50rpx;
		box-sizing: border-box;
		background-color: white;
		border-top: 16rpx solid #f2f2f2;
	}

	.index-head-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		flex-direction: column;
	}

	.head-top-botm {
		color: #999999;
		font-size: 26rpx;
		margin-top: 20rpx;
	}

	.index-head-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
	}

	.index-head-bottom-item {
		position: relative;
		width: 220rpx;
		height: 128rpx;
		border: 1rpx solid #999999;
		background-color: #FFFFFF;
		color: #333333;
		text-align: center;
		border-radius: 15rpx;
		line-height: 128rpx;
		margin-top: 20rpx;
		font-size: 48rpx;
	}

	.index-head-bottom-item-active {
		position: relative;
		width: 220rpx;
		height: 128rpx;
		color: #323333;
		background: #FFE6E3;
		border: 1rpx solid #F6220C;
		text-align: center;
		border-radius: 12rpx;
		line-height: 128rpx;
		margin-top: 20rpx;
		font-size: 48rpx;
	}

	.givemoney {
		position: absolute;
		top: 0;
		left: 0;
		width: 90rpx;
		height: 33rpx;
		background-color: #F6220C;
		color: #FFFFFF;
		font-size: 20rpx;
		line-height: 33rpx;
		text-align: center;
		border-top-left-radius: 12rpx;
		border-bottom-right-radius: 12rpx;
	}

	.index-body {
		width: 750rpx;
	}

	.index-body-top {
		/* width: 660rpx; */
		height: 100rpx;
		padding: 0 20rpx;
		border: 1rpx solid #f7f7f7;
		border-radius: 15rpx;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #4b4b4b;
		margin-bottom: 15rpx;
	}

	.active {
		background-color: #FDE34880;
		color: #323333;
	}

	.index-body-top view {
		width: 20%;
	}

	.index-body-top input {
		width: 80%;
		text-align: right;
	}

	.index-body-bottom {
		width: 750rpx;
		padding: 30rpx 20rpx;
		background-color: white;
		border-top: 16rpx solid #f2f2f2;
		margin-top: 20rpx;
	}

	.checkbox {
		display: flex;
		align-items: center;
	}

	.index-body-bottom-info {
		/* margin-top: 65rpx; */
	}

	.index-body-bottom-info view {
		margin-top: 10rpx;
	}

	.btn {
		margin-top: 50rpx;
	}

	.btn button {
		width: 710rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		margin: 0 auto;
		color: white;
		font-size: 32rpx;
		background: linear-gradient(90deg, #FF6B6B 4%, #F6220C 100%);
	}

	.rule text {
		margin-left: 15rpx;
		color: #88B5D1;
	}
</style>
