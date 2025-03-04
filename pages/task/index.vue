<template>
	<view :data-theme="theme()" :class="theme() || ''">
		<view><image class="bg-top" :src="backImage" mode=""></image></view>
		<view class="task-center mb20">
			<view class="task-center-title">成长任务</view>
			<template  v-for="(item, index) in growTask" :key="index" >
				<view class="task-center-item d-s-c"  v-if="item.isOpen == 1">
				<image class="task-logo" :src="item.image" mode=""></image>
				<view class="flex-1">
					<view class="text-ellipsis f28 gray3 mb10">{{ item.name }}</view>
					<view class="f24 gray9 mb10">{{ item.rule }}</view>
					<view class="d-s-c f40 gray6">
						+{{ item.points }}
						<image class="task-points" src="/static/icon/task/task.png" mode=""></image>
					</view>
				</view>
				<button class="task-btns" :class="item.status != 0 ? '' : 'active'" @click="clickFunc(item)">{{ item.status != 0 ? '已完成' : '去完成' }}</button>
			</view>
		</template>
		</view>
		<view class="task-center">
			<view class="task-center-title">日常任务</view >
			<template  v-for="(item, index) in dayTask" :key="index" >
				<view class="task-center-item d-s-c"  v-if="item.isOpen == 1">
				<image class="task-logo" :src="item.image" mode=""></image>
				<view class="flex-1">
					<view class="text-ellipsis f28 gray3 mb10">{{ item.name }}</view>
					<view class="f24 gray9 mb10">{{ item.rule }}</view>
					<view class="d-s-c f40 gray6" v-if="item.taskType != 'order' && item.taskType != 'sign' && item.taskType != 'invite'">
						+{{ item.points }}
						<image class="task-points" src="/static/icon/task/task.png" mode=""></image>
					</view>
				</view>
				<button class="task-btns" :class="item.status != 0 ? '' : 'active'" @click="clickFunc(item)">{{ item.status != 0 ? '今日已完成' : '去完成' }}</button>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			invitation_id: 0,
			dayTask: [],
			growTask: [],
			backImage: ''
		};
	},
	onShow() {
		this.getData();
	},
	methods: {
		clickFunc(e) {
			let self = this;
			if (e.status != 0) {
				return;
			}
			let url = '';
			switch (e.taskType) {
				case 'product':
					url = '/pages/product/list/list';
					break;
				case 'article':
					url = '/pages/article/list/list';
					break;
				case 'order':
					url = '/pages/product/list/list';
					break;
				case 'sign':
					url = '/pages/plus/signin/signin';
					break;
				case 'invite':
					url = '/pages/user/invite/invite?invitationGiftId=' + self.invitationId;
					break;
				case 'image':
					url = '/pages/user/set/set';
					break;
				case 'nickName':
					url = '/pages/user/set/set';
					break;
				case 'base':
					url = '/pages/user/set/set';
					break;
			}
			if (url) {
				self.gotoPage(url);
			}
		},
		getData() {
			let self = this;
			self._get('plus/task/task/index', {}, res => {
				self.dayTask = res.data.task.dayTask;
				self.growTask = res.data.task.growTask;
				self.backImage = res.data.task.backImage;
				self.invitationId = res.data.invitationId;
			});
		}
	}
};
</script>

<style lang="scss">
.bg-top {
	width: 750rpx;
	height: 270rpx;
}
.task-center {
	padding: 12rpx 19rpx 0 23rpx;
	background-color: #ffffff;
}
.task-center-item {
	border-top: 1rpx solid #eeeeee;
	height: 202rpx;
	box-sizing: border-box;
}
.task-center-title {
	font-size: 32rpx;
	color: #121212;
	padding: 32rpx 0;
}
.task-logo {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin-right: 35rpx;
	flex-shrink: 0;
}
.task-points {
	width: 38rpx;
	height: 38rpx;
	margin-left: 14rpx;
	flex-shrink: 0;
}
.task-btns {
	width: 147rpx;
	height: 58rpx;
	border-radius: 29rpx;
	padding: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	line-height: 1.5;
	margin-right: 26rpx;
	font-size: 24rpx;
	box-sizing: border-box;
	border: 1rpx solid #eeeeee;
	background-color: #eeeeee;
	color: #666666;
}
.task-btns.active {
	@include border_color('border_color');
	@include background_color('background_color');
	@include text_color('text_color1');
}
</style>
