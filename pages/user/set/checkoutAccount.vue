<template>
	<view v-if="!loadding" class="address-box">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <!-- <headTitle  title="切换账号"></headTitle> -->
    <headTitle class="headColor" title="切换账号">
        <view class="right-css" v-show="showManager" @click="manageMent()">管理</view>
        <view class="right-css" v-show="!showManager" @click="finishCop()">完成</view>
    </headTitle>
		<view v-if="listData.length>0" class="pbenv">
			<view class="address-list" >
				<!-- <view class="address-item " v-for="(item,index) in listData" :key="index">
                    <view class="flex-1" style="display: flex;position:relative">
                        <view class="user-info" style="width: 96rpx;height:96rpx;">
                            <image style="width: 96rpx;height:96rpx;" class="no_add" src="/static/defaultAvatar.png" mode="aspectFill"></image>
						</view>
                        <view class="" style="margin-left:24rpx;margin-top:12rpx;">
							<view class="" style="display: flex;">
                                <view class="nickname">{{'海阔天空'}}</view>
                                <view class="status">{{'登陆中'}}</view>
                            </view>
                            <view class="account">{{'13267170356'}}</view>
						</view>
                        <view class="delete" v-show="!showManager" @click="deleteAccount(item,index)">
                            <image style="width: 36rpx;height:36rpx;" class="no_add" src="/static/del.png" mode="aspectFill"></image>
                        </view>
				        </view>
				</view> -->
                <view class="address-item " v-for="(item,index) in listData" :key="index">
                    <view class="flex-1" style="display: flex;position:relative" @click="checkoutAccount(item,index)">
                        <view class="user-info" style="width: 96rpx;height:96rpx;">
							<!-- <text class="">{{item.name}}</text> -->
                            <image style="width: 96rpx;height:96rpx;border-radius:50%;" class="no_add" :src="item.avatarUrl" mode="aspectFill"></image>
						</view>
                        <view class="" style="margin-left:24rpx;margin-top:12rpx;">
							<view class="" style="display: flex;">
                                <view class="nickname">{{item.nickName}}</view>
                                <view class="status" v-if="index==0">{{'登录中'}}</view>
                            </view>
                            <view class="account">{{item.mobile||item.email}}</view>
						</view>
                        <view class="delete" v-show="!showManager" @click.stop="deleteAccount(item,index)">
                            <image style="width: 36rpx;height:36rpx;" class="no_add" src="/static/del.png" mode="aspectFill" v-if="index!=0"></image>
                        </view>
				        </view>
				</view>
                
			</view>
      <view class="add_add-btn">
			  <view class="ui-btn btn-black btn-more" @click="addAddress()">添加账号</view>
      </view>
		</view>
		<view v-else>
			<!-- <view class="none_add">
				<image class="no_add" src="/static/defaultAvatar.png" mode="aspectFill"></image>
			</view> -->
			<view class="add_add-btn">

        <view class="ui-btn btn-black btn-more" @click="addAddress()">添加账号</view>
      </view>
		</view>

		<uiPopup v-if="confirmBoxOrder">
			<view class="confirm-box">
			  <view class="confirm-box-title" > 提示 </view>
			  <view class="confirm-box-describe"> 确定删除此账号？ </view>
			  <view class="confirm-box-btn" slot="btnBox">
				<view class="ui-btn btn-more btn-width" @click="closeOrder">我再想想</view>
				<view class="ui-btn btn-more btn-width btn-black" @click="close_delectOrder">立即删除</view>
			  </view>
			</view>
		  </uiPopup>
		  <uiPopup v-if="confirmBoxOrder2">
			<view class="confirm-box">
			  <view class="confirm-box-title" > 温馨提示 </view>
			  <view class="confirm-box-describe"> 确定切换此账号进行登录？ </view>
			  <view class="confirm-box-btn" slot="btnBox">
				<view class="ui-btn btn-more btn-width" @click="confirmBoxOrder2=false">取消</view>
				<view class="ui-btn btn-more btn-width btn-black" @click="close_delectOrder2">确定</view>
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
				confirmBoxOrder2:false,
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
                showManager:true,
				rowValue:{},
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
			checkoutAccount(item,index){
				if(index==0){
					return;
				}
				this.confirmBoxOrder2 = true;
				//this.gotoPage('/pages/user/index/index');
				this.rowValue = item;
				
			
			
			},
			closeOrder(){
				this.confirmBoxOrder = false;
			},
			// 管理
			manageMent(){
				this.showManager = false
			},
            deleteAccount(item,index){
				this.rowValue = item;
                console.log(item,index,'itemitem')
                this.confirmBoxOrder = true;
            },
			finishCop(){
				this.showManager = true
			},
			/*获取数据*/
			getData() {
				let self = this;
				let dataType = self.dataType;
				self.listData = uni.getStorageSync('userList').reverse();
				// self._get('user/address/lists', {}, function(res) {
				// 	self.listData = res.data.list;
				// 	self.defaultId = res.data.defaultId + '';
					self.loadding = false;
					uni.hideLoading();
				// });
			},

			/*跳转页面*/
			addAddress() {
				
				if(this.listData.length >= 15) {
					uni.showToast({
						title: '最多可添加15个账号',
						duration: 2000,
						icon: 'none'
					});
					return false;
				}
				this.gotoPage('/pages/login/addAccount');
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
				console.log(chos)
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
			close_delectOrder2() {
				// 记录token userId
				console.log(this.rowValue,'iouoiuijkl')
				// if(this.rowValue.token){
				    
				// }
				uni.setStorageSync('token', this.rowValue.token);
                uni.setStorageSync('userId', this.rowValue.userId);
				let arr = JSON.parse(JSON.stringify(uni.getStorageSync('userList'))) 
				for(let i = 0; i < arr.length; i++) {
					if(arr[i].userId == this.rowValue.userId){
						arr.splice(i,1)
					}
				}
				arr.push(this.rowValue)
                uni.setStorageSync('userList', arr);
				//this.$router.go(-2);
				this.confirmBoxOrder2 = false;
				this.gotoPage('/pages/user/index/index');
				// // this._get('user/address/delete', {
				// // 	addressId: this.delectadressid
				// //
			},
			
			/*删除地址*/
			close_delectOrder() {
				let self = this;
				self.confirmBoxOrder = false;
				console.log(self.rowValue)
				let arr = JSON.parse(JSON.stringify(uni.getStorageSync('userList'))) 
				for(let i = 0; i < arr.length; i++) {
					if(arr[i].userId == self.rowValue.userId){
						arr.splice(i,1)
					}
				}
				uni.setStorageSync('userList', arr)
				this.getData()
				// self._get('user/address/delete', {
				// 			addressId: self.delectadressid
				// 		}, function(result) {
				// 			if (result.code == 1) {
				// 				uni.showToast({
				// 					title: '删除成功',
				// 					duration: 2000
				// 				});
				// 				self.getData();
				// 			}else{
				// 				uni.showToast({
				// 					title: '删除失败',
				// 					duration: 2000
				// 				});
				// 			}
				// 		});
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
  .nickname{
    font-weight: bold;
    font-size: 28rpx;
    color: #353535;
    line-height: 28rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  .account{
    margin-top: 22rpx;
    font-weight: normal;
    font-size: 24rpx;
    color: #666666;
    line-height: 24rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  .status{
    font-weight: normal;
    font-size: 16rpx;
    color: #FFFFFF;
    line-height: 26rpx;
    padding: 2rpx 6rpx 0 6rpx;
    text-align: center;
    font-style: normal;
    text-transform: none;
    background-color: #000000;
    border-radius: 2rpx;
    margin-left: 12rpx;
  }
  .delete{
    position: absolute;
    top: 30rpx;
    right: 60rpx;
  }
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
  .address-item {
    margin-top: 38rpx;
    padding-top: 22rpx;
    padding-left: 32rpx;
    background: #FFFFFF;
    border-radius: 28rpx;
    height: 142rpx;
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
		padding:  30rpx;
		padding-bottom: 90rpx;
		//border: 2rpx solid blue;
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
    //background: #fff;
    .btn-more {
      width: 690rpx;
      margin-left: 0;
    }
	}
	.pbenv{
		padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
		box-sizing: border-box;
		//border: 1rpx solid red;
		//width:100%;
		//height:90vh;
		//overflow-y: auto;
	}
</style>
