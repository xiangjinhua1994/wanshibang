<template>
	<view class="address-form" :data-theme="theme()" :class="theme() || ''">
        <view class="head_top" :style="'height:' + topBarTop() + 'px;'"></view>
        <headTitle title="个人信息"></headTitle>
		<view class=" p-0-30 f30 bg-white" style="margin-top: 80rpx;">
			<view class="bg-white d-b-c border-b info-item avatar">
				<text class="key-name">头像</text>
				<!-- #ifndef MP-WEIXIN -->
				<view class="d-e-c" @click="changeAvatarUrl">
					<view class="info-image"
						><image
							:src="userInfo.avatarUrl || '/static/home/logo1.png'"
							mode=""
						></image
					></view>
					<text class="icon iconfont icon-jiantou" style="color:black"></text>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="d-e-c">
					<view class="info-image">
						<button
							style="padding: 0"
							open-type="chooseAvatar"
							@chooseavatar="onChooseAvatar"
						>
							<image
								:src="userInfo.avatarUrl || '/static/home/logo1.png'"
								mode=""
							></image>
						</button>
					</view>
					<text class="icon iconfont icon-jiantou" style="color:black"></text>
				</view>
				<!-- #endif -->
			</view>
			
			<view class="d-b-c p-30-0 border-b bg-white">
				<text class="key-name">昵称</text>
				<view class="d-e-c" @click="changeName('nickName')">
					<text class="mr20">{{ userInfo.nickName }}</text>
					<text class="icon iconfont icon-jiantou" style="color:black"></text>
				</view>
                <!-- <view class="uni-input-wrapper">
					<input class="uni-input" placeholder="带清除按钮的输入框" :value="inputClearValue" @input="clearInput" />
					<text class="uni-icon" v-if="showClearIcon" @click="clearIcon">&#xe434;</text>
				</view> -->
                <!-- <view class="uni-form-item uni-column">
                    <view class="uni-input-wrapper" style="display: flex;width:100%;flex-direction:row">
                        <input style="width: 654rpx;" class="uni-input" placeholder="请输入昵称" :value="inputClearValue" @input="clearInput" />
                        <icon v-if="inputClearValue"  @click="clearIcon" type="clear" size="26"/>
                    </view>
                </view> -->
			</view>
            <view class="d-b-c p-30-0 border-b bg-white">
				<text class="key-name">性别</text>
				<view class="d-e-c">
					<!-- <text class="mr20">{{ userInfo.nickName }}</text> -->
                    <radio-group name="radio" style="transform:scale(0.8)"  @change="radioChange($event,index)" >
                        <label class="mar10">
                          <radio value="1"   color="#000"  :checked="checked_sex1"/><text>男</text>
                        </label>
                        <label style="margin-left:44rpx;">
                          <radio value="0"   color="#000"  :checked="checked_sex0"/><text>女</text>
                        </label>
                      </radio-group>
				</view>
                
			</view>

			<!-- <view class="d-b-c p-30-0">
				<text class="key-name">手机号码</text>
				<view class="d-e-c">
					<text class="mr20">+ {{ userInfo.countryCode }} {{ userInfo.mobile }}</text>
				</view>
				<view class="d-e-c" v-if="!userInfo.mobile" @click="gotoBind">
					<text class="mr20">未绑定</text>
					<text class="iconfont icon-jiantou"></text>
				</view>
			</view> -->
			<!-- <view class="d-b-c p-30-0" v-if="globalGetEmail && userInfo.email">
				<text class="key-name">邮箱</text>
				<view class="d-e-c" v-if="userInfo.email">
					<text class="mr20">{{ userInfo.email }}</text>
				</view>
				<view class="d-e-c" v-if="!userInfo.email" @click="gotoBindEmial">
					<text class="mr20">未绑定</text>
					<text class="iconfont icon-jiantou"></text>
				</view>
			</view> -->
			<!-- #ifdef APP-PLUS -->
			<!-- <view class="d-b-c p-30-0">
				<text class="key-name">当前版本</text>
				<view class="d-e-c">
					<text class="mr20">{{ versionNo }}</text>
				</view>
			</view> -->
			<!-- #endif -->
			<!-- <view class="setup-btn theme-btn" @tap="logout()">退出登录</view> -->
		</view>
        <!-- <view class="setup-btn" @tap="subName()">保存</view> -->

		<!-- 修改资料 -->
		<Popup
			:show="isPopup"
			type="bottom"
			:width="750"
			:padding="0"
			@hidePopup="hidePopupFunc"
		>
			<form @submit="subName" class="ww100">
				<view class="d-s-s d-c p20 mpservice-wrap">
					<view class="tc f32 fb ww100">修改</view>
					<template
						v-if="
							type == 'mobile' ||
							type == 'nickName' ||
							type == 'user_name' ||
							type == 'email' ||
							type == 'idcard'
						"
					>
						<view class="pop-input d-b-c">
							<!-- #ifdef MP-WEIXIN -->
							<input
								name="newName"
								:type="type == 'nickName' ? 'nickName' : 'text'"
								class="flex-1"
								placeholder="请输入"
								:value="newName"
								@input="changeinput"
							/>
							<!-- #endif -->
							<!-- #ifndef MP-WEIXIN -->
							<input
								:type="type == 'text'"
								name="newName"
								class="flex-1"
								placeholder="请输入"
								:value="newName"
								@input="changeinput"
							/>
							<!-- #endif -->
							<view class="icon-guanbi icon iconfont" @click="clearName"></view>
						</view>
					</template>
					<view class="d-a-c ww100">
						<button class="btn-gray-border" @click="hidePopupFunc">取消</button>
						<button class="theme-btn" form-type="submit">确认</button>
					</view>
				</view>
			</form>
		</Popup>
		<!-- 上传头像 -->
		<Upload v-if="isUpload" :num="1" @getImgs="getImgsFunc"></Upload>
		<uiPopup v-if="confirmBoxOrder" class="uoiuoi">
			<view class="confirm-box">
			  <view class="confirm-box-title"> 是否允许南合国际商城APP“拍摄照片和录制视频“并存储到相册</view>
			  <view class="confirm-box-describe"> </view>
			  <view class="confirm-box-btn" slot="btnBox">
			  <view class="ui-btn btn-more btn-width" @click="closeOrder" style="margin-right: 20rpx;">取消</view>
			  <view class="ui-btn btn-more btn-width btn-black" @click="dectcloseOrder">确定</view>
			  </view>
			</view>
		  </uiPopup>
	</view>
