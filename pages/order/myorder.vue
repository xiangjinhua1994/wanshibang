<template>
  <view class="my-order">
    <view class="title_order" style="position: fixed;top: 0;left: 0;z-index: 999">
      <view class="head_top" :style="'height:' + topBarTop() + 'px;'" style="background-color: #fff;"></view>
       <headTitle title="我的订单"></headTitle> 
      <view class="category-nav-box" txt="分类">
        <view class="category-nav" :class="navActive === 0 ? 'nav-active' : ''" @click="navClass(0)">
          全部
        </view>
        <view class="category-nav" :class="navActive === 1 ? 'nav-active' : ''" @click="navClass(1)">
          待付款
        </view>
        <view class="category-nav" :class="navActive === 2 ? 'nav-active' : ''" @click="navClass(2)">
          待发货
        </view>
        <view class="category-nav" :class="navActive === 3 ? 'nav-active' : ''" @click="navClass(3)">
          待收货
        </view>
        <view class="category-nav" :class="navActive === 4 ? 'nav-active' : ''" @click="navClass(4)">
          待评价
        </view>
      </view>
    </view>
    <scroll-view scroll-y="true" class="scroll-Y" @scrolltolower="scrolltolower"  style="padding-top:210rpx">
      <view class="order-list" v-if="list.length>0">
          <view v-for="(item, index) in list" :key="index">
            <view class="order-item" >
              <view class="order-title" >
                <view class="order-no" >
                  订单编号 {{ item.orderNo }}
                </view>
                <view class="order-state-ui" :style="{color:item.orderStatusText=='待付款'?'#BE1E1E':''}">
                  {{ item.orderStatusText }}
                </view>
              </view>
              <!-- 单规格产品 -->
              <view   @click="jumpPage( `pages/order/order-detail?orderId=${item.orderId}&appId=10001`)">
              <view v-if="item.product.length == 1">
                <view class="order-good">
                  <image class="order-good-img" :src="item.product[0].productImage" mode="" />
                  <view class="order-good-text">
                    <view class="order-good-line1">
                      <view class="order-good-line1-l">{{ item.product[0].productName }}</view>
                      <view class="order-good-line1-r">￥{{ item.product[0].productPrice }} </view>
                    </view>
                    <view class="order-good-line2">
                      <view class="order-good-line2-l"></view>
                      <view class="order-good-line2-r">×{{ item.product[0].effectiveProductNumber }}</view>
                    </view>
                  </view>
                </view>
              </view>
              <!-- 多规格 -->
              <view v-else>
                <view class="order-good" v-for="(chirden, index) in item.product" :key="index">
                  <image class="order-good-img" :src="chirden.productImage" mode="" />
                  <view class="order-good-text" >
                    <view class="order-good-line1">
                      <view class="order-good-line1-l">{{ chirden.productName }}</view>
                      <view class="order-good-line1-r">￥{{ chirden.productPrice }}</view>
                    </view>
                    <view class="order-good-line2">
                      <view class="order-good-line2-l">
                        {{ chirden.productAttr }}

                      </view>
                      <view class="order-good-line2-r">×{{ chirden.effectiveProductNumber }}</view>
                    </view>
                  </view>
                </view>
              </view>
            </view> 
              <view class="order-total">
                共{{ item.totalNum }}件实付款:
                ￥{{ item.payPrice }}
              </view>
              <view class="order-btn-box">

              <!-- 已付款未发货可以退款 // tradeNo  付款才有 --> 
              <!-- <view   class="order-btn "   v-if="item.deliveryStatus == 10 &&item.orderStatus !== 20&&item.tradeNo !==''  " @click="cancelOrder_id(item,'订单')" >  取消订单 </view> -->

                <!-- 下单没支付可以取消支付 -->
                <view class="order-btn " v-if="item.orderStatus == 10&& item.payStatus ==10 " @click="cancelOrder_id(item)">
                 取消
                </view>
                 <!-- 收货没评价的可以评价 -->
                <view class="order-btn " v-if="item.receiptStatus == 20&&item.isComment==0"  @click="evaluate(item.orderId)">去评价</view>
                    <!-- 付完款的没收货可以退款 -->
                <!-- <view class="order-btn "    v-if="item.deliveryStatus == 20&& item.orderStatus !==30&& item.payStatus ==20"   @click="refund_mony(item.product,item.product[0].refund)"> -->
                <!-- <view class="order-btn "    v-if="item.showRefund==0">

                      
                  <span @click="jumpPage( `pages/order/order-detail?orderId=${item.orderId}&appId=10001`)"> 退款</span>

                 </view> -->
              <!-- 已发货查看物流 -->
                <view class="order-btn " v-if="item.deliveryStatus == 20&& item.orderStatus !==30&& item.payStatus ==20"   @click="Check_logistics(item)">
                 查物流
                </view>

                <!-- 已完成的可以删除订单 -->
                <view class="order-btn " v-if="item.orderStatus == 30"   @click="delecorder(item.orderId)">
                删除订单
                  </view>

                <view class="order-btn order-btn-black" v-if="item.deliveryStatus == 20&& item.orderStatus !==30&& item.payStatus ==20"   @click="confirmOrder(item.orderId)">
                  确认收货
                </view>
                <view class="order-btn order-btn-black" v-if="item.orderStatus == 20"  @click="rebuy(item)">
                  重新购买
                </view>
                <view class="order-btn order-btn-black" v-if="item.orderStatus == 10&& item.payStatus ==10"  @click="gopay(item.orderId)">
                  <!-- 去付款{{ remainders[item.orderId] }}  -->
                  {{ remainders[item.orderId]?"去付款"+remainders[item.orderId]:'去付款'+"00:00s" }}
                </view>
              </view>
            </view>
          </view>
      

      </view>
      <view v-else>
        <dataNull></dataNull>
      </view>
    </scroll-view>
    <!-- <tabBar></tabBar> -->
    <uiPopup v-if="confirmBoxOrder">
      <view class="confirm-box">
        <view class="confirm-box-title"> 确定删除订单 </view>
        <view class="confirm-box-describe"> 删除后订单列表不再展示该订单，操作后不可恢复。 </view>
        <view class="confirm-box-btn" slot="btnBox">
          <view class="ui-btn btn-more btn-width" @click="closeOrder">我再想想</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="dectcloseOrder">删除</view>
        </view>
      </view>
    </uiPopup>
    <uiPopup v-if="confirmBoxDel">
      <view class="confirm-box">
        <view class="confirm-box-title18">确定取消</view>
        <view class="confirm-box-btn">
          <view class="ui-btn btn-more btn-width" @click="noclose">否</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="closeDel">是</view>
        </view>
      </view>
    </uiPopup>

    <uiPopup v-if="sureBoxDel">
      <view class="confirm-box">
        <view class="confirm-box-title18"> 确认收到商品 </view>
        <view class="confirm-box-btn">
          <view class="ui-btn btn-more btn-width" style="margin-right: 40rpx;" @click="surenoclose">否</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="sureyesclose">是</view>
        </view>
      </view>
    </uiPopup>
  </view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue';
