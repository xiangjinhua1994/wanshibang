<template>
	<view class="set">
		<view style="position: relative;top: 0;left: 0;width: 100%;z-index: 9999;background: #fff;">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle title="物流通知"></headTitle>
</view>
    <view class="set-detail"  v-if="deliveryType!=40">
		<view class="detailPackage">
			<!-- <view class="Package2">
				<view>包裹</view> 
				<view class="btn-div"  style="background: #000;color:#fff" v-if="obj.receiptStatus==10">待收货</view> 
				<view class="btn-div"  style="background: #000;color:#fff" v-if="obj.receiptStatus==20">已收货</view> 
		    </view>
			<view class="Package1">
				<view>订单编号：</view> 
				<view>{{obj.orderNo}}</view> 
			</view>
			<view class="Package1">
				<view>快递公司：</view> 
				<view>{{obj.expressName}}</view> 
			</view>
			<view class="Package1">
				<view>发货时间：</view> 
				<view>{{obj.deliveryTime}}</view> 
			</view>
			<view class="Package1">
				<view>快递编号：</view> 
				<view>{{obj.expressNo}}</view> 
			</view> -->
			<view class="" style="width: 100%;height: 520px;position:relative;">
				<!-- <web-view class="webview" :style="webviewStyles" :webview-styles="webviewStyles"  :src="url" :fullscreen="false"></web-view> -->

            <web-view class="webview" :style="webviewStyles" :webview-styles="webviewStyles"  :src="url" :fullscreen="false"></web-view>
		    </view>

		</view>
		<view class="logisticsTracking" style="top:760rpx;z-index: 9999;position:fixed;bottom:40rpx;">
			<view class="Package2">
				<view style="width: 60rpx;height:60rpx;z-index: 9999;">
                    <!-- <icon type="download" size="26"/> -->
                    <image style="width: 46rpx;height:46rpx;margin-top:16rpx;" class="bg-coupon-item" src="/static/che.png" mode=""></image>
                </view> 
                <view class="PackageInfo">
                    <view style="display: flex;z-index: 9999;"><text style="color: rgb(31,183,16)">{{obj.expressName}}</text>：<text style="margin-top: 5rpx;">{{obj.expressNo}}</text><text style="width: 80rpx;height:30rpx;margin-left:175rpx;border:1px solid #eee;text-align:center;line-height:30rpx" @click="paste(obj.expressNo)">{{'复制'}}</text></view>
                    <view style="width: 600rpx;margin-top:6rpx;display:flex;z-index: 9999;" v-if="showExpandBool">
                        <view class="Pnowrap" style="width:500rpx">收货地址：{{obj.takeAddress}}</view>
                         <view @click="showExpand" style="margin-top: -4rpx;margin-left:10rpx">展开<uni-icons type="bottom" size="18"></uni-icons></view>
                    </view>
                    <view style="width: 600rpx;margin-top:6rpx;display:flex;z-index: 9999;" v-if="!showExpandBool">
                        <view style="width:500rpx">收货地址：{{obj.takeAddress}}</view>
                         <view @click="showExpand" style="margin-top: -4rpx;margin-left:10rpx">收起<uni-icons type="top" size="18"></uni-icons></view>
                    </view>
                </view> 

		    </view>
			<view class="content" style="display: flex;">
				<view class="contentLeft" v-if="showMore">
					<view style="position: relative;" v-for="(item,index) in dataList">
						<view class="contentLeftB" :style="index==0?'border-color:rgb(31,183,16)':'border-color:#D9D9D9'"><view class="contentLeftBo" :style="index==0?'background-color:rgb(31,183,16)':'background-color:#D9D9D9'"></view></view>
						<view class="contentLeftA" v-if="index!=dataList.length-1"></view>
						<view style="position: absolute; width:610rpx;top:-2rpx;left:50rpx">
							<view :title="item.context" style="padding-right: 5rpx;">{{item.context}} </view>
					        <view>{{item.time}} </view>
						</view>
					</view>
				</view>
			</view>
            <view  style="z-index: 9999;" class="pickUp" @click.stop.prevent="showMore=false" v-if="showMore">收起 <uni-icons type="right" size="18"></uni-icons></view>
            <view style="z-index: 9999;" class="pickUp" @click.stop.prevent="showExpand2" v-if="!showMore">展开 <uni-icons type="bottom" size="18"></uni-icons></view>

		</view>
    </view>
	<view v-else style="position:fixed;overflow-y:auto;height:80vh;padding-bottom:360rpx;padding-left:22rpx;padding-right:22rpx;">
		<view class="detailPackage">
			<!-- <view class="Package2">
				<view>包裹</view> 
				<view class="btn-div"  style="background: #000;color:#fff" v-if="obj.receiptStatus==10">待收货</view> 
				<view class="btn-div"  style="background: #000;color:#fff" v-if="obj.receiptStatus==20">已收货</view> 
		    </view>
			<view class="Package1">
				<view>订单编号：</view> 
				<view>{{obj.orderNo}}</view> 
			</view>
			<view class="Package1">
				<view>快递公司：</view> 
				<view>{{obj.expressName}}</view> 
			</view>
			<view class="Package1">
				<view>发货时间：</view> 
				<view>{{obj.deliveryTime}}</view> 
			</view>
			<view class="Package1">
				<view>快递编号：</view> 
				<view>{{obj.expressNo}}</view> 
			</view> -->
			<!-- <view class="" style="width: 100%;height: 520px;position:relative;"> -->
				<!-- <web-view class="webview" :style="webviewStyles" :webview-styles="webviewStyles"  :src="url" :fullscreen="false"></web-view> -->

            <!-- <web-view class="webview" :style="webviewStyles" :webview-styles="webviewStyles"  :src="url" :fullscreen="false"></web-view> -->
		    <!-- </view> -->

		</view>
		<view class="logisticsTracking2" style="top:60rpx;z-index: 9999;position:relative;background:#fff;border-radius:24rpx;margin-bottom:30rpx;" v-for="(item ,index) in dataArr">
			<view style="position: relative;border-bottom: 1px dotted #eee;padding-bottom:30rpx">
				<view class="bguo" style="padding-top: 58rpx;padding-left:46rpx">包裹{{index+1}}</view>
				<view v-for="ind in item.productList" style="width: 500rpx;padding-top: 8rpx;padding-left:46rpx">
					<image style="width: 93rpx;height:85rpx;margin-top:16rpx;" class="bg-coupon-item" :src="ind.imagePath" mode=""></image>
				</view>
				<view @click="watchMore(item)" class="" style="padding-top: 58rpx;padding-left:46rpx;position:absolute;right:20rpx;top:80rpx;color:#999;cursor:pointer;">共{{item.productList.length}}件 <text style="color: #999;">查看更多<uni-icons type="right" size="14"></uni-icons></text></view>


			</view>

			<view class="Package2" style="display: flex;;margin-bottom:40rpx">
				<view style="width: 60rpx;height:60rpx;z-index: 9999;">
                    <!-- <icon type="download" size="26"/> -->
                    <image style="width: 46rpx;height:46rpx;margin-top:16rpx;" class="bg-coupon-item" src="/static/che.png" mode=""></image>
                </view> 
                <view class="PackageInfo">
                    <view style="display: flex;z-index: 9999;"><text style="color: rgb(31,183,16)">{{item.expressName}}</text>：<text style="margin-top: 5rpx;">{{item.expressNo}}</text><text style="width: 80rpx;height:36rpx;margin-left:175rpx;border:1px solid #000;text-align:center;line-height:36rpx;border-radius:90rpx;" @click="paste(item.expressNo)">{{'复制'}}</text></view>
                    <view style="width: 600rpx;margin-top:10rpx;display:flex;z-index: 9999;" v-if="item.showExpandBool">
                        <view class="Pnowrap" style="width:500rpx">收货地址：{{item.takeAddress}}</view>
                         <view @click="showExpand3(item)" style="margin-top: -4rpx;margin-left:10rpx">展开<uni-icons type="bottom" size="18"></uni-icons></view>
                    </view>
                    <view style="width: 600rpx;margin-top:10rpx;display:flex;z-index: 9999" v-if="!item.showExpandBool">
                        <view style="width:500rpx">收货地址：{{item.takeAddress}}</view>
                         <view @click="showExpand3(item)" style="margin-top: -4rpx;margin-left:10rpx">收起<uni-icons type="top" size="18"></uni-icons></view>
                    </view>
                </view> 

		    </view>
			<view class="content" style="display: flex;"  v-for="(item2,index2) in item.express.data">
				<view class="contentLeft" v-if="item.showBool">
					<view style="position: relative;">
						<view class="contentLeftB" :style="index2==0?'border-color:#BE1E1E;':'border-color:#D9D9D9'"><view class="contentLeftBo" :style="index2==0?'background-color:#BE1E1E':'background-color:#D9D9D9'"></view></view>
						<view class="contentLeftA" v-if="index2!=item.express.data.length-1"></view>
						<view style="position: absolute; width:610rpx;top:-2rpx;left:50rpx">
							<view :title="item2.context" style="padding-right: 5rpx;color:#f00" v-if="index2==0">{{item2.context}} </view>
							<view :title="item2.context" style="padding-right: 5rpx;" v-else>{{item2.context}} </view>
					        <view v-if="index2==0" style="color: #f00;">{{item2.time}} </view>
							<view v-else>{{item2.time}} </view>

						</view>
					</view>
				</view>
				<view class="contentLeft" v-else>
					<view style="position: relative;" v-if="index2==0">
						<view class="contentLeftB" :style="index2==0?'border-color:#BE1E1E;':'border-color:#D9D9D9'"><view class="contentLeftBo" :style="index2==0?'background-color:#BE1E1E':'background-color:#D9D9D9'"></view></view>
						<view class="contentLeftA" v-if="index2!=item.express.data.length-1"></view>
						<view style="position: absolute; width:610rpx;top:-2rpx;left:50rpx">
							<view :title="item2.context" style="padding-right: 5rpx;color:#f00" v-if="index2==0">{{item2.context}} </view>
							<view :title="item2.context" style="padding-right: 5rpx;" v-else>{{item2.context}} </view>
					        <view v-if="index2==0" style="color: #f00;">{{item2.time}} </view>
							<view v-else>{{item2.time}} </view>
						</view>
					</view>
				</view>
			</view>
            <view  style="z-index: 9999;" class="pickUp" @click.stop.prevent="item.showBool=false" v-if="item.showBool">收起 <uni-icons type="top" size="18"></uni-icons></view>
            <view style="z-index: 9999;" class="pickUp" @click.stop.prevent="item.showBool=true" v-if="!item.showBool">查看完整物流 <uni-icons type="right" size="18" style="margin-top: 14rpx;"></uni-icons></view>

		</view>

	</view>
	<spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec>

	</view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue'
