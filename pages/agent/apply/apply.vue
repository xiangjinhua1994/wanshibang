<template>
	<view class="apply-agent">
		<view class="banner d-c-c d-c" v-if="top_background!=''">
			<image :src="top_background" mode="widthFix"></image>
		</view>
		<!--申请成功-->
		<template v-if="!isApplying ">
			<view class="form-wrap p30 f30">
				<view class="p30 d-c-c gray3 f40 fb">
					{{words.apply && words.apply.wordTitle || ''}}
				</view>
				<form @reset="formReset">
					<view class="form-item border-b">
						<view class="field-name">邀请人</view>
						{{refereeName}}
					</view>
					<view class="form-item border-b">
						<view class="field-name">姓名</view>
						<input class="flex-1 ml20" type="text" v-model="form.name" placeholder-class="grary" placeholder="请输入姓名" />
					</view>
					<view class="form-item border-b">
						<view class="field-name">手机号</view>
						<input class="flex-1 ml20" type="number" v-model="form.mobile" placeholder-class="grary" placeholder="请输入手机" />
					</view>
					<view class="d-c-c p-20-0 f28">
						<checkbox-group @change="changeFunc">
							<checkbox value="checkbox" :checked="is_read" />
						</checkbox-group>
						<text>我已阅读并了解</text>
						<text class="red" @click="isPopup=true">
							【{{words.apply && words.apply.license}}】
						</text>
					</view>
					<view class="d-c-c mt30">
            <template v-if="isWeixin() && mpState == 1 && temlIds.length > 0 ">
							//#ifdef H5
							<wx-open-subscribe :template="temlIds" id="subscribe-btn" @success="subscribeSuccess" @error="subscribeFail">
								<div v-is="'script'" type="text/wxtag-template" slot="style"></div>
								<div v-is="'script'" type="text/wxtag-template">
									<div class="subscribe-btn"
										:style="{
											width: btnAtrrpx.width+'px',
											height: btnAtrrpx.height+'px',
											lineHeight: btnAtrrpx.height+'px',
											paddingLeft: btnAtrrpx.paddingLeft+'px',
											paddingRigth: btnAtrrpx.paddingLeft+'px',
											fontSize: btnAtrrpx.fontSize+'px',
											background: '#f6220c',
											border: '1px solid #f6220c',
											borderRadius: '20px',
											color: '#fff',
											textAlign: 'center',
										}"
									> 
										{{words.apply && words.apply.submit }}
									</div>
								</div>
							</wx-open-subscribe>
							//#endif
						</template>
						<template v-else>
							<button class="btn-red" @click="formSubmit">{{words.apply && words.apply.submit }}</button>
						</template>
					</view>
				</form>
			</view>
		</template>
		<!--分销商审核中-->
		<template v-if="isApplying">
			<view class="d-c-c pt30">
				<text style=" font-size: 100rpx;" class="icon iconfont icon-icon_xianshi-xian"></text>
			</view>
			<view class="p-30-0 d-c-c gray6 f30">
				{{ words.apply.waitAudit}}
			</view>
			<view class="p30 mt30 d-c-c">
				<button type="primary" class="btn-red" @click="gotoShop">{{ words.apply.gotoMall }}</button>
			</view>
		</template>

		<!--协议-->
		<Popup :show="isPopup" msg="申请协议">
			<view class="agreement-content f28 lh150">
				{{agreement}}
			</view>
			<view class="ww100 pt20 d-c-c">
				<button type="primary" class="btn-red" @click="isPopup=false">我已阅读</button>
			</view>
		</Popup>
	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue'
	export default {
		components: {
			Popup
		},
		data() {
			return {
				/*弹窗是否打开*/
				isPopup: false,
				/*是否阅读了规则*/
				is_read:false,
				agreement: '',
				isApplying: false,
                refereeName:'',
				words:{},
				form:{},
				isAgent:'',
				/*顶部背景*/
				top_background: '',
				/*小程序订阅消息*/
				url:"",
				temlIds: [],
				btnAtrrpx:{},
			}
		},

		mounted() {
			// 公众号分享
			if(this.getPlatform() == 'mp' || this.isWeixin()){
				this.url = window.location.href;
			}
			if(this.isWeixin()){
				this.getBtnInfo();
				this.getTemplateId();
			}
			/*数据*/
			this.getData();
		},
		methods: {
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
					width: 540,
					height: 84,
					paddingLeft: 28,
					fontSize: 28,
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
				})
				self._get('user/agent/apply', {
					platform: self.getPlatform(),
					refereeId: uni.getStorageSync('refereeId')
				}, function(res) {
					uni.hideLoading();
					self.top_background = res.data.background;
					self.isApplying = res.data.isApplying;
					self.refereeName = res.data.refereeName!=null?res.data.refereeName:'平台';
					self.isAgent=res.data.isAgent;
					self.words = res.data.words;
					self.temlIds = res.data.templateArr;
					self.agreement = res.data.license.license;
					/*设置标题*/
					uni.setNavigationBarTitle({
					    title: res.data.words.apply.wordTitle
					});
					if(self.isAgent){
						uni.navigateBack({});
					}
				});
			},
			
			/*申请*/
			formSubmit: function(e) {
				let formdata = this.form;
				formdata.refereeId=uni.getStorageSync('refereeId');
				let self = this;
				if(formdata.name==''){
					uni.showToast({
						title: '请输入姓名！',
						icon:'none'
					});
					return;
				}
				if(formdata.mobile==''){
					uni.showToast({
						title: '请输入手机号！',
						icon: 'none'
					});
					return;
				}
				//var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (formdata.mobile.length != 11) {
					uni.showToast({
						title: '手机有误,请重填！',
						icon: 'none'
					});
					return;
				}
				if(!self.is_read){
					uni.showToast({
						title: '请同意协议！',
						icon:'none'
					});
					return;
				}
				
				let callback = function(){
					uni.showLoading({
						title: '正在提交',
						mask: true
					})
					let param = {};
					param = formdata;
					param.refereeId = formdata.refereeId;
					self._postBody('plus/agent/apply/submit', param, function(res) {
						uni.hideLoading();
						uni.showToast({
							title: '申请成功'
						});
						self.getData();
					});
				};
				self.subMessage(self.temlIds, callback);
			},
			
			/*去商城看看*/
			gotoShop(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			
			/*同意协议*/
			changeFunc(e){
				if(e.detail.value.length>0){
					this.is_read=true;
				}else{
					this.is_read=false;
				}
			}
		}
	}
</script>

<style>
.apply-agent .banner {
	background-repeat: no-repeat;
	background-size: 100%;
}
.apply-agent .banner image{ width: 100%;}

	.form-wrap {
		background: #FFFFFF;
		box-shadow: 0 0 8rpx 0 rgba(0, 0, 0, .2);
	}

	.form-item {
		padding: 20rpx 0;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 28rpx;
	}

	.form-item .field-name {
		width: 180rpx;
	}

	.form-item input {
		font-size: 28rpx;
	}

	.agreement-content {
		max-height: 60vh;
		overflow-y: auto;
	}
	.apply-agent .btn-red{
		width: 600rpx;
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	box-shadow: 0 8rpx 16rpx 0 rgba(226,35,26,.6);}
</style>
