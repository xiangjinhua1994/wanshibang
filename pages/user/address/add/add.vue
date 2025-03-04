<template>
	<view class="address-form">
		<view class="head_top" :style="'height:' + topBarTop() + 'px;'"></view>
		<headTitle title="新增地址" bg="#fff"></headTitle>
		<!-- <form @submit="formSubmit" @reset="formReset"></form> -->
		<view class="address-box">
			<view class="d-s-c ">
				<text class="key-name">姓名</text>
				<input class="ml20 flex-1 f32 p-30-0" name="name" type="text" placeholder-class="grary9"
					v-model="address.name" placeholder="请输入姓名" />
				<view class="address-box-call">
					<radio-group name="radio" style="transform:scale(0.7)" @change="radioChange($event, index)">
						<label class="mar10">
							<radio value="0" color="#000" checked="true" /><text>先生</text>
						</label>
						<label>
							<radio value="1" color="#000" /><text>女士</text>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="d-s-c ">
				<text class="key-name">手机号</text>
				<input class="ml20 flex-1 f32 p-30-0" name="phone" type="text" placeholder-class="grary9"
					v-model="address.phone" placeholder="请输入手机号" />
			</view>
			<view class="d-s-c ">
				<text class="key-name">所在地区</text>
				<view class="input-box flex-1" @click="showMulLinkageThreePicker">
					<input class="ml20 f32 flex-1 p-30-0" type="text" placeholder-class="grary9" placeholder="请选择省市区"
						v-model="selectCity" disabled style="pointer-events: none" />
				</view>
			</view>
			<view class="d-s-c ">
				<text class="key-name">详细地址</text>
				<textarea class="ml20 flex-1 p-30-0 lh150" name="detail" :auto-height="true" v-model="address.detail"
					placeholder-class="grary9" placeholder="街道/门牌号/小区楼栋/乡等"></textarea>
			</view>
		</view>
		<view class=" address-box">
			<!-- <view class="d-s-c address-item">
        <text class="key-name">选择标签</text>
        <view class="d-s-c flex-1">
          <view class="ui-btn " :class="address.lable === 1 ?'btn-black': ''" @click="address.lable = 1">家</view>
          <view class="ui-btn " :class="address.lable === 2 ?'btn-black': ''" @click="address.lable = 2">公司</view>
          <view class="ui-btn " :class="address.lable === 3 ?'btn-black': ''" @click="address.lable = 3">学校</view>
        </view>
      </view> -->
			<view class="d-b-c address-item">
				<text class=" key-name-lang">
					设为默认地址
					<text class="">(每次下的时默认使用)</text>
				</text>
				<switch :checked="address.checked" color="#000" style="transform:scale(0.7)" @change="checkedFn" />

			</view>
		</view>
		<view class="add_add-btn">
			<view class="ui-btn btn-black btn-more" @click="formSubmit()">新增地址</view>
		</view>
		<!-- <view class="p30"><button type="primary" form-type="submit" class="btn-gcred f32 mt60 addBtn">保存</button></view> -->

		<mpvue-city-picker v-if="is_load" ref="mpvueCityPicker" :province="province" :city="city" :area="area"
			:pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
