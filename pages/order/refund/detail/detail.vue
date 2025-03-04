<template>
	<view class="order-refund-detail pb100" :data-theme='theme()' :class="theme() || ''">
		<view class="head_top" :style="'height:' + topBarTop() + 'px;'" style="background-color: #fff;"></view>
		<headTitle title="退款详情" bg="#fff">
			
		</headTitle>
		<!--售后状态-->
		<view class="wrapper" style="margin: 24rpx;">
			<!-- <view class="icon-box"><span class="icon iconfont icon-gantanhao"></span></view> -->
			<view class="state-cont flex-1">
				<view class="state-txt d-b-c title">
					<text class="desc f32">{{detail.stateText}}</text>
				</view>
				<view style="display: flex;padding-top: 30rpx;">
					<view style="margin-left: 40rpx;">
						<view v-if="detail.refundProcessStatus[0]=='提交申请'"><image style="width: 36rpx;height:36rpx;" class="no_add" src="/static/choose.png" mode="aspectFill"></image> </view>
						<view style="width: 35rpx;height:35rpx;background:#eee;border-radius:50%" v-else> </view>

						<view class="same" style="padding-right: 20rpx;position:relative;right:40rpx;margin-top:10rpx;width:100%" :style="{'color':detail.refundProcessStatus[0]=='提交申请'?'#000':'#999'}" v-if="detail.refundProcessStatus.length>0&&detail.refundProcessStatus">提交申请</view>
					</view>
					<view v-if="detail.refundProcessStatus[1]=='商家同意'||detail.refundProcessStatus[1]=='商家拒绝'" style="border-bottom: 1rpx solid #000;width:136rpx;position:relative;left:-75rpx; top:-60rpx;margin-left:0rpx"></view>
					<view v-else style="border-bottom: 1rpx solid #eee;width:136rpx;position:relative;left:-75rpx; top:-60rpx;margin-left:0rpx"></view>
					<!-- <view style="border-bottom: 1rpx solid #eee;width:136rpx;position:relative;left:-70rpx; top:-60rpx;margin-left:0rpx" ></view> -->

					<view style="margin-left:-70rpx;">
						<view v-if="detail.refundProcessStatus[1]=='商家同意'||detail.refundProcessStatus[1]=='商家拒绝'"><image style="width: 36rpx;height:36rpx;" class="no_add" src="/static/choose.png" mode="aspectFill"></image> </view>
						<view style="width: 35rpx;height:35rpx;background:#eee;border-radius:50%" v-else> </view>
						<view class="same" style="padding-right: 20rpx;position:relative;right:40rpx;margin-top:10rpx;width:100%" :style="{'color':detail.refundProcessStatus[1]=='商家拒绝'?'#000':'#999'}" v-if="detail.refundProcessStatus[1]=='商家拒绝'">商家拒绝</view>
						<view class="same" style="padding-right: 20rpx;position:relative;right:40rpx;margin-top:10rpx;width:100%" :style="{'color':detail.refundProcessStatus[1]=='商家同意'?'#000':'#999'}" v-else>商家同意</view>
					</view>
					<view style="border-bottom: 1rpx solid #000;width:136rpx;position:relative;left:-75rpx; top:-60rpx;margin-left:0rpx" v-if="detail.type!=30&&detail.refundProcessStatus[2]=='买家寄回'"></view>
					<view style="border-bottom: 1rpx solid #eee;width:136rpx;position:relative;left:-75rpx; top:-60rpx;margin-left:0rpx" v-if="detail.type!=30&&detail.refundProcessStatus[2]!='买家寄回'"></view>
					<view style="margin-left:-70rpx;" v-if="detail.type!=30">
						<view v-if="detail.refundProcessStatus[2]=='买家寄回'"><image style="width: 36rpx;height:36rpx;" class="no_add" src="/static/choose.png" mode="aspectFill"></image></view>
						<view style="width: 35rpx;height:35rpx;background:#eee;border-radius:50%" v-else> </view>
						<view class="same" style="padding-right: 20rpx;position:relative;right:40rpx;margin-top:10rpx;width:100%" :style="{'color':detail.refundProcessStatus[2]=='买家寄回'?'#000':'#999'}">买家寄回</view>
					</view>
					<view style="border-bottom: 1rpx solid #000;width:136rpx;position:relative;left:-75rpx; top:-60rpx;margin-left:0rpx" v-if="detail.refundProcessStatus[3]=='退款失败'||detail.refundProcessStatus[3]=='退款成功'||detail.refundProcessStatus[2]=='退款失败'||detail.refundProcessStatus[2]=='退款成功'"></view>
					<view style="border-bottom: 1rpx solid #eee;width:136rpx;position:relative;left:-75rpx; top:-60rpx;margin-left:0rpx" v-else></view>
					<view style="margin-left:-70rpx;">
						<view v-if="detail.refundProcessStatus[3]=='退款失败'||detail.refundProcessStatus[3]=='退款成功'||detail.refundProcessStatus[2]=='退款失败'||detail.refundProcessStatus[2]=='退款成功'"><image style="width: 36rpx;height:36rpx;" class="no_add" src="/static/choose.png" mode="aspectFill"></image></view>
						<view style="width: 35rpx;height:35rpx;background:#eee;border-radius:50%" v-else> </view>
						<view class="same" style="padding-right: 20rpx;position:relative;right:40rpx;margin-top:10rpx;width:100%;color:#999" v-if="detail.refundProcessStatus[3]=='退款失败'||detail.refundProcessStatus[2]=='退款失败'" :style="{'color':detail.refundProcessStatus[3]=='退款失败'||detail.refundProcessStatus[2]=='退款失败'?'#000':'#999'}">退款失败</view>
						<view class="same" style="padding-right: 20rpx;position:relative;right:40rpx;margin-top:10rpx;width:100%;color:#999" :style="{'color':detail.refundProcessStatus[3]=='退款成功'||detail.refundProcessStatus[2]=='退款成功'?'#000':'#999'}" v-else>退款成功</view>
					</view>
				</view>
			</view>
			<!-- <view class="dot-bg"></view> -->
		</view>
		<!-- 状态专题 -->
		 <view style="margin: 24rpx;background:#fff;border-radius:24rpx;padding:24rpx" v-if="detail.refundProcessStatus[2]=='买家寄回'">
				<view class="f32" style="font-weight: bold;display:flex">
					<view>买家已寄出商品</view>
					<view style="color:#999;margin-left:12rpx;font-weight: normal;margin-top:8rpx;">{{detail.sendTime}}</view>
				</view>
				<view class="p-20-0 f28">
					<text class="gray9">物流信息:</text>
					<text class="gray9">{{detail.expressName}}</text>
					<text class="gray9">{{detail.expressNo}}</text>
				</view>
		 </view>
		 <view style="margin: 24rpx;background:#fff;border-radius:24rpx;padding:24rpx" v-if="detail.type==10&&detail.isAgree==10&&detail.isReceipt==0&&detail.status==0">
			<view class="f32" style="font-weight: bold;display:flex">
				<view>商家同意，待寄回商品</view>
				<view style="color:#999;margin-left:12rpx;font-weight: normal;margin-top:8rpx;">{{detail.approveTime}}</view>
			</view>
			<view class="p-20-0 f28" style="border-bottom: 1rpx dashed #d9d9d9;">
				<text class="">请将商品打包好寄回并填写好物流单号</text>
			</view>
			<view class="p-20-0 f28" >
				<text class="">收货人:</text>
				<text class="">{{detail.productRefundAddressVo.name}}</text>
				<text class="">{{detail.productRefundAddressVo.phone}}</text>
			</view>
			<view class="p-0-0 f28">
				<text class="">{{detail.productRefundAddressVo.region.province}}</text>
				<text class="">{{detail.productRefundAddressVo.region.city}}</text>
				<text class="">{{detail.productRefundAddressVo.region.region}}</text>
				<text class="">{{detail.productRefundAddressVo.detail}}</text>
				<text style="position: absolute;right:60rpx" class="ui-btn btn-min border-gray999" @click="copy(detail.productRefundAddressVo.region.province+detail.productRefundAddressVo.region.city+detail.productRefundAddressVo.region.region+detail.productRefundAddressVo.detail)">{{'复制'}}</text>
			</view>
	     </view>
		 <view style="margin: 24rpx;background:#fff;border-radius:24rpx;padding:24rpx" v-if="detail.refundProcessStatus[3]=='退款成功'||detail.refundProcessStatus[2]=='退款成功'">
			<view class="f32" style="font-weight: bold;display:flex">
				<view>退款成功</view>
				<view style="color:#999;margin-left:12rpx;font-weight: normal;margin-top:8rpx;">{{detail.refundAmountTime}}</view>
			</view>
			<view class="p-20-0 f28">
				<text class="gray9">退款成功，金额已原路返回</text>
				<!-- <text class="gray9" v-if="detail.refundPlatform==10">余额</text>
				<text class="gray9" v-else-if="detail.refundPlatform==20">微信</text>
				<text class="gray9" v-else-if="detail.refundPlatform==30">支付宝</text>
				<text class="gray9" v-else-if="detail.refundPlatform==40">银行卡</text>
				<text class="gray9" v-else-if="detail.refundPlatform==50">dce</text>
				<text class="gray9" v-else-if="detail.refundPlatform==1">易宝</text>
				<text class="gray9" v-else-if="detail.refundPlatform==40">银行卡</text>
				<text class="gray9" v-else-if="detail.refundPlatform==50">dce</text> -->
			</view>
	 </view>
	 
	 <view style="margin: 24rpx;background:#fff;border-radius:24rpx;padding:24rpx" v-if="detail.refundProcessStatus[3]=='退款失败'">
		<view class="f32" style="font-weight: bold;display:flex">
			<view>商家已拒绝退款</view>
			<view style="color:#999;margin-left:12rpx;font-weight: normal;margin-top:8rpx;">{{detail.approveTime}}</view>
		</view>
		<view class="p-20-0 f28">
			<text class="gray9">拒绝原因:</text>
			<text class="ml66">{{detail.refundAmountReason}}</text>
		</view>
 </view>
 <view style="margin: 24rpx;background:#fff;border-radius:24rpx;padding:24rpx" v-if="detail.refundProcessStatus[1]=='商家拒绝'">
	<view class="f32" style="font-weight: bold;display:flex">
		<view>商家已拒绝申请</view>
		<view style="color:#999;margin-left:12rpx;font-weight: normal;margin-top:8rpx;">{{detail.approveTime}}</view>
	</view>
	<view class="p-20-0 f28">
		<text class="gray9">拒绝原因:</text>
		<text class="ml66">{{detail.refuseDesc}}</text>
	</view>
