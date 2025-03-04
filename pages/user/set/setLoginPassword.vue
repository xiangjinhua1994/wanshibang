<template>
	<view class="set">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle title="修改设置密码"></headTitle>
    <view class="login-container" v-if="showCode">
        <view class="p30">
			<view class="group-bd">
				<view class="form-level d-s-c" v-show="showMessage">
					<view class="d-s-c field-name" >
						{{userdata.mobile?'验证码已发送至您注册的手机':'验证码已发送至您注册的邮箱'}}
					</view>
				</view>
                <view class="form-level d-s-c">
					<view class="d-s-c field-name mobilePhone" >
						{{userdata.mobile.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")||userdata.email.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")}}
					</view>
				</view>
                <view class="form-level d-s-c">
					<view class="d-s-c field-name" >
						{{'请在验证码有效期内输入'}}
					</view>
				</view>
				<view class="form-level d-s-c">
					<!-- <view class="d-s-c field-name">
						<text class="orange">*</text>
						<text class="gray3">验证码：</text>
					</view> -->
					<view class="val flex-1 d-b-c" style="background:#fff;border-radius:28rpx">
						<input
							class="flex-1"
							type="number"
                            style="padding-left: 20rpx;"
							v-model="formData.code"
							placeholder="请输入验证码"
						/>
						<button
							class="get-code-btn"
							type="default"
							@click="sendCodeVery"
							:disabled="is_send"
						>
							{{ send_btn_txt }}
						</button>
					</view>
				</view>
			</view>
		</view>

		<view class="btns p30"
			><button :disabled="is_send"  :class="{ activeStyle: btnStyle=== true, itemStyle: btnStyle=== false}" @click="formSubmit">下一步</button></view>
      
    </view>
    <view class="pas-login" v-else>
        <view class="set-pas">
            密码以英文字母或数字开头，限制4---16个字符，数字为2个字符。
        </view>
        <view class="from-item">
          <text class="item-lable">新密码</text>
          <input :type="set.showNewPas === 'text' ? 'text' : 'password'" class="search-input"
            placeholder-class="f24 gray9" placeholder="请输入新密码" v-model="set.newPas"  @blur="bluerzz(set.newPas)" />
          <image src="/static/home/login/hide.png" mode="" v-if="set.showNewPas === 'password'"
            @click="set.showNewPas = 'text'" />
          <image src="/static/home/login/show.png" mode="" v-else @click="set.showNewPas = 'password'" />
        </view>
        <view class="from-item">
          <text class="item-lable">确认密码</text>
          <input :type="set.showConfirmPas === 'text' ? 'text' : 'password'" class="search-input"
            placeholder-class="f24 gray9" placeholder="请再次输入新密码" v-model="set.confirmPas" @blur="bluerzz(set.confirmPas)"/>
          <image src="/static/home/login/hide.png" mode="" v-if="set.showConfirmPas === 'password'"
            @click="set.showConfirmPas = 'text'" />
          <image src="/static/home/login/show.png" mode="" v-else @click="set.showConfirmPas = 'password'" />
        </view>
        <!-- <view class="from-item">
          <text class="item-lable">邀请码 </text>
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="请输入邀请码(选填)"
            v-model="set.inviteId" />
        </view> -->
        <view class="ui-btn btn-black btn-more" @click="passwordLogin">
          确认提交
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
import headTitle from '@/pages/component/headTitle.vue';
import Verify from "@/pages/verify/verify";

