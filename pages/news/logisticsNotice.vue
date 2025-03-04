<template>
	<view class="set">
		<view style="position: fixed;background:#fff;z-index:999;top:0;left:0">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'" style="background-color: #fff;"></view>
    <headTitle class="headColor" title="物流通知" bg="#fff"></headTitle>
</view>
	<view class="trade" v-if="logisticsNewsList.length>0" style="margin-top: 160rpx;">
    <!-- <view class="trade-item">
        <view class="trade-title-line">
          <view class="trade-title">订单发货通知</view>
          <view class="trade-time">05.02 10:21</view>
        </view>
        <view class="trade-data">
          <image class="trade-img" src="/static/card.png" mode="" />
          <view class="trade-text-box">
            <view class="trade-text">您购买的商品已通过中通快递发货,请注意查收。</view>
            <view class="trade-btn">
			  <view class="ui-btn btn-more">查看物流</view>
              <view class="ui-btn btn-more">查看订单</view>
            </view>
          </view>
        </view>
		<view class="border">
		</view>
		<view class="moreInfo">
			<view class="watchMore">查看更多物流消息<uni-icons type="right" size="18"></uni-icons>
			</view>
		</view>
      </view> -->
	  <view class="trade-item" v-for="(item,index) in logisticsNewsList" :key="index">
        <view class="trade-title-line">
          <view class="trade-title">{{item.title}}</view>
          <view class="trade-time">{{item.createTime}}</view>
        </view>
        <view class="trade-data">
          <image class="trade-img" :src="JSON.parse(item.parameter).productImage" mode="" />
          <view class="trade-text-box">
            <view class="trade-text">{{item.content}}</view>
            <view class="trade-btn">
			  <view class="ui-btn btn-more" @click="jumpPage(JSON.parse(item.parameter).orderId,JSON.parse(item.parameter).deliveryType)">查看物流</view> 
			  <!-- <view class="ui-btn btn-more btn-gray" v-show="showBtn">查看物流</view> -->
              <view class="ui-btn btn-more" @click="gotoOrder(JSON.parse(item.parameter).orderId)">查看订单</view>
            </view>
          </view>
        </view>
		<view class="border">
		</view>
		<view class="moreInfo" v-show="!item.showMore">
			<view class="watchMore" @click="clickWatchMore(item,index,JSON.parse(item.parameter).orderId,JSON.parse(item.parameter).deliveryType)">查看更多物流消息<uni-icons type="right" size="18"></uni-icons>
			</view>
		</view>
		<view class="moreInfoDetail" v-show="item.showMore">
			<!-- <view class="notice">
				<view class="title"> 
					<view>订单签收</view>
					<view class="time">05.02 10:21</view>
				</view>
				<view class="titleDetail">邮政快递包裹显示您的商品已签收。</view>
			</view>
			<view class="notice">
				<view class="title"> 
					<view>商品派送通知</view>
					<view class="time">05.02 10:21</view>
				</view>
				<view class="titleDetail">您的商品正由邮政快递包裹派送中。 请注意查收。
					服饰洗涤后不支持无理由退货。 <text>去查看>></text> </view>
			</view> -->
			<view class="notice" v-for="(item,index) in dataList" >
				<view class="title"> 
					<view>{{item.status}}</view>
					<view class="time">{{item.time}}</view>
				</view>
				<view class="titleDetail">{{item.context}} </view>
			</view>
			<!-- <view class="notice">
				<view class="title"> 
					<view>物流中转通知</view>
					<view class="time">05.02 10:21</view>
				</view>
				<view class="titleDetail">物流显示您的订单已中转至安庆市，点击查看预计
					送达时间。<text>去查看>></text> </view>
			</view>
			<view class="notice">
				<view class="title"> 
					<view>订单发货通知</view>
					<view class="time">05.02 10:21</view>
				</view>
				<view class="titleDetail">您购买的商品已通过邮政快递包裹发货。<text>去查看>></text> </view>
			</view> -->
			<!-- <view class="border">
			</view> -->
			<view class="pickUp" @click="clickWatchMore2(item,index)">收起 <uni-icons type="right" size="18"></uni-icons></view>
		</view>
      </view>
	</view>
	<view v-else>
        <newsNull></newsNull>
    </view>

	</view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue';