</view>

		<!--商品信息-->
		<view class="p30 mt20 bg-white" style="margin: 24rpx;border-radius:24rpx">
			<view class="f32" style="font-weight: bold;">
				退款商品：
			</view>
			<view class="one-product d-s-c pb20">
				<view class="cover">
					<image :src="detail.orderProduct && detail.orderProduct.productImage" mode="aspectFit"></image>
				</view>
				<view class="flex-1" style="margin-left: 20rpx;">
					<view style="display: flex;justify-content: space-between;">
					<view class="pro-info2">{{detail.orderProduct && detail.orderProduct.productName || ''}}   </view>
					<view style="margin-top: 6rpx;">
						<text>¥</text><text>{{ detail.orderProduct && detail.orderProduct.productPrice || '' }}</text>

					</view>
				    </view>
					<view class="pt10 p-0-0" style="display: flex;justify-content: space-between;">
						<text class="f24 gray9">
							{{detail.orderProduct && detail.orderProduct.productAttr || ''}}
						</text>
						<text class="f24 gray9">
							x{{detail.refundNumber || ''}}
						</text>
					</view>
				</view>
				
			</view>
			<view>
				<view class="p-20-0 f28">
					<text class="gray9 ">退款金额</text>
					<text class="ml66">¥{{detail.applyMoney}}</text>
				</view>
				<view class="p-20-0 f28">
					<text class="gray9">申请类型</text>
					<text class="ml66">{{detail.type==30?'仅退款':'退货退款'}}</text>
				</view>
				<view class="p-20-0 f28">
					<text class="gray9">退款原因</text>
					<text class="ml66">{{detail.refundReason}}</text>
				</view>
				<view class="p-20-0 f28">
					<text class="gray9">补充信息</text>
					<text class="ml66">{{detail.applyDesc?detail.applyDesc:'无'}}</text>
				</view>
				<view class="p-20-0 f28" v-if="detail.type!=30">
					<view class="gray9">上传凭证 <text style="color: #000;margin-left:58rpx" class="" v-if="detail && detail.images && detail.images.length==0">{{'无'}}</text></view>
					<view v-if="detail && detail.images && detail.images.length>0" style="display:flex">
						<view v-for="item in detail.images" :key="item" style="margin-top: 44rpx;">
							<image :src="item.filePath" mode="aspectFit" style="width: 116rpx;height:116rpx;margin-right:10rpx;border-radius:10rpx"></image>
						</view>
					</view>
					<!-- <text class="ml66" v-else>{{'无'}}</text> -->
				</view>
			</view>
			
			<!-- <view class="d-e-c pt20 lh150">
				<view class="f24">
					商品金额：
					<text class="red">¥{{totalPrice}}</text>
				</view>
			</view>
			<view class="d-e-c pt10 lh150">
				<view class="f24">
					订单实付金额：
					<text class="red">¥{{totalPayPrice}}</text>
				</view>
			</view>
			<view class="d-e-c pt10 lh150" v-if="detail.orderM && detail.orderM.orderSource==80">
				<view class="f24" v-if="detail.orderproduct.advance">
					定金({{detail.orderproduct.advance.moneyReturn?'可退':'不可退'}})：
					<text class="red">¥{{detail.orderproduct.advance.payPrice}}</text>
				</view>
			</view> -->
		</view>

		<!-- 已退款金额 -->
		<!-- <view class="group bg-white" v-if=" detail.status == 20 && detail.type == 10 ">
			<text class="gray9">已退款金额：</text>
			<text class="gray9">￥{{ detail.refundMoney }}</text>
		</view> -->

		<!--申请售后信息-->
		<view class="group bg-white f24" style="margin: 24rpx;border-radius:24rpx">
			<view class="p-20-0 f34">
				退款信息
			</view>
			<view class="p-20-0 f28">
				<text class="gray9">申请时间</text>
				<text class="ml66">{{detail.createTime}}</text>
			</view>
			<view class="p-20-0 f28">
				<text class="gray9">退款编号</text>
				<text class="ml66">
					{{detail.refundCode||''}}
				</text>
			</view>
			<view class="p-20-0 f28" v-if="detail.refundProcessStatus[2]=='买家寄回'">
				<text class="gray9" >物流单号</text>
				<text class="ml66">
					{{detail.expressNo||''}}
				</text>
				<text style="position: absolute;right:60rpx" class="ui-btn btn-min border-gray999" @click="copy(detail.expressNo)">复制</text>
			</view>
			<view class="p-20-0 f28" v-if="detail.refundProcessStatus[2]=='买家寄回'">
				<text class="gray9">物流公司</text>
				<text class="ml66">
					{{detail.expressName||''}}
				</text>
			</view>
			<view class="p-20-0 f28" v-if="detail.refundProcessStatus[2]=='买家寄回'">
				<text class="gray9">发货时间</text>
				<text class="ml66">
					{{detail.sendTime||''}}
				</text>
			</view>
			<!-- <view class="p-20-0 upload-list d-s-s f28">
				<text class="gray9">申请凭证：</text>
				<view class="d-s-s f-w">
					<block v-if="detail && detail.images && detail.images.length>0">
						<view class="item" v-for="(imgs,img_num) in detail.images" :key="img_num">
							<image :src="imgs.filePath" mode="aspectFit"></image>
						</view>
					</block>
					<block v-else>
						无
					</block>
				</view>
			</view> -->
		</view>
		<view style="position:fixed;bottom: 0;width: 100%;height: 120rpx;background-color: #FFFFFF;">
			<view class="" style="width: 100%;height: 120rpx;display:flex;align-items:right;justify-content:right;flex-direction:row-reverse;padding-top:20rpx;">
				<view class="quit" style="margin-right:20rpx;" @click="quitRefund"  v-if="detail.revokeRefund==1">
					撤销申请
				</view>
				<view class="quit" style="margin-right:20rpx;margin-left:24rpx;padding-left:10rpx;padding-right:10rpx" @click="expressRefund" v-if="detail.type==10 && detail.isAgree==10">
					{{ detail.editLogistics==0?'填写快递信息':detail.editLogistics==1?'修改快递信息':'查看快递信息'}} 
				</view>
			</view>
			</view>

		<!-- 售后信息-->
		<!-- <view v-if="detail.status == 10" class="group bg-white">
			<view class="p-20-0 border-b f34">
				拒绝理由
			</view>
			<view class="p-20-0">
				<text class="red f28">{{ detail.refuseDesc }}</text>
			</view>
		</view> -->

		<!--退货地址-->
		<!-- <view class="group bg-white" v-if="detail.isAgree == 10 && detail.address">
			<view class="p-20-0 border-b f34">
				退货地址
			</view>
			<view class="pt30 f28">
				<text class="gray9">收货人：</text>
				<text>{{detail.address.name}}</text>
			</view>
			<view class="pt30 f28">
				<text class="gray9">联系电话：</text>
				<text>{{detail.address.phone}}</text>
			</view>
			<view class="pt30 f28">
				<text class="gray9">详情地址：</text>
				<text>{{detail.address.detail}}</text>
			</view>
			<view class="pt30 f28" v-if="detail.expressNo">
				<text class="gray9">物流公司：</text>
				<text>{{detail.expressName}}</text>
			</view>
			<view class="pt30 f28" v-if="detail.expressNo">
				<text class="gray9">物流单号：</text>
				<text>{{detail.expressNo}}</text>
			</view>
			<view class="pt30 f28" v-if="detail.isPlateSend">
				<text class="gray9">换货物流公司：</text>
				<text>{{detail.sendExpressName}}</text>
			</view>
			<view class="pt30 f28" v-if="detail.isPlateSend"
				@click="gotoPage('/pages/order/express/refund-express?orderId=' + detail.orderRefundId);">
				<text class="gray9">换货物流单号：</text>
				<text>{{detail.sendExpressNo}}</text>
			</view>
			<view class="mt20 pb20 border-t gray9">
				<view class="pt20">
					· 未与卖家协商一致情况下，请勿寄到付或平邮
				</view>
				<view class="pt10">
					· 请填写真实有效物流信息
				</view>
			</view>
		</view> -->
		<!-- 填写物流信息 -->
		<!-- <form @submit="formSubmit" v-if="detail.type !=30 && detail.isAgree == 10 && detail.isUserSend == 0 " report-submit>
			<view class="group bg-white">
				<view class="p-20-0 border-b f34">
					填写物流信息
				</view>
				<view class="p-20-0 d-s-c">
					<view class="gray9">物流公司：</view>
					<view class="flex-1 p20 border">
						<picker mode="selector" @change="onExpressChange" :range="expressList" range-key="expressName"
							:value="index">
							<text v-if="index > -1 ">{{expressList[index].expressName}}</text>
							<text v-else class="col-80">请选择物流公司</text>
						</picker>
					</view>
				</view>
				<view class="p-20-0 d-s-c">
					<view class="gray9">物流单号：</view>
					<view class="flex-1 border">
						<input class="p10" v-model="form.expressNo" placeholder="请填写物流单号"/>
					</view>
				</view> 
				<view class="mt20">
          <template v-if="isWeixin() && mpState == 1 && temlIds.length > 0 ">
						//#ifdef H5
						<wx-open-subscribe :template="temlIds" @success="subscribeSuccess" @error="subscribeFail">
							<div v-is="'script'" type="text/wxtag-template" slot="style">
								<div v-is="'style'">
									.subscribe-btn{
										border: 1px solid #f6220c;
										background: #f6220c;
										color: #fff;
										border-radius:20px;
										box-sizing: border-box;
										text-align: center;
									}
								</div>
							</div>
							<div v-is="'script'" type="text/wxtag-template">
								<div class="subscribe-btn"
									:style="{
										width: btnAtrrpx.width+'px',
										height: btnAtrrpx.height+'px',
										lineHeight: btnAtrrpx.height+'px',
										paddingLeft: btnAtrrpx.paddingLeft+'px',
										paddingRight: btnAtrrpx.paddingLeft+'px',
										fontSize: btnAtrrpx.fontSize+'px',
									}"
								> 
									确认发货
								</div>
							</div>
						</wx-open-subscribe>
						//#endif
					</template>
					<template v-else>
						<button class="btn-red" @click="formSubmit">确认发货</button>
					</template>
				</view>
			</view>
		</form> -->
	</view>
