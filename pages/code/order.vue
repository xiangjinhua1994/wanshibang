<template>
	<view class="user-index">
		<!--提货地址-->
		<view class="thbox">
			<view class="spbox">
				<view class="spbt">
				<text class="sptit">订单号：</text>
				<text class="sptit2">{{detail.orderNo}}</text>	
				</view>
				<view class="spcon">
					<image class="sptu" :src="product.image && product.image[0] && product.image[0].filePath"></image>
					<view class="sptxt">
						<text class="h1"> {{product.productName}}</text>
						<text class="guige">{{detail.productAttr}}</text>
						<view class="num">
							<text class="price">￥{{product.productPrice}}</text>
							<text class="numshu">X1</text>
						</view>
					</view>
				</view>
				
			</view>
			<view class="addbox">
				<text class="addbt">提货地址</text>
				<view class="row">
					<text class="rowtxt">姓名</text>
					<input class="rowsr" v-model="form.name" placeholder="请输入收货人姓名"/>
				</view>
				<view class="row">
					<text class="rowtxt">手机号码</text>
					<input class="rowsr" v-model="form.mobile" placeholder="请输入手机号码"/>
				</view>
				<view class="row">
					<text class="rowtxt">所在地区</text>
					<view @click="showMulLinkageThreePicker" class="rowsr">
						<input class="disableInput" placeholder="" placeholder-class="grary9" v-model="selectCity" disabled />
					</view>
				</view>
				<view class="row">
					<text class="rowtxt">详细地址</text>
					<textarea class="rowdz" v-model="form.detail" placeholder="请输入详细地址"/>
				</view>
			</view>
			<button class="qubtn" @click="submit">确认兑换</button>
			
		</view>
		<mpvue-city-picker v-if="isLoad" ref="mpvueCityPicker" :province="province" :city="city" :area="area" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				orderId: 0,
				product: {},
				cityPickerValueDefault: [0, 0, 0],
				selectCity: '选择省,市,区',
				detail: {},
				address: {},
				delta: 1,
				province: [],
				city: [],
				area: [],
				isLoad: false,
				form: {
					name: '',
					mobile: '',
					provinceId: 0,
					cityId: 0,
					regionId: 0,
					detail: '',
				}
			};
		},
		onLoad(e) {
			this.orderId = e.orderId;
			this.getData();
			this.getRegionData();
		},
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				self._get(
					'card/code/toOrder', {
						orderId: self.orderId
					},
					function(res) {
						self.detail = res.data.detail;
						self.product = res.data.product;
						self.province = res.data.region[0];
						self.city = res.data.region[1];
						self.area = res.data.region[2];
						self.is_load = true;
					}
				);
			},
			 // 获取省市区
			 getRegionData(){
				let self = this;
				self._post('settings/getRegion', {}, function(res) {
					self.province = res.data[0];
					self.city = res.data[1];
					self.area = res.data[2];
					self.isLoad = true;
				});
			},
			/*三级联动选择*/
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show();
			},
			
			/*确定选择的省市区*/
			onConfirm(e) {
				this.selectCity = e.label;
				this.form.provinceId = e.cityCode[0];
				this.form.cityId = e.cityCode[1];
				this.form.regionId = e.cityCode[2];
			},
			submit(){
				let self = this;
				console.log(self.form);
				if (self.form.name == '') {
					uni.showToast({
						title: '请输入收货人姓名',
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				
				if (self.form.mobile == '') {
					uni.showToast({
						title: '请输入手机号码',
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				
				if (self.form.provinceId == 0 || self.form.cityId == 0 || self.form.regionId == 0) {
					uni.showToast({
						title: '请选择所在地区',
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				
				if (self.form.detail == '') {
					uni.showToast({
						title: '请输入街道小区楼牌号等',
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				self.form.orderId = self.orderId;
				self._postBody('card/code/order', self.form, function(res) {
					self.showSuccess(res.msg, function() {
						self.gotoPage('/pages/order/codeorder');
					});
				});
			},
		},
	};
</script>

<style>
	
.thbox{
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #e4e4e4;
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	
}
.spbox{
	display: flex;
	flex-direction: column;
	width: 84%;
	padding: 5%;
	margin: 20rpx 0;
	background: #fff;
}
.spbt{
	display: flex;
	flex-direction:row;
	height: 64rpx;
	line-height: 64rpx;
	border-bottom: 1px solid #eee;
	margin-bottom: 20rpx;
}
.sptit{
	font-size: 26rpx;
	color: #333;
	
}
.sptit2{
	font-size: 26rpx;
	color: #999;
	
}
.spcon{
	display: flex;
	flex-direction:row;
	justify-content: space-between;
}
.sptu{
	width: 50%;
	height: 192rpx;
	border-radius: 10rpx;
	
}
.sptxt{
	width: 80%;
	display: flex;
	flex-direction: column;
	margin-left: 20rpx;
}
.h1{
	font-size: 32rpx;
	line-height: 32rpx;
	height: 32rpx;
	overflow: hidden;
}
.guige{
	font-size: 24rpx;
	color: #999;
	margin: 20rpx 0;
}
.num{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-end;
}
.price{
	font-size: 36rpx;
	font-weight: bold;
	color: #000;
	
}
.numshu{
	color: #999;
	font-size: 28rpx;
	
}
.addbox{
    display: flex;
	flex-direction: column;
	width: 84%;
	padding: 5%;
	background: #fff;	
}
.addbt{
	font-size: 36rpx;
	color: #333;
	border-bottom: 1px solid #eee;
	padding-bottom: 20rpx;
	}
.row{
	display: flex;
	border-bottom: 1px solid #eee;
	font-size: 28rpx;
}
.rowtxt{
	flex: 0.3;
	line-height: 64rpx;
	height: 64rpx;
	padding: 20rpx 0;
	
	
	
}
.rowsr{
	flex: 0.7;
	line-height: 64rpx;
	height: 64rpx;
	color: #999;
	padding: 20rpx 0;
	font-size: 28rpx;
	display: flex;
    align-items: center;
}
.disableInput{
	pointer-events: none;
	display: flex;
	align-items: center;
	font-size: inherit;
	color: inherit;
	width: 100%;
}
.rowdz{
	flex: 0.7;
	line-height: 64rpx;
	height: 128rpx;
	overflow: hidden;
	color: #999;
	padding: 20rpx 0;
	font-size: 28rpx;
}
.qubtn{
	width:80%;
	margin-top: 40rpx;
	height:80rpx; 
	line-height:80rpx;
	background:linear-gradient(to bottom, #ff7220,#fbb700);
	border-radius: 40rpx;
	color: #fff;
	font-size: 32rpx;
}
</style>