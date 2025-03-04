<template>
	<view class="haggle" v-if="!loadding">
		<view class="goto-home d-c-c" @click="gotoHome"><text class="iconfont icon-Homehomepagemenu"></text></view>
		<view class="haggle-content">
			<view class="rule red" @click="openRule">活动规则</view>
			<!--用户信息-->
			<view class="user d-c-c d-c">
				<image :src="task.avatarUrl" mode="widthFix"></image>
				<text class="gray6">{{ task.nickName }}</text>
			</view>
			<view class="tip p-20-0 d-c-c f30">“拿好物好朋友帮，快去邀请吧”</view>
			<!--商品信息-->
			<view class="product d-s-c p20">
				<view class="pic"><image :src="product.image[0].filePath" mode=""></image></view>
				<view class="info flex-1 ml30">
					<view class="text-ellipsis-2 f28">{{ task.productName }}</view>
					<view>
						<text class="gray9">规格：</text>
						<text>{{ task.productAttr?task.productAttr:'无' }}</text>
					</view>
					<view class="">
						<text class="gray9">砍到底价：</text>
						<text class="red">￥{{ task.bargainPrice }}</text>
						<text class="ml10 text-l-t gray9">￥{{ task.productPrice }}</text>
					</view>
					<view class="">
						<text class="gray9">剩余：</text>
						<text>{{ product.stock }}</text>
					</view>
				</view>
			</view>
			<view class="title-2 d-c-c p-30-0 f26" v-if="isBargain">
				<text class="pr">
					{{is_creater?'先砍一刀试试运气':'帮好友砍一刀'}}</text>
			</view>
			<!--砍价进度-->
			<view class="progress pr">
				<view class="progress-box"><view class="progress-box-active" :style="'width:' + task.bargainRate + '%;'"></view></view>
				<view class="progressState" :style="'left:' + task.bargainRate + '%;'">已砍￥{{ task.cutMoney }}</view>
			</view>
			<view class="d-b-c gray9">
				<text>￥{{ task.productPrice }}</text>
				<text class="f30 red fb">￥{{ task.bargainPrice }}</text>
			</view>
			<!--活动剩余时间-->
			<view class="ad-datetime p-30-0 d-c-c" v-if="task.status==0">
				<Countdown :config="countdownConfig"></Countdown>
			</view>
			<!--按钮-->
			<view class="btns mt30" v-if="task.status == 0||task.status == 1">
				<template v-if="isBargain">
					<button type="primary" :disabled="submitting" @click="bargainFunc">
						{{isCreater?'我要砍价':'帮好友砍一刀'}}
					</button>
				</template>
				<template v-if="!isBargain && task.isFloor != 1 && task.isBuy!=1">
					<button type="primary" open-type="share" @click="shareFunc">邀请好友帮忙砍价</button>
				</template>
				<template v-if="isCreater === true">
					<button type="primary" v-if="isBuy && active.conditions == 0" class="mt20" @click="buyNow">
						<template v-if="task.isFloor == 0">当前价购买</template>
						<template v-if="task.isFloor == 1">砍价成功 立即购买</template>
					</button>
					<button type="primary" v-if="isBuy && active.conditions == 1" class="mt20" @click="buyNow">砍价成功 立即购买</button>
					<view class="mt20 f34 red tc" v-if="task.isBuy==1">砍价成功，已购买</view>
				</template>
				<template v-if="isCreater == false">
					<button type="primary" class="buy-btn mt20" @click="involvedFunc">我要参与</button>
				</template>
			</view>

			<!--砍价历史-->
			<view class="help-list mt30">
				<view class="p-30-0 border-b fb f30">砍价记录</view>
				<view class="d-b-c p-20-0 border-b-e" v-for="(item, index) in helpList" :key="index">
					<view class="user d-s-c">
						<image :src="item.avatarUrl" mode="aspectFill"></image>
						<text class="ml20">{{ item.nickName }}</text>
					</view>
					<view class="red" :class="{ fb: item.isCreater == 0 }">-{{ item.cutMoney }}</view>
				</view>
			</view>
		</view>

		<!--规则-->
		<Rule :isRule="isRule" :setting="setting" @close="closeRule"></Rule>

		<!--分享-->
		<share :isshare="isshare" @close="closeShare"></share>
		<!--app分享-->
		<AppShare :isAppShare="isAppShare" :appParams="appParams" @close="closeAppShare"></AppShare>
		<!--弹出框-->
		<Popup :show="isPopup" :width="400" :height="300" :padding="0" @hidePopup="hidePopupFunc">
			<view class="d-c-c d-c ww100 p-30-0">
				<text>本次砍掉</text>
				<view class="pt10">
					￥
					<text class="fb f34 red">{{ myCutMoney }}</text>
				</view>
				<view class="pt30"><button type="primary" class="btn-gray" @click="hidePopupFunc">关闭</button></view>
			</view>
		</Popup>
	</view>
