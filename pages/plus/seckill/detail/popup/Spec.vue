<template>
	<view :class="Visible ? 'product-popup open' : 'product-popup close'" @touchmove.stop.prevent="" @click="closePopup">
		<view class="popup-bg"></view>
		<view class="main" v-on:click.stop>
			<view class="header">
				<image :src="form.showSku.skuImage" mode="aspectFit" class="avt"></image>
				<view class="price d-s-c">
					<template v-if="form.specData == null||isAll">
						<text>¥</text>
						<text class="num fb">{{ form.showSku.seckillPrice }}</text>
						<text class="old-price">¥{{ form.showSku.linePrice }}</text>
					</template>
					<template v-else>
						<text class="f22">¥</text>
						<text class="f40 fb">{{ form.detail.seckillPrice }}</text>
					</template>
				</view>
				<!-- <view class="stock">库存：{{ form.showSku.seckillStock }}</view> -->
				<view class="p-20-0 select_spec">{{ selectSpec }}</view>
				<view class="close-btn" @click="closePopup"><text class="icon iconfont icon-guanbi"></text></view>
			</view>

			<view class="body">

				<view v-if="form.specData">
					<scroll-view scroll-y="true" class="specs mt20" style="max-height: 600rpx;" v-if="form.specData !=null">
						<view class="specs mt20" v-for="(item_attr,attr_index) in form.specData.specAttr" :key="attr_index">
							<view class="specs-hd p-20-0">
								<text class="f24 gray9">{{item_attr.groupName}}</text>
								<text class="ml10 red" v-if="form.productSpecArr[attr_index]==null">
									请选择{{item_attr.groupName}}
								</text>
							</view>
							<view class="specs-list">
								<button :class="item.checked ? 'btn-checked' : 'btn-checke'" v-for="(item,item_index) in item_attr.specItems"
								 :key="item_index" @click="selectAttr(attr_index, item_index)">{{item.specValue}}
								</button>
							</view>

						</view>
					</scroll-view>
				</view>
				<!--选择数量-->
				<view class="level-box count_choose">
					<text class="key">数量</text>
					<view class="d-s-c">
						<view class="icon-box minus d-c-c" @click="sub()" :class="{ 'num-wrap': !issub }"><text class="icon iconfont icon-jian"
							 style="font-size: 20rpx;color: #333333;"></text></view>
						<view class="text-wrap"><input type="text" v-model="form.showSku.sum"   /></view>
						<view class="icon-box plus d-c-c" :class="{ 'num-wrap': !isadd }" @click="add()"><text class="icon iconfont icon-jia"
							 style="font-size: 20rpx;color: #333333;"></text></view>
					</view>
				</view>
			</view>
			<view class="btns white"><button class="confirm-btn" @click="confirmFunc(form)">确认</button></view>
		</view>
	</view>
</template>

