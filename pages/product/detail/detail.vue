<template>
	<view class="product-detail " @touchstart="start" @touchend="move" @scrolltolower="onScrollToLower">
		<view class="ww100" :style="'height:' + 60 + 'px'" style="background-color: #fff;" v-if="showText"></view>
		<!-- <headTitle title="商品详情">
			
		  </headTitle> -->
		<scroll-view @scroll="scrollFunc" scroll-y="true" class="scroll-box" :style="'height:' + scrollviewHigh + 'px'"
			v-if="!loadding">
			<!--图片-->
			<!-- <view class="ww100" :style="'height:' + topBarTop() + 'px'"></view> -->
			<view class="product-pic" id="product-pic">
				<swiper class="swiper" indicator-active-color="#ffffff" indicator-color="rgba(255,255,255,.3)"
					:indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration"
					@change="changeSwiper">
					<swiper-item v-if="detail.videoId != 0">
						<view v-if="!isVideoPlay" class="icon iconfont icon-bofang" @click="isVideoPlay = true"></view>
						<image v-if="!isVideoPlay" :src="detail.posterId > 0
							? detail.posterFilePath
							: detail.image[0].filePath
							" mode="" @click="isVideoPlay = true"></image>
						<video v-if="isVideoPlay" :src="detail.videoFilePath" :autoplay="isVideoPlay"
							@click="isVideoPlay = false" class="video" :controls="false" :show-center-play-btn="false"
							:show-play-btn="false" :enable-progress-gesture="false"></video>
					</swiper-item>
					<swiper-item v-for="(item, index) in detail.image" :key="index">
						<image :src="item.filePath" mode="aspectFit"></image>
						<!-- <image width="104rpx" v-if="detail.activityProduct==1"
						height="104rpx" style="width:100%;height:88rpx;position:absolute;left:0rpx;bottom:0rpx;opacity:1;" threshold="10" src="../../../static/bgActivity2.png"  mode=""/> -->
					</swiper-item>
				</swiper>
				<view class="user-order-item-num">{{currentIndex}}/{{detail.image.length}}</view>
				
				<view  :class="showText?'bgWhite':''" class="herd" style="position: fixed;left: 0;z-index: 9999;top:60rpx">
					<text class="iconfont icon-right_arrow" @click="goBack()"></text>
					<text class="" v-if="showText" style="font-size:32rpx">商品详情</text>
					<view class="banner-fenxiang" @click="openQr(detail.productId)">
						<!-- <text class="iconfont icon-fenxiang"></text> -->
						<image style="width: 42rpx;height:42rpx;margin-top:8rpx" src="/static/fenxiang.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<!-- 规格  -->
			<view class="detail-info">
				<view class="detail-num" txt="价格">
					<view class="detail-price">
						<text class="detail-price-z" ><text style="font-size: 28rpx;margin-left:20rpx;">¥</text><text style="margin-left:6rpx;">{{ toPositive(detail.productPrice) }}</text> </text>
						<text class="detail-price-m">{{ detail.exchangePrice }}</text>
					</view>
					<!-- <view class="detail-sales" v-if="detail.specialType!=1">销量{{ detail.productSales }}</view> -->
					<view class="detail-sales" v-if="detail.salesShow==0">销量{{ detail.productSales }}</view>
				</view>
				<view class="goods-title" txt="描述">
					<text>
						<image class="goods-national" :src="detail.countryImage" mode="" />
						{{ detail.productName }}
					</text>
				</view>

				<!-- 产品运费服务 新加============= specType===20 有规格  等于10 就是无规则， 等于空， 就是配置的也没有"{isbackshow:detail_back}" -->

				<view v-if="detail.parameterExtension != ''|| detail.specType === 20"  style="margin-top: 40rpx;">
					<view class="detail-param  detail_back">

						<view class="detail-param-item " v-if="detail.specType === 20">
							<text class="detail-param-text">规格</text>
							<view class="detail-param-item-r" @click="openPopup('card')">
								<text>{{ this.alreadyChioce }} </text>
							</view>
							<text style="color: #000;transform: rotate(180deg);font-size:26rpx;margin-top:-10rpx;left:10rpx;position:relative" class="iconfont icon-right_arrow" @click="openPopup('card')"></text>
						</view>

						<view v-if="detail.parameterExtension != ''">
							<view class="detail-param-item"
								v-for="(item, index) in JSON.parse(detail.parameterExtension)" :key="index">
								<text class="detail-param-text">{{ item.title }}</text>
								<view class="detail-param-item-r" @click="openPopupdetail(item)" v-if="item.details != ''">
									<text> {{ item.value }} </text>
								</view>
								<view class="detail-param-item-r" v-else>
									<text> {{ item.value }} </text>
								</view>
								<text style="color: #000;transform: rotate(180deg);font-size:26rpx;margin-top:-10rpx;left:10rpx;position:relative" v-if="item.details != ''" class="iconfont icon-right_arrow"
									@click="openPopupdetail(item)"></text>
							</view>
						</view>
					</view>
				</view>


				<view class="goods-comment" txt="评论">
					<view class="goods-comment-title">
						<text>评价{{commentDataCount>0?'('+commentDataCount+')':''}}</text>
						<view class="goods-comment-title-r" @click="link_evalute(detail.productId)">
							
							<text v-if="commentDataCount>0">{{ '更多评价' }}</text>
							<text :style="{color:'#999999'}" v-else>{{'暂无评价' }}</text>

							<text style="color: #000;transform: rotate(180deg);font-size:24rpx;" class="iconfont icon-you"></text>
						</view>
					</view>
					<view class="comment-info" v-if="commentData.length>0">
						<image style="border-radius: 36rpx;" class="comment-info-img" :src="commentData.length>0&&commentData[0].avatarUrl? commentData[0].avatarUrl:'https://ywy-test-static.yiweiyi.cn/3fc150a052f64fe2add8905ed97d6235.png'" mode="" />
						<view class="comment-info-box">
							<view class="comment-info-1">
								<view class="comment-info-1-l">
									<text class="comment-info-phone">
										{{ commentData.length>0? commentData[0].nickName:''}}
									</text>
									<!-- <view class="comment-level" style="width: 127rpx;height:27rpx;">
										<image style="width: 127rpx;height:27rpx;" src="/static/home/user/member1.png" mode="" />
									</view> -->
								</view>
								<view class="comment-time">
									<!-- 2022-12-12 -->
									{{ commentData.length>0? commentData[0].createTime:''}}
								</view>
							</view>

							<view class="comment-info-2">
								<view class="comment-esteem">
									<text style="font-size:24rpx" class="iconfont icon-shoucang2" v-for="item in commentData[0].productScore"></text>
									<text style="font-size:24rpx" class="iconfont icon-shoucang1" v-for="item in (5-commentData[0].productScore)"></text>
									<!-- <text class="iconfont icon-shoucang1"></text>
									<text class="iconfont icon-shoucang1"></text>
									<text class="iconfont icon-shoucang1"></text>
									<text class="iconfont icon-shoucang1"></text> -->
								</view>
								<!-- <view class="comment-shop">
									 {{ commentData.length>0? commentData[0].productAttr:''}}
								</view> -->
							</view>
						</view>
					</view>
					<view class="comment-subtitle" v-if="commentData.length>0">
						<view >
							{{ commentData[0].content }}
						</view>
					</view>
					<view class="comment-subtitle-mian" v-if="commentData[0]">
						<view >
							<view v-for="(item,index) in commentData[0].image">
								<image class="comment-subtitle-itme" :src="item" mode="" />
							</view>
						</view>
					</view>
				</view>
				<!-- <view class="goods-recomm" txt="推荐">
					<view class="recomm-title">推荐商品</view>
					<view class="recomm-box">
						<view class="recomm-item" v-for=" (item, index) in detalilist" :key="index">
							<view  @click="goDetail(item.productId)">
								<image class="recomm-item-img" :src="item.productImage" mode="" />
								<view class="recomm-item-name">{{ item.simplifyTitle }}</view>
								<text class="recomm-item-price">{{ item.productPrice }}</text>
							</view>
						</view>
						<view class="recomm-item">
              <image class="recomm-item-img" src="/static/card.png" mode="" />
              <text class="recomm-item-name">香水身体乳系...</text>
              <text class="recomm-item-price">￥25.60</text>
            </view>
            <view class="recomm-item">
              <image class="recomm-item-img" src="/static/card.png" mode="" />
              <text class="recomm-item-name">香水身体乳系...</text>
              <text class="recomm-item-price">￥25.60</text>
            </view>

					</view>
				</view> -->
			</view>
			<!--详情内容-->
			<view class="product-content" id="product-content">
				<!-- <view class="p-0-30 border-b-e">
					<view class="group-hd d-s-c"><text class="min-name f28">商品介绍</text></view>
				</view> -->
				<view v-if="detail.isPicture == 0" class="content-box" v-html="detail.content"></view>
				<view v-if="detail.isPicture == 1" class="content-box" style="padding-bottom: 110rpx;">
					<view class="ww100" v-for="(item, index) in detail.contentImage" :key="index">
						<image class="ww100" :src="item.filePath" mode="widthFix" lazy-load="true"></image>
					</view>
				</view>
			</view>
		</scroll-view>

		<!--底部按钮-->
		<view class="btns-wrap">

			<!-- <view class="icon-box d-c-c" @click="gotoPage('/pages/index/index')">
				<button class="d-c-c d-c bg-white">
					<text
						class="btn_btom pr icon iconfont icon-shouye "
						style="font-size: 36rpx; height: 50rpx; line-height: 60rpx"
					></text>
					<text class="f22 " style="height: 50rpx; line-height: 40rpx"
						>首-页</text
					>
				</button>
			</view> -->



			<!-- #ifdef MP-WEIXIN -->
			<view class="icon-box d-c-c" @click="openMaservice">
				<!-- open-type="contact" session-from="wxapp" show-message-card="true" -->
				<button class="d-c-c d-c bg-white">
					<!-- <text class="icon iconfont icon-kefu "
						style="font-size: 36rpx; height: 50rpx; line-height: 60rpx"></text> -->
					<image class="collect-img" style="width: 44rpx;" src="/static/kefu.png" />
					<text class="f22 " style="height: 50rpx; line-height: 40rpx">客服</text>
				</button>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="icon-box d-c-c" @click="kefuDialogEvent">
				<button class="d-c-c d-c bg-white">
					<!-- <text class="icon iconfont icon-kefu "
						style="font-size: 40rpx;width:48rpx; height: 48rpx; line-height: 60rpx"></text> -->
					<image class="collect-img" style="width: 44rpx;" src="/static/kefu.png" />
					<text class="f22 " style="height: 50rpx; line-height: 40rpx">客服</text>
				</button>
			</view>
			<!-- #endif -->


			<view class="icon-box d-c-c" @click="collection(detail.productId)">
				<button class="d-c-c d-c bg-white">
					<image class="collect-img" style="width: 44rpx" src="/static/home/user/collect-yes.png" v-if="isicon_shoucang" mode="" />
					<image class="collect-img" style="width: 44rpx;" src="/static/home/user/collect-no.png" v-else />
					<text class="f22 " style="height: 50rpx; line-height: 40rpx">收藏</text>
				</button>
			</view>



			<view class="icon-box d-c-c" @click="gotocart">
				<button class="pr d-c-c d-c bg-white">
					<image class="collect-img" style="width: 44rpx;margin-left:-10rpx" src="/static/shopCart.png"/>
					<text class="f22 " style="height: 50rpx; line-height: 40rpx">购物车</text>
					<text v-if="cart_total_num > 0" class="cart_num">{{
						cart_total_num
					}}</text>
				</button>
			</view>
			<template v-if="isPreview == 1">
				<button class="add-cart-no" style="border-radius: 40rpx; margin-right: 20rpx">
					暂未开始售卖
				</button>
			</template>
			<template v-else>
				<button class="add-cart" @click="openPopup('card')">
					加入购物车
				</button>
				<button class="buy" @click="openPopup('order')">
					立即购买
				</button>

			</template>
		</view>
		<!--购物确定-->
		<spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec>
		<!--底部弹窗-->
		<share :isbottmpanel="isbottmpanel" :productId="productId" @close="closeBottmpanel"></share>
		<!--app分享-->
		<AppShare :isAppShare="isAppShare" :appParams="appParams" @close="closeAppShare"></AppShare>
		<!--生成图片-->
		<uniPopup :show="isCreatedImg" type="middle" @hidePopup="hidePopupFunc">
			<view class="d-c-c d-c create-img" @click="handleImageClick">
				<image :src="poster_img" mode="widthFix"></image>
				<!-- #ifdef MP -->
				<button class="btn-red mt20" type="default" @click="savePosterImg">
					保存图片
				</button>
				<!-- #endif  -->
				<!-- #ifdef H5 -->
				<view class="mt20 f34 red" type="default">{{ imgTip }}</view>
				<!-- #endif -->
			</view>
		</uniPopup>
		<!--客服-->
		<Mpservice v-if="isMpservice" :isMpservice="isMpservice" @close="closeMpservice"></Mpservice>
		<!--优惠券-->
		<coupon :isCoupon="isCoupon" :discount="discount" :couponList="discount?.productCoupon"
			@close="closeCouponFunc">
		</coupon>
		<UiPopup v-if="shareShow" style="z-index: 10;">
			<view class="share-box">
				<view class="share-main">
					<image class="share-img" :src="poster_img" mode="" />
					<view class="ui-btn btn-more btn-black" @click="savePosterImg">保存到相册</view>
				</view>
				<view class="share-close">
					<view class="share-close-box" @click="closeQr()">
						<text class="iconfont icon-shanchu"></text>
					</view>
					<view class="share-close-text" @click="closeQr()">取消</view>
				</view>
			</view>
		</UiPopup>
		<uniPopup :show="parShow" type="bottom" @hidePopup="hidePopupFunc" :width="690">
			<view class="par">
				<view class="par-top" style="position: relative;top:20rpx;">
					<view style="font-size: 30rpx;">{{ productModel_deal.title }}</view>
					<text class="iconfont icon-shanchu" @click="closedetal"></text>
				</view>
				<view class="par-attr" style="position: relative;margin-top:20rpx;">
					<!-- <text v-html="productModel_deal.details"></text> -->
					<rich-text  class="pre-wrap-class" :nodes="productModel_deal.details" v-if="productModel_deal.details"></rich-text>
				</view>
				<view class="par-foot" style="margin-top: 30rpx;">
					<view class="ui-btn btn-more btn-black" @click="closedetal">
						确定
					</view>
				</view>
			</view>
		</uniPopup>
		<uiPopup v-if="confirmBoxOrder" style="z-index: 99999;">
			<view class="confirm-box">
			  <view class="confirm-box-title"> {{confirmMsg}} </view>
			  <view class="confirm-box-describe"> </view>
			  <view class="confirm-box-btn" slot="btnBox">
				<view class="ui-btn btn-more btn-width" @click="closeOrder" style="margin-right: 20rpx;">取消</view>
				<view class="ui-btn btn-more btn-width btn-black" @click="closeOrder">确定</view>
			  </view>
			</view>
		</uiPopup>
		<uiPopup v-if="confirmBoxOrder2" class="uoiuoi">
			<view class="confirm-box">
			  <view class="confirm-box-title"> 是否允许南合商城访问您设备上的照片、媒体内容和文件?</view>
			  <view class="confirm-box-describe"> </view>
			  <view class="confirm-box-btn" slot="btnBox">
			  <view class="ui-btn btn-more btn-width" @click="closeOrder" style="margin-right: 20rpx;">取消</view>
			  <view class="ui-btn btn-more btn-width btn-black" @click="dectcloseOrder">确定</view>
			  </view>
			</view>
		  </uiPopup>
	</view>
