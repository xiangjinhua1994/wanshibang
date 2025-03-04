<template>
	<view class="address-form" :data-theme="theme()" :class="theme() || ''">
        <view class="head_top" :style="'height:' + topBarTop() + 'px;'"></view>
        <headTitle title="修改昵称"></headTitle>
		<view class=" p-0-30 f30" style="margin-top: 80rpx;">
			<view class="d-b-c p-30-0 border-b bg-white" style="border-radius:28rpx;">
                <view class="uni-form-item uni-column" >
                    <view class="uni-input-wrapper" style="display: flex;width:80%;flex-direction:row;padding-left:38rpx;">
                        <input style="width: 654rpx;" class="uni-input" placeholder="请输入昵称" :value="inputClearValue" @input="clearInput" />
                        <icon v-if="inputClearValue"  @click="clearIcon" type="clear" size="26"/>
                    </view>
                </view>
			</view>

			
		</view>
        <view class="limitNum" style="padding-left: 70rpx;padding-top:26rpx;">限2-6个字符</view>

        <view class="setup-btn" @tap="subName()">保存</view>

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
	</view>
</template>

<script>
import Upload from '@/components/upload/upload.vue';
import Popup from '@/components/uni-popup.vue';
import headTitle from '@/pages/component/headTitle.vue'
import { mapState } from 'vuex';
export default {
	components: {
		Upload,
		Popup,
        headTitle,
	},
	data() {
		return {
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
        clearInput(event) {
            this.inputClearValue = event.detail.value;
            if (event.detail.value.length > 0) {
                this.showClearIcon = true;
            } else {
                this.showClearIcon = false;
            }
            if(event.detail.value.length < 0||event.detail.value.length > 6){
                uni.showToast({
					title: '限2-6个字符',
					duration: 2000,
					icon: 'none',
				});
                return false;
            }
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
		/*获取数据*/
		getData() {
			let self = this;
			// uni.showLoading({
			// 	title: '加载中',
			// });
			self._get('user/index/setting', {}, function (res) {
				self.userInfo = res.data;
                self.inputClearValue = self.userInfo.nickName;
                uni.setStorageSync('uerinfo', res.data);
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
				// uni.hideLoading();
			});
			// #ifdef APP-PLUS
			// plus.runtime.getProperty(plus.runtime.appid, function (widgetInfo) {
			// 	self.version_no = widgetInfo.version;
			// });
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
			self.isUpload = true;
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
			
			// self.loading = true;
			self._post('user/user/updateInfo', params, function (res) {
                console.log('resssss',res)
                    uni.showToast({
                        title: '修改成功',
                        icon: 'none',
                        duration: 2000,
                    });
                		// self.loading = false;
						// self.isPopup = false;
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
.limitNum{
    font-weight: normal;
    font-size: 24rpx;
    color: #8C8C8C;
    line-height: 28rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
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
