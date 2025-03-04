<template>
  <view class="drag optional "
        :style="{
			background: itemData.style.bgcolor,
			paddingLeft: itemData.style.paddingLeft * 2 + 'rpx',
			paddingRight: itemData.style.paddingLeft * 2 + 'rpx',
			paddingTop: itemData.style.paddingTop * 2 + 'rpx',
			paddingBottom: itemData.style.paddingBottom * 2 + 'rpx'
		}">
    <view class="diy-sharpproduct"
          :style="{
				background: itemData.style.background,
				borderTopLeftRadius: itemData.style.topRadio * 2 + 'rpx',
				borderTopRightRadius: itemData.style.topRadio * 2 + 'rpx',
				borderBottomLeftRadius: itemData.style.bottomRadio * 2 + 'rpx',
				borderBottomRightRadius: itemData.style.bottomRadio * 2 + 'rpx'
			}">
      <view class="sharpproduct-head d-b-c"
            :style="{
					backgroundImage: itemData.style.bgimage ? 'url(' + itemData.style.bgimage + ')' : ''
				}">
        <view class="left d-s-c">
          <view v-if="itemData.style.titleType == 1"
                class="name">{{ itemData.params.title }}</view>
          <image v-if="itemData.style.titleType == 2"
                 class="titleImg"
                 :src="itemData.style.titleImage"
                 mode="heightFix"></image>
        </view>
        <view @click="gotoList"
              class="right white d-c-c"
              style="line-height: 1;"
              :style="{
						color: itemData.style.moreColor,
						fontSize: itemData.style.moreSize * 2 + 'rpx'
					}">
          {{ itemData.params.more }}
          <text class="icon iconfont icon-you"
                :style="{
							color: itemData.style.moreColor,
							fontSize: '22rpx'
						}"></text>
        </view>
      </view>
      <view class="product-list column__3">
        <view class="product-item"
              :style="{
						background: itemData.style.productBgColor,
						borderTopLeftRadius: itemData.style.productTopRadio * 2 + 'rpx',
						borderTopRightRadius: itemData.style.productTopRadio * 2 + 'rpx',
						borderBottomLeftRadius: itemData.style.productBottomRadio * 2 + 'rpx',
						borderBottomRightRadius: itemData.style.productBottomRadio * 2 + 'rpx'
					}"
              v-for="(item, index) in itemData.data.productList"
              :key="index"
              @click="gotoDetail(item.bargainProductId)">
          <!-- 两列三列 -->
          <view class="product-cover">
            <image :style="{ borderRadius: itemData.style.productImgRadio * 2 + 'rpx' }"
                   :src="item.filePath"
                   mode="aspectFit"></image>
            <view :style="{
								color: itemData.style.salesColor,
								background: itemData.style.bgSales
							}"
                  v-if="itemData.style.productSales == 1"
                  class="product-sales">
              已砍{{ item.totalSales }}人
            </view>
          </view>
          <view class="product-info p-0-20">
            <view class="price ww100 f24 tc">
              <view class="f24 tc text-ellipsis"
                    v-if="itemData.style.productName == 1"
                    :style="{
									color: itemData.style.productNameColor
								}">
                {{ item.productName }}
              </view>
              <view class="f28 tc"
                    v-if="itemData.style.productPrice == 1"
                    :style="{
									color: itemData.style.productPriceColor
								}">
                ¥{{ item.bargainPrice }}
              </view>
              <view v-if="itemData.style.productLineprice == 1"
                    :style="{
									color: itemData.style.productLineColor
								}"
                    class="f24 text-d-line">
                ¥{{ item.productPrice }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['itemData'],
  methods: {
    scroll(e) {},

    /*跳转列表*/
    gotoList() {
      let url = '/pages/plus/bargain/list/list'
      this.gotoPage(url)
    },

    /*跳转详情*/
    gotoDetail(e) {
      let url = '/pages/plus/bargain/detail/detail?bargainProductId=' + e
      this.gotoPage(url)
    },
  },
}
</script>

<style lang="scss">
.diy-sharpproduct {
  overflow: hidden;
  // padding: 10px;
}

.diy-sharpproduct .product-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding-top: 22rpx;
  padding-left: 20rpx;
  box-shadow: 0px 8rpx 4rpx 0px rgba(6, 0, 1, 0.03);
  padding-bottom: 20rpx;
  overflow-x: auto;
}

.diy-sharpproduct .display__list .column__3 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20rpx;
}

.diy-sharpproduct .product-list.column__3 .product-item {
  width: 198rpx;
  margin-right: 38rpx;
  padding-bottom: 10rpx;
  overflow: hidden;
}
.diy-sharpproduct .product-list.column__3 .product-item:last-child {
  margin-right: 0;
}
.diy-sharpproduct .product-list.column__3 .product-item .product-cover {
  width: 198rpx;
  height: 198rpx;
  position: relative;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.diy-sharpproduct .product-list.column__3 .product-item .product-cover image {
  width: 198rpx;
  height: 198rpx;
}
.diy-sharpproduct .sharpproduct-head {
  height: 88rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0 20rpx;
  background-repeat: no-repeat;
  background-size: cover;
  line-height: 1;
}

.sharpproduct-head .name {
  font-size: 36rpx;
  font-weight: bold;
  width: 200rpx;
}

.sharpproduct-head .datetime {
  margin-left: 40rpx;
}

.sharpproduct-head .datetime > text {
  display: inline-block;
}

.sharpproduct-head .datetime .text {
  padding: 0 4rpx;
}

.diy-sharpproduct .product-list .barginbtns {
  width: 200rpx;
  background: linear-gradient(90deg, #ff4545 0%, #f6220c 100%);
  height: 50rpx;
  line-height: 50rpx;
  font-size: 26rpx;
  text-align: center;
  color: #ffffff;
  margin: 0 auto;
  border-radius: 26rpx;
}

.left .datetime {
  padding: 2rpx;
  border-radius: 400rpx 0 400rpx 400rpx;
  border: 1px solid #eeeeee;
  padding-right: 8rpx;
}

.left .datetime .daybox {
  padding: 0 20rpx;
  border-radius: 400rpx;
  margin-right: 10rpx;
}
.titleImg {
  width: auto;
  height: 88rpx;
}
.product-info {
  height: auto;
}
.product-sales {
  font-size: 24rpx;
  text-align: center;
  width: 162rpx;
  line-height: 2;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
}
</style>
