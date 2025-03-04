<template>
	<view class="order-refund-detail pb100" :data-theme='theme()' :class="theme() || ''">
		<view class="head_top" :style="'height:' + topBarTop() + 'px;'"></view>
		<headTitle title="物流信息">
			
		</headTitle>
		
		<!--商品信息-->
		<view class="p30 mt20 bg-white" style="margin: 24rpx;border-radius:24rpx">
			<view class="f32" style="font-weight: bold;">
				退款商品
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
							x{{detail.orderProduct && detail.orderProduct.totalNum || ''}}
						</text>
					</view>
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

		

		<!--申请售后信息-->
		<view class="group bg-white f24" style="margin: 24rpx;border-radius:24rpx">
			<!-- <view class="p-20-0 f34">
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
			</view> -->
            <view class="p-20-0 d-s-c" style="display: flex;">
                <view class="f28">物流单号<text class="red">*</text></view>
                <view class="flex-1" style="width:300rpx;position:absolute;right:60rpx">
                    <input v-model="form.expressNo" style="border: none;outline:none;width:300rpx" placeholder-style="color:#cccccc;line-height:30rpx;font-size:28rpx;" class=""  placeholder="请填写物流单号"/>
                </view>
            </view> 
            <view class="p-20-0 d-s-c" style="display: flex;">
                <view class="f28">物流公司<text class="red">*</text></view>
                <view class="flex-1" style="width:300rpx;position:absolute;right:60rpx">
                    <input v-model="form.expressName" style="border: none;outline:none;width:300rpx" class="" placeholder-style="color:#cccccc;line-height:30rpx;font-size:28rpx;"  placeholder="请填写物流公司名称"/>
                </view>
            </view> 
            <view class="p-20-0 d-s-c" style="display: flex;">
                <view class="f28">联系电话</view>
                <view class="flex-1" style="width:300rpx;position:absolute;right:60rpx">
                    <input v-model="form.phone" style="border: none;outline:none;width:300rpx" placeholder-style="color:#cccccc;line-height:30rpx;font-size:28rpx;" class=""  placeholder="请填写联系电话"/>
                </view>
            </view> 
			<!-- <view class="p-20-0 upload-list d-s-s f28">
				<text class="gray9">申请凭证：</text>
				<view class="d-s-s f-w">
					<block v-if="detail && detail.expressImages && detail.expressImages.length>0">
						<view class="item" v-for="(imgs,img_num) in detail.expressImages" :key="img_num">
							<image :src="imgs.filePath" mode="aspectFit"></image>
						</view>
					</block>
					<block v-else>
						无
					</block>
				</view>
			</view> -->
		</view>
        <view class="group bg-white one-product">
            <view class="group-hd">
              <view class="left">
                <text class="min-name">申请说明</text>
              </view>
            </view>
            <view class="d-s-c">
              <textarea style="background-color: #F9F9F9;border-radius: 20rpx" class="p20 box-s-b flex-1 f28 lh150"
                        v-model="form.sendRemark"
                        placeholder="补充描述，有助于商家更好的处理问题" placeholder-style="font-size:28rpx;color:#999999;"/>
            </view>
          </view>
          <view class="group bg-white" style="border-radius: 24rpx;padding-bottom:52rpx;margin:24rpx">
            <view class="group-hd">
              <view class="left">
                <text class="min-name">上传凭证</text>
                <!-- <text class="gray9">(最多6张)</text> -->
              </view>
            </view>
            <view class="upload-list d-s-c">
              
              <view style="width: 133rpx;height:133rpx;border-radius:11rpx" class="item d-c-c d-stretch"
                    v-if="expressImages.length<4">
                <view class="upload-btn d-c-c d-c flex-1"
                      @click="openUpload()">
                  <text class="icon iconfont icon-xiangji f34"></text>
                  <text class="gray9">上传凭证</text>
                  <text class="gray9">最多4张</text>
                </view>
              </view>
              <view style="position:relative; width: 133rpx;height:133rpx;border-radius:11rpx" class="item"
                    v-for="(imgs,img_num) in expressImages"
                    :key="img_num"
                   >
                    <view class="" style="position: absolute;right: -10rpx;top: -20rpx;z-index:1000"  @click="deleteFunc(img_num)">
                      <image style="width: 30rpx;height:30rpx;" class="no_add" src="/static/del2.png" mode="aspectFill"></image>
                    </view>
  
                <image style="width: 133rpx;height:133rpx;border-radius:11rpx" :src="imgs.filePath"
                       mode="aspectFit"></image>
              </view>
            </view>
          </view>
		<view style="position:fixed;bottom: 0;width: 100%;height: 120rpx;background-color: #FFFFFF;" v-if='detail.editLogistics==1'>
			<view style="height: 120rpx;position:relative;display: flex;">
				<view class="quit" style="background-color: #000000;color:#FFFFFF;width:100%" @click="submitEvent">
					提交
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
        <Upload v-if="isUpload"
        @getImgs="getImgsFunc"></Upload>
	</view>
