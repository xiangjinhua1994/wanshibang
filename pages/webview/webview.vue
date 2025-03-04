<template>
	<view>
		<view style="position: fixed;background:#fff;z-index:999;top:0;left:0">
			<view class="head_top" :style="'height:'+topBarTop()+'px;'" style="background-color: #fff;"></view>
			<headTitle class="headColor" bg="#fff" style="z-index: 9999;"></headTitle>
		</view>
		<view style="margin-top: 60rpx;">
			<web-view :src="url" @onPostMessage="handlePostMessage"></web-view>
		</view>
	</view>
</template>

<script>
  import headTitle from '@/pages/component/headTitle.vue'
	export default {
		components: {
			headTitle,
		},
		data() {
			return {
				url: ''
			}
		},
		onLoad(e) {
			this.url = e.url;
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
			        top: statusbar + uni.upx2px(65), //此处是距离顶部的高度，应该是你页面的头部
			        height: height - statusbar - uni.upx2px(15), //webview的高度
			        scalable: false, //webview的页面是否可以缩放，双指放大缩小,
			      });
			    }, 200); //如页面初始化调用需要写延迟
		},
		methods: {
			// webview向外部发送消息
			handlePostMessage: function(data) {
				console.log("接收到消息：" + JSON.stringify(data.detail));
			},
		}
	}
</script>

<style>

</style>