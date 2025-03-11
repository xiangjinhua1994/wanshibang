<template>
  <view class="web-login">
    <view class="login" txt="登录" v-if="pageType === 1">
      <view class="head_top head_topClass" :style="'height:' + topBarTop() + 'px;'"></view>
      <headTitle :classLeftType="0" bg="#262626" height="320">
        <view @click="pageSwitch(2)" style="color:#fff">登录</view>
      </headTitle>
      <view class="login-logo">
        <!-- <view class="login-logo-img"><image src="/static/nh.png" mode=""/> </view> -->
        <view class="login-logo-text " style="color:#FF6B4A;font-size: 48rpx;">欢迎登录</view>
      </view>
      <view class="pas-login" v-if="loginType === 2" txt="密码">
        <view class="from-item">
          <picker @change="regPickerChange" :value="index" :range="areaList" range-key="showName" mode=selector>
            <view style="font-size: 28rpx;font-weight:bold;display:flex;" class="uni-input">+{{ areaList[index].tel }} 
              <image class="imgSize" src="/static/polygon.png" mode="" />
            </view>
          </picker>
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="请输入手机号"
            v-model="loginEmail.email" />
        </view>
        <view class="from-item">
          <input :type="loginEmail.showPaw === 'text' ? 'text' : 'password'" class="search-input"
            placeholder-class="f24 gray9" placeholder="请输入密码" v-model="loginEmail.code" />
          <image src="/static/home/login/hide.png" mode="" v-if="loginEmail.showPaw === 'password'"
            @click="loginEmail.showPaw = 'text'" />
          <image src="/static/home/login/show.png" mode="" v-else @click="loginEmail.showPaw = 'password'" />
        </view>
        <view class="ui-btn btn-black btn-more" @click="passwordLogin">
          登录
        </view>
        <view class="remember-box" @click="remeber">
          <image src="/static/home/unselected.png" mode="" v-if="loginEmail.remember" />
          <image src="/static/home/select.png" mode="" v-else />
          <text>记住密码</text>
        </view>
      </view>
      <view class="pas-login" v-else-if="loginType === 1" txt="验证码">
        <view class="from-item">
          <!-- <picker @change="loginPickerChange" :value="index" :range="areaList" range-key="showName" mode=selector>
            <view style="font-size: 28rpx;font-weight:bold;display:flex;" class="uni-input">+{{ areaList[index].tel }} 
              <image class="imgSize" src="/static/polygon.png" mode="" />
            </view>
          </picker> -->
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="请输入手机号/邮箱/用户名"
            v-model="loginSmS.mobile" />
        </view>
        <view class="from-item">
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="请输入密码"
            v-model="loginSmS.code" maxlength="6"  />
          <!-- <text @click="sendCodeVery">{{ send_btn_txt }}</text> -->

        </view>
          <view style="display:flex;justify-content: space-between;"> 
            <view class="remember-box1" @click="remeberEmail">
              <image src="/static/home/unselected.png" mode="" v-if="loginEmailPas.remember" />
              <image src="/static/home/select.png" mode="" v-else />
              <text>记住密码</text>
            </view>
            <view class="remember-box1" @click="remeberEmail">
              <text style="color:#FF6B4A">忘记密码?</text>
              <!-- <image src="/static/home/unselected.png" mode="" v-if="loginEmailPas.remember" />
              <image src="/static/home/select.png" mode="" v-else /> -->
            </view>
          </view>
        <view style="margin-top:48rpx; border:none; background-color: #FF6B4A;color:#fff;font-size: 28rpx;height:48rpx;line-height: 48rpx; border-radius: 24rpx;" class="ui-btn btn-more" @click="smsLogin">
          登录
        </view>
      </view>
      <!-- <view class="pas-login" v-else-if="loginType === 3" txt="邮箱密码">
        <view class="from-item">
         
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="输入邮箱"
            v-model="loginSmS.mobile" />
        </view>
        <view class="from-item">
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="请输入验证码"
            v-model="loginSmS.code" maxlength="6"  />
          <text @click="sendCode">{{ send_btn_txt }}</text>

        </view>
        <view class="ui-btn btn-black btn-more" @click="smsLogin">
          登录
        </view>
      </view> -->
      <view class="pas-login" v-if="loginType === 3" txt="邮箱密码">
        <view class="from-item">
          <!-- <picker @change="regPickerChange" :value="index" :range="areaList" range-key="showName" mode=selector>
            <view class="uni-input">+ {{ areaList[index].tel }} </view>
          </picker> -->
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="请输入邮箱账号"
            v-model="loginEmailPas.email" />
        </view>
        <view class="from-item">
          <input :type="loginEmailPas.showPaw === 'text' ? 'text' : 'password'" class="search-input"
            placeholder-class="f24 gray9" placeholder="请输入密码" v-model="loginEmailPas.code" />
          <image src="/static/home/login/hide.png" mode="" v-if="loginEmailPas.showPaw === 'password'"
            @click="loginEmailPas.showPaw = 'text'" />
          <image src="/static/home/login/show.png" mode="" v-else @click="loginEmailPas.showPaw = 'password'" />
        </view>
        <view class="ui-btn btn-black btn-more" @click="smsLogin">
          登录
        </view>
        <view class="remember-box" @click="remeberEmail">
          <image src="/static/home/unselected.png" mode="" v-if="loginEmailPas.remember" />
          <image src="/static/home/select.png" mode="" v-else />
          <text>记住密码</text>
        </view>
      </view>
      <view class="pas-login" v-else-if="loginType === 4" txt="邮箱验证码">
        <view class="from-item">
          <!-- <picker @change="loginPickerChange" :value="index" :range="areaList" range-key="showName" mode=selector>
            <view class="uni-input">+ {{ areaList[index].tel }} </view>
          </picker> -->
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="请输入邮箱账号"
            v-model="loginSmSEmail.email" />
        </view>
        <view class="from-item">
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="请输入邮箱验证码"
            v-model="loginSmSEmail.code" maxlength="6"  />
          <text @click="sendCodeVery2">{{ send_btn_txt }}</text>

        </view>
        <view class="ui-btn btn-black btn-more" @click="smsLogin">
          登录
        </view>
      </view>
      <view class="otherWay">
        <!-- <text class="borderP mr16"></text> -->
        其他登录方式
        <!-- <text class="borderP ml16"></text> -->
      </view>
      <view style="display: flex;align-items: center;justify-content: center;">

      <view class="login-btm" @click="login_type(1)" v-show="showBtm1">
        <view>
          <image src="/static/home/wx.png" mode="" />
          <view>手机验证码</view>
        </view>
      </view>
      <view class="login-btm" @click="login_type(2)" v-show="showBtm2">
        <view >
          <view style="background-color: #07C160;border-radius: 50%;width: 96rpx;height:96rpx;line-height: 96rpx;justify-content: center;align-items: center;"><image style="width: 44rpx;height: 40rpx;margin-top: 24rpx;" src="/static/home/wx.png" mode="" /></view> 
          <!-- <view>手机密码</view> -->
        </view>
      </view>
      <view class="login-btm" @click="login_type(3)" v-show="showBtm3">
        <view>
          <!-- <image src="/static/home/login/password.png" mode="" /> -->
          <view style="background-color: #12B7F5;border-radius: 50%;width: 96rpx;height:96rpx;line-height: 96rpx;justify-content: center;align-items: center;"><image style="width: 28rpx;height: 40rpx;margin-top: 24rpx;" src="/static/home/mobile.png" mode="" /></view> 
          <!-- <view>邮箱密码</view> -->
        </view>
      </view>
      <view class="login-btm" @click="login_type(4)" v-show="showBtm4">
        <view>
          <!-- <image src="/static/home/login/emailCode.png" mode="" /> -->
          <view style="background-color: #1677FF;border-radius: 50%;width: 96rpx;height:96rpx;line-height: 96rpx;justify-content: center;align-items: center;"><image style="width: 36rpx;height: 40rpx;margin-top: 24rpx;" src="/static/home/zhifubao.png" mode="" /></view> 
          <!-- <view>邮箱验证码</view> -->
        </view>
      </view>
      </view>
      <view @click="isRead = !isRead" class="xieyi-css2">
        <!-- <view :class=" ? 'active agreement' : 'agreement'"></view> -->
        
        <text class="dominant" @click.stop="xieyi('service')">
          还没有账号？</text>
        <text style="color:#FF6B4A" class="dominant" @click.stop="xieyi('privacy')">
          立即注册</text>
      </view>
      <!-- <view class="login-btm" @click="login_type(1)" v-if="loginType === 2">
        <view>
          <image src="/static/home/login/code.png" mode="" />
          <view>邮箱验证码</view>
        </view>
      </view>
      <view class="login-btm" @click="login_type(1)" v-if="loginType === 2">
        <view>
          <image src="/static/home/login/code.png" mode="" />
          <view>邮箱验证码</view>
        </view>
      </view> -->
      <view @click="isRead = !isRead" class="xieyi-css">
        <!-- <view :class=" ? 'active agreement' : 'agreement'"></view> -->
        <!-- <image src="/static/home/unselected.png" mode="" style="margin-right:10rpx" v-if="isRead" />
        <image src="/static/home/select.png" mode=""  v-else style="margin-right:10rpx" />
        已阅读并同意
        <text class="dominant" @click.stop="xieyi('service')">
          《用户协议》</text>和
        <text class="dominant" @click.stop="xieyi('privacy')">
          《隐私政策》</text> -->
      </view>
    </view>
    <view class="login" txt="注册" v-else-if="pageType === 2">
      <view class="head_top" :style="'height:' + topBarTop() + 'px;'"></view>
      <headTitle :classLeftType="0" title="注册账号">
        <view class="left-css" @click="pageSwitch(1)">
          <text class="iconfont iconfont-left icon-right_arrow"></text>
        </view>
      </headTitle>
      <view class="reg-nav-ui" txt="手机-邮箱">
        <view class="reg-nav-box">
          <view class="reg-nav" :class="registerType === 1 ? 'nav-active' : ''" @click="navClass(1)">
            <image src="/static/home/login/phone.png"></image>
            <text class="reg-nav-text">手机号注册</text>
          </view>
            <!-- @click="navClass(2)" -->
          <view class="reg-nav" :class="registerType === 2 ? 'nav-active' : ''" @click="navClass(2)">
            <image src="/static/home/login/email.png"></image>
            <text class="reg-nav-text">邮箱注册</text>

          </view>
        </view>
      </view>
      <view class="pas-login" v-if="registerType === 2" txt="邮箱">
        <view class="from-item">
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="请输入邮箱号"
            v-model="loginEmail.email" />
        </view>
        <view class="from-item" v-show="regEmail.stop === 1">
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="请输入验证码"
            v-model="loginSmS.code"   maxlength="6"   />
          <text @click="sendCode">{{ send_btn_txt }}</text>

        </view>
        <view class="ui-btn btn-black btn-more" v-if="regEmail.stop === 0" @click="emailStop(1)">

          <text v-if="registerType.type == 1">
            获取短信验证码
          </text>
          <text v-else>
            获取邮箱验证码
          </text>
        </view>
        <view class="ui-btn btn-black btn-more" v-if="regEmail.stop === 1" @click="emailStop(2)">
          下一步
        </view>

      </view>
      <view class="pas-login" v-else-if="registerType === 1" txt="手机">
        <view class="from-item">
          <picker @change="regPickerChange" :value="index" :range="areaList" range-key="showName" mode=selector>
            <view class="uni-input" style="display: flex;">+ {{ areaList[index].tel }} <image style="width:10rpx;height:10rpx;position:relative;top:12rpx;left:3rpx" src="/static/polygon.png" mode="" /></view>
          </picker>
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="输入手机号码"
            v-model="loginSmS.mobile" />
        </view>
        <view class="from-item" v-show="regPhone.stop === 1">
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="请输入验证码"
            v-model="loginSmS.code"   maxlength="6"/>
          <text @click="sendCode">{{ send_btn_txt }}</text>
        </view>
        <view class="ui-btn btn-black btn-more" v-if="regPhone.stop === 0" @click="phoneStop(1)">
          获取短信验证码
        </view>
        <view class="ui-btn btn-black btn-more" v-if="regPhone.stop === 1" @click="phoneStop(2)">
          下一步
        </view>
      </view>
      <view @click="isRead2 = !isRead2" class="xieyi-css">
        <!-- <view :class=" ? 'active agreement' : 'agreement'"></view> -->
        <image src="/static/home/unselected.png" mode="" v-if="isRead2" style="margin-right:10rpx"/>
        <image src="/static/home/select.png" mode="" v-else style="margin-right:10rpx" />
        已阅读并同意
        <text class="dominant" @click.stop="xieyi('service')">
          《用户协议》</text>和
        <text class="dominant" @click.stop="xieyi('privacy')">
          《隐私政策》</text>
      </view>
    </view>
    <view class="login" txt="新密码" v-if="pageType === 3">
      <view class="head_top" :style="'height:' + topBarTop() + 'px;'"></view>
      <headTitle :classLeftType="0" title="设置登录密码">
        <view class="left-css" @click="pageSwitch(2)">
          <text class="iconfont iconfont-left icon-right_arrow"></text>
        </view>
      </headTitle>
      <view class="pas-login">
        <view class="set-pas">
          限制6---16个字符,字母或数字组成。
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
            placeholder-class="f24 gray9" placeholder="请再次输入新密码" v-model="set.confirmPas" />
          <image src="/static/home/login/hide.png" mode="" v-if="set.showConfirmPas === 'password'"
            @click="set.showConfirmPas = 'text'" />
          <image src="/static/home/login/show.png" mode="" v-else @click="set.showConfirmPas = 'password'" />
        </view>
        <view class="from-item">
          <text class="item-lable">邀请码 </text>
          <input type="text" class="search-input" placeholder-class="f24 gray9" placeholder="请输入邀请码(选填)"
            v-model="set.inviteId" />
        </view>
        <view class="ui-btn btn-black btn-more" @click="passwordLogin">
          确认提交
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
    <uiPopup v-if="confirmBoxDel" txt="未注册提示">
      <view class="confirm-box">
        <view class="confirm-box-title"> 该手机号未注册,请问是否注册？ </view>
        <view class="confirm-box-btn-between">
          <view class="ui-btn btn-more btn-width" @click="closeDel">取消</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="regiter">注册</view>
        </view>
      </view>
    </uiPopup>
  </view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue'
