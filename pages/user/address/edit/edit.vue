<template>
	<view class="address-form">
    <view class="head_top" :style="'height:'+topBarTop()+'px;'"></view>
    <headTitle title="编辑地址" bg="#fff">
      <view class="right-css" @click="del()">删除</view>
    </headTitle>

		<!-- <form @submit="formSubmit" @reset="formReset"> -->
    <!-- </form> -->
    <view class=" address-box">
      <view class="d-s-c ">
        <text class="key-name">姓名</text>
        <input class="ml20 f32 flex-1 p-30-0" name="name" type="text" v-model="address.name" placeholder-class="grary9"
          placeholder="请输入姓名" />
        <view class="address-box-call">
          <radio-group name="radio" style="transform:scale(0.7)"  @change="radioChange($event,index)" >
            <label class="mar10">
              <radio value="0"   color="#000"  :checked="checked_sex0"/><text>先生</text>
            </label>
            <label>
              <radio value="1"   color="#000"  :checked="checked_sex1"/><text>女士</text>
            </label>
          </radio-group>
        </view>
      </view>
      <view class="d-s-c ">
        <text class="key-name">手机号</text>
        <input class="ml20 f32 flex-1 p-30-0" name="phone" type="text" v-model="address.phone" placeholder-class="grary9"
          placeholder="请输入手机号" />
      </view>
      <view class="d-s-c ">
        <text class="key-name">选择地区</text>
        <view class="input-box flex-1" @click="showMulLinkageThreePicker">
          <input class="ml20 f32 flex-1 p-30-0" type="text"   placeholder-class="grary9" placeholder="请选择省市区" v-model="selectCity"
            disabled="true"  />
        </view>
      </view>
      <view class="d-s-c ">
        <text class="key-name">详细地址</text>
        <textarea class="ml20 flex-1 f32 p-30-0 lh150" name="detail" placeholder-class="grary9" :auto-height="true"
          v-model="address.detail" placeholder="街道/门牌号/小区楼栋/乡等"></textarea>
      </view>
    </view>

    <view class=" address-box">
      <!-- <view class="d-s-c address-item">
        <text class="key-name">选择标签</text>
        <view class="d-s-c flex-1">
          <view class="ui-btn " :class="address.lable === 1 ?'btn-black': ''" @click="address.lable = 1">家</view>
          <view class="ui-btn " :class="address.lable === 2 ?'btn-black': ''" @click="address.lable = 2">公司</view>
          <view class="ui-btn " :class="address.lable === 3 ?'btn-black': ''" @click="address.lable = 3">学校</view>
        </view>
      </view> -->
      <view class="d-b-c address-item">
        <text class=" key-name-lang">
          设为默认地址
          <text class="">(每次下的时默认使用)</text>
        </text>
        <switch
          :checked="address.checked" 
          color="#000" 
          style="transform:scale(0.7)"
          @change="checkedFn"/>
    
        </view>
    </view>
    <view class="add_add-btn">
      <view class="ui-btn btn-black btn-more" @click="formSubmit()">修改地址</view>
    </view>
    <!-- <view class="p30">
      <button type="primary" form-type="submit" class="btn-gcred f32 mt60 addBtn">保存</button>
    </view> -->
		
		<mpvue-city-picker v-if="is_load" ref="mpvueCityPicker" :province="province" :city="city" :area="area" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
    <uiPopup v-if="confirmBoxOrder">
      <view class="confirm-box">
        <view class="confirm-box-title" > 删除地址 </view>
        <view class="confirm-box-describe"> 确认删除该地址信息吗? </view>
        <view class="confirm-box-btn" slot="btnBox">
          <view class="ui-btn btn-more btn-width" @click="closeOrder">取消</view>
          <view class="ui-btn btn-more btn-width btn-black" @click="close_deteleOrder">删除地址</view>
        </view>
      </view>
    </uiPopup>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
  import UiPopup from '@/pages/component/ui-popup.vue';
  import headTitle from '@/pages/component/headTitle.vue'
	export default {
		components: {
      headTitle,
			mpvueCityPicker,
      UiPopup,
		},
		data() {
			return {
        checked_sex1:false,
        checked_sex0:false,
        sex:0,
        confirmBoxOrder: false,
				cityPickerValueDefault: [0, 0, 0],
				selectCity: '',
				provinceId: 0,
				cityId: 0,
				regionId: 0,
				/*地址id*/
				addressId: 0,
				/*地址数据*/
				address: {
          checked: false,
          name: '',
          phone: '',
          lable: 1,
        },
				/*地区*/
				region: {},
				is_load: false,
				province: [],
				city: [],
				area: [],
			};
		},
		onLoad(e) {
      console.log("页面进来加载")
			this.addressId = e.addressId;
		},
		mounted() {
			/*获取地址数据*/
			this.getData();
		},
		methods: {
      closeOrder(){
           this.confirmBoxOrder=false

      },
  		radioChange(item){
				console.log(item)
				this.sex= Number(item.detail.value) 

			},

			/*获取数据*/
			getData() {
				let self = this;
				let addressId = self.addressId;
				self._get(
					'user/address/detail', {
						addressId: addressId
					},
					function(res) {
						self.address = res.data.detail;
            self.address.checked = res.data.detail.check
						self.addressId = res.data.detail.addressId;
						self.provinceId = res.data.detail.provinceId;
						self.cityId = res.data.detail.cityId;
						self.regionId = res.data.detail.regionId;
						self.region = res.data.detail.region;
						self.selectCity = self.region.province + self.region.city + self.region.region;
						self.province = res.data.regionData[0];
						self.city = res.data.regionData[1];
						self.area = res.data.regionData[2];
						self.is_load = true;
            self.sex = res.data.detail.sex 
            res.data.detail.sex == 1 ?  self.checked_sex1 = true: self.checked_sex0=true
					}
				);
			},
      checkedFn(e){
        console.log("e", e.detail.value)
        this.address.checked = e.detail.value
      },


      del(){
        this.confirmBoxOrder = true
        console.log("del")
      },
      close_deteleOrder() {//  删除地址确认
        let self = this;
        self._get('user/address/delete', {
							addressId: self.addressId
						}, function(result) {
							if (result.code == 1) {
                self.confirmBoxOrder = false
								uni.showToast({
									title: '删除成功',
									duration: 2000
								});
               setTimeout(()=>{
                self.gotoPage('pages/user/address/address')
               },500)
							}else{
                uni.showToast({
									title: '删除失败',
									duration: 2000
								});
              }
						});
      },
			/*提交地址*/
			formSubmit: function(e) {
				let self = this;
				var formdata = this.address // e.detail.value;
				formdata.provinceId = self.provinceId;
				formdata.cityId = self.cityId;
				formdata.regionId = self.regionId;
				formdata.addressId = self.addressId;
				formdata.region = self.region;
        formdata.sex = self.sex
				if (formdata.name == '') {
					uni.showToast({
						title: '请输入姓名姓名',
						duration: 1000,
						icon: 'none'
					});
					return false;
				}

				if (formdata.phone == '') {
					uni.showToast({
						title: '请输入手机号码',
						duration: 1000,
						icon: 'none'
					});
					return false;
				}

        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(formdata.phone)) {
          uni.showToast({
            title: '手机有误,请重填！',
            duration: 2000,
            icon: 'none'
          });
          return false;
        }


				if (formdata.provinceId == 0 || formdata.cityId == 0 || formdata.regionId) {
					if (formdata.detail == '') {
						uni.showToast({
							title: '请选择完整省市区',
							duration: 1000,
							icon: 'none'
						});
						return false;
					}
				}

				self._postBody('user/address/edit', formdata, function(res) {

          console.log(res)

          if(res.code==1){
              
              uni.showToast({
                  title: '修改成功',
                  duration: 2000
                });
                setTimeout(()=>{
                  self.gotoPage('pages/user/address/address')
                },500)
          }else{
            uni.showToast({
              title: '修改失败',
              duration: 2000
            });


          }

					// self.showSuccess(res.msg, function() {
					// 	// #ifdef  H5
					// 	uni.navigateBack({
					// 		delta: 2
					// 	});
					// 	//#endif
					// 	// #ifndef  H5
					// 	uni.navigateBack({
					// 		delta: 1
					// 	});
					// 	//#endif
					// });



				});
			},

			/*清空数据*/
			formReset: function(e) {
				console.log('清空数据');
			},
     
			/*三级联动选择*/
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show();
			},

			/*选择之后绑定*/
			onConfirm(e) {
				this.region = e.label.split(',');
				this.selectCity = e.label;
				this.provinceId = e.cityCode[0];
				this.cityId = e.cityCode[1];
				this.regionId = e.cityCode[2];
			}
		}
	};
