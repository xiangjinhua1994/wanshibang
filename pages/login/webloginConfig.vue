<template>
	<view
		:data-theme="theme()"
		:class="theme() || ''"
		class="login-container"
		:style="'height: ' + phoneHeight + 'px;'"
	>
    
		<view class="skip" @click="gotoPage('/pages/index/index')">跳过→</view>
    <!-- is_login: {{is_login}}--login_type:{{ login_type }} -- register_type:{{ register_type }} -->
		<view class="p-30-75" v-if="is_login == 2">
			<!-- 手机号注册 -->
			<template v-if="register_type == 1">
				<view class="login_topbpx">
					<view class="login_tit">注册</view>
					<view class="login_top"
						>已有账户，<text class="dominant" @click="logiToReg(1)"
							>立即登录</text
						></view
					>
				</view>
				<view class="group-bd">
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom flex-aligin">
              <picker @change="regPickerChange" :value="index" :range="areaList" range-key="showName" mode = selector>
                <view class="uni-input">+ {{areaList[index].tel}} </view>
              </picker>
              <input
								type="text"
                class="pl-2"
								v-model="register.mobile"
								placeholder="请填写手机号"
								:disabled="is_send"
						/></view>
					</view>
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								password="true"
								v-model="register.password"
								placeholder="请输入密码"
						/></view>
					</view>
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								password="true"
								v-model="register.repassword"
								placeholder="请确认密码"
						/></view>
					</view>
					<view class="form-level d-s-c" v-if="sms_open">
						<view class="val flex-1 d-b-c input_botom">
							<input
								class="flex-1"
								type="number"
								v-model="register.code"
								placeholder="请填写验证码"
							/>
							<button
								class="get-code-btn"
								type="default"
								@click="sendCode"
								:disabled="is_send"
							>
								{{ send_btn_txt }}
							</button>
						</view>
					</view>
				</view>
			</template>
			<!-- 邮箱注册 -->
			<template v-if="register_type == 2">
				<view class="login_topbpx">
					<view class="login_tit">注册</view>
					<view class="login_top"
						>已有账户，<text class="dominant" @click="logiToReg(1)"
							>立即登录</text
						></view
					>
				</view>
				<view class="group-bd">
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								v-model="registerEmailForm.email"
								placeholder="请填写邮箱"
								:disabled="is_send"
						/></view>
					</view>
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								password="true"
								v-model="registerEmailForm.password"
								placeholder="请输入密码"
						/></view>
					</view>
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								password="true"
								v-model="registerEmailForm.repassword"
								placeholder="请确认密码"
						/></view>
					</view>
					<view class="form-level d-s-c">
						<!-- v-if="sms_open" -->
						<view class="val flex-1 d-b-c input_botom">
							<input
								class="flex-1"
								type="number"
								v-model="registerEmailForm.code"
								placeholder="请填写验证码"
							/>
							<button
								class="get-code-btn"
								type="default"
								@click="sendEmailCode"
								:disabled="is_send"
							>
								{{ send_btn_txt }}
							</button>
						</view>
					</view>
				</view>
			</template>
		</view>
		<view class="p-30-75" v-if="is_login == 1">
			<!-- 手机号登录 -->
			<template v-if="login_type == 1">
				<view class="login_topbpx">
					<view class="login_tit">登录</view>
					<view class="login_top"
						>还没有账号，<text class="dominant" @click="logiToReg(2)"
							>立即注册</text
						></view
					>
				</view>
				<view class="group-bd">
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom flex-aligin">
              <!-- <view class="uni-list-cell-db"></view> -->
              <picker @change="bindPickerChange" :value="index" :range="areaList" range-key="showName" mode = selector>
                <view class="uni-input">+ {{areaList[index].tel}} </view>
              </picker>
              <input
                class="pl-2"
								type="text"
								v-model="formData.mobile"
								placeholder="请填写手机号"
						  />
            </view>
					</view>
					<view class="form-level d-s-c" v-if="!is_code">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								password="true"
								v-model="loging_password"
								placeholder="请输入密码"
						/></view>
					</view>
					<view class="form-level d-s-c" v-if="is_code && sms_open">
						<view class="val flex-1 d-b-c input_botom">
							<input
								class="flex-1"
								type="number"
								v-model="formData.code"
								placeholder="请填写验证码"
							/>
							<button
								class="get-code-btn"
								type="default"
								@click="sendCode"
								:disabled="is_send"
							>
								{{ send_btn_txt }}
							</button>
						</view>
					</view>
				</view>
			</template>
			<!-- 邮箱登录 -->
			<template v-if="login_type == 2">
				<view class="login_topbpx">
					<view class="login_tit">登录</view>
					<view class="login_top"
						>还没有账号，<text class="dominant" @click="logiToReg(2)"
							>立即注册</text
						></view
					>
				</view>
				<view class="group-bd">
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								v-model="formDataEmail.email"
								placeholder="请填写邮箱"
						/></view>
					</view>
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								password="true"
								v-model="loging_password"
								placeholder="请输入密码"
						/></view>
					</view>
					<!-- <view class="form-level d-s-c" v-if="is_code && sms_open">
						<view class="val flex-1 d-b-c input_botom">
							<input
								class="flex-1"
								type="number"
								v-model="formDataEmail.code"
								placeholder="请填写验证码"
							/>
							<button
								class="get-code-btn"
								type="default"
								@click="sendEmailCode"
								:disabled="is_send"
							>
								{{ send_btn_txt }}
							</button>
						</view>
					</view> -->
				</view>
			</template>
		</view>
		<view class="p-30-75" v-if="is_login == 0">
			<!-- 手机号找回密码 -->
			<template v-if="login_type == 1">
				<view class="login_topbpx">
					<view class="login_tit">重置密码</view>
					<view class="login_top"
						><text class="dominant" @click="logiToReg(1)">立即登录</text></view
					>
				</view>
				<view class="group-bd">
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								v-model="resetpassword.mobile"
								placeholder="请填写手机号"
								:disabled="is_send"
						/></view>
					</view>
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								password="true"
								v-model="resetpassword.password"
								placeholder="请输入密码"
						/></view>
					</view>
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								password="true"
								v-model="resetpassword.repassword"
								placeholder="请确认密码"
						/></view>
					</view>
					<view class="form-level d-s-c">
						<view class="val flex-1 d-b-c input_botom">
							<input
								class="flex-1"
								type="number"
								v-model="resetpassword.code"
								placeholder="请填写验证码"
							/>
							<button
								class="get-code-btn"
								type="default"
								@click="sendCode"
								:disabled="is_send"
							>
								{{ send_btn_txt }}
							</button>
						</view>
					</view>
				</view>
			</template>
			<!-- 邮箱找回密码 -->
			<template v-if="login_type == 2">
				<view class="login_topbpx">
					<view class="login_tit">重置密码</view>
					<view class="login_top"
						><text class="dominant" @click="logiToReg(1)">立即登录</text></view
					>
				</view>
				<view class="group-bd">
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								v-model="resetEmailPassword.email"
								placeholder="请填写邮箱"
								:disabled="is_send"
						/></view>
					</view>
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								password="true"
								v-model="resetEmailPassword.password"
								placeholder="请输入密码"
						/></view>
					</view>
					<view class="form-level d-s-c">
						<view class="val flex-1 input_botom"
							><input
								type="text"
								password="true"
								v-model="resetEmailPassword.repassword"
								placeholder="请确认密码"
						/></view>
					</view>
					<view class="form-level d-s-c">
						<view class="val flex-1 d-b-c input_botom">
							<input
								class="flex-1"
								type="number"
								v-model="resetEmailPassword.code"
								placeholder="请填写验证码"
							/>
							<button
								class="get-code-btn"
								type="default"
								@click="sendEmailCode"
								:disabled="is_send"
							>
								{{ send_btn_txt }}
							</button>
						</view>
					</view>
				</view>
			</template>
		</view>
		<view
			v-if="is_login == 1"
			class="gray6 p-0-75"
			:class="is_code ? 'd-e-c' : 'd-b-c'"
		>
			<view v-if="!is_code" @click="forgetPassWord">忘记密码?</view>
			<view @click="isCode()" v-if="sms_open && login_type == 1">{{
				is_code ? '使用密码登录' : '使用验证码登录'
			}}</view>
		</view>

		<view @click="isRead = !isRead" class="d-s-c gray6 p-0-75 mt20">
			<view :class="isRead ? 'active agreement' : 'agreement'"></view
			>我已阅读并接受<text class="dominant" @click.stop="xieyi('service')"
				>《用户协议》</text
			>和<text class="dominant" @click.stop="xieyi('privacy')"
				>《隐私政策》</text
			>
		</view>
		<view style="padding-top: 80rpx" class="btns p-30-75" v-if="is_login == 2"
			><button @click="registerSub">注册</button></view
		>
		<view style="padding-top: 80rpx" class="btns p-30-75" v-if="is_login == 1"
			><button @click="formSubmit">登录</button></view
		>
		<view style="padding-top: 80rpx" class="btns p-30-75" v-if="is_login == 0"
			><button @click="resetpasswordSub">重置密码</button></view
		>
		<!-- 切换登录方式 -->
		<view class="change_login_type" v-if="is_login == 1 && globalGetEmail">
			<text class="" @click="changeLoginType">
				{{ login_type == 1 ? '使用邮箱登录' : '使用手机号登录' }}
			</text>
		</view>
		<!-- 切换注册方式 -->
		<view class="change_login_type" v-if="is_login == 2 && globalGetEmail">
			<text class="" @click="changeRegisterType">
				{{ register_type == 1 ? '使用邮箱注册' : '使用手机号注册' }}
			</text>
		</view>
	</view>