import UiPopup from '@/pages/component/ui-popup.vue';
import { list } from '@/static/data/area.json';
import Verify from "@/pages/verify/verify";
import { mapState } from 'vuex';
export default {
  components: {
    headTitle,
    UiPopup,
    Verify
  },
  data() {
    return {
      captchaVerification:'',
      index: 0, // 区号索引
      areaList: [],
      pageType: 1, // 0-找回密码 1-登录 2-注册 3-设置新密码
      smsOpen: false, // 是否开启短信验证
      loginType: 1, // 登录类型 1-验证码登录 2-密码登录
      registerType: 1, // 注册类型 1-手机号注册 2-邮箱注册
      type: "",    //类型(login:登录、register:注册、resetPassword:重置密码、userUpdateMobile: 用户修改手机号码、用户修userOldMobile：改手机号码旧号码校
      loginSmS: { // 验证码登录
        countryCode: '86',
        mobile: '', /* 手机号 */
        code: '', /* 验证码 */
      },
      loginSmSEmail:{// 邮箱验证码登录
        email:'',
        code: '', /* 验证码 */
      },
      loginEmailPas: { //  邮箱密码登录
        email: '', /*邮箱*/
        code: '', /*验证码*/
        showPaw: 'password', // 显示密码
        remember: true, // 记住密码
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
      isRead2: true, // 协议
      second: 60,
      is_send: false,
      send_btn_txt: '获取验证码',
      confirmBoxDel: false,
      timerId: null, //计时器
      service:'https://nanheshop.com/index.php/sample-page/',
      privacy:'https://nanheshop.com/index.php/privacy-policy/',
      showBtm1:false,
      showBtm2:true,
      showBtm3:true,
      showBtm4:true,
    }
  },
  computed: {




  },
  onLoad(e) {
      //  if(!this.loginEmail.remember){

      //   const userpasswold= uni.getStorageSync('loginpassword');
      //   console.log(userpasswold)

      //  }








    // 
    console.log(e)
    console.log("页面首次加载")

    let self = this;
    this.areaList = list
    console.log("eeeeee", e)
    if (e.phone || e.email) {
      self._get('user/userOpen/isRegister', e, function (res) {
        console.log("isRegister", res.data)
        if (res.code === 1) { // 成功
          if (res.data === 1) { // 有账号 =》 登录
            self.pageType = 1
            if (e.phone) {
              console.log("1111")
              self.login_type = 1
              self.loginSmS.mobile = e.phone
              self.loginSmS.countryCode = e.countryCode
              const num = self.areaList.findIndex(obj => obj.tel == e.countryCode);
              self.index = num
              return
            } else if (e.email && self.globalGetEmail) {
              console.log("2222")
              self.login_type = 2
              self.formDataEmail.email = e.email
            }
          } else if (res.data === 0) { // 去注册
            self.pageType = 2
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
    this.getCodeType();
    this.init();
    this.getUserInfo()
  },
  methods: {
    async success(params){
      let self = this;
      console.log(this.loginType,'params89898this.loginType')
      this.captchaVerification = params.captchaVerification;
      if(this.pageType==1&&this.loginType == 1){
        this.sendCode();
      }else if(this.pageType==1&&this.loginType == 4) {
        this.sendCode2();
      }else if(this.pageType==2&&this.registerType==1){
        let parms = {
          mobile: self.loginSmS.mobile,
          captchaVerification:self.captchaVerification,
          type: "register",
          countryCode: self.regPhone.countryCode,
        }

          console.log("电话号码注册了， 就直接返回登录")
          const res = await self.sendphonecode(parms)
          // console.log("电话号码注册了， 就直接返回登录")
          self.regPhone.stop = 1


      }else if(this.pageType==2&&this.registerType==2){
        let parms = {
          email: self.loginEmail.email,
          type: "registerEmail",
          captchaVerification:self.captchaVerification,
        }
        self.regEmail.stop = 1
        this.changeMsg();
        //   self.pageType = 1
        const getemail = await self.sendemailcode(parms)


      }

      console.log(params,'params89898')
		  // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
        },
        useVerify(){
          console.log(this.$refs.verify,'this.$refs.verify')
          
            this.$refs.verify.show()
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
    }
    ,

    remeberEmail() { // 记住密码
      console.log(this.loginEmailPas.remember)
      this.loginEmailPas.remember = !this.loginEmailPas.remember
      let parms ={
           email:this.loginEmailPas.email,
           code:this.loginEmailPas.code,
      }
      if(!this.loginEmailPas.remember&&this.loginEmailPas.email !==""&&this.loginEmailPas.code !==""){
         uni.setStorageSync('loginpassword', parms)
        // console.log(parms)
      } else{
        uni.removeStorageSync('loginpassword')
      }    
    },
    remeber() { // 记住密码
      console.log(this.loginEmail.remember)
      this.loginEmail.remember = !this.loginEmail.remember
      let parms ={
           email:this.loginEmail.email,
           code:this.loginEmail.code,
      }
      if(!this.loginEmail.remember&&this.loginEmail.email !==""&&this.loginEmail.code !==""){
         uni.setStorageSync('loginpassword', parms)
        // console.log(parms)
      } else{
        uni.removeStorageSync('loginpassword')
      }    
    },


    getUserInfo() {
      // 获取缓存中的用户信息
      const userpasswold= uni.getStorageSync('loginpassword');
      
      if(userpasswold) {
        // 成功获取到信息，可以进行后续处理
        console.log(userpasswold);
        this.loginEmail.remember = false
        this.loginEmail.email =userpasswold.email
        this.loginEmail.code = userpasswold.code

      } else {
        // 缓存中没有找到用户信息
        console.log("未找到用户信息");
      }
    },


    navClass(num) { // 注册--手机/邮箱
      console.log(num)
      //email:self.regEmail.email,
      // mobile: self.loginSmS.mobile,
      this.registerType = num;
      if (num == 1) { // 置空一下， 要不然邮箱或者电话都填写了， 后台接口是一个， 没有type分类型
        this.loginEmail.email = ""
      } else {
        this.loginSmS.mobile = ""
      }
      //self.loginSmS.mobile
    },
    passwordLogin() { // 设置登录密码
      let self = this;
      console.log(self.pageType)
      console.log(self.loginType)
      // 注册码时候设置密码 && self.pageType ==3  设置密码页面 /   不需要验证用户协议
      if (self.pageType == 3) {

        if (self.set.newPas.length < 6) {
          uni.showToast({
            title: '密码至少6位数！0',
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
     // registerType: 1, // 注册类型 1-手机号注册 2-邮箱注册
    


        let parms = {
          code:self.loginSmS.code,
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
        

        console.log(parms)
        self._postBody("user/userOpen/register", parms, function (res) {
          console.log("注册新用户")
          console.log(res)
          if (res.code === 1) {
            uni.showToast({
              title: res.msg,
              duration: 2000,
              icon: 'none',
            });
            self.pageType = 1
            self.loginSmS.code = "" // 进首页，把验证码置空
            self.stopCountdown();
            self.send_btn_txt = '获取验证码';
          } else {
            // uni.showToast({
            //           title:"00000",
            //           duration: 2000,
            //           icon: 'none',
            //         });
          }
        })
      } else if (self.pageType == 1) { // 账号密码登录 //需要验证用户协议
        let parms = {
          mobile: self.loginEmail.email,
          password: self.loginEmail.code,
          countryCode: self.regPhone.countryCode,

        }
        console.log("密码登录")
        console.log(parms)


        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.loginEmail.email) && self.regPhone.countryCode == '86') {
          //console.log(self.loginSmS.mobile);
          uni.showToast({
            title: '手机有误,请重填！',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
        if (self.loginEmail.code == "") {
          uni.showToast({
            title: '请输入密码！',
            duration: 2000,
            icon: 'none',
          });
        }
        if (self.isRead) {// 判断是否阅读接受
          uni.showToast({
            title: '需要阅读并同意《用户协议》和《隐私政策》',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
        //密码登录
        self._post("user/userOpen/phoneLogin", parms, (res) => {
          console.log("密码登录")
          console.log(res)
          if (res.code == 1) {
            uni.setStorageSync('token', res.data.token);
           // self.getuserinfo();
            uni.setStorageSync('userId', res.data.loginUserVo.userId);
            res.data.loginUserVo.token = res.data.token;
            console.log(uni.getStorageSync('userList'),'opopo890809')
            let newList = JSON.parse(JSON.stringify( uni.getStorageSync('userList')));
            let newArr = []
            if(newList.length>0){
              for(let i=0;i<newList.length;i++){
                console.log(uni.getStorageSync('userList'),newList[i],'587567',res.data.loginUserVo.userId,'587567')
                if(newList[i].userId != res.data.loginUserVo.userId){
                  console.log(newList,'不同userid新增')
                  newArr.push(newList[i])
                  
                }
              }
            if (newArr.indexOf(res.data.loginUserVo) === -1) {
              newArr.push(res.data.loginUserVo); // 如果新值不存在，添加新值
            }
              uni.setStorageSync('userList', newArr);
            }else{
              console.log('新增opopo890809')
              uni.setStorageSync('userList', [res.data.loginUserVo])
            }
            console.log(newList,'不同u9s新增')
            let url = '/pages/index/index';
            self.gotoPage(url);
          }
        })
        console.log("密码登录")
        console.log(parms)
      }
  
    },

  // 登录后， 获取用户信息， 渲染



    closeDel() {
      this.confirmBoxDel = false
    },


    async phoneStop(num) { // 注册手机-第几步 获取验证 // 
      let self = this;
      if (self.registerType == 1) {// 判断注册时候电话
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.loginSmS.mobile) && self.regPhone.countryCode == '86') {
          //console.log(self.loginSmS.mobile);
          uni.showToast({
            title: '手机有误,请重填！',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
      }
      if (self.isRead2) {// 判断是否阅读接受
        uni.showToast({
          title: '需要阅读并同意《用户协议》和《隐私政策》',
          duration: 2000,
          icon: 'none',
        });
        return;
      }
      console.log("第几步shouji")
      console.log(num)
      // self.loginSmS.code=""
      //  上面通过了， 就显示第二步的按钮图
      if (num === 1) { //// 获取验证码， 前面两步通过 获取验证码
       
       this.useVerify();
        // self.loginSmS.code=""
        // //self.regPhone.countryCode=""
        // console.log("第一步shouji")
        // console.log(num)
        // let parms = {
        //   mobile: self.loginSmS.mobile,
        //   captchaVerification:self.captchaVerification,
        //   type: "register",
        //   countryCode: self.regPhone.countryCode,
        // }

        // if (self.pageType == 2) {
        //   console.log("电话号码注册了， 就直接返回登录")
        //   const res = await self.sendphonecode(parms)
        //   // console.log("电话号码注册了， 就直接返回登录")
         
        //   if (res) {
        //     self.regPhone.stop = num
        //   } else {  // 电话号码注册过， 有可能， 直接去登录页面
        //     //self.regPhone.stop =1
        //     // 

        //   }

        // }

        //  if(res){
        //      this.changeMsg();
        //  }
      } else if (num == 2) { // 点击下一步// 获取验证码// 现判断验证码不为空， 然后再提交

        console.log(self.loginSmS.code)
        if (self.loginSmS.code == "") {
          uni.showToast({
            title: '验证码有误',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
        let parms = {
          mobile: self.loginSmS.mobile,
          type: "register",
          countryCode: self.regPhone.countryCode,
          code: self.loginSmS.code,
        }
        const res = await self.Verificationcode(parms)
        console.log(res)
        if (res) {
          self.pageType = 3   // 进入设置密码页面
          console.log(res)
          //  self.regPhone.stop = num 
        } else {

          self.pageType = 2   // 失败留在当前页
        }



        //  console.log("YANZHENG" + fesult)

        // if(fesult){ // 通过
        //      self.pageType = 3
        // }else{

        //    return
        // }
        // console.log(self.loginSmS.code)
        // console.log("dierbu")
        // this.pageType = 3



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


    async sendphonecode(parms) {  // 发送验证码封装
      let self = this
      const result = await self._postreturn('user/userOpen/sendCode', parms,)
      //debugger
      if (result.code == 1) {
        uni.showToast({
          title: result.msg,
          duration: 2000,
          icon: 'none',
        });
        this.$refs.verify.hideVerify();
        self.changeMsg();
        return true
      } else {
        uni.showToast({
          title: result.msg,
          duration: 2000,
          icon: 'none',
        });

        self.pageType = 1
        return false
      }
    },
    async sendemailcode(parms) { // 邮箱验证码封装
      let self = this
      const res = await self._postreturn("user/userOpen/sendEmailCode", parms,)
      if (res.code == 1) {
        this.$refs.verify.hideVerify();
        uni.showToast({
          title: res.msg,
          duration: 2000,
          icon: 'none',
        });
        return true;
      } else {
        uni.showToast({
          title: res.msg,
          duration: 2000,
          icon: 'none',
        });
        return false;
      }
    },
    async emailStop(num) { // 注册邮箱-第几步
      console.log(num)
      let self = this;
      if (self.registerType == 2) {  // 判断邮箱
        console.log(self.loginEmail.email)
        if (!self.testEmail(self.loginEmail.email)) {
          uni.showToast({
            title: '邮箱有误,请重填！',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
      }
      if (self.isRead2) {// 判断是否阅读接受
        uni.showToast({
          title: '需要阅读并同意《用户协议》和《隐私政策》',
          duration: 2000,
          icon: 'none',
        });
        return;
      }
      if (num === 1) { // 邮箱注册第一步获取邮箱信息
        this.useVerify();

        // let parms = {
        //   email: self.loginEmail.email,
        //   type: "registerEmail",

        // }
        // self.regEmail.stop = 1
        // this.changeMsg();
        // //   self.pageType = 1
        // const getemail = await self.sendemailcode(parms)
        // this.changeMsg();
      } else if (num === 2) { // 进去下一步， 判断邮箱和验证码是否通过
        if (self.loginSmS.code.length !== 6) {
          uni.showToast({
            title: '验证码有误',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
        let parms = {   // 邮箱验证码验证
          type: "registerEmail",
          email: self.loginEmail.email,
          code: self.loginSmS.code,
        }
        const res = await self.Verificationcode(parms) // 验证码通过
        //console.log(res)
        if (res) {// 验证通过
          self.pageType = 3
        }
        //  if(self.loginEmail.email)
        // this.pageType = 3
      }
    },
    async sendCode2() { // 发送邮箱验证码  //  登录的yanzheng
      let self = this
      let parms = {
        email: self.loginSmSEmail.email,
        captchaVerification:self.captchaVerification,
        type: "login",
      }
      console.log(parms)
      // const res = await self.sendphonecode(parms)
      const getemail = await self.sendemailcode(parms);
      self.changeMsg();

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
    async sendCode() { // 发送验证码  //  登录的yanzheng
      let self = this
      let parms = {
        mobile: self.loginSmS.mobile,
        type: "login",
        captchaVerification:self.captchaVerification,
        countryCode: self.loginSmS.countryCode
      }
      console.log(parms)
      const res = await self.sendphonecode(parms)
    },
    async smsLogin() {//  首页验证码登录
      let self = this;
      if (self.isRead) {// 判断是否阅读接受
        uni.showToast({
          title: '需要阅读并同意《用户协议》和《隐私政策》',
          duration: 2000,
          icon: 'none',
        });
        return;
      }
      if (self.loginType == 1) {
        if (self.loginSmS.mobile == "") {
          uni.showToast({
            title: '请输入手机号',
            duration: 2000,
            icon: 'none',
          });
          return;
        }
        if (self.loginSmS.code === "") {
          uni.showToast({
            title: '请输入验证码',
            duration: 2000,
            icon: 'none',
          });

        }
        let parms = { // 验证码登录 , 登录前先验证一下
          mobile: self.loginSmS.mobile,
          countryCode: self.loginSmS.countryCode,
          code: self.loginSmS.code,
          // type:"login",  
        }
        //  const res = await self.Verificationcode(parms)
        //  console.log(res)
        self._post("user/userOpen/smslogin", parms, (res) => {
          console.log("登录返回")
          console.log(res)
          if (res.code == 1) {  //  跳转登录成功
            // 记录token userId
            uni.setStorageSync('token', res.data.token);
            uni.setStorageSync('userId', res.data.loginUserVo.userId);
            res.data.loginUserVo.token = res.data.token;
            console.log(uni.getStorageSync('userList'),'opopo890809')
            let newList = JSON.parse(JSON.stringify( uni.getStorageSync('userList')));
            let newArr = []
            if(newList.length>0){
              for(let i=0;i<newList.length;i++){
                console.log(uni.getStorageSync('userList'),newList[i],'587567',res.data.loginUserVo.userId,'587567')
                if(newList[i].userId != res.data.loginUserVo.userId){
                  console.log(newList,'不同userid新增')
                  newArr.push(newList[i])
                  
                }
              }
            if (newArr.indexOf(res.data.loginUserVo) === -1) {
              newArr.push(res.data.loginUserVo); // 如果新值不存在，添加新值
            }
              uni.setStorageSync('userList', newArr);
            }else{
              console.log('新增opopo890809')
              uni.setStorageSync('userList', [res.data.loginUserVo])
            }
            console.log(newList,'不同u9s新增')
            
            //uni.setStorageSync('userList', [res.data.loginUserVo]);

            let url = '/pages/index/index';
            self.gotoPage(url);
            //this.confirmBoxDel = true
          } else if (res.errCode == 101) {  // 新用户没有注册

            self.confirmBoxDel = true

          } else { // 其他报错类型
            uni.showToast({
              title: res.msg,
              duration: 2000,
              icon: 'none',
            });

          }

        })




      }
      if (self.loginType == 3) {
        if (!self.testEmail(self.loginEmailPas.email)) {
          uni.showToast({
            title: '邮箱有误,请重填！',
            duration: 2000,
            icon: 'none',
          });
          return;
        };
        let parms = { // 验证码登录 , 登录前先验证一下
          email: self.loginEmailPas.email,
          // countryCode: self.loginSmS.countryCode,
          password: self.loginEmailPas.code,
          // type:"login",  
        }
        self._post("user/userOpen/emailLogin", parms, (res) => {
          console.log("登录返回")
          console.log(res)
          if (res.code == 1) {  //  跳转登录成功
            // 记录token userId
            uni.setStorageSync('token', res.data.token);
            uni.setStorageSync('userId', res.data.loginUserVo.userId);
            res.data.loginUserVo.token = res.data.token;
            console.log(uni.getStorageSync('userList'),'opopo890809')
            let newList = JSON.parse(JSON.stringify( uni.getStorageSync('userList')));
            let newArr = []
            if(newList.length>0){
              for(let i=0;i<newList.length;i++){
                console.log(uni.getStorageSync('userList'),newList[i],'587567',res.data.loginUserVo.userId,'587567')
                if(newList[i].userId != res.data.loginUserVo.userId){
                  console.log(newList,'不同userid新增')
                  newArr.push(newList[i])
                  
                }
              }
            if (newArr.indexOf(res.data.loginUserVo) === -1) {
              newArr.push(res.data.loginUserVo); // 如果新值不存在，添加新值
            }
              uni.setStorageSync('userList', newArr);
            }else{
              console.log('新增opopo890809')
              uni.setStorageSync('userList', [res.data.loginUserVo])
            }
            console.log(newList,'不同u9s新增')
            let url = '/pages/index/index';
            self.gotoPage(url);
            //this.confirmBoxDel = true
          } else if (res.errCode == 101) {  // 新用户没有注册

            self.confirmBoxDel = true

          } else { // 其他报错类型
            uni.showToast({
              title: res.msg,
              duration: 2000,
              icon: 'none',
            });

          }

        })
      };
      if (self.loginType == 4) {
        if (!self.testEmail(self.loginSmSEmail.email)) {
          uni.showToast({
            title: '邮箱有误,请重填！',
            duration: 2000,
            icon: 'none',
          });
          return;
        };
        let parms = { // 验证码登录 , 登录前先验证一下
          email: self.loginSmSEmail.email,
          // countryCode: self.loginSmS.countryCode,
          code: self.loginSmSEmail.code,
          // type:"login",  
        }
        self._post("user/userOpen/emailLoginByCode", parms, (res) => {
          console.log("登录返回")
          console.log(res)
          if (res.code == 1) {  //  跳转登录成功
            // 记录token userId
            uni.setStorageSync('token', res.data.token);
            uni.setStorageSync('userId', res.data.loginUserVo.userId);
            res.data.loginUserVo.token = res.data.token;
            console.log(uni.getStorageSync('userList'),'opopo890809')
            let newList = JSON.parse(JSON.stringify( uni.getStorageSync('userList')));
            let newArr = []
            if(newList.length>0){
              for(let i=0;i<newList.length;i++){
                console.log(uni.getStorageSync('userList'),newList[i],'587567',res.data.loginUserVo.userId,'587567')
                if(newList[i].userId != res.data.loginUserVo.userId){
                  console.log(newList,'不同userid新增')
                  newArr.push(newList[i])
                  
                }
              }
            if (newArr.indexOf(res.data.loginUserVo) === -1) {
              newArr.push(res.data.loginUserVo); // 如果新值不存在，添加新值
            }
              uni.setStorageSync('userList', newArr);
            }else{
              console.log('新增opopo890809')
              uni.setStorageSync('userList', [res.data.loginUserVo])
            }
            console.log(newList,'不同u9s新增')
            let url = '/pages/index/index';
            self.gotoPage(url);
            //this.confirmBoxDel = true
          } else if (res.errCode == 101) {  // 新用户没有注册

            self.confirmBoxDel = true

          } else { // 其他报错类型
            uni.showToast({
              title: res.msg,
              duration: 2000,
              icon: 'none',
            });

          }

        })
      };


      //  console.log(parms)

      // let parmspassword =  { // 密码登录
      //          countryCode:self.regPhone.countryCode,
      //          mobile:self.loginSmS.mobile,
      //          password:self.loginEmail.code

      // }

      console.log("登录")






      //this.confirmBoxDel = true
    },

    regiter() {// 检测没有注册， 就跳转到注册页面其实就是隐藏， 没有路由 进注册
      this.pageType = 2
      this.confirmBoxDel = false
    },

    // 停止计时器
    stopCountdown() {
      console.log("清空计时器")
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
    },

    changeMsg() { // 倒计时

      if (this.second > 0) {
        this.timerId = setTimeout(this.changeMsg, 1000);
        this.send_btn_txt = this.second + 'S';
        this.second--;

      } else {
        this.send_btn_txt = '获取验证码';
        this.second = 60;
        this.is_send = false;
      }
    },
    pageSwitch(num) {
      this.pageType = num
      if (num === 2) {
        this.regPhone.stop = 0
        this.regEmail.stop = 0
      }
    },
    login_type(num) {
      this.loginType = num
      this.showBtm1 = true;
      this.showBtm2 = true;
      this.showBtm3 = true;
      this.showBtm4 = true;
      if(num==1){
        this.showBtm1 = false;
      }else if(num==2){
        this.showBtm2 = false;
      }else if(num==3){
        this.showBtm3 = false;
      }else if(num==4){
        this.showBtm4 = false;
      }
    },
    loginPickerChange: function (e) {
      console.log('bindPickerChange', e.detail, e)
      this.index = e.detail.value
      this.loginSmS.countryCode = this.areaList[this.index]['tel']
    },
    regPickerChange: function (e) {
      console.log('bindPickerChange', e.detail, e)
      this.index = e.detail.value
      this.regPhone.countryCode = this.areaList[this.index]['tel']
    },
    getCodeType() {
      let self = this;
      // self._get('index/loginSetting', {}, (res) => {
      //   self.smsOpen = res.data.smsOpen;
      // });
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
  },
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.head_topClass{
  height: 300rpx;
}
.otherWay{
  font-family: Hiragino Sans GB, Hiragino Sans GB;
  font-weight: normal;
  font-size: 24rpx;
  color: #8E8E8E;
  line-height: 24rpx;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin-top: 0rpx;
.borderP{
  display: inline-block;
  width: 128rpx;
  height: 10rpx;
  border-radius: 0rpx 0rpx 0rpx 0rpx;
  border-top: 1rpx solid #8E8E8E;
  position: relative;
  top: 3rpx;
}
.ml16{
  margin-left: 16rpx;
}
}
.web-login {
  min-height: 100vh;
  background: #fff;

  .btn-more {
    margin-left: 0;
  }
  .imgSize{
    width: 10rpx !important;
    height: 10rpx !important;
    position: relative;
    top: 12rpx;
    left: 6rpx;

  }

  .right-css {
    position: absolute;
    top: 0rpx;
    right: 20rpx;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 24rpx;
    color: #000000;
    font-style: normal;
    text-transform: none;
  }

  .left-css {
    position: absolute;
    top: 0rpx;
    left: 20rpx;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 24rpx;
    color: #000000;
    font-style: normal;
    text-transform: none;

    .iconfont {
      color: #000000;
    }
  }

  .reg-nav-ui {
    padding: 90rpx;
    padding-bottom: 0
  }

  .xieyi-css {
    @include fl-center;
    padding-top: 40rpx;
    width: 750rpx;
    position: fixed;
    bottom: 38rpx;

    image {
      @include area(24rpx, 24rpx);
      margin-right: 20rpx;
    }

    .dominant {
      color: rgb(51,99,176);
      font-weight: normal;
      font-size: 24rpx;
    }
  }
  .xieyi-css2 {
    @include fl-center;
    padding-top: 40rpx;
    width: 750rpx;
    bottom: 38rpx;

    image {
      @include area(24rpx, 24rpx);
      margin-right: 20rpx;
    }

    .dominant {
      color: #6B7280;
      font-weight: normal;
      font-size: 28rpx;
    }
  }
}

.login-logo {
  padding-top: 284rpx;
  padding-left: 80rpx;
  padding-bottom: 20rpx;

  .login-logo-img {
    font-family: Arial Black, Arial Black;
    font-weight: 400;
    font-size: 88rpx;
    color: #000000;
    text-align: center;
    font-style: normal;
    text-transform: none;
    align-items: center;
    display: flex;
    /* 水平垂直居中 */
    justify-content: center;
    align-items: center;
    image{
      width: 293rpx;
      height: 198rpx;
      align-items: center;
      //border: 1rpx solid red;
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
  padding: 56rpx 76rpx 48rpx 76rpx;

  .from-item {
    margin-bottom: 40rpx;
    @include fl-between;
    flex: 1;
    border: 1rpx #F7F8FA solid;
    background-color: #F7F8FA;
    border-radius: 8rpx;
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
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 20rpx;
    right: 80rpx;

    image {
      width: 30rpx;
      height: 30rpx;
    }

    text {
      margin-left: 10rpx;
    }
  }
  .remember-box1 {
    // position: absolute;
    padding-top: 20rpx;
    right: 80rpx;

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

.login-btm {
  @include fl-center;
  margin-top: 48rpx;
  margin-right:60rpx;
  position: relative;
  left:40rpx;

  image {
    @include area(72rpx, 72rpx);
    margin: 0 auto;
    margin-bottom: 10rpx;
  }

  view {
    text-align: center;
    color: #8E8E8E;
  }
}

.reg-nav-box {
  width: 500rpx;
  margin: 0 auto;
  // white-space: nowrap;
  padding-top: 12rpx;
  padding-bottom: 20rpx;
  @include fl-center;

  .reg-nav {
    display: flex;
    align-items: center;
    flex: 1;
    text-align: center;
    // padding: 14rpx 30rpx 0rpx 30rpx;
    // display: inline-block;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 24rpx;
    color: #252525;
    .reg-nav-text{
      // line-height: 36rpx;
      &:after {
        content: '';
        display: block;
        width: 50px;
        border-bottom: 4rpx solid #fff;
        margin: 0 auto;
        margin-top: 12rpx;
        margin-bottom: -18rpx;
      }
    }
    &.nav-active {
      // background-color: #fff;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: bold;
      font-size: 28rpx;
      color: #000000;
      // border-radius: 16rpx 16rpx 0 0;
      // padding-bottom: 12rpx;

      text {
        &:after {
          content: '';
          display: block;
          width: 50px;
          border-bottom: 4rpx solid #252525;
          margin: 0 auto;
          margin-top: 12rpx;
          margin-bottom: -18rpx;
        }
      }
    }

    image {
      @include area(30rpx, 30rpx);
      margin-right: 10rpx;
    }
  }
}
</style>
