<template>
		<view class="containers">
      <!-- {{ listData }} -->
      <view class="slide-box" v-for="(item, index) in listData" :key="index">
        <view class="slide-list" @touchstart="touchStart($event, index)" @touchend="touchEnd($event, index)"
          @touchmove="touchMove($event, index)" @tap="recover(index)"
          :style="{ transform: 'translate3d(' + item.slide_x + 'px, 0, 0)' }">
          <view class="now-message-info" hover-class="uni-item--hover" :style="{width:windowWidth-25 + 'px'}" txt="111"
            >
            <checkbox-group @change="checkItem(item, index)">
              <label class="d-c-c "  >
                <checkbox
                  value="cb"
                  class="checkbox"
                  :checked="item.checked"
				  
				  color="#FFFFFF"
				  borderColor="#999999"
				  activeBorderColor="#999999"
          activeBackgroundColor="#000"
          iconColor="#fff"
                />
              </label>
            </checkbox-group>
            <view class="cart-shop" @click="pitch(item)">
              <view class="shop-img"  @click.stop="pitch(item)">
                <image :src="item.productImage" height='168rpx' width='168rpx' radius='8rpx'></image>
              </view>
              <view class="shop-info">
                <view class="shop-name">
                  {{item.productName}}
                </view>
                <view class="shop-type" v-if="item.productAttr">
                  <view class="attrs" >
                    <text class="attrs_text">{{item.productAttr}}</text>
                    <!-- @tap.stop="changeshop(item)" -->
                  </view>
                </view>
                <view class="shop-price-num">
                  <view class="shop-price">
                    <text class="f24">￥</text>{{toPositive(item.productPrice)}}
                  </view>
                  <view class="shop-num">
                    <view class="lose" @click.stop="reduce(item)">
                      <text style="font-size: 24rpx;" class=" iconfont icon-jian" 
                        :style="{ color:  item.totalNum > 1 ? '#333333': '#999' }"></text>
                    </view>
                    <view class="num" style="margin-top:-6rpx;">
                      {{item.totalNum}}
                    </view>
                    <view class="plus" @click.stop="plus(item)">
                      <text style="font-size: 24rpx;" class=" iconfont icon-jia"
							 :style="{ color:  item.totalNum < item.stockNum ? '#333333': '#999' }"></text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="group-btn" test="123">
            <view class="btn-div" @click.stop="clickMethod(item,index)" style="background: #000;color:#fff"
              >
              删除
            </view>
          </view>
        </view>
      </view>
		</view>
</template>