import headTitle from '@/pages/component/headTitle.vue'
export default {
	components: {
		headTitle,
		mpvueCityPicker
	},
	data() {
		return {
			sex: 0,
			cityPickerValueDefault: [0, 0, 0],
			selectCity: '',
			provinceId: 0,
			cityId: 0,
			regionId: 0,
			address: {
				checked: false,
				name: '',
				phone: '',
				lable: 1,
			},
			delta: 1,
			province: [],
			city: [],
			area: [],
			is_load: false
		};
	},
	onLoad: function (options) {
		this.delta = options.delta;
		this.getData();
	},
	methods: {

		radioChange(item) {
			console.log(item)
			this.sex = Number(item.detail.value)

		},
		// 获取省市区
		getData() {
			let self = this;
			self._post('settings/getRegion', {}, function (res) {
				self.province = res.data[0];
				self.city = res.data[1];
				self.area = res.data[2];
				self.is_load = true;
			});
		},
		checkedFn(e) {
			console.log("e", e.detail.value)
			this.address.checked = e.detail.value
		},
		/*提交*/
		formSubmit: function (e) {
			let self = this;
			var formdata = this.address;// e.detail.value;
			formdata.provinceId = self.provinceId;
			formdata.cityId = self.cityId;
			formdata.regionId = self.regionId;
			formdata.sex = self.sex;

			if (formdata.name == '') {
				uni.showToast({
					title: '请输入收货人姓名',
					duration: 1000,
					icon: 'none'
				});
				return false;
			}

			if (formdata.phone == '') {
				uni.showToast({
					title: '请输入手机号码',
					duration: 1000,
					icon: 'none'
				});
				return false;
			}

			if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(formdata.phone)) {
				uni.showToast({
					title: '手机有误,请重填！',
					duration: 2000,
					icon: 'none'
				});
				return false;
			}

			if (formdata.provinceId == 0 || formdata.cityId == 0 || formdata.regionId) {
				if (formdata.detail == '') {
					uni.showToast({
						title: '请选择完整省市区',
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
			}

			if (formdata.detail == '') {
				uni.showToast({
					title: '请输入街道小区楼牌号等',
					duration: 1000,
					icon: 'none'
				});
				return false;
			}

			self._postBody('user/address/add', formdata, function (res) {

				console.log(res)

				if (res.code == 1) {
					// history.go(-self.delta);
          uni.navigateBack({
            delta: self.delta
          })
				} else {
					uni.showToast({
						title: res.msg,
						duration: 2000
					});

				}
				//  uni.showToast({
				// 			title: '删除成功',
				// 			duration: 2000
				// 		});

				// self.showSuccess(res.msg, function() {
				// 	// #ifndef H5
				// 	uni.navigateBack({
				// 		delta: parseInt(self.delta)
				// 	});
				// 	// #endif
				// 	// #ifdef H5
				// 	history.go(-self.delta);
				// 	// #endif
				// });


				// self.showSuccess(res.msg, function() {
				// 	// #ifndef H5
				// 	uni.navigateBack({
				// 		delta: parseInt(self.delta)
				// 	});
				// 	// #endif
				// 	// #ifdef H5
				// 	history.go(-self.delta);
				// 	// #endif
				// });



			});
		},

		formReset: function (e) {
			console.log('清空数据');
		},

		/*三级联动选择*/
		showMulLinkageThreePicker() {
			console.log(this.is_load)
			if (!this.is_load) {
				return
			}
			this.$refs.mpvueCityPicker.show();
		},

		/*确定选择的省市区*/
		onConfirm(e) {
			this.selectCity = e.label;
			this.provinceId = e.cityCode[0];
			this.cityId = e.cityCode[1];
			this.regionId = e.cityCode[2];
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #F7F8FA;
}

.address-form {
	/* border-top: 16rpx solid #f2f2f2; */
}

.address-box {
	margin: 24rpx;
	border-radius: 24rpx;
	background-color: #fff;
	padding: 0 30rpx;
	font-size: 28rpx;

	.address-item {
		height: 104rpx;
	}

	.address-box-call {
		display: flex;
		justify-content: flex-end;
		align-items: center;

		.radio-img {
			width: 24rpx;
			height: 24rpx;
			margin-right: 8rpx;
			margin-left: 12rpx;
		}
	}
}

.add_add-btn {
	position: fixed;
	bottom: 0;
	width: 750rpx;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
	font-size: 28rpx;
	height: 120rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #fff;

	.btn-more {
		width: 690rpx;
		margin-left: 0;
	}
}

.address-form .key-name {
	width: 140rpx;
	font-size: 32rpx
}

.address-form .key-name-lang {
	width: 500rpx;
	font-size: 32rpx;

	text {
		font-family: Hiragino Sans GB, Hiragino Sans GB;
		font-weight: normal;
		font-size: 20rpx;
		color: #8C8C8C;
		font-style: normal;
		text-transform: none;
	}
}

.address-form .btn-red {
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	box-shadow: 0 8rpx 16rpx 0 rgba(226, 35, 26, .6);
}

.addBtn {
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 40rpx;
}

.mar10 {
	margin-right: 20rpx;
}
</style>
