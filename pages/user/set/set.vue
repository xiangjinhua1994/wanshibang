<template>
	<view class="set">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle title="设置"></headTitle>
    <view class="set-detail">
      <view class="set-info">
        <image class="set-info-img" :src="userdata.avatarUrl" mode="" v-if="userdata.avatarUrl"/>
        <image class="set-info-img" src="/static/home/logo1.png" mode="" v-else/>
        <!-- <image class="set-info-img" src="/static/default.png" mode="" v-else/> -->
        <view class="set-info-text" @click="jumpPage('/pages/user/set/editNickName')">
          <view class="set-info-text1">{{userdata.nickName}}</view>
          <!-- <view>{{userdata.mobile}}</view> -->
          <view v-if="userdata.mobile">{{userdata.mobile.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")}}</view>
        </view>
        <text class="iconfont icon-you"></text>
      </view>
      <view class="set-item" txt="属性">
        <view class="set-attr set-attr-singe" >
          <text class="set-attr-key">收货地址</text>
          <view class="set-attr-val" @click="jumpPage('/pages/user/address/address')">
            <text class="iconfont icon-you"></text>
          </view>
        </view>
      </view>

      <view class="set-item" txt="属性">
        <view class="set-attr" @click="jumpPage('/pages/user/set/account')">
          <text class="set-attr-key">账户与安全</text>
          <view class="set-attr-val">
            <text class="iconfont icon-you"></text>
          </view>
        </view>
        <view class="set-attr">
          <text class="set-attr-key">支付设置</text>
          <view class="set-attr-val" @click="jumpPage('/pages/user/set/payment/paymentSet')">
            <text class="iconfont icon-you"></text>
          </view>
        </view>
        <view class="set-attr" >
          <text class="set-attr-key" >填写邀请码</text>
          <view class="set-attr-val" @click="jumpPage('/pages/user/set/invitationCode')">
            <text class="iconfont icon-you"></text>
          </view>
        </view>
        <view class="set-attr">
          <text class="set-attr-key">检查更新</text>
          <view class="set-attr-val" @click="versionShowFn(true)">
            <text class="set-attr-val-text">{{versionNew}}</text>
            <text class="iconfont icon-you"></text>
          </view>
        </view>
        <view class="set-attr">
          <text class="set-attr-key2">用户协议与隐私政策</text>
          <view class="set-attr-val" @click="jumpPage('/pages/privacy/privacy')">
            <text class="iconfont icon-you"></text>
          </view>
        </view>
        <view class="set-attr">
          <text class="set-attr-key"  >关于我们</text>
          <view class="set-attr-val" @click="jumpPage('/pages/user/set/about')">
            <text class="iconfont icon-you"></text>
          </view>
        </view>
        <view class="set-attr">
          <text class="set-attr-key"  >个性化推荐</text>
          <view class="set-attr-val">
            <switch @change="changeRecommend" :checked="changeRecommendBool" style="transform:scale(0.7)"/>
          </view>
        </view>
      </view>
      

    </view>
    <view class="set-foot">
      <!-- <view class="set-foot-fixed0">
        <view class="ui-btn btn-more btn-white"   @click="checkoutAccount">切换账号</view>
      </view> -->
      <view class="set-foot-fixed" v-if="userdata.nickName">
        <view class="ui-btn btn-more btn-white"   @click="outcoun">退出当前账号</view>
      </view>
    </view>
    
    <uiPopup v-if="versionShow">
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
          <view style="margin-right:40rpx" class="ui-btn btn-more btn-width" @click="versionShow = false">取消</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="upgradingOpen()">确定</view>
        </view>
      </view>
    </uiPopup>

    <uiPopup v-if="confirmBoxOrder">
      <view class="confirm-box">
        <view class="confirm-box-title" > 确定退出 </view>
        <view class="confirm-box-describe"> 删除后订单列表不再展示该订单，操作后不可恢复。 </view>
        <view class="confirm-box-btn" slot="btnBox">
          <view class="ui-btn btn-more btn-width" @click="closeOrder">我再想想</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="closeOrder">删除</view>
        </view>
      </view>
    </uiPopup>
    <view class="upgrading" v-if="upgrading">
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
import headTitle from '@/pages/component/headTitle.vue'
import uiPopup from '@/pages/component/ui-popup.vue'
export default {
	components: {
		headTitle,
    uiPopup
	},
	data() {
		return {
      time: '0',
      changeRecommendBool:true,
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
		};
	},
	computed: {
		
	},
	onLoad(e) {
		this.startTime = new Date().getTime()
	},
	mounted() {
		this.init();
    this.getUserInfo();
    console.log('当前环境：' + uni.getSystemInfoSync().platform); //如果是安卓才执行
    this.getData();
    // 获取版本信息
    const systemInfo = uni.getSystemInfoSync();
    // this.version_number = systemInfo.appVersion;
    // console.log(this.version_number);
    // #ifdef H5
    this.version_number = systemInfo.appVersion;
    console.log(systemInfo.appVersion,'版本号');
    // #endif
    // #ifdef APP
    this.version_number = systemInfo.appWgtVersion;
    console.log(systemInfo.appWgtVersion,'版本号');
    plus.runtime.getProperty(plus.runtime.appid, (info) => {
      console.log(info.version,'info.version')
            // this.currentVersion = info.version; // 将当下版本存到currentVersion字段中去
    })
    // #endif
	},
	onShow() {
    this.getuserinfo();
	},
	methods: {
    changeRecommend(e){
      let self = this;
      console.log(e.detail.value)
      let params = {
        updateType:'recommend',
        updateValue:e.detail.value?0:1
      }
      self._post('user/user/updateInfo', params, function (res) {
          uni.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000,
          });
			});
    },
    getData(){
				let self = this;
				self._get(
					'settings/getNewApkInfo',{appType:this.appType},
					function(res) {
						// self.shareConfig = res.data;
            self.versionInfo = res.data;
            self.fileSize = self.versionInfo.androidSize;
            //console.log(res,'res978',self.version_number,self.versionInfo.versionAndroid,'678687909');
            if(self.version_number>=self.versionInfo.versionAndroid){
              self.versionNew = ''
            }else{
              self.versionNew = '有新的版本'
            }
					}
				);
			},
      getuserinfo(){
          let self = this;
          self._get("user/user/getInfo", {}, function (res) {
              console.log("用户信息")
              console.log(res)
              if(res.code==1){
                  self.userdata = res.data;
                  uni.setStorageSync('uerinfo', res.data);
                  if(res.data.recommendSwitch==0){
                    self.changeRecommendBool = true;
                  }else{
                    self.changeRecommendBool = false;
                  }
              }
          }
        )
      },
      //安卓更新
      AndroidCheckUpdate() {
          const _this = this
          uni.showModal({
                  title: "版本更新",
                  content: 'APP有新版本发布，点击 立即更新 进行最新版本下载。',
                  confirmText: '立即更新',
                  cancelText: '稍后进行',
                  success: function(res) {
                          if (res.confirm) {
                                  _this.show = true // show变量控制一个下载进度弹框(这个UI样式自己写即可)
                                  // 创建一个下载任务，并根据后端返回的apk静态资源地址filePath进行下载
                                  var dtask = plus.downloader.createDownload(_this.filePath, {}, function(d, status) {
                                          // 下载完成  
                                          if (status == 200) {
                                                  _this.show = false // 下载完成再把下载进度弹框关闭即可
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
                                          _this.percentVal = Math.floor(percent * 100) // 转成整数展示
                                          if (percent >= 1) { // 注意百分比，及时清除定时器即可
                                                  clearInterval(timer)
                                          }
                                  }, 18)
                          } else if (res.cancel) {
                                  console.log('稍后更新');
                          }
                  }
          });
      },



    getUserInfo() {
      // 获取缓存中的用户信息
      const userInfo = uni.getStorageSync('uerinfo');
      
      if(userInfo) {
        // 成功获取到信息，可以进行后续处理
          this.userdata = userInfo;
        console.log("用户信息:",  this.userdata);
      } else {
        // 缓存中没有找到用户信息
        console.log("未找到用户信息");
      }
    },









    outcoun(){
      
       
      let url = '/pages/login/weblogin?appId=10001';
      this.gotoPage(url);
      
      uni.removeStorageSync('token');
      uni.removeStorageSync('userId');



    },
    checkoutAccount(){
      let url = '/pages/user/set/checkoutAccount?appId=10001';
      this.gotoPage(url);
    },
    
    init(){
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
              }
      }, 18)


		},
    upgradingClose() {
      this.upgrading = false
    },
    versionShowFn(bo) {
      // this.versionShow = bo
      if(this.versionNew){
        this.versionShow = true;
      }else{
        this.versionShow = false;
        uni.showToast({
            title: '已是最新版本',
            icon:'none',
            duration:2000
          });
      }
    },
    openOrder() {
      this.confirmBoxOrder = true
    },
    closeOrder() {
      this.confirmBoxOrder = false
    },
    jumpPage(path) { /*跳转页面*/
			this.gotoPage(path);
		},

    copy(message) {
      console.log("message",message)
      uni.setClipboardData({
        data: message,
        success: function (res) {
          uni.showToast({
            title: '复制成功',
            icon: 'success',
            mask:true,
            duration:2000
          });
        },
        fail:function(res){
          console.log("error",res)
        }
      });
    }

	},
};
</script>

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
    .set-attr-key2 {
      width: 320rpx;
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
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  .upgrading-bottom {
    @include fl-between;
    @include area(750rpx, 180rpx);
    position: fixed;
    bottom:0;
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
}
</style>