</template>

<script>
  import headTitle from '@/pages/component/headTitle.vue';
  import Upload from '@/components/upload/upload.vue';

	export default {
		components: {
      headTitle,
      Upload,
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
                expressImages: [],
                /*是否打开上传图片*/
                isUpload: false,

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
            /*打开上传图片*/
      openUpload() {
        this.isUpload = true
      },
            /*获取上传的图片*/
      getImgsFunc(e) {
        let self = this
        self.isUpload = false
        if (e && typeof e != 'undefined') {
          let this_length = self.expressImages.length,
            upload_length = e.length
          if (this_length + upload_length < 7) {
            self.expressImages = self.expressImages.concat(e)
          } else {
            let leng = 6 - this_length
            for (let i = 0; i < leng; i++) {
              self.expressImages.push(e[i])
            }
          }
        }
      },
             /*删除图片*/
      deleteFunc(e) {
        this.expressImages.splice(e, 1)
      },
			submitEvent(){
				let self = this;
				console.log(this.orderRefundId,'this.orderRefundId')
                if(!this.form.expressNo){
                    uni.showToast({
                        title: '请填写物流单号',
                        icon: 'none',
                        duration: 1000,
                    });
                    return;
                }
                if(!this.form.expressName){
                    uni.showToast({
                        title: '请填写物流公司',
                        icon: 'none',
                        duration: 1000,
                    });
                    return;
                }
                if(!this.form.phone){
                    uni.showToast({
                        title: '请填写手机号',
                        icon: 'none',
                        duration: 1000,
                    });
                    return;
                }
                let params = {
                    orderRefundId: this.orderRefundId,
                    expressNo: this.form.expressNo,
                    expressImages: this.expressImages,
                    phone:this.form.phone,
                    expressName:this.form.expressName,
                    sendRemark:this.form.sendRemark,
                }
                self._postBody(
                    'user/refund/delivery', params,
                    function(res) {
                        console.log(res)
                        if(res.code==1){
                            uni.navigateBack({
                                delta:1,
                            });
                        }
                    }
                );
			},
			/*获取详情*/
			getData() {
				// self._postBody(
				// 	'user/refund/revoke', {
				// 		refundId: self.orderRefundId,
				// 	},
				// 	function(res) {
				// 		console.log(res)
				// 		if(res.code==1){
				// 			// uni.navigateBack();
				// 			let pages = getCurrentPages();
				// 		    let prevPage = pages[pages.length - 2]
				// 			uni.navigateBack({
				// 				delta:1,
				// 				success() {
				// 					prevPage.$vm.getData() //调用A页面方法
				// 				}
				// 			});
				// 		}
				// 		// self.temlIds = res.data.templateArr;
				// 		// self.mpMessage(res.data.signPackage);
				// 	}
				// );
				

			},
			expressRefund(){
				let self = this;
				self._postBody(
					'user/refund/express', {
						refundId: self.orderRefundId,
					},
					function(res) {
						console.log(res)
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2]
						if(res.code==1){
							// uni.navigateBack({
							// 	delta:1,
							// 	success() {
							// 		prevPage.$vm.getData() //调用A页面方法
							// 	}
							// });
						}
						// self.temlIds = res.data.templateArr;
						// self.mpMessage(res.data.signPackage);
					}
				);
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
			// getTemplateId(){
			// 	let self = this;
			// 	self._postBody(
			// 		'index/getSignPackage', {
			// 			url: self.url,
			// 			paySource: self.getPlatform(),
			// 		},
			// 		function(res) {
			// 			// self.temlIds = res.data.templateArr;
			// 			self.mpMessage(res.data.signPackage);
			// 		}
			// 	);
			// },
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
                        self.form = res.data.detail;
                        self.expressImages = res.data.detail.expressImages;
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
		line-height: 80rpx;
		text-align: center;
		font-style: normal;
		text-transform: none;
		width: 200rpx;
		height: 80rpx;
		border-radius: 40rpx 40rpx 40rpx 40rpx;
		position: relative;
        margin: 20rpx;
	}
    .one-product {
        margin: 24rpx;
        border-radius: 24rpx;
        padding-bottom: 44rpx;
        
      
      }
</style>