export default {
    components: {
        headTitle,
        Verify,
    },
	data() {
		return {
			/*表单数据对象*/
			formData: {
				/*手机号*/
				mobile: '',
				/*验证码*/
				code: '',
			},
			/*是否已发验证码*/
			is_send: false,
			/*发送按钮文本*/
			send_btn_txt: '获取验证码',
			/*当前秒数*/
			second: 60,
			ip: '',
            mobilePhone:'13267170350',
            userdata:{},
            btnStyle:true,
            showMessage:false,
            showCode:true,
            setType:'1',//0：通过邮箱修改密码，1：通过手机修改密码

            register: {
                countryCode: '86',
				mobile: '',
				password: '',
				repassword: '',
				code: '',
			},
            index: 0, // 区号索引
      areaList: [],
      pageType: 1, // 0-找回密码 1-登录 2-注册 3-设置新密码
      smsOpen: false, // 是否开启短信验证
      loginType: 2, // 登录类型 1-验证码登录 2-密码登录
      registerType: 1, // 注册类型 1-手机号注册 2-邮箱注册
      type: "",    //类型(login:登录、register:注册、resetPassword:重置密码、userUpdateMobile: 用户修改手机号码、用户修userOldMobile：改手机号码旧号码校
      loginSmS: { // 验证码登录
        countryCode: '86',
        mobile: '', /* 手机号 */
        code: '', /* 验证码 */
      },
      loginEmail: { //  邮箱登录
        email: '', /*邮箱*/
        code: '', /*验证码*/
        showPaw: 'password', // 显示密码
        remember: true, // 记住密码
      },
      regPhone: { // 手机注册
        stop: 0,
        countryCode: '86',
        mobile: '',
        password: '',
        repassword: '',
        code: '',
      },
      regEmail: { //  邮箱注册
        stop: 0,
        email: '',
        password: '',
        repassword: '',
        code: '',
      },
      set: {
        showConfirmPas: '',
        showNewPas: '',
        newPas: '',
        confirmPas: '',
        inviteId: ''
      },
      isRead: true, // 协议
      second: 60,
      is_send: false,
      send_btn_txt: '获取验证码',
      confirmBoxDel: false,
      timerId: null, //计时器
      captchaVerification:'',
		};
	},
	onLoad() {},
    mounted() {
      this.getUserInfo();
	},
	methods: {
    success(params){
      this.captchaVerification = params.captchaVerification;
      this.sendCode();
      this.$refs.verify.hideVerify();
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
      // if (!this.loginSmS.mobile) {
      //       uni.showToast({
      //         title: '手机号码不能为空',
      //         duration: 2000,
      //         icon: 'none',
      //       });
      //       return;
      // }
      this.useVerify();
    },
		/*提交*/
		async formSubmit() {
			let self = this;
			// if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.formData.mobile)) {
			// 	uni.showToast({
			// 		title: '手机有误,请重填！',
			// 		duration: 2000,
			// 		icon: 'none',
			// 	});
			// 	return;
			// }

			if (self.formData.code == '') {
				uni.showToast({
					title: '验证码不能为空！',
					duration: 2000,
					icon: 'none',
				});
				return;
			}
            if(self.userdata.mobile){
            let parms = {
                mobile: self.userdata.mobile,
                type: "resetPassword",
                countryCode: self.userdata.countryCode,
                code: self.formData.code,
                }
            const res = await self.Verificationcode(parms)
            console.log(res)
            if (res) {
                this.showCode = false;   // 进入设置密码页面
            console.log(res)
            } else {
                this.showCode = true;

            }
            }
            if(self.userdata.email){
            let parms = {
                email: self.userdata.email,
                type: "emailResetPassword",
                countryCode: self.userdata.countryCode,
                code: self.formData.code,
                }
            const res = await self.Verificationcode(parms)
            console.log(res)
            if (res) {
                this.showCode = false;   // 进入设置密码页面
            console.log(res)
            } else {
                this.showCode = true;

            }
            }
			// uni.showLoading({
			// 	title: '正在提交',
			// });
			// self.formData.type = 'bindMobile';
			// self._post(
			// 	'user/userOpen/bindMobile',
			// 	self.formData,
			// 	(result) => {
			// 		uni.showToast({
			// 			title: '绑定成功',
			// 			duration: 2000,
			// 		});
			// 		setTimeout(function () {
			// 			// 执行回调函数
			// 			uni.navigateBack();
			// 		}, 2000);
			// 	},
			// 	() => {
			// 		uni.navigateBack();
			// 	},
			// 	() => {
			// 		uni.hideLoading();
			// 	}
			// );
		},
        bluerzz(text){ 
        if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,16}$/.test(text) ){
            uni.showToast({
                    title: '密码数字加字母6-16位！',
                    duration: 2000,
                    icon: 'none',
                    });
                    return;
        }
        },
        //验证码判断验证 //

        async Verificationcode(parms) {
        let self = this;
        const result = await self._postreturn('user/userOpen/checkSms', parms,)
        if (result.code == 1) {
            return true;
        } else {
            uni.showToast({
            title: result.msg,
            duration: 2000,
            icon: 'none',
            });
            return false;
        }
        },
        passwordLogin() { // 设置登录密码
      let self = this;
      if (self.set.newPas.length < 6) {
          uni.showToast({
            title: '密码至少6位数！',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
        if (self.set.newPas.length > 16) {
          uni.showToast({
            title: '密码要小于16位数！',
            duration: 2000,
            icon: 'none',
          });
          return;
        }

          if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,16}$/.test(self.set.newPas) ){
            uni.showToast({
                    title: '密码数字加字母6-16位！',
                    duration: 2000,
                    icon: 'none',
                  });
                  return;
          }

        if (self.set.newPas !== self.set.confirmPas) {
          uni.showToast({
            title: '两次密码输入不一致！',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
        if(self.userdata.mobile){

        let parms = {
          type: self.setType,
          code: self.formData.code,
          password: self.set.newPas,
        }
        console.log(parms,'ujiouo')
        self._post(
        'user/userOpen/resetpassword',
        parms,
        (result) => {
          uni.showToast({
            title: '修改成功',
            duration: 3000,
            icon: 'none',
          })
          self.formData.code = '';
          self.set.newPas = '';
          self.setType = '';
          self.set.confirmPas = ''
          this.gotoPage('/pages/login/weblogin');
        //   self.formData.mobile = self.resetpassword.mobile
        //   self.formData = {
        //     mobile: '',
        //     password: '',
        //     repassword: '',
        //     code: '',
        //   }
        //   self.second = 0
        //   self.changeMsg()
        //   self.is_login = 1
        },
        false,
        () => {
          uni.hideLoading()
        }
      )
    };

    if(self.userdata.email){

let parms = {
  type: self.setType,
  code: self.formData.code,
  password: self.set.newPas,
}
console.log(parms,'ujiouo')
self._post(
'user/userOpen/resetpassword',
parms,
(result) => {
  uni.showToast({
    title: '修改成功',
    duration: 3000,
    icon: 'none',
  })
  self.formData.code = '';
  self.set.newPas = '';
  self.setType = '';
  self.set.confirmPas = ''
  this.gotoPage('/pages/login/weblogin');
//   self.formData.mobile = self.resetpassword.mobile
//   self.formData = {
//     mobile: '',
//     password: '',
//     repassword: '',
//     code: '',
//   }
//   self.second = 0
//   self.changeMsg()
//   self.is_login = 1
},
false,
() => {
  uni.hideLoading()
}
)
};

       
        //  self._postBody("user/userOpen/resetpassword", parms, function (res) {
        //   console.log("注册新用户")
        //   console.log(res)
        //   if (res.code === 1) {
        //     uni.showToast({
        //       title: res.msg,
        //       duration: 2000,
        //       icon: 'none',
        //     });
            
        //   } else {
        //     // uni.showToast({
        //     //           title:"00000",
        //     //           duration: 2000,
        //     //           icon: 'none',
        //     //         });
        //   }
        // })
      // 注册码时候设置密码 && self.pageType ==3  设置密码页面 /   不需要验证用户协议
      if (self.pageType == 3) {

       
     // registerType: 1, // 注册类型 1-手机号注册 2-邮箱注册
    


        let parms = {
          email:self.registerType==2?self.loginEmail.email:"",
          mobile:self.registerType==1?self.loginSmS.mobile:"",
          countryCode: self.regPhone.countryCode,
          regSource: "app",
          refereeId: self.set.inviteId,
          password: self.set.newPas,
          appId: "10001"
        }

        // if(self.registerType==1){
        //   parms.email=""
        // }else{
        //    parms.mobile=""
        // }
        

        // console.log(parms)
        // self._postBody("user/userOpen/register", parms, function (res) {
        //   console.log("注册新用户")
        //   console.log(res)
        //   if (res.code === 1) {
        //     uni.showToast({
        //       title: res.msg,
        //       duration: 2000,
        //       icon: 'none',
        //     });
        //     self.pageType = 1
        //     self.loginSmS.code = "" // 进首页，把验证码置空
        //     self.stopCountdown();
        //     self.send_btn_txt = '获取验证码';
        //   } else {
        //     // uni.showToast({
        //     //           title:"00000",
        //     //           duration: 2000,
        //     //           icon: 'none',
        //     //         });
        //   }
        // })
      }
  
    },
        getUserInfo() {
            // 获取缓存中的用户信息
            const userInfo = uni.getStorageSync('uerinfo');
            
            if(userInfo) {
                // 成功获取到信息，可以进行后续处理
                this.userdata = userInfo;
                console.log("用户信息:",  this.userdata);
                if(this.userdata.mobile){
                    this.setType = 1;
                }
                if(this.userdata.email){
                    this.setType = 0
                }
            } else {
                // 缓存中没有找到用户信息
                console.log("未找到用户信息");
            }
        },
		/*发送短信*/
		sendCode() {
			let self = this;

			// if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.formData.mobile)) {
			// 	uni.showToast({
			// 		title: '手机有误,请重填！',
			// 		duration: 2000,
			// 		icon: 'none',
			// 	});
			// 	return;
			// }
            if(self.userdata.email){
			self._post(
				'user/userOpen/sendEmailCode',
				{
          captchaVerification: self.captchaVerification,
					email: self.userdata.email,
					type: 'emailResetPassword',
				},
				(result) => {
					if (result.code == 1) {
						uni.showToast({
							title: '发送成功',
						});
						self.is_send = false;
						self.changeMsg();
                        self.showMessage = true;
					}
				}
			);
        }
        if(self.userdata.mobile){
			self._post(
				'user/userOpen/sendCode',
				{
          captchaVerification: self.captchaVerification,
					mobile: self.userdata.mobile,
					type: 'resetPassword',
				},
				(result) => {
					if (result.code == 1) {
						uni.showToast({
							title: '发送成功',
						});
						self.is_send = false;
						self.changeMsg();
                        self.showMessage = true;
					}
				}
			);
        }
		},

		/*改变发送验证码按钮文本*/
		changeMsg() {
			if (this.second > 0) {
                // this.btnStyle = false;
				this.send_btn_txt = this.second + '秒';
				this.second--;
				setTimeout(this.changeMsg, 1000);
			} else {
                // this.btnStyle = true;
				this.send_btn_txt = '重新获取';
				this.second = 60;
				this.is_send = false;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.set{
    height: 100vh;
}
.p30{
    background-color: #F7F8FA;
}

.login-container {
	background: #ffffff;
}
.login-container input {
	height: 88rpx;
	line-height: 88rpx;
   
}
.field-name{
    margin: 0 auto;
    font-weight: normal;
    font-size: 28rpx;
    color: #000000;
    line-height: 28rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-bottom: 56rpx;
}
.mobilePhone{
    font-family: Roboto, Roboto;
font-weight: 400;
font-size: 48rpx;
color: #000000;
line-height: 48rpx;
text-align: left;
font-style: normal;
text-transform: none;
}
.wechatapp {
	padding: 80rpx 0 48rpx;
	border-bottom: 1rpx solid #e3e3e3;
	margin-bottom: 72rpx;
	text-align: center;
}

.wechatapp .header {
	width: 190rpx;
	height: 190rpx;
	border: 2px solid #fff;
	margin: 0rpx auto 0;
	border-radius: 50%;
	overflow: hidden;
	box-shadow: 1px 0px 5px rgba(50, 50, 50, 0.3);
}

.auth-title {
	color: #585858;
	font-size: 34rpx;
	margin-bottom: 40rpx;
}

.auth-subtitle {
	color: #888;
	margin-bottom: 88rpx;
	font-size: 28rpx;
}

.login-btn {
	padding: 0 20rpx;
}

.login-btn button {
	height: 88rpx;
	line-height: 88rpx;
	background: #04be01;
	color: #fff;
	font-size: 30rpx;
	border-radius: 999rpx;
	text-align: center;
}

.no-login-btn {
	margin-top: 20rpx;
	padding: 0 20rpx;
}

.no-login-btn button {
	height: 88rpx;
	line-height: 88rpx;
	background: #dfdfdf;
	color: #fff;
	font-size: 30rpx;
	border-radius: 999rpx;
	text-align: center;
}

.get-code-btn {
	width: 200rpx;
	height: 80rpx;
	line-height: 76rpx;
	padding: 0rpx 30rpx;
	border-radius: 40rpx;
	white-space: nowrap;
	border: 1rpx solid #cccccc;
	color: #000;
	font-size: 30rpx;
}
.get-code-btn[disabled='true'] {
	border: 1rpx solid #cccccc;
}
.btns button[disabled='true'] {
    background: #919191;
    color: #ffffff;
}
.btns button {
	height: 90rpx;
	line-height: 90rpx;
	font-size: 34rpx;
	border-radius: 45rpx;
	color: #ffffff;
}
.activeStyle{
	background: #000000;
}
.itemStyle{
	background: #919191;
}
.pas-login {
    padding: 76rpx;
  
    .from-item {
      margin-bottom: 40rpx;
      @include fl-between;
      flex: 1;
      border: 1rpx solid #F7F8FA;
      background-color: #fff;
      border-radius: 40rpx;
      padding: 20rpx;
  
      .search-input {
        flex: 1;
        padding-left: 20rpx;
        height: 58rpx;
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
  
    .set-pas {
      padding-bottom: 40rpx;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 24rpx;
      color: #252525;
      font-style: normal;
      text-transform: none;
    }
  }
  .btn-more{
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 60rpx;
  }
  .ui-btn{
    margin-left: 0rpx;
  }
</style>