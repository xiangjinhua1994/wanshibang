<template>
  <view class="refund-apply pb100">
		<view class="head_top" :style="'height:' + topBarTop() + 'px;'" style="background-color: #fff;"></view>
    <headTitle title="申请退款" bg="#fff">
          
    </headTitle>
    <form @reset="formReset">
      <view class="one-product d-s-c bg-white ">
        <view class="cover" >
          <view class="refundTitle" style="margin-left: 0rpx;font-weight:bold">{{'退款商品'}}</view>
          <image class="refundImg" :src="product.productImage"
                 mode="aspectFit" style="padding-bottom:44rpx"></image>
        </view>
        <view class="flex-1">
          <view style="display: flex;justify-content: space-between;">
            <view class="pro-info2">{{product.productName}}  </view>
            <view>¥{{product.totalPayPrice}}</view>
          </view>
          <view class="pt10 p-0-0 f24 gray9" style="display: flex;justify-content: space-between;">
            <text class="">
              
            </text>
            <text class="ml20">
              x{{product.totalNum}}
            </text>
          </view>
        </view>
      </view>
      <view class="one-product bg-white">
        <view class="">
          <view class="refundTitle" style="margin-left: 0rpx;">{{'选择类型'}}</view>
        </view>
        <view class="" >
          <!-- <view class="pro-info pro-info2">{{product.productName}}</view> -->
          <view class=" p-0-0 f28 " style="display: flex;padding-top:48rpx" @click="jumpToPage(30)" v-if="product.deliveryStatus==10">
            <view class="iconRefund"><image class="iconRefund" src="/static/icon/refund.png"
              mode="aspectFit"></image></view>
            <view style="line-height: 50rpx;margin-left:24rpx"> 我要退款
            </view>
            <view class="iconImg"><image class="iconImg" src="/static/icon/iconArrow.png"
              mode="aspectFit"></image></view>

          </view>
          <view class=" p-0-0 f28" style="display: flex;padding-top:40rpx" @click="jumpToPage(10)" v-else>
            <view class="iconRefund"><image class="iconRefund" src="/static/icon/refund2.png"
              mode="aspectFit"></image></view>
            <view style="line-height: 50rpx;margin-left:24rpx"> 我要退货退款
            </view>
            <view class="iconImg"><image class="iconImg" src="/static/icon/iconArrow.png"
              mode="aspectFit"></image></view>
          </view>
        </view>
      </view>

      <!-- 服务类型 -->
      <!-- <view class="group bg-white"
            v-if="product && product.orderM && product.orderM.deliveryType!=30">
        <view class="group-hd border-b-e">
          <view class="left">
            <text class="min-name">服务类型</text>
          </view>
        </view>
        <view class="d-s-c p-20-0 button_line">
          <button type="default"
                  :class="type==10?'btn-red-border btn':'btn'"
                  @click="tabType(10)"
                  v-if="product&&product.afterSaleType===0">退货/退款</button>
          <button type="default"
                  :class="type==20?' btn-red-border btn':'btn'"
                  @click="tabType(20)">换货</button>
          <button type="default"
                  :class="type==30?' btn-red-border btn':'btn'"
                  @click="tabType(30)"
                  v-if="product&&product.afterSaleType===0">仅退款</button>
        </view>
      </view> -->

      <!--申请原因-->
      <!-- <view class="group bg-white">
        <view class="group-hd">
          <view class="left">
            <text class="min-name">申请原因</text>
          </view>
        </view>
        <view class="d-s-c">
          <textarea class="p10 box-s-b border flex-1 f28 lh150"
                    v-model="form.content"
                    placeholder="请详细填写申请原因，注意保持商品的完好，建议您先与卖家沟通" />
        </view>
      </view> -->

      <!--退款金额-->
      <!-- <view class="group bg-white"
            v-if="type==10 || type==30">
        <view class="group-hd">
          <view class="left">
            <text class="min-name">退款金额：</text>
            <text class="red f30">¥{{product.totalPayPrice}}</text>
          </view>
        </view>
      </view> -->

      <!--上传图片-->
      <!-- <view class="group bg-white">
        <view class="group-hd">
          <view class="left">
            <text class="min-name">上传凭证</text>
            <text class="gray9">(最多6张)</text>
          </view>
        </view>
        <view class="upload-list d-s-c">
          <view class="item"
                v-for="(imgs,img_num) in images"
                :key="img_num"
                @click="deleteFunc(imgs)">
            <image :src="imgs.filePath"
                   mode="aspectFit"></image>
          </view>
          <view class="item d-c-c d-stretch"
                v-if="images.length<6">
            <view class="upload-btn d-c-c d-c flex-1"
                  @click="openUpload()">
              <text class="icon iconfont icon-xiangji f34"></text>
              <text class="gray9">上传图片</text>
            </view>
          </view>
        </view>
      </view> -->

      <!-- <view class="foot-btns">
        <template v-if="isWeixin() && mpState == 1 && temlIds.length > 0 ">
          //#ifdef H5
          <wx-open-subscribe :template="temlIds"
                             id="subscribe-btn"
                             @success="subscribeSuccess"
                             @error="subscribeFail">
            <div v-is="'script'"
                 type="text/wxtag-template"
                 slot="style">
              <div v-is="'style'">
                #subscribe-btn{
                width: 100%;
                }
                .subscribe-btn{
                border: 1px solid #f6220c;
                background: #f6220c;
                color: #fff;
                border-radius:5px;
                float: right;
                }
              </div>
            </div>
            <div v-is="'script'"
                 type="text/wxtag-template">
              <div class="subscribe-btn"
                   :style="{
									width: btnAtrrpx.width+'px',
									height: btnAtrrpx.height+'px',
									lineHeight: btnAtrrpx.height+'px',
									paddingLeft: btnAtrrpx.paddingLeft+'px',
									paddingRight: btnAtrrpx.paddingLeft+'px',
									fontSize: btnAtrrpx.fontSize+'px',
								}">
                确认提交
              </div>
            </div>
          </wx-open-subscribe>
          //#endif
        </template>
        <template v-else>
          <button class="sure_btn"
                  @click="formSubmit">确认提交</button>
        </template>
      </view> -->
    </form>
    <!--上传图片-->
    <Upload v-if="isUpload"
            @getImgs="getImgsFunc"></Upload>
  </view>

