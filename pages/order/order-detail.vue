<template>
	<view class="my-order"  @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <view style="position: fixed;top:0;left:0;z-index:9999">
      <view class="head_top" :style="'height:'+topBarTop()+'px;'" style="background-color: #fff;"></view>
      <headTitle title="订单详情" bg="#fff" :type="type"></headTitle>
    </view>
    <view class="order-detail" style="margin-top: 160rpx;padding-bottom: 40rpx;">
      <view class="order-detail-top">
        <view class="order-detail-top-state">{{orderData.orderStatusText}}</view>
        <view class="order-detail-top-text"    v-if="orderData.orderStatus == 10&& orderData.payStatus ==10"  >未付款，订单将在 <text class="ft-red">{{ caTime }}</text> 后被自动取消</view>
      </view>
      <!-- <view class="order-item" @click="jumpPage('/pages/user/address/address?source=order&appId=10001')">                   {{ remainders[item.orderId]?"去付款"+remainders[item.orderId]:'去付款'+"00:00s" }}
-->
        <view class="order-item">
        <view class="order-detail-logistics" txt="sss">
          <text class="iconfont icon-dizhi"></text>
          <view class="detail-logistics-main">
            <view class="detail-logistics-name">{{orderData.address.name}}&nbsp;&nbsp;{{orderData.address.phone}}</view>
            <view class="detail-logistics-dizhi"> 
                {{orderData.address.region.province }}
                {{ orderData.address.region.city }}
                {{ orderData.address.region.region }}
                {{ orderData.address.detail }}
               </view>
          </view>
          <!-- <view class="ui-btn btn-gray">
            修改
          </view> -->
        </view>
      </view>
      <!-- 发货了才有物流信息 -->
      <!-- <view class="order-item"     v-if="orderData.deliveryStatus == 20&& orderData.orderStatus !==30&& orderData.payStatus ==20"  >   -->
        <view class="order-item"     v-if="orderData.deliveryStatus != 10&& orderData.orderStatus !==20&& orderData.payStatus ==20">
        <view class="order-detail-logistics" txt="qw">
          <image class="detail-logistics-img" txt="22" src="/static/home/logistics.png" mode="" />
          <view class="detail-logistics-main">
            <!-- <view class="detail-state">待收货</view> -->
            <view class="detail-logistics-dizhi" style="word-break: break-all;width:350rpx;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;
    -webkit-line-clamp: 2;">{{orderData.expressDesc}}</view>
          </view>
          <view class="ui-btn" @click= "gotoCheck(orderData.orderId,orderData.deliveryType)">
            查看物流
          </view>
        </view>
      </view>
      <view class="order-item">
        <view class="order-good" v-for="(item, index) in orderData.product" :key="index">
          <image class="order-good-img" :src="item.productImage" mode="" />
          <view class="order-good-text" @click="gotoDetail(item.productId)">
            <view class="order-good-line1">
              <view class="order-good-line1-l">{{item.productName}}</view>
              <view class="order-good-line1-r">￥{{item.productPrice}}</view>
            </view>
            <view class="order-good-line2">
              <!-- <view class="order-good-line2-l">白糖 3包</view> -->
              <view class="order-good-line2-r">×{{item.effectiveProductNumber}}</view>
            </view>
            <!-- <view class="order-good-line3">退款中</view> -->
            <view class="order-btn-box" v-if="item.showRefund==0">
              <view class="ui-btn btn-white border" style="border: 1.5rpx solid #000000;border-radius: 32rpx" @click.stop="gotoRefund(item.orderProductId)">申请退款</view>
            </view>
            <view class="order-btn-box" v-if="item.specialType!=1&&item.refund ==true">
              <view class="ui-btn btn-white border" style="border: 1.5rpx solid #BE1E1E;border-radius: 32rpx;color:#BE1E1E" @click.stop="gotoRefund(item.orderProductId)">{{item.refundState}}</view>
            </view>
          </view>
        </view>
        <!-- <view class="order-btn-box">
          <view class="ui-btn btn-black">申请退款</view>
        </view> -->

        <!-- <view class="order-good">
          <image class="order-good-img" src="/static/card.png" mode="" />
          <view class="order-good-text">
            <view class="order-good-line1">
              <view class="order-good-line1-l">养生花茶组合两盒礼合...养生花茶组合两盒礼合...</view>
              <view class="order-good-line1-r">￥29.60</view>
            </view>
            <view class="order-good-line2">
              <view class="order-good-line2-l">白糖 3包</view>
              <view class="order-good-line2-r">×1</view>
            </view>
          </view>
        </view> -->
        <!-- <view class="order-btn-box">
          <view class="ui-btn ">申请退款</view>
        </view> -->
        <view class="kefu-box" @click="jump">
          <text  ><image src="/static/kefu.png" class="kefuImg"></image> </text>
          <text>联系客服</text>
        </view>
      </view>

      <view class="order-item" txt="属性1">
       
        <view class="order-attr">
          <text class="order-attr-key">商品金额</text>
          <view class="order-attr-val">￥{{orderData.totalPrice}}</view>
        </view>
        <view class="order-attr" v-if="orderData.randomReductionNum>0">
          <text class="order-attr-key">随机立减</text>
          <view class="order-attr-val">-￥{{orderData.randomReductionNum}}</view>
        </view>
        <view class="order-attr">
          <text class="order-attr-key">会员折扣</text>
          <view class="order-attr-val">￥{{orderData.discountAmount}}</view>
        </view>
        <view class="order-attr">
          <text class="order-attr-key">快递费用</text>
          <view class="order-attr-val">￥{{ orderData.expressPrice }}  </view>
        </view>
        <view class="order-attr">
          <text class="order-attr-key">买家留言</text>
          <view class="order-attr-val order-attr-val-liuyan">
           {{  orderData.buyerRemark}}
            </view>
        </view>
        <view class="order-attr border-top">
          <text class="order-attr-key">实付款</text>
          <view class="order-attr-val attr-bold">￥{{orderData.payPrice}}</view>
        </view>
      </view>
      
		  <view class="order-item" txt="属性2">
       <view class="order-attr2">
         <text class="order-attr-key2">订单编号:</text>
         <view class="order-attr-val2">
          <text>{{orderData.orderNo}}</text>  
          <view class="ui-btn btn-min border-gray999" @click="copy(orderData.orderNo)">复制</view>
         </view>
       </view>
       <view class="order-attr2">
         <text class="order-attr-key2">下单时间:</text>
         <view class="order-attr-val2">{{orderData.createTime}}</view>
       </view>
       <view class="order-attr2" v-if="orderData.payStatus != 10">
         <text class="order-attr-key2">支付时间:</text>
         <view class="order-attr-val2">{{orderData.payTime}}</view>
       </view>
       <view class="order-attr2" v-if="orderData.payStatus != 10">
         <text class="order-attr-key2">支付方式:</text>
         <view class="order-attr-val2">{{orderData.payTypeText}}</view>
       </view>
       
      </view>
    </view>
    <view class="detail-foot" v-if="isSpecialOrder==0">
      <view class="detail-foot-fixed">
        <view class="ui-btn btn-more" @click="openOrder"   v-if="orderData.payStatus==10">取消订单</view>
        <view class="ui-btn btn-more btn-black"    v-if="orderData.orderStatus == 10&& orderData.payStatus ==10"   @click="gopay(orderData.orderId)">去付款</view>
        <view class="ui-btn btn-more" v-if="false"   >查看物流</view>
        <view class="ui-btn btn-more btn-black" v-if="false">确认收货</view>
        <view class="ui-btn btn-more" @click="openDel"   v-if="orderData.orderStatus == 30"  >删除订单</view>
      </view>
    </view>
    <uiPopup v-if="confirmBoxOrder">
      <view class="confirm-box">
        <view class="confirm-box-title" > 确定取消订单？ </view>
        <view class="confirm-box-describe"></view>
        <view class="confirm-box-btn" slot="btnBox">
          <view class="ui-btn btn-more btn-width" @click="confirmBoxOrder = false">我再想想</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="closeOrder">取消订单</view>
        </view>
      </view>
    </uiPopup>
    <uiPopup v-if="confirmBoxDel">
      <view class="confirm-box">
        <view class="confirm-box-title18" > 确定删除订单 </view>
        <view class="confirm-box-btn">
          <view class="ui-btn btn-more btn-width" @click="closeDel">否</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="closeDel_sure">是</view>
        </view>
      </view>
    </uiPopup>
	</view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue'
