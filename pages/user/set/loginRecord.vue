<template>
	<view class="loginRecord">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle title="登录记录"></headTitle>
    <view class="record-tip">
      查看最近登录过的手机或浏览器，如果发现可以登录，请立即修改/设置登录密码。
    </view>
    <view class="record-detail">
      <view class="record-item">
        <view class="record-name">
          <text>OnePlus IN2020</text>
          <text class="record-label">当前设备</text>
        </view>
        <view class="record-time">
          2024-06-05 08:15:14
        </view>
      </view>
      <view class="record-item">
        <view class="record-name">
          <text>OnePlus IN2020</text>
          <text class="record-label">当前设备</text>
        </view>
        <view class="record-time">
          2024-06-05 08:15:14
        </view>
      </view>
      <view class="record-item">
        <view class="record-name">
          <text>OnePlus IN2020</text>
          <text class="record-label">当前设备</text>
        </view>
        <view class="record-time">
          2024-06-05 08:15:14
        </view>
      </view>
    </view>
    

	</view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue'
export default {
	components: {
		headTitle
	},
	data() {
		return {

		};
	},
	computed: {
		
	},
	onLoad(e) {
	},
	mounted() {
		this.init();
	},
	onShow() {
		
	},
	methods: {
    init(){
    },
    
    jumpPage(path) { /*跳转页面*/
			this.gotoPage(path);
		},

    

	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.loginRecord {
  background: #F7F8FA;
  min-height: 100vh;
  .icon-you {
    color:#252525;
  }
  .record-tip{
    padding: 24rpx 30rpx;

    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #8C8C8C;
    line-height: 40rpx;
    font-style: normal;
    text-transform: none;
  }
}
.record-detail {
  margin: 24rpx;
  background: #fff;
  padding: 0 ;
  border-radius: 28rpx;
  font-family: Hiragino Sans GB, Hiragino Sans GB;
  font-weight: normal;
  font-size: 28rpx;
  color: #000000;
  text-align: left;
  font-style: normal;
  text-transform: none;
  .record-item{
    padding: 24rpx 40rpx;
    .record-name {
      display: flex;
      align-items:center;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 28rpx;
      color: #000000;
      text-align: left;
      font-style: normal;
      text-transform: none;
      padding-bottom: 16rpx;
    }
    .record-label{
      padding: 4rpx 8rpx;
      margin-left: 16rpx;
      background: #000000;
      border-radius: 1rpx;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 16rpx;
      color: #FFFFFF;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
    .record-time{
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 20rpx;
      color: #8C8C8C;
      font-style: normal;
      text-transform: none;
    }
  }
}

</style>
