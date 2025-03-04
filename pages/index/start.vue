<template>
	<view class="set">
    
    <view class="about-detail">
      <image src="/static/ditu.png" mode="" class="logo"/>
    </view>
    <view class="about-detail2">
      <view class="content">跨境购让世界触手可及</view>
    </view>
    <view class="about-detail3">
      <image src="/static/qidong.png" mode="" class="logo2"/>
    </view>
    <view class="about-detail4">
      南合国际商城
    </view>
    <!-- <view class="about-detail">
      <image src="/static/start.png" mode="" class="logo"/>
    </view>
    <view class="about-detail">
      <image src="/static/start.png" mode="" class="logo"/>
    </view> -->
	</view>
</template>

<script>
export default {
	components: {
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
		setTimeout(() => {
      this.gotoPage('/pages/index/index')
    }, 2000);
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
.set {
  //background: #F7F8FA;
  height: 100vh;
  background: linear-gradient( 359deg, #FFFFFF 0%, #EEF1FF 100%);

}
.about-head{
  position: fixed;
  top:0;
  width: 100vw;;
}
.about-detail {
  width: 100%;
  height: 340rpx;
 
  .logo{
    width: 100%;
  height: 340rpx;
  }
}
.about-detail2{
  
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 76rpx;
  .content{
    width: 40rpx;
    height: 514rpx;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 32rpx;
    color: #000000;
    line-height: 46rpx;
    text-align: center;
    font-style: normal;
    text-transform: none;

  }
}
.about-detail3{
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 34rpx;
  width: 100%;
  .logo2{
    width: 164rpx;
    height: 164rpx;
   
  }
}
.about-detail4{
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 34rpx;
  width: 100%;
  font-family: Hiragino Sans GB, Hiragino Sans GB;
  font-weight: normal;
  font-size: 24rpx;
  color: #000000;
  line-height: 46rpx;
  text-align: center;
  font-style: normal;
  text-transform: none;
}
</style>
