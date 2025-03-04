<template>
  <view class="category-wrap">
    <view class="home-fixed">
      <view class="head_top" :style="'height:' + topBarTop() + 'px;'"></view>
      <view class="head" txt="头部搜索">
        <view class="head-mian">
          <text class="head-mian-logo"><image src="/static/nh.png" mode=""/></text>
          <!-- <view class="login-logo-img"><image src="/static/nh.png" mode=""/> </view> -->
          <text class="head-border"></text>
          <text class="head-txt" @click="showSearch = true"> 海外甄选  正品保证 乐享生活</text>
          <!-- <view class="search" @click="showSearch = true">
            <image src="/static/home/search.png"></image>
            <view class="flex-1 ml10 f20 gray9 search-input"> 海外甄选 正品保证 售后无忧</view>
          </view> -->
        </view>
        <image class="head-search" src="/static/home/search2.png" @click="showSearch = true"></image>
      </view>
      <scroll-view style="display: flex; white-space:nowrap;" scroll-x class="category-nav-box" txt="分类">
        <view v-for="(item, index) in list" :key="index" style="display: inline-block;">
          <view style="width: 120rpx;" class="category-nav" :class="navActive === index ? 'nav-active' : ''"
            @click="navClass(index, item.categoryId)">
            {{ item.name }}
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="scroll-good-box">
      <scroll-view scroll-y class="goods" @scrolltolower="scrolltolower">
        <view class="goods-box">
          <template v-for="(item, key) in goodsList" :key="key">
            <goodsLine :pargoodsList="item" @custom-event="receiveFromChild"></goodsLine>
          </template>
        </view>
      </scroll-view>
    </view>
    <tabBar @get-footer-height="getFooterHeigth"></tabBar>
    <searchProduct :isShow='showSearch' @close="closeSearch">
    </searchProduct>

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
import goodsLine from '@/pages/component/goodsLine.vue';
import searchProduct from '@/components/searchProduct.vue'
export default {
  components: {
    goodsLine,
    searchProduct,
    spec
  },
  data() {
    return {
      leftValue:'0rpx',
      currentTab:'分类',
      loading: true,
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
      startX: '', // 触摸起始点横坐标
      			deltaX:'',
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
	this.getTabBarLinks();
  },
  mounted() {
    this.init();

    this.gettitle()

  },
  computed: {

  },
  onShareAppMessage() {

  },
  methods: {
    touchStart(event) {
				// 记录触摸起始点的横坐标
				this.startX = event.touches[0].clientX;
				},
				touchMove(event) {
				// 计算滑动距离
				const currentX = event.touches[0].clientX;
				this.deltaX = currentX - this.startX;
				},
				touchEnd() {
			// 判断滑动方向
				if (this.deltaX > 50) {
					// 向右滑动逻辑   这里只建议写一些性能消耗小的逻辑，比如：this.status = !this.status 因为当他的横坐标大于或小于50时，每隔一个数字都会执行一次，所以...非常消化性能
					console.log('向右滑动逻辑',this.deltaX,this.startX)
				} else if (this.deltaX < -50) {
					// 向左滑动逻辑   这里只建议写一些性能消耗小的逻辑，比如：this.status = !this.status 因为当他的横坐标大于或小于50时，每隔一个数字都会执行一次，所以...非常消化性能
					console.log('向左滑动逻辑',this.deltaX)
          this.leftValue = this.deltaX+'rpx';
          console.log(this.leftValue,this.leftValue,'this.leftValue')
				}
				this.startX = 0;
				this.deltaX = 0;
				// 清除触摸起始点记录，这里也可以写一些比较复杂的逻辑，每滑动一次松后执行。
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
    gettitle() { //获取标题
      let self = this
      self._get(
        '/product/category/index',
        { area: self.area },
        function (res) {
          //console.log("====biaotou=")
          console.log(res)
          if (res.code === 1) {
            self.list = res.data.list
            self.list.unshift({
              name: '全部类型',
              categoryId: 0,
            })
          }
          self.getclassgoodslist()
        })
    },
    getclassgoodslist(isLoadMore = false) { //获取商品
      let self = this
      let nextPageIndex = isLoadMore ? this.pageIndex + 1 : 1; // 如果是加载更多，页码加一
      let productIdList = []
      for(let i = 0; i < self.goodsList.length; i++){
          productIdList.push(self.goodsList[i].productId)
      }
      self._postBody(
        '/product/product/lists',
        { search: this.form.keyWord, pageIndex: nextPageIndex, pageSize: 10, categoryId: self.categoryId,productIdList:productIdList },
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
  background: #F7F8FA;
}
.scroll-good-box {
  height: 100%;

  // background: #faa3a3;
  .goods {
    height:100%;
    // background: #f6f897;
  //  padding-top: 700rpx;
  }

  .goods-box {
    display: flex;
    flex-wrap: wrap;
  }
}
.category-wrap {
  background-color: #fff;

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
  height: calc(100vh - 208rpx);
  padding-top: 7.4rem;
  .goods{
    height: calc(100vh - 208rpx);

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
