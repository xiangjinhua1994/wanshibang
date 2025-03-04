<template>
	<view class="set" v-if="!loadding">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle title="账号与安全"></headTitle>
    <view class="set-detail">
      <view class="set-item" txt="属性">
        <view class="set-attr">
          <text class="set-attr-key">修改设置密码</text>
          <view class="set-attr-val" @click="jumpPage('/pages/user/set/setLoginPassword')">
            <text class="iconfont icon-you"></text>
          </view>
        </view>
        <!-- <view class="set-attr" v-if="userdata.mobile">
          <text class="set-attr-key" >修改手机号码</text>
          <view class="set-attr-val" @click="jumpPage('/pages/user/set/replacePhone')" >
            <text class="set-attr-val-text">{{userdata.mobile.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")}}</text>
            <text class="iconfont icon-you"></text>
          </view>
        </view> -->
        <view class="set-attr" v-if="userdata.email">
          <text class="set-attr-key" >修改邮箱号码</text>
          <view class="set-attr-val" @click="jumpPage('/pages/user/set/replacePhone')" >
            <text class="set-attr-val-text">{{userdata.email.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")}}</text>
            <!-- <text class="set-attr-val-text">{{userdata.email.replace(/^(.).*(.)$/,"$1***$2")}}</text> -->
            <text class="iconfont icon-you"></text>
          </view>
        </view>
        <!-- <view class="set-attr">
          <text class="set-attr-key"  >登录记录</text>
          <view class="set-attr-val" @click="jumpPage('/pages/user/set/loginRecord')">
            
            <text class="iconfont icon-you"></text>
          </view>
        </view> -->
      </view>
      <view class="set-item" txt="属性">
        <view class="set-attr set-attr-singe" @click="openOrder">
          <text class="set-attr-key">注销用户</text>
          <view class="set-attr-val">
            <text class="iconfont icon-you"></text>
          </view>
        </view>
      </view>
    </view>
    <uiPopup v-if="confirmBoxOrder1">
      <view class="confirm-box">
        <view class="confirm-box-title" > 注销提醒 </view>
        <view class="confirm-box-describe"> 注册账号不满30天，无法注销 </view>
        <view class="confirm-box-btn" slot="btnBox">
          <view class="ui-btn btn-more btn-width" @click="cancelOrder">取消</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="closeOrder">确定</view>
        </view>
      </view>
    </uiPopup>
    <uiPopup v-if="confirmBoxOrder">
      <view class="confirm-box">
        <view class="confirm-box-title" > 慎重警告 </view>
        <view class="confirm-box-describe"> *注销后该账号的
          <text class="red">所有数据全部清零</text> 
          ，无法找回。注销后
          <text class="red">90天内不能注册</text>
          确定是否注销？ </view>
        <view class="confirm-box-btn" slot="btnBox">
          <view class="ui-btn btn-more btn-width" @click="cancelOrder">取消</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="closeOrder">确定</view>
        </view>
      </view>
    </uiPopup>
	</view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue'
import uiPopup from '@/pages/component/ui-popup.vue'
import { mapState } from 'vuex';
export default {
	components: {
		headTitle,
    uiPopup
	},
	data() {
		return {
      time: '0',
      confirmBoxOrder1: false,
      confirmBoxOrder: false,
      totalDuration: 10 * 60 * 1000 , // 10 分钟
      startTime: null,
      loadding: true,
      userdata:{},
		};
	},
	computed: {
		//...mapState(['globalUserInfo']),
	},
	onLoad(e) {
		this.startTime = new Date().getTime()
	},
	mounted() {
		this.init();
    this.getuserinfo();
	},
	onShow() {
		
	},
	methods: {
    init(){
      //console.log(this.globalUserInfo.mobile,'globalUserInfo88')
      this.loadding = false;
    },
    getuserinfo(){
          let self = this;
          self._get("user/user/getInfo", {}, function (res) {
              console.log("用户信息")
              console.log(res)
              if(res.code==1){
                  self.userdata = res.data;
              }
          }
        )
      },
    
    openOrder() {
      this.confirmBoxOrder = true
    },
    cancelOrder(){
      this.confirmBoxOrder = false;
      this.confirmBoxOrder1 = false;
    },
    closeOrder() {
      this.cancelUserAccount()
    },
    cancelUserAccount(){
      let self = this;
				self._postBody(
					'user/user/cancel', {},
					function(res) {
            console.log(res,'res')
						// self.mpMessage(res.data.signPackage);
            if(res.code==1){
              this.confirmBoxOrder = false;
              this.confirmBoxOrder1 = false;
            }
					}
				);

    },
    jumpPage(path) { /*跳转页面*/
			this.gotoPage(path);
		},

    copy(message) {
      console.log("message",message)
      uni.setClipboardData({
        data: message,
        success: function (res) {
          uni.showToast({
            title: '复制成功',
            icon: 'success',
            mask:true,
            duration:2000
          });
        },
        fail:function(res){
          console.log("error",res)
        }
      });
    }

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
.set-info {
  @include fl-between;
  margin: 16rpx 28rpx 40rpx 28rpx;
  padding-right: 32rpx;
  .set-info-img {
    @include area(96rpx,96rpx);
    border-radius: 48rpx;
  }
  .set-info-text {
    flex: 1;
    padding-left: 30rpx;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 24rpx;
    color: #666666;
    font-style: normal;
    text-transform: none;
    .set-info-text1 {
      padding-bottom: 20rpx;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: bold;
      font-size: 28rpx;
      color: #353535;
      font-style: normal;
      text-transform: none;
    }
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
      .set-attr-val-text {
        font-family: Hiragino Sans GB, Hiragino Sans GB;
        font-weight: normal;
        font-size: 28rpx;
        color: #8C8C8C;
        font-style: normal;
        text-transform: none;
        padding-right: 12rpx;
      }
    }
  }
}

.set-detail {

}


.set-foot {
  height: 120rpx;
  .set-foot-fixed {
    position: fixed;
    bottom: 40rpx;
    width: 750rpx;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20rpx;
    box-sizing: border-box;
    .btn-more{
      width: 100%;
      // margin-left: 0;
    }
  }

}
</style>
