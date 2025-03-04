<template>
	<view>
		<view class="card " :style="{ backgroundColor: (tableData.length == 0 ? '#F7F8FA' : '#F7F8FA') }">
			<view style="position: fixed;top:0;left:0;background-color:#fff;z-index:9999">
				<view class="head_top" :style="'height:' + topBarTop() + 'px;'" ></view>
				<view class="address-bar ">
					<text class="card-title">购物车({{ tableData.length }})</text>
					<view class="f30" @click="isEdit = !isEdit">
						<button class="f24" v-if="isEdit">完成</button>
						<button class="f24" v-else>编辑</button>
					</view>
				</view>
			</view>
			<!--产品列表-->
			<template v-if="tableData.length > 0" txt="非空">
				
				<view class="scroll-good-box" style="margin-top: 150rpx;">
					<scroll-view scroll-y class="goods" @scrolltolower="scrolltolower" lower-threshold="50">
					<view class="card-box">
					<mark-slide-list :list="tableData" @addFunc="addFunc" @reduceFunc="reduceFunc"
						@changetotal="changetotal" @del="clear" @changeshop="changeshop" @checkItem="checkItem"
						ref="mychild" />
				</view>
				</scroll-view>
				</view>
				<!-- <view class="section">
					<view class="supplier_list">
						<view class="item" v-for="(item, index) in tableData" :key="index">
							<checkbox-group @change="checkItem(item, index)">
								<label class="d-c-c">
									<checkbox
										value="cb"
										class="checkbox"
										:checked="item.checked"
									/>
								</label>
							</checkbox-group>
							<image
								:src="item.productImage"
								class="cover"
								mode="aspectFit"
							></image>
							<view class="info">
								<view class="title">{{ item.productName }}</view>
								<view class="describe">{{ item.productAttr }}</view>
								<view class="level-box count_choose">
									<view class="price">
										¥
										<text class="num">{{ item.productPrice }}</text>
									</view>
									<view class="num-wrap">
										<view
											class=""
											@tap.stop="reduceFunc(item)"
											v-if="item.totalNum > 1"
										>
											<image
												class="reduce_icon"
												src="../../static/icon/reduce.png"
												mode=""
											>
											</image>
										</view>
										<view class="text-wrap">{{ item.totalNum }}</view>
										<view
											class=""
											@tap.stop="addFunc(item)"
											v-if="item.totalNum < item.stockNum"
										>
											<image
												class="add_icon"
												src="../../static/icon/add.png"
												mode=""
											></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view> -->
			</template>
			<template v-else txt="null">
				<view class="address-bar ">
					<text class="card-title">购物车</text>
				</view>
				<view class="none-data-box cart_none">
					<image class="cart_none_img" src="/static/home/cart/null.png" mode="widthFix" lazy-load="true"></image>
					<text class="f24 gray9 pt10">购物车空空如也</text>
					<!-- <button
						type="default"
						class="theme-btn mt30 ww100 none_btn"
						@tap="gotoShop"
					>
						去购物
					</button> class="recommended"-->
				</view>
				<view class="recommended" v-if="recommendSwitch==0">
					<!-- <view class="recommended-title" style="color: #000;"> ——— 猜你喜欢 ——— </view> -->
					<view class="recommended-title" style="color: #000;"> ——— 猜你喜欢 ——— </view>
				</view>
				<view class="goods-box " v-if="recommendSwitch==0">


					<template v-for="(item, key) in listData" :key="key">
						<goodsBlock :parentitem="item" @custom-event="receiveFromChild"></goodsBlock>
					</template>
				</view>

			</template>
			<!-- {{ tableData }} -->
			<!--底部按钮-->
			<view class="bottom-btns f28" :class="isAuto ? 'isAuto' : ''" v-if="tableData.length > 0">
				<checkbox-group @change="onCheckedAll">
					<label class="d-c-c mr20">
						<checkbox class="checkbox" :checked="checkedAll" value="cb" color="#FFFFF" borderColor="#99999"
							activeBorderColor="#101010" activeBackgroundColor="#000" iconColor="#fff" />
						全选
					</label>
				</checkbox-group>
				<view class=""> </view>
				<view class="d-e-c" v-if="!isEdit">
					<view class="total d-s-c flex-1 mr10" style="font-size: 20rpx;">
						<text>已选：{{chooseNum}}</text><text>件，</text>
						<text>合计：</text>
						<view class="price f28" style="margin-top:-16rpx;">
							¥
							<text class="num f40" style="top:4rpx;position:relative">{{ toPositive(totalPrice) }}</text>
						</view>
					</view>
					<button type="primary" class="buy-btn" @click="Submit()">
						去结算
					</button>
				</view>
				<view class="" v-else><button type="primary" @click="onDelete()" class="delete-btn mr20">
						删除
					</button>
				</view>
			</view>
			<!--推荐-->
			<recommendProduct :location="10"></recommendProduct>
		</view>
		<!-- <tabBar></tabBar> -->
		<keep-alive>
			<tabBar></tabBar>
		</keep-alive>
		<uiPopup v-if="confirmBoxOrder" style="z-index: 99999;">
			<view class="confirm-box">
				<view class="confirm-box-title"> 删除提示 </view>
				<view class="confirm-box-describe"> 确认删除商品吗? </view>
				<view class="confirm-box-btn" slot="btnBox">
					<view style="border: 1.5rpx solid #000;margin-right:40rpx" class="ui-btn btn-more btn-width" @click="closeOrder">取消</view>
					<view class="ui-btn btn-more btn-width btn-black" @click="close_delectOrder">确认</view>
				</view>
			</view>
		</uiPopup>
		<!-- <div style="position: fixed;bottom: 0;width: 100%;height: 600rpx;background: rgba(0,0,0,0.5);z-index:99999999">4564564</div> -->



		<!--购物确定方便快捷购物用的-->
		<spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec>

	</view>