import dataNull from '@/pages/component/dataNull.vue';
import UiPopup from '@/pages/component/ui-popup.vue';
export default {
  components: {
    headTitle,
    dataNull,
    UiPopup
  },
  data() {
    return {
      navActive: 0,
      confirmBoxDel: false,
      confirmBoxOrder: false,
      /*手机高度*/
      phoneHeight: 0,
      /*可滚动视图区域高度*/
      scrollviewHigh: 0,
      /*状态选中*/
      state_active: 0,
      /*顶部刷新*/
      topRefresh: false,
      /*数据*/
      list: [],
      /*是否显示支付类别弹窗*/
      isPayPopup: false,
      /*支付方式*/
      pay_type: 20,
      /*订单id*/
      order_id: 0,
      /*最后一页码数*/
      last_page: 0,
      /*当前页面*/
      pageIndex: 1,
      /*每页条数*/
      pageSize: 10,
      /*是否正在加载*/
      loading: true,
      dataType: "all",
      orders: [], // 假设这是你的订单列表数据
      timers: {}, // 用于存储每个订单的定时器
      remainders: {}, // 用于存储每个订单的剩余时间 isSpecialOrder
      delect_order: "",
      order_title:"订单", 
      sureBoxDel:false,
      confirm_receipt:"", // 确认 收货Id
      delectorderid:0, // 删除订单
      orderId:null,
    };
  },
  computed: {



  },

  
	onLoad(e) {
		if (typeof e.dataType != 'undefined') {
			this.dataType = e.dataType;
		}
		if (this.dataType == 'payment') {
			this.navActive = 1;
		} else if (this.dataType == 'received') {
			this.navActive = 3;
		} else if (this.dataType == 'comment') {
			this.navActive = 4;
		} else if (this.dataType == 'delivery') {
			this.navActive = 2;
		}
	},
  mounted() {
    this.init();
    this.getData();
    //this.timeRanges();
    // #ifdef H5
    // window.location.href = 'nanheshop://pages/order/order-detail?orderId='+35175;
    // #endif
  },




  onShow() {

  },
beforeCreate(){

},
// 销毁组件前清除定时器
beforeDestroy() {
    if (this.timers[this.orderId]) {
        clearInterval(this.timers[this.orderId]);
    }

},

  methods: {

    delecorder(delectorderid){

         this.confirmBoxOrder = true
        this.delectorderid=delectorderid

    },

    dectcloseOrder(){ // 确定删除
       let self = this;

      self._get('/order/order/del',{orderId:self.delectorderid},function(res){
        console.log(res)
        if(res.code==1){
          self.confirmBoxOrder = false
          self.getData();
         
           // self.orderData = res.data;
        }
      })
      




    },
    evaluate(orderId){// 评价
      let url = `/pages/order/evaluate/evaluate?order_id=${orderId}`

      this.gotoPage(url);
    },
    refund_mony(product,padding){// 退款时候跳转到退款详情页面

     if(padding){
      uni.showToast({
						title: "退款中请耐心等待",
						duration: 2000
					});

     }else{
      let orderProductId = product[0].orderProductId
     //   console.log()
        let url = `pages/order/refund/apply/apply?orderProductld=${orderProductId}`
        this.gotoPage(url);
     }
   
    },

    gopay(item){ //  唤起支付直接付款
      console.log(item)
      let url= `pages/order/cashier?orderId=${item}&appId=10001`

      this.gotoPage(url);
    },

    Check_logistics(item){ // 查物流pages/news/logisticsDetail
      // let url = `/pages/news/logisticsDetail?orderId=${item}`
      let url = `/pages/news/logisticsNoticeMap?orderId=${item.orderId}&deliveryType=${item.deliveryType}`
      this.gotoPage(url);
    },
 
    rebuy(item){ // 重新购买就是加入购物车， 因为加购物车只能是单个单个的加， 遍历一遍才能加全部
  //    console.log(    JSON.parse(JSON.stringify(item))   )
     let newObj= JSON.parse(JSON.stringify(item))
     console.log(newObj.product)

    if(newObj.product.length>1){ // 多个的话就加进去购物车
      newObj.product.forEach(item => {
      this.addCart(item.productId,item.totalNum,item.specSkuId)
     });
    }else{ // 单个的话就直接进详情
       let url = '/pages/product/detail/detail?productId=' +newObj.product[0].productId;
			 this.gotoPage(url);
    }
    },
    addCart(productId,totalNum,specSkuId){
      let self = this;
         self._post(
				'order/cart/add',
				{
					productId: productId,
					totalNum: totalNum,
					specSkuId: specSkuId
				},
				function(res) {
          self.getCartNum();
					uni.showToast({
						title: res.msg,
						duration: 2000
					});
				}
			);

    },
    getCartNum() {
			let self = this;
			self._post('order/cart/lists', {}, function (res) {
				let auto =
					uni.getStorageSync('TabBar').isAuto &&
					uni.getStorageSync('TabBar').isAuto != 0;
				self.isAuto = auto;
				uni.hideLoading();
				if (res.data.length > 0) {
					self.loadding = false;
					uni.setTabBarBadge({
						index: 3,
            color:'#BE1E1E',
						 text: `${res.data.length}`
				})

				} else if (res.data.length == 0) {
					uni.removeTabBarBadge({ index: 3 });//移除条数

				}
				self.loadding = false;
			});
		},

    scrolltolower() {// 滚动加载
      console.log("加载")
     this.getData(true); // 调用getList并告知是加载更多
    },

    getData(isLoadMore = false) {
      let self = this;
      self.loading = true;
      let dataType = self.dataType;
      let nextPageIndex = isLoadMore ? this.pageIndex + 1 : 1;
      uni.showLoading({
        title: '网络正在加载中，请稍后，30秒后页面无反应，请您退出页面重新进入',
      });

      self._postBody(
        'user/order/lists',
        { type: dataType, pageIndex: nextPageIndex, pageSize:3 },
        function (res) {
          if (res.code === 1) {
            if (isLoadMore) {
              // 如果是加载更多，则追加新数据
              self.list = self.list.concat(res.data.records);
            } else {
              // 否则，替换现有数据
              self.list = res.data.records;
            }
            self.pageIndex = nextPageIndex; // 更新当前页码

            // 遍历更新后的订单列表，处理待支付订单的倒计时
            self.list.forEach(item => {
              if (item.orderStatus === 10&&item.payStatus==10) { // 待支付订单orderStatus
                   self.startCountdown(item);
              }
             // self.startCountdown(item);

            });

            self.loading = false; // 数据加载完成后，关闭 loading 状态
            uni.hideLoading();
          } else {
            console.error('数据加载失败:', res.message);
            self.loading = false;
          }
        }
      );
    },

   
     // 取消订单
    cancelOrder(order_Id) {
      let self = this;
      self._post('/user/order/cancel', { orderId: order_Id }, function (res) {
        if (res.code === 1) {
          self.getData();
         self.showSuccess('已取消');
        } else {
          self.showError(res.message);
        }
      });
    },
    noclose(){
      this.confirmBoxDel=false

    },
    cancelOrder_id(item,title){
         this.order_title=title
         this.confirmBoxDel=true
         this.delect_order=item.orderId

    },
    surenoclose(){
       this.sureBoxDel=false

    },
    sureyesclose(){
     //
     let self = this;
      self._post('/user/order/receipt', { orderId:self.confirm_receipt}, function (res) {

        console.log(res)
        if (res.code === 1) {
          self.getData();
         self.showSuccess('已确认收货');
         self.sureBoxDel=false
        } else {
          self.showError(res.message);
        }
      });
    },

    confirmOrder(orderid){

      this.sureBoxDel=true
     this.confirm_receipt=orderid


    },
    // 倒计时方法
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
        // const minutesDiff = Math.floor(diff / (1000 * 60)) % 60;
        //     const secondsDiff = Math.floor((diff / 1000) % 60);
            let hourDiff = Math.floor(diff / (1000 * 60 * 60)) % 60;
            let minutesDiff = Math.floor(diff / (1000 * 60)) % 60;
           let secondsDiff = Math.floor((diff / 1000) % 60);
            if(minutesDiff<10){
              minutesDiff = '0'+minutesDiff
            }
            if(hourDiff<10){
              hourDiff = '0'+hourDiff
            }
            if(secondsDiff<10){
              secondsDiff = '0'+secondsDiff
            }
            this.remainders[orderId] = `${hourDiff}:${minutesDiff}:${secondsDiff}s`;
            // console.log(this.remainders[orderId])
            this.$store.commit('calTime', this.remainders[orderId])
        this.timers[orderId] = setInterval(() => {
          const now = new Date();
          const diff = payEndTime.getTime() - now.getTime();

          if (diff <= 0) {
            this.remainders[orderId] = '00:00:00';
            console.log('89898')
             //this.cancelOrder(orderId);
           this.getData()// 等于0了就刷新一下数据
            clearInterval(this.timers[orderId]);
            delete this.timers[orderId];
          } else {
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
            // const minutesDiff = Math.floor(diff / (1000 * 60)) % 60;
            // const secondsDiff = Math.floor((diff / 1000) % 60);
            this.remainders[orderId] = `${hourDiff}:${minutesDiff}:${secondsDiff}s`;
            // console.log(this.remainders[orderId])
            this.$store.commit('calTime', this.remainders[orderId])
          }
        }, 1000);
      } else {
        this.remainders[orderId] = '00:00';
        this.cancelOrder(orderId);
        console.log('8888')


      }
    },

    init() {


    },
    openDel() {
      this.confirmBoxDel = true
    },
    closeDel() {
      this.confirmBoxDel = false
       

    this.cancelOrder(this.delect_order)

    },
    openOrder() {
      this.confirmBoxOrder = true
    },
    closeOrder() {
      this.confirmBoxOrder = false
    },
    navClass(e) {
      let self = this;
      self.navActive = e
      // if (self.state_active != e) {
      // 	self.page = 1;
      // 	self.loading = true;
      // 	self.state_active = e;
      console.log(e)
      switch (e) {
        case 0:
          self.listData = [];

          self.dataType = 'all';
          break;
        case 1:
          self.listData = [];
          self.dataType = 'payment';
          break;
        case 2:
          self.listData = [];
          self.dataType = 'delivery';
          break;
        case 3:
          self.listData = [];
          self.dataType = 'received';
          break;
        case 4:
          self.listData = [];
          self.dataType = 'comment';
          break;
      }

      console.log(self.dataType)
      self.getData();


    },
    jumpPage(path) { /*跳转页面*/
      this.gotoPage(path);
    },
  },
};
</script>

