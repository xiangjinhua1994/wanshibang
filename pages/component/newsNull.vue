<template>
    <view class="data-null">
      <image class="data-null-img" :src="nullImg" mode="" />
      <view class="data-null-text">{{ nullText }}</view>
      <slot></slot>
    </view>
  </template>
  
  <script>
  export default {
    props: {
      nullImg: { 
        type: String,
        default: '/static/home/null.png'
      },
      nullText: { 
        type: String,
        default: '暂无相关通知哦'
      },
    },
    components: {
    },
    computed: {
  
    },
    methods: {
      
    },
    onShow() {
    },
  }
  </script>
  
  <style lang="scss" scoped>
  @import '@/common/mixin.scss';
  .data-null {
    padding-top: 400rpx;
    .data-null-img {
      @include area(484rpx, 300rpx);
      display: block;
      margin: 0 auto;
    }
    .data-null-text {
      text-align: center;
    }
  }
  </style>