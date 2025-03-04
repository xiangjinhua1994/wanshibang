<template>
	<view :class="Visible ? 'product-popup open' : 'product-popup close'" @touchmove.stop.prevent="" @click="closePopup">
		<view class="popup-bg"></view>
		<view class="main" v-on:click.stop>
			<view class="header">
				<!-- <image :src="form.showSku.skuImage" mode="aspectFit" class="avt"></image> -->
				<!-- <view class="price">
					¥
					<text class="num">{{ form.showSku.productPrice  }}</text>
					<text class="old-price" v-if="form.showSku.linePrice">¥{{ toPositive(form.showSku.linePrice) }}</text>
				</view> -->
				<view class="stock">共{{ productModel.length }}件商品</view>
				<!-- <view class="select_spec">{{ selectSpec }}</view> -->
				<view class="close-btn" @click="closePopup"><text class="icon iconfont icon-guanbi"></text></view>
			</view>

			<view class="body" style="margin-bottom: 40rpx;">
				<!--规格-->
				<view v-for="item in productModel" style="margin-bottom: 20rpx;">
                    <view style="display: flex;">
                        <view>
                            <image :src="item.imagePath" mode="aspectFit" class="avt" style="width:92rpx;height:92rpx;"></image>
                        </view>
                        <view style="margin-left: 36rpx;">
                            <view style="color:#040404" class="ellipsis">{{item.productName}}</view>
                            <view style="color:#ADADAD;margin-top:20rpx">{{item.productAttr}}</view>

                        </view>

                    </view>
                   

					
				</view>
				<!--选择数量-->
				
			</view>
				
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			/*是否可见*/
			Visible: false,
			/*表单对象*/
			form: {
				detail: {},
				showSku: {
					skuImage: ''
				}
			},
			/*当前商品总库存*/
			stock: 0,
			/*选择提示*/
			selectSpec: '',
			/*是否打开过多规格选择框*/
			isOpenSpec: false,
			type: '',
			clock: false
		};
	},
	props: ['isPopup', 'productModel'],
	onLoad() {},
	mounted() {

	},
	computed: {
		/*判断增加数量*/
		
	},
	watch: {
		isPopup: function(n, o) {
			if (n != o) {
				this.Visible = n;
				// if (!this.isOpenSpec) {
				// 	this.form = this.productModel;
				// 	this.isOpenSpec = true;
				// 	this.initShowSku();
				// }
				//this.form = this.productModel;
				//this.initShowSku();
				//this.form.type = this.productModel.type;
			}
		},
		'form.specData': {
			handler(n, o) {
				let str = '',
					select = '';
				this.isAll = true;
				if (n) {
					for (let i = 0; i < n.specAttr.length; i++) {
						if (this.form.productSpecArr[i] == null) {
							str += n.specAttr[i].groupName + ' ';
							this.isAll= false
						} else {
							n.specAttr[i].specItems.forEach(item => {
								if (this.form.productSpecArr[i] == item.itemId) {
									select += '"' + item.specValue + '" ';
								}
							});
						}
					}

					if (!this.isAll) {
						str = '请选择: ' + str;
					} else {
						select = '已选: ' + select;                
					}
				}
				this.selectSpec = this.isAll ? select : str;
			},
			deep: true,
			immediate: true
		}
	},
	methods: {

		toPositive(price) {
			return price
		// 	if(price<0){
		// 		return '????'
		// 	}
		// return Math.max(0, price);
		},
		/*初始化*/
		initShowSku() {
			
		},

		/*选择属性*/
		selectAttr(attr_index, item_index) {
			 console.log(attr_index,item_index)
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

			for (let i = 0; i < self.form.productSpecArr.length; i++) {
				if (self.form.productSpecArr[i] == null) {
					self.initShowSku();
					return;
				}
			}

			// 更新商品规格信息
			self.updateSpecProduct();
		},

		/*更新商品规格信息*/
		updateSpecProduct() {
			
		},

		/*关闭弹窗*/
		closePopup() {
            console.log('7987987')
			this.$emit('close');
		},

		/*确认提交*/
		confirmFunc() {
			

		},

		/*加入购物车*/
		addCart() {
			
		},
		getCartNum() {
			let self = this;
			self._get('order/cart/count', {}, function (res) {
				let auto =
					uni.getStorageSync('TabBar').isAuto &&
					uni.getStorageSync('TabBar').isAuto != 0;
				self.isAuto = auto;
				uni.hideLoading();
				if (res.data > 0) {
					self.loadding = false;
					uni.setTabBarBadge({
						index: 3,
						color:'#BE1E1E',
						 text: `${res.data}`
				})

				} else if (res.data == 0) {
					uni.removeTabBarBadge({ index: 3 });//移除条数

				}
				self.loadding = false;
			});
		},

		/*创建订单*/
		createdOrder() {
			
		},

		/*商品增加*/
		async add() {
			
		},

		/*商品减少*/
		sub() {
			
		}
	}
};
</script>

