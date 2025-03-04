<template>
	<view class="my_info ">
		<!--地址-->
		<view class="add-address " @click="addAddress()" v-if="Address==null">
			<view class="icon-box mr10">
				<text class="iconfont icon-dizhi"></text>
			</view>
      <view class="please-add">请添加收货地址</view>
      <view class="iconfont icon-jiantou"></view>
		</view>
		<view class="address-defalut-wrap" @click="addAddress()" v-else>
			<view class="d-b-c">
				<view class="add-addr flex-1">
					<view class="icon-box mr10 f-s-0">
						<text class=" iconfont icon-dizhi"></text>
					</view>
					<view class="flex-1">
						<view class="address-info">
							<text class='address-name'>{{Address.name}} </text>
              <text>{{Address.phone}}</text>
						</view>
						<view class="info mb10">
							<text class="province-c-a text-ellipsis-2">{{Address.region.province}}{{Address.region.city}} {{Address.region.region}}{{Address.detail}}</text>
						</view>
					</view>
				</view>
				<view class="iconfont icon-jiantou ml10 f-s-0"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: ['Address', 'existAddress','dis'],
		onLoad() {

		},
		mounted() {

		},
		methods: {
			/*添加地址*/
			addAddress() {
				if(this.dis){
					return
				}
				let url = '/pages/user/address/address?source=order';
				if (!this.existAddress) {
					url = '/pages/user/address/add/add?delta=1';
				}
				this.gotoPage(url);
			}
		}
	}
</script>

<style lang="scss" scoped>
  @import '@/common/mixin.scss';
  .add-address {
    @include fl-between;
    .please-add {
      flex: 1;
      font-family: Roboto, Roboto;
      font-size: 24rpx;
      color: #252525;
    }
  }
  .address-info {
    font-family: Roboto, Roboto;
    font-size: 28rpx;
    color: #252525;
    line-height: 28rpx;
    font-style: normal;
    text-transform: none;
    padding-bottom: 12rpx;
    .address-name {

      font-family: Roboto, Roboto;
      font-size: 28rpx;
      color: #252525;
      font-style: normal;
      text-transform: none;
      padding-right: 8rpx;
    }
  }
	.info {
    font-family: Roboto, Roboto;
    font-size: 28rpx;
    color: #252525;
    line-height: 28rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
	}

	.add-addr {
		display: flex;
		align-items: center;
	}

	.tel {
		font-size: 27rpx;
		color: #999999;
	}

	.choose-address {
		width: 88rpx;
		height: 88rpx;
		margin-right: 35rpx;
	}

	.icon-dizhi {
		margin-right: 25rpx;
		font-size: 60rpx;
	}

	.addree_icon {
		width: 42rpx;
		height: 42rpx;
	}

	.my_info {
		background-color: #FFFFFF;
		margin: 16rpx 24rpx 0;
    border-radius: 24rpx;
    padding: 16rpx 0rpx;
	}

	.icon-box .icon-dizhi {
		font-size: 44rpx;
    color: #000;
	}

	.my_info .icon-jiantou {
		color: #333333;
		font-size: 24rpx;
	}
</style>
