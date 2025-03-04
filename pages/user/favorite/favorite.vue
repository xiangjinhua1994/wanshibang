<template>
	<view class="shop_body">
		<view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
		<headTitle class="headColor" title="我的收藏">
			<view class="right-css" v-show="showManager" @click="manageMent()">管理</view>
			<view class="right-css" v-show="!showManager" @click="finishCop()">完成</view>
		</headTitle>
		<scroll-view scroll-y="true" :style="'height:' + scrollviewHigh + 'rpx;'" class="scroll-Y" lower-threshold="50"
		 @scrolltolower="scrolltolowerFunc">
			<!-- <view class="shop_body_l_item" v-for="(item,index) in product_list" :key="index">
				<image :src="item.productImage" @click="goto_product(item.productId)" image/>
					<view class="shop_body_l_item_info" @click="goto_product(item.productId)">
						<view class="shop_body_l_item_info_title h1">{{item.productName}}</view>
						<view class="shop_body_l_item_info_price">
							<view class="h2 red">¥<text class="h1">{{item.productPrice}}</text></view>
							<view class="h4 huaxianjia">¥<text class="h3">{{item.linePrice}}</text></view>
						</view>
					</view>
					<button type="default" @click="cancelFav(item.productId)">取消关注</button>
			</view> -->
			<view class="goods-box">
				<template v-for="(item, key) in listData" :key="key" class="bgColor" >
				  <goodsBlock  :parentitem="item" @custom-event="receiveFromChild" :bg="bgColor" :showRadio="!showManager" @radioChange2="radioChange2(item,key)"></goodsBlock>
				  <!-- <view class="radioShow" @click="radioChange(item,key)">
					<radio   :value="item" :checked="key === current" />
				  </view> -->
				  <!-- <view class="radio d-s-c radio-ui">
					<radio class="radioVol" style="transform:scale(0.7)" color="#000" @click="radioChange(item,key)"   :checked="item.isChecked"
					  />
				</view> -->
				</template>
			</view>
			<view class="d-c-c p30" v-if="product_list.length==0 && !loading">
				<text class="iconfont icon-wushuju"></text>
				<text class="cont">亲，暂无相关记录哦</text>
			</view>
			<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
		</scroll-view>
		  <spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec>
		  <view class="bottom-bar" v-show="!showManager" style="background-color: #fff;z-index: 9999;">
			<view class="bottom-bar-item" >
				<!-- <radio class="radioVol" style="transform:scale(0.7)" color="#000" :value="selectAllBool"  @click="selectAll" :checked="selectAllBool"
				>
				</radio> -->
				<checkbox-group @change="selectAll()" style="margin-top: 14rpx;">
					<label @click="selectAll">
						<checkbox value="cb" style="transform:scale(0.8)" color="#FFFFFF" borderColor="#99999"
						activeBorderColor="#101010"
						activeBackgroundColor="#000"
						iconColor="#fff" :checked="selectAllBool" />
						<text>全选</text>
					</label>
				</checkbox-group>
					<!-- <checkbox-group @change="selectAll()">
						<label class="d-c-c "  >
						  <checkbox
							value="cb2"
							class="checkbox"
							:checked="true"
							style="transform:scale(0.8)"
							color="#FFFFF"
							borderColor="#99999"
							activeBorderColor="#101010"
							activeBackgroundColor="#000"
							iconColor="#fff"
						  />
						</label>
					  </checkbox-group> -->
				<text class="chooseNumStyle">已选<text v-if="chooseNum>0" class="chooseNum">{{chooseNum}}</text>
				<text v-else>{{chooseNum}}</text>件</text>
			</view>
			<!-- <view class="bottom-bar-item" @click="delAll">删除</view> -->
			<view class="bottom-bar-del" ><button type="primary" @click="onDelete()" class="delete-btn mr20">
				删除
			</button>
		</view>
		  </view>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more.vue";
	import goodsBlock from '@/pages/component/goodsBlock.vue';
	import headTitle from '@/pages/component/headTitle.vue';
	import spec from '../../product/detail/popup/spec.vue';

	export default {
		components: {
			spec,
			headTitle,
			goodsBlock,
			uniLoadMore
		},
		data() {
			return {
				/*底部加载*/
				loading: true,
				/*没有更多*/
				no_more: false,
				//页面高度
				scrollviewHigh: '',
				//商品列表
				product_list: [],
				//当前页
				page: 1,
				//总页数
				last_page: '',
				isfollow:'',
				listData:[],
				  /*是否确定购买弹窗*/
				isPopup: false,
				bgColor:'#fff',
				showManager:true,
				current: '',
				// 单选的选中项
				radioValue: '',
				selectAllBool:false,
				chooseNum:0,
				productModel: {},
			}
		},
		computed: {
			/*加载中状态*/
			loadingType() {
				if (this.loading) {
					return 1;
				} else {
					if (this.product_list.length != 0 && this.no_more) {
						return 2;
					} else {
						return 0;
					}
				}
			}
		},
		onLoad() {
			this.init();
			this.getData();
			//this.getnewProduct();
		},
		methods: {
			/*初始化*/
			init() {
				let self = this;
				self.page=1;
				self.product_list=[];
				uni.getSystemInfo({
					success(res) {
						self.scrollviewHigh = res.windowHeight;
					}
				});
			},
			//删除
			onDelete() {
				console.log('89897987')
				let self = this;
				let arr = [];
				for(let i=0;i<self.listData.length;i++){
					// self.listData[i].isChecked = false;
					if(self.listData[i].isChecked == true){
						arr.push(self.listData[i].favoriteId)
					}
				}
				console.log(arr,'arrooo')
				if(arr.length ==0){
					uni.showToast({
						title: '请选择要取消收藏的商品',
						icon: 'none'
					})
					return;
				}
				let str = arr.join(',')

				self._postBody('user/favorite/cancel', {
					favId: str,
				}, (res) => {
					uni.showToast({
						title: '取消收藏成功',
						icon: 'none'
					})
					self.listData = [];
					self.getData();
					// self.loading = false;
					// self.last_page = res.data.total;
					// self.product_list = self.product_list.concat(res.data.records);
					// for(let i=0;i<res.data.records.length;i++){
					// 	res.data.records[i].isChecked = false;
					// }
					// self.listData = self.listData.concat(res.data.records);
					// console.log(self.listData,'self.listData')

					// if (res.data.lastPage <= 1) {
					// 	self.no_more = true;
					// } else {
					// 	self.no_more = false;
					// }
				})

			},
			// 全选
			selectAll(){
				console.log('123')
				let self = this;
				this.selectAllBool = !this.selectAllBool;
				for(let i=0;i<self.listData.length;i++){
					if(this.selectAllBool){
						self.listData[i].isChecked = true;

					}else{
						self.listData[i].isChecked = false;
					}
				}
				console.log(self.listData,'self.listData88')

				let arr = []
				for(let i=0;i<self.listData.length;i++){
					// self.listData[i].isChecked = false;
					if(self.listData[i].isChecked == true){
						arr.push(self.listData[i])
						self.chooseNum=self.chooseNum+1
					}
				}
				self.chooseNum=arr.length
			},
			//获取数据
			getData() {
				let self = this;
				self.loading = true;
				self._postBody('user/favorite/list', {
					pageIndex: self.page,
					type: 20,
					pageSize: 10,
				}, (res) => {
					self.loading = false;
					self.last_page = res.data.total;
					self.product_list = self.product_list.concat(res.data.records);
					for(let i=0;i<res.data.records.length;i++){
						res.data.records[i].isChecked = false;
					}
					self.listData = self.listData.concat(res.data.records);
					console.log(self.listData,'self.listData')

					if (res.data.lastPage <= 1) {
						self.no_more = true;
					} else {
						self.no_more = false;
					}
				})
			},
			// 管理
			manageMent(){
				this.showManager = false
			},
			finishCop(){
				this.showManager = true
			},
			// 单选题
			radioChange2(item,key) {
				let self = this;
				console.log(item,'item,key89898888',self.listData)
				item.isChecked = !item.isChecked
				if(!item.isChecked){
					this.selectAllBool = false;
				}
				let arr = []
				for(let i=0;i<self.listData.length;i++){
					// self.listData[i].isChecked = false;
					if(self.listData[i].isChecked == true){
						arr.push(self.listData[i])
						self.chooseNum=self.chooseNum+1
					}
				}
				self.chooseNum=arr.length
			},
			/*关闭弹窗*/
			closePopup(e, cart_total_num) {
				//  console.log("关闭弹框")
				//   console.log(e)
				this.isPopup = false;
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
			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {
				let self = this;
				if (self.no_more) {
					return;
				}
				self.page++;
				if (self.page <= self.last_page) {
					self.getData();
				} else {
					self.no_more = true;
				}
			},
			goto_product(e){
				this.gotoPage('pages/product/detail/detail?productId=' + e);
			},
			//取消收藏
			cancelFav(productId) {
				let self = this;
				uni.showLoading({
					title: '正在取消'
				});
				self._post('user/favorite/cancelFav', {
					productId: productId
				}, (res) => {
					uni.hideLoading();
					self.page = 1;
					self.product_list = [];
					self.getData();
				});
			},
			receiveFromChild(data) {
				console.log(data)
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
			getnewProduct() {
				// 将当前Vue实例赋值给self变量，以便在函数内部使用
				let self = this;

				// 调用_postBody方法，发送POST请求到'product/productRecommen/lists'接口
				// 携带参数{ code: "newProduct" }
				self._postBody('product/productRecommen/lists', {
				  code:"newProduct"
				}, function(res) {
					// 判断接口返回的res中的code字段是否等于1
					if (res.code === 1) {
						// 如果code等于1，则将res.data.records赋值给Vue实例的listData属性
						self.listData = res.data.records;
					}
				});
			  
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}

	.h1 {
		font-size: 32rpx;
	}

	.h2 {
		font-size: 28rpx;
	}

	.h3 {
		font-size: 24rpx;
	}

	.h4 {
		font-size: 20rpx;
	}

	.h5 {
		font-size: 16rpx;
	}

	.h6 {
		font-size: 12rpx;
	}

	.red {
		color: $dominant-color;
	}

	.huaxianjia {
		text-decoration: line-through;
		color: #585858;
		margin-left: 5rpx;
	}
	.scroll-Y{
		height: calc(100vh - 150rpx) !important;
	}
	.shop_body {
		width: 100%;
		background-color: #f2f2f2;
		.right-css {
			position: absolute;
			top: 0rpx;
			right: 20rpx;
			font-family: Hiragino Sans GB, Hiragino Sans GB;
			font-weight: normal;
			font-size: 32rpx;
			color: #000000;
			font-style: normal;
			text-transform: none;
		}
		.goods-box{
			display: flex;
  			flex-wrap: wrap;
			padding-bottom: 20rpx;
			.bgColor{
				background-color: #fff;
				margin-left: 10rpx;
			}
			
		}
		.bottom-bar{
			width: 100%;
			height: 120rpx;
			background-color: #fff;
			position: fixed;
			bottom: 0rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0rpx 20rpx;
			box-sizing: border-box;
			.bottom-bar-item{
				display: flex;
				z-index: 999999;
				.chooseNumStyle{
					margin-left: 34rpx;
					margin-top: 21rpx;
					.chooseNum{
						color: red;
					}
				}
			}
			.bottom-bar-del{
				.delete-btn{
					margin: 0;
					padding: 0 30rpx;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 40rpx;
					font-size: 32rpx;
					background: #101010;
					color: #fff;
				}

			}
			.bottom-bar-left{
				display: flex;
				align-items: center;
				.bottom-bar-left-item{
					margin-right: 20rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					.bottom-bar-left-item-icon{
						width: 40rpx;
						height: 40rpx;
						background-color: #000000;
						border-radius: 50%;
					}
				}
			}
		}
	}

	.shop_body_l_item {
		width: 90%;
		height: 250rpx;
		margin: 0 auto;
		background-color: white;
		border-radius: 15rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		padding: 20rpx;
		box-sizing: border-box;
		position: relative;
	}

	.shop_body_l_item image {
		width: 34.5%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.shop_body_l_item_info {
		width: 65.5%;
		height: 170rpx;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.shop_body_l_item_info_title {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		word-break: break-all;
		overflow: hidden;
	}

	.shop_body_l_item_info_price {
		display: flex;
		align-items: flex-end;
		color: $dominant-color;
	}

	.shop_body_l_item_info_price view {
		margin-right: 15rpx;
	}

	.shop_body_l_item_info_others {
		width: 100%;
		height: 30rpx;
		display: flex;
		justify-content: space-between;
	}

	.shop_body_l_item_info_others_activity {
		width: 150rpx;
		height: 30rpx;
		line-height: 30rpx;
		border: 1rpx #E22319 solid;
		border-radius: 30rpx;
		/* font-size: 16rpx; */
		color: #E22319;
		text-align: center;
		box-sizing: border-box;
	}

	.shop_body_l_item_info_others_sales {
		color: #585858;
	}

	.shop_body_l_item button {
		font-size: 24rpx;
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		padding: 0;
		background-image: linear-gradient(90deg, #F11E0B, #F77737);
		color: white;
		position: absolute;
		top: 165rpx;
		left: 530rpx;
		z-index: 999;
	}
</style>