</script>

<style lang="scss" scoped>
.mar10{
  margin-right: 20rpx;
}
	page {
		background-color: #F7F8FA;
	}
	.address-form {
    .right-css {
      position: absolute;
      top: 0rpx;
      right: 20rpx;
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 32rpx;
      color: #000000;
      font-style: normal;
      text-transform: none;
    }
	}
  .address-box {
    margin: 24rpx;
    border-radius: 24rpx;
    background-color: #fff;
    padding: 0 30rpx ;
    font-size: 28rpx;
    .address-item {
      height: 104rpx;
    }
    .address-box-call{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .radio-img {
        width: 24rpx;
        height:24rpx;
        margin-right: 8rpx;
        margin-left: 12rpx;
      }
    }
  }
  .add_add-btn {
		position: fixed;
    bottom:0;
		width:750rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
    background: #fff;
    .btn-more {
      width: 690rpx;
      margin-left: 0;
    }
	}
	.address-form .key-name {
		width: 140rpx;
		font-size: 32rpx;
  }
  .address-form  .key-name-lang {
    width: 500rpx;
		font-size: 32rpx;
    text {
      font-family: Hiragino Sans GB, Hiragino Sans GB;
      font-weight: normal;
      font-size: 20rpx;
      color: #8C8C8C;
      font-style: normal;
      text-transform: none;
    }
  }

	.address-form .btn-red {
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		box-shadow: 0 8rpx 16rpx 0 rgba(226, 35, 26, .6);
	}

	.addBtn {
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
	}
</style>
