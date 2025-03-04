<template>
	<view class="user">
    <view style="position: fixed;top:0;left:0;width:100%;z-index:9999;background:#fff">
      <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
      <!-- <view style="text-align: center;">
        我的
      </view> -->
  </view>
    <view class="head" style="margin-top: 50rpx;">
      <!-- <text class="iconfont icon-shezhi2" @click="jumpPage('/pages/user/set/set')"></text> -->
      <!-- <image style="top: 42rpx;" src="/static/home/user/kefu.png" mode="" @click="jumpPage('/pageWebview/service/service')"/> -->
      <image style="top: 42rpx;" src="/static/home/user/kefu.png" mode="" @click="kefuDialogEvent"/>
      <image style="margin-left: 36rpx;"  src="/static/home/user/set.png" mode="" @click="jumpPage('/pages/user/set/set')"/>
    </view>
    <view class="user-info-box" txt="用户基本信息">
      <view class="user-info">
        <image class="user-img" :src="uerinfo.avatarUrl" mode="" v-if="uerinfo.avatarUrl"/>
        <image class="user-img" src="/static/home/logo1.png" mode="" v-else/>
        <view class="head-text">
          <view class="head-text-name" >
            <text v-if="uerinfo.nickName" class="Pnowrap" style="width: 500rpx;">{{ uerinfo.nickName.length>6? uerinfo.nickName.substr(0, 6)+'...':uerinfo.nickName}}</text>
             <view v-else @click="loginindex" style="margin-top:30rpx;">登陆/注册</view>
             <text class="user-level" v-if="uerinfo.nickName">
              <image v-if="uerinfo.level==1" class="user-level-img" src="/static/home/user/member1.png" mode="" />
              <image v-if="uerinfo.level==2" class="user-level-img" src="/static/home/user/member2.png" mode="" />
              <image v-if="uerinfo.level==3" class="user-level-img" src="/static/home/user/member3.png" mode="" />
              <image v-if="uerinfo.level==4" class="user-level-img" src="/static/home/user/member4.png" mode="" />
              <image v-if="uerinfo.level==5" class="user-level-img" src="/static/home/user/member5.png" mode="" />
            </text>
            <view class="checkout" v-if="uerinfo.nickName" @click="jumpPage('/pages/user/set/checkoutAccount')">切换账号
              <image class="xiala-img" src="/static/home/user/xiala.png" mode="" />
            </view>

          </view>
          <!-- <view class="user-level">
            <image class="user-level-img" src="/static/home/user/member1.png" mode="" />
          </view> -->
        </view>
      </view>

      <view class="user-hobby">
        <view class="user-hobby-item"  @click="jumpPage('/pages/user/favorite/favorite')">
          <image src="/static/home/user/collect.png" mode="" />
          <view class="user-hobby-name">我的收藏</view>
        </view>
        <view class="user-hobby-item" @click="jumpPage('/pages/user/footprint/footprint')">
          <image src="/static/home/user/footprint.png" mode="" />
          <view class="user-hobby-name">足迹</view>
        </view>
        <view class="user-hobby-item" @click="jumpPage('/pages/user/invite-friend/invite-friend')">
          <image src="/static/home/user/qr.png" mode="" />
          <view class="user-hobby-name">邀请好友</view>
        </view>
      </view>
    </view>
    <view class="user-order" txt="我的订单">
      <view class="set-attr">
        <text class="set-attr-key" >我的订单</text>
        <view class="set-attr-val" @click="jumpPage('/pages/order/myorder?appId=10001')" >
          <text class="set-attr-val-text" style="color: #868686;font-size:24rpx;position:relative;left:10rpx">全部订单</text>
          <text class="iconfont icon-you" style="position:relative;top:0rpx;font-size:24rpx;color: #868686;"></text>
        </view>
      </view>
      <view class="user-order-box">
        <view class="user-order-item" @click="jumpPage('/pages/order/myorder?dataType=payment')">
          <view class="user-order-item-num"  v-if="orderCount.payment>0">{{orderCount.payment}}</view>
          <image style="margin-left: 5rpx;" src="/static/home/user/pending-payment.png" mode="" />
          <view class="user-order-name">待付款</view>
        </view>
        <view class="user-order-item" @click="jumpPage('/pages/order/myorder?dataType=delivery')">
          <view class="user-order-item-num" v-if="orderCount.delivery>0">{{orderCount.delivery}}</view>
          <image style="margin-left: 5rpx;" src="/static/home/user/be-shipped.png" mode="" />
          <view class="user-order-name">待发货</view>
        </view>
        <view class="user-order-item" @click="jumpPage('/pages/order/myorder?dataType=received')">
          <view class="user-order-item-num" v-if="orderCount.received>0">{{orderCount.received}}</view>
          <image style="margin-left: 5rpx;" src="/static/home/user/be-received.png" mode="" />
          <view class="user-order-name" @click="jumpPage('/pages/order/myorder?dataType=received')">待收货</view>
        </view>
        <view class="user-order-item"  @click="jumpPage('/pages/order/refund/index/index')">
          <view class="user-order-item-num" v-if="orderCount.refund>0">{{orderCount.refund}}</view>
          <image style="margin-left: 5rpx;" src="/static/home/user/shouhou.png" mode="" />
          <view class="user-order-name" style="margin-left: 15rpx;">售后</view>
        </view>
        <view class="user-order-item" @click="jumpPage('/pages/order/myorder?dataType=comment')">
          <view class="user-order-item-num" v-if="orderCount.comment>0">{{orderCount.comment}}</view>
          <image src="/static/home/user/comment.png" mode="" />
          <view class="user-order-name" style="margin-left: 5rpx;">评价</view>
        </view>
      </view>
    </view>
    <view class="new-recom" v-if="recommendSwitch==0">
      <view class="new-recom-title">
        ——— 
        <text>新品推荐</text>  
        ———
      </view>
      <view class="goods-box">
        <template v-for="(item, key) in listData" :key="key">
          <goodsBlock  :parentitem="item" @custom-event="receiveFromChild">  </goodsBlock>
        </template> 
      </view>
    </view>
    
		<!-- <tabBar></tabBar> -->
    <keep-alive>
			<tabBar></tabBar>
		</keep-alive>
    <spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec>
    <!-- <spec2 :isPopup="isPopup2" @close="closePopup2"></spec2> -->
    <uiPopup v-if="confirmBoxOrder" class="uoiuoi">
      <view class="confirm-box">
        <view class="confirm-box-title"> 是否允许南合商城访问您设备上的照片、媒体内容和文件?</view>
        <view class="confirm-box-describe"> </view>
        <view class="confirm-box-btn" slot="btnBox">
        <view class="ui-btn btn-more btn-width" @click="closeOrder" style="margin-right: 20rpx;">取消</view>
        <view class="ui-btn btn-more btn-width btn-black" @click="dectcloseOrder">确定</view>
        </view>
      </view>
    </uiPopup>
    
	</view>