import uiPopup from '@/pages/component/ui-popup.vue'
import { mapState } from 'vuex';
export default {
	components: {
		headTitle,
    uiPopup
	},
	data() {
		return {
      startX: '', // 触摸起始点横坐标
      deltaX:'',
      type:'',
      caTime:'',
      orders: [], // 假设这是你的订单列表数据
      timers: {}, // 用于存储每个订单的定时器
      remainders: {}, // 用于存储每个订单的剩余时间 isSpecialOrder
      time: '0',
      confirmBoxDel: false,
      confirmBoxOrder: false,
      totalDuration: 10 * 60 * 1000 , // 10 分钟
      startTime: null,
      order_id:"",// 订单id
      orderData:{
        address: {
          region:{},
        },// 地址
        product:[],//商品

      },//订单详情数据
      orderId:null,
		};
	},
	computed: {
		// ...mapState(['calTime']),
	},
	onLoad(e) {
    // console.log("====s===",this.calTime,'calTime',JSON.parse(e.itemOrderId))
    // this.startCountdown(JSON.parse(e.itemOrderId))
		this.startTime = new Date().getTime()
 
    console.log("====e===")
     console.log(e.orderId)
     this.order_id = e.orderId
     this.type = e.type
     uni.setStorageSync('type', this.type)
     if(this.type=='h5'){
      
      console.log('nanheshop://pages/order/order-detail?orderId='+this.order_id,'89898')

      // this.openApp("nanheshop://pages/order/order-detail?orderId="+this.order_id)
      //window.miduBridge.call('openAppByRouter', {url: 'nanheshop://pages/order/order-detail?orderId='+this.order_id})
      console.log('nanheshop://pages/order/order-detail?orderId='+this.order_id,'99999')

      // uni.reLaunch({
      //   url: 'nanheshop://pages/order/order-detail?orderId='+this.order_id
      // });
      // #ifdef H5
      window.location.href = 'nanheshop://pages/order/order-detail?orderId='+this.order_id+'&type='+this.type;
      // window.location.href = "https://h5-test.yiweiyi.cn/h5/pages/order/myorder?dataType=payment&appId=10001&type=h5&orderId="+this.order_id;
      // #endif

      // window.location.href = "nanheshop://pages/order/order-detail?orderId="+this.order_id;
      // this.gotoPage('/pages/order/order-detail?orderId=' + this.order_id);

     }
     


	},
  onBackPress(options) {
		console.log(options,'options88')
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; // 上一个页面
    if(this.type=='h5'){
		if (options.from === 'navigateBack') {
      // this.gotoPage('/pages/user/index/index');
      // this.gotoPage('/pages/order/order-detail?orderId=' + this.order_id);
      // uni.navigateBack({
      //       delta: 1,
      //       success: () => {
      //         prevPage.$vm.getNews(); // 直接调用上个页面的刷新方法
      //       }
      //     });
			return true;
		}
    return true;
  }
	},
  // 销毁组件前清除定时器
beforeDestroy() {
    //clearInterval(this.timers[this.orderId]);
    if (this.timers[this.orderId]) {
        clearInterval(this.timers[this.orderId]);
    }
    

},
	mounted() {
		this.init();
    //this.updateCountdown()
    this.getorderdata(this.order_id)
	},
	onShow() {
		
	},
	methods: {
    openApp(url) {  
    var iframe = document.createElement('iframe');  
    iframe.src = url;  
    iframe.style.display = 'none';  
    document.body.appendChild(iframe);  
  
    // setTimeout(function() {  
    //     // 假设3秒后如果App没有打开，则认为跳转失败  
    //     if (document.hidden !== undefined) { // 标准的方法  
    //         if (!document.hidden) {  
    //             // 浏览器窗口当前是激活状态，可能App没有打开  
    //             // 这里可以重定向到下载页面  
    //             window.location.href = 'https://yourapp.com/download';  
    //         }  
    //     } else if (typeof navigator.webkitHidden !== "undefined") { // Chrome 12+  
    //         if (!navigator.webkitHidden) {  
    //             // 浏览器窗口当前是激活状态，可能App没有打开  
    //             window.location.href = 'https://yourapp.com/download';  
    //         }  
    //     }  
    //     iframe.remove();  
    // }, 3000);  
},  
  
    gotoRefund(orderProductId){
      let url = `pages/order/refund/apply/apply?orderProductld=${orderProductId}`
      this.gotoPage(url);
    },
    gotoCheck(orderId,deliveryType){
      let url = `/pages/news/logisticsNoticeMap?orderId=${orderId}&deliveryType=${deliveryType}`
      this.gotoPage(url);
    },
    /*跳转产品详情*/
		gotoDetail(e) {
			let url = '/pages/product/detail/detail?productId=' + e;
			this.gotoPage(url);
		},
    gopay(item){ //  唤起支付直接付款
      console.log(item)
      let url= `pages/order/cashier?orderId=${item}&appId=10001`

      this.gotoPage(url);
    },
    touchStart(event) {
				// 记录触摸起始点的横坐标
				this.startX = event.touches[0].clientX;
				},
				touchMove(event) {
				// 计算滑动距离
				const currentX = event.touches[0].clientX;
				this.deltaX = currentX - this.startX;
				},
				touchEnd() {
			// 判断滑动方向
				if (this.deltaX > 250) {
					// 向右滑动逻辑   这里只建议写一些性能消耗小的逻辑，比如：this.status = !this.status 因为当他的横坐标大于或小于50时，每隔一个数字都会执行一次，所以...非常消化性能
					console.log('向右滑动逻辑',this.deltaX,this.startX)
          uni.setStorageSync('type', '');
					this.gotoPage('/pages/user/index/index');
				} else if (this.deltaX < -50) {
					// 向左滑动逻辑   这里只建议写一些性能消耗小的逻辑，比如：this.status = !this.status 因为当他的横坐标大于或小于50时，每隔一个数字都会执行一次，所以...非常消化性能
					console.log('向左滑动逻辑',this.deltaX)
				}
				this.startX = 0;
				this.deltaX = 0;
				// 清除触摸起始点记录，这里也可以写一些比较复杂的逻辑，每滑动一次松后执行。
			},
    startCountdown(order) {
      const orderId = order.orderId; // 使用订单ID作为唯一标识符
      this.orderId = orderId;
      if (this.timers[orderId]) {
        clearInterval(this.timers[orderId]);
      }
      const payEndTime = new Date(order.payEndTime);
     // console.log(payEndTime + "结束时间")
      const now = new Date();
     // console.log(now + "现在时间")
      const diff = payEndTime.getTime() - now.getTime();

      if (diff >= 0) {
           let hourDiff = Math.floor(diff / (1000 * 60 * 60)) % 60;
           let minutesDiff = Math.floor(diff / (1000 * 60)) % 60;
           let secondsDiff = Math.floor((diff / 1000) % 60);
            if(minutesDiff<10){
              minutesDiff = '0'+minutesDiff
            }
            if(secondsDiff<10){
              secondsDiff = '0'+secondsDiff
            }
            if(hourDiff<10){
              hourDiff = '0'+hourDiff
            }
            this.remainders[orderId] = `${hourDiff}:${minutesDiff}:${secondsDiff}s`;
            // console.log(this.remainders[orderId],'opo')
            // this.$store.commit('calTime', this.remainders[orderId])
            this.caTime = this.remainders[orderId];
        this.timers[orderId] = setInterval(() => {
          const now = new Date();
          const diff = payEndTime.getTime() - now.getTime();

          if (diff <= 0) {
            this.remainders[orderId] = '00:00:00';
             this.cancelOrder(orderId);
         //   this.getData()// 等于0了就刷新一下数据
            clearInterval(this.timers[orderId]);
            delete this.timers[orderId];
          } else {
            let hourDiff = Math.floor(diff / (1000 * 60 * 60)) % 60;
            let minutesDiff = Math.floor(diff / (1000 * 60)) % 60;
            if(minutesDiff<10){
              minutesDiff = '0'+minutesDiff
            }
            let secondsDiff = Math.floor((diff / 1000) % 60);
            if(secondsDiff<10){
              secondsDiff = '0'+secondsDiff
            }
            if(hourDiff<10){
              hourDiff = '0'+hourDiff
            }
            // const secondsDiff = Math.floor((diff / 1000) % 60);
            this.remainders[orderId] = `${hourDiff}:${minutesDiff}:${secondsDiff}s`;
            // console.log(this.remainders[orderId],'opo')
            // this.$store.commit('calTime', this.remainders[orderId])
            this.caTime = this.remainders[orderId];
          }
        }, 1000);
      } else {
        this.remainders[orderId] = '00:00';
        this.cancelOrder(orderId);
        this.caTime = this.remainders[orderId];

      }
    },
    jump(){
      this.gotoPage('/pageWebview/service/service');
    },

     getorderdata(id){
            uni.showLoading({
              title: '网络正在加载中，请稍后，30秒后页面无反应，请您退出页面重新进入',
            });
            let self = this;
            self._get('user/order/detail',{orderId:id},function(res){
              console.log(res)
              if(res.code==1){
                 self.orderData = res.data;
                 if(res.data.orderStatusText=='待付款'){
                  self.startCountdown(res.data)
                 }
                 uni.hideLoading();
              }
            })
     },
    init(){
    },
    
    openDel() {
      this.confirmBoxDel = true
    },
    closeDel() {

      this.confirmBoxDel = false

    },
    closeDel_sure(){ // 删除订单

      let self = this;
      self._get('/order/order/del',{orderId:self.order_id},function(res){
        console.log(res)
         if(res.code==1){
          self.confirmBoxDel = false
          self.jumpPage('/pages/order/myorder?appId=10001')
        }
      })

    },

    openOrder() { // 进行中的都可以取消
      this.confirmBoxOrder = true
    },
    closeOrder() {
      this.cancelOrder(this.order_id)
    },
     // 取消订单
     cancelOrder(order_Id) {
      let self = this;
      self._post('user/order/cancel', { orderId: order_Id }, function (res) {
        if (res.code === 1) {
          self.confirmBoxOrder = false
          self.getorderdata(self.order_id)
         self.showSuccess('已取消');
        } else {
          self.showError(res.msg);
        }
      });
    },
    jumpPage(path) { /*跳转页面*/
			this.gotoPage(path);
		},
    updateCountdown() {
      const currentTime = new Date().getTime();
      const timeLeft = this.totalDuration - (currentTime - this.startTime);
      if (timeLeft >= 0) {
        // 计算时间
        const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        // 输出时间或者更新页面上的显示
        console.log(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        this.time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        // 如果时间未到，继续调用函数
        if (timeLeft > 0) {
          setTimeout(this.updateCountdown, 1000);
        }
      }
    },
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
    }

	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.my-order {
  background: #F7F7F7;
  min-height: 100vh;
}
.kefuImg{
  width: 40rpx;
height: 40rpx;
margin-right: 18rpx;

}
.border-top{
  padding-top: 40rpx;
  border-top: 1rpx solid #F0F0F0;
}

.order-detail-logistics {
  @include fl-between;
  .icon-dizhi {
    font-size: 48rpx;
    color:#333;
  }
  .detail-logistics-name {
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #040404;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  .detail-logistics-dizhi {
    padding-top: 8rpx;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #252525;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  .detail-state {
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #666666;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  .detail-logistics-img {
    @include area(48rpx,48rpx);
  }
  .detail-logistics-main {
    flex:1;
    padding-left: 20rpx;
  }
}
.order-item {
  background: #FFFFFF;
  border-radius: 28rpx;
  margin: 16rpx 28rpx 40rpx 28rpx;
  padding: 40rpx 32rpx ;
  .order-good {
    display: flex;
    justify-content: space-between;
    padding-bottom: 4rpx;
    .order-good-img {
      @include area(176rpx,176rpx);

    }
    .order-good-text {
      flex: 1;
      padding-left: 20rpx
    }
    .order-good-line1 {
      @include fl-between;
      max-width: 434rpx;
      padding-bottom: 24rpx;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 28rpx;
      color: #040404;
      font-style: normal;
      text-transform: none;
      .order-good-line1-l {
        flex: 1;
        @include ellipsis;
      }
      .order-good-line1-r {
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 28rpx;
        color: #000000;
        text-align: right;
        font-style: normal;
        text-transform: none;
      }

    }
    .order-good-line2{
      @include fl-between;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 24rpx;
      color: #999999;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    .order-good-line3 {
      text-align: right;
      color:#c53a3a;
    }
  }
  .order-total {
    padding: 40rpx 0;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #040404;
    text-align: right;
    font-style: normal;
    text-transform: none;
  }
  .order-btn-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 30rpx;
  }
  .kefu-box {
    border-top: 1rpx solid #F0F0F0;
    text-align: center;
    padding-top: 20rpx;
    margin-bottom: -10rpx;
    line-height: 40rpx;
    display: flex;
    align-items: center;
    justify-content:center;
    .iconfont {
      margin-right: 10rpx;
    }
  }
}

.order-detail {
  .order-detail-top {
    padding:  12rpx 24rpx 12rpx 24rpx;
    .order-detail-top-state{
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 40rpx;
      color: #040404;
      text-align: left;
      font-style: normal;
      text-transform: none;
      padding-bottom: 0rpx;
      padding-top: 10rpx;
    }
    .order-detail-top-text {
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 28rpx;
      color: #040404;
      text-align: left;
      font-style: normal;
      text-transform: none;
      .ft-red {
        color:#c53a3a;
      }
    }
  }
  .order-attr {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    line-height: 40rpx;
    padding-bottom: 40rpx;

    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #252525;
    text-align: left;
    font-style: normal;
    text-transform: none;
    .order-attr-key {
      width: 200rpx;
    }
    .order-attr-val {
      flex: 1;
      text-align: right;

      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: 400;
      font-size: 28rpx;
      color: #000000;
      font-style: normal;
      text-transform: none;
      &.order-attr-val-liuyan {
        text-align: left;

        font-family: Source Han Sans CN, Source Han Sans CN;
        font-weight: 400;
        font-size: 28rpx;
        color: #252525;
        text-align: left;
        font-style: normal;
        text-transform: none;

      }
      &.attr-bold {
        font-weight: bold;
        font-family: Roboto, Roboto;
        font-size: 36rpx;
        color: #000000;
        font-style: normal;
        text-transform: none;
      }
    }
  }
  .order-attr2 {
    display: flex;
    align-items: flex-start;
    
    line-height: 40rpx;
    padding-bottom: 20rpx;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #252525;
    font-style: normal;
    text-transform: none;

    .order-attr-val2 {
      display: flex;
      padding-left: 20rpx;
      font-family: Roboto, Roboto;
      font-weight: 300;
      color: #000000;
      .btn-min {
        line-height: normal;
      }
    }
  }
}

.confirm-box {
  // @include area(500rpx,500rpx);
  background-color: #fff;
  width: 560rpx;
  padding: 44rpx 32rpx;
  box-sizing: border-box;
  text-align: center;
  border-radius: 24rpx;
  .confirm-box-title {
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 32rpx;
    color: #000000;
    font-style: normal;
    text-transform: none;
    padding-bottom: 20rpx;
  }
  .confirm-box-title18 {
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 35rpx;
    color: #000000;
    font-style: normal;
    text-transform: none;
    padding-bottom: 32rpx;
  }
  .confirm-box-describe {
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #808080;
    font-style: normal;
    text-transform: none;
    padding-bottom: 20rpx;
  }
  .confirm-box-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.detail-foot {
  height: 120rpx;
  .detail-foot-fixed {
    position: fixed;
    bottom: 0;
    width: 750rpx;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20rpx;
    box-sizing: border-box;
    background-color: #fff;
  }

}
</style>
