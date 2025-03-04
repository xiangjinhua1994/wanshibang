<template>
  <view class="paymentPasw">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle style="z-index: 1000;"></headTitle>
      <view   v-if="stop === 1" >
        <view class="paycoment">
          <payKeyui  :pay_title1="pay_title1" @custom-event="receiveFromChild"></payKeyui>
        </view>
       <!-- <span>下一步000000000000</span> -->
       <view class="payment-btn">
          <view class="ui-btn btn-more btn-black"  @click="next_step">下一步</view>
        </view> 
       <!-- <view class="payment-box">
      </view> -->
    </view>
      <!-- ref:唯一ref  passwrdType：密码样式pay keyInfo：密码输入监测事件 -->
      <view class="payment-box" v-if="stop === 2">
        <!-- <view class="payment-title">确认设置支付密码</view>
        <view class="payment-describe">请再次输入，以确认密码</view> -->
        <view class="paycoment">
          <payKeyui  :pay_title1="pay_title1sure"  @custom-event="receiveFromChild2" ></payKeyui>
        </view>
        <view class="payment-btn">
          <view class="ui-btn btn-more btn-black" @click="submit">确认</view>
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
				passwordArr: [],
        passwordArrsure: [], // 确认密码
				oldPasswordArr: [],
				newPasswordArr: [],
				afPasswordArr: [],
        stop:1,
        pay_title1:{
          title:'设置支付密码',
          describe:"为了您的安全考虑，最好不能是登录密码"
        },
        pay_title1sure:{
            title:'确认设置支付密码',
           describe:"请再次输入，以确认密码"
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
    console.log(data,'ioio')

      this.passwordArr=data
    },
    receiveFromChild2(data){
    console.log("===子传父==")
    console.log(data,'passwordArrsure')
      this.passwordArrsure=data
    },

	/**
			 * 唤起键盘
			 */
       onPayUp() {
				this.$refs.CodeKeyboard.show();
			},

      back(){

      },
      next_step(){

        console.log(this.passwordArr.length,this.passwordArr,'this.passwordArr')
        if(this.passwordArr.length!==6){
          uni.showToast({
            title: '支付密码6位数',
            duration: 2000,
            icon: 'none',
          });
          return;
        }

        this.stop = 2

       // console.log(this.passwordArr.length )
        // if(this.passwordArr.length < 6){
        //   uni.showToast('请输入6位数密码')
        //   return
        // }
        //    
      },
			/**
			 * 支付键盘回调
			 * @param {Object} val
			 */
			KeyInfo(val) {

			//	console.log('输入信息 = ' + JSON.stringify(val));
				// 输入超过七位数无效
				if (val.index >= 6) {
          console.log(val.index )
					return;
				}
      //  let step = this.stop ==1 ? this.passwordArr : this.passwordArrsure

				// 判断是否输入的是删除键
				if (val.keyCode === 8) {
					// 删除最后一位
					this.passwordArr.splice(val.index + 1, 1)
				}
				// 判断是否输入的是.
				else if (val.keyCode == 190) {
					// 输入.无效
				} else {
					this.passwordArr.push(val.key);
				}
				// 判断是否等于6
				if (this.passwordArr.length > 6) {
            this.passwordArr = [];
            this.AffirmStatus = this.AffirmStatus + 1;
				}
        console.log(this.passwordArr)
				// 判断到哪一步了
				if (this.AffirmStatus === 1) {
					this.oldPasswordArr = this.passwordArr;
				} else if (this.AffirmStatus === 2) {
					this.newPasswordArr = this.passwordArr;
				} else if (this.AffirmStatus === 3) {
					this.afPasswordArr = this.passwordArr;
				} else if (this.AffirmStatus === 4) {
		

					// setTimeout(() => {
					// 	uni.navigateBack();
					// }, 2000)
				}
				this.$forceUpdate();
			},

      KeyInfosure(val){
				// 输入超过七位数无效
				if (val.index >= 6) {
					return;
				}
				// 判断是否输入的是删除键
				if (val.keyCode === 8) {
					// 删除最后一位
					this.passwordArrsure.splice(val.index + 1, 1)
				}
				// 判断是否输入的是.
				else if (val.keyCode == 190) {
					// 输入.无效
				} else {
					this.passwordArrsure.push(val.key);
				}
				// 判断是否等于6
				if (this.passwordArrsure.length > 6) {
  
				//	this.passwordArrsure = [];
				//	this.AffirmStatus = this.AffirmStatus + 1;
				}
				// 判断到哪一步了
				if (this.AffirmStatus === 1) {
					this.oldPasswordArr = this.passwordArr;
				} else if (this.AffirmStatus === 2) {
					this.newPasswordArr = this.passwordArr;
				} else if (this.AffirmStatus === 3) {
					this.afPasswordArr = this.passwordArr;
				} else if (this.AffirmStatus === 4) {
		

					// setTimeout(() => {
					// 	uni.navigateBack();
					// }, 2000)
				}
				this.$forceUpdate();

      },
   



    init() {

    },
    submit() {
      this.confirmBoxOrder = true;
      if(this.passwordArrsure.length!==6){
          uni.showToast({
            title: '支付密码6位数',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
        if(this.passwordArrsure.toString()!==this.passwordArr.toString()){
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
      this.update(params);
    },
    update(params) {
			let self = this;
			
			uni.showLoading({
				title: '加载中',
			});
			self._post('user/user/updateInfo', params, function (res) {
                    uni.showToast({
                        title: '设置成功',
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
.paycoment{
    padding: 0rpx 20rpx;
}
.payment-btn{
   margin-top: 80rpx;
   padding: 0rpx 40rpx;
}
.page {
 // position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  //background-color: #FFFFFF;
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
  background: #ffff;
  min-height: 100vh;


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
