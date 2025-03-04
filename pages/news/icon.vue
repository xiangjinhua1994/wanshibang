<template>
  <view class="page_icon">
    <view class="icon_box"> 
    
      <view class="item" v-for="(item, key ) in list" :key="key" @click="copy(item)">
        <text class="iconfont " :class="item" @click='clearStorage'></text>
        <view>{{ item }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {
    
  },
  computed: {
   
  },
  data() {
    return {
      list: ['icon-baoguofahuo','icon-baoguo','icon-shanchu1','icon-icozhuanhuan','icon-gouwuchefill','icon-wodedingdan','icon-jibenxinxi','icon-hongbao1','icon-tupian11','icon-stores','icon-kongbaiye','icon-biaoti','icon-shipinbofang','icon-tupian111','icon-shipin','icon-gonggao','icon-gonggao1','icon-wenzhangguanli','icon-fuzhuxian','icon-miaosha11','icon-lunbotu','icon-mulu','icon-zaixiankefu','icon-fuwenben','icon-htmal5icon24','icon-dianpu1','icon-dianpu11','icon-qiye','icon-ziyuan1','icon-yanzhengma','icon-start','icon-start1','icon-zhanghumingcheng','icon-mima','icon-qq','icon-chongzhi','icon-jifen1','icon-duihuan1','icon-share1','icon-huatong','icon-caidan','icon-gouwu','icon-biaoqing','icon-fasong','icon-jinbi','icon-saoyisao','icon-zhifubao11','icon-yuyue11','icon-right_arrow','icon-lianhefenhong','icon-zhuanruyue','icon-ziyuan2','icon-daojishi','icon-gouwuche1','icon-kefu1','icon-shouye','icon-daoda1','icon-fenxiang2','icon-shouye1','icon-yinhangka','icon-address-none','icon-remarks','icon-shoucang1','icon-shoucang2','icon-fenxiang3','icon-jiantouxia-copy','icon-lizhirenyuan','icon-guanghua','icon-Vlian','icon-jinyan-audiostatic','icon-liangdu_o','icon-qingxidu','icon-sanjiao2','icon-sanjiao1','icon-jiantou1','icon-jiantoushang','icon-kefu2','icon-gouwuche','icon-sousuo1','icon-icon_xianshi-xian','icon-tuikuan','icon-dizhi','icon-lajitong','icon-jian','icon-quan','icon-icon','icon-fenxiao1','icon-jia','icon-bangzhu','icon-pintuangou','icon-diliweizhi','icon-yue11','icon-qianbao','icon-daishouhuo','icon-integral','icon-kanjia1','icon-youhuiquan1','icon-guanbi1','icon-quanbudingdan','icon-pintuan','icon-gantanhao1','icon-dizhi1','icon-edit','icon-pingjiachaping','icon-pingjiazhongping','icon-pingjiahaoping','icon-xiangji','icon-shaixuanpaixu','icon-shaixuan','icon-fenxiang','icon-guanzhu','icon-chakan','icon-002dianhua','icon-phone1','icon-erweima','icon-tuandui','icon-fenxiaodingdan','icon-wait','icon-zijinmingxi','icon-share','icon-jingmeihaibao','icon-shoucang','icon-dianzan','icon-hongbao','icon-xiaoxi3','icon-libao1','icon-ic_check','icon-tijiaochenggong','icon-queren','icon-Homehomepagemenu','icon-wenjian','icon-step','icon-laba','icon-youhuiquan11','icon-fenxiao11','icon-youhuiquan-','icon-bofang','icon-ziyuan','icon-xingzhuang1','icon-daipingjia','icon-guanzhu1','icon-31guanzhu1xuanzhong','icon-tubiaozhizuo-','icon-fenxiang1','icon-shipinwenjianhuise','icon-shezhi2','icon-shezhi12','icon-paixing','icon-huodongtuiguang','icon-01','icon-shangchuan','icon-zhuanshutequan','icon-zhibo1','icon-paihangbang','icon-dingdan1','icon-dilanxianxingiconyihuifu_huabanfuben','icon-gengduo','icon-meiyan','icon-meibai1','icon-iconset0243','icon-zhuangxiushangjia-','icon-dianneijiucan','icon-waimai','icon-icon111','icon-quanping','icon-shouyin','icon-huiyuan21','icon-yemianpeizhi','icon-huiyuanqiaguanli','icon-shezhi11','icon-caiwuguanli','icon-quanxian','icon-icon-waimai','icon-tongji21','icon-shangpinguanli','icon-tableware-full','icon-mendian11','icon-menu_cjgl','icon-yingyong','icon-zhekou-shi','icon-view','icon-qingkong','icon-dingdan','icon-24gf-chartBarUpward','icon-huiyuan3','icon-ly_huiyuanka','icon-biaodanyemian2','icon-xianlu','icon-saoyisao1','icon-weixin','icon-zhifubao','icon-yue','icon-xuanze','icon-jiantou','icon-sousuo','icon-shouyetubiaohei','icon-address','icon-phone','icon-time','icon-gou','icon-zengjia','icon-jian_sekuai','icon-guanbi','icon-shuaxin','icon-magic-','icon-meibai','icon-zhaoxiangjiqiehuan','icon-xiaolian','icon-yunyingguanli','icon-icon-lottery','icon-yushoucuifu','icon-zhuanpanshezhi','icon-quanxianguanli','icon-xiaoxi2','icon-fenqifenqishangcheng2','icon-shanghuguanli','icon-icon-test2','icon-geren9','icon-huiyuan','icon-icon-test','icon-application','icon-hiuyuan','icon-authority','icon-iconset0335','icon-icon-test1','icon-xinzengtuanzhang','icon-tuanzhang','icon-vip','icon-tuichu','icon-chanpin','icon-yugu','icon-tongji','icon-xinzengyonghu1','icon-zhuye','icon-shangping','icon-VIPdingdan','icon-chajian1','icon-huodong','icon-caiwu','icon-chajian','icon-xiaochengxutubiaoguilei-','icon-yemian','icon-gongyingshang','icon-xiaoshoue','icon-dingdanshu','icon-zhifudingdan','icon-supplier','icon-caiwu1','icon-iconset03351','icon-jifen','icon-icon1','icon-dianpu','icon-huiyuan1','icon-home','icon-chajian11','icon-zhekou','icon-tongji1','icon-libao','icon-authority1','icon-shangping1','icon-youhuiquan','icon-cedaohang-zhanghao','icon-16','icon-xiaoshou','icon-tubiaozhizuomoban-','icon-xinzengyonghu','icon-piliangxiadan','icon-tubiao_baoyou','icon-weibiaoti2fuzhi02','icon-shezhi','icon-gongzhonghaoguanli','icon-zhibo','icon-Invitation','icon-xiaoxi','icon-kanjia','icon-gengduopintuan','icon-qiandao','icon-collection','icon-fenxiao','icon-manjian','icon-tuisong','icon-miaosha','icon-tuijian1','icon-tupian','icon-kefu','icon-diqu','icon-diqu1','icon-xingzhuangjiehe','icon-gongzhonghao','icon-you','icon-you1','icon-gongzhonghao1','icon-xiaochengxu','icon-mendian','icon-xiaoxi1','icon-youxiang','icon-yuyue','icon-iconset0250','icon-gantanhao','icon-wifi','icon-xinhao','icon-yonghu','icon-shanchu','icon-tuodong','icon-biaodanzujian-biaoge','icon-choujiangLottery','icon-manjian1','icon-fenleiorguangchangorqitatianchong','icon-quanxianmiyao','icon-shezhi1','icon-neirong','icon-xingzhuang','icon-renwu','icon-yushouxiangmu','icon-dingdanmanjian','icon-31paishe','icon-shangchuanshipin','icon-laxinjiangli','icon-shouye-zhihui']
    }
  },
  methods: {
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
  onShow() {
    
  },
}
</script>

<style lang="scss" scoped>
.icon_box{
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  .item{
    width: 25%;
    padding-bottom: 40rpx;
  }
}
.iconfont {
  font-size: 32px;
}
</style>