</template>

<script>
import Upload from '@/components/upload/upload.vue';
import headTitle from '@/pages/component/headTitle.vue';

export default {
  components: {
    Upload,
    headTitle
  },
  data() {
    return {
      /*是否加载完成*/
      loadding: true,
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      type: 10,
      /*是否打开上传图片*/
      isUpload: false,
      /*订单商品id*/
      orderProductId: 0,
      /*订单商品*/
      product: {},
      images: [],
      /*小程序订阅消息*/
      temlIds: [],
      url: '',
      btnAtrrpx: {},
      form: {},
    }
  },
  onLoad(e) {
    
     console.log("============")
     console.log(e)
    this.orderProductId = e.orderProductld
  },
  mounted() {
    /*获取订单详情*/
    this.getData()
    if (this.isWeixin()) {
      this.url = window.location.href
      this.getBtnInfo()
      this.getTemplateId()
    }
  },
  methods: {
    subscribeSuccess() {
      this.formSubmit()
      console.log('调用成功')
    },
    subscribeFail() {
      this.formSubmit()
      console.log('调用失败')
    },
    getBtnInfo() {
      let self = this
      let btnAtrrpx = {
        width: 130,
        height: 70,
        paddingLeft: 28,
        fontSize: 28,
      }
      uni.getSystemInfo({
        success: function (res) {
          let scale = res.screenWidth / 750
          let newObj = {}
          for (let key in btnAtrrpx) {
            newObj[key] = btnAtrrpx[key] * scale
          }
          self.btnAtrrpx = newObj
        },
        fail() {
          self.btnAtrrpx = btnAtrrpx
        },
      })
    },
    getTemplateId() {
      let self = this
      self._postBody(
        'index/getSignPackage',
        {
          url: self.url,
          paySource: self.getPlatform(),
        },
        function (res) {
          // self.temlIds = res.data.templateArr;
          self.mpMessage(res.data.signPackage)
        }
      )
    },
    jumpToPage(type){
      this.gotoPage('/pages/order/refund/apply/applyDetail'+'?type='+type+'&orderProductId='+this.orderProductId)
    },
    /*获取数据*/
    getData() {
      let self = this
      uni.showLoading({
        title: '加载中',
      })
      let orderProductId = self.orderProductId

     console.log(orderProductId)


      self._get(
        'user/refund/toApply',
        {
          orderProductId: orderProductId,
          platform: "android",
        },
        function (res) {

           console.log("==退款===")
           console.log(res)

          


          self.product = res.data.Apply
          self.temlIds = res.data.templateArr

          //仅退款的时候不会显示选项-只支持退款-type=30
          if (self.product.orderM.deliveryType == 30) {
            self.type = 30
          }

          //只支持换货-type=20
          if (self.product.afterSaleType == 1) {
            self.type = 20
          }

          uni.hideLoading()


        }

      )



    },
    /*切换服务类型*/
    tabType(e) {
      this.type = e
    },

    /*提交表单*/
    formSubmit: function (e) {
      let self = this
      var formdata = self.form
      formdata.type = self.type
      formdata.orderProductId = self.orderProductId
      formdata.images = self.images

      
      let callback = function () {
        uni.showLoading({
          title: '正在提交',
          mask: true,
        })
        self._postBody('user/refund/apply', formdata, function (res) {
          uni.hideLoading()
          uni.showToast({
            title: res.msg,
            duration: 3000,
            complete: function () {
              self.gotoPage('/pages/order/refund/index/index')
            },
          })
        })
      }
      self.subMessage(self.temlIds, callback)
    },

    /*打开上传图片*/
    openUpload() {
      this.isUpload = true
    },

    /*获取上传的图片*/
    getImgsFunc(e) {
      let self = this
      self.isUpload = false
      if (e && typeof e != 'undefined') {
        let this_length = self.images.length,
          upload_length = e.length
        if (this_length + upload_length < 7) {
          self.images = self.images.concat(e)
        } else {
          let leng = 6 - this_length
          for (let i = 0; i < leng; i++) {
            self.images.push(e[i])
          }
        }
      }
    },

    /*删除图片*/
    deleteFunc(e) {
      this.images.splice(e, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.button_line {
  .btn {
    &:not(:first-child) {
      margin-left: 20rpx;
    }
    background: #ffffff;
  }
}

.sure_btn{
    background-color: black;
    color: #ffffff;
    border-radius: 10rpx;
}
.refundTitle{
  font-family: Source Han Sans CN, Source Han Sans CN;
  font-weight: 500;
  font-size: 32rpx;
  color: #000000;
  line-height: 44rpx;
  text-align: left;
  font-style: normal;
  text-transform: none;
}
.one-product {
  margin: 24rpx;
  padding: 44rpx;
  border-radius: 24rpx;
  padding-bottom: 44rpx;
  

}
.cover{
  height:200rpx;
}
.pro-info2{
  width: 292rpx;
  height: 42rpx;
  font-family: Hiragino Sans GB, Hiragino Sans GB;
  font-weight: normal;
  font-size: 28rpx;
  color: #000000;
  line-height: 41rpx;
  text-align: left;
  font-style: normal;
  text-transform: none;
  white-space: nowrap;      /* 确保文本在一行内显示 */
  overflow: hidden;         /* 超出容器部分隐藏 */
  text-overflow: ellipsis;  /* 使用省略号表示被截断的文本 */
}
.refundImg{
  
}
.iconRefund{
  width: 48rpx;
height: 48rpx;
}
.iconImg{
  position: absolute;
  width: 32rpx;
  height: 32rpx;
  margin-top:4rpx;
  right: 28rpx;
}

</style>
