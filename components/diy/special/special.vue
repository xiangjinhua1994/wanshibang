<template>
	<view
		v-if="listData.length > 0"
		:style="{
			background: itemData.style.bgcolor,
			paddingLeft: itemData.style.paddingLeft * 2 + 'rpx',
			paddingRight: itemData.style.paddingLeft * 2 + 'rpx',
			paddingTop: itemData.style.paddingTop * 2 + 'rpx',
			paddingBottom: itemData.style.paddingBottom * 2 + 'rpx'
		}"
	>
		<view
			class="diy-special"
			:style="{
				background: itemData.style.background,
				borderTopLeftRadius: itemData.style.topRadio * 2 + 'rpx',
				borderTopRightRadius: itemData.style.topRadio * 2 + 'rpx',
				borderBottomLeftRadius: itemData.style.bottomRadio * 2 + 'rpx',
				borderBottomRightRadius: itemData.style.bottomRadio * 2 + 'rpx'
			}"
		>
			<view class="special-left"><image :src="itemData.style.image" mode="aspectFill"></image></view>
			<view class="right-shadow"></view>
			<view class="special-content" :class="'display_' + itemData.style.display">
				<view class="special-content-list" :style="'transform: translate(0,' + styleValue + 'px);'">
					<view class="content-item text-ellipsis" v-for="(item, index) in listData" :key="index" @click="gotoPageFunc(item)">
						<text>{{ item.articleTitle }}</text>
					</view>
				</view>
			</view>
			<view class="special-more" @click="gotoPageFunc()"><text class="iconfont icon-you"></text></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			/*数据列表*/
			listData: [],
			/*样式*/
			styleValue: '',
			/*当前角标*/
			index_num: 0,
			/*高度*/
			lineHeight: 0,
			/*最大数*/
			maxSize: 0,
			/*时间*/
			timer: null
		};
	},
	props: ['itemData'],
	created() {
		this.listData = this.itemData.data;
		this.init();
	},
	methods: {
		/*初始化*/
		init() {
			let self = this;
			if ((this.itemData.style.display == 1 && this.listData.length > 1) || (this.itemData.style.display == 2 && this.listData.length > 2)) {
				uni.getSystemInfo({
					success(res) {
						self.lineHeight = (res.windowWidth / 750) * 30;
						self.maxSize = self.listData.length;
						if (self.itemData.style.display == 2) {
							self.lineHeight = self.lineHeight * 2;
							self.maxSize = self.maxSize / 2;
						}
						self.timer = setInterval(function() {
							self.animation();
						}, 3000);
					}
				});
			}
		},

		/*动画*/
		animation() {
			let self = this;
			self.index_num++;
			if (self.index_num >= self.maxSize) {
				self.index_num = 0;
			}
			this.styleValue = -self.lineHeight * self.index_num;
		},

		/*跳转页面*/
		gotoPageFunc(e) {
			let url = null;
			if (e && typeof e != 'undefined') {
				url = 'pages/article/detail/detail?articleId=' + e.articleId;
			} else {
				url = 'pages/article/list/list';
			}
			this.gotoPage(url);
		}
	}
};
</script>

<style>
.diy-special {
	padding: 0 20rpx 0 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	overflow: hidden;
}

.diy-special .special-left {
	width: 136rpx;
	height: 33rpx;
}

.diy-special .special-left image {
	width: 100%;
	height: 100%;
}

.diy-special .special-more .icon-you {
	font-size: 24rpx;
}

.diy-special .special-content {
	flex: 1;
	margin: 0 20rpx;
	overflow: hidden;
}

.diy-special .special-content-list {
	transition: transform 0.4s;
}

.diy-special .content-item {
	height: 30rpx;
	line-height: 30rpx;
}

.diy-special .special-content.display_1 {
	height: 30rpx;
}

.diy-special .special-content.display_2 {
	height: 60rpx;
}

.right-shadow {
	width: 15rpx;
	height: 90rpx;
	background: linear-gradient(90deg, #e4e4e4 0%, rgba(255, 255, 255, 0) 100%);
	margin-left: 30rpx;
}
</style>
