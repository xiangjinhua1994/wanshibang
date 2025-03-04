<template>
	<view >
    <view class="replacePhone-old" txt="old phone" v-if="stop === 1">
      <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
      <headTitle title="更换手机号"></headTitle>
      <view class="" v-if="userdata.mobile">
        <view class="phone-old-text">当前手机号</view>
        <view class="phone-old">{{userdata.mobile.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")}}</view>
        <view class="ui-btn btn-black btn-more" @click="stopFn">
          提交
        </view>
      </view>
      <view class="" v-if="userdata.email">
        <view class="phone-old-text">当前邮箱号</view>
        <view class="phone-old">{{userdata.email.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")}}</view>
        <view class="ui-btn btn-black btn-more" @click="stopFn">
          提交
        </view>
      </view>
    </view>
    <view class="replacePhone-new" txt="new phone" v-else>
      <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
      <view class="login-logo">
        <view class="login-logo-img"><image src="/static/nh.png" mode=""/></view>
        <view class="login-logo-text ">逛南合国际 买东南亚好货</view>
      </view>
      <view class="pas-login" v-if="userdata.mobile">
        <view class="from-item">
          <picker @change="loginPickerChange" :value="index" :range="areaList" range-key="showName" mode = selector>
            <view class="uni-input">+ {{areaList[index].tel}} </view>
          </picker>
          <input 
            type="text"
            class="search-input" 
            placeholder-class="f24 gray9"
            placeholder="输入手机号码" 
            v-model="loginSmS.mobile" />
        </view>
        <view class="from-item">
          <input 
            type="text"
            class="search-input" 
            placeholder-class="f24 gray9"
            placeholder="请输入验证码" 
            v-model="loginSmS.code" />
          <text @click="sendCodeVery">{{ send_btn_txt }}</text>

        </view>
        <view class="ui-btn btn-black btn-more" @click.prevent="smsLogin">
          提交
        </view>
      </view>
      <view class="pas-login" v-if="userdata.email">
        <view class="from-item">
          <input 
            type="text"
            class="search-input" 
            placeholder-class="f24 gray9"
            placeholder="请输入邮箱号码" 
            v-model="loginSmSEmail.email" />
        </view>
        <view class="from-item">
          <input 
            type="text"
            class="search-input" 
            placeholder-class="f24 gray9"
            placeholder="请输入验证码" 
            v-model="loginSmSEmail.code" />
          <text @click="sendCodeVery2">{{ send_btn_txt }}</text>

        </view>
        <view class="ui-btn btn-black btn-more" @click.prevent="smsLogin">
          提交
        </view>
      </view>
    </view>
    <Verify
      @success="success"
      :mode="'pop'"     
      :captchaType="'blockPuzzle'"   
      :imgSize="{ width: '330px', height: '155px' }"
      ref="verify"
    ></Verify>
	</view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue'
import { list } from '@/static/data/area.json';
import Verify from "@/pages/verify/verify";
export default {
	components: {
		headTitle,
    Verify
	},
	data() {
		return {
      captchaVerification:'',
      index: 0, // 区号索引
      areaList: [],
      loginSmS: { // 验证码登录
        countryCode: '86',
				mobile: '', /* 手机号 */
				code: '', /* 验证码 */
			},
      loginSmSEmail: { // 邮箱
        countryCode: '86',
				email: '', /* 手机号 */
				code: '', /* 验证码 */
			},
      send_btn_txt: '获取验证码',
      second: 60,
      is_send: false,
      stop: 1,
      userdata:{},
		};
	},
	computed: {
		
	},
	onLoad(e) {
    this.areaList = list
	},
	mounted() {
		this.init();
    this.getUserInfo()
	},
	onShow() {
		
	},
	methods: {
    success(params){
      console.log(this.loginType,'params89898this.loginType')
      this.captchaVerification = params.captchaVerification;
      this.sendCode();
      // if(this.registerType == 1){
      //   this.sendCode();
      // }else if(this.registerType == 2) {
      //   this.sendCode();
      // }

      console.log(params,'params89898')
		  // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
        },
        useVerify(){
          console.log(this.$refs.verify,'this.$refs.verify')
          
            this.$refs.verify.show()
        },
      sendCodeVery(){
      if (!this.loginSmS.mobile) {
            uni.showToast({
              title: '手机号码不能为空',
              duration: 2000,
              icon: 'none',
            });
            return;
      }
      this.useVerify();
    },
    sendCodeVery2(){
      if (!this.loginSmSEmail.email) {
            uni.showToast({
              title: '邮箱号码不能为空',
              duration: 2000,
              icon: 'none',
            });
            return;
      }
      if (!this.testEmail(this.loginSmSEmail.email)) {
          uni.showToast({
            title: '邮箱有误,请重填！',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
      this.useVerify();
    },
    init(){
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
    stopFn() {
      this.stop = 2
    },
    smsLogin() {
      let self = this;
      if(self.userdata.mobile){
      if (this.loginSmS.mobile == '') {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return false
      }
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.loginSmS.mobile)) {
        console.log(this.loginSmS.mobile)
        uni.showToast({
          title: '手机号有误,请重填！',
          duration: 2000,
          icon: 'none',
        })
        return false
      }
      if (this.loginSmS.code == '') {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
        return false
      }
      if (this.loginSmS.mobile == this.userdata.mobile) {
        uni.showToast({
          title: '新旧手机号一致，请重新提供手机号',
          icon: 'none'
        })
        return false
      }
			self._postBody(
				'user/user/updateMobile', {
          mobile: this.loginSmS.mobile,
          mobileCode: this.loginSmS.code,
          countryCode: this.userdata.countryCode,
				},
				function(res) {
          console.log(res);
          uni.showToast({
          title: res.msg,
          icon: 'none'
        })
        if(res.code==1){
          // uni.navigateBack()
          // self.$store.dispatch('GetGloablUserInfo', { _vue: this });
          self.gotoPage('/pages/login/weblogin');
        }

				}
			);
    };
    if(self.userdata.email){
      if (this.loginSmSEmail.code == '') {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
        return false
      }
      if (this.loginSmSEmail.email == this.userdata.email) {
        uni.showToast({
          title: '新旧邮箱号一致，请重新提供邮箱号',
          icon: 'none'
        })
        return false
      }
			self._postBody(
				'user//user/updateEmail', {
          email: this.loginSmSEmail.email,
          emailCode: this.loginSmSEmail.code,
          // countryCode: this.userdata.countryCode,
				},
				function(res) {
          console.log(res);
          uni.showToast({
          title: res.msg,
          icon: 'none'
        })
        if(res.code==1){
          // uni.navigateBack()
          // self.$store.dispatch('GetGloablUserInfo', { _vue: this });
          self.gotoPage('/pages/login/weblogin');
        }

				}
			);
    };
      

    },
    loginPickerChange: function(e) {
      console.log('bindPickerChange', e.detail, e)
      this.index = e.detail.value
      this.loginSmS.countryCode = this.areaList[this.index]['tel']
    },
    sendCode() { // 发送验证码
      // this.changeMsg();
      let self= this;
      
      if(self.userdata.email){
        if (!self.loginSmSEmail.email) {
            uni.showToast({
              title: '邮箱不能为空,请重填！',
              duration: 2000,
              icon: 'none',
            });
            return;
        }
        if (!self.testEmail(self.loginSmSEmail.email)) {
          uni.showToast({
            title: '邮箱有误,请重填！',
            duration: 2000,
            icon: 'none',
          });
          return;
			 }
       
			self._post(
				'user/userOpen/sendEmailCode',
				{
          captchaVerification: self.captchaVerification,
					email: self.loginSmSEmail.email,
					type: 'userUpdateEmail',
				},
				(result) => {
					if (result.code == 1) {
						uni.showToast({
							title: '发送成功',
						});
						self.is_send = false;
            self.$refs.verify.hideVerify();
						self.changeMsg();
					}
				},
        (err)=>{
              uni.showToast({
                  title: err.data.msg,
                  icon: 'none',
                  duration: 2000,
                })
                self.$refs.verify.hideVerify();
            }

			);
        }
        if(self.userdata.mobile){
          
        if (!self.loginSmS.mobile) {
            uni.showToast({
              title: '手机号不能为空,请重填！',
              duration: 2000,
              icon: 'none',
            });
            return;
        }
          self._post(
            'user/userOpen/sendCode',
            {
              captchaVerification: self.captchaVerification,
              mobile: self.loginSmS.mobile,
              type: 'userUpdateMobile',
            },
            (result) => {
              if (result.code == 1) {
                uni.showToast({
                  title: '发送成功',
                });
                self.is_send = false;
                self.$refs.verify.hideVerify();
                self.changeMsg();
              }else{
                console.log(result,'captchaVerification898');
                uni.showToast({
                  title: result.msg,
                  icon: 'none',
                  duration: 2000,
                })
              }
            },
            (err)=>{
              console.log(err.data.msg,'7989');
              uni.showToast({
                  title: err.data.msg,
                  icon: 'none',
                  duration: 2000,
                })
                self.$refs.verify.hideVerify();

            }
          );
        }
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
    jumpPage(path) { /*跳转页面*/
			this.gotoPage(path);
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.replacePhone-old {
  background: #F7F8FA;
  min-height: 100vh;
  .phone-old-text {
    width: 750rpx;
    padding: 40rpx 0;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: bold;
    font-size: 28rpx;
    color: #000000;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
  .phone-old {
    width: 750rpx;
    padding: 20rpx 0 80rpx 0;
    font-family: Roboto, Roboto;
    font-weight: 600;
    font-size: 48rpx;
    color: #000000;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }
  .btn-more{
    margin-right: 24rpx;
  }
}
.replacePhone-new {
  background: #fff;
  min-height: 100vh;

}
.login-logo {
  padding: 80rpx;
  padding-bottom: 20rpx;
  .login-logo-img{
    font-family: Arial Black, Arial Black;
    font-weight: 400;
    font-size: 88rpx;
    color: #000000;
    text-align: left;
    font-style: normal;
    text-transform: none;
    image{
      width: 205rpx;
      height: 100rpx;
    }
  }
  .login-logo-text {
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 20rpx;
    color: #000000;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
}
.pas-login {
  padding: 76rpx;
  .from-item {
    margin-bottom: 40rpx;
    @include fl-between;
    flex: 1;
    border: 1rpx #F7F8FA solid;
    background-color: #F7F8FA ;
    border-radius: 40rpx;
    padding: 20rpx;
    .search-input {
      flex: 1;
      padding-left: 20rpx;
    }
    .item-lable {
      width: 120rpx;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: bold;
      font-size: 28rpx;
      color: #252525;
      font-style: normal;
      text-transform: none;
    }
    image {
      width: 36rpx;
      height: 36rpx;
    }
  }
  .remember-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 20rpx;
    image {
      width: 30rpx;
      height: 30rpx;
    }
    text {
      margin-left: 10rpx;
    }
  }
  .set-pas{
    padding-bottom: 40rpx ;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 24rpx;
    color: #252525;
    font-style: normal;
    text-transform: none;
  }
  .btn-more {
    margin-left: 0;
  }
}
</style>
