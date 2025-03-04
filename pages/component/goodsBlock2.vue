<template>
    <view class="goods-item2" @click="jumpPage(parentitem.productId)">
  
        <view class="radio d-s-c radio-ui" v-show="showRadio">
                      <!-- <radio class="radioVol" style="transform:scale(0.7)" color="#000" :value="parentitem.isChecked" @click.prevent="radioChange2(parentitem)"   :checked="parentitem.isChecked"
                        /> -->
              <!-- <label>
                <checkbox class="radioVol" :value="parentitem.isChecked" style="transform:scale(0.7)" color="#000" :checked="parentitem.isChecked" @click.prevent="radioChange2(parentitem)"/>
              </label> -->
              <checkbox-group @change="radioChange2(parentitem)">
                <label class="d-c-c "  >
                  <checkbox
                    value="cb"
                    class="checkbox"
                    :checked="parentitem.isChecked"
                    style="transform:scale(0.8)"
                    color="#FFFFF"
                    borderColor="#99999"
                    activeBorderColor="#101010"
                    activeBackgroundColor="#000"
                    iconColor="#fff"
                  />
                </label>
              </checkbox-group>
                  </view>
          <view class="goods-img-box">
            <!-- <image class="goods-img" :src="parentitem.productImage" mode="" lazy-load="true"/> -->
            <ImageLazyLoad width="344rpx" height="344rpx"  class="goods-img" threshold="100" :image="parentitem.productImage"/>
          </view>
      <view class="goods-detail" :style="{'background-color': bg}">
        <view class="goods-title" >
          <text>
            <image class="goods-national" :src="parentitem.countryImage" mode="" lazy-load="true"/>
              {{ parentitem.productName }}
          </text>
        </view>
        <view class="goods-labels" v-if="JSON.parse(parentitem.label).length>0">
          <text class="goods-labels-item" :style="{color:'#fff',width:'100%'}">
            <text :style="{'background':ind.background,color:ind.color}" class="goods-labels-item-color" v-for="ind in JSON.parse(parentitem.label) ">
              {{ ind.text }}
           </text>
            <!-- <text v-if="parentitem.area == 1">
               国内包邮
            </text>
            <text v-else>
              海外包邮
            </text> -->
          </text>
          <!-- <text class="goods-labels-item" :style="{color:JSON.parse(parentitem.label).color,background:JSON.parse(parentitem.label).background}">
            {{JSON.parse(parentitem.label).text }}
          </text> -->
        </view>
        <view class="goods-info">
          <view class="goods-info-l">
  
            <view class="goods-price"><text style="position: relative;top: -2rpx">￥</text>{{toPositive(parentitem.productPrice)}}</view>
            <view class="goods-price-old"><text></text>{{ parentitem.exchangePrice}}</view>
            <!-- <view class="goods-num">销量{{ parentitem.productSales }}</view> -->
          </view>
          <view class="goods-cat" @click.stop="carFn(parentitem.productId,parentitem.specType)">
            <image class="goods-cat-img" src="/static/home/car.png" mode=""  lazy-load="true" />
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script>
  import ImageLazyLoad from './imageLazyLoad.vue';
  //TODO 消息页-待开发
  export default {
    props:['bg','parentitem','showRadio'],
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
      //   return Math.max(0, price);
      },
      carFn(productId,specType){// 调转到商品添加页面//  单规格的直接弹添加数量的， 多规格弹选择规格
  
        let data = {
          productId:productId,
          specType:specType,
          isPopup:true,
        }
  
        this.$emit('custom-event', data);
         
        console.log("加入购物车")
      },
      jumpPage(productId) { /*跳转页面*/
       
          console.log(productId)
          let path = 'pages/product/detail/detail?productId='+ productId +'&appId=10001';
                 this.gotoPage(path);
        //'pages/product/detail/detail?productId=34&appId=10001'
          },
      radioChange2(item){
        console.log(item,'itennnnk')
        this.$emit('radioChange2',item);
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
  .ellipsis {
    
    display: -webkit-box;  
      -webkit-box-orient: vertical;  
      overflow: hidden; /* 隐藏超出部分 */  
      text-overflow: ellipsis; /* 超出部分用省略号表示 */  
      white-space: normal; /* 允许换行 */  
      /* 你可能还想设置一些其他样式，比如宽度、字体大小等 */
    /* 设置宽度和高度 */
  
  }
  .goods-item2 {
    //margin-top: 12rpx;
    position: relative;
    width: 375rpx;
    border-radius: 14rpx;
    box-sizing: border-box;
    &:nth-child(2n-1){
      margin-top: 12rpx;
      padding: 4rpx 8rpx 3rpx 24rpx;
    }
    &:nth-child(2n){
      margin-top: 12rpx;
      padding: 4rpx 24rpx 3rpx 8rpx;
    }
    &:nth-child(1){
      margin-top: 0rpx;
      padding: 0rpx 8rpx 3rpx 24rpx;
    }
    &:nth-child(2){
      margin-top: 0rpx;
      padding: 0rpx 24rpx 3rpx 8rpx;
    }
    .radio-ui{
      position: absolute;
      z-index: 100;
      width: 46rpx;
      height: 46rpx;
      .radioVol{
        position: absolute;
        top: 0rpx;
        left: 0rpx;
        width: 46rpx;
        height: 46rpx;
      }
  
      
    }
    .goods-img-box {
      background: #fff;
      width: 344rpx;
      height: 344rpx;
      border-top-left-radius: 4rpx; /* 设置左上角圆角 */
      border-top-right-radius: 4rpx; /* 设置右上角圆角 */
    }
    .goods-img {
      background: #fff;
      width: 344rpx;
      height: 344rpx;
      // border-radius: 10rpx;
      border-top-left-radius: 4rpx; /* 设置左上角圆角 */
      border-top-right-radius: 4rpx; /* 设置右上角圆角 */
      border-bottom-right-radius: 4rpx; /* 右下角圆角 */
      border-bottom-left-radius: 4rpx; /* 左下角圆角 */
    }
    .goods-detail {
      width: 344rpx;
      padding: 10rpx 10rpx 16rpx 10rpx;
      box-sizing: border-box;
      background: #fff;
      // min-height: 200rpx;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-between;
      border-bottom-right-radius: 4rpx; /* 右下角圆角 */
      border-bottom-left-radius: 4rpx; /* 左下角圆角 */
    }
    .goods-title {
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 24rpx;
      color: #040404;
      line-height: 38rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
      display: -webkit-box;
       -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      height: 68rpx;
      // display: flex;
       flex-wrap: wrap;
       align-content: center;
  
      .goods-national{
        display: inline-block;
        width: 26rpx;
        height: 20rpx;
        position: relative;
        top:-6rpx;
        
      }
    }
    .goods-labels {
      padding-top: 16rpx;
      padding-bottom: 16rpx;
      .goods-labels-item{
        //width: 1000rpx;
        //padding: 4rpx 8rpx;
        margin-right: 10rpx;
        border-radius: 8rpx;
        font-size: 16rpx;
      }
    }
    .goods-info {
      // @include fl-between();
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20rpx;
      margin-bottom: 10rpx;
      .goods-info-l {
        flex: 1;
        display: flex;
        align-items: baseline;
        // justify-content: space-between;
      }
      .goods-price {
        // flex: 1;
        font-family: Roboto, Roboto;
        font-weight: 600;
        font-size: 36rpx;
        color: #000000;
        text-align: left;
        font-style: normal;
        text-transform: none;
        padding-right: 12rpx;
        text {
          font-size: 24rpx;
        }
      }
      .goods-price-old {
        // flex: 1;
        font-family: Roboto, Roboto;
        font-weight: 300;
        font-size: 20rpx;
        color: #000000;
        text-align: left;
        font-style: normal;
        text-transform: none;
        padding-right: 12rpx;
      }
      .goods-cat {
        @include fl-center();
        box-sizing: border-box;
        width: 44rpx;
        height: 44rpx;
        // padding: 10rpx;
        // background: #ddd;
        border-radius: 50%;
        margin-left: 8rpx;
      }
      .goods-cat-img{
        width: 44rpx;
        height: 44rpx;
        position: relative;
        right: 10rpx;
      }
      .goods-num {
        // flex: 1;
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