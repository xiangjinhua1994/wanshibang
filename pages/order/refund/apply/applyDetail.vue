<template>
    <view class="refund-apply pb100">
      <view style="position:fixed;top:0;background-color: #fff;z-index:9999">
  		<view class="head_top" :style="'height:' + topBarTop() + 'px;'" style="background-color: #fff;"></view>
      <headTitle title="申请退款" bg="#fff">
            
      </headTitle>
    </view>
      <form @reset="formReset">
        <view class="one-product d-s-c bg-white " style="margin-top: 180rpx;">
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
        <!-- <view class="one-product bg-white">
          <view class="">
            <view class="refundTitle" style="margin-left: 0rpx;">{{'选择类型'}}</view>
          </view>
          <view class="" >
            <view class=" p-0-0 f28 " style="display: flex;padding-top:48rpx">
              <view class="iconRefund"><image class="iconRefund" src="/static/icon/refund.png"
                mode="aspectFit"></image></view>
              <view style="line-height: 50rpx;margin-left:24rpx"> 我要退款(无需退货)
              </view>
              <view class="iconImg"><image class="iconImg" src="/static/icon/iconArrow.png"
                mode="aspectFit"></image></view>
  
            </view>
            <view class=" p-0-0 f28" style="display: flex;padding-top:40rpx">
              <view class="iconRefund"><image class="iconRefund" src="/static/icon/refund2.png"
                mode="aspectFit"></image></view>
              <view style="line-height: 50rpx;margin-left:24rpx"> 我要退货退款
              </view>
              <view class="iconImg"><image class="iconImg" src="/static/icon/iconArrow.png"
                mode="aspectFit"></image></view>
            </view>
          </view>
        </view> -->
        <view class="group bg-white one-product"
              v-if="type==10 || type==30">
          <view class="">
            <view class="" style="display: flex;">
              <text class="min-name f28">申请类型</text>
              <text class="iconContent f28">{{ type==10? '我要退货退款':'我要退款'}}</text>
              <text class=" f28">
                <image class="iconImg" src="/static/icon/iconArrow.png"
                   mode="aspectFit" style="padding-bottom:44rpx"></image>
              </text>
            </view>
          </view>
          <view class="group-md">
            <view style="display: flex;justify-content:space-between" @click="openPopup">
              <text class="min-name f28">货物状态 <text style="color:red">*</text> </text>
              <text class="iconContent f28" style="" v-if="radioValue==10">{{'未收到货'}}</text>
              <text class="iconContent f28" style="" v-else-if="radioValue==20">{{'已收到货'}}</text>
              <text class="iconContent f28" style="color:#999" v-else>{{'请选择'}}</text>

              <text class=" f28">
                <image class="iconImg" src="/static/icon/iconArrow.png"
                   mode="aspectFit" style="padding-bottom:44rpx"></image>
              </text>
            </view>
          </view>
          <view class="group-md">
            <view style="display: flex;justify-content:space-between" @click="openPopup2">
              <text class="min-name f28">退款原因 <text style="color:red">*</text> </text>

              <text class="iconContent f28" style="" v-if="radioValueReason==1">{{'订单信息拍错（规格/尺码/颜色等）'}}</text>
              <text class="iconContent f28" style="" v-else-if="radioValueReason==2">{{'我不想要了'}}</text>
              <text class="iconContent f28" style="" v-else-if="radioValueReason==3">{{'地址/电话信息填写错误'}}</text>
              <text class="iconContent f28" style="" v-else-if="radioValueReason==4">{{'没用/少用优惠'}}</text>
              <text class="iconContent f28" style="" v-else-if="radioValueReason==5">{{'发货速度不满意'}}</text>
              <text class="iconContent f28" style="" v-else-if="radioValueReason==6">{{'拍多了'}}</text>
              <text class="iconContent f28" style="color:#999" v-else>{{'请选择'}}</text>

              <text class=" f28">
                <image class="iconImg" src="/static/icon/iconArrow.png"
                   mode="aspectFit" style="padding-bottom:44rpx"></image>
              </text>
            </view>
          </view>
          <view class="group-md">
            <view style="">
              <text class="min-name f28">商品数量 <text style="color:red">*</text> </text>
              <!-- <text class="iconContent f28" style="color:#999">{{'请选择'}}</text> -->
              <!-- <text class=" f28">
                <image class="iconImg" src="/static/icon/iconArrow.png"
                   mode="aspectFit" style="padding-bottom:44rpx"></image>
              </text> -->
              <view class="shop-num" style="padding:2rpx;position:absolute;right:60rpx; border: 1rpx solid red;display:flex;justify-content:space-between;align-items:center;width: 120rpx;height: 40rpx;margin-top: -40rpx;margin-left: 200rpx;
              
              border-radius:28rpx;border: 1rpx solid #CDCDCD;">
                <view class="lose">
                  <text style="font-size: 24rpx;margin-left:10rpx;" class=" iconfont icon-jian" 
                    ></text>
                </view>
                <view class="num" style="margin-top:0rpx;">
                  <!-- {{product.totalNum}} -->
                  {{ Total }}
                </view>
                <view class="plus">
                  <text style="font-size: 24rpx;margin-right:10rpx;" class=" iconfont icon-jia"
           ></text>
                </view>
              </view>
            </view>
          </view>
          <view class="group-md">
            <view style="display: flex;justify-content:space-between">
              <text class="min-name f28">申请金额 <text style="color:red">*</text> </text>
              <text class="iconContent f32 bold" style="color:#000">{{ product.totalAmount }}</text>
              <text class=" f28">
                
              </text>
            </view>
            <view style="color:#999;font-size:28rpx">
              不可修改，最多¥{{ product.totalAmount }} ，含发货运费￥{{ product.expressPrice }}
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
        <view class="group bg-white one-product">
          <view class="">
            <view class="left">
              <text class="min-name">申请说明</text>
            </view>
          </view>
          <view class="d-s-c" style="margin-top:28rpx;">
            <textarea style="background-color: #F9F9F9;border-radius: 20rpx" class="p20 box-s-b flex-1 f28 lh150"
                      v-model="form.content"
                      placeholder="补充描述，有助于商家更好的处理问题" placeholder-style="font-size:28rpx;color:#999999;"/>
          </view>
        </view>
        
  
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
        <view v-if="type==10" class="group bg-white" style="border-radius: 24rpx;padding-bottom:52rpx;margin:24rpx">
          <view class="group-hd">
            <view class="left">
              <text class="min-name">上传凭证</text>
              <!-- <text class="gray9">(最多6张)</text> -->
            </view>
          </view>
          <view class="upload-list d-s-c">
            
            <view style="width: 133rpx;height:133rpx;border-radius:11rpx" class="item d-c-c d-stretch"
                  v-if="images.length<4">
              <view class="upload-btn d-c-c d-c flex-1"
                    @click="openUpload()">
                <text class="icon iconfont icon-xiangji f34"></text>
                <text class="gray9">上传凭证</text>
                <text class="gray9">最多4张</text>
              </view>
            </view>
            <view style="position:relative; width: 133rpx;height:133rpx;border-radius:11rpx" class="item"
                  v-for="(imgs,img_num) in images"
                  :key="img_num"
                 >
                  <view class="" style="position: absolute;right: -10rpx;top: -20rpx;z-index:1000"  @click="deleteFunc(img_num)">
                    <image style="width: 30rpx;height:30rpx;" class="no_add" src="/static/del2.png" mode="aspectFill"></image>
                  </view>

              <image style="width: 133rpx;height:133rpx;border-radius:11rpx" :src="imgs.filePath"
                     mode="aspectFit"></image>
            </view>
          </view>
        </view>
        <view style="padding: 40rpx;">
          <button class="sure_btn"
                  @click="formSubmit">确认提交</button>
        </view>
  
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
      <uiPopup v-if="confirmBoxOrder">
        <view class="confirm-box">
          <view class="confirm-box-title"> 删除提示 </view>
          <view class="confirm-box-describe"> 确认删除商品吗? </view>
          <view class="confirm-box-btn" slot="btnBox">
            <view class="ui-btn btn-more btn-width" @click="closeOrder">取消</view>
            <view class="ui-btn btn-more btn-width btn-black" @click="close_delectOrder">确认</view>
          </view>
        </view>
      </uiPopup>
      <view class="popup-bg" v-if="showFixed"></view>
      <view class="fixed-bottom main" v-if="showFixed" >
        <view class="titleCon">货物状态 </view>
        <view class="close-icon iconfont icon-guanbi1 titleConClose" @click="close"></view>
        

        <view class="radio d-s-c radio-ui" style="display: flex;justify-content: space-between;margin-top:50rpx;margin-left:48rpx;border-bottom:1rpx solid #ccc;padding-bottom:30rpx;" v-if="product.deliveryStatus!=10">
          <text class="titleContent f28">已收到货</text>
          <radio style="transform:scale(0.7);margin-right:24rpx"  color="#000" @click="radioChange(20)"   :checked="radioValue==20"
            />
            

        </view>
        <view class="radio d-s-c radio-ui" style="display: flex;margin-top:24rpx;justify-content: space-between;margin-left:48rpx">
          <text class="titleContent f28">未收到货</text>
          <radio style="transform:scale(0.7);margin-right:24rpx"   color="#000" @click="radioChange(10)"   :checked="radioValue==10"
            />
        </view>
        <view style="padding: 40rpx;">
          <button class="sure_btn"
                  @click="chooseSubmit">确认</button>
        </view>
      </view>
      <view class="popup-bg" v-if="showFixedReason"></view>
      <view class="fixed-bottom" v-if="showFixedReason">
        <view class="titleCon">退款原因 </view>
        <view class="close-icon iconfont icon-guanbi1 titleConClose" @click="closeReason"></view>
        

        <view class="radio d-s-c radio-ui" style="display: flex;justify-content: space-between;margin-top:50rpx;margin-left:48rpx;border-bottom:1rpx solid #dcdcdc;padding-bottom:30rpx;">
          <text class="titleContent f28">订单信息拍错（规格/尺码/颜色等）</text>
          <radio style="transform:scale(0.7);margin-right:24rpx"  color="#000" @click="radioChangeRea(1)"   :checked="radioValueReason==1"
            />
            

        </view>
        <view class="radio d-s-c radio-ui" style="display: flex;margin-top:24rpx;justify-content: space-between;margin-left:48rpx;border-bottom:1rpx solid #dcdcdc;padding-bottom:30rpx;">
          <text class="titleContent f28">我不想要了</text>
          <radio style="transform:scale(0.7);margin-right:24rpx"   color="#000" @click="radioChangeRea(2)"   :checked="radioValueReason==2"
            />
        </view>
        <view class="radio d-s-c radio-ui" style="display: flex;margin-top:24rpx;justify-content: space-between;margin-left:48rpx;border-bottom:1rpx solid #dcdcdc;padding-bottom:30rpx;">
          <text class="titleContent f28">地址/电话信息填写错误</text>
          <radio style="transform:scale(0.7);margin-right:24rpx"   color="#000" @click="radioChangeRea(3)"   :checked="radioValueReason==3"
            />
        </view>
        <view class="radio d-s-c radio-ui" style="display: flex;margin-top:24rpx;justify-content: space-between;margin-left:48rpx;border-bottom:1rpx solid #dcdcdc;padding-bottom:30rpx;">
          <text class="titleContent f28">没用/少用优惠</text>
          <radio style="transform:scale(0.7);margin-right:24rpx"   color="#000" @click="radioChangeRea(4)"   :checked="radioValueReason==4"
            />
        </view>
        <view class="radio d-s-c radio-ui" style="display: flex;margin-top:24rpx;justify-content: space-between;margin-left:48rpx;border-bottom:1rpx solid #dcdcdc;padding-bottom:30rpx;">
          <text class="titleContent f28">发货速度不满意</text>
          <radio style="transform:scale(0.7);margin-right:24rpx"   color="#000" @click="radioChangeRea(5)"   :checked="radioValueReason==5"
            />
        </view>
        <view class="radio d-s-c radio-ui" style="display: flex;margin-top:24rpx;justify-content: space-between;margin-left:48rpx;border-bottom:1rpx solid #dcdcdc;padding-bottom:30rpx;">
          <text class="titleContent f28">拍多了</text>
          <radio style="transform:scale(0.7);margin-right:24rpx"   color="#000" @click="radioChangeRea(6)"   :checked="radioValueReason==6"
            />
        </view>
        <view style="padding: 40rpx;">
          <button class="sure_btn"
                  @click="chooseSubmitReason">确认</button>
        </view>
      </view>
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
        type: 30, //30只退款 10退款退货
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
        confirmBoxOrder:false,
        showFixed:false,
        radioValue:null,
        showFixedReason:false,
        radioValueReason:null,
        rebackPrice:'',
        arrStr:['订单信息拍错（规格/尺码/颜色等）','我不想要了','地址/电话信息填写错误','没用/少用优惠','发货速度不满意','拍多了'],
        Total:0,
      }
    },
    onLoad(e) {
      
       console.log("============")
       console.log(e)
      this.orderProductId = e.orderProductId;
      this.type = e.type;

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
      
      close(){
        this.showFixed = false;
      },
      closeReason(){
        this.showFixedReason = false;
      },
      chooseSubmit(){
        if(this.radioValue==null){
          uni.showToast({
            title: '请选择货物状态',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        this.showFixed = false;
      },
      openPopup(){
        this.showFixed = true;
      },
      chooseSubmitReason(){
        console.log('3333')
        if(this.radioValueReason==null){
          uni.showToast({
            title: '请选择退款原因',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        this.showFixedReason = false;
      },
      openPopup2(){
        this.showFixedReason = true;
      },
      radioChange(item){
        this.radioValue = item;
        console.log(item,'item')
       
      },
      radioChangeRea(item){
        this.radioValueReason = item;
        console.log(item,'item')
       
      },
      radioChange2(item){
        this.radioValueReason = item;       
      },
      //商品数量减
			reduce(item) {
				if (this.Total > 1) {
          this.Total = this.Total -1;
					// this.$emit('reduceFunc', item)
				}
        console.log(item,'item')
        this.getApplyMoney();
			},
			// 商品数量加
			plus(item) {
        console.log("item", item)
				if (this.Total  < item.effectiveProductNumber) {
					// item.productNum++
          this.Total++
					// this.$emit('addFunc', item)
				}
        this.getApplyMoney();
			},
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
      // 计算金额
      getApplyMoney() {
        let self = this
        self._get(
          'user/refund/computeAmount',
          {
            orderProductId: self.orderProductId,
            number:self.Total,
            platform: "android",
          },
          function (res) {

            self.rebackPrice = res.data.effectiveProductPrice;
  
          }
  
        )
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
            self.rebackPrice = self.product.effectiveProductPrice
            self.Total =self.product.effectiveProductNumber
            //仅退款的时候不会显示选项-只支持退款-type=30
            // if (self.product.orderM.deliveryType == 30) {
            //   self.type = 30
            // }
  
            // //只支持换货-type=20
            // if (self.product.afterSaleType == 1) {
            //   self.type = 20
            // }
  
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
        formdata.images = self.images;
        formdata.orderId = self.product.orderId;
        formdata.applyMoney =self.product.totalAmount;
        formdata.userReceipt =self.radioValue;
        // formdata.refundNumber =self.product.totalNum;
        formdata.refundNumber =self.Total;
        formdata.refundReason =self.arrStr[self.radioValueReason-1];
        if(!self.radioValue){
          uni.showToast({
            title: '请选择货物状态',
            icon: 'none',
            duration: 2000
          });
          return;
        }

        if(!self.radioValueReason){
          uni.showToast({
            title: '请选择退款原因',
            icon: 'none',
            duration: 2000
          });
          return;
        }


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
   .popup-bg {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;
  }
  .fixed-bottom{
    position: fixed;
    bottom: 0;
    left: 0;
    //border: 1rpx solid red;
    //min-height: 458rpx;
    z-index: 1000;
    background-color: #ffffff;
    border-top-left-radius: 24rpx;
    border-top-right-radius: 24rpx;
    .titleCon{
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: bold;
      font-size: 36rpx;
      color: #000000;
      line-height: 40rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
      margin-top:42rpx;
      .titleContent{
        font-family: Hiragino Sans GB, Hiragino Sans GB;
        font-weight: normal;
        font-size: 32rpx;
        color: #000000;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      
    }
    .titleConClose{
      position: absolute;
      right: 20rpx;
      top: 40rpx;
      width: 48rpx;
      height: 48rpx;
    }
  }
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
      height:96rpx;
      border-radius: 90rpx;
      line-height: 96rpx;
  }
  .sure_btn2{
    background-color: black;
    color: #ffffff;
    height:88rpx;
    border-radius: 44rpx;
    line-height: 88rpx;
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
    right: 48rpx;
  }
  .iconContent{
    position: absolute;
    right: 88rpx;
  }
  .group-md{
    margin-top: 40rpx;
  }
  .shop-price-num {
    display: flex;
    justify-content: space-between;

    .shop-price {
      color: #000;
      font-weight: bold;
      font-size: 36rpx;
      font-family: Roboto, Roboto;
    }

    .shop-num {
      display: flex;
      width: 402rpx;
      height: 50rpx;
      border-radius: 28rpx;
      border: 1rpx solid #f00;
      font-size: 28rpx;
      

      .lose {
        width: 52rpx;
        height: 52rpx;
        display: flex;
        border: 1rpx solid #f00;

        justify-content: center;
        align-items: center;
        // border-right: solid 2rpx #F5F5F5;
        font-family: Roboto, Roboto;
        font-weight: 300;
        font-size: 24rpx;
        color: #000000;
      }

      .num {
        width: 60rpx;
        height: 52rpx;
        text-align: center;
        line-height: 60rpx;
      }

      .plus {
        width: 52rpx;
        height: 52rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        // border-left: solid 2rpx #F5F5F5;
      }
      image {
        width: 30rpx;
        height:30rpx;
      }
    }
  }
  
  </style>
  