<script>
	/**
	 * m-slide-list 滑动操作列表
	 * @description 滑动操作列表组件
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=209
	 * @property {Array} list 数据源，格式为：[{title: 'xxx', image:'xxx', surname: 'xxx',detail:'xxx', rightDetail: 'xxx', slide_x: 0},{title: 'xxx', image:'xxx', surname: 'xxx',detail:'xxx', rightDetail: 'xxx', slide_x: 0}]
	 * @property {Array} button 按钮数据源，格式为：[{title: 'xxx', background:'xxx'},{title: 'xxx', background:'xxx'}]
	 * @property {Boolean} border 边框
	 */
	export default {
		name: 'mark-slide-list',
		props: {
			list: { //数据list
				type: Array,
				default () {
					return [];
				}
			},
			border: { //边框
				type: Boolean,
				default: false
			},
		},
		computed: {
			windowWidth() {
				return uni.getSystemInfoSync().windowWidth;
			},
			idslist: function() {
				return function() {
					var ids = []
					for (const key in this.listData) {
						if (this.listData[key].checked) {
							ids.push(this.listData[key].id)
						}
					}
					return ids
				}
			}
		},
		data() {
			return {
				listData: [],
				start_slide_x: 0,
				btnWidth: 0,
				startX: 0,
				LastX: 0,
				startTime: 0,
				itemIndex: 0,
				losecolor: '#cccccc',
				color: '#000000',
				checkedids:[]
			};
		},
		created() {
			console.log(this.list)
			this.listData = this.clone(this.list)
			console.log(this.listData)
		},
		watch: {
			list: {
				handler: function(val, oldval) {
					this.listData = this.clone(this.list)
				},
				deep: true
			},
			checkedids:{
				handler: function(val, oldval) {
					this.$emit('changetotal', val)
				},
				deep: true
			}
		},
		methods: {
			toPositive(price) {
				return price
		// 		if(price<0){
		// 		return '????'
		// 	}
		// return Math.max(0, price);
		},
			
			checkItem(item,index) { // xunze
				//item.checked=true
				// let data ={
				// 	  item:item,
				// 	  index:Number(index)
				// }
				this.$emit('checkItem', item,Number(index))
			},
      //切换规格
			// changeshop(item) {
			// 	this.$emit('changeshop', item)
			// },
			// 全选或全不选
			
			all(e) {
				this.checkedids = []
				if(e) {
					for (const key in this.listData) {
						this.checkedids.push(this.listData[key].id)
					}
				}
				this.$emit('changetotal', this.checkedids)
			},
			//商品数量减
			reduce(item) {
				if (item.totalNum > 1) {
					this.$emit('reduceFunc', item)
				}
			},
			// 商品数量加
			plus(item) {
        console.log("item", item)
				if (item.totalNum < item.stockNum) {
					// item.productNum++
					this.$emit('addFunc', item)
				}
			},
			clone(data) {
				const type = typeof data
				let obj = [];
				if (type === 'array') {
					obj = [];
				} else if (type === 'object') {
					obj = {};
				} else {
					return data;
				}
				if (type === 'array') {
					for (let i = 0, len = data.length; i < len; i++) {
						obj.push(this.clone(data[i]));
					}
				} else if (type === 'object') {
					// 对原型上的方法也拷贝了....
					for (const key in data) {
						obj[key] = this.clone(data[key]);
					}
				}
				return obj;
			},
			// 滑动开始
			touchStart(e, index) {
				if (this.itemIndex == index) {
					this.itemIndex = index
				}
				//记录手指放上去的时间
				this.startTime = e.timeStamp;
				//记录滑块的初始位置
				this.start_slide_x = this.listData[index].slide_x;
				// 按钮宽度
				//#ifdef MP-WEIXIN
				uni.createSelectorQuery().in(this).selectAll('.group-btn').boundingClientRect(res => {
					if (res != null) {
						this.btnWidth = res[index].width * -1;
					}
				}).exec();
				//#endif
				//#ifdef H5 || APP-PLUS
				uni.createSelectorQuery()
					.selectAll('.group-btn')
					.boundingClientRect()
					.exec(res => {
						if (res[0] != null) {
							this.btnWidth = res[0][index].width * -1;
						}
					});
				//#endif
				// 记录上一次开始时手指所处位置
				this.startX = e.touches[0].pageX;
				// 记录上一次手指位置
				this.lastX = this.startX;
				//初始化非当前滑动消息列的位置			
				for (var i in this.listData) {
					if (index != i) {
						this.listData[i].slide_x = 0;
					}
				}
			},
			// 滑动中
			touchMove(e, index) {
				const endX = e.touches[0].pageX;
				const distance = endX - this.lastX;
				// 预测滑块所处位置
				const duang = this.listData[index].slide_x + distance;
				// 如果在可行区域内
				if (duang <= 0 && duang >= this.btnWidth) {
					this.listData[index].slide_x = duang;
				}
				// 此处手指所处位置将成为下次手指移动时的上一次位置
				this.lastX = endX;
			},
			// 滑动结束
			touchEnd(e, index) {
				let distance = 10;
				const endTime = e.timeStamp;
				const x_end_distance = this.startX - this.lastX;
				if (Math.abs(endTime - this.startTime) > 200) {
					distance = this.btnWidth / -2;
				}
				// 判断手指最终位置与手指开始位置的位置差距
				if (x_end_distance > distance) {
					this.listData[index].slide_x = this.btnWidth;
				} else if (x_end_distance < distance * -1) {
					this.listData[index].slide_x = 0;
				} else {
					this.listData[index].slide_x = this.start_slide_x;
				}
			},
			// 点击回复原状
			recover(index) {
				//debugger
				this.listData[index].slide_x = 0;
			},
			/** 
			 * 点击按钮触发事件
			 * @param {Object} item 列表数据 
			 * @param {Object} buttonItem 按钮数据
			 * @param {Object} index 列表数据key
			 */
			clickMethod(item,index) {
				 console.log(item)
				 
				// var id = []
				// id.push(item.id)
				this.$emit('del', item.cartId,index)
				//this.checkedids = []
			},
			/**
			 * 点击按钮触发事件
			 * @param {Object} item 列表数据 
			 */
			pitch(item) {
				 console.log(item.productId)
				let haveId = this.checkedids.some(res=>{
					return res == item.id
				})
				if(haveId) {
					this.checkedids = this.checkedids.filter(value => value !== item.id);
				}else {
					this.checkedids.push(item.id)
				}


				let path = 'pages/product/detail/detail?productId='+ item.productId +'&appId=10001';
				this.gotoPage(path);

			},
			clickItemMethod(item) {

				console.log(item)
				// this.$emit("godetails", item.code)
			}
		}
	};
</script>

<style lang="scss" scoped>
/* 在你的 <style> 标签内 */

	image {
		height: 100%;
		width: 100%;
	}
