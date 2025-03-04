<template>
	<view class="set">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle title="物流详情"></headTitle>
    <view class="set-detail">
		<view class="detailPackage">
			<view class="Package2">
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
			</view>

		</view>
		<view class="logisticsTracking">
			<view class="Package2">
				<view>物流跟踪</view> 
		    </view>
			<view class="content" style="display: flex;">
				<view class="contentLeft">
					<view style="position: relative;" v-for="(item,index) in dataList">
						<view class="contentLeftB" :style="index==0?'border-color:#000':'border-color:#D9D9D9'"><view class="contentLeftBo" :style="index==0?'background-color:#000':'background-color:#D9D9D9'"></view></view>
						<view class="contentLeftA" v-if="index!=dataList.length-1"></view>
						<view style="position: absolute; width:610rpx;top:-2rpx;left:50rpx">
							<view :title="item.context" style="padding-right: 5rpx;">{{item.context}} </view>
					        <view>{{item.time}} </view>
						</view>
					</view>
					<!-- <view style="position: relative;">
						<view class="contentLeftB" style=""><view class="contentLeftBo"></view></view>
						<view style="position: absolute; width:610rpx;top:-2rpx;left:50rpx">
							<view>您的订单已经准备出库 </view>
					        <view>2023-10-24 16:22:24 </view>
						</view>
					</view> -->
					
				</view>
			</view>

		</view>

    </view>

	</view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue'
export default {
	components: {
		headTitle,
	},
	data() {
		return {
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
			}
		};
	},
	computed: {
		
	},
	onLoad(e) {
		console.log(e,e.orderId)
		this.orderId = e.orderId
	},
	mounted() {
		this.init();
		this.getData();
	},
	onShow() {
		
	},
	methods: {
    init(){


    },
	/*获取数据*/
	getData() {
			let self = this;
			uni.showLoading({
				title: '加载中'
			});
			self.loadding = true;
			self._get(
				'user/order/express',
				{
					orderId: self.orderId
				},
				function(res) {
					self.dataList = res.data.express.data||[];
					self.obj.expressName = res.data.expressName;
					self.obj.expressNo = res.data.expressNo;
					self.obj.orderNo = res.data.orderNo;
					self.obj.deliveryTime = res.data.deliveryTime;
					self.obj.receiptStatus = res.data.receiptStatus;
					self.loadding = false;
					uni.hideLoading();
				}
			);
		},
    
    

	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.set {
  background: #F7F8FA;
  min-height: 100vh;
  .set-detail{
	position: relative;
	width: 100%;
	.detailPackage{
		margin: 24rpx auto;
		width: 702rpx;
		height: 378rpx;
		background: #FFFFFF;
		border-radius: 28rpx 28rpx 28rpx 28rpx;
		font-weight: normal;
		font-size: 28rpx;
		color: #252525;
		line-height: 41rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
		.Package2{
			padding-left: 44rpx;
			padding-top: 36rpx;
			display: flex;
			.btn-div {
				width: 107rpx;
				height: 34rpx;
				background: #000000;
				border-radius: 64rpx 64rpx 64rpx 64rpx;
				border: 1rpx solid #000000;
				line-height: 34rpx;
				text-align: center;
				margin-left: 14rpx;
			}
	    }
		.Package1{
			padding-left: 44rpx;
			padding-top: 26rpx;
			display: flex;
		}
	}
	.logisticsTracking{
		text-align: left;
		margin: 24rpx auto;
		background: #FFFFFF;
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		width: 702rpx;
		padding-bottom: 130rpx;
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