<script>
	import {
		judgeSelect
	} from '@/common/specSelect.js';
	export default {
		data() {
			return {
				/*是否可见*/
				Visible: false,
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 400,
				form: {
					detail: {
						productSku: {},
						showSku: {},
						showPointSku: {
							seckillPrice: 0
						}
					},
					showSku: {
						sum: 1
					},
					specData: null
				},
				/*当前商品总库存*/
				stock: 0,
				/*选择提示*/
				selectSpec: '',
				/*规格是否选择完整*/
				isAll: false
			};
		},
		props: ['isPopup', 'productModel'],
		onLoad() {},
		mounted() {},
		computed: {
			/*判断增加数量*/
			isadd: function() {
				return this.form.showSku.sum >= this.stock || this.form.showSku.sum >= this.form.detail.limitNum;
			},

			/*判断减少数量*/
			issub: function() {
				return this.form.showSku.sum <= 1;
			}
		},
		watch: {
			'isPopup': function(n, o) {
				if (n != o) {
					this.Visible = n;
					if (!this.isOpenSpec) {
						this.form = this.productModel;
						this.isOpenSpec = true;
						this.initShowSku();
						this.form.specData.specAttr.forEach((item,index)=>{
							this.selectAttr(index,0);
						})
					}
					this.form.type = this.productModel.type;
				}
			},

			'form.specData': {
				handler(n, o) {
					let str = '',
						select = '';
					this.isAll = true;
					if (n) {
						if (n != '') {
							for (let i = 0; i < n.specAttr.length; i++) {
								if (this.form.productSpecArr[i] == null) {
									this.isAll = false;
									str += n.specAttr[i].groupName + ' ';
								} else {
									n.specAttr[i].specItems.forEach(item => {
										if (this.form.productSpecArr[i] == item.itemId) {
											select += '\"' + item.specValue + '\" ';
										}
									});
								}
							}
						}
						if (!this.isAll) {
							str = '请选择: ' + str;
						} else {
							select = '已选: ' + select;
						}
						this.selectSpec = this.isAll ? select : str;
					} else {

					}
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			/*初始化*/
			init() {
				let _this = this;
				_this.phoneHeight = res.scrollviewHigh;
			},
			/*关闭弹窗*/
			closePopup() {
				this.$emit('close', this.form.specData, null);
			},
			initShowSku() {
				this.form.showSku.skuImage = this.form.detail.image[0].filePath;
				this.form.showSku.seckillPrice = this.form.detail.seckillPrice;
				this.form.showSku.productSkuId = 0;
				this.form.showSku.linePrice = this.form.detail.linePrice;
				this.form.showSku.seckillStock = this.form.detail.stock;
				this.form.showSku.sum = 1;
				this.stock = this.form.detail.productStock;
			},
			/*确认提交*/
			confirmFunc() {
				if (this.form.specData != null && !this.isAll) {
					uni.showToast({
						title: '请选择规格',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				this.createdOrder();
			},

			/*选择属性*/
			selectAttr(attr_index, item_index) {
				let self = this;
				let items = self.form.specData.specAttr[attr_index].specItems;
				let curItem = items[item_index];
				if (curItem.checked) {
					curItem.checked = false;
					self.form.productSpecArr[attr_index] = null;
				} else {
					for (let i = 0; i < items.length; i++) {
						items[i].checked = false;
					}
					curItem.checked = true;
					self.form.productSpecArr[attr_index] = curItem.itemId;
				}

				/*判断哪些规格可以选*/
				judgeSelect(self.form.specData.specAttr, attr_index, self.form.productSpecArr, self.form.productSku);

				let isall = true;
				for (let i = 0; i < self.form.productSpecArr.length; i++) {
					let item = self.form.productSpecArr[i];
					if (item == null) {
						isall = false;
						self.initShowSku();
						return;
					}
				}

				if (!isall) {
					self.initShowSku();
					return;
				}

				// 更新商品规格信息
				self.updateSpecProduct();
			},

			/*更新商品规格信息*/
			updateSpecProduct() {
				let self = this;
				let specSkuId = self.form.productSpecArr.join('_');
				// 查找skuItem
				let specList = self.form.specData.specList,
					skuItem = specList.find(val => {
						return val.specSkuId == specSkuId;
					});
				// 记录product_sku_id
				// 更新商品价格、划线价、库存
				if (typeof skuItem === 'object') {
					let pointSkuList = self.form.detail.seckillSku,
						seckillSkuItem = pointSkuList.find(val => {
							return val.productSkuId == skuItem.productSkuId;
						});
					/*保存当前规格*/
					self.stock = seckillSkuItem.seckillStock;
					if (self.form.showSku.sum > self.stock) {
						self.form.showSku.sum = self.stock > 0 ? self.stock : 1;
					}
					self.form.showSku.linePrice = skuItem.specForm.productPrice;
					self.form.showSku.productSkuId = skuItem.specSkuId;
					self.form.showSku.seckillPrice = seckillSkuItem.seckillPrice;
					self.form.showSku.seckillProductSkuId = seckillSkuItem.seckillProductSkuId;
					self.form.showSku.seckillStock = seckillSkuItem.seckillStock;
					if (skuItem.specForm.imageId > 0) {
						self.form.showSku.skuImage = skuItem.specForm.imagePath;
					} else {
						self.form.showSku.skuImage = self.form.detail.image[0].filePath;
					}
				}
			},

			/*创建订单*/
			createdOrder() {
				let self = this;
				self.$emit('confirm')
				let seckillProductId = self.form.detail.seckillProductId;
				let num = self.form.showSku.sum;
				let productSkuId = self.form.showSku.productSkuId;
				let seckillProductSkuId = self.form.showSku.seckillProductSkuId;
				if(self.form.detail.specType!=20){
					productSkuId =self.form.detail.seckillSku[0].productSkuId
					seckillProductSkuId =self.form.detail.seckillSku[0].seckillProductSkuId
				}
				this.gotoPage('pages/order/saveOrder?productNum=' +
						num +
						'&seckillProductId=' +
						seckillProductId +
						'&productSkuId=' +
						productSkuId +
						'&seckillProductSkuId=' +
						seckillProductSkuId +
						'&orderType=seckill');
			},

			/*商品增加*/
			add() {
				if (this.stock <= 0) {
					return;
				}
				if (this.form.showSku.sum >= this.stock) {
					uni.showToast({
						title: '数量超过了库存',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				if (this.form.showSku.sum >= this.form.detail.limitNum) {
					uni.showToast({
						title: '数量超过了限购数量',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				this.form.showSku.sum++;
			},

			/*商品减少*/
			sub() {
				if (this.stock <= 0) {
					return;
				}
				if (this.form.showSku.sum < 2) {
					uni.showToast({
						title: '商品数量至少为1',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				this.form.showSku.sum--;
			}
		}
	};
</script>

<style lang="scss">
	.product-popup {}

	.product-popup .popup-bg {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, .6);
		z-index: 99;
	}

	.product-popup .main {
		position: fixed;
		width: 100%;
		// bottom: 0;
		min-height: 200rpx;
		// max-height: 900rpx;
		background-color: #fff;
		transform: translate3d(0, 980rpx, 0);
		transition: transform .2s cubic-bezier(0, 0, .25, 1);
		bottom: env(safe-area-inset-bottom);
		border-radius: 12rpx;
		z-index: 99;
	}

	.product-popup.open .main {
		transform: translate3d(0, 0, 0);
		z-index: 99;
	}

	.product-popup.close .popup-bg {
		display: none;
	}

	.product-popup.close .main {
		display: none;
		z-index: -1;
	}


	.product-popup .header {
		min-height: 120rpx;
		padding: 40rpx 0 40rpx 250rpx;
		position: relative;
		border-bottom: 1px solid #eeeeee;
	}

	.product-popup .header .avt {
		position: absolute;
		top: 10rpx;
		left: 30rpx;
		width: 180rpx;
		height: 180rpx;
		border: 2px solid #ffffff;
		background: #ffffff;
		border-radius: 12rpx;
	}

	.product-popup .header .stock {
		font-size: 26rpx;
		color: #999999;
	}

	.product-popup .close-btn {
		position: absolute;
		width: 40rpx;
		height: 40rpx;
		top: 40rpx;
		right: 30rpx;
	}

	.product-popup .price {
		height: 80rpx;
		color: $dominant-color;
		font-size: 30rpx;
	}

	.product-popup .price .num {
		padding: 0 4rpx;
		font-size: 50rpx;
	}

	.product-popup .old-price {
		margin-left: 10rpx;
		font-size: 30rpx;
		color: #999999;
		text-decoration: line-through;
	}

	.product-popup .body {
		padding: 20rpx 30rpx 39rpx 30rpx;
		// max-height: 600rpx;
		overflow-y: auto;
		padding-bottom: 88rpx;
	}

	.product-popup .level-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.product-popup .level-box .key {
		font-size: 24rpx;
		color: #999999;
	}

	.product-popup .level-box .icon-box {
		width: 48rpx;
		height: 40rpx;
		background: #e0e0e0;
	}

	.product-popup .num-wrap .iconfont {
		color: #666;
	}

	.product-popup .num-wrap.no-stock .iconfont {
		color: #cccccc;
	}

	.product-popup .level-box .text-wrap {
		margin: 0 4rpx;
		height: 60rpx;
		border: none;
		background: #ffffff;
	}

	.product-popup .level-box .text-wrap input {
		padding: 0 10rpx;
		height: 60rpx;
		line-height: 60rpx;
		width: 80rpx;
		text-align: center;
		font-size: 32rpx;
	}

	.specs .specs-list {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	}

	.specs .specs-list button {
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		font-size: 24rpx;
	}

	.specs .specs-list button:after,
	.product-popup .btns button,
	.product-popup .btns button:after {
		border: 0;
		border-radius: 0;
		margin-bottom: 55rpx;
	}

	.product-popup .btns .confirm-btn {
		width: 710rpx;
		height: 80rpx;
		background: linear-gradient(90deg, #FF6B6B 4%, #F6220C 100%);
		border-radius: 40rpx;
		margin: 0 auto;
		margin-bottom: 55rpx;
		background-color: #FFFFFF;
		color: #FFFFFF;
		line-height: 80rpx;
		font-size: 32rpx;
	}

	.select_spec {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.btn-checked {
		border: 1px solid #F6220C;
		border-radius: 6px;
		color: #F6220C;
		font-size: 26rpx;
		background-color: #FFFFFF;
	}

	.btn-checke {
		border: 1rpx solid #D9D9D9;
		border-radius: 6rpx;
		font-size: 26rpx;
		color: #333333;
		background-color: #FFFFFF;
	}
</style>
