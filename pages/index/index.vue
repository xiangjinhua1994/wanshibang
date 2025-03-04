<template>
  <view class="home">
    <view class="home-fixed" v-if="showText">
      <!-- 正在刷新 -->
    </view>
    <view class="scroll-good-box">
      <scroll-view scroll-y class="goods" @scrolltolower="scrolltolower" @scroll="scrollFn" refresher-enabled="true" :refresher-triggered="trigger" @refresherrefresh="refresherrefresh">
        <view class="uni-margin-wrap"></view>
        <view class="crumb" :class="is_crumb ? 'crumb-action' : ''">
          <view class="head_top" :style="'height:' + topBarTop() + 'px;'"></view>
          <view class="herd">
            <!-- <view class="location" @click="goPage('/pages/user/index/indexConfig')">
              <text class="iconfont icon-dizhi"></text>深圳
              
            </view> -->
            <view class="search" @click="showSearch = true" v-if="showSearchButton">
              <image src="/static/home/search.png"></image>
              <view class="flex-1 ml10 f24 gray9 search-input"> 输入你要的商品</view>
            </view>
          </view>
        </view>
        <swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
          :duration="duration">
          <swiper-item v-for="(item, key) in swiperList" :key=key>
            <view class="swiper-item uni-bg-red">
              <image :src="item.imgUrl" @click="goDetail(item.linkUrl)"></image>
            </view>
          </swiper-item>
        </swiper>
        <!-- {{ is_crumb }} -->
        <view class="label">
          <text>正品货源</text>
          <text>·</text>
          <text>精选品牌</text>
          <text>·</text>
          <text>乐享生活</text>
        </view>
        <view class="special">
          <view class="special-item" @click="domestic">
            <image src="/static/home/domestic.png"></image>
          </view>
          <view class="special-item" @click="overseas">
            <image src="/static/home/abroad.png"></image>
          </view>
        </view>

        <!-- <view ></view> -->
        <view class="promotion" @click="goDetail(promotionPagelist.linkUrl)">
          <image :src="promotionPagelist.imgUrl" mode="" />
        </view>
        <view class="promotion2" v-if="specialOfferShow&&goodsItemsShow">
          <view @click="goDetailPage(promotionPagelist2.linkUrl)" v-if="specialOfferShow">
            <image :src="promotionPagelist2.imgUrl" mode="" style="margin-right: 12rpx;"/>
          </view>
          <view style="position: relative;" @click="goDetailPage2(promotionPagelist3.linkUrl)" v-if="goodsItemsShow">
            <!-- <view class="chooseBest">{{ chooseBestName }}</view> -->
            <image :src="promotionPagelist3.imgUrl" mode="" style="height: 262rpx;position:relative;top:-1px" />
            <!-- <view style="position: absolute;z-index: 1;top:50rpx; left:11rpx;display: flex;"> -->
              <!-- <view style="margin-right: 18rpx;text-align: center;" v-for="(item,index) in goodsItemsList.slice(0,2)" :key="index">
                <image class="giftImg" :src="item.image" mode="" />
                <view class="red" style="font-weight: 700;color:#DC0D0D"><text>￥</text><text>{{item.productPrice}}</text> </view>
              </view>  -->
              <!-- <view style="text-align: center;">
                <image class="giftImg" src="/static/gift.png" mode="" />
                <view class="red" >￥<text>192</text> </view>
              </view>  -->
            <!-- </view> -->
          </view>
        </view>
        <!-- <view class="promotion3" v-if="!isFaxian&&goodsItemsShow">
         
          <view style="position: relative;" @click="goDetailPage2()">
            <view class="chooseBest">精选好物</view>
            <image src="/static/homeBg.png" mode="" />
            <view style="position: absolute;z-index: 1;top:50rpx; left:28rpx;display: flex;">
              <view style="margin-right: 18rpx;text-align: center;" v-for="(item,index) in goodsItemsList.slice(0,4)" :key="index">
                <image class="giftImg" :src="item.image" mode="" />
                <view class="red" style="font-weight: 700;color:#DC0D0D"><text>￥</text><text>{{item.productPrice}}</text> </view>
              </view> 
            </view>
          </view>
        </view> -->

        <view class="goods-box">
          <template v-for="(item, key) in list" :key="key">
            <goodsBlock :parentitem="item" @custom-event="receiveFromChild" bg="#fff"></goodsBlock>
          </template>
        </view>

      </scroll-view>
    </view>
    <!-- <tabBar></tabBar> -->
    <keep-alive>
			<tabBar></tabBar>
		</keep-alive>
    <searchProduct :isShow='showSearch' @close="closeSearch">
    </searchProduct>

    <!--购物确定方便快捷购物用的-->
    <spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec>
    <uiPopup v-if="versionShow" style="z-index: 8;">
      <view class="version-box">
        <view class="version-bg">
          <view class="version-num">
            {{versionInfo.versionAndroid}}
          </view>
        </view>
        <view class="version-text">
          <view class="version-title"> 更新说明 </view>
          <view class="version-describe">{{versionInfo.remark}}</view>
          <!-- <view class="version-describe">1.商城界面焕新升级，给你全新体验</view>
          <view class="version-describe">2.商城界面焕新升级，给你全新体验</view> -->
        </view>
        <view class="version-box-btn" >
          <view style="margin-right:40rpx" class="ui-btn btn-more btn-width" @click="exitApp()">取消</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="upgradingOpen()">确定</view>
        </view>
      </view>
    </uiPopup>
    <view class="upgrading" v-if="upgrading" style="z-index: 10;">
      <view class="upgrading-bottom">
        <view class="upgrading-left">
          <image src="/static/card.png" mode="" />
        </view>
        <view class="upgrading-main">
          <view class="upgrading-line1">后台高速升级中... {{percent}}%</view>
          <view class="upgrading-line2">即将自动安装 请勿中途退出App</view>
        </view>
        <view class="upgrading-right" @click="upgradingClose">
          <text class=" iconfont icon-guanbi"></text>
        </view>

      </view>
    </view>
  </view>
