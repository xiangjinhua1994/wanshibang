<template>
	<view class="invitationCode">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle title="填写邀请码"></headTitle>
    <view class="invitation">
      <view class="invitation-input">
        <input type="text" v-model="code" class="flex-1 ml10 f26 gray3"
          placeholder-class="f26 gray9" placeholder="请输入邀请码" confirm-type="search"
        />
        <view class="iconfont-box" @click="code = ''">
          <text class=" iconfont icon-guanbi"></text>
        </view>
      </view>
      <view
        class="ui-btn btn-more "
        :class="code.length === 0 ? 'btn-gray91' : 'btn-black'"
        @click="submit"
        >
        提交
      </view>
    </view>
	</view>
</template>

<script>
import headTitle from '@/pages/component/headTitle.vue'
export default {
	components: {
		headTitle,
	},
	data() {
		return {
      code: ''
		};
	},
	computed: {
		
	},
	onLoad(e) {
		
	},
	mounted() {
		this.init();
	},
	onShow() {
		
	},
	methods: {
    init(){
    },
    submit() {
      if(!this.code){
        // uni.showToast({
        //   title: '请输入邀请码',
        //   icon: 'error',
        //   duration: 2000,
        // });
        return;
      }
      let params = {
        updateType:'invitation',
        updateValue:this.code,
      }
      this.update(params);


    },
    jumpPage(path) { /*跳转页面*/
			this.gotoPage(path);
		},
    update(params) {
			let self = this;
			uni.showLoading({
				title: '加载中',
			});
			self.loading = true;
			self._post('user/user/updateInfo', params, function (res) {
				self.showSuccess(
					'修改成功',
					function () {
						uni.hideLoading();
					},
					function (err) {
						uni.hideLoading();
						self.loading = false;
					}
				);
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/common/mixin.scss';
.invitationCode {
  background: #F7F8FA;
  min-height: 100vh;
  .invitation {
    padding: 36rpx 24rpx;
  }
  .invitation-input{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 20rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: #ffffff;
    border-radius: 0.5rem;
    border: 1px solid #ffffff;
    overflow: hidden;
    font-size: 30rpx;
    color: #999;
    box-sizing: border-box;
    margin-bottom: 48rpx;
  }
  .btn-more{
    margin-left: 0;
  }
  .iconfont-box {
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
