<template>
  <view class="paymentPasw">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle style="z-index: 1000; background-color: #FFFFFF;"></headTitle>

    <view class="page">
       <view >
      <view   v-if="stop === 1" >
        <view class="paycoment">
          <payKeyui  :pay_title1="old_pastitle" @custom-event="receiveFromChild"></payKeyui>
        </view> 
      <view class="payment-btn">
        <view class="ui-btn btn-more btn-black"  @click="next_step(1)">下一步</view>
      </view>
    </view>
      <!-- ref:唯一ref  passwrdType：密码样式pay keyInfo：密码输入监测事件 -->
      <view class="payment-box" v-if="stop === 2">
        <view class="paycoment">
          <payKeyui  :pay_title1="new_pastitle" @custom-event="receiveFromChild"></payKeyui>
        </view> 
        <view class="payment-btn">
          <view class="ui-btn btn-more btn-black" @click="next_step(2)">下一步</view>
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

    </view>
    </view>

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
			// 支付设置状态
         AffirmStatus: 1,
				// 输入密码
				// passwordArr: [],
        oldPasswordArr: [], // 旧密码
				newPasswordArr: [],// 新密码
        passwordArrsure: [], // 确认密码

        stop:1,
        old_pastitle:{
            title:'身份验证',
           describe:"请输入原来的支付密码"
        },
        new_pastitle:{
            title:"确认新支付密码",
            describe:"为了你的安全考虑,最好不能是登录密码"
        },
        sure_pastitle:{
             title:"确认新支付密码",
             describe:"请再次输入，以确认新支付密码"
        } 
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
    receiveFromChild(data){
          console.log("===子传父==")
          console.log(data)
        
       switch (this.stop) {
        case 1:
        this.oldPasswordArr=data
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
    update(params) {
      console.log(params,'params')
			let self = this;
			uni.showLoading({
				title: '加载中',
			});
			self._post('user/user/checkPayPassword', params, function (res) {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000,
                    });
						        uni.hideLoading();
                    if(res.code==1){
                      self.stop=2
                    }else{
                      self.stop=1
                    }
			});
		},
	/**
			 * 唤起键盘
			 */

      next_step(next){
            console.log(next)
            let self = this
            // if(next==1){
            //   if( this.oldPasswordArr.length!==6){
            //     uni.showToast({
            //     title: '支付密码6位数',
            //     duration: 2000,
            //     icon: 'none',
            //   })};
            //     let params = {
            //     payPassword:this.oldPasswordArr.join(''),
            //   }
            //   self.update(params);
            // }
        switch (next) {
            case 1:
           if( this.oldPasswordArr.length!==6){
              uni.showToast({
              title: '支付密码6位数',
              duration: 2000,
              icon: 'none',
            });
           }else{
            // this.stop=2
            // 校验原来的支付密码
              let params = {
                payPassword:this.oldPasswordArr.join(''),
              }
              self.update(params);
           }
              break;
            case 2:

            if(this.newPasswordArr.length!==6){
              uni.showToast({
              title: '支付密码6位数',
              duration: 2000,
              icon: 'none',
            });
           }else{
            this.stop=3
           }
              // this.stop=3
              break;
            default:
              break;
          }
        
          // console.log(  this.stop)
          // console.log(this.oldPasswordArr)
          // console.log(this.newPasswordArr)
          // console.log(this.passwordArrsure)


        // if(this.oldPasswordArr.length!==6){
        //   uni.showToast({
        //     title: '支付密码6位数',
        //     duration: 2000,
        //     icon: 'none',
        //   });
        //   return;
                
        // } else if(this.oldPasswordArr.length===6){
        //   if( this.stop<3){
        //     this.stop += 1
        //    }

        // }

      //  this.stop = 2

       // console.log(this.passwordArr.length )
        // if(this.passwordArr.length < 6){
        //   uni.showToast('请输入6位数密码')
        //   return
        // }
        //    
      },
			/**

			 */



    init() {

    },
    submit() {
       console.log(this.passwordArrsure)
     // this.confirmBoxOrder = true
     if(this.passwordArrsure.length!==6){
          uni.showToast({
            title: '支付密码6位数',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
        if(this.passwordArrsure.toString()!==this.newPasswordArr.toString()){
          uni.showToast({
            title: '两次密码不一样，请重新输入',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
      let params = {
        updateType:'payPassword',
        updateValue:this.passwordArrsure.join(''),
      }
      this.updatePassword(params);
    },
    updatePassword(params) {
			let self = this;
			uni.showLoading({
				title: '加载中',
			});
			self._post('user/user/updateInfo', params, function (res) {
                    uni.showToast({
                        title: '修改成功',
                        icon: 'none',
                        duration: 2000,
                    });
						uni.hideLoading();
            uni.navigateBack()
			});
		},
    setPasFn(e) {
      // this.from.setPas = e.detail.value
      // if (e.detail.value.length >= 6) {
      //   console.log("e", e)
      //   uni.hideKeyboard()
      //   document.activeElement.blur()
      //   /// this.$refs.setPasRef.blur()
      //   this.setPasBlur = true
      // }
    },
    confirmPasFn(e) {
      // this.from.confirm = e.detail.value
      // if (e.detail.value.length >= 6) {
      //   uni.hideKeyboard()
      // }
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
$base: #CCCCCC; // 基础颜色

.page {
  //position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
}

.pay-title {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 90rpx;

  text {
    font-size: 28rpx;
    color: #555555;
  }
}

.pay-password {
  display: flex;
  align-items: center;
  width: 80%;
  height: 80rpx;
  margin: 20rpx auto;
  border: 2rpx solid $base;

  .list {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16.666%;
    height: 100%;
    border-right: 2rpx solid #EEEEEE;

    text {
      font-size: 32rpx;
    }
  }

  .list:nth-child(6) {
    border-right: none;
  }
}

.hint {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100rpx;

  text {
    font-size: 28rpx;
    color: $base;
  }
}


.paymentPasw {
  background: #F7F8FA;
  min-height: 100vh;

  .payment-title {
    padding-top: 200rpx;
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
    padding-top: 80rpx;
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

.box-input {
  // border: 1px #eee solid;
  position: relative;
  padding-left: 20rpx;
  line-height: 100rpx;
  height: 100rpx;

  .input-css {
    line-height: 100rpx;
    height: 100rpx;
    padding-left: 10rpx;

    ::v-deep .uni-input-input {
      letter-spacing: 84rpx;
    }
  }

  .item {
    position: absolute;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 12rpx;
    width: 80rpx;
    height: 100rpx;

    &:nth-child(1) {
      left: 0rpx;
    }

    &:nth-child(2) {
      left: 100rpx;
    }

    &:nth-child(3) {
      left: 200rpx;
    }

    &:nth-child(4) {
      left: 300rpx;
    }

    &:nth-child(5) {
      left: 400rpx;
    }

    &:nth-child(6) {
      left: 500rpx;
    }
  }
}
</style>
