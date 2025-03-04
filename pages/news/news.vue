<template>
  <view class="page_news_box" >
    <view class="home-fixed" style="position: fixed;top: 0rpx;background:#fff">
      <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
      <view class="head" >
       消息
       <text class="haveRead" @click="haveRead">一键已读</text>
      </view>
      <!-- <view class="address-bar ">
        <text class="card-title">购物车({{ tableData.length }})</text>
        <view class="f30" @click="isEdit = !isEdit">
          <button class="f24" v-if="isEdit">完成</button>
          <button class="f24" v-else>编辑</button>
        </view>
      </view> -->
    </view>
    <view class="scroll-good-box" style="margin-top: 160rpx;">
      <scroll-view scroll-y class="goods scroll-Y" @scrolltolower="scrolltolower">
     
        <view class="content" txt="消息类型">
          <view class="new-item" @click="jumpPage('/pages/news/logisticsNotice')">
            <view class="new-img-box">
              <image class="new-img" src="/static/home/new/wuliu.png" mode="" />
              <text class="new-img-num" v-if="newsData.logisticsUnreadCount>0">{{newsData.logisticsUnreadCount}}</text>
            </view>
            <view class="new-detail">
              <view class="new-title">
                <view class="new-title-left">
                  <text>
                    物流通知
                  </text>
                  <text class="official">
                    官方
                  </text>
                  <!-- <image class="new-auth-img" src="/static/home/car.png" mode="" /> -->
                </view>
                <view class="new-title-time">
                  {{newsData.logisticsDate}}
                </view>
              </view>
              <view class="new-text" v-if="newsData.logisticsTotalCount>0">
                【{{newsData.logisticsTotalCount}}条】{{newsData.logisticsContent}}
              </view>
              <view class="new-text" v-else>
                【{{'暂无通知'}}】
              </view>
            </view>
          </view>
          <view class="new-item" @click="jumpPage('/pages/news/activityNotice')">
            <view class="new-img-box">

              <image class="new-img" src="/static/home/new/huodong.png" mode="" />
              <text class="new-img-num" v-if="newsData.activityUnreadCount>0">{{newsData.activityUnreadCount}}</text>
            </view>
            <view class="new-detail">
              <view class="new-title">
                <view class="new-title-left">
                  <text>
                    活动通知  
                  </text>
                  <text class="official">
                    官方
                  </text>
                  <!-- <image class="new-auth-img" src="/static/home/car.png" mode="" /> -->
                </view>
                <view class="new-title-time">
                  {{newsData.activityDate}}
                </view>
              </view>
              <view class="new-text" v-if="newsData.activityTotalCount>0">
                【{{newsData.activityTotalCount}}条】{{newsData.activityContent}}
              </view>
              <view class="new-text" v-else>
                【{{'暂无通知'}}】
              </view>
            </view>
          </view>
          <view class="new-item" @click="jumpPage('/pages/news/tradeNotice')">
            <view class="new-img-box">
              <image class="new-img" src="/static/home/new/jiaoyi.png" mode="" />
              <text class="new-img-num" v-if="newsData.transactionUnreadCount>0">{{newsData.transactionUnreadCount}}</text>
            </view>
            <view class="new-detail">
              <view class="new-title">
                <view class="new-title-left">
                  <text>
                    交易通知  
                  </text>
                  <text class="official">
                    官方
                  </text>
                  <!-- <image class="new-auth-img" src="/static/home/car.png" mode="" /> -->
                </view>
                <view class="new-title-time">
                  {{newsData.transactionDate}}
                </view>
              </view>
              <view class="new-text" v-if="newsData.transactionTotalCount>0">
                【{{newsData.transactionTotalCount}}条】{{newsData.transactionContent}}
              </view>
              <view class="new-text" v-else>
                【{{'暂无通知'}}】
              </view>
            </view>
          </view>
        </view>
        <!-- <view class="crumb" txt="面包屑-消息" :class="more ? 'bg-white': ''">
          <image src="/static/home/new/new.png" mode="" />
          <text class="flex-1">已折叠30天前消息</text>
          <text class="iconfont icon-you" v-show="!more" @click="moreFn(true)"></text>
          <text class="iconfont icon-jiantoushang" v-show="more" @click="moreFn(false)"></text>
        </view> -->
        <view class="content" txt="消息类型" v-show="more">
          <view class="new-item">
            <view class="new-img-box">
              <image class="new-img" src="/static/home/new/wuliu.png" mode="" />
              <text class="new-img-num">{{newsData.activityTotalCount}}</text>
            </view>
            <view class="new-detail">
              <view class="new-title">
                <view class="new-title-left">
                  <text>
                    物流通知
                  </text>
                  <!-- <image class="new-auth-img" src="/static/home/car.png" mode="" /> -->
                </view>
                <view class="new-title-time">
                  {{newsData.transactionDate}}
                </view>
              </view>
              <view class="new-text">
                【12条】您购买的商品已发货，请您耐心等待！您购买的商品已发货，请您耐心等待！
              </view>
            </view>
          </view>
          <view class="new-item">
            <view class="new-img-box">

              <image class="new-img" src="/static/home/new/huodong.png" mode="" />
              <text class="new-img-num">{{newsData.activityTotalCount}}</text>
            </view>
            <view class="new-detail">
              <view class="new-title">
                <view class="new-title-left">
                  <text>
                    活动通知  
                  </text>
                  <!-- <image class="new-auth-img" src="/static/home/car.png" mode="" /> -->
                </view>
                <view class="new-title-time">
                  24/09/08
                </view>
              </view>
              <view class="new-text">
                【12条】您购买的商品已发货，请您耐心等待！您购买的商品已发货，请您耐心等待！
              </view>
            </view>
          </view>
          <view class="new-item">
            <view class="new-img-box">
              <image class="new-img" src="/static/home/new/jiaoyi.png" mode="" />
              <text class="new-img-num">9</text>
            </view>
            <view class="new-detail">
              <view class="new-title">
                <view class="new-title-left">
                  <text>
                    交易通知  
                  </text>
                  <!-- <image class="new-auth-img" src="/static/home/car.png" mode="" /> -->
                </view>
                <view class="new-title-time">
                  {{newsData.transactionDate}}
                </view>
              </view>
              <view class="new-text">
                【12条】您购买的商品已发货，请您耐心等待！您购买的商品已发货，请您耐心等待！
              </view>
            </view>
          </view>
        </view>
        <view class="new-recom" v-if="recommendSwitch==0">
          <view class="new-recom-title">
            ——— 
            <text>精选好物</text>  
            ———
          </view>
          <view class="goods-box">
            <template v-for="(item, key) in Selected_Good" :key="key">
              <goodsBlock  :parentitem="item"  @custom-event="receiveFromChild"  ></goodsBlock>
            </template>
          </view>
        </view>
      </scroll-view>
    </view>
    <tabBar @get-footer-height="getFooterHeigth" :newsNum="newsNum"></tabBar>

        <!--购物确定方便快捷购物用的-->
        <spec
        :isPopup="isPopup"
        :productModel="productModel"
        @close="closePopup"
      ></spec>
  </view>
