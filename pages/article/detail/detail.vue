<template>
	<view :data-theme="theme()" :class="theme() || ''" class="article-detail" v-if="loadding">
		<view class="title fb">{{ article.articleTitle }}</view>
		<view class="info d-b-c f24">
			<view>
				<text class="red">{{ article.categoryName }}</text>
				<text class="ml30">{{ article.createTime }}</text>
			</view>
			<button class="share-box" open-type="share" @click="shareFunc"><image class="share_img" src="/static/icon/fx.png" mode=""></image></button>
		</view>
		<view class="article-content" v-html="article.articleContent"></view>
		<keep-alive>
			<tabBar></tabBar>
		</keep-alive>
		<!--底部弹窗-->
		<share :isbottmpanel="isbottmpanel" @close="closeBottmpanel"></share>
		<!--app分享-->
		<AppShare :isAppShare="isAppShare" :appParams="appParams" @close="closeAppShare"></AppShare>
	</view>
</template>

<script>
import utils from '@/common/utils.js';
import AppShare from '@/components/app-share.vue';
import share from '@/components/mp-share.vue';

export default {
	components: {
		share,
		AppShare
	},
	data() {
		return {
			/*是否加载完成*/
			loadding: false,
			indicatorDots: true,
			autoplay: true,
			interval: 2000,
			duration: 500,
			/*文章id*/
			articleId: 0,
			/*文章详情*/
			article: {
				image: {}
			},
			isbottmpanel: false,
			/*app分享*/
			isAppShare: false,
			appParams: {
				title: '',
				summary: '',
				path: ''
			},
		};
	},
	onLoad(e) {
		/*分类id*/
		this.articleId = e.articleId;
		// 公众号分享
		if (this.getPlatform() == 'mp') {
			this.url = window.location.href;
		}
	},
	mounted() {
		/*获取产品详情*/
		this.getData();
	},
	/*分享*/
	onShareAppMessage() {
		let self = this;
		// 构建页面参数
		let params = self.getShareUrlParams({
			articleId: self.articleId
		});
		self.taskFunc();
		return {
			title: self.article.articleTitle,
			path: '/pages/article/detail/detail?' + params
		};
	},
	methods: {
		taskFunc() {
			let self = this;
			self._post(
				'plus/task/task/dayTask',
				{
					taskType: 'article'
				},
				res => {
					console.log('分享成功');
				}
			);
		},
		//关闭分享
		closeBottmpanel(data) {
			this.isbottmpanel = false;
		},
		shareFunc() {
			let self = this;
			self.taskFunc();
			//#ifndef APP-PLUS
			self.isbottmpanel = true;
			//#endif
			//#ifdef APP-PLUS
			self.appParams.title = self.article.articleTitle;
			self.appParams.summary = self.article.articleTitle;
			// 构建页面参数
			let params = self.getShareUrlParams({
				articleId: self.articleId
			});
			self.appParams.path = '/pages/article/detail/detail?' + params;
			self.appParams.image = self.article.filePath;
			self.isAppShare = true;
			//#endif
		},
		//关闭分享
		closeAppShare(data) {
			this.isAppShare = false;
		},
		/*获取文章详情*/
		getData() {
			let self = this;
			uni.showLoading({
				title: '加载中'
			});
			self.loading = true;
			let articleId = self.articleId;
			self._get(
				'plus/article/article/detail',
				{
					articleId: articleId,
					url: self.url
				},
				function(res) {
					// 配置微信分享参数
					if (self.getPlatform() == 'mp') {
						let params = {
							articleId: articleId
						};
						self.configWx(res.data.share.signPackage, res.data.share.shareParams, params);
					}
					/*详情内容格式化*/
					res.data.articleContent = utils.format_content(res.data.detail.articleContent);
					self.article = res.data.detail;
					self.loadding = true;
					uni.hideLoading();
				}
			);
		}
	}
};
</script>

<style>
.article-detail {
	padding: 30rpx;
	background: #ffffff;
}

.article-detail .title {
	font-size: 44rpx;
}

.article-detail .info {
	padding: 40rpx 0;
	color: #999999;
}

.article-detail .article-content {
	width: 100%;
	box-sizing: border-box;
	line-height: 60rpx;
	font-size: 34 rpx;
	overflow: hidden;
}
.article-detail .article-content image,
.article-detail .article-content img {
	display: block;
	max-width: 100%;
}
.share-box {
	background: none;
}
.share_img {
	width: 32rpx;
	height: 32rpx;
}
</style>
