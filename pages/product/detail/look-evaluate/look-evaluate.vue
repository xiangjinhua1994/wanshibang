<template>
	<view class="look-evaluate">
		<view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
        <headTitle title="商品评价" bg="#F7F8FA"></headTitle>
		<view class="top-tabbar2" style="height: 88rpx;">
			<view :class="state_active == -1 ? 'tab-item2 active' : 'tab-item2'" class="tab-item2" @click="stateFunc(-1)">
				全部({{ Total.all }})
			</view>
			<view :class="state_active == 10 ? 'tab-item2 active' : 'tab-item2'" class="tab-item2" @click="stateFunc(10)">
				有图({{ Total.picture }})
				
			</view>
			<!-- <view class="tab-item2" @click="stateFunc(20)">
				视频({{ Total.review }})
				
			</view> -->
			<!-- <view :class="state_active == 30 ? 'tab-item active' : 'tab-item'" @click="stateFunc(30)">
				<view class="d-c-c mr20">
					<text class="ml10 gray9">差评({{ Total.negative }})</text>
				</view>
			</view> -->
		</view>

		<!--评论列表-->
		<scroll-view scroll-y="true" class="scroll-Y"  lower-threshold="50"
			@scrolltolower="scrolltolowerFunc">
			<view class="comment-list">
				<view class="item" v-for="(item, index) in tableData" :key="index" style="position: relative;">
					<view class="cmt-user" style="">
						<view class="left" style="">
							<image class="photo" :src="item.avatarUrl|| '../../../../static/default.png'" mode="aspectFill"></image>
							<text class="name" style="position:relative;right:0rpx;top:-20rpx">{{ item.nickName }}</text>
						</view>
						<view class="" style="position:absolute;right:0rpx;top:22rpx">
							<text class="datetime gray9 mr20" style="color: #999;">{{ item.createTime }}</text>
						</view>
					</view>
					<view class="d-b-c" style="position: relative;top:-20rpx;left:8rpx;">
						<!-- <view class="d-s-c">
							<view v-if="item.score == 10" class="d-c-c mr20">
								<text class="icon iconfont icon-pingjiahaoping"></text>
								<text class="ml10 gray9">好评</text>
							</view>
							<view v-if="item.score == 20" class="d-c-c mr20">
								<text class="icon iconfont icon-pingjiazhongping"></text>
								<text class="ml10 gray9">中评</text>
							</view>
							<view v-if="item.score == 30" class="d-c-c mr20">
								<text class="icon iconfont icon-pingjiachaping"></text>
								<text class="ml10 gray9">差评</text>
							</view>
						</view> -->
						<view class="comment-info-2">
							<view class="comment-esteem">
								<text style="color: #EE2828;font-size:24rpx" class="iconfont icon-shoucang2" v-for="a in item.productScore"></text>
								<text style="font-size:24rpx;" class="iconfont icon-shoucang1" v-for="a in (5-item.productScore)"></text>
								
							</view>
						</view>
						<!-- <text class="datetime gray9" style="position: absolute;top:-16rpx;right:20rpx;color: #999;">{{ item.productAttr}}</text> -->
					</view>
					<view class="p-0-0 f24 gray3" style="line-height: 40rpx;padding-right:22rpx">{{ item.content }}</view>
					<view class="imgs d-s-c p-10-0">
						<view class="box" v-for="(imgs, img_num) in item.image" :key="img_num">
							<image style="border-radius: 10rpx;" @click="previewImage(imgs)" :src="imgs" mode="aspectFill"
								width="">
							</image>
						</view>
					</view>
				</view>
				<!-- 没有记录 -->
				<view class="d-c-c p30" v-if="tableData.length==0 && !loading">
					<view class="none-data-box">
						<image src="/static/none.png" mode="widthFix"></image>
						<text>亲，暂无相关记录哦</text>
					</view>
				</view>
				<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more.vue";
	import headTitle from '@/pages/component/headTitle.vue'

	export default {
		components: {
			uniLoadMore,
			headTitle,
		},
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*选中状态*/
				state_active: -1,
				/*商品id*/
				product_id: 0,
				/*评论列表*/
				tableData: [],
				/*统计*/
				Total: {
					/*总数*/
					all: 0,
					/*score = 30*/
					negative: 0,
					/*score = 10*/
					praise: 0,
					/*score = 20*/
					negative: 0,
					review: 0
				},
				/*页码*/
				page: 1,
				list_rows: 15,
				no_more: false,
				loading: true,
				/*最后一页码数*/
				last_page: 0,
				productId:null,
				picture:0,//有图无图
			};
		},
		computed: {
			/*加载中状态*/
			loadingType() {
				if (this.loading) {
					return 1;
				} else {
					if (this.tableData.length != 0 && this.no_more) {
						return 2;
					} else {
						return 0;
					}
				}
			}
		},
		onLoad(e) {
			this.productId = e.productld;
		},
		mounted() {
			this.init();
			/*获取数据*/
			this.getData();
		},
		methods: {
			previewImage(img) {
				console.log(img)
				uni.previewImage({
					urls: [img],
					current:img,
					fail(err) {
						console.log(err)
						this.showError(err)
					}
				});
			},
			/*初始化*/
			init() {
				let self = this;
				// uni.getSystemInfo({
				// 	success(res) {
				// 		self.phoneHeight = res.windowHeight;
				// 		// 计算组件的高度
				// 		let view = uni.createSelectorQuery().select('.top-tabbar');
				// 		view.boundingClientRect(data => {
				// 			let h = self.phoneHeight - data.height;
				// 			self.scrollviewHigh = h;
				// 		}).exec();
				// 	}
				// });
			},

			/*获取数据*/
			getData() {
				let _this = this;
				let productId = _this.productId;
				_this._postBody(
					'product/comment/lists', {
						productId: productId,
						score: _this.state_active,
						pageIndex: _this.page,
						pageSize: _this.list_rows,
						picture:_this.picture,
					},
					function(res) {
						_this.loading = false;
						_this.Total = res.data.total;
						_this.tableData = _this.tableData.concat(res.data.comments.records);
						_this.last_page = res.data.comments.lastPage;
						if (res.data.comments.lastPage <= 1) {
							_this.no_more = true;
						}
					}
				);
			},

			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {
				let self = this;
				self.bottomRefresh = true;
				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					self.no_more = true;
					return;
				}
				self.getData();
			},

			/*类别切换*/
			stateFunc(e) {
				let self = this;
				if(e==10){
					self.picture = 1
				}else{
					self.picture = 0
				}
				if (self.state_active != e) {
					self.tableData = [];
					self.no_more = false;
					self.loading = true;
					self.state_active = e;
					self.page = 1;
					self.getData();
				}
			}
		}
	};
