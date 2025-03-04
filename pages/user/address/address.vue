<template>
	<view v-if="!loadding" class="address-box">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle  title="我的地址">
      
    </headTitle>
		<view v-if="listData.length>0" class="pbenv">
			<view class="address-list ">
				<view class="address-item " v-for="(item,index) in listData" :key="index">
                    <view >
					<view class="info flex-1 mb20 border-b-d pb30" @click="radioadress(true,item)">
						<view class="user-info ">
							<text class="">{{item.name}}</text>
							<text class="">{{item.phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")}}</text>
						</view>
						<view class="pt20 f28 gray3">
							{{item.region.province}}{{item.region.city}}{{item.region.region}}{{item.detail}}
						</view>
					</view>
					<view class="d-b-c">
						<view class="radio d-s-c radio-ui">
							<radio style="transform:scale(0.7)" color="#000" :value="item.addressId+''" :checked="defaultId==item.addressId+''"
							 @click="radioChange(item.addressId)" />
							 <text class="f28">默认地址</text>
						</view>
						<view class="d-s-c">
							<!-- <view class="none_line ml30"></view> -->
							<view class="icon-box plus d-c-c ml30 " @click="editAddress(item.addressId)">
								<!-- <image class="add_icon_img" src="/static/icon/edit.png" mode="aspectFill"></image> -->
								<text class="gray3 ml10 f28">编辑</text>
							</view>
							<view class="icon-box plus d-c-c ml30" @click="delAddress(item.addressId)">
								<!-- <image class="add_icon_img" src="/static/icon/delete.png" mode="aspectFill"></image> -->
								<text class="gray3 ml10 f28">删除</text>
							</view>
						</view>
					</view>
				</view>

				</view>
			</view>
      <view class="add_add-btn">

			  <view class="ui-btn btn-black btn-more" @click="addAddress()">新增地址</view>
      </view>
		</view>
		<view v-else>
			<view class="none_add">
				<image class="no_add" src="/static/no_adress.png" mode="aspectFill"></image>
			</view>
			<view class="add_add-btn">

        <view class="ui-btn btn-black btn-more" @click="addAddress()">新增地址</view>
      </view>
		</view>

		<uiPopup v-if="confirmBoxOrder">
			<view class="confirm-box">
			  <view class="confirm-box-title" > 删除地址 </view>
			  <view class="confirm-box-describe"> 确认删除该地址信息吗? </view>
			  <view class="confirm-box-btn" slot="btnBox">
				<view class="ui-btn btn-more btn-width" @click="closeOrder">取消</view>
				<view class="ui-btn btn-more btn-width btn-black" @click="close_delectOrder">删除地址</view>
			  </view>
			</view>
		  </uiPopup>


	</view>
</template>

<script>
  import UiPopup from '@/pages/component/ui-popup.vue';
  import headTitle from '@/pages/component/headTitle.vue'
 // import { mapState,mapGetters } from "vuex"
	export default {
    components: {
      headTitle,
	  UiPopup
    },
		data() {
			return {
				confirmBoxOrder:false,
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*数据*/
				listData: [],
				/*默认地址id*/
				default_id: '0',
				options: {},
				// 删除的id
				delectadressid:"",
			}
		},
		onLoad: function(options) {
			this.options = options;
		},
		onShow: function() {
			uni.showLoading({
				title: '加载中'
			});
			/*获取地址列表*/
			this.getData();
		},
		methods: {
			closeOrder(){
				this.confirmBoxOrder = false;
			},
			// delAddress(id) {
			// 	let self = this;
			// 	self.confirmBoxOrder = true;
			// 	self.addressId = id;
			// },
			/*获取数据*/
			getData() {
				let self = this;
				let dataType = self.dataType;
				self._get('user/address/lists', {}, function(res) {
					self.listData = res.data.list;
					self.defaultId = res.data.defaultId + '';
					self.loadding = false;
					uni.hideLoading();
				});
			},

			/*跳转页面*/
			addAddress() {
				let delta = 1;
				if (this.options.source === 'order') {
					delta = 2;
				}
				this.gotoPage('/pages/user/address/add/add?delta=' + delta);
			},

			/*点击单选*/
			radioChange(e) {
				let self = this;
				self._post('user/address/setDefault', {
					addressId: e,
				}, function(res) {
					if (self.options.source === 'order') {
						// #ifndef H5
						uni.navigateBack();
						// #endif
						// #ifdef H5
						history.go(-1);
						// #endif
					}
					self.getData();
				});
				return false;

			},
            // 只更换地址
			radioadress(chos,e){
				console.log(chos,e)
				let address= JSON.parse(JSON.stringify(e))
				 console.log( JSON.parse(JSON.stringify(e)))
				 this.$store.commit('setaddress', address)
				 		// #ifndef H5
						 uni.navigateBack();
						// #endif
						// #ifdef H5
						history.go(-1);
						// #endif
						this.getData()

			},

			/*编辑地址*/
			editAddress(e) {
				this.gotoPage('/pages/user/address/edit/edit?addressId=' + e);
			},



			delAddress(e){ // 删除调弹框趣id
                    this.confirmBoxOrder = true;
                    //  this.addressId = e;
					this.delectadressid=e

			},
			
			/*删除地址*/
			close_delectOrder() {
				let self = this;
				self.confirmBoxOrder = false;
				self._get('user/address/delete', {
							addressId: self.delectadressid
						}, function(result) {
							if (result.code == 1) {
								uni.showToast({
									title: '删除成功',
									duration: 2000
								});
								self.getData();
							}else{
								uni.showToast({
									title: '删除失败',
									duration: 2000
								});
							}
						});
				// wx.showModal({
				// 	title: "提示",
				// 	content: "您确定要移除当前收货地址吗?",
				// 	success: function(o) {
				// 		o.confirm && self._get('user/address/delete', {
				// 			addressId: e
				// 		}, function(result) {
				// 			if (result.code == 1) {
				// 				uni.showToast({
				// 					title: '删除成功',
				// 					duration: 2000
				// 				});
				// 				self.getData();
				// 			}

				// 		});
				// 	}
				// });

			}
		}
	}
</script>

<style lang="scss" scopen>
  .address-box {
    background-color: #F7F8FA;
  }
  .address-item {
    padding: 30rpx;
    background: #FFFFFF;
    border-radius: 28rpx;
    margin-bottom: 40rpx;
    .user-info {
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: bold;
      font-size: 28rpx;
      color: #252525;
      text-align: left;
      font-style: normal;
      text-transform: none;
      text {
        margin-right: 12rpx;
      }
    }
  }
	.radio-ui{
    .radio-img {
      width: 36rpx;
      height:36rpx;
      margin-right: 8rpx;
    }
  }
	.address-list {
		// border-top: 16rpx solid #F7F8FA;
		padding:  20rpx;
		padding-bottom: 90rpx;
	}
	
	.foot-btns {
		padding: 0;
	}
	
	.foot-btns .btn-red {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 0;
	}
	
	.none_add {
		padding: 314rpx 214rpx 60rpx 214rpx;
	}
	
	.no_add {
		width: 322rpx;
		height: 180rpx;
	}
	
	.no_add_add {
		width: 320rpx;
		height: 80rpx;
		border: 2rpx solid #FFB7B7;
		border-radius: 40rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		@include font_color('font_color');
		@include border_color('border_color');
		margin: 0 auto;
	}
	
	.add_add {
		height: 64rpx;
		line-height: 64rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #0777CD;
		padding: 0 35rpx;
		border-bottom: 1rpx solid #D9D9D9;
	}
	
	.defaul_add {
		padding: 9rpx 14rpx 10rpx 15rpx;
		@include background_color('bg-op');
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #F6220C;
		@include font_color('font_color');
	}
	
	.add_icon_img {
		width: 30rpx;
		height: 30rpx;
	}
	
	.none_line {
		width: 1rpx;
		height: 44rpx;
		background: #D9D9D9;
	}
	.add_add-btn{
		position: fixed;
    bottom:0;
		// bottom: calc(env(safe-area-inset-bottom) + 20rpx);
		width:750rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
    background: #fff;
    .btn-more {
      width: 690rpx;
      margin-left: 0;
    }
	}
	.pbenv{
		padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
		box-sizing: border-box;
	}
</style>
