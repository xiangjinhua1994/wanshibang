<template>
	<view class="invite-wrap" v-if="!loadding">
		<view class="rule">
			<button class="rule_btn" @click="ReLaunch()">返回首页</button>
			<button class="rule_btn" @click="isPopup=true">活动规则</button>
		</view>
		<view class="banner">
			<image :src="detail.filePath" mode="widthFix"></image>
		</view>
		<view class="invite-content">
			<view class="tab d-c-c">
				<view class="item flex-1 d-c-c d-c" :class="tab_active==0?'active':''" @click="tab_active=0">
					<text class="headtext fb">领取大礼包</text>
					<text>火热进行中</text>
				</view>
				<view class="item flex-1 d-c-c d-c" :class="tab_active==1?'active':''" @click="tab_active=1">
					<text class="headtext fb">我的奖励</text>
					<text>多邀多得</text>
				</view>
			</view>
			<view class="invite-inner">
				<!--type 1-->
				<view class="invite-type" v-if="tab_active==0">
					<view class="title" v-if="detail.invCondition==0">
						注：邀请好友注册即邀请成功
					</view>
					<view class="title" v-if="detail.invCondition==1">
						注：邀请好友注册且好友消费即邀请成功
					</view>
					<view class="content">
						<scroll-view scroll-x="true">
							<view class="list d-s-c">
								<view class="item d-c-c d-c" :class="detail.count>=item.invitationNum?'select-item':''" v-for="(item,index) in detail.Reward" :key="index">
								<!-- <view class="item d-c-c d-c"  v-for="(item,index) in detaillist.Reward" :key="index"> -->
									<image src="/static/gift.png" mode="widthFix"></image>
									<view class="progress"><view class="progress_dot"></view></view>
									<text>{{item.invitationNum}}人</text>
								</view>
							</view>
						</scroll-view>
					</view>
					<view clas></view>
					<view class="state-explan p20 d-c-c f30" v-if="!detail.is_over">
						已邀请{{detail.count}}人，还差<text class="p-0-10 red">{{detail.dif}}</text>人就可以领取礼包啦
					</view>
					<view class="state-explan p20 d-c-c f30" v-if="detail.isOver">
						共邀请{{detail.count}}人，奖品已全部领取，感谢您的参与
					</view>
					<view class="btns-box">
						<!-- #ifdef MP-WEIXIN -->
						<button  open-type="share">邀请好友得礼包</button>
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN -->
						<button @click="showShare">邀请好友得礼包</button>
						<!-- #endif -->
					</view>
				</view>

				<!--type 2-->
				<view class="invite-type2" v-if="tab_active==1">
					<view class="list" v-for="(item,index) in detail.prize" :key="index">
						<view class="item p-20-0 d-b-c" v-if="item.couponName!=''">
							<view class="d-s-s d-c">
								<text class="num">{{item.couponName}}</text>
								<text class="gray9 f22">{{item.createTime}}</text>
							</view>
							<text>优惠券</text>
						</view>
						<view class="item p-20-0 d-b-c" v-if="item.point!=0">
							<view class="d-s-s d-c">
								<text class="num">+{{item.point}}</text>
								<text class="gray9 f22">{{item.createTime}}</text>
							</view>
							<text>积分</text>
						</view>
						<view class="item p-20-0 d-b-c" v-if="item.balance!=0">
							<view class="d-s-s d-c">
								<text class="num">+{{item.balance}}</text>
								<text class="gray9 f22">{{item.createTime}}</text>
							</view>
							<text>余额</text>
						</view>
					</view>
					<view class="d-c-c p30" v-if="detail.prize.length==0 && !loading">
						<text class="iconfont icon-wushuju"></text>
						<text class="cont">亲，暂无相关记录哦</text>
					</view>
				</view>
			</view>
		</view>
		<!--底部弹窗-->
		<MpShare :isMpShare="isMpShare" @close="closeShare"></MpShare>
		<!--app分享-->
		<!-- #ifdef APP-PLUS -->
		<AppShare :isAppShare="isAppShare" :appParams="appParams" @close="closeShare"></AppShare>
		<!-- #endif -->
		<Popup :show="isPopup" @hidePopup="hidePopupFunc" msg="活动规则">
			<view>
				<view>活动时间:</view>
				<view class="p-0-20 mb30">{{detail.startTime+"——"+detail.endTime}}</view>
				<view class="reward_time">活动奖励:</view>
				<view v-for="(item,index) in detail.reward" :key="index">
					<view class="d-b-c reward_item">
						<view>邀请<text class="orange">{{item.invitationNum}}</text>人后奖励</view>
						<view>
							<view class="reward_coupon" v-if="item.couponName!=''" >
								<view>{{item.couponName}}</view>
								<view>优惠券</view>
							</view>
							<view v-if="item.point!=0"><text>{{item.point}}</text>积分</view>
							<view v-if="item.balance!=0"><text>{{item.balance}}</text>余额</view>
						</view>
					</view>
				</view>
			</view>
		</Popup>
	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue';
	import AppShare from '@/components/app-share.vue';
	import MpShare from '@/components/mp-share.vue';
	export default {
		components: {
			Popup,
			AppShare,
			MpShare
		},
		data() {
			return {
				/*是否加载完成*/
				loadding:false,
				invitationGiftId:0,
				/*弹窗是否打开*/
				isPopup: false,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				tab_active: 0,
        shareImage:"",
				/*活动详情*/
				detail: {
          dif: 0,
					count:0
				},
				url: '',
				/*app分享*/
				isAppShare: false,
				appParams:{
					title: '',
					summary: '',
					path: ''
				},
				/*公众号分享*/
				isMpShare: false
			}
		},
		onLoad(e) {
			uni.showLoading({
			    title: '加载中'
			});
			this.invitationGiftId = e.invitationGiftId;
			// 公众号分享
      //#ifdef H5
      this.url = window.location.href;
      //#endif
		},
		onShow() {
			/*获取数据*/
			this.getData();
		},
    /*分享*/
    onShareAppMessage() {
      let self = this;
      // 构建页面参数
      let params = self.getShareUrlParams({
        invitationId: self.invitationGiftId,
        refereeId:self.getUserId()
      });
      return {
        title: self.detail.shareTitle,
        path: '/pages/index/index?' + params,
        imageUrl:self.shareImage
      };
    },
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				self._get('plus/invitationgift/invitation/getDatas', {
					invitationGiftId:self.invitationGiftId || 0,
					url: self.url
				}, function(res) {
					self.detail = res.data.detail;
					self.shareImage = res.data.detail.shareFilePath;
          console.log("12",self.shareImage);
          // 配置微信分享参数
          //#ifdef H5
          if (self.url != '') {
						let params = {
							invitationId: self.invitationGiftId,
							refereeId:self.getUserId()
						};
						self.configWx(res.data.share.signPackage, res.data.share.shareParams, params);
					}
          //#endif
          self.loadding = false;
          uni.hideLoading();
        }, (err) => {
          uni.navigateBack()
        });
      },
			/* 返回首页 */
			ReLaunch(){
				this.gotoPage('/pages/index/index', 'reLaunch');
			},
			//关闭活动规则
			hidePopupFunc() {
				this.isPopup = false;
			},
			showShare(){
				let self = this;
				//#ifndef APP-PLUS
				self.isMpShare = true;
				//#endif
				//#ifdef APP-PLUS
				self.appParams.title = self.detail.shareTitle;
				self.appParams.summary = self.detail.shareDesc;
				// 构建页面参数
				let params = self.getShareUrlParams({
					invitationId: self.invitationGiftId,
					refereeId:self.getUserId()
				});
				self.appParams.path = '/pages/index/index?' + params;
				self.appParams.image = self.shareImage;
				self.isAppShare = true;
				//#endif
			},
			//关闭分享
			closeShare(data) {
				this.isAppShare = false;
				this.isMpShare = false;
			},
		}
	}