<style lang="scss">
.ellipsis{
    width:500rpx;
    overflow: hidden;
white-space: nowrap;//内容超出不换行
text-overflow: ellipsis;

}
.product-popup {
}

.product-popup .popup-bg {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: 99;
}

.product-popup .main {
	position: fixed;
	width: 100%;
	bottom: 0;
	min-height: 200rpx;
	// max-height: 1050rpx;
	background-color: #fff;
	transform: translate3d(0, 980rpx, 0);
	transition: transform 0.2s cubic-bezier(0, 0, 0.25, 1);
	// bottom: env(safe-area-inset-bottom);
	z-index: 999;
	//border-radius: 12rpx;
	border-top-left-radius: 38rpx;
	border-top-right-radius: 38rpx;

}

.product-popup.open .main {
	transform: translate3d(0, 0, 0);
}

.product-popup.close .popup-bg {
	display: none;
}

.product-popup.close .main {
	display: none;
	z-index: -1;
}

.product-popup .header {
	height: 60rpx;
	padding: 40rpx 0 10rpx 210rpx;
	position: relative;
	//border-bottom: 1px solid #eeeeee;
}

.product-popup .header .avt {
	position: absolute;
	top: 40rpx;
	left: 30rpx;
	width: 144rpx;
	height: 144rpx;
	border: 2px solid #ffffff;
	background: #ffffff;
	border-radius: 12rpx;
}
.specs-hd {

}
.product-popup .header .stock {
	font-size: 26rpx;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
font-weight: bold;
font-size: 32rpx;
color: #040404;
line-height: 41rpx;
text-align: left;
font-style: normal;
text-transform: none;
}

.product-popup .close-btn {
	position: absolute;
	width: 40rpx;
	height: 40rpx;
	top: 40rpx;
	right: 30rpx;
  .iconfont{
    font-size: 50rpx;
    color: #000;
  }
}

.product-popup .price {
	@include font_color('price_color');
	font-size: 24rpx;
  margin-bottom: 40rpx;
}

.product-popup .price .num {
	padding: 0 4rpx;
	font-size: 40rpx;
  font-family: Roboto, Roboto;
  font-weight: bold;
  color: #000000;
}

.product-popup .old-price {
	margin-left: 10rpx;
	font-size: 26rpx;
	color: #999999;
	text-decoration: line-through;
}
.select_spec{
  color: #999;
}
.product-popup .body {
	padding: 20rpx 30rpx 39rpx 30rpx;
	// max-height: 600rpx;
	overflow-y: auto;
  background: #fff;
  
  
}
.body-mian {
  background: #fff;
  border-radius: 36rpx 40rpx;
  padding: 32rpx;
  box-sizing: border-box;
}
.product-popup .level-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
  background: #fff;
  padding: 30rpx;
  box-sizing: border-box ;
  margin-top: 20rpx;
  border-radius: 36rpx;
}

.product-popup .level-box .key {
  font-family: Hiragino Sans GB, Hiragino Sans GB;
  font-weight: bold;
  font-size: 28rpx;
  color: #040404;
}
.level-box-num {
  border: 1rpx #CDCDCD solid;
  border-radius: 54rpx ;
}
.product-popup .level-box .icon-box {
	width: 48rpx;
	height: 40rpx;
	// background: #e0e0e0;
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
	font-size: 32rpx;
	text-align: center;
}

.specs .specs-list {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-wrap: wrap;
}

.specs .specs-list button {
	margin-right: 20rpx;
	margin-bottom: 10rpx;
	font-size: 24rpx;
  border-radius: 50rpx;
  
}

.specs .specs-list button:after,
.product-popup .btns button,
.product-popup .btns button:after {
	height: 88rpx;
	line-height: 88rpx;
	border: 0;
	border-radius: 0;
	margin-bottom: 55rpx;
}

.product-popup .btns .confirm-btn {
	width: 710rpx;
	height: 80rpx;
	// @include background_linearmore('cart_right1', 'cart_right2', 'right_deg', 0%, 100%);
	border-radius: 40rpx;
	margin: 0 auto;
	margin-bottom: 55rpx;
	color: #ffffff;
	line-height: 80rpx;
	font-size: 32rpx;
  background: #000000;
  // border-radius: 45px 45px 45px 45px;
}

.btn-checked {
	border: 1.5rpx solid #BE1E1E;
  color:#BE1E1E;
	@include border_color('background_color');
	border-radius: 6px;
	@include font_color('font_color');
	font-size: 26rpx;
	background: #FFF9F8;
}

.btn-checke {
	border: 1rpx solid #F7F8FA;
	border-radius: 6rpx;
	font-size: 26rpx;
	color: #333333;
	background-color: #F7F8FA;
}
</style>
