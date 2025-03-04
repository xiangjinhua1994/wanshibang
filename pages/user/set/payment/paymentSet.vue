<template>
	<view class="set">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle title="支付设置"></headTitle>
    <view class="set-detail">
      <view class="set-item" txt="属性">
        <view class="set-attr" @click="jumpPage('/pages/user/set/payment/paymentPasw')">
          <text class="set-attr-key">设置支付密码</text>
          <view class="set-attr-val" >
            <text class="iconfont icon-you"></text>
          </view>
        </view>
        <view class="set-attr" @click="jumpPage('/pages/user/set/payment/modifyPas')">
          <text class="set-attr-key">修改支付密码</text>
          <view class="set-attr-val" >
            <text class="iconfont icon-you"></text>
          </view>
        </view>
        <!-- <view class="set-attr" @click="jumpPage('/pages/user/set/payment/retrievePas')">
          <text class="set-attr-key">找回支付密码</text>
          <view class="set-attr-val" >
            <text class="iconfont icon-you"></text>
          </view>
        </view> -->
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
.set {
  background: #F7F8FA;
  min-height: 100vh;
  .icon-you {
    color:#252525;
  }
}
.set-item {
  background: #FFFFFF;
  border-radius: 28rpx;
  margin: 16rpx 28rpx 40rpx 28rpx;
  padding: 20rpx 32rpx ;


  .set-attr {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    line-height: 60rpx;
    padding-bottom: 20rpx;

    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #252525;
    text-align: left;
    font-style: normal;
    text-transform: none;
    &.set-attr-singe{
      padding-bottom: 0rpx;
    }
    .set-attr-key {
      width: 200rpx;
    }
    .set-attr-val {
      flex: 1;
      text-align: right;

      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: 400;
      font-size: 28rpx;
      color: #000000;
      font-style: normal;
      text-transform: none;
      &.set-attr-val-liuyan {
        text-align: left;

        font-family: Source Han Sans CN, Source Han Sans CN;
        font-weight: 400;
        font-size: 28rpx;
        color: #252525;
        text-align: left;
        font-style: normal;
        text-transform: none;

      }
      &.attr-bold {
        font-weight: bold;
        font-family: Roboto, Roboto;
        font-size: 36rpx;
        color: #000000;
        font-style: normal;
        text-transform: none;
      }
    }
  }
}
</style>
