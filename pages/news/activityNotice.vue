<template>
	<view class="activityNotice">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle title="活动通知"></headTitle>
	<view v-if="activityNewsList.length>0">
    <view class="activity-box" v-for="(item,index) in activityNewsList">
      <view class="time-box">
        <view class="time">{{item.createTime}}</view>
      </view>
      <view class="activity-item">
        <view class="activity-title">{{item.title}}</view>
        <view class="activity-text">{{item.content}}</view>

      </view>

    </view>
</view>
	<view v-else>
        <newsNull></newsNull>
    </view>
	<!-- <view class="activity-box">
		<view class="time-box">
		  <view class="time">前天 12:00</view>
		</view>
		<view class="activity-item">
		  <view class="activity-title">会员通知</view>
		  <view class="activity-text">恭喜您达到VIP会员，复购将获得9.5折优惠</view>
		</view>
	  </view> -->
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
			activityNewsList:[],
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
		// uni.hideTabBar();

		this.init();
		this.getActivityNews();
	},
	onShow() {
		
	},
	onReachBottom () {
      // this.requestNextPageData()
      console.log('onReachBottom')
      this.pageIndex++;
      this.getActivityNews();
  },
	methods: {
    init(){
    },
	getActivityNews(){
    let self = this
      self._get(
				'user/message/lists',
				{
					pageIndex:self.pageIndex,
					pageSize:self.pageSize,
					type:1
				},
				(res)=>{
          console.log(res);
          if(res.code==1){
            self.activityNewsList = self.activityNewsList.concat(res.data.records);
			for(let i=0;i<self.activityNewsList.length;i++){
				self.messageIdList.push(self.activityNewsList[i].id)
			}
			// self.setNewsRead();
			if(self.activityNewsList.length!=0){
				self.setNewsRead();
			}

          }
        }
      )

   },
   setNewsRead(){
	let self = this
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
.activityNotice {
  background: #F7F8FA;
  min-height: 100vh;
  .activity-box{
	margin-top: 34rpx;
	margin-left: 24rpx;
	margin-right: 24rpx;
  .time-box{
	width: 100vw;
	display: flex;
    justify-content: center;

	.time{
		width: 166rpx;
		height: 50rpx;
		line-height: 50rpx;
		background-color: #DEDEDE;
		text-align: center;
		border-radius: 110rpx;
		color: #fff;
		font-size: 20rpx;
	}
  }
  .activity-item{
	margin-top: 22rpx;
	background-color: #fff;
	border-radius: 28rpx;
	height: 176rpx;
	padding-left:48rpx;
	.activity-title{
		padding-top: 40rpx;
		color: #000;
		font-size: 28rpx;
		font-weight: bold;
		font-style: normal;
		line-height: 28rpx;
		text-transform: none;
	}
	.activity-text{
		padding-top: 28rpx;
		font-weight: normal;
		font-size: 28rpx;
		color: #040404;
		text-align: left;
		font-style: normal;
		text-transform: none;
	}
  }
}

}

</style>
