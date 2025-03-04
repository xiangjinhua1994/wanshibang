<template>

	<view class="overseas" >
    <view class="home-fixed">
      <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
      <view class="herd" txt="头部">
        <view class="location">
          <text class="iconfont icon-right_arrow" @click="goback"></text>
          <image src="/static/home/classify/overseas_txt.png"></image>
        </view>
        <view class="search" @click="showSearch=true">
            <image  src="/static/home/search.png" ></image>
            <view class="flex-1 ml10 f20 gray9 search-input"> 输入你要的商品</view>
        </view>
      </view>
      <scroll-view scroll-x="true" class="category-nav-box" txt="分类">
        <view v-for="(item, index) in list" :key="index" class="category-nav" :class="navActive === index ? 'nav-active' : ''"
        @click="navClass(item.categoryId, index)">
          {{ item.name }}
        </view>

      </scroll-view>
      <view class="diamond">
        <view v-for="(item, index) in firstChildren" :key="index" class="diamond-item" @click="childer_list(item.categoryId)">
          <image :src="item.imagePath" mode="" />
          <view>{{ item.name }}</view>
        </view>
      </view>
    </view>
    <view class="scroll-good-box">
      <view class="scroll_fa">
      <scroll-view scroll-y class="goods" @scrolltolower="scrolltolower">
        <!-- <view class="scroll_fa"> -->
        <view class="goods-box">
          <template v-for="(item, index) in goods_list" :key="index">
            <goodsBlock :bg="'#fff'" :parentitem="item"   @custom-event="receiveFromChild"   ></goodsBlock>
          </template>
        </view>
       <!-- </view> -->
      </scroll-view>
    </view>
    </view>
    <tabBar @get-footer-height="getFooterHeigth"></tabBar>
    <searchProduct
      :isShow='showSearch'
      @close="closeSearch">
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
import spec from '../product/detail/popup/spec.vue';
  import searchProduct from '@/components/searchProduct.vue'
  import TopNavBar from '@/components/topNavBar/topNavBar.vue';
  import goodsBlock from '@/pages/component/goodsBlock2.vue';
  export default {
    components: {
      searchProduct,
      TopNavBar,
      goodsBlock,
      spec
    },
    data() {
      return {
        pageIndex:1,
        loading: true,
        list: [], //  头部菜单栏
        navActive: 0,
        showSearch: false, // 搜索弹窗
        navActive: 0, // 当前点击
        area: 1, // 国际站
        categoryId: 0, //点击选中的商品ID
        firstChildren: [], // 二级类
        goods_list: [], //  商品列表
        form: {
          keyWord: '',
        },
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


      };
    },

    onLoad() {
      
    },
    onShow() {
      
    },
    mounted() {
      this.init();
      this.getinternational();
    

      
    },
    computed: {
      
    },
    onShareAppMessage() {
      
    },
    methods: {
      init() {},


  //   接受子组件穿过来的值
  receiveFromChild(data) {
      console.log("子组件传过来的值")
      console.log(data)


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
   
   console.log("geshihua")
    console.log(data)


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


		/*多规格商品*/
		initSpecData(data) {
   
   console.log("geshihua")
    console.log(data)


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



      getinternational() { // 获取国际馆title 表
      let self = this
      self._get(
        '/product/category/index',
        { area: self.area },
        function (res) {
          console.log("====biaotou=")
          console.log(res)
          if (res.code === 1) {
            self.list = res.data.list
            console.log(res.data.list)
            self.firstChildren = res.data.list[self.navActive].children
            self.categoryId = res.data.list[self.navActive].categoryId  // 赋值首次默认选中的id
            self.getgoods_list()
          }
        })
    },
    getgoods_list() {
      let self = this
      let productIdList = []
      for(let i = 0; i < self.goods_list.length; i++){
          productIdList.push(self.goods_list[i].productId)
      }
      self._postBody(
        '/product/product/lists',
        { search: this.form.keyWord, pageIndex: self.pageIndex, pageSize: 6, categoryId: self.categoryId, area: self.area,productIdList:productIdList },
        function (res) {
          if (res.code === 1) {
            self.goods_list = self.goods_list.concat(res.data.records); 
            //self.swiperList = res.data
          }
        })
    },

    childer_list(id) {
      this.pageIndex = 1
      this.goods_list = []
      this.categoryId = id
      this.getgoods_list()

    },
    navClass(categoryId, num) {
      // console.log("====二级的数据===")
      // console.log(categoryId)
      this.navActive = num
      this.categoryId = categoryId
      this.firstChildren = this.list[num].children
      this.pageIndex = 1
      this.goods_list = []
      this.getgoods_list()
    },
    scrolltolower() {
      let self = this;
      self.pageIndex++;
      self.getgoods_list();
      console.log("1", 1)
    },
      getFooterHeigth(height) {
        this.footerHeight = height;
      },
      closeSearch() { // 关闭搜索
        this.showSearch = false
      },
      goback() {
        uni.navigateBack();
      },
    },
  };
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.scroll_fa{
  //margin-top: 20rpx;
  //padding-top:2.8rem;
}
.overseas {
  position: relative; 
  height: 100vh;
  overflow: hidden;
  background:linear-gradient( #000, #111);
  &::before {
    content: "";  
    position: absolute;  
    top: 0;  
    left: 0;  
    right: 0;  
    bottom: 0;  

    background-image: url('/static/home/classify/overseas_bg.png');
    opacity: 0.2;
    background-size: 100% auto;
    background-position: 0 0, 0 0;
    background-blend-mode: luminosity;
    background-repeat: repeat-y;
    min-height: 100vh;
  }
}


.herd {
  @include fl-between();
  width: 100%;
  height: 80rpx;
  padding: 10rpx;
  z-index: 2;
  // background: #eee;
  box-sizing: border-box;
  .location {
    @include fl-center();
    width: 260rpx;
    .iconfont {
      color: #F0BB54;
      font-size: 48rpx;
      margin-right: 20rpx;
    }
    image {
      @include area(138rpx, 52rpx)
    }
  }
  .search {
    @include fl-center();
    flex: 1;
    border: 1rpx #fff solid;
    background-color: #fff ;
    border-radius: 40rpx;
    padding: 20rpx;
    font-size: 24rpx;
    image {
      width: 24rpx;
      height: 24rpx;
    }
  }
}
.home-fixed {
  position: relative;
  top: 0;
  z-index: 2;
  width: 100vw;
}
.scroll-good-box{
  //position: relative;
  height: calc(100vh - 390rpx);
  //border: 1rpx solid red;
 // padding-top: 10.5rem;
  .goods{
    height: calc(100vh - 390rpx);

  }
}
.diamond {
  display: flex;
  align-items: center;
  //margin: 16rpx 24rpx;
  margin: 16rpx 24rpx 20rpx 24rpx;
  background: #fff;
  padding: 24rpx 0 16rpx 0;
  border-radius: 4rpx;
  .diamond-item {
    // flex: 1;
    width:130rpx;
    text-align: center;
    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 24rpx;
    color: #000000;
    // color: #fff;
    image {
      @include area(80rpx, 80rpx);
      display: inline-block;
      margin: 0 auto;
      border-radius: 80rpx;
      margin-bottom: 12rpx;
    }
  }
}
.goods-box {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 30rpx;
}
.category-nav-box {
  width: 750rpx;
  // background-color: #F7F8FA;
  white-space: nowrap;
  .category-nav {
    padding: 14rpx 30rpx 0rpx 30rpx;
    display: inline-block;

    font-family: Hiragino Sans GB, Hiragino Sans GB;
    font-weight: normal;
    font-size: 28rpx;
    color: #FFFFFF;
    
    &.nav-active {
      // background-color: #fff;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 36rpx;
      color: #FFFFFF;
      font-style: normal;
      text-transform: none;
      // &:after  {
      //   content: '';
      //   display: block;
      //   width: 30px;
      //   border-bottom: 4rpx solid #252525;
      //   margin: 0 auto;
      //   margin-top: 24rpx;
      // }
      // &:first-child{
      //   border-radius: 0 16rpx 0 0;
      // }
      // &:last-of-type{
      //   border-radius:  16rpx 0 0 0;
      // }
    }
  }

}
</style>
