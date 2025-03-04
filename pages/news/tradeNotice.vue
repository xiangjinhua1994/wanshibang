<template>
	<view class="tradeNotice">
    <view style="position: fixed;background:#fff;z-index:999;top:0;left:0">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'" style="background-color: #fff;"></view>
    <headTitle title="交易通知" bg="#fff"></headTitle>
    </view>
    <view class="trade-list" v-if="tradeNewsList.length>0" style="margin-top: 160rpx;">
      <view class="trade-item" v-for="(item,index) in tradeNewsList">
        <view class="trade-title-line">
          <view class="trade-title">{{item.title}}</view>
          <view class="trade-time">{{item.createTime}}</view>

        </view>
        <view class="trade-data">
          <!-- <image class="trade-img" src="/static/card.png" mode="" /> -->
          <image class="trade-img" :src="JSON.parse(item.parameter).productImage" mode="" />
          <view class="trade-text-box">
            <view class="trade-text">{{item.content}}</view>
            <view class="trade-btn">
              <view class="trade-num" v-if="item.parameter">共{{JSON.parse(item.parameter).productCount }}件商品</view>
              <view class="ui-btn btn-more" style="border:1.5rpx solid #000" @click="gotoTadeReback(JSON.parse(item.parameter).orderRefundId)" v-if="item.title=='退款成功'">查看订单</view>
              <view class="ui-btn btn-more" style="border:1.5rpx solid #000" @click="gotoTade(JSON.parse(item.parameter).orderId)" v-else>查看订单</view>
            </view>
          </view>

        </view>

      </view>
      <!-- <view class="trade-item">
        <view class="trade-title-line">
          <view class="trade-title">支付成功通知</view>
          <view class="trade-time">2024年5月6号 10:21</view>

        </view>
        <view class="trade-data">
          <image class="trade-img" src="/static/card.png" mode="" />
          <view class="trade-text-box">
            <view class="trade-text">恭喜您本次订单购买成功，收货地址为:广东省深圳市雨花亭小区6单...</view>
            <view class="trade-btn">
              <view class="trade-num">共1件商品</view>
              <view class="ui-btn btn-more">查看订单</view>
            </view>
          </view>

        </view>

      </view> -->
      <!-- <view class="trade-item">
        <view class="trade-title-line">
          <view class="trade-title">支付成功通知</view>
          <view class="trade-time">2024年5月6号 10:21</view>

        </view>
        <view class="trade-data">
          <image class="trade-img" src="/static/card.png" mode="" />
          <view class="trade-text-box">
            <view class="trade-text">恭喜您本次订单购买成功，收货地址为:广东省深圳市雨花亭小区6单...</view>
            <view class="trade-btn">
              <view class="trade-num">共1件商品</view>
              <view class="ui-btn btn-more">查看订单</view>
            </view>
          </view>

        </view>

      </view> -->
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
      tradeNewsList:[],
      pageIndex:1,
      pageSize:10,
      messageIdList:[],
		};
	},
	computed: {
		
	},
	onLoad(e) {
		
	},
	mounted() {
		this.init();
    this.getTradeNews();
	},
	onShow() {
		
	},
  onReachBottom () {
      // this.requestNextPageData()
      console.log('onReachBottom')
      this.pageIndex++;
      this.getTradeNews();
  },
  onBackPress(options) {
		// console.log(options,'options88')
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; // 上一个页面
		// if (options.from === 'navigateBack') {
    //   uni.navigateBack({
    //         delta: 1,
    //         success: () => {
    //           prevPage.$vm.getNews(); // 直接调用上个页面的刷新方法
    //         }
    //       });
		// 	return false;
		// }
    // uni.navigateBack({
    //         delta: 1,
    //         success: () => {
    //           prevPage.$vm.getNews(); // 直接调用上个页面的刷新方法
    //         }
    //       });
		// // this.back();
		// return false;
	},
	methods: {
    init(){
    },
    getTradeNews(){
    let self = this
      self._get(
				'user/message/lists',
				{
					pageIndex:self.pageIndex,
					pageSize:self.pageSize,
					type:2
				},
				(res)=>{
          console.log(res);
          if(res.code==1){
            self.tradeNewsList =self.tradeNewsList.concat(res.data.records);
            for(let i=0;i<self.tradeNewsList.length;i++){
							self.messageIdList.push(self.tradeNewsList[i].id)
						}
            self.setNewsRead()
            if(self.tradeNewsList.length!=0){
              self.setNewsRead();
            }
          }    
        }
      )

   },
   gotoTade(e){
    //  uni.navigateTo({
    //    url:'/pages/order/myorder'
    //  })
    // this.gotoPage('/pages/order/myorder?appId=10001');
     this.gotoPage('/pages/order/order-detail?orderId=' + e);

      // let url = '/pages/product/detail/detail?productId=' + e;
			// this.gotoPage(url);
   },
   gotoTadeReback(e){
    //  uni.navigateTo({
    //    url:'/pages/order/myorder'
    //  })
    // this.gotoPage('/pages/order/myorder?appId=10001');
    //  this.gotoPage('/pages/order/order-detail?orderId=' + e);
     this.gotoPage('/pages/order/refund/detail/detail?orderRefundId=' + e);

      // let url = '/pages/product/detail/detail?productId=' + e;
			// this.gotoPage(url);
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
    
    

	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.tradeNotice {
  background: #F7F8FA;
  min-height: 100vh;

}
.trade-list{
  padding: 50rpx  24rpx;
}
.trade-item {
  background-color: #fff;
  padding: 40rpx;
  border-radius: 28rpx;
  margin-bottom: 30rpx;
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
    @include fl-between;
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
</style>