</template>

<script>
import Upload from '@/components/upload/upload.vue';
import Popup from '@/components/uni-popup.vue';
import headTitle from '@/pages/component/headTitle.vue'
import { mapState } from 'vuex';
import UiPopup from '@/pages/component/ui-popup.vue';
export default {
	components: {
		Upload,
		Popup,
        headTitle,
		UiPopup,
	},
	data() {
		return {
			confirmBoxOrder:false,
            checked_sex0:false,
            checked_sex1:false,
            sex:null,
			userInfo: {},
			isUpload: false,
			isPopup: false,
			newName: '',
			type: '',
			version_no: '',
            showClearIcon: false,
            title: 'input',
            focus: false,
            inputValue: '',
            inputClearValue: '',
            changeValue: '',
            showPassword: true
		};
	},
	computed: {
		...mapState(['globalGetEmail']),
	},
	onShow() {
		/*获取个人中心数据*/
		this.getData();
	},
	methods: {
		closeOrder() {
			this.confirmBoxOrder = false
		},
		dectcloseOrder(){
			let self = this;
			this.confirmBoxOrder = false;
			self.isUpload = true;
		},
        radioChange(item){
				console.log(item);
				this.sex= Number(item.detail.value);
                this.updateSex();
		},
        clearInput(event) {
            this.inputClearValue = event.detail.value;
            if (event.detail.value.length > 0) {
                this.showClearIcon = true;
            } else {
                this.showClearIcon = false;
            }
            // if(event.detail.value.length < 0||event.detail.value.length > 16){
            //     uni.showToast({
			// 		title: '手机有误,请重填！',
			// 		duration: 2000,
			// 		icon: '限2-16个字符',
			// 	});
            //     return false;
            // }
        },
        clearIcon() {
            this.inputClearValue = '';
            this.showClearIcon = false;
        },
		onChooseAvatar(e) {
			console.log(e);
			let self = this;
			let params = {};
			params.userId = self.userInfo.userId;
			params.updateType = 'avatarUrl';
			let uploadParams = {
				token: uni.getStorageSync('token'),
				appId: self.getAppId(),
			};
			// 上传文件
			uni.uploadFile({
				url: self.websiteUrl + '/api/front/file/upload/image',
				filePath: e.detail.avatarUrl,
				name: 'iFile',
				formData: uploadParams,
				success: function (res) {
					let result =
						typeof res.data === 'object' ? res.data : JSON.parse(res.data);
					params.updateValue = result.data.filePath;
					self.update(params);
				},
				complete: function () {},
			});
		},
        updateSex() {
            let self = this;
            let params = {};
			params.updateType = 'sex';
			params.updateValue = self.sex;
			// if (self.loading) {
			// 	return;
			// }
			// self.loading = true;
			self._post('user/user/updateInfo', params, function (res) {
                console.log('resssss',res)
                    // uni.showToast({
                    //     title: '修改成功',
                    //     icon: 'none',
                    //     duration: 2000,
                    // });
                // uni.hideLoading();
                self.getData();
			});
		},
		/*获取数据*/
		getData() {
			let self = this;
			uni.showLoading({
				title: '加载中',
			});
			self._get('user/index/setting', {}, function (res) {
				self.userInfo = res.data;
                self.inputClearValue = self.userInfo.nickName;
                if(self.userInfo.gender==0){
                    self.checked_sex0 = true;
                }else if(self.userInfo.gender==1){
                    self.checked_sex1 = true;
                }
                uni.setStorageSync('uerinfo', res.data);
				uni.hideLoading();
				let userList = JSON.parse(JSON.stringify(uni.getStorageSync('userList')));
				if (userList) {
					for(let i = 0;i< userList.length;i++){
						if(userList[i].userId == res.data.userId){
							userList[i].avatarUrl = res.data.avatarUrl;
							userList[i].nickName = res.data.nickName;
							userList[i].mobile = res.data.mobile;
							userList[i].email = res.data.email;
						}
					}
					uni.setStorageSync('userList', userList);
				}
			});
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, function (widgetInfo) {
				self.version_no = widgetInfo.version;
			});
			// #endif
		},
		gotoBind() {
			this.gotoPage('/pages/user/modify-phone/modify-phone');
		},
		gotoBindEmial() {
			this.gotoPage('/pages/user/modify-email/modify-email');
		},
		logout() {
			uni.removeStorageSync('token');
			uni.removeStorageSync('userId');
			this.gotoPage('/pages/index/index');
		},
        save() {
			// uni.removeStorageSync('token');
			// uni.removeStorageSync('userId');
			// this.gotoPage('/pages/index/index');
		},
		changeName(type) {
            console.log(type,'89080');
            this.gotoPage('pages/user/set/editNick')
			// let self = this;
			// if (type == 'mobile') {
			// 	self.oldmobile = self.userInfo.mobile;
			// }
			// self.type = type;
			// self.newName = self.userInfo[type];
			// self.isPopup = true;
		},
		hidePopupFunc() {
			this.newName = '';
			this.isPopup = false;
		},
		changeinput(e) {
			this.newName = e.detail.value;
		},
		clearName() {
			this.newName = '';
		},
		subName(e) {
			let self = this;
            if(self.inputClearValue ==''){
                uni.showToast({
                    title: '昵称不能为空',
                    icon: 'none',
                    duration: 2000,
                });
                return;
            }
			if (self.loading) {
				return;
			}
			let params = {};
			// this.newName = e.detail.value.newName;
            this.newName = this.inputClearValue;
			params.userId = self.userInfo.userId;
			params.updateType = 'nickName';
			params.updateValue = this.newName;
			self.update(params);
		},
		/* 修改头像 */
		changeAvatarUrl() {
			let self = this;
			// self.isUpload = true;
			self.confirmBoxOrder = true
		},
		/*获取上传的图片*/
		getImgsFunc(e) {
			let self = this;
			self.isUpload = false;
			if (e && typeof e != 'undefined') {
				let self = this;
				let params = {};
				params.userId = self.userInfo.userId;
				params.updateType = 'avatarUrl';
				params.updateValue = e[0].filePath;
				self.update(params);
			}
		},
		update(params) {
			let self = this;
			if (self.loading) {
				return;
			}
			uni.showLoading({
				title: '加载中',
			});
			self.loading = true;
			self._post('user/user/updateInfo', params, function (res) {
                    uni.showToast({
                        title: '修改成功',
                        icon: 'none',
                        duration: 2000,
                    });
                		self.loading = false;
						self.isPopup = false;
						uni.hideLoading();
						self.getData();
				// self.showSuccess(
				// 	'修改成功',
				// 	function () {
				// 		self.loading = false;
				// 		self.isPopup = false;
				// 		uni.hideLoading();
				// 		self.getData();
				// 	},
				// 	function (err) {
				// 		uni.hideLoading();
				// 		self.loading = false;
				// 		self.isPopup = false;
				// 	}
				// );
			});
		},
	},
};
</script>

