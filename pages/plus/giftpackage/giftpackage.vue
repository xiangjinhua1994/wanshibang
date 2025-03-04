<template>
	<view class="gift-package" v-if="!loadding">
		<view class="rule">
			<button class="rule_btn" @click="ReLaunch()">返回首页</button>
			<!-- <button class="rule_btn">活动规则</button> -->
		</view>
		<image class="gift-bg" :src="detail.filePath" mode="widthFix"></image>

		<view class="gift-package-main">
			<view class="p-0-30"  v-if="detail.isPoint">
				<view class="integral">
					<view class="title f30">
						积分礼包
					</view>
					<view class="integral_btom  d-c-c">
						<image src="/static/gift.png" mode="widthFix"></image>
						<view class="info">
							<view class="num">
								{{parseFloat(detail.point)}}积分
							</view>
							<view>无门槛 全品类</view>
						</view>
					</view>
				</view>
			</view>
			<view class="t-c" v-if="detail.isPoint">
				<text class="add">+</text>
			</view>
			<view class="p-0-30"  v-if="detail.isCoupon">
				<view class="cuopon-group" if="detail.isCoupon">
					<view class="title f30">
						优惠券礼包
					</view>
					<view class="body">
						<view class="item" v-for="(item,index) in detail.couponList" :key="index">
							<view class="cuopon_item">
								<view><image class="cuopon_img" src="../../../static/youhuiquan.png" mode=""></image></view>
								<view class="d-s-c">
									<view class="d-s-c item_cuopon">
										<view class="price">
											<view class="">
												<template v-if="item.couponType==10">
													<text class="f22">￥</text><text class="f34">{{parseFloat(item.reducePrice)}}</text>
												</template>
												<template v-else>
													<text class="f34">{{parseFloat(item.discount/10)}}折</text>
												</template>
											</view>
											<view class="f22">优惠券</view>
										</view>
										<view class="des">
											<view class="des_t">{{item.name}}</view>
											<view class="des_b" v-if="item.expireType==20">有效期至{{item.endTime}}</view>
											<view class="des_b" v-if="item.expireType==10">领取后{{item.expireDay}}天内有效</view>
										</view>
									</view>
									<view class="cuopon_num">X{{item.couponNum}}张</view>
								</view>
							</view>
							
						</view>
					</view>
				</view>
			</view>
			<view class="t-c" v-if="detail.isProduct&&detail.isCoupon">
				<text class="add">+</text>
			</view>
			<view class="p-0-30" v-if="detail.isProduct">
				<view class="cuopon-group">
					<view class="title f30">
						<view>商品礼包</view>
						<view class="">({{detail.productList.length}}选{{detail.productNum}})</view>
					</view>
					<view class="body">
						<view class="item mb30 bg-white" v-for="(item,index) in detail.productList" :key="index" @click="choosePro(item.productId)">
							<view class="d-s-c">
								<view>
									<image class="product_img" :src="item.image[0].filePath" mode="aspectFill"></image>
								</view>
								<view class="pro">
									<view class="pro_t">{{item.productName}}</view>
									<view class="pro_b"><text class="f18">￥</text>{{item.productPrice}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="btns">
				<button type="primary" @click="toPay()">{{detail.money}}元购买</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {pay} from '@/common/pay.js';
	import utils from '@/common/utils.js';
	export default {
		data() {
			return {
				/*是否加载完成*/
				loadding: false,
				packageId: 0,
				code: 0,
				/*礼包详情*/
				detail: {
					name:'',
					start_time:{text:''},
					end_time:{text:''},
					is_point:false,
					point:0,
					money:'',
				},
			}
		},
		onLoad(e) {
			/*商品id*/
			let scene = utils.getSceneData(e);
			this.packageId = e.packageId ? e.packageId : scene.pid;
			this.code = e.code ? e.code : scene.cid;
			if (typeof(this.code) == "undefined")
			{
			    this.code = '';
			}
		},
		onShow() {
			/*获取数据*/
			this.getData();
		},
		methods: {
      choosePro(id) {
        let self = this;
        let n = self.chooseProlist.indexOf(id);
        if (n == -1) {
          self.chooseProlist.push(id);
        } else {
          self.chooseProlist.splice(n, 1);
        }
      },
			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title: '加载中'
				});
				self.loadding = true;
				self._post('plus/package/package/index', {
					packageId: self.packageId,
					code: self.code
				}, function(res) {
					self.detail = res.data;
					self.loadding = false;
				});
			},
			/* 返回首页 */
			ReLaunch(){
				this.gotoPage('/pages/index/index', 'reLaunch');
			},
			toPay(){
				this.gotoPage('/pages/order/giftpackage-order?packageId='+this.packageId+'&code='+this.code);
			}
		}
	}
</script>