import spec from './specMap.vue';

export default {
	components: {
		headTitle,
		spec
	},
	data() {
		return {
			productModel: [],
			isPopup: false,
			topRpx:'760rpx',
			dataArr:[],
     dataList: [
				// {
				// 	"ftime": "2024-05-30 19:01:02",
				// 	"areaCode": "CN440306000000",
				// 	"areaName": "广东,深圳市,宝安区",
				// 	"context": "已签收，签收人凭取货码签收。如有疑问请联系业务员: 15738613673，网点电话：0755-89489167,18521873027，投诉电话: 18521873027。感谢使用圆通速递，期待再次为您服务！",
				// 	"time": "2024-05-30 19:01:02",
				// 	"status": "签收"
				// },
				// {
				// 	"ftime": "2024-05-30 11:36:41",
				// 	"areaCode": "CN440306000000",
				// 	"areaName": "广东,深圳市,宝安区",
				// 	"context": "您好，快件已暂存至深圳龙华谭罗华侨三区68店菜鸟驿站，如有疑问请联系13570820549，投诉电话：18521873027。感谢使用圆通速递，期待再次为您服务！",
				// 	"time": "2024-05-30 11:36:41",
				// 	"status": "派件"
				// },
				
			],
			orderId:null,
			obj:{
				expressName:'',
				expressNo:'',
				orderNo:'',
				deliveryTime:'',
				receiptStatus:'',
                takeAddress:'',
			},
            webviewStyles: {
				position: 'relative !important',
				top: 0,
				left: 0,
				width:'100%',
				height:'520px !important',
				// border:'1px solid blue !important'
			},
			url: '', //客服联系地址
            showMore:true,
            showExpandBool:true,
		};
	},
	computed: {
		
	},
	onLoad(e) {
		console.log(e,e.orderId)
		this.orderId = e.orderId;
		this.deliveryType = e.deliveryType;
		if(e.deliveryType==40){
			this.topRpx = '20rpx'
		}else{
			this.topRpx = '760rpx'
		}
	},
	mounted() {
		this.init();
		this.getData();
        this.getMapNews();
	},
	onShow() {
		
	},

onReady() {
    // #ifdef APP-PLUS
    var currentWebview = this.$scope.$getAppWebview() //获取当前页面的webview对象
        setTimeout(function() {
        let wv = currentWebview.children()[0]
            wv.setStyle({
            // top: 0,
            // height:190,
			// border: '1px solid red',
			// position:'relative',
            // scalable: true 是否可以双指缩放
			    position: 'relative !important',
				top: 75,
				left: 0,
				height:'290',
				width:'100%',
				borderRadius:'20',
				zIndex:0,
				//border:'1px solid blue !important'
            })
        }, 500); //如果是页面初始化调用时，需要延时一下
        // #endif
 
    },
	methods: {
		closeD(){
			this.isPopup = false
		},
		watchMore(item){
			this.productModel = item.productList
			this.isPopup = true;
			console.log('798698')
		},
		/*关闭弹窗*/
		closePopup() {
			this.isPopup = false

      //  
    },
		showExpand2(){
			console.log('展开')
			this.showMore = true;
		},
    init(){


    },
    paste(value) {
        uni.setClipboardData({
        data: value
        });
        // uni.showToast({
		// 				title: '复制到粘贴板成功',
		// 				icon: 'success',
		// 				duration: 1000
		// 			});
    },
    showExpand(){
        this.showExpandBool = !this.showExpandBool;
    },
	showExpand3(item){
		console.log('展开')
        item.showExpandBool = !item.showExpandBool;
    },
	/*获取数据*/
	getData() {
			let self = this;
			uni.showLoading({
				title: '网络正在加载中，请稍后，30秒后页面无反应，请您退出页面重新进入'
			});
			// self.loadding = true;
			let url = ''
			if(self.deliveryType==40){
				url = 'user/order/multiExpress'
			}else{
				url = 'user/order/express'
			}
			self._get(
				url,
				{
					orderId: self.orderId
				},
				function(res) {
					if(self.deliveryType==40){
						self.dataArr = res.data;
						for(let i=0;i<self.dataArr.length;i++){
							self.dataArr[i].showBool = false;
							self.dataArr[i].showExpandBool = true;
						}

					}else{
					self.dataList = res.data.express.data||[];
					self.obj.expressName = res.data.expressName;
					self.obj.expressNo = res.data.expressNo;
					self.obj.orderNo = res.data.orderNo;
					self.obj.deliveryTime = res.data.deliveryTime;
					self.obj.receiptStatus = res.data.receiptStatus;
                    self.obj.takeAddress = res.data.takeAddress;
					self.url = res.data.express.routeMapUrl;
				    }
					// self.loadding = false;
					uni.hideLoading();
				}
			);

		},
        getMapNews(){
      /* let self = this
      self._get(
				'user/order/getTrailUrl',
				{
					orderId: self.orderId
				},
				(res)=>{
          if(res.code==1){
            self.url = res.data;
            // for(let i=0;i<self.tradeNewsList.length;i++){
			// 				self.messageIdList.push(self.tradeNewsList[i].id)
			// 			}
            // self.setNewsRead()
            // if(self.tradeNewsList.length!=0){
            //   self.setNewsRead();
            // }
          }    
        }
      ) */

   },
    
    

	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.bguo{
	font-family: Hiragino Sans GB, Hiragino Sans GB;
font-weight: bold;
font-size: 28rpx;
color: #000000;
line-height: 28rpx;
text-align: left;
font-style: normal;
text-transform: none;
}
.logisticsTracking2{
	overflow-y: auto;

	.Package2{
		padding-left: 44rpx;
		padding-top: 36rpx;
		display: flex;
	}
	.content{
		padding-left: 44rpx;
		padding-top: 0rpx;
		display: flex;
		.contentLeft{
			.contentLeftB{
				width:28rpx;
				height:28rpx;
				line-height: 28rpx;
				border: 2rpx solid #000;
				margin-right: 14rpx;
				border-radius: 50%;
				.contentLeftBo{
					border-radius: 50%;
					margin-top: 2rpx;
					margin-left: 2rpx;
					width:24rpx;
					height:24rpx;
					background-color: #D9D9D9;
					text-align: center;
					line-height: 24rpx;
				}
			}
			.contentLeftA{
				width: 0rpx;
				height: 150rpx;
				border-radius: 0rpx 0rpx 0rpx 0rpx;
				border: 1rpx solid #D9D9D9;
				text-align: center;
				margin-left: 13rpx;
			}
		}
	}
}
.webview{
	width: 375rpx;
	height:375rpx;
}
.set {
  background: #F7F8FA;
  min-height: 100vh;
 // position: fixed;
  .pickUp{
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
        text-align: center;
        margin-top: 40rpx;
        margin-bottom: 0rpx;
  }
  .set-detail{
	position: relative;
	width: 100%;
	//height:100vh;
	.detailPackage{
		position: relative;
		margin: 24rpx auto;
		width: 702rpx;
		height: 378rpx;
		//background: #FFFFFF;
		//border-radius: 28rpx 28rpx 28rpx 28rpx;
		font-weight: normal;
		font-size: 28rpx;
		color: #252525;
		line-height: 41rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		.webview{
			position: 'relative !important';
			//top: 0;
			//left: 0;
			width:'100%';
			height:'375rpx !important';
			//border:'1px solid blue !important';
		}
		
	}
	.logisticsTracking{
		text-align: left;
		margin: auto;
		//background: #FFFFFF;
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		width: 100%;
		//padding-bottom: 100rpx;
		//height:auto;
		max-height: 80vh;
		//border:1rpx solid red;
		overflow-y: auto;
		//top: 600rpx;
		//width:100%;
		//height:90vh;
		//overflow-y: auto;
		//border: 1rpx solid red;
		.Package2{
			padding-left: 44rpx;
			padding-top: 36rpx;
			display: flex;
		}
		.content{
			padding-left: 44rpx;
			padding-top: 36rpx;
			display: flex;
			.contentLeft{
				.contentLeftB{
					width:28rpx;
					height:28rpx;
					line-height: 28rpx;
					border: 2rpx solid #000;
					margin-right: 14rpx;
					border-radius: 50%;
					.contentLeftBo{
						border-radius: 50%;
						margin-top: 2rpx;
						margin-left: 2rpx;
						width:24rpx;
						height:24rpx;
						background-color: #D9D9D9;
						text-align: center;
						line-height: 24rpx;
					}
				}
				.contentLeftA{
					width: 0rpx;
					height: 150rpx;
					border-radius: 0rpx 0rpx 0rpx 0rpx;
					border: 1rpx solid #D9D9D9;
					text-align: center;
					margin-left: 13rpx;
				}
			}
		}
    }
	
  }
}

</style>