<style lang="scss">
@import '@/common/mixin.scss';
.address-form .key-name {
	width: 200rpx;
}

.address-form .btn-red {
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	box-shadow: 0 8rpx 16rpx 0 rgba(226, 35, 26, 0.6);
}

.setup-btn {
	position: relative;
	top: 200rpx;
	width: 650rpx;
	height: 96rpx;
	line-height: 90rpx;
	border-radius: 90rpx;
	background-color: #000000;
	color: #fff;
	font-size: 30rpx;
	display: flex;
	justify-content: center;
	margin: 0 auto;
}

.info-item.avatar {
	height: 162rpx;
}

.info-image {
	width: 112rpx;
	height: 112rpx;
	border-radius: 10rpx;
	margin-right: 20rpx;

	image {
		width: 112rpx;
		height: 112rpx;
		border-radius: 10rpx;
	}
}

.make-item {
	height: 60rpx;
}

.btn-red.code-btn {
	height: 54rpx;
	line-height: 54rpx;
}

.btn-red.code-btn.issend {
	background: #666666;
	border: none;
	color: #ffffff;
	box-shadow: none;
}

.pop-input {
	width: 100%;
	margin: 26rpx 0;
	box-sizing: border-box;
	border-bottom: 2rpx solid #d9d9d9;
}

.pop-input input {
	width: 100%;
	padding-left: 15rpx;

	font-size: 26rpx;
	color: #333333;
	margin: 16rpx 0;
	text-align: left;
	height: 60rpx;
	line-height: 60rpx;
}

.pop-input .icon.icon-guanbi {
	width: 38rpx;
	height: 38rpx;
	background-color: #999999;
	color: #ffffff;
	font-size: 22rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	opacity: 0.8;
}

.sub-box {
	padding: 40rpx 0;

	.setup-btn {
		width: 686rpx;
		height: 84rpx;
		background: #000;
		border-radius: 6rpx;
		line-height: 84rpx;
		color: #fff;
		font-size: 30rpx;
		display: flex;
		justify-content: center;
		margin: 0 auto;
	}
}
</style>