<style>
	page{
		
	}
	.gift-package {
		position: relative;
		min-height: 100vh;
	}

	.gift-package .gift-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 0;
	}

	.gift-package .gift-package-main {
		width: 750rpx;
		padding-top: 700rpx;
		padding-bottom: 120rpx;
		background: linear-gradient(to bottom, #f5600b 0%,#e22319 50%,#e22319 100%);
	}

	.giftpackagr-info{
		margin: 0 auto;
		width: 350rpx;
		height: 43rpx;
		line-height: 43rpx;
		border: 1rpx solid #fa212c;
		background: rgba(255,255,255);
		border-radius: 30rpx;
		text-align: center;
		position: absolute;
		top: 258rpx;
		left: 200rpx;
		z-index: 10;
	}
		.detatime{
		/* padding:10px 30px; */
		font-size: 18rpx;
		color: #fa1f29;
		font-weight: 800;
		}
	
	/* .gift-package-main .datetime {
		margin: 0 auto;
		width: 600rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
	} */

	.cuopon-group {
		color: #ffffff;
		text-align: center;
		font-size: 30rpx;
		background-color: #ffffff30;
		border-radius: 15rpx;
		padding: 35rpx;
		position: relative;
		z-index: 98;
	}
	.cuopon-group .title{
		font-size: 40rpx;
		color: #FFFFFF;
		text-align: center;
	}
	.cuopon-group .body {
		margin-top: 20rpx;	
	}
	.cuopon_item{
		position: relative;
	}
	.item_cuopon{
		z-index: 50;
	}
	.cuopon-group .body .item {
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		position: relative;
	}
	.cuopon_img{
		width: 493rpx;
		height: 123rpx;
		position: absolute;
		top: 0;
		left: 0;
	}
	.cuopon-group .body .item .price {
		z-index: 50;
		font-size:14rpx;
		margin-left: 26rpx;
	}

	.cuopon-group .body .item .des {
		z-index: 50;
		padding: 26rpx 0;
		font-size: 24rpx;
		text-align: left;
		margin-left: 50rpx;
	}
	.item .des .des_t {
		font-size: 26rpx;
		color: #000000;
		margin-bottom: 12rpx;
	}
	.item .des .des_c {
		font-size: 18rpx;
		color: #6b6b6b;
		margin-bottom: 8rpx;
	}
	.item .des .des_b {
		font-size: 18rpx;
		color: #6b6b6b;
	}
	.t-c{
		text-align: center;
	}
	.gift-package-main .integral {
		background-color: #ffffff66;
		padding: 60rpx 30rpx;
		border-radius: 15rpx;
		position: relative;
		z-index: 98;
	}
	.gift-package-main .integral .title{
		font-size: 40rpx;
		color: #FFFFFF;
		text-align: center;
	}
	.gift-package-main .integral_btom {
		width: 613rpx;
		height: 193rpx;
		background-color: #ffffff;
		margin-top: 20rpx;
		border-radius: 15rpx;
	}
	
	.gift-package-main .integral .info {
		margin-left: 30rpx;
		width: 300rpx;
		color: #f0510e;
	}

	.gift-package-main .integral image {
		width: 135rpx;
		height: 135rpx;
	}

	.gift-package-main .integral .num {
		font-size: 50rpx;
	}

	.gift-package-main .btns {
		margin-top: 92rpx;
		padding:0 84rpx;
		
	}

	.gift-package-main .btns button {
		height: 100rpx;
		line-height: 100rpx;
		text-shadow: 0 0 8rpx 0 rgba(0, 0, 0, .3);
		border-radius: 50rpx;
		color: #920202;
		font-size: 36rpx;
		box-shadow: 0 0 8rpx 0 rgba(0, 0, 0, .1);
		background: linear-gradient(0deg, #ffde63, #edb12f);
	}
	.rule{
		overflow: hidden;
		position: fixed;
		right: 0;
		top: 480rpx;
		z-index: 100;
	}
	.rule_btn{
		margin-top: 27rpx;
		width: 183rpx;
		height: 62rpx;
		line-height: 62rpx;
		text-align: center;
		background-color: #e83514;
		border: 1rpx solid #ffffff;
		border-right: none;
		border-top-left-radius: 32rpx;
		border-bottom-left-radius: 32rpx;
		color: #ffffff;
		font-size: 26rpx;
	}
	.add{
		font-size: 73rpx;
		font-weight: 900;
		text-align: center;
		color: #FFFFFF;
		position: relative;
		z-index: 98;
	}
	.cuopon_num{
		position: absolute;
		right: 0;
	}
	.product_img{
		width: 140rpx;
		height: 140rpx;
	}
	.pro{
		margin-left: 12rpx;
		text-align: left;
	}
	.pro_t{
		font-size: 24rpx;
		color: #000000;
		margin-bottom: 15rpx;
	}
	.pro_c{
		font-size: 20rpx;
		color: #686868;
		margin-bottom: 33rpx;
	}
	.pro_b{
		font-size: 28rpx;
		color: #fd0000;
		margin-left: 252rpx;
	}
	.f18{
		font-size: 18rpx;
	}
	.pro_choose{
		width: 33rpx;
		height: 33rpx;
		position: absolute;
		right: 10rpx;
		top: 6rpx;
	}
</style>
