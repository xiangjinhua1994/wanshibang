<template>
	<view class="address-form">
    <view class="bus-haed">
      商家入驻
    </view>
    <view v-if="BusinessInfo.status === 2" class="status2">
      审核不通过：{{ BusinessInfo.approvalMessage }}
    </view>
    <view v-if="BusinessInfo.status === 0" class="status0">
      审核中
    </view>
    <view v-if="BusinessInfo.status === 1" class="status1">
      审核通过
    </view>
		<form >
			<view class="bg-white p-0-30 f30">
        <view class="bus-title">基础信息</view>
				<view class="d-s-c border-b-d9">
					<text class="key-name">申请联系人</text>
					<input
            class="ml20 flex-1 f32 p-30-0 bus-input "
            name="name"
            type="text"
            placeholder-class="grary9"
            v-model="BusinessInfo.contactName"
            :disabled="BusinessInfo.status === 0 || BusinessInfo.status === 1"
					  placeholder="请输入申请联系人" />
				</view>
				<view class="d-s-c border-b-d9">
					<text class="key-name">申请人联系电话</text>
					<input class="ml20 flex-1 f32 p-30-0 bus-input" name="phone" type="text" placeholder-class="grary9" 
            v-model="BusinessInfo.contactPhone"
            :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
					 placeholder="请输入申请人联系电话" />
				</view>
        <view class="d-s-c border-b-d9">
					<text class="key-name">申请联系人邮箱</text>
					<input class="ml20 flex-1 f32 p-30-0 bus-input" name="phone" type="text" placeholder-class="grary9" 
            v-model="BusinessInfo.contactEmail"
            :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
					 placeholder="请输入申请联系人邮箱" />
				</view>
        <view class="d-s-c border-b-d9">
					<text class="key-name">法人姓名</text>
					<input class="ml20 flex-1 f32 p-30-0 bus-input" name="name" type="text" placeholder-class="grary9" 
            v-model="BusinessInfo.legalName"
            :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
					 placeholder="请输入法人姓名" />
				</view>
				<view class="d-s-c border-b-d9">
					<text class="key-name">法人身份证号</text>
					<input class="ml20 flex-1 f32 p-30-0 bus-input" name="phone" type="text" placeholder-class="grary9" 
            v-model="BusinessInfo.legalCard"
            :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
					 placeholder="请输入法人身份证号" />
				</view>
        <view class="d-s-c border-b-d9">
					<text class="key-name">法人联系方式</text>
					<input class="ml20 flex-1 f32 p-30-0 bus-input" name="phone" type="text" placeholder-class="grary9" 
            v-model="BusinessInfo.legalPhone"
            :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
					 placeholder="请输入法人联系方式" />
				</view>
        <view>
          <view class="img-box"
            v-if="!BusinessInfo.legalCardPositiveImage" 
            @click="openUpload1()">

            <image class="imgBox" src="../../static/imgs/business/xj.png" mode=""></image>
            <view class="IDtext">上传身份证正面</view>
          </view>
          <view class="img-box" v-else>
            <image
              class="imgBox-2"
              :src="BusinessInfo.legalCardPositiveImage"
              ></image>
          </view>

          <view class="img-box"
            v-if="!BusinessInfo.legalCardSideImage"  
            @click="openUpload2()">
            <image class="imgBox" src="../../static/imgs/business/xj.png" mode=""></image>
            <view class="IDtext">上传身份证国徽面</view>
          </view>
          <view class="img-box" v-else>
            <image
              class="imgBox-2"
              :src="BusinessInfo.legalCardSideImage"
              ></image>
          </view>
        </view>
        <view class="bus-title">企业信息</view>
				<view class="d-s-c border-b-d9">
					<text class="key-name">商户全称</text>
					<input class="ml20 flex-1 f32 p-30-0 bus-input" name="name" type="text" placeholder-class="grary9" 
            v-model="BusinessInfo.name"
            :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
					 placeholder="请输入商户全称" />
				</view>
				<view class="d-s-c border-b-d9">
					<text class="key-name">商户性质</text>
          <radio-group @change="radioChange" :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1">
            <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in listConfigure" :key="item.id">
              <!-- <radio :value="item.id" :checked="index === currentConfigure" />{{ item.name }} -->
              <view class="pd-10">
                <radio :value="item.id" :checked="item.id === currentConfigure" :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"/>{{item.name}}
              </view>
            </label>
          </radio-group>
					
				</view>
        <view class="d-s-c border-b-d9">
					<text class="key-name">注册资本</text>
					<input class="ml20 flex-1 f32 p-30-0 bus-input" name="phone" type="text" placeholder-class="grary9" 
            v-model="BusinessInfo.registerAmount"
            :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
					 placeholder="请输入注册资本" />元
				</view>
        <view class="d-s-c border-b-d9">
					<text class="key-name">公司注册地</text>
					<input class="ml20 flex-1 f32 p-30-0 bus-input" name="phone" type="text" placeholder-class="grary9" 
            v-model="BusinessInfo.registerAddress"
            :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
					 placeholder="请输入公司注册地" />
				</view>
        <view class=" border-b-d9">
          <view class="pd-10">上传营业执照正本扫描件</view>
          <view class="img-box"
            v-if="!BusinessInfo.businessLicenseImage"
            @click="openUpload3(1)">
            <image class="imgBox" src="../../static/imgs/business/xj.png" mode=""></image>
            <view class="IDtext">上传营业执照扫描件</view>
          </view>
          <view class="img-box" v-else>
            <image
              class="imgBox-2"
              :src="BusinessInfo.businessLicenseImage"
              ></image>
            <!-- <view class="againBtn flex align-center justify-center rounded-bottom" >
              <text class="font-24 text-white">重新上传</text>
            </view> -->
          </view>
        </view>


        <view class="bus-title">银行公账账户信息</view>
				<view class="d-s-c border-b-d9">
					<text class="key-name">收款单位名称</text>
					<input class="ml20 flex-1 f32 p-30-0 bus-input" name="name" type="text" placeholder-class="grary9" 
            v-model="BusinessInfo.companyName"
            :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
					 placeholder="请输入收款单位名称" />
				</view>
				<view class="d-s-c border-b-d9">
					<text class="key-name">收款单位账户</text>
					<input class="ml20 flex-1 f32 p-30-0 bus-input" name="phone" type="text" placeholder-class="grary9" 
            v-model="BusinessInfo.companyBankAccount"
            :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
					 placeholder="请输入收款单位账户" />
				</view>
        <view class="d-s-c border-b-d9">
					<text class="key-name">收款单位开户银行</text>
					<input class="ml20 flex-1 f32 p-30-0 bus-input" name="phone" type="text" placeholder-class="grary9" 
            v-model="BusinessInfo.companyBankName"
            :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
					 placeholder="请输入收款单位开户银行" />
				</view>
        <view class=" border-b-d9">
          <view class="pd-10">上传营业执照正本扫描件</view>
          <view class="img-box"
            v-if="!BusinessInfo.licenceAmount" @click="openUpload4()">
            <image class="imgBox" src="../../static/imgs/business/xj.png" mode=""></image>
            <view class="IDtext">上传银行卡/开户许可证  </view>
          </view>
          <view class="img-box" v-else>
            <image
              class="imgBox-2"
              :src="BusinessInfo.licenceAmount"
              ></image>
            
          </view>
        </view>
        <!-- {{ listConfigure1 }} == -->
         <!-- {{ index11 }} -->
        <view  class="bus-title">经营类目</view>
        <view class="d-s-c border-b-d9">
          <view class="d-s-c border-b-d9">
            <text class="key-name">分类选择</text>
            <text>大类：</text>
            <picker @change="bindPickerChange" :value="index11" :range="listConfigure1" mode='selector' range-key="name"
              :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1">
              <view class="uni-input">{{listConfigure1[index11].name}}</view>
            </picker>
            <text>&nbsp;&nbsp;&nbsp;小类：</text>
            <picker @change="bindPickerChange2" :value="index22" :range="listConfigure2" mode='selector' range-key="name"
              :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1">
              <view class="uni-input">{{listConfigure2[index22].name}}</view>
            </picker>
          </view>

        </view>
          <!-- {{ index22 }} ={{ BusinessInfo.twoManagementConfigureId }} =-{{ listConfigure2 }} -->

        <view  class="bus-title">补充材料 </view>
        <view class="d-s-c border-b-d9">
          <!-- <view class="d-s-c border-b-d9">
            <text class="key-name">分类选择</text>
            <input class="ml20 flex-1 f32 p-30-0 bus-input " name="name" type="text" placeholder-class="grary9" v-model="address.name"
            placeholder="请输入收款单位名称" />
          </view> -->
          <view class="img-box"
            v-if="BusinessInfo.supplementaryMaterialsImage.length == 0" 
            @click="openUpload5()">
            <image class="imgBox" src="../../static/imgs/business/xj.png" mode=""></image>
            <view class="IDtext">上传售卖的部分产品图</view>
          </view>
          <view class="img-box" v-else>
            <image
              class="imgBox-2"
              :src="BusinessInfo.supplementaryMaterialsImage"
              ></image>
          </view>
          <!-- {{ BusinessInfo.supplementaryMaterialsImage }} -->
        </view>
        
        <view class="bus-title">留言</view>
				<view class="d-s-c border-b-d9">
          <textarea class="ml20 flex-1 p-30-0 lh150" name="detail" :auto-height="true"
            v-model="BusinessInfo.leavingMessage"
            :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
					 placeholder-class="grary9" placeholder="留言"></textarea>
				</view>
        
				<!-- <view class="d-s-c border-b-d9">
					<text class="key-name">所在地区</text>
          <view class="input-box flex-1" @click="showMulLinkageThreePicker">
            <input class="ml20 f32 flex-1 p-30-0" type="text" placeholder-class="grary9" placeholder="" v-model="selectCity" disabled style="pointer-events: none" />
           </view>
				</view>
				<view class="d-s-c border-b-d9">
					<text class="key-name">详细地址</text>
					<textarea class="ml20 flex-1 p-30-0 lh150" name="detail" :auto-height="true" v-model="address.detail"
					 placeholder-class="grary9" placeholder="请输入街道小区楼牌号等"></textarea>
				</view> -->
			</view>
			<view class="p30">
        <button type="primary" form-type="submit" class="btn-gcred f32 mt60 addBtn" 
          :disabled="BusinessInfo.status === 0|| BusinessInfo.status === 1"
          @click="formSubmit"> 提交</button></view>
		</form>
    <Upload v-if="isUpload1" @getImgs="getImgsFunc1"></Upload>
    <Upload v-if="isUpload2" @getImgs="getImgsFunc2"></Upload>
    <Upload v-if="isUpload3" @getImgs="getImgsFunc3"></Upload>
    <Upload v-if="isUpload4" @getImgs="getImgsFunc4"></Upload>
    <Upload v-if="isUpload5" @getImgs="getImgsFunc5"></Upload>
  <!-- <mpvue-city-picker v-if="is_load" ref="mpvueCityPicker" :province="province" :city="city" :area="area" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker> -->
	</view>
