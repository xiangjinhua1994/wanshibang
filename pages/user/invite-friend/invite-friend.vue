<template>
	<view class="invite"  id="stickerList" :style="'background-image:url('+personinfo.imageUrl+')'">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle ></headTitle>
    <view class="invite-friend">
      <view class="invite-qr-bg">
        <!-- //<image class="invite-qr" :src="personinfo.imageUrl" mode="" /> -->
        <!-- <view class="invite-qr-1">我的邀请码</view>
        <view class="invite-qr-2">{{personinfo.userNo}}</view> -->
        <!-- <view class="invite-qr-3"  @click="copyInvitationCode(personinfo.userNo)">复制邀请码</view> -->
      </view>
      <view class="invite-btn-box">
        <view class="ui-btn btn-more btn-width btn-black" @click="copyInvitationCode(personinfo.userNo)">复制邀请码</view>
        <view class="ui-btn btn-more btn-width btn-black" @click="getSaveEdialog">保存图片</view>
        <view class="ui-btn btn-more btn-white " @click="copyInvitationCode(personinfo.url)" >
          复制链接
        </view>
      </view>
      <uiPopup v-if="confirmBoxOrder" class="uoiuoi">
        <view class="confirm-box">
          <view class="confirm-box-title"> 是否同意将图片保存到相册</view>
          <view class="confirm-box-describe"> </view>
          <view class="confirm-box-btn" slot="btnBox">
          <view class="ui-btn btn-more btn-width" @click="closeOrder" style="margin-right: 20rpx;">取消</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="dectcloseOrder">确定</view>
          </view>
        </view>
      </uiPopup>
    </view>
    
	</view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue'
import utils from '@/common/utils.js';
import UiPopup from '@/pages/component/ui-popup.vue';
import html2canvas from 'html2canvas'
export default {
	components: {
		headTitle,
    UiPopup,
	},
	data() {
		return {

      personinfo:{},
      confirmBoxOrder:false,
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
    closeOrder() {
			this.confirmBoxOrder = false
		},
		dectcloseOrder(){
			let self = this;
			self.saveimg();
		},

    async copyInvitationCode(params) {
      uni.setClipboardData({
        data: params,
        success: function () {
         // console.log('复制成功');
          // 可以添加用户友好的提示，例如使用uni.showToast提示复制成功
          uni.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          });
        },
        fail: function () {
          console.log('复制失败');
          // 可以添加错误处理或用户友好的提示
        }
      });
    },

   async saveimg(){
      let self = this;
      utils.saveImg(self.personinfo.imageUrl);
      self.confirmBoxOrder = false;

    },
    getSaveEdialog(){
      let self = this;
      self.confirmBoxOrder = true
    },
    init(){
        let self = this;

        self._get("/user/user/invitation",{},(res=>{
            console.log(res)
            self.personinfo=res.data;
        }))

      
    },
    jumpPage(path) { /*跳转页面*/
			this.gotoPage(path);
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.invite {
  background: #F7F8FA;
  width: 100vw;
  height: 100vh;
 // background-image: url('/static/home/user/Invite-bg.png');
  background-size: 100% 100%;
  .invite-friend {
    // padding-top: 20rpx;
  }
  .invite-qr-bg {
    width: 750rpx;
    height: 545rpx;
   // background-image: url('/static/home/user/Invite-friends1.png');
    background-size: 100% 100%;
    padding-top: 88rpx;
    box-sizing: border-box;
    text-align: center;
  }

  .invite-friend {
    text-align: center;
    .invite-qr{
      margin: 0 238rpx;
      @include area(280rpx,280rpx);
      // display: inline-block;
      // text-align: center;
      // margin: 0 auto;

    }
    .invite-qr-1{
      text-align: center;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 24rpx;
      color: #040404;
      font-style: normal;
      text-transform: none;
      margin-top: 18rpx;
    }
    .invite-qr-2{
      text-align: center;
      font-family: Roboto, Roboto;
      font-weight: bold;
      font-size: 38rpx;
      color: #CB3B21;
      font-style: normal;
      text-transform: none;
      margin-top: 8rpx;
    }
    .invite-qr-3{
      @include area(136rpx,38rpx);
      line-height: 38rpx;
      text-align: center;
      background: #3C3C3B;
      border-radius: 70rpx;
      margin: 16rem auto;


      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 20rpx;
      color: #FFFFFF;
      font-style: normal;
      text-transform: none;
    }
  }
  .invite-btn-box{
    position: fixed;
    bottom: 0;
    width: 750rpx;
    padding: 0rpx 80rpx;
    box-sizing: border-box;
    .btn-more {
      padding: 20rpx 32rpx;
      margin-left: 0rpx;
      margin-bottom: 20rpx;
    }
  }
}

</style>