</template>

<script>
import { list } from '../../static/data/area.json';
import { mapState } from 'vuex';
export default {
	data() {
		return {
      aa: '',
      index: 0,
      areaList:[],
			/*表单数据对象*/
			formData: {
        countryCode: '86',
				/*手机号*/
				mobile: '',
				/*验证码*/
				code: '',
			},
			// TODO 邮箱登录
			formDataEmail: {
				/*邮箱*/
				email: '',
				/*验证码*/
				code: '',
			},
			loging_password: '',
			register: {
        countryCode: '86',
				mobile: '',
				password: '',
				repassword: '',
				code: '',
			},
			// TODO 邮箱注册
			registerEmailForm: {
				email: '',
				password: '',
				repassword: '',
				code: '',
			},
			resetpassword: {
				mobile: '',
				password: '',
				repassword: '',
				code: '',
			},
			// TODO 邮箱找回密码
			resetEmailPassword: {
				email: '',
				password: '',
				repassword: '',
				code: '',
			},
			/*是否已发验证码*/
			is_send: false,
			/*发送按钮文本*/
			send_btn_txt: '获取验证码',
			/*当前秒数*/
			second: 60,
			ip: '',
			isShow: true,
			is_login: 1, //0-找回密码 1-登录 2-注册
			is_code: false,
			phoneHeight: 0,
			isRead: false,
			sms_open: false,
			// TODO-----------------------
			login_type: 1, //登录类型 1-手机号登录 2-邮箱登录
			register_type: 1, //注册类型 1-手机号注册 2-邮箱注册
		};
	},
	computed: {
		...mapState(['globalGetEmail']),
		switchType() {
			switch (this.is_login) {
				case 0:
					return 'resetPassword';
					break;
				case 1:
					return 'login';
					break;
				case 2:
					return 'register';
					break;

				default:
					break;
			}
		},
	},
	onLoad(e) {
		this.getData();
		let self = this;
		if (e.invitationId) {
			uni.setStorageSync('invitationId', e.invitationId);
		}
		if (e.refereeId) {
			uni.setStorageSync('refereeId', e.refereeId);
		}
    this.areaList = list
    console.log("eeeeee", e)
    if(e.phone || e.email ){
      self._get('user/userOpen/isRegister', e, function (res) {
				console.log("isRegister",res.data)
        if (res.code === 1) { // 成功
          if (res.data === 1) { // 有账号 =》 登录
            self.is_login = 1
            if (e.phone) {
				console.log("1111")
              self.login_type = 1
              self.formData.mobile = e.phone
              self.formData.countryCode = e.countryCode
              const num = self.areaList.findIndex(obj => obj.tel == e.countryCode);
              self.index = num
              return
            } else if (e.email && self.globalGetEmail) {
				console.log("2222")
              self.login_type = 2
              self.formDataEmail.email = e.email
            }
          } else if (res.data === 0) { // 去注册
            self.is_login = 2
            if (e.phone) {
				console.log("3333")
              self.register_type = 1
              self.register.mobile = e.phone
              self.register.countryCode = e.countryCode
              const num = self.areaList.findIndex(obj => obj.tel == e.countryCode);
              self.index = num
              return
            } else if (e.email && self.globalGetEmail) {
				console.log("444")
              self.register_type = 2
              self.registerEmailForm.email = e.email
            }
          }
        }
			});
    }
	},
	onShow() {
		/* if (!self.testEmail(self.registerEmailForm.email)) {
						uni.showToast({
							title: '邮箱有误,请重填！',
							duration: 2000,
							icon: 'none',
						});
						return;
					} */
		// this.$store.dispatch('GetGloablGetEmailSwitch', { _vue: this });
		this.getCodeType();
		this.init();
	},
	methods: {
    bindPickerChange: function(e) {
      console.log('bindPickerChange', e.detail, e)
      this.index = e.detail.value
      this.formData.countryCode = this.areaList[this.index]['tel']
    },
    regPickerChange: function(e) {
      console.log('bindPickerChange', e.detail, e)
      this.index = e.detail.value
      this.register.countryCode = this.areaList[this.index]['tel']
    },
		getCodeType() {
			let self = this;
			self._get('index/loginSetting', {}, (res) => {
				self.sms_open = res.data.smsOpen;
				self.is_code = self.sms_open;
			});
		},
		/*初始化*/
		init() {
			let self = this;
			uni.getSystemInfo({
				success(res) {
					self.phoneHeight = res.windowHeight;
				},
			});
		},
		getData() {
			let self = this;
			self._get('index/policy', {}, function (res) {
				self.service = res.data.service;
				self.privacy = res.data.privacy;
			});
		},
		forgetPassWord() {
			let self = this;
			this.is_login = 0;
			this.$nextTick(() => {
				self.resetpassword = {
					mobile: '',
					password: '',
					repassword: '',
					code: '',
				};
				self.resetEmailPassword = {
					email: '',
					password: '',
					repassword: '',
					code: '',
				};
			});
		},
		/* 改变登录类型 */
		changeLoginType() {
			let self = this;
			if (self.login_type == 1) {
				self.login_type = 2;
				self.is_code = false; //切换登录类型为邮箱时，验证码登录状态重置
				self.formDataEmail = {
					email: '',
					code: '',
				};
				self.loging_password = '';
			} else {
				self.login_type = 1;
				self.formData.email = {
					mobile: '',
					code: '',
				};
				self.loging_password = '';
			}
			self.is_code = false; //切换登录类型为邮箱时，验证码登录状态重置
			self.register_type = 1;
		},
		/* 改变注册类型 */
		changeRegisterType() {
			let self = this;
			if (self.register_type == 1) {
				self.register_type = 2;
				self.formDataEmail = {
					email: '',
					password: '',
					repassword: '',
					code: '',
				};
				self.login_type = 2;
			} else {
				self.register_type = 1;
				self.formDataEmail = {
					mobile: '',
					password: '',
					repassword: '',
					code: '',
				};
				self.login_type = 1;
			}
			self.is_code = false; //切换登录类型为邮箱时，验证码登录状态重置
		},
		/*登录提交*/
		formSubmit() {
			let self = this;
			/* let formdata = {
				mobile: self.formData.mobile,
			}; */
			let formdata =
				self.login_type == 1
					? { mobile: self.formData.mobile, countryCode: self.formData.countryCode  }
					: { email: self.formDataEmail.email };
			let formName = self.login_type == 1 ? 'formData' : 'formDataEmail';
			let url = '';

			if (self.login_type == 1) {
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self[formName].mobile) && formdata.countryCode == '86') {
					console.log(self[formName].mobile);
					uni.showToast({
						title: '手机有误,请重填！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			} else if (self.login_type == 2) {
				if (!self.testEmail(self[formName].email)) {
					uni.showToast({
						title: '邮箱有误,请重填！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			}

			if (self.is_code && self.login_type == 1) {
				if (self[formName].code == '') {
					uni.showToast({
						title: '验证码不能为空！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
				formdata.code = self[formName].code;
				formdata.type = self.switchType;
				//1).手机验证码登录
				url = 'user/userOpen/smslogin';
			} else {
				if (self.loging_password == '') {
					uni.showToast({
						title: '密码不能为空！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
				formdata.password = self.loging_password;
				// url = 'user/userOpen/phoneLogin';

				if (self.login_type == 1) {
					//2).手机密码登录
					url = 'user/userOpen/phoneLogin';
				} else if (self.login_type == 2) {
					//3).邮箱密码登录
					url = 'user/userOpen/emailLogin';
				}
			}

			if (!self.isRead) {
				uni.showToast({
					title: '请同意并勾选协议内容',
					duration: 2000,
					icon: 'none',
				});
				return;
			}

			uni.showLoading({
				title: '正在提交',
			});
			self._post(
				url,
				formdata,
				(result) => {
					// 记录token userId
					uni.setStorageSync('token', result.data.token);
					uni.setStorageSync('userId', result.data.loginUserVo.userId);
					// 获取登录前页面
					let url = '/' + uni.getStorageSync('currentPage');
					let pageOptions = uni.getStorageSync('currentPageOptions');
					if (Object.keys(pageOptions).length > 0) {
						url += '?';
						for (let i in pageOptions) {
							url += i + '=' + pageOptions[i] + '&';
						}
						url = url.substring(0, url.length - 1);
					}

					// 执行回调函数
					self.gotoPage(url);
				},
				false,
				() => {
					uni.hideLoading();
				}
			);
		},
		/*注册提交*/
		registerSub() {
			let self = this;
			let formName = self.register_type == 1 ? 'register' : 'registerEmailForm';
			let url = 'user/userOpen/register';
			/* self.register_type == 1
					? 'user/userOpen/register'
					: 'user/userOpen/register'; */

			if (self.register_type == 1) {
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self[formName].mobile) && self.areaList[self.index]['tel'] == '86') {
					console.log(self[formName].mobile);
					uni.showToast({
						title: '手机有误,请重填！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			} else if (self.register_type == 2) {
				if (!self.testEmail(self[formName].email)) {
					uni.showToast({
						title: '邮箱有误,请重填！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			}

			if (self.register_type == 1) {
				//手机注册&&sms_open的情况下才校验验证码
				if (self[formName].code == '' && self.sms_open) {
					uni.showToast({
						title: '验证码不能为空！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			} else if (self.register_type == 2) {
				//邮箱注册统一校验验证码
				if (self[formName].code == '') {
					uni.showToast({
						title: '验证码不能为空！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			}

			if (self[formName].password.length < 6) {
				uni.showToast({
					title: '密码至少6位数！',
					duration: 2000,
					icon: 'none',
				});
				return;
			}
			if (self[formName].password !== self[formName].repassword) {
				uni.showToast({
					title: '两次密码输入不一致！',
					duration: 2000,
					icon: 'none',
				});
				return;
			}
			if (!self.isRead) {
				uni.showToast({
					title: '请同意并勾选协议内容',
					duration: 2000,
					icon: 'none',
				});
				return;
			}
			self[formName].invitationId = uni.getStorageSync('invitationId')
				? uni.getStorageSync('invitationId')
				: 0;
			self[formName].regSource = 'h5';
			self[formName].refereeId = uni.getStorageSync('refereeId');
			self[formName].type = self.switchType;

			uni.showLoading({
				title: '正在提交',
			});
			self._postBody(
				url,
				self[formName],
				(result) => {
					uni.showToast({
						title: '注册成功',
						duration: 3000,
					});
					self.formData.mobile = self.register.mobile;
					self.formData.countryCode = self.register.countryCode;
					self.register = {
            countryCode: '',
						mobile: '',
						password: '',
						repassword: '',
						code: '',
					};
					self.formDataEmail.email = self.registerEmailForm.email;
					self.registerEmailForm = {
						email: '',
						password: '',
						repassword: '',
						code: '',
					};
					self.second = 0;
					self.changeMsg();
					//注册成功切换回登录界面
					self.loging_password = '';
					self.login_type = self.register_type;
					self.is_login = 1;
					// 注册成功清除refereeId
					uni.removeStorageSync('refereeId');
				},
				false,
				() => {
					uni.hideLoading();
				}
			);
		},
		/* 忘记密码提交 */
		resetpasswordSub() {
			let self = this;
			let formName =
				self.login_type == 1 ? 'resetpassword' : 'resetEmailPassword';
			let url =
				self.login_type == 1
					? 'user/userOpen/resetpassword'
					: 'user/userOpen/emailResetpassword';

			if (self.login_type == 1) {
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self[formName].mobile) && self.areaList[self.index]['tel'] == '86') {
					console.log(self[formName].mobile);
					uni.showToast({
						title: '手机有误,请重填！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			} else if (self.login_type == 2) {
				if (!self.testEmail(self[formName].email)) {
					uni.showToast({
						title: '邮箱有误,请重填！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			}
			if (self[formName].code == '') {
				uni.showToast({
					title: '验证码不能为空！',
					duration: 2000,
					icon: 'none',
				});
				return;
			}
			if (self[formName].password.length < 6) {
				uni.showToast({
					title: '密码至少6位数！',
					duration: 2000,
					icon: 'none',
				});
				return;
			}
			if (self[formName].password !== self[formName].repassword) {
				uni.showToast({
					title: '两次密码输入不一致！',
					duration: 2000,
					icon: 'none',
				});
				return;
			}
			self[formName].type = self.switchType;

			uni.showLoading({
				title: '正在提交',
			});
			self._post(
				url,
				self[formName],
				(result) => {
					uni.showToast({
						title: '重置成功',
						duration: 3000,
					});
					self.formData.mobile = self.resetpassword.mobile;
          self.formData.countryCode = self.resetpassword.countryCode;
					self.resetpassword = {
            countryCode: '',
						mobile: '',
						password: '',
						repassword: '',
						code: '',
					};
					self.formDataEmail.email = self.registerEmailForm.email;
					self.registerEmailForm = {
						email: '',
						password: '',
						repassword: '',
						code: '',
					};
					self.second = 0;
					self.changeMsg();
					self.is_login = 1;
				},
				false,
				() => {
					uni.hideLoading();
				}
			);
		},
		isCode() {
			if (this.is_code) {
				this.is_code = false;
			} else {
				this.is_code = true;
			}

			console.log(this.is_code);
		},
		/*发送短信*/
		sendCode() {
			let self = this;
			if (self.is_login == 1) {
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.formData.mobile) && self.areaList[self.index]['tel'] == '86') {
					uni.showToast({
						title: '手机有误,请重填！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			} else if (self.is_login == 2) {
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.register.mobile)&& self.areaList[self.index]['tel'] == '86') {
					uni.showToast({
						title: '手机有误,请重填！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			} else if (self.is_login == 0) {
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.resetpassword.mobile)&& self.areaList[self.index]['tel'] == '86') {
					uni.showToast({
						title: '手机有误,请重填！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			}

			let type = 'register';
			let mobile = self.register.mobile;
			if (self.is_login == 1) {
				type = 'login';
				mobile = self.formData.mobile;
			} else if (self.is_login == 0) {
				type = 'resetPassword';
				mobile = self.resetpassword.mobile;
			}
      self.is_send = true;
			self._post(
				'user/userOpen/sendCode',
				{
					mobile: mobile,
					countryCode: self.areaList[self.index]['tel'],
					type: type,
				},
				(result) => {
					if (result.code == 1) {
						uni.showToast({
							title: '发送成功',
						});
						self.changeMsg();
					}else{
						self.is_send = false;
          }
				},()=>{
					self.is_send = false;
        }
			);
		},
		/* 发送邮箱验证码 */
		sendEmailCode() {
			let self = this;
			let formName =
				self.is_login == 2
					? 'registerEmailForm'
					: self.is_login == 0
					? 'resetEmailPassword'
					: '';
			let type =
				self.is_login == 2
					? 'registerEmail'
					: self.is_login == 0
					? 'emailResetPassword'
					: '';

			if (self.is_login == 1) {
				//登录无需邮箱验证码
			} else if (self.is_login == 2) {
				//注册
				if (!self.testEmail(self[formName].email)) {
					uni.showToast({
						title: '邮箱有误,请重填！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			} else if (self.is_login == 0) {
				//找回密码
				if (!self.testEmail(self[formName].email)) {
					uni.showToast({
						title: '邮箱有误,请重填！',
						duration: 2000,
						icon: 'none',
					});
					return;
				}
			}
      self.is_send = true;
			self._post(
				'user/userOpen/sendEmailCode',
				{
					email: self[formName].email,
					type: type,
				},
				(result) => {
					if (result.code == 1) {
						uni.showToast({
							title: '发送成功',
						});
						self.changeMsg();
					}else{
						self.is_send = false;
          }
				},()=>{
					self.is_send = false;
        }
			);
		},
		/*改变发送验证码按钮文本*/
		changeMsg() {
			if (this.second > 0) {
				this.send_btn_txt = this.second + '秒';
				this.second--;
				setTimeout(this.changeMsg, 1000);
			} else {
				this.send_btn_txt = '获取验证码';
				this.second = 60;
				this.is_send = false;
			}
		},
		xieyi(type) {
			let url = '';
			if (type == 'service') {
				url = this.service;
			} else {
				url = this.privacy;
			}
			uni.navigateTo({
				url: '/pages/webview/webview?url=' + url,
			});
		},
    logiToReg(type){
      this.is_login = type
      this.index = 0
      if(type == 1 ){ // login_type == 1 ? '使用邮箱登录' : '使用手机号登录' register_type == 1 ? '使用邮箱注册' : '使用手机号注册'
        if( this.register_type == 1 ){
          this.login_type = 1
        }else{
          this.login_type = 2
        }
      } else{
        if( this.login_type == 1 ){ 
          this.register_type = 1
        }else{
          this.register_type = 2
        }
      }
    },
	},
};
</script>

<style lang="scss" scoped>
page {
	background-color: #ffffff;
}

.form-level{
  .flex-aligin{
    .uni-input{
      font-size: 32rpx;
    }
  }
}
.p-30-75 {
	padding: 30rpx 75rpx;
}

.p-0-75 {
	padding: 0 75rpx;
}

.t-r {
	text-align: right;
}

.login-container {
	position: relative;
	background: #ffffff;
}

.login-container input {
	height: 88rpx;
	line-height: 88rpx;
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
	// border: 1rpx solid $dominant-color;
	background-color: #ffffff;
	@include font_color('font_color');
	font-size: 30rpx;
}

.get-code-btn[disabled='true'] {
	// border: 1rpx solid #cccccc;
	@include font_color('gray9');
	background-color: #ffffff;
}

.btns button {
	height: 90rpx;
	line-height: 90rpx;
	font-size: 34rpx;
	border-radius: 45rpx;
	@include background_color('background_color');
	color: #ffffff;
}

.login_topbpx {
	padding: 181rpx 0;
	padding-bottom: 110rpx;
}

.login_tit {
	font-size: 52rpx;
	font-weight: 600;
	margin-bottom: 33rpx;
}

.login_top {
	font-size: 36rpx;
	color: #adafb3;
}

.input_botom {
	border-bottom: 1px solid #f4f4f4;
}
.bottom_nav {
	width: 100%;
	position: absolute;
	bottom: 100rpx;
}
.bottom-box {
	width: 70%;
	margin: 0 auto;
}
.other_tit {
	height: 1rpx;
	background-color: #cacaca;
	width: 100%;
	line-height: 1rpx;
	text-align: center;
}
.weixin_box {
	background-color: #04be01;
	border-radius: 50%;
	width: 80rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
}
.weixin_box .icon-weixin {
	font-size: 40rpx;
	color: #ffffff;
}
// .btns .bg-green{
// 	background-color: #04BE01;
// }
.agreement {
	border-radius: 50%;
	width: 28rpx;
	height: 28rpx;
	border: 2rpx solid;
	@include border_color('border_color');
	background: #fff;
	position: relative;
	margin-right: 10rpx;
	box-sizing: border-box;
}

.agreement.active::after {
	content: '';
	width: 16rpx;
	height: 16rpx;
	@include background_color('background_color');
	border-radius: 50%;
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	margin: auto;
}
.skip {
	position: absolute;
	top: 80rpx;
	right: 30rpx;
	font-size: 28rpx;
	color: #999999;
}

.change_login_type {
	@include font_color('font_color');
	text-align: center;
	text-decoration: underline;
	font-size: 36rpx;
	padding-top: 20rpx;
}
</style>
