/**
 * 工具类
 */
var utils = {
	/**
	 * scene解码
	 */
	scene_decode(e) {
		if (e === undefined)
			return {};
		let scene = decodeURIComponent(e),
			params = scene.split(','),
			data = {};
		for (let i in params) {
			var val = params[i].split(':');
			val.length > 0 && val[0] && (data[val[0]] = val[1] || null)
		}
		return data;
	},

	/**
	 * 格式化日期格式 (用于兼容ios Date对象)
	 */
	format_date(time) {
		// 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
		return time.replace(/\-/g, "/");
	},

	/**
	 * 格式化详情内容,去除图片之间的间隙，图片宽度最大100%
	 */
	format_content(str) {
		return str.replace(/\<img/gi, '<img style="display:block; margin:0 auto; max-width:100%;" ');
	},

	/**
	 * 对象转URL
	 */
	urlEncode(data) {
		var _result = [];
		for (var key in data) {
			var value = data[key];
			if (value.constructor == Array) {
				value.forEach(_value => {
					_result.push(key + "=" + _value);
				});
			} else {
				_result.push(key + '=' + value);
			}
		}
		return _result.join('&');
	},

	/**
	 * 遍历对象
	 */
	objForEach(obj, callback) {
		Object.keys(obj).forEach((key) => {
			callback(obj[key], key);
		});
	},

	/**
	 * 是否在数组内
	 */
	inArray(search, array) {
		for (var i in array) {
			if (array[i] == search) {
				return true;
			}
		}
		return false;
	},

	/**
	 * 判断是否为正整数
	 */
	isPositiveInteger(value) {
		return /(^[0-9]\d*$)/.test(value);
	},

	/**
	 * 获取场景值(scene)
	 */
	getSceneData(query) {
		return query.scene ? this.scene_decode(query.scene) : {};
	},
	// 判断是否为身份证
	isVail(value) {

		if (!/^\d{17}(\d|x)$/i.test(value)) {
			return false;
		}

		var now = new Date();
		var yYear = Number(value.substr(6, 4));
		var yMonth = Number(value.substr(10, 2)) + 1;
		var yDay = Number(value.substr(12, 2));

		var birthFlag = false;
		if (yYear <= Number(now.getFullYear()) && yYear > 0) {
			if (yMonth <= 12 && yMonth > 0) {
				// 获取当月天数
				var preMonth = new Date(yYear, yMonth - 1, 0);

				if (yDay <= preMonth.getDate() && yDay > 0) {
					birthFlag = true;
				}
			}
		}

		if (!birthFlag) {
			return false;
		}

		var iSum = 0;
		value = value.replace(/x$/i, "a");
		for (var i = 17; i >= 0; i--) {
			iSum += (Math.pow(2, i) % 11) * parseInt(value.charAt(17 - i), 11);
		}
		if (iSum % 11 != 1) {
			return false;
		}
		return true
	},
	// 判断是否为手机号
	isPoneAvailable(pone) {
		var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
		if (!myreg.test(pone)) {
			return false;
		} else {
			return true;
		}
	},
	// 判断是否为座机或者手机号
	isTelAvailable(tel) {
		var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
		var myregs = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
		var flag = false;
		if (myreg.test(tel)) {
			flag = true;
		}
		if (myregs.test(tel)) {
			flag = true;
		}
		if (flag) {
			return true
		} else {
			return false
		}
	},
	// 判断是否为电子邮箱
	isMail(mail) {
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (filter.test(mail)) {
			return true;
		} else {
			return false;
		}
	},
	// 判断是否为数字
	isNum(num) {
		var filter = /^[0-9]*$/;
		if (filter.test(num)) {
			return true;
		} else {
			return false;
		}
	},
	//保存图片
	saveImg(url, filenameRest, callback) {
		const filename = filenameRest || '海报'
		if (url) {
			// #ifdef MP-WEIXIN
			// 图片保存到本地
			console.log(url, 24545)

			uni.downloadFile({
				url: url,
				success: res => {
					console.log(res, 111)
					if (res.statusCode === 200) {
						// 搞一个新的名字，这个自己随便弄一下，把https去了，后面自己加个后缀，xxx.png,xxx.jpg,我是直接用时间戳加个.jpg
						// let name = this.getOldName(url);
						// 重命名的方法
						// let tempFilePath = await this.changeName(res.tempFilePath, name);
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success(data) {
								uni.showToast({
									// title: '保存成功',
									title: '图片已保存手机相册',
									icon: 'success',
									duration: 2000,
								});
							},
							fail(err) {
								console.log(err.errMsg);
								if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
									uni.showToast({
										title: '请允许访问相册后重试',
										icon: 'none',
										duration: 1000,
									});
									setTimeout(() => {
										uni.openSetting();
									}, 1000);
								}
							},
							complete(res) {
								console.log('complete');
							},
						});
					}
				},
				fail: err => {
					//搞个提示
				}
			});

			// #endif
			// #ifdef H5
			var ua = window.navigator.userAgent.toLowerCase()
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				uni.showToast({
					title: '请复制链接到默认浏览器打开',
					icon: 'none',
					duration: 2000
				});
			} else {
				var a = document.createElement('a');
				a.href = url;
				const name = `${filename}-${new Date().getTime()}.png`
				a.download = name;
				a.click()
				a.remove()
			}
			// #endif
			// #ifdef APP-PLUS || MP-ALIPAY
			uni.showLoading({
				title: '正在下载'
			});
			uni.saveImageToPhotosAlbum({
				filePath: url,
				success: () => {
					uni.hideLoading();
					callback && callback();
					uni.showToast({
						title: '图片已保存手机相册',
						icon: 'none',
						duration: 2000,
					});
				},
				fail(e) {
					uni.hideLoading();
					uni.showToast({
						title: '下载失败，错误原因：' + e.errMsg,
						icon: "none"
					});
				}
			});
			// #endif
		} else {
			uni.showToast({
				title: '未找到图片',
				icon: 'none'
			});
		}
	}
};
export default utils;