<template>
	<view style="margin-top:100rpx">
		<web-view :src="url" ></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
			}
		},
		onLoad(e) {
			this.url = e.url;
			 // #ifdef APP-PLUS
			    let height = 0; //定义动态的高度变量
			    let statusbar = 0; // 动态状态栏高度
			    uni.getSystemInfo({
			      // 获取当前设备的具体信息
			      success: sysinfo => {
			        statusbar = sysinfo.statusBarHeight;
			        height = sysinfo.windowHeight;
			      }
			    });
			let currentWebview = this.$scope.$getAppWebview(); //获取当前web-view
			    setTimeout(function () {
			      var wv = currentWebview.children()[0];
			      wv.setStyle({
			        //设置web-view距离顶部的距离以及自己的高度，单位为px
			        top: statusbar + uni.upx2px(15), //此处是距离顶部的高度，应该是你页面的头部
			        height: height - statusbar - uni.upx2px(15), //webview的高度
			        scalable: false, //webview的页面是否可以缩放，双指放大缩小,
			      });
			    }, 200); //如页面初始化调用需要写延迟
		},
		methods: {
			// // webview向外部发送消息
			// handlePostMessage: function(data) {
			// 	console.log("接收到消息：" + JSON.stringify(data.detail));
			// },
		}
	}
</script>

<style>

</style>