<template>
	<view>
		<!--图标入口-->
		<view
			class="diy-navbar"
			:style="{
				background: itemData.style.bgcolor,
				padding:
					itemData.style.paddingTop * 2 +
					'rpx ' +
					itemData.style.paddingLeft * 2 +
					'rpx ' +
					itemData.style.paddingBottom * 2 +
					'rpx ' +
					itemData.style.paddingLeft * 2 +
					'rpx',
			}"
		>
			<view
				class="diy-navBar"
				:style="{
					background: itemData.style.background,
					borderRadius:
						itemData.style.topRadio * 2 +
						'rpx ' +
						itemData.style.topRadio * 2 +
						'rpx ' +
						itemData.style.bottomRadio * 2 +
						'rpx ' +
						itemData.style.bottomRadio * 2 +
						'rpx',
				}"
			>
				<template v-for="(item, index) in itemData.data" :key="index">
					<view
						class="item"
						:style="
							'width:' +
							item_width +
							';' +
							'display:' +
							(hasInvite(item) ? 'flex' : 'none') +
							';'
						"
						@click="gotoDetail(item)"
					>
						<template v-if="item.linkUrl === 'service'">
							<!-- open-type="contact" session-from="wxapp" -->
							<button class="btn-reset">
								<image :src="item.imgUrl" mode="widthFix"></image>
								<text class="gray3" :style="{ color: item.color }">{{
									item.text
								}}</text>
							</button>
						</template>
						<template
							v-else-if="
								item.linkUrl === '/pages/user/invite-friend/invite-friend' &&
								globalAppInviteSwitch
							"
						>
							<image :src="item.imgUrl" mode="widthFix"></image>
							<text class="gray3" :style="{ color: item.color }">{{
								item.text
							}}</text>
						</template>
						<template
							v-else-if="
								item.linkUrl !== '/pages/user/invite-friend/invite-friend'
							"
						>
							<image :src="item.imgUrl" mode="widthFix"></image>
							<text class="gray3" :style="{ color: item.color }">{{
								item.text
							}}</text>
						</template>
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			//单个宽度
			item_width: '25%',
		};
	},
	props: ['itemData'],
	created() {
		this.item_width = 100 / Math.abs(this.itemData.style.rowsNum) + '%';
	},
	computed: {
		...mapState(['globalAppInviteSwitch']),
	},
	watch: {
		globalAppInviteSwitch(val) {
			console.log(val);
		},
	},
	methods: {
		/*跳转页面*/
		gotoDetail(e) {
			if (e.linkUrl === 'service') {
				this.gotoPage('/pageWebview/service/service');
			} else this.gotoPage(e.linkUrl);
		},
		hasInvite(item) {
			//   console.log(item.linkUrl === '/pages/user/invite-friend/invite-friend')
			//   console.log(this.globalAppInviteSwitch)
			if (item.linkUrl === '/pages/user/invite-friend/invite-friend') {
				return this.globalAppInviteSwitch;
			} else {
				return true;
			}
		},
	},
};
</script>

<style>
.diy-navbar {
}
.diy-navBar {
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
}
.diy-navbar .item {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 20rpx;
	width: 120rpx;
	height: 140rpx;
}

.diy-navbar .item image {
	width: 70rpx;
	height: 70rpx;
}

.diy-navbar .item text {
	display: block;
	text-overflow: ellipsis;
	white-space: nowrap;
	width: 100%;
	overflow: hidden;
	line-height: 66rpx;
	font-size: 24rpx;
	text-align: center;
}
</style>
