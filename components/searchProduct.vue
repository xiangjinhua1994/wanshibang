<template>
	<view v-if="isShow" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
		<view class="search-wrap">
			<!-- #ifdef H5-->
			<view class="state_top"></view>
			<!-- #endif -->
			<view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
			<!-- 搜索框 -->
			<view style="border-bottom:none" class="index-search-box d-b-c" id="searchBox"
				:style="topBarHeight() == 0 ? '': 'height:'+topBarHeight()+'px;padding-right: 200rpx'">
				<view class="reg180" :style="topBarHeight() == 0 ? '': 'height:'+topBarHeight()+'px;'">
					<text @click="closeSearch" class="icon iconfont icon-jiantou"></text>
				</view>
				<view class="index-search t-c flex-1 border-round" :style="topBarHeight() == 0 ? '': 'height:'+topBarHeight()+'px;'">
					<text class="icon iconfont icon-sousuo"></text>
					<input type="text" v-model="form.keyWord" class="flex-1 ml10 f30 gray3"
						placeholder-class="f24 gray6" placeholder="输入你要的商品" confirm-type="search" @confirm="search()" />
						
				</view>
			<text style="margin-left:20rpx;color:#333" @click="search()">搜索</text>
			</view>
			<view class="p-0-20 ">
				<view class="group-hd">
					<view class="left"><text class="min-name">搜索历史</text></view>
					<view class="right">
						<text class="iconfont icon-lajitong" @click='clearStorage'></text>
            <text @click='clearStorage'>&nbsp; 清除历史</text>
					</view>
				</view>
				<view class="before-search">
					<text style="background-color: #fff;min-width:124rpx;text-align:center;border-radius:90rpx;height:38rpx;line-height:38rpx;color:#252525" class="item" v-for="(item,index) in arr" :key="index"
						@click="search(arr[index])">{{arr[index]}}</text>
				</view>
			</view>

		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				form: {

				},
				arr: [],
				startX: '', // 触摸起始点横坐标
      			deltaX:'',
			}
		},
		mounted() {
			/*获取缓存数据*/
			this.getData();
		},
		props: ['isShow'],
		methods: {
			/*获取缓存里的搜索历史*/
			getData() {
				let self = this;
				/*获取搜索记录*/
				uni.getStorage({
					key: 'search_list',
					success: function(res) {
						if (res != null && res.data != null) {
							self.arr = res.data;
						}
					}
				});

			},
			/* 禁止手动滑动 */
			stopTouchMove() {
				return true
			},
			touchStart(event) {
				// 记录触摸起始点的横坐标
				this.startX = event.touches[0].clientX;
				},
				touchMove(event) {
				// 计算滑动距离
				const currentX = event.touches[0].clientX;
				this.deltaX = currentX - this.startX;
				},
				touchEnd() {
			// 判断滑动方向
				if (this.deltaX > 50) {
					// 向右滑动逻辑   这里只建议写一些性能消耗小的逻辑，比如：this.status = !this.status 因为当他的横坐标大于或小于50时，每隔一个数字都会执行一次，所以...非常消化性能
					console.log('向右滑动逻辑',this.deltaX,this.startX)
					this.$emit('close');
				} else if (this.deltaX < -50) {
					// 向左滑动逻辑   这里只建议写一些性能消耗小的逻辑，比如：this.status = !this.status 因为当他的横坐标大于或小于50时，每隔一个数字都会执行一次，所以...非常消化性能
					console.log('向左滑动逻辑',this.deltaX)
				}
				this.startX = 0;
				this.deltaX = 0;
				// 清除触摸起始点记录，这里也可以写一些比较复杂的逻辑，每滑动一次松后执行。
			},
			/*搜索*/
			search(str) {
				let self = this;
				let search = null;
				if (str != null) {
					search = str;
				} else {
					search = this.form.keyWord;
					let arrs = this.arr;
					if (typeof search != "undefined" && search != null && search != '') {
						arrs.push(search);
					} else {
						uni.showToast({
							title: '请输入搜索的关键字',
							icon: 'none',
							duration: 2000
						});
						return false;
					}
					/*设置搜索记录*/
					uni.setStorage({
						key: 'search_list',
						data: arrs,
						success: function() {
							console.log('success');
						}
					});
				}
				let category_id = 0;
				let sortType = 'all';

				self.gotoPage('/pages/product/list/list?search=' + search + '&category_id=' + category_id + '&sortType=' +
					sortType);

			},
			/*清楚缓存*/
			clearStorage() {
				let self = this;
				uni.removeStorage({
					key: 'search_list',
					success: function(res) {
						self.arr = [];
					}
				});
			},
			closeSearch(){
				this.$emit('close')
			}
		}
	}
</script>

<style>
	.search-wrap {
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #f5f5f5;
	}
	.border-round{
		border-radius:50rpx;
	}

	.search-wrap .index-search-box .search-box {
		padding: 0 20rpx;
		height: 64rpx;
		line-height: 64rpx;
		background: #F5F5F5;
		border-radius: 50rpx;
		overflow: hidden;
		font-size: 28rpx;
		color: #999;
		box-sizing: border-box;
	}

	.search-wrap .index-search-box button {
		height: 78rpx;
		line-height: 78rpx;
		border: solid 1rpx #CCCCCC;
		color: #333333;
		background: #FFFFFF;
	}
	.search-wrap .index-search-box{
		padding: 0 30rpx;
		padding-bottom: 30rpx;
		background-color: #F5F5F5;
	}
	.before-search {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-flow: wrap;
	}

	.before-search .item {
		padding: 16rpx;
		margin-right: 16rpx;
		margin-bottom: 16rpx;
		border-radius: 8rpx;
		color: #686868;
		background: #f0f2f5;
		font-size: 24rpx;
	}
	.reg180 {
		padding-left: 20rpx;
		text-align: center;
		transform: rotateY(180deg);
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	
	 .reg180 .icon-jiantou {
		color: #333333;
		display: block;
		width: 44rpx;
		height: 44rpx;
		line-height: 44rpx;
		font-size: 36rpx;
	}
</style>
