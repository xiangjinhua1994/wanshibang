<template>
	<view class="evaluate pb100" v-if="!loadding">
		<view style="position: fixed;top:0;left:0;background-color:#fff;z-index: 999;width: 100%;">
			<view class="head_top" :style="'height:' + topBarTop() + 'px;'"></view>
			<headTitle title="发表评价"></headTitle>

		</view>
		<!-- <l-starRate :value="b.value" @input="getvalue" :disabled="false" > const getvalue=(v)=>{ b.value=v; } -->
		<form @submit="formSubmit" >
			<view style="margin-top: 160rpx;">
			<view class="evaluate-item p30" v-for="(item, index) in tableData" :key="index">
				<view class="product d-s-c">
					<view class="cover"><image :src="item.productImage" mode="aspectFit"></image></view>
					<view class="info ml20">
						<view class="name f28">{{ item.productName }}</view>
						<view class="price pt10 f22 red">
							¥
							<text class="f40">{{ item.productPrice }}</text>
						</view>
					</view>
				</view>
				<view class="evaluatebox">
					<view class="evalclass">
						<view style="margin-right: 16rpx;">商品评分</view>
						<uni-rate v-model="item.productScore"  activeColor="#EE2828" :is-fill="false" ></uni-rate>
					</view>
					<view class="evalclass" >
						<view style="margin-right: 16rpx;">物流评分</view>
						<uni-rate v-model="item.logisticsScore"  activeColor="#EE2828" :is-fill="false" ></uni-rate >

					</view>
					<view class="evalclass" >
						<view style="margin-right: 16rpx;">客服评分</view>
						<uni-rate  v-model="item.customerScore" activeColor="#EE2828"  :is-fill="false" ></uni-rate >
					</view>
				</view>
				<view class=" f28 border_text">
					
					   <!-- <span> 发表对宝贝的看法</span> -->
					<view   class="anonymous">
					    <view>	发表对宝贝的看法</view>
					     <view>

							<label>
								<checkbox     :checked="item.opinion_anonymous"  borderColor="#ED1234" activeBorderColor="#ED1234" color="#ED1234" iconColor="#ED1234"/>匿名
							</label>

						 </view>

					</view>
					<textarea class="p10 box-s-b  flex-1" v-model="item.content"  /></view>
				    <view class="upload-list d-s-c">
					<view style="position: relative;" class="item" v-for="(imgs, img_num) in item.imageList" :key="img_num" >
						<image style="width: 36rpx;height:36rpx;position: absolute;right: -12rpx;top: -12rpx;z-index:999" @click="deleteImg(index, img_num)" class="no_add" src="/static/del.png" mode="aspectFill"></image>
						<image :src="imgs.filePath" mode="aspectFit"></image>
					</view>
					<view class="item upload-btn d-c-c d-c" @click="openUpload(index)" v-if="item.imageList.length < 9">
						<text class="icon iconfont icon-xiangji"></text>
						<text class="gray9">上传图片</text>
						<!-- <uni-icons type="contact" size="30"></uni-icons> -->
						<!-- <up-button type="primary" :disabled="disabled" text="禁用"></up-button> -->
					</view>
				</view>
			
			</view>
		</view>
			<view class="foot-btns">
				<button form-type="submit" class="sure_btn">确认提交</button>
			</view>
		</form>

		<!--上传图片-->
		<Upload v-if="isUpload" @getImgs="getImgsFunc"></Upload>
	</view>
</template>

<script>


