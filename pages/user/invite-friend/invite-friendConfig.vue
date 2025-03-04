<template>
	<view class="page_invite_friend_box">
		<view class="imag_box">
			<image
				class="img_box_inner"
				:src="imgSrc"
				mode="widthFix"
				lazy-load="false"
			>
			</image>
		</view>
		<view class="btn_line_box">
			<view class="tips_line" v-if="isWXH5"> 长按图片可保存到本地 </view>
			<view class="btn_line" v-else>
        
				<template v-for="(item, i) in btnList">
					<view
						v-if="item.type !== 'shareAppMessage'"
						class="btn-reset btn_box"
						@click="handleBtnClick(item)"
						open-type="share"
					>
						<view class="top">
							<image class="img_box" :src="item.img"> </image>
						</view>
						<view class="bottom">
							{{ item.text }}
						</view>
					</view>
					<button
						v-else
						class="btn-reset btn_box"
						open-type="share"
						@share="onShareAppMessageInner"
						:dataObj="item"
					>
						<view class="top">
							<image class="img_box" :src="item.img"> </image>
						</view>
						<view class="bottom">
							{{ item.text }}
						</view>
					</button>
				</template>
			</view>
		</view>
		<!-- <tabBar></tabBar> -->
		<keep-alive>
			<tabBar></tabBar>
		</keep-alive>
	</view>
</template>

<script>
import utils from '@/common/utils.js';
import config from '@/env/config.js';
export default {
	data() {
		return {
			imgSrc: '',
			// #ifdef H5
			source: 'h5',
			// #endif
			// #ifdef MP-WEIXIN
			source: 'wx',
			// #endif
			btnList: [
				{
					img: 'https://yuma-test.nnchat.com.cn/e83bdba046fe4b3a8c36cfed97938fb2.png',
					text: '保存本地',
					type: 'save',
				},
				// #ifdef MP-WEIXIN
				{
					img: 'https://yuma-test.nnchat.com.cn/963a1beccf6e495e8e76f8e34dcb0653.png',
					text: '微信',
					type: 'shareAppMessage',
				},
				{
					img: 'https://yuma-test.nnchat.com.cn/04f3418e7cb04050999f6ba134108003.png',
					text: '朋友圈',
					type: 'shareTimeline',
				},
				// #endif
			],
			/*分享配置*/
			shareConfig: {},
			timeLineImage: {
				mjh: 'https://yuma-test.nnchat.com.cn/f5707a37faa144c1ad8ac0f53b752419.png',
				jmg: 'https://yuma-test.nnchat.com.cn/2235b36b51e2421bb96f26f4125bbe24.png',
				ywy: 'https://yuma-test.nnchat.com.cn/f16115b124d04aeead22c4c5cedac4f4.png',
			},
		};
	},
	computed: {
		isWXH5() {
			// #ifdef H5
			return this.isWeixin();
			// #endif

			// #ifndef H5
			return false;
			// #endif
		},
	},
	onShow() {
		this.initImg();
		this.getData();
		// #ifdef MP-WEIXIN
		uni.showShareMenu({
			// withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline'],
		});
		// #endif
	},
	// 发送给朋友
	onShareAppMessage() {
		// 构建分享参数
		/* return {
			title: '全部分类',
			path: '/pages/product/category?' + this.getShareUrlParamsNew(),
		}; */
		return this.onShareAppMessageInner();
	},
	// 分享到朋友圈
	onShareTimeline() {
		let self = this;
		const shareObj = {
			title: config.pro_name,
			path: 'pages/index/index?' + self.getShareUrlParamsNew(),
			imageUrl: self.switchTimeLineLogo(),
		};
		console.log(shareObj, 146);
		return shareObj;
	},
	methods: {
		onShareAppMessageInner() {
			let self = this;
			const shareObj = {
				title: config.pro_name,
				path: 'pages/index/index?' + self.getShareUrlParamsNew(),
				imageUrl: self.imgSrc,
			};
			console.log(shareObj, 147);
			return shareObj;
		},
		switchTimeLineLogo() {
			return this.timeLineImage[config.pro_name_py];
		},
		getData() {
			let self = this;
			// self._get('settings/appShare', {}, function (res) {
			// 	console.log(res);
			// 	self.shareConfig = res.data;
			// });
		},
		initImg() {
			let self = this;
			uni.showLoading({
				title: '加载中...',
				mask: true,
			});
			// 发送用户信息
			self._get(
				'user/invite/poster',
				{
					source: self.source,
				},
				(res) => {
					uni.hideLoading();
					// 执行回调函数
					self.imgSrc = res.data;
					/* self.imgSrc =
						'https://yuma-test.nnchat.com.cn/596d2be368b24b8eb7d2bd1be675305c.png'; */
				},
				false,
				() => {
					uni.hideLoading();
					/* self.imgSrc =
						'https://yuma-test.nnchat.com.cn/596d2be368b24b8eb7d2bd1be675305c.png'; */
				}
			);
		},
		handleBtnClick(item) {
			const type = item.type;
			switch (type) {
				case 'save':
					this.savePosterImg();
					return;
					break;
				case 'shareAppMessage':
					this.onShareAppMessageInner();
					return;
					break;
				case 'shareTimeline':
					/* uni.showToast({
                        title:'请点击右上角菜单按钮分享至朋友圈',
                    }) */
					this.showError('请点击右上角菜单按钮分享至朋友圈');
					return;
					break;
				default:
					return;
					break;
			}
		},
		/*保存图片*/
		savePosterImg() {
			let self = this;
			utils.saveImg(self.imgSrc);
		},
	},
};
</script>

<style>
page {
	width: 100%;
	height: 100%;
}
</style>
<style lang="scss" scoped>
.page_invite_friend_box {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding-bottom: 100rpx;
	position: relative;

	.imag_box {
		width: 100%;
		height: 1624rpx;
		.img_box_inner {
			width: 100% !important;
			object-fit: fill;
		}
	}
	.btn_line_box {
		position: absolute;
		top: 1162rpx;
		left: 140rpx;
		min-width: 470rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.btn_line {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 90rpx;
			.btn_box {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.top {
					width: 88rpx;
					height: 88rpx;
					margin-bottom: 22rpx;
					.img_box {
						height: 100%;
						width: 100%;
						object-fit: fill;
					}
				}
				.bottom {
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #ffffff;
				}
			}
		}
		.tips_line {
			font-size: 28rpx;
			font-weight: bold;
			padding: 30rpx 0;
			margin: 0 auto;
			text-align: center;
		}
	}
}
</style>