</template>

<script>

import spec from '../product/detail/popup/spec.vue';
import searchProduct from '@/components/searchProduct.vue'
import goodsBlock from '@/pages/component/goodsBlock.vue';
import uiPopup from '@/pages/component/ui-popup.vue';
import { mapState } from 'vuex';
export default {
  components: {
    searchProduct,
    goodsBlock,
    spec,
    uiPopup
  },
  data() {
    return {
      chooseBestName:'',
      goodsItemsShow:false,
      specialOfferShow:false,
      goodsItemsList:[],
      showSearchButton:true,
      currentTab:'首页',
      is_crumb: false,
      form: {
        keyWord: ''
      },
      showText:false,
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      showSearch: false, // 搜索弹窗
      swiperList: [], // banner 轮播图
      list: [], // 商品列表
      pageIndex: 1,// 当前页
      promotionPagelist: {},
      promotionPagelist2: {},
      promotionPagelist3: {},
      /*是否确定购买弹窗*/
      isPopup: false,
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
      time: '0',
      confirmBoxOrder: false,
      startTime: null,
      versionShow: false,
      upgrading: false,
      userdata:{},
      version_number:null,
      appType:1, //应用类型(1.安卓 2.ios)
      versionInfo:{},
      versionNew:'',
      percent:'',
      fileSize:'',
      trigger:false,
      isFaxian:false,
    }
  },
  watch: {

  },
  computed: {

  },
  onShow() {
	this.getTabBarLinks()
  },
  onLoad() {
    // const dcRichAlert = uni.requireNativePlugin('testc')
    // console.log(dcRichAlert,'dcRichAlert888')
    this.getData()
  },
  onLaunch(){
    //uni.hideTabBar();
  },
  onPullDownRefresh() {
    // if (this.thisindex == 0) {
    //   this.getData()
    // } else {
    //   this.toggleInit()
    //   this.getProduct()
    // }
    // this.getList(true); // 调用getList并告知是加载更多
    // uni.redirectTo({
    //   // 当前页面路由
    //   url: '/pages/index/index'
    // });
  },
  onReachBottom() {
    // console.log('到底了')
    // let self = this
    // if (self.page < self.last_page) {
    //   self.page++
    //   self.getProduct()
    // }
    // self.no_more = true
  },
  mounted() {
    this.getList()
     // 获取版本信息
     const systemInfo = uni.getSystemInfoSync();
    // this.version_number = systemInfo.appVersion;
    // console.log(this.version_number);
    // #ifdef H5
    this.version_number = systemInfo.appVersion;
    console.log(systemInfo.appVersion,'版本号');
    // #endif
    // #ifdef APP-PLUS
    this.version_number = systemInfo.appWgtVersion;
    console.log(systemInfo.appWgtVersion,'版本号');
    plus.runtime.getProperty(plus.runtime.appid, (info) => {
      console.log(info.version,'info.version')
            // this.currentVersion = info.version; // 将当下版本存到currentVersion字段中去
    })
    // #endif
    this.getTitleName()
    this.init()

  },

  methods: {
    getTitleName() { // banner 图
      let self = this
      self._get(
        'index/homePage',
        { type: 'selectedGoodItems' ,key:'titleName',appVersion: this.version_number},
        function (res) {
          if (res.code === 1) {
            self.chooseBestName = res.data
          }
        })
    },
    refresherrefresh() {
      // const query = uni.createSelectorQuery();
      // console.log(query,'query')
      // // query.select('.uni-scroll-view-refresh-inner').fields({ dataset: true }, data => {
      //   query.select('.uni-scroll-view-refresh-inner').boundingClientRect(data => {

      //   const element = data;
      //   console.log(element,'8098');
      //   if (element) {
      //     console.log(element,'8098');
      //     // 获取属性
      //     element.text = 'shuaxin1'
      //     element.value = 'shuaxin2'
      //     element.val = 'shuaxin3'
      //   }
      // }).exec();
        this.trigger = true;
        this.showSearchButton = false;
        this.showText = true;
        // this.doSomething(); // 调用你的方法
        this.getList(true); // 调用getList并告知是加载更多
        setTimeout(() => {
            this.trigger = false;
            this.showSearchButton = true;
            this.showText = false;
        }, 1000);
    //     uni.redirectTo({
    //   // 当前页面路由
    //   url: '/pages/index/index'
    // });
    console.log('刷新888')
    this.init()
    //this.getData()
    // this.$router.go(0)
    },
    upgradingClose() {
      this.upgrading = false
    },
    getData(){
				let self = this;
				self._get(
					'settings/getNewApkInfo',{appType:this.appType},
					function(res) {
						// self.shareConfig = res.data;
            self.versionInfo = res.data;
            self.fileSize = self.versionInfo.androidSize;
            console.log(res,'res978',self.version_number,self.versionInfo.versionAndroid,'678687909');
            if(self.version_number>=self.versionInfo.versionAndroid){
              self.versionNew = ''
            }else{
              self.versionNew = '有新的版本';
              self.versionShow = true;
              uni.hideTabBar();
            }
					}
				);
			},
      exitApp(){
        this.versionShow = false;
        // uni.showTabBar();
        // #ifdef APP-PLUS
        plus.runtime.quit();
        // #endif
      },
      upgradingOpen() {
      // let self = this;
      this.upgrading = true
      let _this = this;
			// this.$refs.popup.open('top')
      console.log(_this.versionInfo.pkgUrlAndroid,'self.versionInfo.pkgUrlAndroid',_this.fileSize)
      // uni.downloadFile({
      //   url: self.versionInfo.pkgUrlAndroid,
      //   filePath: 'uniapp/downloads/myapp.apk', // 存储路径
      //   showProgress: true, // 显示进度条
      //   success: function(res) {
      //     console.log('下载成功');
      //   },
      //   progress: function(e) {
      //     const percent = Math.round((e.progress * 100));
      //     console.log(`下载进度：${percent}%`);
      //     _this.percent = percent
      //   },
      //   fail: function(err) {
      //     console.error('下载失败', err);
      //   }
      // });

      var dtask = plus.downloader.createDownload(_this.versionInfo.pkgUrlAndroid, {}, function(d, status) {
              // 下载完成  
              if (status == 200) {
                      _this.show = false; // 下载完成再把下载进度弹框关闭即可
                      _this.upgrading = false;
                      plus.runtime.install(plus.io.convertLocalFileSystemURL(d
                              .filename), {}, {}, function(error) {
                              uni.showToast({
                                      title: '安装失败',
                                      duration: 1500
                              });
                      })
              } else {
                      uni.showToast({
                              title: '更新失败',
                              duration: 1500
                      });
              }
      });
      dtask.start(); // 下载任务开始下载
      // 关于进度的获取是使用定时器不断获取已经下载的文件的大小，再对比总大小即可
      let timer = setInterval(() => {
              let percent = (dtask.downloadedSize / this.fileSize).toFixed(2) // fileSize文件总大小，后端返回的
              _this.percent = Math.floor(percent * 100) // 转成整数展示
              if (percent >= 1) { // 注意百分比，及时清除定时器即可
                clearInterval(timer)
                _this.versionShow = false;
                uni.showTabBar();
              }
      }, 18)
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






    /*初始化*/
    init() {
      let self = this;
      this.getBanner()
      // this.getList()
      this.getProduct()
      this.promotionPage()
      this.promotionPage2()
      this.promotionPage3()

      self._postBody(
                    'user/index/index',
                     { source: self.getPlatform(), },
                     function (res) {
                       if (res.code == 1) {
                          //  self.isFaxian = res.data.faxian
                          self.isFaxian = res.data.faxian
                       } else {
                         console.error('数据加载失败:', res.message);
                         // self.loading = false;
                       }
                     }
                   );
    },
    search() {

    },
    closeSearch() { // 关闭搜索
      this.showSearch = false
    },
    /*跳转页面*/
    gotoPages(e) {
      this.gotoPage(e.linkUrl);
    },
    onRefresh() { },
    getBanner() { // banner 图
      let self = this
      self._get(
        'index/homePage',
        { type: 'banner' },
        function (res) {
          if (res.code === 1) {
            self.swiperList = res.data
          }
        })
    },
    checkHome(linkUrl) { // banner 图
      let self = this
      self._get(
        'index/checkHome',
        { type: 'specialOfferZone',appVersion: this.version_number },
        function (res) {
          if (res.code === 1) {
            console.log(res,'uoiuoiuoiiu')
            self.gotoPage('/'+linkUrl)
            // self.swiperList = res.data
          }
        })
    },
    promotionPage() { //  图
      let self = this
      self._get(
        'index/homePage',
        { type: 'activityRegion' },
        function (res) {
          if (res.code === 1) {
            self.promotionPagelist = res.data[0]
          }
        })
    },
    promotionPage2() { //  图
      let self = this
      self._get(
        'index/homePage',
        { type: 'specialOfferZone' ,appVersion: this.version_number},
        function (res) {
          if (res.code === 1) {
            if( res.data.length > 0){
              self.promotionPagelist2 = res.data[0]
              self.specialOfferShow = true;
            }else{
              self.specialOfferShow = false;
            }
          }
        })
    },
    promotionPage3() { //  图
      let self = this
      self._get(
        'index/homePage',
        { type: 'selectedGoodItems',appVersion: this.version_number },
        function (res) {
          if (res.code === 1) {
            if( res.data.length > 0){
              self.goodsItemsList = res.data;
              self.promotionPagelist3 = res.data[0]
              self.goodsItemsShow = true;
            }else{
              self.goodsItemsShow = false;
            }
          }
        })
    },


    getList(isLoadMore = false) { // 修改：添加默认参数isLoadMore
      let self = this;
      let nextPageIndex = isLoadMore ? this.pageIndex + 1 : 1; // 如果是加载更多，页码加一
      let arr = JSON.parse(JSON.stringify(self.list));
      let productIdList = [];
      for(let i = 0; i < self.list.length; i++){
        productIdList.push(self.list[i].productId)
      }

      self._postBody(
        'product/product/homeLists',
        { search: this.form.keyWord, pageIndex: nextPageIndex, pageSize: 10 ,productIdList:productIdList},
        function (res) {
          if (res.code === 1) {
            if (isLoadMore) {
              // 如果是加载更多，则追加新数据
              self.list = self.list.concat(res.data.records);
              // uni.stopPullDownRefresh();//停止刷新
            } else {
              // 否则，替换现有数据
              self.list = res.data.records;
            }
            self.pageIndex = nextPageIndex; // 更新当前页码
          }
        }
      );
    },
    scrolltolower() {
      this.getList(true); // 调用getList并告知是加载更多


    },
    scrollFn(e) {
      // console.info("e", e.detail.scrollTop)
      if (e.detail.scrollTop > 100 && this.is_crumb === false) {
        this.is_crumb = true
        uni.setNavigationBarColor({
          frontColor: '#ffffff',
          // backgroundColor: '#000000',
          animation: {
            duration: 400,
            timingFunc: 'easeIn'
          },
        })
      }
      if (e.detail.scrollTop < 100 && this.is_crumb === true) {
        this.is_crumb = false
        uni.setNavigationBarColor({
          frontColor: '#000000' ,
          // backgroundColor: '#ffffff',
          animation: {
            duration: 400,
            timingFunc: 'easeIn'
          },
        })
      }
    },
    getProduct() { // 获取数据

    },
    goDetail(linkUrl) {
      // let url = "/product/detail/detail?productId=" + linkUrl

      // conosole.log(url)
      this.gotoPage('/'+linkUrl)
    },
    goDetailPage(linkUrl){
      this.checkHome(linkUrl);
      // this.gotoPage('/'+linkUrl)
    },
    goDetailPage2(linkUrl){
      // this.gotoPage('/'+"pages/product/goodItems")
      this.gotoPage(linkUrl);
    },
    overseas() {
      this.gotoPage('/pages/product/overseas');
    },
    domestic() {
      this.gotoPage('/pages/product/domestic');
    },
    goPage(url) {
      this.gotoPage(url);
    },

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
::v-deep circle {
  color: #333333;
  font-size: 28rpx;
}
::v-deep svg {
  color: #333333;
  font-size: 28rpx;
}
::v-deep .uni-scroll-view-refresh__spinner>circle{
  border:'1px solid red';
  background-color: #000000;
  //display: none !important;
}
::v-deep .uni-page-refresh--refreshing{
  //display: none !important;

}
::v-deep .uni-page-refresh{
  //display: none !important;

}
.demo105-1::before {
  content: 'tips:';
  color: red;
}
::v-deep .uni-scroll-view-refresh-inner{
  //display: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
}
::v-deep .uni-scroll-view-refresh-inner::before{
  //display: none !important;
  //content: '刷新中';
  //color: #939393;
  //position: relative;
  //width:300px;
  //left: 60px;
  //background-image: url('../../static/fenxiang.png') no-repeat;
  //height:100px;
}
::v-deep .uni-scroll-view-refresh__spinner>circle{
  color:#939393 !important;
  //background-image: url('../../static/fenxiang.png') no-repeat;
  //display: none !important;

  }
  ::v-deep .uni-scroll-view-refresh-inner>svg {
  fill: #939393 !important;
  //display: none;
  }
  ::v-deep .uni-page-refresh{
    top:1000rpx;
  }
  /* 针对页面的下拉刷新样式 */
.uni-page-body {
  /* 隐藏默认的下拉刷新样式 */
  --uni-refresh-wrapper: none;
  border:1px solid red;
}
 
/* 自定义下拉刷新的样式，比如使用自己的图标 */
.uni-refresh {
  /* 定义你的图标样式 */
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px; /* 设置你的图标容器高度 */
  background-color: #fff; /* 设置背景色 */
}
 
.uni-refresh__content {
  //width: 50px; /* 设置你的图标宽度 */
  //height: 50px; /* 设置你的图标高度 */
  /* 这里可以使用背景图片或SVG作为你的下拉刷新图标 */
  //background-image: url('../../static/fenxiang.png');
  //background-size: cover;
}
.home {
  background: #f7f7f7;
  .home-fixed {
    position: fixed;
    //top: calc(100vh - 1000rpx);
    top: 35rpx;
    margin: 0 auto;
    color:#939393;
    left: 408rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index:1000;
  }

  .uni-margin-wrap {
    width: 100%;
    position: relative;
  }

  .crumb {
    position: fixed;
    top: 0;
    z-index: 2;
    width: 100vw;

    &.crumb-action {
      // transform: 0.3s;
      transition: transform 0.4s;
      background-color: #000;

      .location {
        color: #fff;

        .icon-dizhi {
          color: #fff;
        }
      }

    }
  }

  .herd {
    @include fl-between();
    width: 100%;
    height: 100rpx;
    padding: 10rpx 40rpx 20rpx 30rpx;
    z-index: 2;
    // background: #eee;
    box-sizing: border-box;

    .location {
      @include fl-center();
      width: 130rpx;
      padding-right: 16rpx;
      font-size: 32rpx;

      .icon-dizhi {
        margin-right: 8rpx;
        font-size: 40rpx;
        color: #000;
      }

      image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 20rpx;
      }
    }

    .search {
      flex: 1;
      border: 1rpx #fff solid;
      background-color: #fff;
      border-radius: 39rpx;
      padding: 19rpx;
      @include fl-center();

      image {
        width: 24rpx;
        height: 24rpx;
      }
    }
  }

  .swiper {
    height: 424rpx;
  }

  .swiper-item {
    display: block;
    height: 424rpx;
    line-height: 424rpx;
    text-align: center;

    image {
      width: 100%;
      height: 100%;
    }
  }
}

.head_top {
  background: transparent;
}

.scroll-good-box {
  height: calc(100vh - 100rpx);

  // background: #faa3a3;
  .goods {
    height: calc(100vh); // -700rpx
    // background: #f6f897;
    // padding-top: 700rpx;
    //border: 1rpx solid red;
  }

  .goods-box {
    display: flex;
    flex-wrap: wrap;
  }
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

    .goods-national {
      display: inline-block;
      width: 36rpx;
      height: 27rpx;

    }
  }

  .goods-labels {
    padding-top: 16rpx;

    .goods-labels-item {
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

    .goods-cat-img {
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

.promotion {
  width: 750rpx;
  // height: 280rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;

  // background: #ddd;
  image {
    width: 702rpx;
    height: 260rpx;
    border-radius: 8rpx;
  }
}
.promotion2 {
  display: flex;
  
  width: 750rpx;
  // height: 280rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;

  // background: #ddd;
  image {
    width: 346rpx;
    height: 260rpx;
    border-radius: 8rpx;
  }
  .chooseBest{
    padding-left: 20rpx;
    padding-top: 14rpx;
    font-family: Alimama DongFangDaKai, Alimama DongFangDaKai;
    font-weight: bold;
    font-size: 24rpx;
    color: #000000;
    line-height: 28rpx;
    text-align: center;
    font-style: normal;
    text-transform: none;
    position: absolute;
    z-index: 1;
  }
  .giftImg{
    //border: 1rpx solid #f00;
    width: 144rpx;
    height: 168rpx;
  }
}
.promotion3 {
  display: flex;
  
  width: 750rpx;
  // height: 280rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;

  // background: #ddd;
  image {
    width: 702rpx;
    height: 260rpx;
    border-radius: 8rpx;
  }
  .chooseBest{
    padding-left: 20rpx;
    padding-top: 14rpx;
    font-family: Alimama DongFangDaKai, Alimama DongFangDaKai;
    font-weight: bold;
    font-size: 24rpx;
    color: #000000;
    line-height: 28rpx;
    text-align: center;
    font-style: normal;
    text-transform: none;
    position: absolute;
    z-index: 1;
  }
  .giftImg{
    //border: 1rpx solid #f00;
    width: 144rpx;
    height: 168rpx;
  }
}


.label {
  font-size: 24rpx;
  color: #898888;
  text-align: center;
  padding: 8rpx;

  text {
    padding: 10rpx 20rpx
  }
}

.special {
  @include fl-between();
  // background: #afb6f8;
  width: 702rpx;
  padding-left: 24rpx;
  padding-right: 24rpx;

  .special-item {
    padding-bottom: 16rpx;
    padding-top: 0rpx;
    // width: 335rpx;
    text-align: center;

    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
    // align-items: center;
    image {
      width: 340rpx;
      height: 176rpx;
    }
  }
}
</style>
<style lang="scss" scoped>
@import '@/common/mixin.scss';
.set {
  background: #F7F8FA;
  min-height: 100vh;
  .icon-you {
    color:#252525;
  }
}

.set-info {
  @include fl-between;
  margin: 16rpx 28rpx 40rpx 28rpx;
  padding-right: 32rpx;
  .set-info-img {
    @include area(96rpx,96rpx);
    border-radius: 48rpx;
  }
  .set-info-text {
    flex: 1;
    padding-left: 30rpx;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 24rpx;
    color: #666666;
    font-style: normal;
    text-transform: none;
    .set-info-text1 {
      padding-bottom: 20rpx;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: bold;
      font-size: 28rpx;
      color: #353535;
      font-style: normal;
      text-transform: none;
    }
  }
}

.set-item {
  background: #FFFFFF;
  border-radius: 28rpx;
  margin: 16rpx 28rpx 40rpx 28rpx;
  padding: 20rpx 32rpx ;


  .set-attr {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    line-height: 60rpx;
    padding-bottom: 20rpx;

    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #252525;
    text-align: left;
    font-style: normal;
    text-transform: none;
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
      font-size: 28rpx;
      color: #000000;
      font-style: normal;
      text-transform: none;
      &.set-attr-val-liuyan {
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
    .set-attr-val-text {
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 28rpx;
      color: #8C8C8C;
      font-style: normal;
      text-transform: none;
      padding-right: 12rpx;
    }
  }
}
.set-foot {
  height: 120rpx;
  .set-foot-fixed {
    position: fixed;
    bottom: 40rpx;
    width: 750rpx;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20rpx;
    box-sizing: border-box;
    .btn-more{
      width: 100%;
      // margin-left: 0;
    }
  }
  .set-foot-fixed0 {
    position: fixed;
    bottom: 160rpx;
    width: 750rpx;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20rpx;
    box-sizing: border-box;
    .btn-more{
      width: 100%;
    }
  }

}
.version-box{
  .version-bg {
    width: 540rpx;

    height: 364rpx;
    background-image: url('/static/home/user/version-bg.png');
    background-size: 100% 100%;
    .version-num {
      padding-top: 166rpx ;
      padding-left: 44rpx ;
      color:#fff;
      font-size: 30rpx;
    }
  }
  .version-text {
    background-color: #fff;
    padding-left: 44rpx ;
    .version-title {
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: bold;
      font-size: 28rpx;
      color: #000000;
      font-style: normal;
      text-transform: none;
      padding-bottom: 10rpx;
    }
    .version-describe {
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 24rpx;
      color: #000000;
      text-align: left;
      font-style: normal;
      text-transform: none;
      line-height: 40rpx;
      width: 400rpx;
    }
  }
  .version-box-btn {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 36rpx;
    border-radius: 0 0 24rpx 24rpx;

  }
}
.upgrading{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 60rpx;
  background-color: rgba(0,0,0,0.5);
  .upgrading-bottom {
    @include fl-between;
    @include area(750rpx, 180rpx);
    position: fixed;
    bottom:80rpx;
    background: #fff;
    padding: 40rpx;
    box-sizing: border-box;
  }
  .upgrading-left {
    width: 100rpx;
    image {
      @include area(75rpx, 75rpx);
    }
  }
  .upgrading-main {
    flex: 1;
    .upgrading-line1 {
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: bold;
      font-size: 28rpx;
      color: #000000;
      font-style: normal;
      text-transform: none;
      padding-bottom: 12rpx;
    }
    .upgrading-line2 {
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 24rpx;
      color: #8C8C8C;
      font-style: normal;
      text-transform: none;
    }
  }
  .upgrading-right {
    display: inline-block;
    width: 40rpx;
    height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    background: #D9D9D9;
    border-radius: 40rpx;
    .iconfont{
      color:#fff;
      // font-size: 20rpx;
    }
  }
  .uni-page-refresh-inner{
    z-index: 1000;
  }
}
</style>