import Upload from '@/components/upload/upload.vue';
import headTitle from '@/pages/component/headTitle.vue'
export default {
	components: {
		Upload,
		headTitle,
	
	},
	data() {
		return {
			/*是否加载完成*/
			loadding: true,
			order_id: '',
			/*页面数据*/
			tableData: [],
			score: 10,
			/*是否打开上传图片*/
			isUpload: false,
			imageId: [],
			params: [{}],
			img: '/static/temp/photo.jpg',
			index: '',
			// productScore:0, // 商品评分
			// customerScore:0, // 服务评分
			// logisticsScore:0, // 物流评分
			// opinion_anonymous:true //是否匿名
		};
	},
	onLoad(e) {
		this.order_id = e.order_id;
	},
	mounted() {
		
		uni.showLoading({
			title: '加载中'
		});
		/*获取页面数据*/
		this.getData();
	},
	methods: {
		getData() {
			let self = this;
			let order_id = self.order_id;
			self._get(
				'user/comment/toOrder',
				{
					orderId: order_id
				},
				function(res) {
					self.tableData = res.data;
					console.log(self.tableData);
					self.tableData.forEach((item, index) => {
						self.$set(self.tableData[index],'score',10)
						self.$set(self.tableData[index],'imageList',[])
						self.$set(self.tableData[index],'productScore',0)
						self.$set(self.tableData[index],'customerScore',0)
						self.$set(self.tableData[index],'logisticsScore',0)
						self.$set(self.tableData[index],'opinion_anonymous',true)
						// self.tableData[index].score = 10;
						//self.tableData[index].imageList = [];
					});
					self.loadding = false;
					uni.hideLoading();
				}
			);
		},
		/*选择评价*/
		gradeFunc(item, e, index) {
			item.score = e;
            this.tableData[index] = item;
		},

		/*提交*/
		formSubmit: function(e) { // 没
			let self = this;
			let order_id = self.order_id;

			// console.log(order_id)
			// console.log(self.tableData)
			// console.log(self.productScore)
			// console.log(Number(self.opinion_anonymous))
			// self.tableData.productScore=self.productScore
			// self.tableData.logisticsScore=self.logisticsScore
			// self.tableData.customerScore=self.customerScore

			self._postBody(
				'user/comment/order',
				{
					orderId: self.order_id,
					params: self.tableData
				},
				function(res) {
					self.showSuccess('评价成功！', function() {
						self.gotoPage('/pages/order/myorder', 'redirect');
					});
				}
			);


		},

		/*打开上传图片*/
		openUpload(index) {
			this.index = index;
			this.isUpload = true;
		},

		/*获取上传的图片*/
		getImgsFunc(e) {
			let self = this;
			if (e && typeof e != 'undefined') {
				let index = self.index;
				self.tableData[index].imageList = self.tableData[index].imageList.concat(e);
			}
			self.isUpload = false;
		},

		/*点击图片删除*/
		deleteImg(i, n) {
			this.tableData[i].imageList.splice(n, 1);
		}
	}
};
</script>

<style scoped>
.anonymous{
	  display: flex;
	  justify-content: space-between;
	  color: #333333;
}
.border_text{
	 background: #ffffff;
	 border-radius: 10rpx;
	 border:  1px #dddddd;
	 padding: 16rpx;
	 margin-top: 20rpx;
	 margin-bottom: 20rpx
}
.evaluatebox{
	 margin-top: 40rpx;
	 display: flex; 
	 flex-direction: column;
	 margin-bottom: 20rpx;
	 background: #ffffff;
	 border-bottom: 1px solid #dddddd;
	 padding: 16rpx;
	 
}
.sure_btn{
	 background: #000000;
	 color: #ffffff;
	 border-radius: 10;
}
.evalclass{
	display: flex;
	 align-items: center;
}

.evaluate-item {
	margin-bottom: 20rpx;
	background: #F7F8FA;

}
.product {
	 background: #ffffff;
	 border-radius: 10rpx;
	 border:  1px #dddddd;

}
.product .cover,
.product .cover image {
	width: 160rpx;
	height: 160rpx;
}
.evaluate .grade .item .iconfont {
	width: 60rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 50%;
	font-size: 40rpx;
	color: #ffffff;
	text-align: center;
}
.evaluate .grade .item {
	height: 60rpx;
	padding-right: 20rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	transition: background-color 0.4s;
}
.evaluate .grade .flex-1:nth-child(1) .iconfont {
	background: #f42222;
}
.evaluate .grade .flex-1:nth-child(2) .iconfont {
	background: #f2b509;
}
.evaluate .grade .flex-1:nth-child(3) .iconfont {
	background: #999999;
}
.evaluate .grade .flex-1.active:nth-child(1) .item {
	background: #f42222;
	color: #ffffff;
}
.evaluate .grade .flex-1.active:nth-child(2) .item {
	background: #f2b509;
	color: #ffffff;
}
.evaluate .grade .flex-1.active:nth-child(3) .item {
	background: #999999;
	color: #ffffff;
}
</style>
