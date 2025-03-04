
<template>
  <view>
    <!-- 自定义导航栏 -->
    <view class="navBarBox">
      <!-- 上方背景色 -->
      <view class="navBarBackground"
            :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- 状态栏占位 -->
      <view class="statusBar"
            :style="{ paddingTop: statusBarHeight + 'px'}"></view>
      <!-- 真正的导航栏内容 -->
      <view class="navBar"
            :style="{ height: capsuleHeight + 'px',paddingRight:(hasSlotRight?capsuleWidth+ 'px':'32rpx')  }">
        <view class="left">
          <image src="/static/icon/back.png"
                 mode=""
                 class="left_icon"
                 v-if="platform=='MP-WEIXIN'"
                 @click="goback"></image>
          <image src="/static/icon/back.png"
                 mode=""
                 class="close"
                 v-if="platform=='H5'"
                 @click="goback"></image>
        </view>
        <view class="title Pnowrap">{{title||''}}
        </view>
        <view class="right">
          <slot name="right" />
        </view>
      </view>
    </view>
  </view>
</template>
  <script>
export default {
  props: {
    title: {
      type: String,
    },
    //返回按钮形式
    backType: {
      type: String,
      default: 'normal',
    },
  },
  data() {
    return {
      // 状态栏高度
      statusBarHeight: getApp().globalData.statusBarHeight,
      // 胶囊高度
      capsuleHeight: getApp().globalData.capsuleHeight,
      // 胶囊宽度
      capsuleWidth: getApp().globalData.capsuleWidth,
      // 平台
      platform: getApp().globalData.platform,
    }
  },

  created() {
    console.log(this, 1244)
  },
  computed: {
    hasSlotRight() {
      //ifdef MP-WEIXIN
      return this.$slots.right
      //endif
      //ifdef H5
      return false
      //endif
    },
  },
  methods: {
    // H5() {
    //   /*  // 获取手机状态栏高度
    //   this.statusBarHeight = window.screen.availHeight - window.innerHeight
    //   // 获取胶囊信息
    //   const menuButton = document.querySelector('.uni-page-head__right')
    //   if (menuButton) {
    //     const rect = menuButton.getBoundingClientRect()
    //     // 计算胶囊高度
    //     this.capsuleHeight = rect.height + 2 * (rect.top - this.statusBarHeight)
    //   } else {
    //     this.capsuleHeight = 44 // 默认值
    //   } */
    //   this.capsuleHeight = 44
    // },
    // unaipp() {
    //   // 获取手机状态栏高度
    //   this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight']
    //   console.log(this.statusBarHeight, 'this.statusBarHeight....')
    //   // 获取胶囊信息
    //   const res = wx.getMenuButtonBoundingClientRect()
    //   //获取屏幕宽度
    //   const screenWidth = uni.getSystemInfoSync().screenWidth
    //   // 计算胶囊高度
    //   this.capsuleHeight = res.height + 2 * (res.top - this.statusBarHeight)
    //   this.capsuleWidth = screenWidth - res.left
    //   console.log(this.capsuleWidth, 'this.capsuleWidth....')
    // },
    goback(e) {
      if (this.backType == 'normal') {
        uni.navigateBack()
      } else {
        this.$emit('backOperation')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.navBarBox {
  position: relative;
  @include background_color('background_color');
}

.navBarBox .statusBar {
}

.navBarBox .navBar {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 32rpx;
  @include background_color('background_color');
  .left {
    font-size: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 30rpx;
  }
  .right {
    min-width: 40rpx;
  }
}

.navBarBox .navBarBackground {
  position: absolute;
  width: 100%;
  top: 0;
  @include background_color('background_color');
}

.left_icon {
  width: 30rpx;
  height: 30rpx;
  //   position: absolute;
  //   left: 32rpx;
}

.close {
  width: 28rpx;
  height: 28rpx;
  position: absolute;
  left: 32rpx;
}

.title {
  font-size: 34rpx;
  font-family: PingFang SC-Medium, PingFang SC;
  color: #1d2129;
  font-weight: 700;
  //#ifdef H5
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  max-width: 220rpx;
  //#endif
  @include font_color('text_color1');
}
</style>