.checkbox {
	transform: scale(0.7);


}

	.containers {
		// border-radius: 12rpx;
		overflow: hidden;
		padding-bottom: 80rpx;
		.check_group{
			flex-direction: column;
			width: 100%;
		}
		.slide-box {
			width: 690rpx;
			margin-top: 20rpx;
			overflow: hidden;
			border-radius: 12rpx;
			.list-item-border {
				width: 730rpx;
				border-bottom: 1px solid #f2f2f2;
			}

			.slide-list {
				transition: all 100ms;
				transition-timing-function: ease-out;
				min-width: 200%;
				.uni-item--hover {
					// background-color: #f1f1f1 !important;
				}

				.now-message-info {
					position: relative;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					font-size: 32rpx;
					clear: both;
					padding: 32rpx 20rpx 32rpx 20rpx;
					background: #ffffff;
					float: left;
          
					.check-change {
						height: 168rpx;
						display: flex;
						align-items: center;
						border-top-left-radius: 12rpx;
						.check-box {
							width: 36rpx;
							height: 36rpx;
							border-radius: 50%;
							border: solid 2rpx #999999;
							margin-right: 20rpx;
						}
						
						.check-img {
							border: solid 2rpx #999999;
							width: 36rpx;
							height: 36rpx;
							margin-right: 20rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							border-radius: 50%;
							.entimg {
								border-radius: 50%;
								width: 28rpx;
								height: 28rpx;
								background-color: red;
							}
						}
					}
					

					.cart-shop {
						display: flex;
						align-items: center;
						margin-left: 4rpx;
						.shop-img {
							position: relative;
							overflow: hidden;
              image {
                width: 200rpx;
                height: 200rpx;
              }
							.top-img-bg{
								position: absolute;
								left: 0;
								top: 0;
							}
						}

						.shop-info {
							height: 200rpx;
							width: 396rpx;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							overflow: hidden;
							margin-left: 16rpx;
              padding-right: 28rpx;
              box-sizing: border-box;
							.shop-name {
								color: #333333;
								font-size: 24rpx;
								font-weight: 500;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1;
                font-family: Hiragino Sans GB, Hiragino Sans GB;
                font-weight: normal;
                color: #040404;
							}

							.shop-type {
								display: flex;
                
								.attrs {
									// background-color: #F5F5F5;
									color: #666666;
									font-size: 24rpx;
									padding: 6rpx 0;
									border-radius: 8rpx;
									overflow: hidden;
									display: flex;
									.attrs_text {
										// margin-right: 8rpx;
										overflow: hidden;
										text-overflow:ellipsis;
										white-space: nowrap;
                    font-family: Hiragino Sans GB, Hiragino Sans GB;
                    font-weight: normal;
                    font-size: 20rpx;
                    color: #8C8C8C;
									}
								}
							}

							.shop-price-num {
								display: flex;
								justify-content: space-between;

								.shop-price {
									color: #000;
									font-weight: bold;
									font-size: 36rpx;
                  font-family: Roboto, Roboto;
								}

								.shop-num {
									display: flex;
									width: 202rpx;
									height: 50rpx;
									border-radius: 28rpx;
									border: 1rpx solid #CDCDCD;
									font-size: 28rpx;
									align-items: center;
									justify-content: center;

									.lose {
										width: 52rpx;
										height: 52rpx;
										display: flex;
										justify-content: center;
										align-items: center;
										// border-right: solid 2rpx #F5F5F5;
                    font-family: Roboto, Roboto;
                    font-weight: 300;
                    font-size: 24rpx;
                    color: #000000;
									}

									.num {
										width: 60rpx;
										height: 52rpx;
										text-align: center;
										line-height: 60rpx;
									}

									.plus {
										width: 52rpx;
										height: 52rpx;
										display: flex;
										justify-content: center;
										align-items: center;
										// border-left: solid 2rpx #F5F5F5;
									}
                  image {
                    width: 30rpx;
                    height:30rpx;
                  }
								}
							}
							.label {
								display: flex;
								font-size: 24rpx;
								text-align: center;
								color: #ffffff;
								.label-left {
									background: linear-gradient(86deg, #FEEAEA 0%, #FEF0ED 100%);
									padding: 0 6rpx;
									height: 32rpx;
									line-height: 32rpx;
									border-radius: 4rpx;
									font-size: 20rpx;
									color: #F92323;
									text-align: center;
									margin-right: 10rpx;
								}
							}
						}
					}
				}

				.group-btn {
					float: left;
					height: 208rpx;
					width: 120rpx;
					.btn-div {
						height: 264rpx;
						width: 120rpx;
						color: #fff;
						text-align: center;
						font-size: 24rpx;
						line-height: 264rpx;
						border-top-right-radius: 20rpx;
						border-bottom-right-radius: 20rpx;
					}
					
					.top {
						background-color: #c4c7cd;
					}
					
					.removeM {
						background-color: #ff3b32;
					}
				}
			}
		}
	}
</style>