</template>

<script>
import Popup from '@/components/uni-popup.vue';
import countdown from '@/components/countdown/countdown.vue';
import Rule from './popup/Rule.vue';
import share from '@/components/mp-share.vue';
import AppShare from '@/components/app-share.vue';
export default {
	components: {
		Popup,
		Rule,
		countdown,
		share,
		AppShare
	},
	data() {
		return {
			/*是否加载完成*/
			loadding: true,
			/*砍价任务ID*/
			bargainTaskId: 0,
			/*是否显示规则*/
			isRule: false,
			/*倒计时配置*/
			countdownConfig: {
				/*开始时间*/
				startstamp: 0,
				/*结束时间*/
				endstamp: 0,
				/*显示类别*/
				type: 'text',
				/*文字*/
				title: '剩余：'
			},
			/*任务对象*/
			task: {},
			/*商品对象*/
			product: {},
			/*活动*/
			active: {},
			/*活动设置*/
			setting: {},
			/*砍价历史*/
			helpList: [],
			/*是否分享*/
			isshare: false,
			/*是否是自己的*/
			isCreater: false,
			/*是否已经砍过*/
			isCut: false,
			/*是否正在提交*/
			submitting: false,
			/*是否显示弹出框*/
			isPopup: false,
			/*我的砍价*/
			myCutMoney: 0,
			/*app分享*/
			isAppShare: false,
			appParams: {
				title: '',
				summary: '',
				path: ''
			},
			url: ''
		};
	},
	onLoad(e) {
		this.bargainTaskId = e.bargainTaskId;
		// 公众号分享
		if(this.getPlatform() == 'mp'){
			this.url = window.location.href;
		}
	},
	mounted() {
	
	},
	onShow() {
		this.submitting=false;
		/*获取产品详情*/
		this.getData();
	},
	computed: {
		
		/*是否允许砍价*/
		isBargain: function() {
			if (this.isCut == false) {
				return true;
			} else {
				return false;
			}
		},

		/*是否允许购买、砍价过程中可购买或者砍到底价，并且砍价成功可购买*/
		isBuy: function() {
			if (this.active.conditions === 0 && this.task.isBuy!=1) {
				return true;
			}else if (this.active.conditions === 1 && this.task.isFloor == 1 && this.task.isBuy!=1) {
				return true;
			} else {
				return false;
			}
		}
	},
	methods: {
		/*获取数据*/
		getData() {
			let self = this;
			self.loading = true;
			uni.showLoading({
				title: '加载中'
			});
			self._get(
				'plus/bargain/task/detail',
				{
					bargainTaskId: self.bargainTaskId,
					url: self.url
				},
				function(res) {
					self.countdownConfig.startstamp = res.data.active.startTime;
					self.countdownConfig.endstamp = res.data.task.endTime;
					self.isCreater = res.data.isCreater;
					self.isCut = res.data.isCut;
					self.task = res.data.task;
					self.active = res.data.active;
					self.product = res.data.product;
					self.setting = res.data.setting;
					self.helpList = res.data.helpList;
					// 配置微信分享参数
					if(self.getPlatform() == 'mp'){
						let params = {
							bargainTaskId: self.bargainTaskId
						};
						self.configWx(res.data.share.signPackage, res.data.share.shareParams, params);
					}
					self.loadding = false;
					uni.hideLoading();
				}
			);
		},

		/*我要砍价*/
		bargainFunc() {
			let self = this;
			self.submitting = true;
			self._post(
				'plus/bargain/task/cut',
				{
					bargainTaskId: self.bargainTaskId,
				},
				function(res) {
					self.myCutMoney = res.data.cutMoney;
					self.isCut = res.data.isCut;
					self.isPopup = true;
				}
			);
		},

		/*关闭弹出框*/
		hidePopupFunc() {
			this.isPopup = false;
			this.getData();
			this.submitting = false;
		},

		/*确认提交*/
		buyNow() {
			this.createdOrder();
		},

		/*规则*/
		openRule() {
			this.isRule = true;
		},

		/*关闭规则*/
		closeRule() {
			this.isRule = false;
		},

		/*跳转首页*/
		gotoHome() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},

		/*创建订单*/
		createdOrder() {
			let self = this;
			let bargainProductId = self.product.bargainProductId;
			let productSkuId = self.task.productSkuId;
			let bargainProductSkuId = self.task.bargainProductSkuId;
			self.gotoPage('pages/order/saveOrder?bargainProductId=' +
					bargainProductId +
					'&productSkuId=' +
					productSkuId +
					'&bargainProductSkuId=' +
					bargainProductSkuId +
					'&orderType=bargain' +
					'&bargainTaskId=' +
					self.bargainTaskId);
		},

		/*分享*/
		shareFunc() {
			let self = this;
			//#ifdef H5
			self.isshare = true;
			//#endif
			//#ifdef APP-PLUS
			self.appParams.title = '发现了一个好物，快来帮我砍一刀吧';
			self.appParams.summary = self.product.productName;
			// 构建页面参数
			let params = self.getShareUrlParams({
				bargainTaskId: self.bargainTaskId
			});
			self.appParams.path = '/pages/plus/bargain/haggle/haggle?' + params;
			self.appParams.image = self.product.image[0].filePath;
			self.isAppShare = true;
			//#endif
		},
		/*关闭分享*/
		closeShare() {
			this.isshare = false;
		},
		//关闭分享
		closeAppShare(data) {
			this.isAppShare = false;
		},
		/*我要参与*/
		involvedFunc() {
			let url = 'pages/plus/bargain/detail/detail?bargainProductId=' + this.product.bargainProductId;
			this.gotoPage(url);
		},
		/*小程序分享*/
		onShareAppMessage() {
			let self = this;
			// 构建页面参数
			let params = self.getShareUrlParams({
				bargainTaskId: self.bargainTaskId
			});
			return {
				title: '发现了一个好物，快来帮我砍一刀吧',
				path: '/pages/plus/bargain/haggle/haggle?' + params
			};
		},
	}
};
</script>