import newsNull from '@/pages/component/newsNull.vue';
export default {
	components: {
		headTitle,
		newsNull,
	},
	data() {
		return {
			showMore:true,
			logisticsNewsList:[],
			pageIndex:1,
			pageSize:10,
			orderId:null,
			showBtn:false,
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
			obj:{
				expressName:'',
				expressNo:'',
				orderNo:'',
				deliveryTime:'',
				receiptStatus:'',
			},
			messageIdList:[],
			
		};
	},
	computed: {
		
	},
	onLoad(e) {
		
	},
	mounted() {
		this.init();
		this.getLogisticsNews();
	},
	onShow() {
		
	},
	onReachBottom () {
      // this.requestNextPageData()
      console.log('onReachBottom')
      this.pageIndex++;
      this.getLogisticsNews();
  },
	methods: {
		clickWatchMore(item,index,orderId,deliveryType){
			console.log('89898',item,index,orderId)
			this.orderId = orderId;
			if(deliveryType==40){
				// this.logisticsNewsList[index].showMore = false;
				this.jumpPage(orderId,deliveryType);

			}else{
				this.logisticsNewsList[index].showMore = true;
				this.getLogisticsData(item,index,orderId,deliveryType)
			}
		},
		clickWatchMore2(item,index,orderId){
			this.logisticsNewsList[index].showMore = false;
			
		},
    init(){
    },
	getLogisticsNews(){
    let self = this
      self._get(
				'user/message/lists',
				{
					pageIndex:self.pageIndex,
					pageSize:self.pageSize,
					type:3
				},
				(res)=>{
          console.log(res);
          if(res.code==1){
            self.logisticsNewsList = self.logisticsNewsList.concat(res.data.records);
			for(let i=0;i<res.data.records.length;i++){
				           res.data.records[i].showMore = false;
							self.messageIdList.push(self.logisticsNewsList[i].id)
						}
			console.log(self.logisticsNewsList,'self.logisticsNewsList88')
			if(self.logisticsNewsList.length!=0){
				self.setNewsRead();
			}
          }
     
                 
        }
      )

   },
   gotoOrder(e){
 
    // this.gotoPage('/pages/order/myorder?appId=10001');
	this.gotoPage('/pages/order/order-detail?orderId=' + e);
   },
   /*获取物流数据*/
	getLogisticsData(item,index,orderId) {
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
					console.log(self.dataList,'self.dataList')
					if(res.code==1){
						self.showMore = !self.showMore;
						self.showBtn = true;
					}
				}
			);
		},

		setNewsRead(){
		let self = this;
		self._get(
					'user/message/read',
					{
						messageIdStr:self.messageIdList.join(','),
					},
					(res)=>{
			console.log(res);
			if(res.code==1){
			}
			}
		)
       },
	   jumpPage(orderId,deliveryType){
		// console.log(item,'item')
		// this.gotoPage('pages/news/logisticsDetail?orderId=cart&cartIds=' + arrIds);
		let url = `/pages/news/logisticsNoticeMap?orderId=${orderId}&deliveryType=${deliveryType}`
        this.gotoPage(url);
	   }
		
    
    

	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.btn-gray{
	background-color: #F0F0F0;
}
.set {
  background: #F7F8FA;
  min-height: 100vh;
  .headColor{
	background-color: #fff;
  }
  .trade{
	background-color: #F7F8FA;
	padding: 24rpx;
	margin-top: 10rpx;
  .trade-item {
	padding: 40rpx;
	background-color: #fff;
	border-radius: 28rpx;
	margin-bottom: 32rpx;
	.trade-title-line{
	  @include fl-between;
	  padding-bottom: 40rpx;
	  .trade-title {
		font-family: Hiragino Sans GB, Hiragino Sans GB;
		font-weight: bold;
		font-size: 28rpx;
		color: #000000;
		font-style: normal;
		text-transform: none;
	  }
	  .trade-time {
		font-family: Hiragino Sans GB, Hiragino Sans GB;
		font-weight: normal;
		font-size: 24rpx;
		color: #999999;
		font-style: normal;
		text-transform: none;
	  }
	}
	.border{
		border-top: 1rpx solid #F0F0F0;
		margin-top: 26rpx;
		opacity: 0.3;
	}
	.moreInfo{
		margin-top: 28rpx;
		padding-right: 24rpx;
		display: flex;
		box-sizing :content-box;
		justify-content: center;
		.watchMore{
			display: flex;
			line-height: 28rpx;
		}
	}
	.moreInfoDetail{
		margin-top: 38rpx;
		.notice{
			margin-bottom: 58rpx;
		.title{
			@include fl-between;
			font-weight: normal;
			font-size: 32rpx;
			color: #000000;
			line-height: 41rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
			.time{
				font-weight: normal;
				font-size: 24rpx;
				color: #999999;
				font-style: normal;
				text-transform: none;
			}
		}
		.titleDetail{
			margin-top: 14rpx;
			font-weight: normal;
			font-size: 28rpx;
			color: #535353;
			line-height: 41rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
		}
	}
		.pickUp{
			display: flex;
			justify-content: center;
			margin-top: 28rpx;
		}
	}
	
	.trade-data {
	  @include fl-between;
	  .trade-text-box {
		flex: 1;
		padding-left: 20rpx;
	  }
	  .trade-text {
		font-family: Hiragino Sans GB, Hiragino Sans GB;
		font-weight: normal;
		font-size: 28rpx;
		color: #040404;
		font-style: normal;
		text-transform: none;
		padding-bottom: 20rpx;
	  }
	  
	}
	.trade-img{
	  @include area(160rpx, 160rpx);
	}
	.trade-btn {
		position: relative;
		display: flex;
		justify-content: flex-end;
	  .trade-num {
		font-family: Hiragino Sans GB, Hiragino Sans GB;
		font-weight: normal;
		font-size: 24rpx;
		color: #8C8C8C;
		font-style: normal;
		text-transform: none;
	  }
	}
  }
}

}

</style>