</template>

<script>
  import headTitle from '@/pages/component/headTitle.vue';
	export default {
		components: {
      headTitle,
    },
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				expressList: {},
				index: -1,
				ordeRefundId: 0,
				/*退货详情*/
				detail: {
					// address: {},
				},
				expressId: 0,
				totalPrice: 0,
				totalPayPrice: 0,
				/*消息模板*/
				temlIds: [],
				btnAtrrpx: {},
				form: {},
			}
		},
		onLoad(e) {
			this.orderRefundId = e.orderRefundId;
		},
		mounted() {
			/*获取详情*/
			this.getData();
			// if(this.isWeixin()){
			// 	this.url = window.location.href;
			// 	this.getBtnInfo();
			// 	this.getTemplateId();
			// }
		},
		methods: {
			copy(message) {
				console.log("message",message)
				uni.setClipboardData({
					data: message,
					success: function (res) {
					uni.showToast({
						title: '复制成功',
						icon: 'success',
						mask:true,
						duration:2000
					});
					},
					fail:function(res){
					console.log("error",res)
					}
				});
				},
			/*打开上传图片*/
			openUpload() {
				this.isUpload = true
			},
			quitRefund(){
				let self = this;
				console.log(this.orderRefundId,'this.orderRefundId')
				self._post(
					'user/refund/revoke', {
						refundId: self.orderRefundId,
					},
					function(res) {
						console.log(res)
						if(res.code==1){
							// uni.navigateBack();
							let pages = getCurrentPages();
						    let prevPage = pages[pages.length - 2]
							uni.navigateBack({
								delta:1,
								success() {
									prevPage.$vm.getData2() //调用A页面方法
								}
							});
						}
						// self.temlIds = res.data.templateArr;
						// self.mpMessage(res.data.signPackage);
					}
				);
				

			},
			expressRefund(){
				let self = this;
				self.gotoPage('/pages/order/refund/detail/expressDetail?orderRefundId=' +self.orderRefundId);
				// self._postBody(
				// 	'user/refund/express', {
				// 		refundId: self.orderRefundId,
				// 	},
				// 	function(res) {
				// 		console.log(res)
				// 		let pages = getCurrentPages();
				// 		let prevPage = pages[pages.length - 2]
				// 		if(res.code==1){
				// 			// uni.navigateBack({
				// 			// 	delta:1,
				// 			// 	success() {
				// 			// 		prevPage.$vm.getData() //调用A页面方法
				// 			// 	}
				// 			// });
				// 		}
				// 		// self.temlIds = res.data.templateArr;
				// 		// self.mpMessage(res.data.signPackage);
				// 	}
				// );
			},
			
			subscribeSuccess(){
				this.formSubmit();
				console.log("调用成功")
			},
			subscribeFail(){
        this.formSubmit();
				console.log("调用失败")
			},
			getBtnInfo(){
				let self = this;
				let btnAtrrpx = {
					width: 690,
					height: 88,
					paddingLeft: 28,
					fontSize: 32,
				}
				uni.getSystemInfo({
					success: function (res){
						let scale = res.screenWidth/750;
						let newObj = {};
						for(let key in btnAtrrpx){
							newObj[key] = btnAtrrpx[key] * scale;
						}
						self.btnAtrrpx = newObj;
					},
					fail(){
						self.btnAtrrpx = btnAtrrpx;
					},
				});
			},
			getTemplateId(){
				let self = this;
				self._postBody(
					'index/getSignPackage', {
						url: self.url,
						paySource: self.getPlatform(),
					},
					function(res) {
						// self.temlIds = res.data.templateArr;
						self.mpMessage(res.data.signPackage);
					}
				);
			},
			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title: '加载中'
				});
				let orderRefundId = self.orderRefundId;
				self._get(
					'user/refund/detail', {
						orderRefundId: orderRefundId,
						platform: self.getPlatform()
					},
					function(res) {
						uni.hideLoading();
						self.detail = res.data.detail;
						self.expressList = res.data.detail.expressList;
						self.temlIds = res.data.templateArr;
						self.totalPrice = self.detail.orderProduct.totalPrice;
						self.totalPayPrice = self.detail.orderProduct.totalPayPrice;
					}
				);
			},
			/*选择物流*/
			onExpressChange: function(e) {
				this.index = e.detail.value;
				this.expressId = this.expressList[this.index].expressId;
			},

			/*发货*/
			formSubmit: function(e) {
				let self = this;
				var formdata = self.form;
				formdata.orderRefundId = self.orderRefundId;
				formdata.expressId = self.expressId;
				let callback = function() {
					uni.showLoading({
						title: '正在提交',
						mask: true
					});
					self._postBody('user/refund/delivery', formdata, function(res) {
						uni.hideLoading();
						uni.showToast({
							title: res.msg,
							duration: 3000,
							complete: function() {
								self.gotoPage(
									'/pages/order/refund/detail/detail?orderRefundId=' +
									self.orderRefundId, 'redirectTo');
							}
						});
					});
				};
				self.subMessage(self.temlIds, callback);
			},
		}
	}
