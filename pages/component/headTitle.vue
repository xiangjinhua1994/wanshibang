<template>
  <view class="head_uibox" :style="{background:bg}">
    <text
      class="iconfont iconfont-left"
      v-if="classLeftType"
      :class="classLeftType == 1 ? 'icon-right_arrow' : classLeft"
      @click="goback"></text>
    <view >{{ title }}</view>
    <text class="iconfont  iconfont-right" v-if="classRight" :class="classRight" @click="iconfontRight"></text>
    <slot ></slot>
  </view>
</template>

<script>
export default {
  props: {
    classLeftType: {
      type: Number,
      default: 1 // 0：不显示；1：显示返回，默认；2，定制
    },
    classLeft: {
      type: String,
      default: ''
    },
    title: { 
      type: String,
      default: ''
    },
    classRight: { 
      type: String,
      default: ''
    },
    bg:{
      type: String,
      default: ''
    },
    type:{
      type: String,
      default: ''
    }
  },
  components: {
  },
  computed: {

  },
  methods: {
    goback() {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2]; // 上一个页面
      if(this.classLeftType === 2){
        this.$emit('iconfontLeftFn')
      } else {
        if(this.title=='我的订单'){
          this.gotoPage('/pages/user/index/index')
        }else if(this.title=='提示'){
          this.gotoPage('/pages/index/index');
        }else if(this.title=='收银台'){
          console.log('收银台')
          this.$emit('back')
          // this.gotoPage('/pages/order/myorder?dataType=payment&appId=10001');
        }else if(this.title=='退款/售后'){
          this.gotoPage('/pages/user/index/index');
        }else if(this.title=='订单详情'&&this.type=='h5'){
          uni.setStorageSync('type', '');
          // ifdef APP-PLUS
          // plus.runtime.arguments = null;
          // endif
          this.gotoPage('/pages/user/index/index');
        }else if(this.title=='交易通知'||this.title=='活动通知'||this.title=='物流通知'){   
          uni.navigateBack({
            delta: 1,
            success: () => {
              prevPage.$vm.getNews(); // 直接调用上个页面的刷新方法
            }
          });
        }else{
          uni.navigateBack()
        }
      }
    },
    iconfontRight(){
      this.$emit('iconfontRightFn')
    }
  },
  onShow() {
    console.log('onShow')
  },
  onLoad(e) {
    console.log('onLoad',e,this.title)
  },
  mounted() {
    //this.timeRanges();
    console.log('onLoad',this.title)

  },
}
</script>

<style lang="scss" scoped>
.head_uibox {
  position: relative;
  width: 750rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  font-family: Hiragino Sans GB, Hiragino Sans GB;
  font-weight: normal;
  font-size: 32rpx;
  color: #040404;
  .iconfont {
    position: absolute;
    font-size: 36rpx;
    color: #040404;
    &.iconfont-left {
      top: 0;
      left: 20rpx;
      line-height: 88rpx;
    }
    &.iconfont-right {
      top: 0;
      right: 20rpx;
      line-height: 88rpx;
    } 
  }
}
</style>