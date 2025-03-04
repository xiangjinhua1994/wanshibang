<template>
	<view class="paymentPasw">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle :title="title"></headTitle>
    
    <view class="payment-box" v-if="stop === 1">
      <view class="retrieve-box">
        <view class="retrieve-line1">验证码已发送至您注册的手机</view>
        <view class="retrieve-line2">{{userdata.mobile}}</view>
        <view class="retrieve-line3">请在验证码有效期内输入</view>
        <view class="from-item">
          <input 
            type="text"
            class="search-input" 
            placeholder-class="f24 gray9"
            placeholder="请输入验证码" 
            v-model="retrieve.code" />
          <text @click="sendCode">{{ send_btn_txt }}</text>

        </view>
      </view>
      <view class="payment-btn">
        <!-- <view class="ui-btn btn-more btn-black" @click="stop = 2">下一步</view> -->
        <view class="ui-btn btn-more btn-black" @click="next_step(2)">下一步</view>
      </view>
    </view>
    <view class="payment-box" v-if="stop === 2">

      <view class="paycoment">
        <payKeyui  :pay_title1="new_pastitle" @custom-event="receiveFromChild"></payKeyui>
      </view> 


      <view class="payment-btn">
        <view class="ui-btn btn-more btn-black" @click="stop = 3">下一步</view>
      </view>

    </view>
    <view class="payment-box" v-if="stop === 3">

      <view class="paycoment">
        <payKeyui  :pay_title1="sure_pastitle" @custom-event="receiveFromChild"></payKeyui>
      </view> 
      <view class="payment-btn">
        <view class="ui-btn btn-more btn-black" @click="submit">确认</view>
      </view>
    </view>
    <uiPopup v-if="confirmBoxOrder">
      <view class="confirm-box">
        <view class="confirm-box-title" > 是否放弃修改支付密码？ </view>
        <view class="confirm-box-btn" slot="btnBox">
          <view class="ui-btn btn-more btn-width" @click="closeOrder">放弃设置</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="closeOrder">继续设置</view>
        </view>
      </view>
    </uiPopup>
	</view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue'
import uiPopup from '@/pages/component/ui-popup.vue'
import payKeyui from './paykeyui.vue';
export default {
	components: {
		headTitle,
    uiPopup,
    payKeyui
	},
	data() {
		return {
      title: '身份验证',
      confirmBoxOrder: false,
      retrieve: {
        code: '',
        setPas: '',
        confirm: ''
      },
      stop: 1,
      second: 60,
      is_send: false,
      send_btn_txt: '获取验证码',

       new_pastitle:{
            title:'设置支付密码',
           describe:"为了您的安全考虑,最好不能是登录密码"
        },
        sure_pastitle:{
            title:"确认新支付密码",
            describe:"请再次输入,以确认密码"
        },
        newPasswordArr:[], //新密码
        passwordArrsure:[],// 确认密码
        userdata:{},
      
      // setPasBlur: false,
		};
	},
	computed: {
		
	},
	onLoad(e) {
	},
	mounted() {
		this.init();
    this.getUserInfo();
	},
	onShow() {
		
	},
	methods: {

    receiveFromChild(data){
          console.log("===子传父==")
          console.log(data)
        
       switch (this.stop) {
        case 1:
      //  this.oldPasswordArr=data
      console.log('opop')
          break;
       
          case 2:
          this.newPasswordArr=data
            break;
          case 3:
          this.passwordArrsure=data
            break;

        default:
          break;
       }
    },
    next_step(num){
      if(this.retrieve.code.length!==6){
        uni.showToast({
          title: '验证码6位数',
          duration: 2000,
          icon: 'none',
        });
        return;
      }
      this.stop = num;
},

    getUserInfo() {
            // 获取缓存中的用户信息
            const userInfo = uni.getStorageSync('uerinfo');
            
            if(userInfo) {
                // 成功获取到信息，可以进行后续处理
                this.userdata = userInfo;
                console.log("用户信息:",  this.userdata);
            } else {
                // 缓存中没有找到用户信息
                console.log("未找到用户信息");
            }
        },
    init(){

    },
    sendCode() { // 发送验证码
      this.changeMsg();
    },
    changeMsg() { // 倒计时
			if (this.second > 0) {
				this.send_btn_txt = this.second + 'S';
				this.second--;
				setTimeout(this.changeMsg, 1000);
			} else {
				this.send_btn_txt = '获取验证码';
				this.second = 60;
				this.is_send = false;
			}
		},
    submit(){
      this.confirmBoxOrder = true
    },
    oldPasFn(e){
      this.retrieve.oldPas = e.detail.value
      if(e.detail.value.length >= 6){
        uni.hideKeyboard()
      }
    },
    setPasFn(e){
      this.retrieve.setPas = e.detail.value
      if(e.detail.value.length >= 6){
        console.log("e", e)
        uni.hideKeyboard()
        // document.activeElement.blur() 
        // this.$refs.setPasRef.blur()
        // this.setPasBlur = true
      }
    },
    confirmPasFn(e){
      this.retrieve.confirm = e.detail.value
      if(e.detail.value.length >= 6){
        uni.hideKeyboard()
      }
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
.paymentPasw {
  background: #F7F8FA;
  min-height: 100vh;
  .payment-title{
    padding-top: 64rpx;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 44rpx;
    color: #040404;
    line-height: 22px;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
  .payment-describe {
    padding-top: 40rpx;
    padding-bottom: 76rpx;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #8C8C8C;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
  .payment-pas-box {
    padding: 0 80rpx;
  }
  .payment-btn {
    padding-top: 80rpx;
    padding-right: 60rpx;
    padding-left: 40rpx;
  }
}

.box-input{
  // border: 1px #eee solid;
  position: relative;
  padding-left: 20rpx;
  line-height: 100rpx;
  height: 100rpx;
  .input-css{
    line-height: 100rpx;
    height: 100rpx;
    padding-left: 10rpx;
    ::v-deep .uni-input-input{
      letter-spacing: 82rpx;
    }
  }
  .item {
    position: absolute;
    background-color: #fff ;
    border:1px solid #ccc;
    border-radius: 12rpx;
    width: 80rpx;
    height:100rpx;
    
    &:nth-child(1){
      left: 0rpx;
    }
    &:nth-child(2){
      left: 100rpx;
    }
    &:nth-child(3){
      left: 200rpx;
    }
    &:nth-child(4){
      left: 300rpx;
    }
    &:nth-child(5){
      left: 400rpx;
    }
    &:nth-child(6){
      left: 500rpx;
    }
  }
}
.retrieve-box{
  padding: 60rpx;
  padding-bottom: 0rpx;
  .retrieve-line1 {
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #000000;
    font-style: normal;
    text-transform: none;
    padding-bottom: 56rpx;
    text-align: center;
  }
  .retrieve-line2 {
    font-family: Roboto, Roboto;
    font-weight: 600;
    font-size: 48rpx;
    color: #000000;
    font-style: normal;
    text-transform: none;
    padding-bottom: 40rpx;
    text-align: center;
  }
  .retrieve-line3 {
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 24rpx;
    color: #000000;
    font-style: normal;
    text-transform: none;
    padding-bottom: 40rpx;
    text-align: center;
  }
}
.from-item {
  margin-bottom: 40rpx;
  @include fl-between;
  flex: 1;
  border: 1rpx #fff solid;
  background-color: #fff ;
  border-radius: 40rpx;
  padding: 20rpx;
  .search-input {
    flex: 1;
    padding-left: 20rpx;
  }
}
</style>