</script>

<style>
	.order-refund-detail .btn-red {
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		box-shadow: 0 8rpx 16rpx 0 rgba(226, 35, 26, .6);
	}
	.ml66{
		margin-left: 66rpx;
	}
	.wrapper{
		background-color: #fff;
		border-radius: 24rpx;
		padding: 24rpx;
		.title{
			font-family: Hiragino Sans GB, Hiragino Sans GB;
			font-weight: bold;
			font-size: 32rpx;
			color: #000000;
			line-height: 36rpx;
			text-align: left;
			font-style: normal;
			text-transform: none;
		}
		.item{
			font-size: 28rpx;
			color: #333333;
			margin-bottom: 24rpx;
			&:last-child{
				margin-bottom: 0;
			}
			.label{
				color: #999999;
			}
		}
		

	}
	.same{
		font-family: Hiragino Sans GB, Hiragino Sans GB;
		font-weight: normal;
		font-size: 24rpx;
		color: #000000;
		line-height: 36rpx;
		text-align: left;
		font-style: normal;
		text-transform: none;
	}
	.pro-info2{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width:360rpx;
		font-family: Hiragino Sans GB, Hiragino Sans GB;
font-weight: normal;
font-size: 28rpx;
color: #000000;
line-height: 41rpx;
text-align: left;
font-style: normal;
text-transform: none;
	}
	.quit{
		font-family: Source Han Sans CN, Source Han Sans CN;
		font-weight: 400;
		font-size: 32rpx;
		color: #000000;
		line-height: 80rpx;
		text-align: center;
		font-style: normal;
		text-transform: none;
		width: 200rpx;
		height: 80rpx;
		border-radius: 40rpx 40rpx 40rpx 40rpx;
		border: 1rpx solid #000000;
		position: relative;
		margin-left:10rpx;
	}
</style>
