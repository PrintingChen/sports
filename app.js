var config = require('./common/config');
var utils = require('./common/utils/utils');
App({
	onLaunch: function () {
		try {
			var res = wx.getSystemInfoSync()
			// console.log(res.model)
			// console.log(res.pixelRatio)
			// console.log(res.windowWidth)
			// console.log(res.windowHeight)
			// console.log(res.language)
			// console.log(res.version)
			// console.log(res.platform)
			var extra = JSON.stringify({
				fontSizeSetting: res.fontSizeSetting,
				language: res.language,
				pixelRatio: res.pixelRatio,
				screenHeight: res.screenHeight,
				screenWidth: res.screenWidth,
				sdkVersion: res.sdkVersion,
				system: res.system,
				version: res.version,
				windowHeight: res.windowHeight,
				windowWidth: res.windowWidth,
			});
			var data = utils.getData({
				clientType: 'WXAPP',
				wxappType: '仕伯特体育发展',
				phoneBrand: res.brand,
				phoneModel: res.model,
				phonePlatform: res.platform,
				extra: extra
			});
			wx.request({
				url: config.apiUrl + 'wxapp/device/signIn', //仅为示例，并非真实的接口地址
				data: data,
				method: "POST",
				success: function (res) {
					console.log(res.data)
				}
			})
		} catch (e) {
			// Do something when catch error
		}
		console.log('App Launch')
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
	globalData: {
		hasLogin: false,
		userInfo: {},
		phone: '', //手机号
	}
});