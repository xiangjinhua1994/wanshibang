<template>
	<view class="set">
    <view class="about-head">
      <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
      <headTitle title="关于我们"></headTitle>
    </view>
    <view class="about-detail">
      <image src="/static/home/logo2.png" mode="" class="logo"/>
      <view class="about-title">当前版本:{{version_number}}</view>
      <view class="about-btm">
        <view class="about-content">ICP备案:粤ICP备2023116174号</view>
        <view class="about-version">深圳市南合电子商务有限公司</view>
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
      version_number:'1.1.0',
		};
	},
	computed: {
		
	},
	onLoad(e) {
	},
	mounted() {
		this.init();
    // 获取版本信息
    const systemInfo = uni.getSystemInfoSync();
    // this.version_number = systemInfo.appVersion;
    // console.log(this.version_number);
    // #ifdef H5
    this.version_number = systemInfo.appVersion;
    console.log(systemInfo.appVersion,'版本号');
    // #endif
    // #ifdef APP-PLUS
    this.version_number = systemInfo.appWgtVersion;
    console.log(systemInfo.appWgtVersion,'版本号');
    plus.runtime.getProperty(plus.runtime.appid, (info) => {
      console.log(info.version,'info.version')
            // this.currentVersion = info.version; // 将当下版本存到currentVersion字段中去
    })
    // #endif
	},
	onShow() {
		
	},
	methods: {
    init(){
    },
    
    openOrder() {
      this.confirmBoxOrder = true
    },
    closeOrder() {
      this.confirmBoxOrder = false
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

}
.about-head{
  position: fixed;
  top:0;
  width: 100vw;;
}
.about-detail {
  padding: 24rpx;
  padding-top: 300rpx;
  box-sizing: border-box;
  min-height: 100vh;
  border-radius: 28rpx;
  font-family: Hiragino Sans GB, Hiragino Sans GB;
  font-weight: normal;
  font-size: 28rpx;
  color: #000000;
  text-align: left;
  font-style: normal;
  text-transform: none;
  .logo {
    @include area(166rpx,166rpx);
    display: block;
    margin: 0 auto;
  }
  .about-title {
    text-align: center;
    padding-top: 20rpx;
    font-size: 28rpx;
  }
  .about-btm {
    position: fixed;
    bottom: 20rpx;
    width: 100vw;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 24rpx;
    color: #8C8C8C;
    line-height: 36rpx;
    text-align: center;
  }
}
</style>
