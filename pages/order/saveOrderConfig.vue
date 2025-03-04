<template>
	<view class="wrap" :data-theme="theme()" :class="theme()" v-if="!loading">
		<!--tab-->
		<view class="top-tabbar" v-if="OrderData.delivery != 30">
			<block v-if="hasType(10)">
				<view
					:class="tab_type == 0 ? 'tab-item active' : 'tab-item'"
					@click="tabFunc(0)"
					>快递配送</view
				>
			</block>
			<block v-if="hasType(20)">
				<view
					:class="tab_type == 1 ? 'tab-item active' : 'tab-item'"
					@click="tabFunc(1)"
					>上门自提</view
				>
			</block>
		</view>
		<view class="p-0-23">
			<Myinfo
				:dis="options.orderType == 'retainage'"
				v-if="tab_type == 0 && OrderData.delivery != 30"
				:Address="Address"
				:existAddress="existAddress"
			>
			</Myinfo>

			<Storeinfo
				v-if="tab_type == 1 && OrderData.delivery != 30"
				ref="getShopinfoData"
				:extractStore="extractStore"
				:lastExtract="lastExtract"
			></Storeinfo>

			<!--购买的产品-->
			<view class="vender br6">
				<view class="list">
					<view class="d-b-c f24 fb mb30 top-title">
						<view>商品信息</view>
						<view>共{{ orderTotalNum }}件</view>
					</view>
					<view class="item" v-for="(item, index) in ProductData" :key="index">
						<view class="d-f">
							<view class="cover">
								<image :src="item.productImage" mode="aspectFit"></image>
							</view>
							<view class="info">
								<view class="d-b-s">
									<view class="flex-1">
										<view class="title f32 gray3">{{ item.productName }}</view>
										<view class="theme-price mt10 f18">
											¥<text class="f26">{{ item.productPrice }}</text>
										</view>
										<view
											class="describe mt10 f24"
											v-if="options.orderType == 'deposit'"
										>
											{{ item.advanceSku.productAttr }}</view
										>
										<view class="describe mt10 f24">{{
											item.productSku.productAttr
										}}</view>
									</view>
									<view>
										<view class="count_choose">
											<view class="num-wrap">
												<view class="f22 tr">×{{ item.totalNum }}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="mt10 tr f28" v-if="item.isUserGrade == true">
							<text class="f26">会员折扣价：</text>
							<text class="theme-price f32"
								>￥{{ item.gradeProductPrice }}</text
							>
						</view>
						<view class="mt10 tr f28" v-if="item.productReduceMoney > 0">
							<text class="f26">立减：</text>
							<text class="theme-price f32"
								>￥{{ item.productReduceMoney }}</text
							>
						</view>
					</view>
				</view>
			</view>

			<!--其它费用-->
			<view class="buy-checkout br6">
				<template v-if="options.orderType == 'deposit'">
					<view class="d-f-c">
						<text class="key f26">定金：</text>
						<view class="f24">￥{{ OrderData.money }}</view>
					</view>
					<view class="item">
						<text class="key">配送费用：</text>
						<view>
							<text class="f24">￥{{ OrderData.expressPrice }}</text>
						</view>
					</view>
					<view class="d-f-c">
						<text class="key f26">尾款：</text>
						<view class="f24"> ￥{{ OrderData.balancePayment }}</view>
					</view>
					<view class="f-d-c p30">
						<view class="ww100 d-e-c red"
							>(单件商品尾款已减{{ OrderData.reduceMoney }}元)
						</view>
						<view class="ww100 d-e-c gray9">
							{{ OrderData.advanceEndTime }}支付尾款
							<!-- {{supplier_item.productList[0].advance.active_time[0]}}-{{supplier_item.productList[0].advance.active_time[1]}}支付尾款 -->
						</view>
					</view>
				</template>
				<template v-else>
					<view class="item">
						<text class="key f26">商品金额：</text>
						<view class="f24">￥{{ OrderData.orderTotalPrice }}</view>
					</view>
					<view class="item">
						<text class="key">配送费用：</text>
						<view>
							<text class="f24">￥{{ OrderData.expressPrice }}</text>
						</view>
					</view>
					<!-- <view class="item" v-if="settledRule.isCoupon">
						<text class="key">优惠券：</text>
						<block v-if="couponList.length > 0">
							<view class="f24 theme-price" v-if="OrderData.couponId > 0"
								@click="onTogglePopupCoupon(couponList)">-￥{{ OrderData.couponMoney }}</view>
							<view v-else class="hascoupon" @click="onTogglePopupCoupon(couponList)">
								{{ couponList.length }}张可用<text class="icon iconfont icon-jiantou"></text></view>
						</block>
						<text v-else class="f24 gray9">无优惠券可用</text>
					</view> -->
					<view class="item" v-if="OrderData.product_reduce_money > 0">
						<text class="key">商品立减：</text>
						<view>
							<text class="theme-price f24"
								>-￥{{ OrderData.product_reduce_money }}</text
							>
						</view>
					</view>
					<view class="item" v-if="OrderData.reduce">
						<text class="key">满减({{ OrderData.reduce.activeName }})：</text>
						<view>
							<text class="theme-price f24"
								>-￥{{ OrderData.reduce.reducedPrice }}</text
							>
						</view>
					</view>
					<view class="item" v-if="OrderData.reduce_money">
						<text class="key">尾款抵扣：</text>
						<view>
							<text class="theme-price f24"
								>-￥{{ OrderData.reduce_money }}</text
							>
						</view>
					</view>
					<view
						class="item"
						v-if="OrderData.isAllowPoints && OrderData.pointsMoney > 0"
					>
						<text class="key">可用积分抵扣：</text>
						<view class="">
							<text class="price">-￥{{ OrderData.pointsMoney }}</text>
							<switch
								:checked="is_use_points"
								style="transform: scale(0.7); margin-right: -10rpx"
								@change="onShowPoints"
							/>
						</view>
					</view>
					<view class="item" v-if="OrderData.randomReductionNum">
						<text class="key">随机立减(最高立减99元)：</text>
						<view>
							<text class="theme-price f24"
								>-￥{{ OrderData.randomReductionNum }}</text
							>
						</view>
					</view>
				</template>

				<view class="item">
					<view class="border-t-d9 d-e-c p-30-0 ww100">
						<text class="key f24">小计：</text>
						<view class="f38 fb"
							><text class="f24">￥</text
							>{{ toDecimal2(OrderData.orderPayPrice) }}</view
						>
					</view>
				</view>
			</view>
			<!--买家留言-->
			<view class="buyer-message uni-textarea">
				<textarea
					class="textarea"
					v-model="remark"
					placeholder-style="color:#cccccc;line-height:1;"
					placeholder="选项:买家留言"
				/>
			</view>
		</view>

		<!--底部支付-->
		<view class="foot-pay-btns">
			<template v-if="options.orderType == 'deposit'">
				<view>
					应付
					<text class="fb theme-price">¥</text>
					<text class="num theme-price fb f38">{{ payDeposit() }}</text>
				</view>
			</template>
			<template v-else>
				<view v-if="!settledRule.forcePoints">
					应付
					<text class="fb theme-price">¥</text>
					<text class="num theme-price fb f38">{{
						OrderData.orderPayPrice
					}}</text>
				</view>
				<view class="price" v-if="settledRule.forcePoints">
					<text class="gray9">所需积分</text>
					<text class="num theme-price fb">{{ OrderData.pointsNum }}</text>
					<template v-if="OrderData.orderPayPrice > 0">
						<text class="theme-price">+</text>
						<text class="theme-price">¥</text>
						<text class="num fb theme-price">{{
							OrderData.orderPayPrice
						}}</text>
					</template>
				</view>
			</template>
			<!-- #ifdef  H5 -->
			<template v-if="isWeixin() && mpState == 1 && temlIds.length > 0">
				<wx-open-subscribe
					:template="temlIds"
					id="subscribe-btn"
					@success="subscribeSuccess"
					@error="subscribeFail"
					:style="{
						width: btnAtrrpx.width + 'px',
					}"
				>
					<div v-is="'script'" type="text/wxtag-template" slot="style">
						<div v-is="'style'">
							.subscribe-btn.theme0{ background: #ff5704; }
							.subscribe-btn.theme1{ background: #19ad57; }
							.subscribe-btn.theme2{ background: #ffcc00; }
							.subscribe-btn.theme3{ background: #33a7ff; }
							.subscribe-btn.theme4{ background: #e4e4e4; }
							.subscribe-btn.theme5{ background: #c8ba97; }
							.subscribe-btn.theme6{ background: #623ceb; } .subscribe-btn {
							display:flex; width:100%; align-items:center;
							justify-content:center; color: #fff; border:none; }
						</div>
					</div>
					<div v-is="'script'" type="text/wxtag-template">
						<div
							class="subscribe-btn"
							:class="theme()"
							:style="{
								height: btnAtrrpx.height + 'px',
								lineHeight: btnAtrrpx.height + 'px',
								borderRadius: btnAtrrpx.borderRadius + 'px',
								fontSize: btnAtrrpx.fontSize + 'px',
							}"
						>
							提交订单
						</div>
					</div>
				</wx-open-subscribe>
			</template>
			<template v-else>
				<button @click="SubmitOrderBefore">提交订单</button>
			</template>
			<!-- #endif -->
			<!-- #ifndef  H5 -->
			<button @click="SubmitOrderBefore">提交订单</button>
			<!-- #endif -->
		</view>

		<!--优惠券-->
		<Coupon
			:isCoupon="isCoupon"
			:couponList="couponList"
			@close="closeCouponFunc"
		></Coupon>
		<!--支付-->
		<Checkout
			:isCheckout="isCheckout"
			:order_id="order_id"
			@close="closeCheckoutFunc"
		></Checkout>
	</view>
</template>

<script>
import Myinfo from './confirm-order/my-info.vue';
import Storeinfo from './confirm-order/store-info.vue';
import Coupon from './confirm-order/coupon.vue';
//#ifdef H5
import jweixin from 'weixin-js-sdk';
//#endif
import { pay } from '@/common/pay.js';
import Checkout from './checkout';
export default {
	components: {
		Myinfo,
		Storeinfo,
		Coupon,
		Checkout,
	},
	data() {
		return {
			/*是否加载完成*/
			loading: true,
			options: {},
			indicatorDots: true,
			autoplay: true,
			interval: 2000,
			duration: 500,
			tab_type: 0,
			/*商品id*/
			product_id: '',
			/*商品数量*/
			product_num: '',
			/*商品数据*/
			ProductData: [],
			/*订单数据数据*/
			OrderData: {},
			/*结算规则*/
			settledRule: {},
			// 是否存在收货地址
			existAddress: false,
			/*默认地址*/
			Address: {
				region: [],
			},
			extractStore: [],
			lastExtract: {},
			product_sku_id: 0,
			/*配送方式*/
			delivery: 0,
			/*自提店id*/
			storeId: 0,
			/*优惠券id*/
			coupon_id: 0,
			/*是否使用积分*/
			is_use_points: 1,
			linkman: '',
			phone: '',
			remark: '',
			/*支付方式*/
			pay_type: 20,
			/*是否显示优惠券*/
			isCoupon: false,
			couponId: 0,
			/*优惠券列表*/
			couponList: [],
			deliverySetting: [],
			/*优惠券数量*/
			coupon_num: 0,
			/*消息模板*/
			temlIds: [],
			// 支付相关
			isCheckout: false,
			order_id: 0,
			order_type: '',
			orderTotalNum: 0, //商品数量
			url: '',
			btnAtrrpx: {},
			// 1 公众号登录
			mpState: null,
		};
	},
	onLoad(options) {
		let self = this;
		let mpState = uni.getStorageSync('mpState');
		this.mpState = mpState;
		// 公众号分享
		if (this.getPlatform() == 'mp') {
			this.url = window.location.href;
		}
		self.options = options;
		self.$fire.on('selectStoreId', function (store) {
			self.storeId = store.storeId;
			self.extractStore = store;
		});
		self.$fire.on('extract', function (params) {
			self.lastExtract = params;
		});
		let btnAtrrpx = {
			height: 80,
			borderRadius: 40,
			fontSize: 32,
			width: 200,
		};
		uni.getSystemInfo({
			success: function (res) {
				let scale = res.screenWidth / 750;
				let newObj = {};
				for (let key in btnAtrrpx) {
					newObj[key] = btnAtrrpx[key] * scale;
				}
				self.btnAtrrpx = newObj;
			},
			fail() {
				self.btnAtrrpx = btnAtrrpx;
			},
		});
	},
	onShow() {
		this.getData();
		//#ifdef H5
		this.getTemplateId();
		//#endif
	},
	methods: {
		subscribeSuccess() {
			this.SubmitOrderBefore();
			console.log('调用成功');
		},
		subscribeFail() {
			this.SubmitOrderBefore();
			console.log('调用失败');
		},
		payDeposit() {
			return (
				parseFloat(this.OrderData.money) +
				((this.orderData && this.orderData.expressPrice) || 0)
			);
		},
		/**/
		hasType(e) {
			if (this.deliverySetting.indexOf(e) != -1) {
				return true;
			} else {
				return false;
			}
		},
		/*是否使用积分选择*/
		onShowPoints: function (e) {
			let self = this;
			if (e.detail.value == true) {
				self.is_use_points = 1;
			} else {
				self.is_use_points = 0;
			}
			self.getData();
		},
		/*选择优惠卷*/
		onTogglePopupCoupon(e) {
			let self = this;
			self.isCoupon = true;
			self.couponList = e;
		},
		/*关闭优惠券*/
		closeCouponFunc(e) {
			this.isCoupon = false;
			if (e == null) {
				return;
			}
			let self = this;
			self.couponId = e;
			self.getData();
		},
		/*获取数据*/
		getData() {
			let self = this;
			uni.showLoading({
				title: '加载中',
			});
			let callback = function (res) {
				console.log(res, '商品查询信息');
				self.orderTotalNum = res.data.orderTotalNum;
				self.OrderData = res.data.orderData;
				self.temlIds = res.data.templateArr;
				self.existAddress = self.OrderData.existAddress;
				self.Address = self.OrderData.address;
				self.extractStore = self.OrderData.extractStore;
				if (self.extractStore == null) {
					self.extractStore = {};
				}
				self.lastExtract = self.OrderData.lastExtract;
				self.settledRule = res.data.settledRule;
				self.ProductData = res.data.productList;
				if (res.data.couponList) {
					self.couponList = res.data.couponList;
				}
				self.delivery = self.OrderData.delivery;
				if (self.OrderData.delivery == 20) {
					self.tab_type = 1;
				}
				self.deliverySetting = self.OrderData.deliverySetting;
				if (self.OrderData.order_pay_price == 0) {
					self.pay_type = 10;
				}
				self.loading = false;
			};

			// 请求的参数
			let params = {
				delivery: self.delivery,
				storeId: self.storeId,
				couponId: self.couponId,
				isUsePoints: self.is_use_points,
				paySource: self.getPlatform(),
			};

			//直接购买
			if (self.options.orderType === 'buy') {
				self._postBody(
					'order/order/toBuy',
					Object.assign({}, params, {
						productId: self.options.productId,
						productNum: self.options.productNum,
						specSkuId: self.options.specSkuId,
						url: self.url,
					}),
					function (res) {
						callback(res);
					},
					(err) => {
						uni.navigateBack();
					}
				);
			}
			//定金
			if (self.options.orderType === 'deposit') {
				let test = Object.assign({}, params, {
					productId: self.options.productId,
					productNum: self.options.productNum,
					productSkuId: self.options.productSkuId,
					advanceProductSkuId: self.options.advanceProductSkuId,
					advanceProductId: self.options.advanceProductId,
				});
				self._postBody(
					'plus/advance/order/frontBuy',
					test,
					function (res) {
						callback(res);
					},
					(err) => {
						uni.navigateBack();
					}
				);
			}
			//尾款
			if (self.options.orderType === 'retainage') {
				self._get(
					'plus/advance.Order/buy',
					Object.assign({}, params, {
						order_id: self.options.order_id,
					}),
					function (res) {
						callback(res);
					}
				);
			}
			// 购物车结算
			else if (self.options.orderType === 'cart') {
				self._postBody(
					'order/order/toCart',
					Object.assign({}, params, {
						cartIds: self.options.cartIds || 0,
					}),
					function (res) {
						if(res.code==1){
							callback(res);
						}else{
							uni.showToast({
									title: res.msg,
									mask: false,
									duration: 1000,
								});
								uni.navigateBack();
								//return;

						}
						//callback(res);
					}
				);
			}
			// 积分兑换结算
			else if (self.options.orderType == 'points') {
				self._postBody(
					'plus/points/order/toBuy',
					Object.assign({}, params, {
						pointProductId: self.options.pointProductId,
						pointProductSkuId: self.options.pointProductSkuId,
						productSkuId: self.options.productSkuId,
						productNum: self.options.productNum,
					}),
					function (res) {
						callback(res);
					},
					(err) => {
						uni.navigateBack();
					}
				);
			}
			// 限时秒杀
			else if (self.options.orderType === 'seckill') {
				params.num = self.options.num;
				self._postBody(
					'plus/seckill/order/toBuy',
					Object.assign({}, params, {
						seckillProductId: self.options.seckillProductId,
						productSkuId: self.options.productSkuId,
						seckillProductSkuId: self.options.seckillProductSkuId,
						productNum: self.options.productNum,
					}),
					function (res) {
						callback(res);
					},
					(err) => {
						uni.navigateBack();
					}
				);
			}
			//砍价
			else if (self.options.orderType === 'bargain') {
				self._postBody(
					'plus/bargain/order/toBuy',
					Object.assign({}, params, {
						bargainProductId: self.options.bargainProductId,
						productSkuId: self.options.productSkuId,
						bargainProductSkuId: self.options.bargainProductSkuId,
						bargainTaskId: self.options.bargainTaskId,
					}),
					function (res) {
						callback(res);
					},
					(err) => {
						uni.navigateBack();
					}
				);
			}
			//拼团
			else if (self.options.orderType === 'assemble') {
				self._postBody(
					'plus/assemble/order/toBuy',
					Object.assign({}, params, {
						assembleProductId: self.options.assembleProductId,
						productSkuId: self.options.productSkuId,
						assembleProductSkuId: self.options.assembleProductSkuId,
						productNum: self.options.productNum,
						assembleBillId: self.options.assembleBillId,
					}),
					function (res) {
						callback(res);
					},
					(err) => {
						uni.navigateBack();
					}
				);
			}
		},

		getTemplateId() {
			let self = this;
			self._postBody(
				'index/getSignPackage',
				{
					url: self.url,
					paySource: self.getPlatform(),
				},
				function (res) {
					// self.temlIds = res.data.templateArr;
					self.mpMessage(res.data.signPackage);
				}
			);
		},

		/*选择配送方式*/
		tabFunc(e) {
			let self = this;
			if (this.options.orderType == 'retainage') {
				return;
			}
			this.tab_type = e;
			if (e == 0) {
				if (self.delivery == 10) return;

				this.delivery = 10;
			} else {
				if (self.delivery == 20) return;

				this.delivery = 20;
			}

			this.getData();
		},
    SubmitOrderBefore() {
      let self = this;
      if(self.OrderData.expressPrice > 0){
        uni.showModal({
          title: '该订单需要您额外支付',
          content: self.OrderData.expressPrice + '元运费',
          cancelText: '再想想',
          confirmText: '继续付款',
          success: function (res) {
            if (res.confirm) {
              console.log("同意")
              self.SubmitOrder()
            } else if (res.cancel) {
              return
            }
          },
        });
        return
      }
      self.SubmitOrder()
    },
		/*提交订单*/
		SubmitOrder() {
			let self = this;
			uni.showLoading({
				title: '加载中',
				mask: true,
			});
			let params = {
				delivery: self.delivery,
				storeId: self.storeId || 0,
				couponId: self.couponId,
				isUsePoints: self.is_use_points,
				phone: self.lastExtract.phone,
				linkman: self.lastExtract.linkman,
				remark: self.remark,
			};

			// 创建订单-直接下单
			let url = '';
			if (self.options.orderType === 'buy') {
				url = 'order/order/buy';
				params = Object.assign(params, {
					productId: self.options.productId,
					productNum: self.options.productNum,
					specSkuId: self.options.specSkuId,
				});
			}
			//定金
			if (self.options.orderType === 'deposit') {
				url = 'plus/advance/order/buy';
				params = Object.assign(params, {
					productId: self.options.productId,
					productNum: self.options.productNum,
					productSkuId: self.options.productSkuId,
					advanceProductSkuId: self.options.advanceProductSkuId,
					advanceProductId: self.options.advanceProductId,
				});
			}
			//尾款
			if (self.options.orderType === 'retainage') {
				url = 'plus/advance/Order/buy';
				params = Object.assign(params, {
					order_id: self.options.order_id,
				});
			}
			// 创建订单-购物车结算
			if (self.options.orderType === 'cart') {
				url = 'order/order/cart';
				params = Object.assign(params, {
					cartIds: self.options.cartIds || 0,
				});
			}

			// 创建订单-积分兑换
			if (self.options.orderType === 'points') {
				url = 'plus/points/order/buy';
				params = Object.assign(params, {
					pointProductId: self.options.pointProductId,
					pointProductSkuId: self.options.pointProductSkuId,
					productSkuId: self.options.productSkuId,
					productNum: self.options.productNum,
				});
			}
			// 创建订单-限时秒杀
			if (self.options.orderType === 'seckill') {
				url = 'plus/seckill/order/buy';
				params.num = self.options.num;
				params = Object.assign(params, {
					seckillProductId: self.options.seckillProductId,
					productSkuId: self.options.productSkuId,
					seckillProductSkuId: self.options.seckillProductSkuId,
					productNum: self.options.productNum,
				});
			}
			// 创建订单-砍价
			if (self.options.orderType === 'bargain') {
				url = 'plus/bargain/order/buy';
				params = Object.assign(params, {
					bargainProductId: self.options.bargainProductId,
					productSkuId: self.options.productSkuId,
					bargainProductSkuId: self.options.bargainProductSkuId,
					bargainTaskId: self.options.bargainTaskId,
				});
			}

			// 创建订单-限时拼团
			if (self.options.orderType === 'assemble') {
				url = 'plus/assemble/order/buy';
				params = Object.assign(params, {
					assembleProductId: self.options.assembleProductId,
					productSkuId: self.options.productSkuId,
					assembleProductSkuId: self.options.assembleProductSkuId,
					assembleBillId: self.options.assembleBillId,
					productNum: self.options.productNum,
				});
			}
			let callback = function () {
				self._postBody(url, params, function (res) {
					let pages = '/pages/order/cashier?orderId=' + res.data;
					if (self.options.orderType == 'deposit') {
						pages = '/pages/order/cashier?orderType=40&orderId=' + res.data;
					}
					self.gotoPage(pages, 'reLaunch');
				});
			};
			self.subMessage(self.temlIds, callback);
		},
		toDecimal2(x) {
			var f = parseFloat(x);
			if (isNaN(f)) {
				return '0.00';
			}
			var f = Math.round(x * 100);
			var n = Math.round(x * 1000);
			var r = n.toString().split('');
			r = r[r.length - 1];
			if (r >= 5) {
				f = (f - 1) / 100;
			} else {
				f = f / 100;
			}
			var s = f.toString();
			var rs = s.indexOf('.');
			if (rs < 0) {
				rs = s.length;
				s += '.';
			}
			while (s.length <= rs + 2) {
				s += '0';
			}
			return s;
		},
		closeCheckoutFunc() {
			this.isCheckout = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.weixinBtn {
	float: right;
}
page {
	background-color: #f2f2f2;
}

.f-d-c {
	flex-direction: column;
}

.wrap {
	padding-bottom: 110rpx;
}

.d-f-c {
	display: flex;
	justify-content: space-between;
	align-items: center;
	overflow: hidden;
	padding: 30rpx;
	border-bottom: 1rpx solid #d9d9d9;
}

.dfjac {
	display: flex;
	align-items: center;
}

.d-txar {
	white-space: nowrap;
	width: 200px;
	margin-right: 34rpx;
}

.extp {
	color: #9e9e9e;
	margin-left: 34rpx;
}

.vender .list .item {
	border-bottom: none;
}

.vender .top-title {
	padding: 30rpx 25rpx;
}

.icon-jiantou {
	margin-left: 15rpx;
}

.icon-dianpu1 {
	margin-right: 15rpx;
	font-size: 28rpx;
	color: #333333;
}

.sup_itemtit {
	padding: 40rpx 30rpx;
	display: flex;
	align-items: center;
}

.vender .total-box {
	height: 87rpx;
	line-height: 87rpx;
	border-bottom: 16rpx solid #f2f2f2;
}

.d-f {
	display: flex;
}

.zt {
	padding: 2rpx 10rpx;
	margin-right: 10rpx;
	background: #e2231a;
	color: #ffffff;
	border-radius: 8rpx;
	font-size: 22rpx;
}

.icon-box .icon-zhifubao {
	color: #1296db;
	font-size: 50rpx;
}

.icon-dianpu1 {
}

.text_area {
	width: 100%;
	height: 120rpx;
	background: #f2f2f2;
	border-radius: 6rpx;
	padding: 20rpx;
	box-sizing: border-box;
	font-size: 24rpx;
}

.icon-xuanze {
	font-size: 38rpx;
}

.tab-item {
	font-size: 28rpx;
	color: #333333;
	font-weight: 400;
}

.tab-item.active {
	font-size: 28rpx;
	color: #333333;
	font-weight: 400;
}

.tab-item.active::after {
	width: 115rpx;
	height: 6rpx;
}

.hascoupon {
	padding: 0 18rpx;
	box-sizing: border-box;
	height: 38rpx;
	line-height: 38rpx;
	border-radius: 200rpx;
	color: #ffffff;
	background: linear-gradient(180deg, #fc4133, #ff7a04);
	font-size: 20rpx;

	.icon.icon-jiantou {
		color: #ffffff;
		font-size: 20rpx;
		margin-left: 2rpx;
	}
}

.buy-checkout {
	.item {
		padding: 16rpx 30rpx;
		border-bottom: none;
	}
}
</style>