</template>

<script>
	// import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
  import Upload from '@/components/upload/upload.vue'
	export default {
		components: {
      Upload,
			// mpvueCityPicker
		},
		data() {
      
			return {
        index11: 0,
        index22: 0,
        BusinessInfo: {
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          legalName: '',
          legalCard: '',
          legalPhone: '',
          legalCardPositiveImage: '', //法人正面身份证
          legalCardSideImage: '', //法人反面身份证
          name: '',
          natureConfigureId: '', //商户性质id
          oneManagementConfigureId: 0, //一级分类id
          twoManagementConfigureId: 0, //二级分类id
          registerAmount: null,
          registerAddress: '',
          businessLicenseImage: '', //上传营业执照正本扫描件
          companyName: '',
          companyBankAccount: '',
          companyBankName: '',
          licenceAmount: '',
          supplementaryMaterialsImage: '', //补充材料
          leavingMessage: '',
          natureConfigure: '', //选定商户性质名称
          managementConfigure: '', //选定分类名称
        },

        listConfigure: [],
        listConfigure1: [],
        listConfigure2: [],
        currentConfigure: null,
				cityPickerValueDefault: [0, 0, 0],
				selectCity: '选择省,市,区',
				provinceId: 0,
				cityId: 0,
				regionId: 0,
				address: {},
				delta: 1,
				province: [],
				city: [],
				area: [],
				is_load: false,
        userInfo: null,
        isUpload1: false,
        isUpload2: false,
        isUpload3: false,
        isUpload4: false,
        isUpload5: false,
        images1: null,
        images2: null,
        images3: null,
        images4: null,
        images5: null,
        parentId: null,
			};
		},
		onLoad: function(options) {
			this.delta = options.delta;
			this.getData();
		},
		methods: {
      bindPickerChange: function(e) {
          console.log('picker发送选择改变，携带值为', e.detail.value)
          this.index11 = e.detail.value
          this.BusinessInfo.oneManagementConfigureId = this.listConfigure1[e.detail.value].id
          this.parentId = this.listConfigure1[e.detail.value].id
          this.tow(false)
      },
      bindPickerChange2: function(e) {
          console.log('picker发送选择改变，携带值为', e.detail.value)
          this.index22 = e.detail.value
          this.BusinessInfo.twoManagementConfigureId = this.listConfigure2[e.detail.value].id
      },
      async getData() {
        let self = this;
        uni.showLoading({
          title: '加载中',
        });
        self._get('user/index/setting', {}, function (res) {
          self.userInfo = res.data.userInfo;
          uni.hideLoading();
        });
        // #ifdef APP-PLUS
        // plus.runtime.getProperty(plus.runtime.appid, function (widgetInfo) {
        //   self.version_no = widgetInfo.version;
        // });
        // #endif
        self.getTenantInfo()
        self._postBody('/tenant/merchant/listConfigure', {
          "type": 0,
	        "parentId": ''
        }, function(res) {
					if (res.code === 1) {
            self.listConfigure = res.data
          } else {
            uni.showToast({
              title: res.msg,
              duration: 2000,
            });
          }
				});
        console.log("000000000")
        await self.one()
        self.tow(true)
        self.is_load = true;
      },
      getTenantInfo(){
        let self = this;
        self._post('/tenant/merchant/getTenantInfo', {}, function(res) {
          if (res.code === 1) {
            if(res.data){
              //status 0.审核中 1.正常 2.审核失败 3.已过期 4.已取消

              self.BusinessInfo = res.data
              self.currentConfigure = self.BusinessInfo.natureConfigureId
            }
          } else {
            uni.showToast({
              title: res.msg,
              duration: 2000,
            });
          }
				});
      },
      one(){ // 一级
        console.log("11111111")
        return new Promise((resolve, reject) => {
          let self = this;
          self._postBody('/tenant/merchant/listConfigure', {
            "type": 1,
            "parentId": ''
          }, function(res) {
            if (res.code === 1) {
              self.listConfigure1 = res.data
              self.index11 = 0
              if(self.BusinessInfo.oneManagementConfigureId){
                self.index11 = self.listConfigure1.findIndex(obj => obj.id == self.BusinessInfo.oneManagementConfigureId)
              }
              self.parentId = self.listConfigure1[self.index11].id
              self.BusinessInfo.oneManagementConfigureId = self.listConfigure1[self.index11].id
              resolve(true)
            } else {
              uni.showToast({
                title: res.msg,
                duration: 2000,
              });
              reject(false)
            }
          });
        })
      },
      tow(isOne){ // 二级
        let self = this;
        self._postBody('/tenant/merchant/listConfigure', {
          "type": 1,
	        "parentId": self.parentId
        }, function(res) {
					if (res.code === 1) {
            self.listConfigure2 = res.data
            if(self.BusinessInfo.twoManagementConfigureId && isOne){
              self.index22 = self.listConfigure2.findIndex(obj => obj.id == self.BusinessInfo.twoManagementConfigureId)
            }
            self.BusinessInfo.twoManagementConfigureId = self.listConfigure2[self.index22].id
            
          } else {
            uni.showToast({
              title: res.msg,
              duration: 2000,
            });
          }
				});
      },
      /*打开上传图片*/
      openUpload1() {
        this.isUpload1 = true
      },
      openUpload2() {
        this.isUpload2 = true
      },
      openUpload3() {
        this.isUpload3 = true
      },
      openUpload4() {
        this.isUpload4 = true
      },
      openUpload5() {
        this.isUpload5 = true
      },
      // legalCardPositiveImage
      // legalCardSideImage
      // businessLicenseImage
      // licenceAmount
      // supplementaryMaterialsImage
      /*获取上传的图片*/
      getImgsFunc1(e) {
        let self = this
        self.isUpload1 = false
        console.log(e,"11111111")
        self.BusinessInfo.legalCardPositiveImage = e[0].filePath
      },
      getImgsFunc2(e) {
        let self = this
        self.isUpload2 = false
        self.BusinessInfo.legalCardSideImage = e[0].filePath
      },
      getImgsFunc3(e) {
        let self = this
        self.isUpload3 = false
        self.BusinessInfo.businessLicenseImage = e[0].filePath
      },
      getImgsFunc4(e) {
        let self = this
        self.isUpload4 = false
        self.BusinessInfo.licenceAmount = e[0].filePath
      },
      getImgsFunc5(e) {
        let self = this
        self.isUpload5 = false
        self.BusinessInfo.supplementaryMaterialsImage = e[0].filePath
        // if (e && typeof e != 'undefined') {
        //   let this_length = self.images1.length,
        //     upload_length = e.length
        //   if (this_length + upload_length < 7) {
        //     self.images1 = self.images1.concat(e)
        //   } else {
        //     let leng = 6 - this_length
        //     for (let i = 0; i < leng; i++) {
        //       self.images1.push(e[i])
        //     }
        //   }
        // }
      },
      
      /*删除图片*/
      deleteFunc(e) {
        this.images.splice(e, 1)
      },
      radioChange: function(evt) {
        for (let i = 0; i < this.listConfigure.length; i++) {
          if (this.listConfigure[i].id === evt.detail.value) {
            this.BusinessInfo.natureConfigureId = this.listConfigure[i].id;
            break;
          }
        }
      },
      onChooseAvatar(e) {
        console.log(e);
        let self = this;
        let params = {};
        params.userId = self.userInfo.userId;
        params.updateType = 'avatarUrl';
        let uploadParams = {
          token: uni.getStorageSync('token'),
          appId: self.getAppId(),
        };
        // 上传文件
        uni.uploadFile({
          url: self.websiteUrl + '/api/front/file/upload/image',
          filePath: e.detail.avatarUrl,
          name: 'iFile',
          formData: uploadParams,
          success: function (res) {
            // let result =
            //   typeof res.data === 'object' ? res.data : JSON.parse(res.data);
            // params.updateValue = result.data.filePath;
            // self.update(params);
          },
          complete: function () {},
        });
      },
      chooseImage(val) {
        uni.chooseImage({
          count: 1, //默认9
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], //从相册选择
          success: async (res) => {
            // debugger
            uni.showToast({
              title: '为了提供图片上传的功能，我们需要申请相机/存储权限。',  
              icon: 'none'  
            });
            switch (val) {
              case 1:
                this.BusinessInfo.legalCardPositiveImage =
                  await this.uploadFilePromise(res.tempFilePaths[0])
                break
              case 2:
                this.BusinessInfo.legalCardSideImage =
                  await this.uploadFilePromise(res.tempFilePaths[0])
                break
              case 3:
                this.BusinessInfo.businessLicenseImage =
                  await this.uploadFilePromise(res.tempFilePaths[0])
                break
              case 4:
                this.BusinessInfo.licenceAmount =
                  await this.uploadFilePromise(res.tempFilePaths[0])
                break
              default:
                break
            }
          },
        })
      },
      uploadFilePromise(url) {
        let self = this;
        return new Promise((resolve, reject) => {
          // this.http.upload('/common/resource/upload', url, 'POST').then((res) => {
				  self._post('file/upload/image', url, function(res) {
            let data = JSON.parse(res.data)
            if (data.code == 0) {
              setTimeout(() => {
                resolve(data.data)
              }, 1000)
            } else {
              uni.showToast({
                title: data.msg,
                icon: 'none',
              })
              reject(data.msg)
            }
          })
        })
      },
      
			/*提交*/
			formSubmit: function(e) {
				let self = this;
				var formdata = self.BusinessInfo
				// formdata.provinceId = self.provinceId;
				// formdata.cityId = self.cityId;
				// formdata.regionId = self.regionId;
				// if (formdata.name == '') {
				// 	uni.showToast({
				// 		title: '请输入收货人姓名',
				// 		duration: 1000,
				// 		icon: 'none'
				// 	});
				// 	return false;
				// }
				// if (formdata.phone == '') {
				// 	uni.showToast({
				// 		title: '请输入手机号码',
				// 		duration: 1000,
				// 		icon: 'none'
				// 	});
				// 	return false;
				// }
        // if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(formdata.phone)) {
        //   uni.showToast({
        //     title: '手机有误,请重填！',
        //     duration: 2000,
        //     icon: 'none'
        //   });
        //   return false;
        // }
				// if (formdata.provinceId == 0 || formdata.cityId == 0 || formdata.regionId) {
				// 	if (formdata.detail == '') {
				// 		uni.showToast({
				// 			title: '请选择完整省市区',
				// 			duration: 1000,
				// 			icon: 'none'
				// 		});
				// 		return false;
				// 	}
				// }
				// if (formdata.detail == '') {
				// 	uni.showToast({
				// 		title: '请输入街道小区楼牌号等',
				// 		duration: 1000,
				// 		icon: 'none'
				// 	});
				// 	return false;
				// }

				self._postBody('/tenant/merchant/save', formdata, function(res) {
          if(res.code === 1){
            uni.showToast({
              title: '保存成功',
              duration: 2000,
            });
            self.getTenantInfo()
          }else{
            uni.showToast({
              title: res.msg,
              duration: 2000,
            });
          }
					// self.showSuccess(res.msg, function() {
					// 	// #ifndef H5
					// 	uni.navigateBack({
					// 		delta: parseInt(self.delta)
					// 	});
					// 	// #endif
					// 	// #ifdef H5
					// 	history.go(-self.delta);
					// 	// #endif
					// });
				});
			},

			formReset: function(e) {
				console.log('清空数据');
			},

			/*三级联动选择*/
			showMulLinkageThreePicker() {
				console.log(this.is_load)
				if(!this.is_load){
					return
				}
				this.$refs.mpvueCityPicker.show();
			},

			/*确定选择的省市区*/
			onConfirm(e) {
				this.selectCity = e.label;
				this.provinceId = e.cityCode[0];
				this.cityId = e.cityCode[1];
				this.regionId = e.cityCode[2];
			}
		}
	};