</template>

<script>
import UiPopup from '@/pages/component/ui-popup.vue';
import recommendProduct from '@/components/recommendProduct/recommendProduct.vue';
import markSlideList from '@/pages/component/mark-slide-list.vue';
import goodsBlock from '@/pages/component/goodsBlock.vue';
import spec from '../product/detail/popup/spec.vue';
export default {
	components: {
		recommendProduct,
		markSlideList,
		goodsBlock,
		UiPopup,
		spec
	},
	data() {
		return {
			recommendSwitch:0,
			/*是否加载完成*/
			loadding: true,
			isEdit: false,
			/*购物车商品*/
			tableData: [],
			arrIds: [],
			// 是否全选
			checkedAll: false,
			isAuto: 0,
			totalPrice: 0,
			chooseNum:0,
			listData: [],
			confirmBoxOrder: false,
			/*是否确定购买弹窗*/
			isPopup: false,
			/*购物车商品数量*/
			cart_total_num: 0,
			/*子级页面传参*/
			productModel: {},
			// 商品属性
			specData: null,
			/*已经选择的规格*/
			alreadyChioce: '',
			/*商品详情*/
			detail: {
				productSku: {},
				showSku: {
					productPrice: '',
					productSkuId: 0,
					linePrice: '',
					stockNum: 0,
					skuImage: '',
				},
			},
		};
	},
	onLoad() { },
	onShow() {
		this.getuserinfo();
		/*获取产品详情*/
		this.getData();
		this.getTabBarLinks();
		//this.searchFunc()
	},

	methods: {
		getuserinfo(){
        let self = this;
        self._get("user/user/getInfo", {}, function (res) {
            console.log("用户信息")
            console.log(res)
            if(res.code==1){
                // self.uerinfo = res.data;
                self.recommendSwitch = res.data.recommendSwitch;
                uni.setStorageSync('uerinfo', res.data);
            }
        }
      )
},
		toPositive(price) {
			return price
		// 	if(price<0){
		// 		return '????'
		// 	}
		// return Math.max(0, price);
		},
		receiveFromChild(data) {
			let self = this
			self._get(
				'product/product/detail',
				{
					productId: data.productId,
				},
				(res) => {
					if (res.data.detail.specType == 20) {
						self.initSpecData(res.data.specData);
					} else {
						self.specData = null
					}
					self.detail = res.data.detail;
					self.isPopup = data.isPopup // 显示弹窗
					let obj = {
						specData: self.specData,
						detail: self.detail,
						productSpecArr:
							self.specData != null ? new Array(self.specData.specAttr.length) : [],
						showSku: {
							skuImage: '',
							price: 0,
							productSkuId: 0,
							linePrice: 0,
							stock: 0,
							sum: 1,
						},
						plusSku: null,
						type: "card",
						plusName: '',
					};
					self.productModel = obj;
				}
			)
		},
		/*多规格商品*/
		initSpecData(data) {

			for (let i in data.specAttr) {
				for (let j in data.specAttr[i].specItems) {
					data.specAttr[i].specItems[j].checked = false;
				}
			}
			this.specData = data;
			if (this.specData.specAttr) {
				this.specData.specAttr.forEach((item) => {
					this.alreadyChioce += item.groupName;
					this.alreadyChioce += ' / ';
				});
				this.alreadyChioce = this.alreadyChioce.replace(/(\s\/\s)$/gi, '');
			}
		},
		/*关闭弹窗*/
		closePopup(e, cart_total_num) {
			 console.log("关闭弹框")
			//   console.log(e)

           
			this.isPopup = false;

			this.getData()
			if (e && e.specAttr) {
				this.alreadyChioce = '';
				let has = '已选：';
				let noone = '';
				e.specAttr.forEach((item) => {
					if (item.specItems) {
						let h = '';
						for (let i = 0; i < item.specItems.length; i++) {
							let child = item.specItems[i];
							if (child.checked) {
								child.checked = false;
								h = child.specValue + ' / ';
								break;
							}
						}
						if (h != '') {
							has += h;
						} else {
							noone += item.groupName;
						}
					}
				});
				if (noone != '') {
					this.alreadyChioce = noone;
				} else {
					has = has.replace(/(\s\/\s)$/gi, '');
					this.alreadyChioce = has;
				}
			}
			if (cart_total_num) {
				this.cart_total_num = cart_total_num;
			}
		},



		closeOrder() {
			this.confirmBoxOrder = false;
			uni.showTabBar()
		},

		searchFunc() {
			//this.listData = [];
			this.page = 1;
			//  搜索为空请求猜你猜你喜欢的产品
			let self = this;
			self._postBody('product/productRecommen/lists', {
				code: "maybe"
			}, function (res) {
				if (res.code === 1) {
					self.listData = res.data.records;
				}
			});

		},



		changenum(item, ids) {

		},
		async changeshop(item) {
			console.log("changeshop")
			console.log(item)
		},
		changetotal(ids) { },
		clear(ids, index) {// 侧滑删除的ids,//单个 因为是滑动只能单个删除,
			let self = this
			self._post(
				'order/cart/delete',
				{
					cartIds: [ids],
				},
				function (res) {
					if (res.code == 1) {
						uni.showToast({
							title: '删除成功',
							icon: 'none',
						});
						self.$refs.mychild.recover(index)
						self.getData();

					}

				}
			);



		},

		/*获取数据*/
		getData() {
			// uni.showLoading({
			// 	title: '加载中',
			// });
			let self = this;
			self._post('order/cart/lists', {}, function (res) {

				let auto =
					uni.getStorageSync('TabBar').isAuto &&
					uni.getStorageSync('TabBar').isAuto != 0;
				self.isAuto = auto;
				uni.hideLoading();

				if (res.data.length > 0) {
					self.tableData = res.data;
					self.loadding = false;
					self._initGoodsChecked();
					uni.setTabBarBadge({
						index: 3,
						color:'#BE1E1E',
						 text: `${res.data.length}`
				})

				} else if (res.data.length == 0) {
					self.tableData = []
					self.searchFunc()
					uni.removeTabBarBadge({ index: 3 });//移除条数

				}

				//self.tableData = res.data;
				self.loadding = false;
				//self._initGoodsChecked();
			});
		},
		/**
		 * 初始化商品选中状态
		 */
		_initGoodsChecked() {
			let self = this;
			let checkedData = self.getCheckedData();
			// 将商品设置选中
			self.tableData.forEach((item) => {
				item.checked = self.inArray(
					`${item.productId}_${item.specSkuId}`,
					checkedData
				);
			});
			self.isEdit = false;
			self.checkedAll = checkedData.length == self.tableData.length;
			// 更新购物车已选商品总价格
			self.updateTotalPrice();
		},

		/**
		 * 获取选中的商品
		 */
		getCheckedData() {
			let checkedData = uni.getStorageSync('checkedData');


			console.log("canghu")
			console.log(checkedData)
			return checkedData ? checkedData : [];
		},

		/*单选*/
		async checkItem(e, index) {
			const hasCheck = this.getCheckedData().length > 0;
			if (hasCheck) {
				// await this.resetChecked();

				e.checked = !e.checked;
				this.tableData[index] = e;
			} else {
				e.checked = !e.checked;
				this.tableData[index] = e;
			}
			// // 更新选中记录
			this.onUpdateChecked();
			// // 更新购物车已选商品总价
			this.updateTotalPrice();
			// // 更新全选状态
			this.checkedAll = this.getCheckedData().length == this.tableData.length;
		},

		/* 重置选中 */
		resetChecked() {
			return Promise.resolve().then(() => {
				this.tableData.forEach((item) => {
					item.checked = false;
				});
			});
		},

		/**
		 * 更新商品选中记录
		 */
		onUpdateChecked() {



			let self = this,
				checkedData = [];
			self.tableData.forEach((item) => {
				if (item.checked == true) {
					checkedData.push(`${item.productId}_${item.specSkuId}`);
				}
			});
			uni.setStorageSync('checkedData', checkedData);
		},
		/*全选*/
		onCheckedAll() {
			let self = this;
			self.checkedAll = !self.checkedAll;
			self.tableData.forEach((item) => {
				item.checked = self.checkedAll;
			});
			self.updateTotalPrice();
			// 更新选中记录
			self.onUpdateChecked();
		},
		updateTotalPrice: function () {
			let total_price = 0;
			let chooseNum = 0;
			let items = this.tableData;
			// console.log("======dwdw====")
			// console.log(items)

			for (let i = 0; i < items.length; i++) {
				if (items[i]['checked'] == true) {
					total_price += items[i]['totalNum'] * items[i]['productPrice'];
					chooseNum += items[i]['totalNum'];
				}
			}
			/*保留2位小数*/
			this.totalPrice = total_price.toFixed(2);
			this.chooseNum = chooseNum;
		},
		/*去结算*/
		Submit() {
			let arrIds = [];
			this.tableData.forEach((item) => {
				if (item.checked == true) {
					arrIds.push(`${item.productId}_${item.specSkuId}`);
				}
			});
			if (arrIds.length == 0) {
				uni.showToast({
					title: '请选择商品',
					icon: 'none',
				});
				return false;
			}

		   // console.log(arrIds)
		this.gotoPage('pages/order/saveOrder?orderType=cart&cartIds=' + arrIds);
		},
		/*添加*/
		addFunc(item) {
			console.log("item", item)
			let self = this;
			uni.showLoading({
				title: '加载中',
			});
			self._post(
				'order/cart/add',
				{
					productId: item.productId,
					specSkuId: item.specSkuId,
					totalNum: 1,
				},
				function (res) {
					self.loadding = false;
					self.getData();
					self.getCartNum();
				},
				function () {
					self.loadding = false;
				}
			);
		},
		getCartNum() {
			let self = this;
			self._post('order/cart/lists', {}, function (res) {
				let auto =
					uni.getStorageSync('TabBar').isAuto &&
					uni.getStorageSync('TabBar').isAuto != 0;
				self.isAuto = auto;
				uni.hideLoading();
				if (res.data.length > 0) {
					self.loadding = false;
					uni.setTabBarBadge({
						index: 3,
						color:'#BE1E1E',
						 text: `${res.data.length}`
				})

				} else if (res.data.length == 0) {
					uni.removeTabBarBadge({ index: 3 });//移除条数

				}
				self.loadding = false;
			});
		},
		/*减少*/
		reduceFunc(item) {
			let self = this;
			if (item.total_num <= 1) {
				return;
			}
			uni.showLoading({
				title: '加载中',
			});
			self._post(
				'order/cart/sub',
				{
					productId: item.productId,
					specSkuId: item.specSkuId,
				},
				function (res) {
					self.loadding = false;
					self.getData();
				},
				function () {
					self.loadding = false;
				}
			);
		},







		/*删除购物车*/
		onDelete() {


			let self = this;
			let cartIds = self.getCheckedIds();
			if (!cartIds.length) {
				self.showError('您还没有选择商品');
				return false;
			}

			self.confirmBoxOrder = true;
			uni.hideTabBar()
			// uni.showModal({
			// 	title: '提示',
			// 	content: '您确定要移除选择的商品吗?',
			// 	success(e) {
			// 		e.confirm &&
			// 			self._post(
			// 				'order/cart/delete',
			// 				{
			// 					cartIds: cartIds,
			// 				},
			// 				function (res) {
			// 					// 删除选中的商品
			// 					self.onDeleteEvent(cartIds);
			// 					self.getData();
			// 				}
			// 			);
			// 	},
			// });




		},



		close_delectOrder() {//. 自定义删除的弹框
			let self = this;
			let cartIds = self.getCheckedIds();
			console.log(cartIds)
			self._post(
				'order/cart/delete',
				{
					cartIds: cartIds,
				},
				function (res) {
					self.confirmBoxOrder = false
					uni.showTabBar()
					// 删除选中的商品
					self.onDeleteEvent(cartIds);
					self.getData();
				}
			);
		},
		/**
		 * 获取已选中的商品
		 */
		getCheckedIds() {
			let self = this;
			let arrIds = [];
			self.tableData.forEach((item) => {
				if (item.checked === true) {
					arrIds.push(item.cartId);
				}
			});
			return arrIds;
		},

		/**
		 * 商品删除事件
		 */
		onDeleteEvent(cartIds) {
			let self = this;
			cartIds.forEach((cartId) => {
				self.tableData.forEach((item, productIndex) => {
					if (cartId == item.cartId) {
						self.tableData.splice(productIndex, 1);
					}
				});
			});
			// 更新选中记录
			self.onUpdateChecked();
			return true;
		},
		/**
		 * 是否在数组内
		 */
		inArray(search, array) {
			for (var i in array) {
				if (array[i] == search) {
					return true;
				}
			}
			return false;
		},

		/*去购物*/
		gotoShop() {
			uni.switchTab({
				url: '/pages/index/index',
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.uni-tabbar__reddot .uni-tabbar__badge{
	background-color:#f43530 !important;
}
uni-page-body {
	/* 隐藏默认的下拉刷新样式 */
	min-height:auto !important;	
  }
.f24{
	color: #B7B7B7;
}
.recommended {
	display: flex;
	justify-content: center;
	align-items: center;
	color: #999999;
	margin-bottom: 18rpx;

	.recommended-title {
		font-family: Hiragino Sans GB, Hiragino Sans GB;
		font-weight: normal;
		font-size: 28rpx;
		//color: #252525;
		font-style: normal;
		text-transform: none;
	}

	.recomm-main {
		padding-top: 20rpx;
		display: flex;
		flex-wrap: wrap;
		align-content: center;
	}

	.recomm-item {
		margin-top: 12rpx;
		margin-right: 24rpx;
		border: 1rpx #ddd solid;
		padding: 16rpx 38rpx;
		background: #fff;
		color: #333;
		border-radius: 90rpx;
		border: 1px solid #F7F7F7;
	}

}

// page {
// 	background-color: #F8F8F8;
// }
.card {
	min-height: calc(100vh - 100rpx);
	background: #F7F8FA;
	overflow: hidden;
}

.card-box {
	overflow: hidden;
	padding: 0 24rpx;
}

.scroll-good-box {
    //height: calc(100vh - 100rpx - 100rpx);
    //padding-top: 60rpx;
    .card-box{
      //height: calc(100vh - 100rpx - 200rpx);
    
    }
    
  }

.goods-box {
	display: flex;
	flex-wrap: wrap;
}

.foot_ {
	height: 98rpx;
	width: 100%;
}

.card .scroll-Y {
	position: relative;
}

.card .checkbox {
	@include font_color('font_color');
	transform: scale(0.7);
}

.address-bar {
	width: 710rpx;
	padding: 20rpx;
	// background-color: #f2f2f2;
	position: relative;
	text-align: center;

	.card-title {
		font-family: Hiragino Sans, Hiragino Sans;
		font-weight: normal;
		font-size: 32rpx;
		color: #424242;
	}
}

.address-bar button {
	border: none;
	background: none;
	position: absolute;
	right: 0;
	top: 6rpx;

	font-family: Hiragino Sans, Hiragino Sans;
	font-weight: normal;
	font-size: 28rpx;
	color: #424242;
}

.section {
	background: #f2f2f2;
	padding: 20rpx;
}

.section .item {
	margin: 0 26rpx;
	display: flex;
	align-items: center;
	// border: 1px solid #f2f2f2;
	padding-right: 19rpx;
	padding-bottom: 29rpx;
	padding-top: 29rpx;
}

.section .cover {
	width: 150rpx;
	height: 150rpx;
	border-radius: 8px;
}

.section .info {
	flex: 1;
	padding-left: 30rpx;
	box-sizing: border-box;
	overflow: hidden;
}

.section .title {
	width: 100%;
	font-size: 26rpx;
	display: -webkit-box;
	overflow: hidden;
	-webkit-box-orient: vertical;
}

.vender .list .describe {
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.section .describe {
	margin-top: 20rpx;
	font-size: 24rpx;
	color: #999999;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.section .price {
	// color: $dominant-color;
	@include font_color('font_color');
	font-size: 24rpx;
}

.bottom-btns.isAuto2 {
	bottom: calc(env(safe-area-inset-bottom) + 98rpx);
}

.section .price .num {
	padding: 0 4rpx;
	font-size: 32rpx;
}

.section .level-box {
	margin-top: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.section .level-box .key {
	font-size: 24rpx;
	color: #999999;
}

.section .level-box .num-wrap {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.section .level-box .icon-box {
	width: 33rpx;
	height: 33rpx;
	border: 1px solid #c5c5c5;
	background: #f2f2f2;
}

.section .level-box .icon-box .gray {
	color: #cccccc;
}

.section .level-box .icon-box .gray3 {
	color: #333333;
}

.section .level-box .text-wrap {
	margin: 0 20rpx;
	height: 33rpx;
	border: none;
	background: none;
}

.section .level-box .text-wrap input {
	padding: 0 4rpx;
	height: 33rpx;
	line-height: 1;
	width: 40rpx;
	font-size: 32rpx;
	text-align: center;
	display: flex;
	align-items: center;
	min-height: 33rpx;
}

.bottom-btns {
	position: fixed;
	width: 100%;
	padding: 0 0 0 20rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 90rpx;
	margin-bottom: 0rpx;
	// /* bottom: calc(var(--window-bottom); */
	bottom: var(--window-bottom, 0);
	// bottom: 50px;
	left: 0;
	box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
	background: #ffffff;
	z-index: 1000;
}

.bottom-btns .delete-btn {
	margin: 0;
	padding: 0 30rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	margin-right: 20rpx;

	// background: linear-gradient(90deg, #FF6B6B 4%, #F6220C 100%);
	font-size: 26rpx;
	background: #000;
	color: #fff;
}

.bottom-btns .buy-btn {
	margin: 0;
	padding: 0 24rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	// background: linear-gradient(90deg, #FF6B6B 4%, #F6220C 100%);
	font-size: 26rpx;
	background: #000;
	color: #fff;
	margin-right: 20rpx;
}

.bottom-btns .price {
	@include font_color('price_color');
}

.supplier_list {
	overflow: hidden;
	background-color: #ffffff;
	border-radius: 15rpx;
	margin-bottom: 30rpx;
}

.supplier_list_tit {
	display: flex;
	align-items: center;
	margin-left: 28rpx;
	margin-top: 28rpx;
}

.icon-dianpu1 {
	font-size: 34rpx;
	color: #333333;
	margin: 0 17rpx;
}

.cart_none .cart_none_img {
	width: 484rpx;
	height: 300rpx;
}

.none_btn {
	font-size: 32rpx;
	border-radius: 40rpx;
}

.add_icon,
.reduce_icon {
	width: 32rpx;
	height: 32rpx;
}
</style>