<style lang="scss">
.haggle {
	min-height: 100vh;
	padding: 30rpx;
	box-sizing: border-box;
	background: $dominant-color;
}

.haggle .goto-home {
	position: fixed;
	top: 40rpx;
	left: 40rpx;
	width: 80rpx;
	height: 80rpx;
	line-height: 60rpx;
	border-radius: 50%;
	background: #ffffff;
	z-index: 20;
}
.haggle .goto-home .iconfont {
	color: $dominant-color;
	font-weight: bold;
	font-size: 40rpx;
}

.haggle-content {
	position: relative;
	padding: 30rpx;
	box-sizing: border-box;
	border-radius: 16rpx;
	background: #ffffff;
}

.haggle-content .rule {
	position: absolute;
	top: 30rpx;
	right: 30rpx;
}

.haggle-content .user image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
}

.haggle-content .product {
	background: #eeeeee;
}

.haggle-content .product .pic,
.haggle-content .product .pic image {
	width: 160rpx;
	height: 160rpx;
}

.haggle-content .title-2 text::before,
.haggle-content .title-2 text::after {
	display: block;
	content: '';
	position: absolute;
	width: 100rpx;
	height: 2rpx;
	top: 50%;
	background: #cccccc;
}

.haggle-content .title-2 text::before {
	left: -120rpx;
}

.haggle-content .title-2 text::after {
	right: -120rpx;
}

.haggle-content .progress {
	padding-top: 60rpx;
	margin: 20rpx 80rpx 0;
}

.haggle-content .progress-box {
	height: 20rpx;
	background: #cccccc;
	border-radius: 10rpx;
	overflow: hidden;
}

.haggle-content .progress-box-active {
	height: 20rpx;
	border-radius: 16rpx;
	background: $dominant-color;
}

.haggle-content .progressState {
	top: 0;
	left: 0;
	position: absolute;
	width: 160rpx;
	height: 32rpx;
	transform: translateX(-80rpx);
	line-height: 32rpx;
	border-radius: 16rpx;
	font-size: 20rpx;
	text-align: center;
	background: $dominant-color;
	color: #ffffff;
}

.haggle-content .progressState::after {
	position: absolute;
	left: 50%;
	margin-left: -6rpx;
	display: block;
	content: '';
	border: 12rpx solid transparent;
	border-top-color: $dominant-color;
}

.haggle-content .ad-datetime .box {
	padding: 4rpx;
	border-radius: 4rpx;
	background: #000000;
	color: #ffffff;
}

.haggle-content .btns button {
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	background: $dominant-color;
	color: #ffffff;
}
.haggle-content .btns button.buy-btn {
	background: #ff8a00;
}

.haggle-content .help-list .user image {
	width: 60rpx;
	height: 60rpx;
}
</style>
