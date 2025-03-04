<template>
	<view class="gift-package" :data-theme='theme()' :class="theme() || ''" v-if="!loadding">
		<view class="top-tabbar">
			<view :class="tab_type == 0 ? 'tab-item active' : 'tab-item'" @click="tabFunc(0)">快递配送</view>
			<view :class="tab_type == 1 ? 'tab-item active' : 'tab-item'" @click="tabFunc(1)">上门自提</view>
		</view>

		<Myinfo v-if="tab_type == 0" :Address="Address" :existAddress="existAddress"></Myinfo>

		<Storeinfo v-if="tab_type == 1" ref="getShopinfoData" :extractStore="extractStore"
			:lastExtract="lastExtract"></Storeinfo>

		<view class="gift-package-main">
			<view class="order_tit">
				{{detail.name}}
			</view>
			<view class="">
				<view class="p-0-30">
					<view class="integral" v-if="detail.isPoint">
						<view class="title">
							积分礼包
						</view>
						<view class="integral_btom  d-s-c">
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
				<view class="p-0-30" v-if="detail.isCoupon">
					<view class="cuopon-title">
						优惠券礼包
					</view>
					<view class="cuopon-group borbox" if="detail.isCoupon">
						<view class="body">
							<view class="item" v-for="(item,index) in detail.couponList" :key="index">
								<view class="cuopon_item">
									<view>
										<image class="cuopon_img" src="../../static/youhuiquan2.png" mode=""></image>
									</view>
									<view class="d-s-c">
										<view class="d-s-c item_cuopon">
											<view class="price">
												<view class="">
													<text class="f22">￥</text><text
														class="f34">{{parseFloat(item.reducePrice)}}</text>
												</view>
												<view class="f22">优惠券</view>
											</view>
											<view class="des">
												<view class="des_t">{{item.name}}</view>
												<view class="des_b" v-if="item.expireType==20">
													有效期至{{item.endTime}}</view>
												<view class="des_b" v-if="item.expireType==10">
													领取后{{item.expireDay}}天内有效</view>
											</view>
										</view>
									</view>
									<view class="cuopon_num"><text class="f12">x</text>{{item.couponNum}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="p-0-30" v-if="detail.isProduct">
					<view class="cuopon-group" if="detail.isProduct">
						<view class="title f30">
							<view>商品礼包({{detail.productList.length}}选{{detail.productNum}})</view>
						</view>
						<view class="body">
							<view class="item mb30 borbox bg-white" v-for="(item,index) in detail.productList"
								:key="index" @click="choosePro(item.productId)">
								<image v-if="hasId(item.productId)" class="pro_choose" src="../../static/yes.png"
									mode=""></image>
								<view v-else class="pro_not"></view>
								<view class="d-s-c">
									<view>
										<image class="product_img" :src="item.image[0].filePath" mode="aspectFill">
										</image>
									</view>
									<view class="pro">
										<view class="pro_t">{{item.productName}}</view>
										<view class="pro_c" v-if="alreadyChioce[item.productId]">
											{{alreadyChioce[item.productId]}}
										</view>
										<view class="d-b-c">
											<view class="pro_b"><text class="f18">￥</text>{{item.productPrice}}</view>
											<view class="speci" v-if="item.productMultiSpec!=null"
												@click="openPopup('order',item.productMultiSpec,item)">选规格</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btns">
			<view class="order_price">￥{{detail.money}}</view>
			<button @click="onPay()">立即支付</button>
		</view>
		<!--购物确定-->
		<spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec>
	</view>
</template>

<script>
	import {
		pay
	} from '@/common/pay.js';
	import Myinfo from './giftpackage/my-info';
	import Storeinfo from './giftpackage/store-info';
	import spec from './giftpackage/spec.vue';
	import utils from '@/common/utils.js';
	export default {
		components: {
			Myinfo,
			Storeinfo,
			spec
		},
		data() {
			return {
				/*是否加载完成*/
				loadding: false,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				id: 0,
				tab_type: 0,
				/*礼包详情*/
				detail: {
					name: '',
					point: '',
					money: '',
					coupon_list: [],
				},
				storeId: 0,
				// 是否存在收货地址
				existAddress: false,
				/*默认地址*/
				Address: null,
				/* 配送类别 */
				delivery: 10,
				extractStore: {},
				lastExtract: {},
				chooseProlist: [],
				/*是否显示支付类别弹窗*/
				isPayPopup: false,
				payType: 10,
				/*子级页面传参*/
				productModel: {},
				/*规格选择弹窗*/
				isPopup: false,
				/*已经选择的规格*/
				alreadyChioce: {},
				code: 0,
				/* 点击的商品规格 */
				chooseSpecData: null,
				/*点击的商品详情*/
				chooseDetail: {
					productSku: {},
					showSku: {
						productPrice: '',
						productSkuId: 0,
						linePrice: '',
						stockNum: 0,
						skuImage: ''
					}
				},
				params: []
			}
		},
		onLoad(e) {
			let self = this;
			let scene = utils.getSceneData(e);
			self.$fire.on('selectStoreId', function(storeId) {
				self.storeId = storeId;
			});
			/*商品id*/
			this.packageId = e.packageId;
			this.code = e.code;
		},
		onShow() {
			this.getData();
		},
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title: '加载中'
				})
				if (self.detail.name == '') {
					self.delivery = 0;
				}
				let params = {
					giftPackageId: self.packageId,
					delivery: self.delivery,
					code: self.code
				}
				if (self.delivery == 20) {
					params.storeId = self.storeId
				}
				params.pay_source = self.getPlatform();
				self._postBody('plus/package/package/toBuy', params, function(res) {
					self.detail = res.data;
					if(res.data.extractStore!=null) {
						self.extractStore = res.data.extractStore;
					}else {
						self.extractStore = {};
						self.extractStore.storeId=-1;
					}
					
					self.existAddress = res.data.existAddress;
					self.Address = res.data.address;
					self.delivery = res.data.delivery;
					uni.hideLoading()
					self.loadding = false;
				}, function(res) {
					uni.navigateBack({
						delta: 1
					})
				});
			},
			hasType(e) {
				if (this.deliverySetting.indexOf(e) != -1) {
					return true;
				} else {
					return false;
				}
			},
			/*选择配送方式*/
			tabFunc(e) {
				this.tab_type = e;
				if (e == 0) {
					this.delivery = 10;
				} else {
					this.delivery = 20;
				}
				this.getData();
			},
			hasId(id) {
				let self = this;
				let n = self.chooseProlist.indexOf(id);
				if (n == -1) {
					return false;
				} else {
					return true;
				}
			},
			choosePro(id) {
				let self = this;
				let n = self.chooseProlist.indexOf(id);
				if (n == -1) {
					self.chooseProlist.push(id);
				} else {
					self.chooseProlist.splice(n, 1);
				}
			},
			/*购买*/
			payTypeFunc() {
				let self = this;
				uni.showLoading({
					title: '正在提交...'
				});
				let prolist = [];
				let errflag = false;
				self.chooseProlist.forEach((proitem, proindex) => {
					let flag = false;
					self.params.forEach((pramaitem, pramaindex) => {
						if (proitem == pramaitem.productId) {
							flag = true;
							prolist.push({
								productId: pramaitem.productId,
								productSkuId: pramaitem.productSkuId
							})
						}
					})
					if (!flag) {
						self.detail.productList.forEach((item, index) => {
							if (item.productId == proitem) {
								// if (item.specType == 20 && item.product_multi_spec.spec_attr.length > 0) {
								if (item.specType == 20 ) {
									uni.showToast({
										title: '请选择商品规格',
										icon: 'none'
									})
									errflag = true
								} else {
									prolist.push({
										productId: item.productId,
										productSkuId: 0
									})
								}
							}
						})
					}
				})
				if (errflag) {
					return;
				}
				let _linkman = null;
				let _phone = null;
				if (self.$refs != null) {
					if (self.$refs.getShopinfoData != null) {
						_phone = self.$refs.getShopinfoData.phone;
						_linkman = self.$refs.getShopinfoData.linkman;
					}
				}
				let extract = {
					phone: _phone,
					linkman: _linkman,
					storeId: self.storeId
				}
				let pay_source = 'wx';
				// #ifdef  H5
				pay_source = 'mp';
				// #endif
				let params = {
					code: self.code,
					giftPackageId: self.packageId,
					giftProductIds: prolist,
					delivery: self.delivery,
					address: self.Address,
					extract: extract
				}
				if (self.delivery == 10) {
					params.extract = null;
				}
				if (self.delivery == 20) {
					params.storeId = self.storeId;
					params.phone = params.extract.phone;
					params.linkman = params.extract.linkman;
					params.address = null;
				}
				self._postBody('plus/package/package/buy', params, function(res) {
					self.gotoPage('/pages/order/cashier?orderId=' + res.data + '&orderType=20');
				});
			},
			onPay() {
				let self = this;
				// 是否选择了商品
				if (self.chooseProlist.length < self.detail.productNum && self.detail.isProduct == 1) {
					uni.showToast({
						icon: 'none',
						title: '请选择商品'
					});
					return;
				}
				self.payTypeFunc()
			},
			/*关闭弹窗*/
			closePopup(e, params, cartTotalNum) {
				this.isPopup = false;
				let n = this.chooseProlist.indexOf(params.productId);
				if (n == -1) {
					this.chooseProlist.push(params.productId);
				}
				if (e && e.specAttr) {
					this.alreadyChioce[params.productId] = '';
					let has = '已选：';
					let noone = '';
					e.specAttr.forEach(item => {
						if (item.specItems) {
							let h = '';
							for (let i = 0; i < item.specItems.length; i++) {
								let child = item.specItems[i];
								if (child.checked) {
									h = child.specValue + ' / ';
									break;
								}
							}
							if (h != '') {
								has += h;
							} else {
								noone += item.groupName;
							}
						}
					});
					let flag = false;
					this.params.forEach((item, index) => {
						if (item.productId == params.productId) {
							flag = true;
							item = params;
						}
					})
					if (!flag) {
						this.params.push(params)
					}
					if (noone != '') {
						this.alreadyChioce[params.productId] = noone;
					} else {
						has = has.replace(/(\s\/\s)$/gi, '');
						this.alreadyChioce[params.productId] = has;
					}
				}
				if (cartTotalNum) {
					this.cartTotalNum = cartTotalNum;
				}
			},
			/* 打开弹窗 */
			openPopup(e, spe, detail) {
				let obj = {
					specData: spe,
					detail: detail,
					productSpecArr: spe != null ? new Array(spe.specAttr.length) : [],
					showSku: {
						skuImage: '',
						seckillPrice: 0,
						productSkuId: 0,
						linePrice: 0,
						seckillStock: 0,
						seckillProductSkuId: 0,
						sum: 1
					},
					type: e
				};
				this.productModel = obj;
				this.isPopup = true;
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}

	/*top-tab*/
	.top-tabbar {
		height: 90rpx;
		line-height: 86rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #FFFFFF;
		border-bottom: 1px solid #DDDDDD;
	}

	.tab-item {
		flex: 1;
		height: 90rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #666666;
	}

	.tab-item.active {
		border-bottom: 2px solid $dominant-color;
		margin-bottom: -2px;
		color: $dominant-color;
	}

	/*  */
	.gift-package {
		position: relative;
		min-height: 100vh;
		padding-bottom: 100rpx;
	}

	.gift-package .gift-package-main {
		width: 750rpx;
		background: #FFFFFF;
		padding: 30rpx;
		box-sizing: border-box;
	}

	.order_tit {
		padding-left: 30rpx;
		font-size: 28rpx;
		margin-bottom: 73rpx;
	}

	.gift-package-main .giftpackagr-info {
		margin: 0 auto;
		width: 350rpx;
		height: 43rpx;
		line-height: 43rpx;
		border: 1rpx solid #fa212c;
		margin-top: 18rpx;
		background: rgba(255, 255, 255, .8);
		border-radius: 30rpx;
		text-align: center;

	}

	.gift-package-main .giftpackagr-info .detatime {
		/* padding:10px 30px; */
		font-size: 18rpx;
		color: #fa1f29;
		font-weight: 800;
	}

	.cuopon-group {
		color: #ffffff;
		text-align: center;
		font-size: 30rpx;
		background-color: #ffffff30;
		border-radius: 15rpx;
		padding: 35rpx 0;
	}

	.cuopon-title {
		color: #919191;
		font-size: 35rpx;
		margin-bottom: 20rpx;
	}

	.cuopon-group .title {
		font-size: 24rpx;
		color: #cacaca;
		text-align: left;
	}

	.cuopon-group .body {}

	.cuopon_item {
		position: relative;
	}

	.item_cuopon {
		z-index: 50;
	}

	.cuopon-group .body .item {
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		position: relative;
	}

	.cuopon_img {
		width: 493rpx;
		height: 123rpx;
		position: absolute;
		top: 0;
		left: 0;
	}

	.cuopon-group .body .item .price {
		z-index: 50;
		font-size: 18rpx;
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

	.t-c {
		text-align: center;
	}

	.gift-package-main .integral {
		background-color: #ffffff66;
		padding-bottom: 60rpx;
		border-radius: 15rpx;
	}

	.gift-package-main .integral .title {
		font-size: 24rpx;
		color: #cacaca;
		text-align: left;
	}

	.gift-package-main .integral_btom {
		border: 1rpx solid #cacaca;
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
		margin-left: 40rpx;
	}

	.gift-package-main .integral .num {
		font-size: 50rpx;
	}

	.btns {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		bottom: 0;
		background-color: #FFFFFF;
		border-top: 1rpx solid #EEEEEE;
		z-index: 99;
	}

	.order_price {
		text-align: right;
		color: #fd0000;
		font-size: 30rpx;
		margin-left: 30rpx;
	}

	.btns button {
		width: 266rpx;
		height: 70rpx;
		background-color: #ee1413;
		color: #FFFFFF;
		text-align: center;
		line-height: 70rpx;
		border-radius: 35rpx;
	}

	.rule {
		overflow: hidden;
		position: absolute;
		right: 0;
		top: 480rpx;
		z-index: 100;
	}

	.rule_btn {
		margin-top: 27rpx;
		width: 183rpx;
		height: 62rpx;
		line-height: 62rpx;
		text-align: center;
		background-color: #e83514;
		border: 1rpx solid #ffffff;
		border-top-left-radius: 32rpx;
		border-bottom-left-radius: 32rpx;
		color: #ffffff;
		font-size: 26rpx;
	}

	.add {
		font-size: 73rpx;
		font-weight: 900;
		text-align: center;
		color: #FFFFFF;
	}

	.cuopon_num {
		display: inline-block;
		width: 40rpx;
		height: 40rpx;
		border: 1rpx solid #939393;
		margin-left: 150rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 18rpx;
		border-radius: 10rpx;
		position: absolute;
		top: 40px;
		right: 15px;
		color: #000000;
	}

	.product_img {
		width: 140rpx;
		height: 140rpx;
	}

	.pro {
		margin-left: 12rpx;
		text-align: left;
		flex: 1;
	}

	.pro_t {
		font-size: 24rpx;
		color: #000000;
		margin-bottom: 15rpx;
	}

	.pro_c {
		font-size: 20rpx;
		color: #686868;
	}

	.pro_b {
		font-size: 28rpx;
		color: #fd0000;
	}

	.f18 {
		font-size: 18rpx;
	}

	.pro_choose {
		width: 33rpx;
		height: 33rpx;
		position: absolute;
		right: 10rpx;
		top: 6rpx;
	}

	.borbox {
		border: 1rpx solid #cacaca;
	}

	.type_activ {
		width: 40rpx;
		height: 40rpx;
		background-color: #04BE01;
		border-radius: 50%;
		overflow: hidden;
		text-align: center;
		line-height: 1;
	}

	.icon-tijiaochenggong {
		color: #FFFFFF;
		font-size: 22rpx;
	}

	.speci {
		font-size: 24rpx;
		width: 100rpx;
		height: 44rpx;
		color: #FFFFFF;
		text-align: center;
		border-radius: 22rpx;
		background-color: #fd0000;
		line-height: 44rpx;
	}

	.pro_not {
		width: 33rpx;
		height: 33rpx;
		position: absolute;
		right: 10rpx;
		top: 6rpx;
		border: 1rpx solid #CACACA;
		border-radius: 50%;
	}
</style>
