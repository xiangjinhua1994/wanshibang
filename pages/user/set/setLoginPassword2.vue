<template>
	<view class="set">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle title="修改手机密码"></headTitle>
    <view class="set-detail">
      <!-- <view class="set-item" txt="属性">
        <view class="form-level d-s-c">
            <view class="val flex-1 input_botom"><input type="text"
                     password="true"
                     v-model="register.password"
                     placeholder="请输入密码" /></view>
          </view>
          <view class="form-level d-s-c">
            <view class="val flex-1 input_botom"><input type="text"
                     password="true"
                     v-model="register.repassword"
                     placeholder="请确认密码" /></view>
          </view> -->
          
        <!-- <view class="set-attr" @click="jumpPage('/pages/user/set/payment/paymentPasw')">
          <text class="set-attr-key">设置支付密码</text>
          <view class="set-attr-val" >
            <text class="iconfont icon-you"></text>
          </view>
        </view>
        <view class="set-attr" @click="jumpPage('/pages/user/set/payment/modifyPas')">
          <text class="set-attr-key">修改支付密码</text>
          <view class="set-attr-val" >
            <text class="iconfont icon-you"></text>
          </view>
        </view>
        <view class="set-attr" @click="jumpPage('/pages/user/set/payment/retrievePas')">
          <text class="set-attr-key">找回支付密码</text>
          <view class="set-attr-val" >
            <text class="iconfont icon-you"></text>
          </view>
        </view> -->
        
      <!-- </view> -->
      <view class="pas-login">
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
    

	</view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue'
export default {
	components: {
		headTitle,
	},
	data() {
		return {
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
    init(){
    },
    jumpPage(path) { /*跳转页面*/
			this.gotoPage(path);
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.set {
  background: #fff;
  min-height: 100vh;
  .set-detail {
    .pas-login {
        padding: 76rpx;
      
        .from-item {
          margin-bottom: 40rpx;
          @include fl-between;
          flex: 1;
          border: 1rpx solid #F7F8FA;
          background-color: #F7F8FA;
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
  }
}
.set-item {
  background: #FFFFFF;
  border-radius: 28rpx;
  margin: 16rpx 28rpx 40rpx 28rpx;
  padding: 20rpx 32rpx ;


  
}
</style>