</template>

<script>
import coupon from './popup/coupon.vue';
import share from './popup/share.vue';
import spec from './popup/spec.vue';
import uniPopup from '@/components/uni-popup2.vue';
import Mpservice from '@/components/mpservice/Mpservice.vue';
import AppShare from '@/components/app-share.vue';
import utils from '@/common/utils.js';
import previewProduct from './productinfo/previewProduct.vue';
import Countdown from '@/components/countdown/countdown-presale.vue';
import UiPopup from '@/pages/component/ui-popup.vue';
import { mapState } from 'vuex';
import headTitle from '@/pages/component/headTitle.vue';


export default {
	components: {
		spec,
		share,
		uniPopup,
		Mpservice,
		AppShare,
		coupon,
		Countdown,
		previewProduct,
		UiPopup,
		headTitle,
	},
	computed: {
		...mapState(['globalEvaluateSwitch']),
		imgTip() {
			let self = this;
			// #ifdef H5
			if (self.isWeixin()) {
				return '长按保存图片';
			} else {
				return '点击保存图片';
			}
			// #endif
		},
	},
	data() {
		return {
			confirmBoxOrder:false,
			confirmBoxOrder2:false,

			confirmMsg:'无法购买',
			showText:false,
			isbackshow: true,
			parShow: false,
			shareShow: false,
			ispresale: false,
			/*手机高度*/
			phoneHeight: 0,
			/*可滚动视图区域高度*/
			scrollviewHigh: 0,
			/*是否加载完成*/
			loadding: true,
			/*是否显示面板指示点*/
			indicatorDots: false,
			/*是否知道切换*/
			autoplay: false,
			/*自动切换时间间隔*/
			interval: 2000,
			currentIndex:1,
			/*滑动动画时长*/
			duration: 500,
			/*是否确定购买弹窗*/
			isPopup: false,
			/*商品id*/
			productId: null,
			/*商品详情*/
			detail: {
				productSku: {},
				showSku: {
					productPrice: '',
					productSkuId: 0,
					linePrice: '',
					stockNum: 0,
					skuImage: '',
				},
			},
			/*商品属性*/
			specData: null,
			/*子级页面传参*/
			productModel: {},
			buyNow: false,
			url: '',
			/*规格数组*/
			productSpecArr: [],
			/*购物车商品数量*/
			cart_total_num: 0,
			/*分享*/
			isbottmpanel: false,
			/*是否生成图片*/
			isCreatedImg: false,
			poster_img: '',
			/*是否打开客服*/
			isMpservice: false,
			/*已经选择的规格*/
			alreadyChioce: '',
			/*app分享*/
			isAppShare: false,
			appParams: {
				title: '',
				summary: '',
				path: '',
			},
			is_virtual: 1,
			isVideoPlay: false,
			isFav: false,
			isCoupon: false,
			couponList: [],
			show_discount: '',
			discount: {
				productCoupon: [],
				productReduce: [],
				givePoints: '',
			},
			/*倒计时配置*/
			countdownConfig: {
				/*开始时间*/
				startstamp: 0,
				/*结束时间*/
				endstamp: 0,
			},
			// 评论
			commentDataCount: 0,
			commentData: [],

			/* 活动字段 */
			activeName: '',
			activePrice: '',
			activeText: '',
			skuName: '',
			isPreview: false,
			sTop: 0,
			topId: '',
			scrollId: '',
			commentTop: 0,
			contentTop: 0,
			serviceUser: null,
			serviceType: null,
			detalilist: [], //推荐
			productModel_deal: {},
			isicon_shoucang: false,
			fenxiangimg: "",
			startData:{
				clientX:0,
				clientY:0
			}



		};
	},
	onReady() {
		uni.setNavigationBarColor({
			frontColor: '#000000',
			backgroundColor: '#F5F5F5',
		});
	},
	onLoad(e) {
		/*商品id*/
		let scene = utils.getSceneData(e);
		this.productId = e.productId ? e.productId : scene.gid;
		// 公众号分享
		if (this.getPlatform() == 'mp') {
			this.url = window.location.href;
		}
	},
	mounted() {
		this.init();
		/*获取产品详情*/
		this.getData();
		//商品详情推荐
		this.getwantgods();
	},
	/*分享*/
	onShareAppMessage() {
		let self = this;
		self.taskFunc();
		// 构建页面参数
		let params = self.getShareUrlParams({
			productId: self.productId,
		});
		return {
			title: self.detail.productName,
			path: '/pages/product/detail/detail?' + params,
		};
	},
		methods: {
			closeOrder(){
				this.confirmBoxOrder = false;
				this.confirmBoxOrder2 = false;
			},
			getList(res){
				// this.isPopup = false;
			    this.isPopup = false;
				this.confirmBoxOrder = true;
				this.confirmMsg = res.msg;
				console.log(res.msg,'B页面传递的数据')
			},
			onScrollToLower(){
				console.log('890809809')
			},
				start(e){
					console.log(e,'eeee')
						this.startData.clientX=e.changedTouches[0].clientX;
						this.startData.clientY=e.changedTouches[0].clientY;
		},
		move(e){
			console.log(e,'eeee')

			const subX=e.changedTouches[0].clientX-this.startData.clientX;
			const subY=e.changedTouches[0].clientY - this.startData.clientY;
			if(subY<-50){
				console.log('下滑')
			}else{
				if(subX>50){
					console.log('右滑')
				}else if(subX<-50){
					console.log('左滑')
				}else{
					console.log('无效')
				}
			}
		},


		link_evalute(id) {
			// console.log(id.productId)
			// let id = id.productId		
			let url = `/pages/product/detail/look-evaluate/look-evaluate?productld=${id}`
			this.gotoPage(url);

		},
		//转换html
		toHtml(str) {
			var arrEntities = {
				'lt': '<',
				'gt': '>',
				'nbsp': ' ',
				'amp': '&',
				'quot': '"'
			};
			return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,
				function (all, t) {
					return arrEntities[t];
				});
		},

		toPositive(price) {
			return price
			// if(price<0){
			// 	return '????'
			// }
			// return Math.max(0, price);
		},
		goDetail(productId) {
			let path = 'pages/product/detail/detail?productId=' + productId + '&appId=10001';
			this.gotoPage(path);
		},

		openQr(productId) {
			//console.log()
			this.showText = false;
			// 判断是否登录，需要登录跳转登录页面
			if (!uni.getStorageSync('token')) {
				this.gotoPage('/pages/login/weblogin');
				// uni.showToast({
				// 	title: '请先登录',
				// 	icon: 'none',
				// 	duration: 2000,
				// });
				// return;
			}


			let self = this;
			self._get(
				'product/product/poster',
				{
					productId: productId,
					source: "H5"
				},
				(res) => {
					if (res.code == 1) {
						self.poster_img = res.data
					}


				}
			);
			this.shareShow = true;
		},


		// 点击收藏
		collection(productId) {
			// 判断是否登录，需要登录跳转登录页面
			if (!uni.getStorageSync('token')) {
				this.gotoPage('/pages/login/weblogin');
				return;
			}
			let self = this
			self._post(
				'/user/favorite/fav',
				{ productId: productId },
				function (res) {
					console.log(res)
					// 添加收藏 msg"收藏成功" 
					//  取消收藏 msg""操作成功"
					if (res.code === 1) {
						res.msg == "收藏成功" ? self.isicon_shoucang = true : self.isicon_shoucang = false
						//res.msg =="" 

					}
				})
		},
		openPopupdetail(item) {
			// 判断是否登录，需要登录跳转登录页面
			// if (!uni.getStorageSync('token')) {
			// 	this.gotoPage('/pages/login/weblogin');
			// 	return;
			// }

			console.log(item)
			this.productModel_deal = item
			console.log(item.details,'item.details')
			this.productModel_deal.details = this.toHtml(item.details)
			this.parShow = true
			console.log(this.productModel_deal.details,this.productModel_deal.details.length,'this.productModel_deal.details')
			//this.height = this.productModel_deal.details.length+50;
			this.showText = false;

		},
		closedetal() {
			console.log("dianji")
			this.parShow = false
		},
		goBack() {
			uni.navigateBack()
		},

		//获取详情推荐商品
		getwantgods() {
			let self = this
			self._postBody(
				'/product/productRecommen/lists',
				{ code: "productDetails" },
				function (res) {
					//         console.log("商品详情推荐")
					// console.log(res)

					if (res.code === 1) {
						self.detalilist = res.data.records
						//self.swiperList = res.data
					}
				})
			// 
		},

		handleImageClick() {
			let self = this;
			// #ifdef H5
			if (!self.isWeixin()) {
				utils.saveImg(self.poster_img);
			} else return;
			// #endif
		},
		scrollFunc(e) {
			let self = this;
			self.scrollId = e.detail.scrollTop.toFixed(1);
			//console.log('opop',self.scrollId)
			if (self.scrollId > 100) {
				self.showText = true;
				// uni.setTabBarStyle({
				// backgroundColor: '#f00', // 这里替换为你想要的背景颜色，如'#00bfff'（蓝色）
				// });
			} else {
				self.showText = false;
				// uni.setTabBarStyle({
				// opacity: 0, // 这里替换为你想要的背景颜色，如'#00bfff'（蓝色）
				// });
			}
			// if (self.scrollId > self.commentTop) {
			// 	self.isShow = false;
			// }
			// this.showText = true;
		},
		/*初始化*/
		init() {
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					_this.phoneHeight = res.windowHeight;
					// 计算组件的高度
					let view = uni.createSelectorQuery().select('.btns-wrap');
					view
						.boundingClientRect((data) => {
							let h = _this.phoneHeight - data.height;
							_this.scrollviewHigh = h;
						})
						.exec();
				},
			});
		},
		initScroll() {
			let self = this;
			let topBarHeight = self.topBarHeight();
			let hight = 0;
			if (topBarHeight) {
				hight = self.topBarHeight() + self.topBarTop() + 50;
			} else {
				hight = 50;
			}
			uni.getSystemInfo({
				success(res) {
					// 计算组件的高度
					let comment = uni.createSelectorQuery().select('#product-comment');
					comment
						.boundingClientRect((data) => {
							console.log(data);
							self.commentTop = data.top - hight;
						})
						.exec();
					let content = uni.createSelectorQuery().select('#product-content');
					content
						.boundingClientRect((data) => {
							self.contentTop = data.top - hight;
						})
						.exec();
				},
			});
		},
		/*获取数据*/
		getData() {
			let self = this;
			// uni.showLoading({
			// 	title: '加载中',
			// });
			self._get(
				'product/product/detail',
				{
					productId: self.productId,
					url: self.url,
				},
				function (res) {

					//   console.log("====000===")
					//   console.log(JSON.parse(res.data.detail.parameterExtension)   )

					//    console.log(JSON.parse(res.data) )

					if (
						res.data.detail.isPreview == 1 &&
						new Date().valueOf() / 1000 < res.data.detail.previewTimeStamp
					) {
						/* 是否在预告中 */
						self.isPreview = res.data.detail.isPreview;
						self.activeText = '预告';
						self.activeName = 'preview';
						self.activePrice = 'preview_price';
						res.data.detail.preview = {
							startTime: new Date().valueOf() / 1000,
							endTime: res.data.detail.previewTimeStamp,
						};
					} else if (
						res.data.detail.secKill &&
						res.data.detail.secKill != null
					) {
						self.ispresale = true;
						self.activeName = 'secKill';
						self.activeText = '秒杀';
						self.activePrice = 'secKillPrice';
						self.skuName = 'secKillSku';
						res.data.detail.secKill.startTime =
							res.data.detail.secKill.active.startTime;
						res.data.detail.secKill.endTime =
							res.data.detail.secKill.active.endTime;
					} else if (
						res.data.detail.advance &&
						res.data.detail.advance != null
					) {
						self.ispresale = true;
						self.activeName = 'advance';
						self.activeText = '预售';
						self.activePrice = 'advancePrice';
						self.skuName = 'sku';
						res.data.detail.advance.startTime =
							res.data.detail.advance.startTime;
						res.data.detail.advance.endTime = res.data.detail.advance.endTime;
					}
					console.log(self.activeName);
					self.cart_total_num = res.data.cartTotalNum;

					/*详情内容格式化*/
					res.data.detail.content = utils.format_content(
						res.data.detail.content
					);

					// 初始化商品多规格
					if (res.data.detail.specType == 20) {
						self.initSpecData(res.data.specData);
						self.isbackshow = true //不是多规格的时候把背景去掉
					} else {
						self.isbackshow = false
					}

					self.detail = res.data.detail;
					self.isVirtual = res.data.detail.isVirtual;
					self.isFav = res.data.isFav;
					self.commentDataCount = res.data.commentDataCount;
					self.commentData = res.data.commentData;
					self.show_discount = res.data.show_discount;

					const discountInit = {
						productCoupon: [],
						productReduce: [],
						givePoints: '',
					};
					self.discount = res.data.discount || discountInit;
					// 配置微信分享参数
					if (self.getPlatform() == 'mp') {
						let params = {
							productId: self.productId,
						};
						self.configWx(
							res.data.share.signPackage,
							res.data.share.shareParams,
							params
						);
					}
					self.loadding = false;
					// uni.hideLoading();
					self.isicon_shoucang = res.data.isFav;
					// self.$nextTick(() => {
					// 	self.initScroll();
					// });
				}
			);
		},

		/*多规格商品*/
		initSpecData(data) {
			for (let i in data.specAttr) {
				for (let j in data.specAttr[i].specItems) {
					data.specAttr[i].specItems[j].checked = false;
				}
			}
			this.specData = data;
			if (this.specData.specAttr) {
				this.specData.specAttr.forEach((item) => {
					this.alreadyChioce += item.groupName;
					this.alreadyChioce += ' / ';
				});
				this.alreadyChioce = this.alreadyChioce.replace(/(\s\/\s)$/gi, '');
			}
		},




		/*选规格*/
		openPopup(e) {
			console.log("-----点击购物车----")
			console.log(e)
			// 判断是否登录，需要登录跳转登录页面
			if (!uni.getStorageSync('token')) {
				this.gotoPage('/pages/login/weblogin');
				return;
			}

			let obj = {
				specData: this.specData,
				detail: this.detail,
				productSpecArr:
					this.specData != null ? new Array(this.specData.specAttr.length) : [],
				showSku: {
					skuImage: '',
					price: 0,
					productSkuId: 0,
					linePrice: 0,
					stock: 0,
					sum: 1,
				},
				plusSku: null,
				type: e,
				plusName: '',
			};

			if (this.activeName == 'advance') {
				obj.plusSku = this.detail.advance.sku;
				obj.plusName = 'advance';
			}
			if (this.activeName == 'secKill') {
				obj.plusSku = this.detail.secKill.seckillSku;
				obj.plusName = 'seckill';
			}

			console.log("传过去的参数")
			this.productModel = obj;
			this.isPopup = true;
			this.showText = false;

		},





		closeQr() {
			this.shareShow = false;
		},
		// yesFn(){
		//   this.parShow = true
		// },
		/*关闭弹窗*/
		closePopup(e, cart_total_num) {

			console.log("guanbi")
			console.log(e)


			this.isPopup = false;
			if (e && e.specAttr) {
				this.alreadyChioce = '';
				let has = '已选：';
				let noone = '';
				e.specAttr.forEach((item) => {
					if (item.specItems) {
						let h = '';
						for (let i = 0; i < item.specItems.length; i++) {
							let child = item.specItems[i];
							if (child.checked) {
								child.checked = false;
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
				if (noone != '') {
					this.alreadyChioce = noone;
				} else {
					has = has.replace(/(\s\/\s)$/gi, '');
					this.alreadyChioce = has;
				}
			}
			if (cart_total_num) {
				this.cart_total_num = cart_total_num;
			}
		},
		openCoupon() {
			this.isCoupon = !this.isCoupon;
			console.log(this.isCoupon);
		},
		/*关闭优惠券*/
		closeCouponFunc(e) {
			this.isCoupon = false;
		},
		/*查看更多评价*/
		lookEvaluate(productId) {
			this.gotoPage(
				'/pages/product/detail/look-evaluate/look-evaluate?productId=' +
				productId
			);
		},

		/*分享*/
		onShareAppMessage() {
			let self = this;
			// 构建页面参数
			let params = self.getShareUrlParams({
				productId: self.productId,
			});
			return {
				title: self.detail.productName,
				path: '/pages/product/detail/detail?' + params,
			};
		},

		/*跳转购物车*/
		gotocart() {
			uni.switchTab({
				url: '/pages/cart/cart',
			});
		},

		//关闭分享
		closeBottmpanel(data) {
			this.isbottmpanel = false;
			if (data.type == 2) {
				this.poster_img = data.poster_img;
				this.isCreatedImg = true;
			}
		},
		//关闭分享
		closeAppShare(data) {
			this.isAppShare = false;
		},
		//分享按钮
		showShare() {
			let self = this;
			//#ifndef APP-PLUS
			self.isbottmpanel = true;
			//#endif
			//#ifdef APP-PLUS
			self.appParams.title = self.detail.productName;
			self.appParams.summary = self.detail.productName;
			// 构建页面参数
			let params = self.getShareUrlParams({
				productId: self.productId,
			});
			self.appParams.path = '/pages/product/detail/detail?' + params;
			self.appParams.image = self.detail.image[0].filePath;
			self.isAppShare = true;
			//#endif
			self.taskFunc();
		},

		taskFunc() {
			let self = this;
			self._post(
				'plus/task/task/dayTask',
				{
					taskType: 'product',
				},
				(res) => {
					console.log('分享成功');
				}
			);
		},

		//关闭生成图片
		hidePopupFunc() {
			this.isCreatedImg = false;
		},

		//保存海报图片
		savePosterImg() {
			let self = this;
			self.showText = false;
			// uni.showLoading({
			// 	title: '加载中',
			// });
			// 下载海报图片
			uni.downloadFile({
				url: self.poster_img,
				success(res) {
					// uni.hideLoading();
					// 图片保存到本地
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success(data) {
							uni.showToast({
								title: '保存成功',
								icon: 'success',
								duration: 2000,
							});
							// 关闭商品海报
							self.isCreatedImg = false;
						},
						fail(err) {
							if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
								uni.showToast({
									title: '请允许访问相册后重试',
									icon: 'none',
									duration: 1000,
								});
								setTimeout(() => {
									uni.openSetting();
								}, 1000);
							}
						},
						complete(res) {
							console.log('complete');
						},
					});
				},
			});
		},
		goback() {
			uni.navigateBack();
			// let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			// console.log('ly', routes.length);
			// if (routes.length <= 1) {
			// 	this.gotoPage('/pages/index/index');
			// } else {
			// 	uni.navigateBack();
			// }
		},
		/*打开客服*/
		openMaservice() {
			// this.isMpservice = true;
			if (!uni.getStorageSync('token')) {
				this.gotoPage('/pages/login/weblogin');
				return;
			}else{
			this.gotoPage('/pageWebview/service/service');
		   }
		},
		dectcloseOrder(){
			this.openMaservice()
			this.confirmBoxOrder2 = false
		},
		kefuDialogEvent(){
			this.confirmBoxOrder2 = true
		},
		/*关闭客服*/
		closeMpservice() {
			this.isMpservice = false;
		},
		changeSwiper(e) {
			let self = this;
			this.isVideoPlay = false;
			self.currentIndex=e.detail.current + 1;
		},
		//收藏商品
		favorite() {
			let self = this;
			self._post(
				'user/favorite/fav',
				{
					productId: self.productId,
				},
				(res) => {
					if (self.isFav) {
						self.isFav = false;
						uni.showToast({
							title: res.msg,
						});
					} else {
						self.isFav = true;
						uni.showToast({
							title: res.msg,
						});
					}
				}
			);
		},
		returnValFunc(e) { },
		sendFunc(e) {
			this[e]();
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
image{will-change:transform;}

button {
	margin: 0;
	border: none;
}

.par {
	.par-top {
		@include fl-between;
		padding-bottom: 20rpx;
		font-family: Hiragino Sans GB, Hiragino Sans GB;
		font-weight: normal;
		font-size: 36rpx;
		color: #000000;
		font-style: normal;
		text-transform: none;

		.icon-shanchu {
			font-size: 36rpx;
			color: #000;
		}
	}

	.par-attr {
		overflow: auto;
		text-align: left;
		p{
			margin:0;
			padding:0;
		}

	}



}
.pre-wrap-class {
	white-space: pre-wrap;
	//line-height: 40rpx;
  }
.share-box {
	width: 700rpx;
	//height: 90vh;

	.share-main {
		height: 1034rpx;
		padding: 32rpx 28rpx;
		background: #F7F7F7;
		border-radius: 24rpx;

		.share-img {
			width: 632rpx;
			height: 1034rpx;
			border-radius: 16rpx;

		}

		.btn-more {
			position: relative;
			margin-top: -88rpx;
			margin-right: 20rpx;
		}
	}

	.share-close {
		height: 100rpx;

		.share-close-box {
			// display: inline-block;
			@include area(70rpx, 70rpx);
			border-radius: 70rpx;
			border: #fff solid 1px;
			line-height: 70rpx;
			text-align: center;
			color: #fff;
			margin: 20rpx auto 0 auto;

			.icon-shanchu {
				font-size: 52rpx;
				color: #fff;
			}
		}

		.share-close-text {
			text-align: center;
			color: #fff;
			font-family: Source Han Sans CN, Source Han Sans CN;
			font-size: 28rpx;
			color: #FFFFFF;
			font-style: normal;
			text-transform: none;
		}
	}
}

.product-detail .product-pic,
.product-detail .product-pic .swiper,
.product-detail .product-pic image {
	width: 750rpx;
	height: 750rpx;
}

.user-order-item-num{
      position: absolute;
      top: 325px;
      right: 10rpx;
      padding: 8rpx;
      height: 16px;
      line-height: 16px;
      display: flex;
	  justify-content: center;
      background: rgb(140,140,140);
      color:#fff;
      border-radius: 30px;
      width: 35px;
      z-index: 0;
    }

.product-detail .product-pic .swiper .icon-bofang {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
	font-size: 48rpx;
	color: #ffffff;
	border-radius: 50%;
	border: 4rpx solid #ffffff;
	width: 120rpx;
	height: 120rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #00000080;
	padding-left: 16rpx;
	box-sizing: border-box;
	z-index: 10;
}

.product-pic {
	position: relative;

	.herd {
		@include fl-between();
		position: absolute;
		top: 60rpx;
		width: 100%;
		padding: 0 40rpx;
		box-sizing: border-box;

		.banner-fenxiang {
			width: 64rpx;
			height: 64rpx;
			//background: rgba(0, 0, 0, 0.45);
			border-radius: 32rpx;
			line-height: 64rpx;
			text-align: center;
			padding-top: 10rpx;

			.icon-fenxiang {
				font-size: 50rpx;
			}
		}

		.icon-right_arrow {
			font-size: 35rpx;
			color: #000;
		}
	}

}

.scroll-box {
	// padding-bottom: env(safe-area-inset-bottom);
	box-sizing: border-box;
}
.bgWhite{
	background-color: #fff;
	position: fixed;
	top: 20rpx;
}
.detail-info {
	padding: 40rpx 20rpx 20rpx 20rpx;
	background-color: #fff;

	.detail-num {
		@include fl-between();
		padding: 0 0 24rpx 0;

		.detail-price-z {
			font-family: Roboto, Roboto;
			font-weight: bold;
			font-size: 56rpx;
			color: #000000;
		}

		.detail-price-m {
			font-family: Roboto, Roboto;
			font-weight: 300;
			font-size: 24rpx;
			color: #000000;
			padding-left: 12rpx;
		}

		.detail-sales {
			font-family: Hiragino Sans GB, Hiragino Sans GB;
			font-weight: normal;
			font-size: 24rpx;
			color: #000000;
			margin-right: 20rpx;
		}
	}
}

.goods-title {
	font-family: Hiragino Sans GB, Hiragino Sans GB;
	font-weight: normal;
	font-size: 32rpx;
	color: #040404;
	line-height: 52rpx;
	text-align: left;
	font-style: normal;

	display: -webkit-box;
	-webkit-box-orient: vertical;

	overflow: hidden;
	// display: flex;
	// flex-wrap: wrap;
	// align-content: center;
	margin: 0 20rpx;

	.goods-national {
		display: inline-block;
		width: 40rpx;
		height: 30rpx;
		position: relative;
		top: -5rpx;

	}
}

.detail_back {
	background: #F7F7F7;
}

.detail-param {

	border-radius: 36rpx;
	padding: 40rpx 40rpx;
	margin: 20rpx;

	.detail-param-item {
		@include fl-between();
		line-height: 80rpx;

		.detail-param-text {
			width: 100rpx;
			font-family: Hiragino Sans, Hiragino Sans;
			font-weight: normal;
			font-size: 28rpx;
			color: #040404;
		}

		.detail-param-item-r {
			@include fl-between();
			flex: 1;
			font-family: Hiragino Sans GB, Hiragino Sans GB;
			font-weight: normal;
			font-size: 28rpx;
			color: #5C5C5C;

			.iconfont {
				color: #000000;
			}
		}
	}
}

.goods-comment {
	background: #F7F7F7;
	border-radius: 36rpx;
	padding: 20rpx 40rpx;
	margin: 20rpx;

	.goods-comment-title {
		@include fl-between();
		font-family: Hiragino Sans, Hiragino Sans;
		font-weight: normal;
		font-size: 28rpx;
		color: #040404;
		line-height: 80rpx;

		.goods-comment-title-r {
			font-family: Hiragino Sans, Hiragino Sans;
			font-weight: normal;
			font-size: 24rpx;
			color: #000000;
			position: relative;
			right: -6rpx;

			.iconfont {
				color: #000;
			}
		}
	}

	.comment-info {
		@include fl-between();

		.comment-info-img {
			@include area(72rpx, 72rpx)
		}

		.comment-info-box {
			flex: 1;
			padding-left: 20rpx;
		}

		.comment-info-1 {
			@include fl-between();

		}

		.comment-info-1-l {
			display: flex;
			align-items: center;
		}

		.comment-info-phone {
			font-family: Roboto, Roboto;
			font-weight: 400;
			font-size: 28rpx;
			color: #333333;
		}

		.comment-level {
			font-family: Hiragino Sans, Hiragino Sans;
			font-weight: normal;
			font-size: 20rpx;
			color: #646464;
			padding: 4rpx 8rpx;
			margin-left: 8rpx;

			background: linear-gradient(180deg, #FFFFFF 0%, #DCDCDC 100%);
			border-radius: 20rpx;
			border: 1rpx solid #DBDBDB;
		}

		.comment-time {
			font-family: Roboto, Roboto;
			font-weight: 400;
			font-size: 20rpx;
			color: #999999;
		}

		.comment-info-2 {
			@include fl-between();

		}

		.comment-esteem {
			.iconfont {
				margin-right: 4rpx;
			}

			.icon-shoucang2 {
				color: #EE2828;
			}
		}

		.comment-shop {
			max-width: 250rpx;
			font-family: Hiragino Sans, Hiragino Sans;
			font-weight: normal;
			font-size: 20rpx;
			color: #999999;
		}
	}

	.comment-subtitle {
		font-family: Hiragino Sans GB, Hiragino Sans GB;
		font-weight: normal;
		font-size: 28rpx;
		color: #232323;
		line-height: 60rpx;
		padding-top: 20rpx;
	}

	.comment-subtitle-mian {
		@include fl-between();
		padding-bottom: 20rpx;

		.comment-subtitle-itme {
			width: 180rpx;
			height: 160rpx;
			border-radius: 12rpx;
		}
	}
}

.goods-recomm {
	background: #F7F7F7;
	border-radius: 36rpx;
	padding: 20rpx 40rpx;
	margin: 20rpx;

	.recomm-title {
		font-family: Hiragino Sans, Hiragino Sans;
		font-weight: normal;
		font-size: 28rpx;
		color: #040404;
		line-height: 80rpx;
	}

	.recomm-box {
		@include fl-between();

		.recomm-item {
			width: 33%;
			text-align: center;
		}

		.recomm-item-img {
			@include area(180rpx, 180rpx)
		}

		.recomm-item-name {
			font-family: Hiragino Sans GB, Hiragino Sans GB;
			font-weight: normal;
			font-size: 24rpx;
			color: #232323;
			line-height: 60rpx;
			// @include ellipsis;
			overflow: hidden;
			height: 60rpx;
		}

		.recomm-item-price {
			font-family: Roboto, Roboto;
			font-weight: 600;
			font-size: 28rpx;
			color: #000000;
		}
	}
}



.product-content {
	margin-top: 20rpx;
	margin-left: 23rpx;
	margin-right: 25rpx;
	background: #ffffff;
	border-radius: 20rpx;
}

.product-content .content-box p image {
	width: 100%;
}

.product-content .content-box {
	font-size: 36rpx;
}

.btns-wrap {
	position: fixed;
	height: 100rpx;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	background: #ffffff;
	align-items: center;
	padding-left: 5rpx;
	padding-bottom: env(safe-area-inset-bottom);

	.collect-img {
		//@include area(48rpx, 48rpx); -->
		//width: 40rpx;
		//height: 40rpx;
		margin-top: 18rpx;
	}
}

.btns-wrap .icon-box {
	width: 92rpx;
	height: 100rpx;
}

.btns-wrap .icon-box .iconfont {
	font-size: 40rpx;
	color: #000;
}

.btns-wrap .icon-box .iconfont .num {
	position: absolute;
	top: 10rpx;
	left: 50%;
	height: 30rpx;
	min-width: 30rpx;
	overflow: hidden;
	line-height: 32rpx;
	border-radius: 15rpx;
	font-size: 20rpx;
	color: #ffffff;
	background: red;
}

.btns-wrap button,
.btns-wrap button:after {
	height: 100rpx;
	line-height: 100rpx;
	margin: 0;
	padding: 0;
	flex: 1;
	border-radius: 0;
	border: 0;
}

.btns-wrap button.add-cart {
	font-size: 28rpx;
	width: 214rpx;
	height: 75rpx;
	line-height: 75rpx;
	border-top-left-radius: 40rpx;
	border-bottom-left-radius: 40rpx;
	margin-left: 17rpx;
	background: #BE1E1E;
	color: #fff;
	// @include font_color('text_color2');
	// @include background_linearmore(
	// 	'cart_left1',
	// 	'cart_left2',
	// 	'left_deg',
	// 	0%,
	// 	100%
	// );
}

.btns-wrap button.add-cart-no {
	font-size: 28rpx;
	width: 214rpx;
	height: 75rpx;
	line-height: 75rpx;
	border-top-left-radius: 40rpx;
	border-bottom-left-radius: 40rpx;
	color: #ffffff;
	margin-left: 17rpx;
	background: #cccccc;
}

.btns-wrap button.buy {
	font-size: 28rpx;
	width: 214rpx;
	height: 75rpx;
	line-height: 75rpx;
	border-top-right-radius: 40rpx;
	border-bottom-right-radius: 40rpx;
	margin-right: 30rpx;
	background: #222222;
	color: #fff;
	// @include font_color('text_color1');
	// @include background_linearmore(
	// 	'cart_right1',
	// 	'cart_right2',
	// 	'right_deg',
	// 	0%,
	// 	100%
	// );
}

.btns-wrap button.buy.ispresale {
	line-height: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.red {
	color: #f6220c !important;
}

.create-img {
	width: 100%;
	padding: 20rpx;
	box-sizing: border-box;
}

.create-img image {
	width: 100%;
}

.create-img button {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	box-shadow: 0 8rpx 16rpx 0 rgba(226, 35, 26, 0.6);
}


.h1 {
	font-size: 32rpx;
}

.h2 {
	font-size: 28rpx;
}

.h3 {
	font-size: 24rpx;
}

.h4 {
	font-size: 20rpx;
}

.h5 {
	font-size: 16rpx;
}

.h6 {
	font-size: 12rpx;
}

.header {
	z-index: 99;
	position: fixed;
	height: 30px;
	line-height: 30px;
	top: 0;
	left: 0;
	width: 100%;
	padding-top: var(--status-bar-height);
}

.btn_btom {
	height: 90rpx;
	line-height: 45rpx;
}

.cart_num {
	position: absolute;
	background: #f43530;
	width: 30rpx;
	height: 30rpx;
	display: flex;
	line-height: 30rpx;
	justify-content: center;
	align-items: center;
	font-size: 18rpx;
	border-radius: 50%;
	color: #ffff;
	right: 4rpx;
	top: 10rpx;
}

.video {
	width: 100%;
	height: 100%;
}

.group-hd {
	position: relative;
	padding-left: 0rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.group-hd.d-b-s {
	height: auto;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}


.hide.group-hd::after {
	width: 0;
}

.group-hd .line-h-90 {
	line-height: 90rpx;
}

.group-hd .line-h-50 {
	line-height: 50rpx;
}

/* 预售 */
.product-detail .limited-spike {
	position: relative;
	z-index: 2;
	margin-top: -112rpx;
	padding: 0 35rpx;
	color: #ffffff;
	background: linear-gradient(140deg, #f11e0b 0%, #f77737 100%);
	border-radius: 15rpx;
	height: 278rpx;
	padding: 40rpx 21rpx;
	box-sizing: border-box;
}

.product-detail .limited-spike .left-name {
	font-size: 22rpx;
	color: #ffffff;
}

.product-detail .limited-spike .right-time {
	position: absolute;
	right: 20rpx;
	top: 58rpx;
}

.product-detail .limited-spike .right-time .jiantou {
	width: 20rpx;
	height: 20rpx;
	margin-left: 9rpx;
}
</style>