</script>

<style>
	.invite-wrap {
		height: 100vh;
		background: #9b67cf;
		position: relative;
		padding-top: 480rpx;
	}
	.banner{
		position: absolute;
		top: 0;
	}
	.invite-wrap .banner image{
		width: 750rpx;
	}
	.invite-wrap .activity-date {
		width: 500rpx;
		height: 40rpx;
		margin: 0 auto;
		border-radius: 20rpx;
		background: #ff5b90;
		color: #FFFFFF;
	}

	.invite-content {
		margin: 50rpx;
		margin-top: 0;
		border-radius: 20rpx;
		background: #FFFFFF;
		position: relative;
	}

	.invite-content .tab {
		/* border-bottom: 1px solid #CCCCCC; */
		border-top-left-radius: 15rpx;
		border-top-right-radius: 15rpx;
		overflow: hidden;
	}

	.invite-content .tab .item {
		padding: 20rpx 0;
		font-size: 20rpx;
		background-color:#ff5b90 ;
		color: #FFFFFF;
		box-shadow: rgba(255,255,255,0.25) 0px 1px 0px, inset rgba(255,255,255,0.25) 0px 1px 0px, inset rgba(0,0,0,0.25) 0px 0px 0px, inset rgba(255,255,255,0.03) 0px 20px 0px, inset rgba(0,0,0,0.15) 0px -20px 20px, inset rgba(255,255,255,0.05) 0px 20px 20px;
	}

	.invite-content .tab .item.active {
		/* border-bottom: 3px solid #ff5b90; */
		/* margin-bottom: -3px; */
		/* color: #ff5b90; */
		color: #000000;
		box-shadow:none;
		background-color: #ffffff;
	}
	

	.invite-content .tab .item .headtext {
		font-size: 32rpx;
	}

	.invite-content .invite-inner {
		margin-top: 30rpx;
		padding: 20rpx;
	}

	.invite-content .invite-type .title {
		text-align: center;
		color: red;
		font-size: 28rpx;
	}

	.invite-content .invite-type .content {
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}

	.invite-content .invite-type .content image {
		width: 120rpx;
	}

	.select-item image {
		filter: grayscale(100%);
		filter: gray;
	}

	.invite-content .invite-type .item {
		width: 240rpx;
	}

	.invite-content .invite-type2 .item {
		border-bottom: 1px dashed #CCCCCC;
	}

	.invite-content .invite-type2 .item .num {
		color: #f62c6d;
	}

	.invite-content .btns-box {
		margin-top: 40rpx;
	}

	.invite-content .btns-box button {
		margin: 0 auto;
		width: 457rpx;
		height: 88rpx;
		text-align: center;
		line-height: 88rpx;
		border-radius: 44rpx;
		background: linear-gradient(to right, #ff5b90 0%,#f62c6d 100%);
		color: #FFFFFF;
	}
	.progress{
		height: 15rpx;
		width: 100%;
		background-color: #f7d887;
		margin-top: 32rpx;
		margin-bottom: 27rpx;
	}
	.progress .progress_dot{
		width: 15rpx;
		height: 15rpx;
		background-color: #f88035;
		border-radius: 50%;
		margin: 0 auto;
	}
	.invite_rule{
		
	}
	.invite_rule .title{
		color: #ffffff;
		text-align: center;
		font-size: 31rpx;
		line-height: 50rpx;
		margin-bottom: 50rpx;
	}
	.rule_list{
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 0 50rpx;
	}
	.rule_item{
		width: 128rpx;
		height: 128rpx;
		border-radius: 8rpx;
		background-color: #FFFFFF20;
		text-align: center;
		line-height: 128rpx;
	}
	.rule_list .rule_item .icon{
		font-size: 88rpx;
		color: #FFFFFF;
	}
	.oblique{
		color: #f3de8d;
		font-weight: 900;
		margin: 0 30rpx;
	}
	.rule{
		overflow: hidden;
		position: fixed;
		right: 0;
		top: 505rpx;
		z-index: 100;
	}
	.rule_btn{
		margin-top: 27rpx;
		width: 183rpx;
		height: 62rpx;
		line-height: 62rpx;
		text-align: center;
		background: linear-gradient(to right, #ff6d9c 0%,#f53b77 100%);
		border-right: none;
		border-top-left-radius: 32rpx;
		border-bottom-left-radius: 32rpx;
		color: #ffffff;
		font-size: 26rpx;
	}
	.reward_item{
		text-align: end;
		padding: 10rpx;
		border-bottom: 1px dashed #CCCCCC;
	}
	.reward_coupon{
		margin-bottom: 10rpx;
	}
	.reward_time{
		border-bottom: 1px dashed #CCCCCC;
		padding-bottom: 20rpx;
	}
</style>
