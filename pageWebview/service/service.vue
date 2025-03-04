<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="urle"></web-view>
	</view>
</template>
<script>
import { mapState } from 'vuex';

export default {
	data() {
		return {
			webviewStyles: {
				progress: {
					color: '#FF3333',
				},
			},
			urle: '', //客服联系地址
		};
	},
	computed: {
		...mapState(['globalUserInfo','visitorId']),
	},
	onShow() {
		// this.$store.dispatch('GetGloablUserInfo', { _vue: this });
		this.$store.dispatch('GlobalInitQuery', { _vue: this })

		let self = this;
		let nunber = Math.floor(Math.random() * 100 + 1);
		var timestamp = Date.parse(new Date());
		let phone = null;
		console.log(self.visitorId, 123456);
		if (self.visitorId) {
			phone = self.visitorId;
		} else {
			phone = self.visitorId;
		}
		this.urle = `https://webchat-sh.clink.cn/chat.html?accessId=22b50bf8-183a-4e50-98dd-8a4fef9098f6&language=zh_CN&visitorId=${phone}`;
	},
};
</script>

<style></style>
