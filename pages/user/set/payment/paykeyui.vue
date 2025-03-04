<template>
	<view class="page">
		<view>
			<view>
				<view class="payment-title">{{pay_title1.title}}</view>
				<view class="payment-describe">{{pay_title1.describe}}</view>
			</view>
			<view class="pay-password" @click="onPayUp">
				<view class="list">
					<text v-show="passwordArr.length >= 1">●</text>
				</view>
				<view class="list">
					<text v-show="passwordArr.length >= 2">●</text>
				</view>
				<view class="list">
					<text v-show="passwordArr.length >= 3">●</text>
				</view>
				<view class="list">
					<text v-show="passwordArr.length >= 4">●</text>
				</view>
				<view class="list">
					<text v-show="passwordArr.length >= 5">●</text>
				</view>
				<view class="list">
					<text v-show="passwordArr.length >= 6">●</text>
				</view>
			</view>
		</view>
		<!-- ref:唯一ref  passwrdType：密码样式pay keyInfo：密码输入监测事件 -->
		<cc-defineKeyboard ref="CodeKeyboard" passwrdType="pay" @KeyInfo="KeyInfo"></cc-defineKeyboard>
	</view>
</template>

<script>
	export default {

		props:{
			pay_title1:{
				type: Object,
				required: true 
			},
		},
		components: {

		},
		data() {
			return {
				// 支付设置状态
				AffirmStatus: 1,
				// 输入密码
				passwordArr: [],
				oldPasswordArr: [],
				newPasswordArr: [],
				afPasswordArr: [],
			};
		},
		onLoad() {

		},
		methods: {
			/**
			 * 唤起键盘
			 */
			onPayUp() {
				this.$refs.CodeKeyboard.show();
			},
			/**
			 * 支付键盘回调
			 * @param {Object} val
			 */
			KeyInfo(val) {
         
				// console.log('输入信息 = ' + JSON.stringify(val));
				// 输入超过七位数无效
				if (val.index >= 6) {
					return;
				}
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

                if (this.passwordArr.length === 6) {
					this.$emit('custom-event', this.passwordArr);         
                     return;
				}
				if (this.passwordArr.length > 6) {
						uni.showToast({
							title: '密码不能超过6位',
							icon: 'none'
						})
					this.passwordArr = [];
					this.AffirmStatus = this.AffirmStatus + 1;
				}
				// 判断到哪一步了
				if (this.AffirmStatus === 1) {
					this.oldPasswordArr = this.passwordArr;
				} else if (this.AffirmStatus === 2) {
					this.newPasswordArr = this.passwordArr;
				} else if (this.AffirmStatus === 3) {
					this.afPasswordArr = this.passwordArr;
				} else if (this.AffirmStatus === 4) {
					console.log(this.oldPasswordArr.join(''));
					console.log(this.newPasswordArr.join(''));
					console.log(this.afPasswordArr.join(''));

					setTimeout(() => {
						uni.navigateBack();
					}, 2000)
				}
				this.$forceUpdate();
			}

		}
	}
</script>

<style scoped lang="scss">
.payment-title {
    padding-top: 100rpx;
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

	$base: #CCCCCC; // 基础颜色


	.pay-title {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 90rpx;
		margin-top: 56%;

		text {
			font-size: 28rpx;
			color: #555555;
		}
	}

	.pay-password {
		display: flex;
		align-items: center;
		width: 90%;
		height: 90rpx;
		margin: 20rpx auto;
		//border: 2rpx solid $base;

		.list {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 16.666%;
			height: 100%;
			//border-right: 2rpx solid #EEEEEE;
			border: 1rpx solid #ccc;
			margin-right: 30rpx;
			border-radius:12rpx;

			text {
				font-size: 32rpx;
			}
		}

		.list:nth-child(6) {
			//border-right: none;
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
</style>