<style lang="scss" scoped>

.scroll-Y{
  height:calc(90vh - 10rpx);
   // border: 1px solid;
}


.title_order {
  top: 0;
  left: 0;
  width: 100%;

  background: #fff;
  // padding-bottom: 120rpx;
}



@import '@/common/mixin.scss';

.my-order {
  background: #F7F7F7;
  min-height: 100vh;
}

.order-item {
  background: #FFFFFF;
  border-radius: 28rpx;
  margin: 16rpx 28rpx 40rpx 28rpx;
  padding: 40rpx 32rpx;

  .order-title {
    @include fl-between;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #000000;
    font-style: normal;
    text-transform: none;
    padding-bottom: 40rpx;

    .order-state-ui {
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 28rpx;

      text-align: left;
      font-style: normal;
      text-transform: none;

      &.order-state-red {
        color: #BE1E1E;
      }
    }

  }

  .order-good {
    display: flex;
    justify-content: space-between;
    padding-bottom: 32rpx;

    .order-good-img {
      @include area(176rpx, 176rpx);

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

    .order-good-line2 {
      @include fl-between;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 24rpx;
      color: #999999;
      text-align: left;
      font-style: normal;
      text-transform: none;
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

  }
}

.order-list-null {
  padding-top: 460rpx;

  image {
    @include area(484rpx, 300rpx);
    display: block;
    margin: 0 auto;
  }

  .order-list-null-text {
    text-align: center;
  }
}

.category-nav-box {
  width: 750rpx;
  background-color: #F7F8FA;
  // white-space: nowrap;
  padding-top: 12rpx;
  padding-bottom: 20rpx;
  @include fl-between();

  .category-nav {
    flex: 1;
    text-align: center;
    // padding: 14rpx 30rpx 0rpx 30rpx;
    // display: inline-block;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #252525;

    &.nav-active {
      // background-color: #fff;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 28rpx;
      border-radius: 16rpx 16rpx 0 0;
      padding-bottom: 12rpx;

      &:after {
        content: '';
        display: block;
        width: 30px;
        border-bottom: 4rpx solid #252525;
        margin: 0 auto;
        margin-top: 12rpx;
        margin-bottom: -24rpx;
      }
    }
  }
}

.order-btn {
  padding: 24rpx 36rpx;
  border-radius: 90rpx;
  border: 1.5rpx solid #000000;
  margin-left: 20rpx;
  font-family: Hiragino Sans GB, Hiragino Sans GB;
  font-weight: normal;
  font-size: 24rpx;
  color: #252525;
  text-align: center;
  font-style: normal;
  text-transform: none;

  &.order-btn-red {
    background: #BE1E1E;
    border: 1rpx solid #BE1E1E;
    color: #fff;

  }

  &.order-btn-black {
    background: #000;
    color: #fff;
    border: 1.5rpx solid #000;
  }
}
</style>