</template>

<script>
import TopNavBar from '@/components/topNavBar/topNavBar.vue';
import goodsBlock from '@/pages/component/goodsBlock.vue';
import headTitle from '@/pages/component/headTitle.vue';
import uiPopup from '../../../pages/component/ui-popup.vue';


import { mapState } from 'vuex';
import spec from '../../product/detail/popup/spec.vue';
export default {
	components: {
    TopNavBar,
    goodsBlock,
    spec,
    headTitle,
    uiPopup
	},
	data() {
		return {
      listData:[],
			//list: [1,2,3,4,5,6],
      confirmBoxOrder:false,
      uerinfo:{},// 存用户信息
      recommendSwitch:0,
      /*是否确定购买弹窗*/
      isPopup: false,
      isPopup2: false,
      /*购物车商品数量*/
      cart_total_num: 0,
      /*子级页面传参*/
      productModel: {},
      // 商品属性
      specData: null,
      /*已经选择的规格*/
      alreadyChioce: '',
      /*商品详情*/
      detail: {
        productSku: {},
        showSku: {
          productPrice: '',
          productSkuId: 0,
          linePrice: '',
          stockNum: 0,
          skuImage: '',

        },
      },

      orderCount:{},// 我的订单
       

		};
	},
	computed: {
		...mapState(['globalEvaluateSwitch']),
	},
	onShow() {
		//uni.hideTabBar();
		/*获取个人中心数据*/
	//	this.getData();
    this.getuserinfo();

    this.getnewProduct();
		//this.getPage();
		//this.getTabBarLinks();
    this.getgodsData();
	
	this.getTabBarLinks();
  // #ifdef APP-PLUS
  // plus.runtime.arguments = null;
  // #endif
  this.$store.dispatch('GlobalInitQuery', { _vue: this });

},
	onLoad(e) {
		
	},
	methods: {
    handletouchmove(event) {
    // 左右切换为 X 即可
	let currentY = event.changedTouches[0].pageY;
	let ty = currentY - this.lastY;
	if (ty < -20) {
    console.log('向上滑动')
		// 向上滑动
	} else if (ty > 20) {
		//向下滑动
    console.log('v向下滑动')

	}
	//将当前坐标进行保存以进行下一次计算
	this.lastY = currentY;
},
 
handletouchstart(event) {
	//滑动开始
	this.lastY = event.changedTouches[0].pageY;
},
kefuDialogEvent(){
  this.confirmBoxOrder = true
},
closeOrder(){
  this.confirmBoxOrder = false
},
dectcloseOrder(){
  this.confirmBoxOrder = false;
  this.jumpPage('/pageWebview/service/service');
},
handletouchend(event) {
	//停止滑动
},

    getgodsData() { // 一次
      let self = this;
      self._postBody(
       'user/index/index',
        { source: self.getPlatform(), },
        function (res) {
          if (res.code === 1) {
              console.log('dingdan')
              console.log(res)
              self.orderCount = res.data.orderCount;
            // 遍历更新后的订单列表，处理待支付订单的倒计时
           // self.loading = false; // 数据加载完成后，关闭 loading 状态
          } else {
            // console.error('数据加载失败:', res.message);
            // self.loading = false;
          }
        }
      );
    },












    loginindex(){

     // let self = this;
     let url =  "/pages/login/weblogin?appId=10001"
     this.gotoPage(url);

    },

    getuserinfo(){
        let self = this;
        self._get("user/user/getInfo", {}, function (res) {
            console.log("用户信息")
            console.log(res)
            if(res.code==1){
                self.uerinfo = res.data;
                self.recommendSwitch = res.data.recommendSwitch;
                uni.setStorageSync('uerinfo', res.data);
            }
        }
      )
},
closePopup2(){
  this.confirmBoxOrder = false;
},
    /*关闭弹窗*/
    closePopup(e, cart_total_num) {
      //  console.log("关闭弹框")
      //   console.log(e)


      this.isPopup = false;
      if (e && e.specAttr) {
        this.alreadyChioce = '';
        let has = '已选：';
        let noone = '';
        e.specAttr.forEach((item) => {
          if (item.specItems) {
            let h = '';
            for (let i = 0; i < item.specItems.length; i++) {
              let child = item.specItems[i];
              if (child.checked) {
                child.checked = false;
                h = child.specValue + ' / ';
                break;
              }
            }
            if (h != '') {
              has += h;
            } else {
              noone += item.groupName;
            }
          }
        });
        if (noone != '') {
          this.alreadyChioce = noone;
        } else {
          has = has.replace(/(\s\/\s)$/gi, '');
          this.alreadyChioce = has;
        }
      }
      if (cart_total_num) {
        this.cart_total_num = cart_total_num;
      }
    },

receiveFromChild(data) {
      let self = this
      self._get(
        'product/product/detail',
        {
          productId: data.productId,
        },
        (res) => {
          if (res.data.detail.specType == 20) {
            self.initSpecData(res.data.specData);
          } else {
            self.specData = null
          }
          self.detail = res.data.detail;
          self.isPopup = data.isPopup // 显示弹窗
          let obj = {
            specData: self.specData,
            detail: self.detail,
            productSpecArr:
              self.specData != null ? new Array(self.specData.specAttr.length) : [],
            showSku: {
              skuImage: '',
              price: 0,
              productSkuId: 0,
              linePrice: 0,
              stock: 0,
              sum: 1,
            },
            plusSku: null,
            type: "card",
            plusName: '',
          };
          self.productModel = obj;
        }
      )
    },
    /*多规格商品*/
    initSpecData(data) {

      for (let i in data.specAttr) {
        for (let j in data.specAttr[i].specItems) {
          data.specAttr[i].specItems[j].checked = false;
        }
      }
      this.specData = data;
      if (this.specData.specAttr) {
        this.specData.specAttr.forEach((item) => {
          this.alreadyChioce += item.groupName;
          this.alreadyChioce += ' / ';
        });
        this.alreadyChioce = this.alreadyChioce.replace(/(\s\/\s)$/gi, '');
      }
    },


getnewProduct() {
				// 将当前Vue实例赋值给self变量，以便在函数内部使用
				let self = this;

				// 调用_postBody方法，发送POST请求到'product/productRecommen/lists'接口
				// 携带参数{ code: "newProduct" }
				self._postBody('product/productRecommen/lists', {
				  code:"newProduct"
				}, function(res) {
					// 判断接口返回的res中的code字段是否等于1
					if (res.code === 1) {
						// 如果code等于1，则将res.data.records赋值给Vue实例的listData属性
						self.listData = res.data.records;
					}
				});
			  
			},

		/*获取数据*/
		getData() {
			
		},
		/*获取数据*/
		getPage() {
			
		},
    logout() { // 退出登录
			
		},
		/*设置页面*/
		setPage(page) {

		},
		jumpPage(path) { /*跳转页面*/
      // 判断是否登录，需要登录跳转登录页面
      if (!uni.getStorageSync('token')) {
        this.gotoPage('/pages/login/weblogin');
        return;
      }
			this.gotoPage(path);
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.user{
  background: #F7F8FA;
}
.head {
  width: 100%;
  height: 80rpx;
 
  padding: 20rpx 32rpx;
  z-index: 2;
  box-sizing: border-box;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  justify-content:flex-end;
  background: #ffffff;
  image{
    position: relative;
    top: 40rpx;
  }
  .iconfont {
    font-size: 48rpx;
    color: #666;
  }
  image {
    width: 40rpx;
    height: 40rpx;
  }
}
.user-info-box {
  background: #ffffff;
  border-radius: 0 0 22rpx 22rpx;
  .user-info {
    display: flex;
    padding: 8rpx 40rpx;
    padding-bottom: 0;
    .user-img {
      @include area(144rpx, 144rpx);
      border-radius: 144rpx;
    }
    .head-text {
      padding-left: 24rpx;

    }
    .head-text-name {
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 36rpx;
      color: #040404;
      padding-top: 10rpx;
    }
    .user-level {
      position: relative;
      left: 20rpx;
      top: 3rpx;
      padding-top:20rpx;
      display: inline-block;
      .user-level-img {
        @include area(152rpx, 48rpx);
        margin-right: 2rpx;
        position: relative;
        top: 6rpx;

      }
    }
    .checkout{
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 24rpx;
      color: #040404;
      line-height: 36rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
      margin-top: 10rpx;
      display: block;
      .xiala-img{
        position: relative;
        width:12rpx;
        height:12rpx;
        display: inline-block;
        top: -8rpx;
      }
    }
  }
  .user-hobby {
    @include fl-between;
    padding: 40rpx;
    .user-hobby-item {
      flex: 1;
      text-align: center;
      image {
        @include area(64rpx, 64rpx);
        margin:0 auto;
      }
    }
    .user-hobby-name {
      padding-top: 8rpx;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 28rpx;
      color: #040404;
    }
  }
}
.user-order {
  background: #ffffff;
  margin-left: 30rpx;
  margin-right: 30rpx;
  border-radius: 22rpx;
  //border: 1rpx solid  #BE1E1E;
  .set-attr {
    padding: 40rpx 44rpx 20rpx 44rpx;
    margin-top: 28rpx;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    line-height: 60rpx;
    padding-bottom: 20rpx;
    border-top-left-radius: 22rpx;
    border-top-right-radius: 22rpx;

    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    font-size: 32rpx;
    color: #040404;
    font-style: normal;
    text-transform: none;
    background: #ffffff;
    &.set-attr-singe{
      padding-bottom: 0rpx;
    }
    .set-attr-key {
      width: 200rpx;
    }
    .set-attr-val {
      flex: 1;
      text-align: right;
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: 400;
      font-size: 24rpx;
      color: #000000;
      font-style: normal;
      text-transform: none;
      &.attr-bold {
        font-weight: bold;
        font-family: Roboto, Roboto;
        font-size: 36rpx;
        font-style: normal;
        text-transform: none;
      }
      .set-attr-val-text {
        font-family: Hiragino Sans GB, Hiragino Sans GB;
        font-weight: normal;
        font-size: 28rpx;
        font-style: normal;
        text-transform: none;
        padding-right: 12rpx;
      }
      .iconfont{
        color: #333
      }
    }
  }
  .user-order-box {
    @include fl-between;
    margin: 0 10rpx ;
    padding: 40rpx 32rpx 32rpx 32rpx;
    background: #ffffff;
    border-radius: 22rpx;
  }
  .user-order-item {
    position: relative;
    .user-order-item-num{
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      //padding: 10rpx;
      height: 32rpx;
      line-height: 32rpx;
      display: flex;
	  justify-content: center;
      background: #f43530;
      color:#fff;
      border-radius: 50%;
      width: 32rpx;
      z-index: 2;
      font-size: 20rpx;
      //border: 1rpx solid blue;
    }
    image {
      @include area(64rpx, 64rpx)
    }
    .user-order-name {
      font-size: 24rpx;
    }
  }
}

.goods-box{
  display: flex;
  flex-wrap: wrap;
} 
.new-recom {
  min-height: 80vh;
  .new-recom-title {
    margin-bottom: 18rpx;
    font-family: Hiragino Mincho ProN, Hiragino Mincho ProN;
    font-weight: normal;
    font-size: 28rpx;
    text-align: center;
    padding: 28rpx 0 10rpx 0;
    color: #8C8C8C;
    text {
      color: #000000;

    }
  }
}
page {
	background: #fff;
}
</style>
