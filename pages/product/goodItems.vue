<template>
    <view class="category-wrap">
        <view class="head_top" :style="'height:' + topBarTop() + 'px;'"></view>
        <headTitle :title="titleName" bg="#fff">
          <!-- <view class="left-css" @click="pageSwitch(1)">
            <text class="iconfont iconfont-left icon-right_arrow"></text>
          </view> -->
        </headTitle>
        <scroll-view style="display: flex; white-space:nowrap;" scroll-x class="category-nav-box" txt="分类">
          <view v-for="(item, index) in list2" :key="index" style="display: inline-block;">
            <view style="width: 120rpx;" class="category-nav" :class="navActive === index ? 'nav-active' : ''"
              @click="navClass(index, item.categoryId)">
              {{ item.name }}
            </view>
          </view>
        </scroll-view>
      <view class="scroll-good-box">
        <scroll-view scroll-y class="goods" @scrolltolower="scrolltolower">
          <view class="goods-box">
            <template v-for="(item, key) in goodsList" :key="key">
              <goodsLine :pargoodsList="item" @custom-event="receiveFromChild"></goodsLine>
            </template>
          </view>
        </scroll-view>
      </view>
      <!-- <tabBar @get-footer-height="getFooterHeigth"></tabBar> -->
      <!-- <searchProduct :isShow='showSearch' @close="closeSearch">
      </searchProduct> -->
  
              <!--购物确定方便快捷购物用的-->
          <spec
          :isPopup="isPopup"
          :productModel="productModel"
          @close="closePopup"
        ></spec>
  
  
    </view>
  </template>
  
  <script>
  
  import spec from './detail/popup/spec.vue';
  import headTitle from '@/pages/component/headTitle.vue';
  import goodsLine from '@/pages/component/goodsLine2.vue';
  import searchProduct from '@/components/searchProduct.vue'
  export default {
    components: {
      headTitle,
      goodsLine,
      searchProduct,
      spec
    },
    data() {
      return {
        goodsItemsList:[],
        titleName:'',
        currentTab:'分类',
        loading: true,
        list2:[],
        list: [],// 头部选择框
        navActive: 0,
        showSearch: false,
        footerHeight: 0,
        categoryId: 0, // 分类id
        page: 1, // 页码
        pageSize: 10, // 每页条数
        form: {
          keyWord: "",
  
        },
        goodsList: [], // 商品列表
        pageIndex: 1, // 新增：用于跟踪当前页码
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
  
      };
    },
  
    onLoad() {
  
    },
    onShow() {
  
    },
    mounted() {
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
      this.init();
      this.getTitleName();
      this.gettitle();
      // this.promotionPage3();
    },
    computed: {
  
    },
    onShareAppMessage() {
  
    },
    methods: {
      promotionPage3() { //  图
      let self = this
      self._get(
        'index/homePage',
        { type: 'selectedGoodItems', appVersion: this.version_number},
        function (res) {
          if (res.code === 1) {
            self.goodsItemsList = res.data
          }
        })
    },
      getTitleName() { // banner 图
      let self = this
      self._get(
        'index/homePage',
        { type: 'selectedGoodItems' ,key:'titleName',appVersion: this.version_number},
        function (res) {
          if (res.code === 1) {
            self.titleName = res.data
          }
        })
    },
      gettitle() { //获取标题
      let self = this
      self._post(
        'product/product/activityCategoryVoList',
        { type: "selectedGoodItems" },
        function (res) {
          //console.log("====biaotou=")
          console.log(res)
          if (res.code === 1) {
            self.list2 = res.data
            self.list2.unshift({
              name: '全部类型',
              categoryId: 0,
            })
          }
          self.getclassgoodslist()
        })
    },
      onSwitchTab(index){
        console.log(index,'yuyiuy22');
        if(index==this.currentTab){
          return;
        }
        console.log(this.currentTab,'this.currentTab')
        this.currentTab = index;
        uni.switchTab({
          url: '/pages/product/category'
        })
        
      },
  
      scrolltolower(){
           console.log("滚动加载")
              this.getclassgoodslist(true)
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
  
  
  
  
      closeSearch() { // 关闭搜索
        this.showSearch = false
      },
      init() { },
      navClass(num, id) {
  
        // console.log("当前点击" + num )
        // 
        this.navActive = num
        this.goodsList = []
        this.categoryId = id
        this.getclassgoodslist()
      },
      getFooterHeigth(height) {
        this.footerHeight = height;
      },
      // gettitle() { //获取标题
      //   let self = this
      //   self._get(
      //     '/product/category/index',
      //     { area: self.area },
      //     function (res) {
      //       //console.log("====biaotou=")
      //       console.log(res)
      //       if (res.code === 1) {
      //         self.list = res.data.list
      //         self.list.unshift({
      //           name: '全部类型',
      //           categoryId: null,
      //         })
      //       }
      //       self.getclassgoodslist()
      //     })
      // },
      getclassgoodslist(isLoadMore = false) { //获取商品
        let self = this
        let nextPageIndex = isLoadMore ? this.pageIndex + 1 : 1; // 如果是加载更多，页码加一
        let productIdList = [];
        for(let i = 0; i < self.goodsList.length; i++){
          productIdList.push(self.goodsList[i].productId)
        }
        self._postBody(
          '/product/product/activityList',
          { pageIndex: nextPageIndex, pageSize: 20,type:'selectedGoodItems',appVersion: this.version_number ,categoryId: self.categoryId,productIdList:productIdList},
          function (res) {
            // console.log("获取商品列表====")
            // console.log(res)
            
            if (res.code === 1) {
              if (isLoadMore) {
                // 如果是加载更多，则追加新数据
                self.goodsList = self.goodsList.concat(res.data.records);
              } else {
                // 否则，替换现有数据
                self.goodsList = res.data.records;
              }
              self.pageIndex = nextPageIndex; // 更新当前页码
            }
          
          })
  
  
      },
  
  
  
  
    },
  };
  </script>
  
  <style lang="scss" scoped>
  @import '@/common/mixin.scss';
  .head_top {
    background: #fff;
  }
  .category-nav-box {
    width: 100%;
    background-color: #F7F8FA;
    white-space: nowrap;
  
    .category-nav {
      padding: 14rpx 30rpx 0rpx 30rpx;
      font-family: "Hiragino Sans GB, Hiragino Sans GB";
      display: inline-block;
      color: #252525;
      font-size: 24rpx;
      font-weight: 600;
      &:first-child .nav-active {
        border-radius: 0 16rpx 0 0;
      }
  
      &:last-of-type .nav-active{
        border-radius: 16rpx 0 0 0;
  
      }
      &.nav-active {
        background-color: #fff;
        font-family: Hiragino Sans GB, Hiragino Sans GB;
        font-weight: 700;
        font-size: 30rpx;
        border-radius: 12rpx 12rpx 0 0;
        text-align: center;
        //width:120rpx;
       // display: block;
        //padding-left:20rpx;
        //align-items: center;
        //justify-content: center;
        //align-content: center;
  
        &:after {
          content: '';
          display: block;
          width: 30px;
          border-bottom: 4rpx solid #252525;
          margin: 0 auto;
          margin-top: 24rpx;
        }
  
        
      }
    }
  
  }
  .scroll-good-box {
    height: calc(100vh - 100rpx - 100rpx);
    //padding-top: 60rpx;
    .goods{
      height: calc(100vh - 100rpx - 100rpx);
    
    }
    .goods-box {
      display: block;
      flex-wrap: wrap;
    }
  }
  .category-wrap {
    background-color: #F7F8FA;
  
  }
  
  .head {
    @include fl-between();
    height: 88rpx;
    padding: 0 40rpx 0 24rpx;
    background-color: #F7F8FA;
  
    .head-search {
      width: 40rpx;
      height: 40rpx;
    }
  
    .head-mian {
      @include fl-center;
      flex: 1;
      .head-mian-logo {
  
        font-family: PangMenZhengDao, PangMenZhengDao;
        font-weight: 600;
        font-size: 28rpx;
        color: #000000;
        image{
          width: 90rpx;
          height:60rpx;
        }
      }
  
    }
  
    .head-border {
      display: inline-block;
      border-left: 1rpx #333 solid;
      height: 20rpx;
      margin-left: 16rpx;
    }
  
    .head-txt {
      flex: 1;
      padding-left: 16rpx;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 14px;
      color: #424242;
    }
  }
  .home-fixed {
    position: fixed;
    top: 0;
    z-index: 2;
    width: 100vw;
  }
  .scroll-good-box{
   // height: calc(100vh - 208rpx);
    //padding-top: 7.4rem;
    .goods{
      //height: calc(100vh - 208rpx);
  
    }
  }
  .category-nav-box {
    width: 750rpx;
    background-color: #F7F8FA;
    white-space: nowrap;
  
    .category-nav {
      padding: 14rpx 30rpx 0rpx 30rpx;
      font-family: "Hiragino Sans GB, Hiragino Sans GB";
      display: inline-block;
      color: #252525;
      font-size: 24rpx;
      font-weight: 600;
      &:first-child .nav-active {
        border-radius: 0 16rpx 0 0;
      }
  
      &:last-of-type .nav-active{
        border-radius: 16rpx 0 0 0;
  
      }
      &.nav-active {
        background-color: #fff;
        font-family: Hiragino Sans GB, Hiragino Sans GB;
        font-weight: 700;
        font-size: 30rpx;
        border-radius: 12rpx 12rpx 0 0;
  
        &:after {
          content: '';
          display: block;
          width: 30px;
          border-bottom: 4rpx solid #252525;
          margin: 0 auto;
          margin-top: 24rpx;
        }
  
        
      }
    }
  
  }
  
  .search {
    flex: 1;
    border: 1rpx #fff solid;
    background-color: #fff;
    border-radius: 30rpx;
    padding: 10rpx;
    @include fl-center();
  
    image {
      width: 24rpx;
      height: 24rpx;
    }
  }
  </style>
  