<template>
	<div>
		<!--地址-->
		<template v-if="!extractStore.storeId">
			<view class="add-address d-s-c" @click="addAddress()">
				<view class="icon-box mr10"><span class="icon iconfont icon-dizhi1"></span></view>
				<text>请选择自提点</text>
			</view>
		</template>
		<template v-else>
			<view class="address-defalut-wrap">
				<view class="info d-s-s">
					<text class="state">当前自提点</text>
					<view class="province-c-a d-s-s flex-1">
						<text>{{ extractStore.province }}</text>
						<text>{{ extractStore.city }}</text>
						<text>{{ extractStore.region }}</text>
					</view>
				</view>
				<view class="address">
					<text class="fb gray3">{{ extractStore.storeName }}</text>
					<view class="icon-box" @click="addAddress()"><span class="icon iconfont icon-jiantou"></span></view>
				</view>
				<view class="user">
					<text class="name">{{ extractStore.address }}</text>
					<text class="tel">{{ extractStore.phone }}</text>
				</view>
			</view>
		</template>
		<view class="addree-bottom">
			<view class="stripe" v-for="(item, index) in 10" :key="index">
				<text :class="index % 2 == 0 ? 'red' : 'blue'"></text>
				<text class="white"></text>
			</view>
		</view>

		<!--自取人的信息-->
		<view class="buy-checkout vender">
			<view class="group-hd">
				<view class="left"><text class="min-name">提货人信息</text></view>
			</view>
			<view class="item">
				<text class="key">联系人：</text>
				<input type="text" v-model="linkman" class="flex-1 f30" placeholder-class="gray" placeholder="请输入联系人"   />
			</view>
			<view class="item">
				<text class="key">联系电话：</text>
				<input type="text" v-model="phone" class="flex-1 f30" placeholder-class="gray" placeholder="请输入联系电话"   />
			</view>
		</view>
	</div>
</template>

<script>
export default {
	data() {
		return {
			linkman: '',
			phone: ''
		};
	},
	props: ['extractStore', 'lastExtract'],
	onLoad() {},
	mounted() {
		this.linkman = this.lastExtract.linkman;
		this.phone = this.lastExtract.phone;
	},
	methods: {
		/*添加地址*/
		addAddress() {
			let storeId = -1;
			if (this.extractStore.storeId) {
				storeId = this.extractStore.storeId;
			}
			this.gotoPage('/pages/store/address/address?storeId=' + storeId);
		}
	}
};
</script>

<style scoped>
	.buy-checkout.vender .item .key{ width: 200rpx;}
</style>