</script>

<style >
	page {
		background-color: #FFFFFF;
	}
  .status0{
    text-align: center;
    color: rgb(253, 165, 57);
    font-size: 30rpx;
    line-height: 60rpx;
  }
  .status1{
    text-align: center;
    color: rgb(49, 130, 252);
    font-size: 30rpx;
    line-height: 60rpx;
  }
  .status2{
    /* text-align: center; */
    color: rgb(247, 33, 33);
    font-size: 30rpx;
    line-height: 40rpx;
    padding: 20rpx;
    padding-bottom: 0rpx;
  }
  .bus-haed{
    background: #f0f0f0;
    line-height: 100rpx;
    font-size: 40rpx;
    text-align: center;
  }
  .bus-title{
    padding:  20rpx 0;
    font-size: 36rpx;
  }
  .bus-input{
    font-size: 26rpx;
  }
  .img-box{
    width: 400rpx;
    height: 260rpx;
    text-align: center;
    border:1rpx dashed  #CCCCCC;
    margin-bottom: 20rpx;
  }
  .imgBox{
    width: 150rpx;
    height: 150rpx;
    margin: 0 auto;
    margin-top: 40rpx;
  }
  .imgBox-2{
    max-width: 400rpx;
    max-height: 260rpx;
  }
  .IDtext{
    text-align: center;
    padding-top: 20rpx;
  }
  .pd-10{
    padding: 10rpx 0;
  }

  .picker-item {
		text-align: center;
		line-height: 40px;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 16px;
	}
  .mpvue-picker-view {
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 238px;
		background-color: rgba(255, 255, 255, 1);
	}
	.address-form {
		/* border-top: 16rpx solid #f2f2f2; */
	}

	.address-form .key-name {
		width: 200rpx;
		font-size: 26rpx
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
