<template>
  <view>
    <!-- 预留右上角胶囊高度 -->
    <view v-if="isCapsule">
      <view class="dynamic"
            :style="{'padding-top':statusBarHeight+'px','height': 'calc(94rpx + '+statusBarHeight+'px + '+boundingClientRectHeight+'px)','background-color':backgourndColor,'border-bottom':borderBottom}">
        <!-- #ifdef MP-BAIDU || MP-TOUTIAO || MP-WEIXIN || MP-ALIPAY || MP-QQ -->
        <view :style="'height:'+boundingClientRectHeight+'px;width:100%;line-height:'+boundingClientRectHeight+'px;'">
          <text :style="'font-size:30rpx;margin-left:20rpx;color:'+fontColor+';'">{{pgkName}}</text>
        </view>
        <!-- #endif -->
        <view style="height: 24rpx;width: 100%;"></view>
        <view class="dynamicBox">
          <view :style="{'width': bothSidesWidth,'height': '100%','display': 'flex','align-items': 'center'}"
                v-if="pattern!='normal'">
            <image-switch src="/static/images/arrow_left_black.png"
                          @clickImg="goback"
                          cstyle="width: 44rpx;height: 44rpx;"></image-switch>
          </view>
          <image-switch src="/static/images/arrow_left_black.png"
                        v-if="pattern=='normal'"
                        @clickImg="goback"
                        cstyle="width: 44rpx;height: 44rpx;"></image-switch>
          <view class="navtitle"
                v-if="!isNotice || !isGun"
                :style="{'color':fontColor,'font-size':fontSize}">{{title}}</view>
          <u-notice-bar v-if="isNotice&&isGun"
                        :text="title"
                        :step="step"
                        icon=" "
                        color="#333333"
                        bgColor="#ffffff"
                        fontSize="36rpx"
                        speed="40"></u-notice-bar>
          <view :style="{'width': bothSidesWidth,'height':'100%'}"
                v-if="pattern!='normal'">
            <slot></slot>
          </view>
          <view style="width: 44rpx;height:100%;"
                v-if="pattern=='normal'"></view>
        </view>
      </view>
    </view>
    <!-- 不留右上角胶囊高度 -->
    <view v-else>
      <view class="dynamic"
            :style="{'padding-top':statusBarHeight+'px','height': 'calc(94rpx + '+statusBarHeight+'px)','background-color':backgourndColor,'border-bottom':borderBottom}">
        <view class="dynamicBox">
          <view :style="{'width': bothSidesWidth,'height': '100%','display': 'flex','align-items': 'center'}"
                v-if="pattern!='normal'">
            <image-switch src="/static/images/arrow_left_black.png"
                          @clickImg="goback"
                          cstyle="width: 44rpx;height: 44rpx;"></image-switch>
          </view>
          <image-switch src="/static/images/arrow_left_black.png"
                        v-if="pattern=='normal'"
                        @clickImg="goback"
                        cstyle="width: 44rpx;height: 44rpx;"></image-switch>
          <view class="navtitle"
                v-if="!isNotice || !isGun"
                :style="{'color':fontColor,'font-size':fontSize}">{{title}}</view>
          <u-notice-bar v-if="isNotice&&isGun"
                        :text="title"
                        :step="step"
                        icon=" "
                        color="#333333"
                        bgColor="#ffffff"
                        fontSize="36rpx"
                        speed="40"></u-notice-bar>
          <view :style="{'width': bothSidesWidth,'height':'100%'}"
                v-if="pattern!='normal'">
            <slot></slot>
          </view>
          <view style="width: 44rpx;height:100%;"
                v-if="pattern=='normal'"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: getApp().globalData.mySystemInfo.statusBarHeight, //状态栏高度
      pgkName: getApp().globalData.appName, //名称
      boundingClientRectHeight: getApp().globalData.boundingClientRectHeight, //小程序右上角胶囊高度
      isNotice: false, //是否显示滚动组件
    }
  },
  props: {
    //是否滚动
    isGun: {
      type: Boolean,
      default: true,
    },
    //名称
    title: {
      type: String,
      default: '详情',
    },
    //右侧是否显示
    pattern: {
      type: String,
      default: 'normal',
    },
    //背景颜色
    backgourndColor: {
      type: String,
      default: '#ffffff',
    },
    //文字颜色
    fontColor: {
      type: String,
      default: '#333',
    },
    //两侧宽度,不能大于130rpx，否则在不滚动标题的情况下会出现文字隐藏现象
    bothSidesWidth: {
      type: String,
      default: '130rpx',
    },
    //下边框
    borderBottom: {
      type: String,
      default: '2rpx solid #efefef',
    },
    //返回按钮形式
    backType: {
      type: String,
      default: 'normal',
    },
    //文字大小
    fontSize: {
      type: String,
      default: '34rpx',
    },
    //是否要留出胶囊高度
    isCapsule: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    title(e) {
      //标题超出12个字就滚动显示
      if (e.length > 12) {
        this.isNotice = true
      } else {
        this.isNotice = false
      }
    },
  },
  mounted() {
    setTimeout(() => {
      console.log(getApp().globalData)
    }, 2000)
  },
  methods: {
    //返回
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

<style lang="scss">
.dynamic {
  width: 100%;
  padding: 0 20rpx;
  box-sizing: border-box;
  .dynamicBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0;
    .navtitle {
      max-width: 500rpx;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