</script>

<style scoped lang="scss">
	.look-evaluate .comment-list {
		background: #F7F8FA ;
	}

	.look-evaluate .comment-list .item {
		padding-top: 20rpx;
		padding-left: 20rpx;
		padding-bottom: 30rpx;
		border-top: none;
		//border-bottom: 1px solid #dddddd;
		background: #fff ;
		margin-top: 20rpx;
		border-radius: 28rpx;

	}

	.tab-item.active {
		font-size: 30rpx;
	}

	.look-evaluate .iconfont {
		border-radius: 50%;
		font-size: 40rpx;
		text-align: center;
	}

	.look-evaluate .icon-pingjiahaoping {
		color: #f42222;
	}

	.look-evaluate .icon-pingjiazhongping {
		color: #f2b509;
	}

	.look-evaluate .icon-pingjiachaping {
		color: #999999;
	}

	.look-evaluate .imgs {
		flex-wrap: wrap;
	}

	.look-evaluate .imgs .box {
		margin-top: 10rpx;
		margin-right: 10rpx;
	}

	.look-evaluate .imgs .box:nth-child(3n) {
		margin-right: 0;
	}

	.look-evaluate .imgs .box,
	.look-evaluate .imgs .box image {
		width: 210rpx;
		height: 210rpx;
	}
	.top-tabbar2{
		display: flex;
		width: 100%;
		height: 88rpx;
		background: #F7F8FA;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		padding-left: 40rpx;
		font-weight: normal;
		font-size: 26rpx;
		color: #252525;
		text-align: left;
		font-style: normal;
		text-transform: none;
		.tab-item2{
		   line-height: 88rpx;
		   margin-right: 42rpx;
		}
		.active{
			font-size: 30rpx;
			font-weight: normal;
		}

	}
	.scroll-Y{
		height: calc(100vh - 200rpx) !important;
	}
	.comment-info-2{
		//border: 1rpx solid red;
		position: relative;
		top: -10rpx;
		left: 90rpx;

	}
</style>
