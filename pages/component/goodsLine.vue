<template>
  <view class="goods-item" @click="jumpPage(pargoodsList.productId)">
    <!-- <image class="goods-img" :src="pargoodsList.productImage" mode="" lazy-load="true"/> -->
    <ImageLazyLoad width="204rpx"
    height="204rpx" threshold="100" :image="pargoodsList.productImage"  class="goods-img"  mode=""/>
    <view class="goods-detail">
      <view class="goods-title">
        <text>
          <image class="goods-national" :src="pargoodsList.countryImage" mode="" lazy-load="true"/>
         {{pargoodsList.productName}} 
        </text>
      </view>
      <view class="goods-labels">
        <text class="goods-labels-item" :style="{color:'#fff',width:'100%'}">
          <text :style="{'background':ind.background,color:ind.color}" class="goods-labels-item-color" v-for="ind in JSON.parse(pargoodsList.label) ">
            {{ ind.text }}
         </text>
         <!-- <text v-if="pargoodsList.area==1">
          海外购
         </text> 
          <text v-else>
              国内购
          </text> -->
        </text>  

     
        <!-- <text class="goods-labels-item" :style="{ color: JSON.parse(pargoodsList.label.color), background: JSON.parse(pargoodsList.label.background)  }">
           {{ JSON.parse(pargoodsList.label.text)}} 
        </text> -->
        <text class="goods-labels-item" :style="{ color: JSON.parse(pargoodsList.label).color,background: JSON.parse(pargoodsList.label).background}">
          <!-- 免税包邮  -->
          {{JSON.parse(pargoodsList.label).text}} 
        </text>
      </view>
      <view class="goods-info">
        <view class="goods-info-l">
          <view class="goods-price"><text>￥</text>{{toPositive(pargoodsList.productPrice)}}</view>
          <view class="goods-price-old"><text></text>{{pargoodsList.exchangePrice}}</view>
          <!-- <view class="goods-num">销量{{pargoodsList.productSales}}</view> -->
        </view>
        <view class="goods-cat" @click.stop="carFn(pargoodsList.productId,pargoodsList.specType)">
          <image class="goods-cat-img" src="/static/home/car.png" mode="" lazy-load="true"/>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
//TODO 消息页-待开发
import ImageLazyLoad from './imageLazyLoad.vue';
export default {
  props:["pargoodsList"],
  components: {
    ImageLazyLoad
  },
  computed: {

  },
  methods: {
    toPositive(price) {
      return price
      // if(price<0){
			// 	return '????'
			// }
      // return Math.max(0, price);
    },
    carFn(productId,specType){

   //  console.log(productId,specType)

     let data = {
        productId:productId,
        specType:specType,
        isPopup:true,
      }

      this.$emit('custom-event', data);
      // console.log("加入购物车")
    },
    jumpPage(productId) { /*跳转页面*/
      console.log(productId)
      let url = '/pages/product/detail/detail?productId=' + productId +'&appId=10001';
 //'pages/product/detail/detail?productId=34&appId=10001'
			this.gotoPage(url);

		},
  },
  onShow() {
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
.goods-labels-item-color{
  margin-right: 10rpx;
  width:66rpx;
  height:34rpx;
  padding-top :4rpx;
  padding-bottom :4rpx;
  padding-left :4rpx;
  padding-right :4rpx;
  font-size:18rpx;
  border-radius:4rpx
}
.goods-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1rpx #eee solid;
  width: 750rpx;
  box-sizing: border-box;
  padding: 38rpx 20rpx 38rpx 36rpx;
  .goods-img {
    width: 204rpx;
    height: 204rpx;
    // border-radius: 10rpx;
  }
  .goods-detail {
    width: 462rpx;
    padding-left: 30rpx;
    min-height: 200rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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

    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 2;
    overflow: hidden;
    height: 36rpx;
    // display: flex;
    // flex-wrap: wrap;
    // align-content: center;
    //display: -webkit-box;
     //-webkit-box-orient: vertical;
    //-webkit-line-clamp: 2;
    //max-height: 68rpx;
    // display: flex;
     //flex-wrap: wrap;
     //align-content: center;

    .goods-national{
      display: inline-block;
      width: 36rpx;
      height: 27rpx;
      
    }
  }
  .goods-labels {
    flex: 1;
    padding-top: 16rpx;
    .goods-labels-item{
      padding: 4rpx 8rpx;
      margin-right: 16rpx;
      border-radius: 8rpx;
      font-size: 16rpx;
    }
  }
  .goods-info {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    .goods-info-l{
      display: flex;
      align-items: baseline;
      justify-content: flex-start;
    }
    .goods-price {
      font-size: 36rpx;
      color: #d62424;
      padding-right: 8rpx;
    }
    .goods-price-old {
      font-family: Roboto, Roboto;
      font-weight: 300;
      font-size: 20rpx;
      color: #000000;
      text-align: left;
      font-style: normal;
      text-transform: none;
      padding-right: 8rpx;
    }
    .goods-cat {
      width: 50rpx;
      height: 50rpx;
      .goods-cat-img{
        width: 50rpx;
        height: 50rpx;
      }
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