</template>

<script>
import spec from '../product/detail/popup/spec.vue';
import TopNavBar from '@/components/topNavBar/topNavBar.vue';
import goodsBlock from '@/pages/component/goodsBlock.vue';
//TODO 消息页-待开发
export default {
  components: {
    TopNavBar,
    goodsBlock,
    spec
  },
  data() {
    return {
      recommendSwitch:0,
      newsNum:0,
      Selected_Good: [],
      /*是否确定购买弹窗*/
			isPopup: false,
      	/*购物车商品数量*/
			cart_total_num: 0,
      	/*子级页面传参*/
			 productModel: {},
       // 商品属性
       specData:null,
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
      more: false,
      newsData:{},
    }
  },
  computed: {

  },
  mounted() {
    this.getgoodslist();
    // this.getNews()
    this.getuserinfo();
  },
  onLoad(e) {
    //this.getNews()

	},
  methods: {
    scrolltolower(){
      
    },
    haveRead(){
      let self = this
      self._get(
				'user/message/readAll',
				{
					
				},
				(res)=>{
          console.log(res);
          if(res.code==1){
            // self.newsData = res.data;
            self.getNews()
          }
        }
      )
    },
    moreFn(bo){
      this.more = bo
    },
    getgoodslist(){
        let self = this;
				self._postBody('product/productRecommen/lists', {
				  code:"selected",
				}, function(res) {
					if (res.code === 1) {
						self.Selected_Good = res.data.records;
					}
				});
   },
   getNews(){
    let self = this
      self._get(
				'user/message/summary',
				{
					
				},
				(res)=>{
          console.log(res);
          if(res.code==1){
            self.newsData = res.data;
            self.getNewsNum();
          }
     
                 
        }
      )

   },
   getNewsNum(){
    let self = this
      self._get(
				'user/message/getUnreadAllCount',
				{
					
				},
				(res)=>{
          console.log(res);
          if(res.code==1){
            self.newsNum = res.data;
            //this.$store.commit('getNewsTotal', res.data);
            if(res.data>0){
              uni.showTabBarRedDot({
                index: 2
              })
            }else{
              uni.hideTabBarRedDot({
                index: 2
              })
            }

          }
     
                 
        }
      )

   },
   getuserinfo(){
        let self = this;
        self._get("user/user/getInfo", {}, function (res) {
            console.log("用户信息")
            console.log(res)
            if(res.code==1){
                self.recommendSwitch = res.data.recommendSwitch;
                uni.setStorageSync('uerinfo', res.data);
            }
        }
      )
},
    receiveFromChild(data) {
      let self = this
      self._get(
				'product/product/detail',
				{
					productId: data.productId,
				},
				(res)=>{
      if (res.data.detail.specType == 20) {
						self.initSpecData(res.data.specData);
					}else{
            self.specData = null
          }
        self.detail =res.data.detail;
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


    backOperation() {
      uni.switchTab({
        url: '/pages/index/index',
        success: (result) => {},
      })
    },
    getFooterHeigth(height) {
      console.log("height", height)
      this.footerHeight = height;
    },
    jumpPage(path) { /*跳转页面*/
			this.gotoPage(path);
		},
  },
  onShow() {
    console.log(this, 14554)
    this.getNews()
  },

}
</script>

<style lang="scss" scoped>
@mixin fl-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
@mixin fl-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.home-fixed {
  position: relative;
  top: 10rpx;
  z-index: 2;
  width: 100vw;
}
.scroll-good-box{
  height: 100%;
  //padding-top: 60rpx;
  .goods{
    height: 100%;

  }
}
.page_news_box {
  background-color: #F7F8FA;
  //min-height: 100vh;
  .crumb{
    height: 66rpx;
    background: #F4FBFF;
    border-radius: 0px 0px 0px 0px;
    padding-left: 20rpx;
    padding-right: 20rpx;
    display: flex;
    align-items: center;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 12px;
    color: #0D74EE;
    &.bg-white{
      background: #fff;
    }
    image {
      width: 36rpx;
      height:36rpx;
    }
    .iconfont{
      color: #0D74EE;
    }
  }
  .head {
    width: 100%;
    height: 88rpx;
    padding: 10rpx;
    z-index: 2;
    box-sizing: border-box;
    font-size: 32rpx;
    font-weight: normal;
    text-align: center;
    .haveRead{
      position: absolute;
      right: 28rpx;
      font-size: 24rpx;
      margin-top:5rpx;
    }
  }
  .goods-box{
    display: flex;
    flex-wrap: wrap;
    margin-top: 18rpx;
  } 
}
.scroll-Y{
  //height: calc(100vh - 150rpx) !important;
}
.new-item {
  display: flex;
  justify-content: space-between;
  width: 750rpx;
  box-sizing: border-box;
  padding: 20rpx;
  padding-bottom: 0rpx;
  background-color: #fff;
  .new-img-box {
    position: relative;
    .new-img-num{
      position: absolute;
      top: 0;
      right: 0;
      display: inline-block;
      min-width: 24rpx;
      height: 30rpx;
      padding: 1rpx 4rpx;
      text-align: center;
      line-height: 30rpx;
      background: #f43530;
      border-radius: 30rpx ;
      border: 1px solid #FFFFFF;
      color:#fff;
    }
  }
  .new-img {
    width: 88rpx;
    height: 88rpx;
    border-radius: 10rpx;
  }
  .new-detail {
    width: 600rpx;
    margin-left: 20rpx;
    min-height: 88rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 1rpx #eee solid;
    padding-bottom: 20rpx;

  }
  .new-title {
    @include fl-between();
    font-size: 30rpx;
    .new-title-left {
      display: flex;
      align-items: center;
      font-family: Hiragino Sans, Hiragino Sans;
      font-weight: normal;
      font-size: 28rpx;
      color: #000000;
    }
    .new-auth-img {
      width: 40rpx;
      height: 40rpx;
      padding-left: 12rpx;
    }
    .new-title-time {
      font-family: Hiragino Sans, Hiragino Sans;
      font-weight: normal;
      font-size: 20rpx;
      color: #8C8C8C;
    }
  }
  .new-text {
    color:#333;
    width: 580rpx;
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-family: Hiragino Sans, Hiragino Sans;
    font-weight: normal;
    font-size: 24rpx;
    color: #8C8C8C;
  }
}
.new-recom {
  .new-recom-title {
    font-family: Hiragino Mincho ProN, Hiragino Mincho ProN;
    font-weight: normal;
    font-size: 28rpx;
    text-align: center;
    padding: 20rpx 0 10rpx 0;
    color: #8C8C8C;
    text {
      color: #000000;

    }
  }
}

.official{
  margin-left: 10rpx;
  width: 46rpx;
  height: 26rpx;
  background: #FFF2F2;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #BE1E1E;
  color: #BE1E1E;
  font-size: 22rpx;
  line-height: 26rpx;
  padding: 1rpx;
}


.goods-item2 {
  width: 375rpx;
  box-sizing: border-box;
  padding: 20rpx;
  .goods-img {
    width: 344rpx;
    height: 344rpx;
    // border-radius: 10rpx;
  }
  .goods-detail {
    width: 100%;
    padding-top: 12rpx;
    // min-height: 200rpx;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
  }
  .goods-title {
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 24rpx;
    color: #040404;
    line-height: 36rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
    display: -webkit-box;
   -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    // display: flex;
    // flex-wrap: wrap;
    // align-content: center;

    .goods-national{
      display: inline-block;
      width: 36rpx;
      height: 27rpx;
      
    }
  }
  .goods-labels {
    padding-top: 16rpx;
    .goods-labels-item{
      padding: 4rpx 8rpx;
      margin-right: 16rpx;
      border-radius: 8rpx;
      font-size: 16rpx;
    }
  }
  .goods-info {
    // @include fl-between();
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    .goods-price {
      font-family: Roboto, Roboto;
      font-weight: 600;
      font-size: 36rpx;
      color: #000000;
      text-align: left;
      font-style: normal;
      text-transform: none;
      text {
        font-size: 24rpx;
      }
    }
    .goods-price-old {
      font-family: Roboto, Roboto;
      font-weight: 300;
      font-size: 20rpx;
      color: #000000;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    .goods-cat {
      @include fl-center();
      box-sizing: border-box;
      width: 50rpx;
      height: 50rpx;
      // padding: 10rpx;
      background: #ddd;
      border-radius: 50%;
    }
    .goods-cat-img{
      width: 50rpx;
      height: 50rpx;
    }
    .goods-num {
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 20rpx;
      color: #999999;
      line-height: 20rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
</style>