var config = require('./../../../common/config')
var utils = require('./../../../common/utils/utils')
var api = require('./../../../common/api/index')
var app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isCanClick: true,
		btnText: '重新获取(60s)', //重新获取(10s)
		phone: '',
		code: '',

		timer: null, //定时器
		times: 60,
	},

	bindPhone(e) {
		this.setData({
			phone: e.detail.value
		})
	},

	bindCode(e) {
		this.setData({
			code: e.detail.value
		})
	},

	getCode() {
		var that = this
		var phone = that.data.phone

		if (!utils.isPoneAvailable(phone)) {
			utils.alert('手机号不合法', '', './../../../images/icon-warning.png')
		} else {
			app.globalData.phone = phone
			that.setData({
				isCanClick: false
			})

			var times = that.data.times
			that.timer = setInterval(function () {
				times -= 1
				that.setData({
					btnText: '重新获取(' + times + 's)'
				})
				if (times == 0) {
					clearInterval(that.timer)
					that.setData({
						btnText: '',
						isCanClick: true
					})
				}
			}, 1000)

			//发送
			api.GetCode({
				mobile: that.data.phone,
				authType: 1
			}).then(res => {
				utils.log('发送验证码：', res)
				utils.alert('发送成功')
			}).catch(err => {
				utils.alert('发送失败')
				utils.log(err)
			})
		}
	},

	submit() {
		var that = this
		console.log(that.data.phone, that.data.code)

		if (!that.data.code) {
			utils.alert('验证码为空', '', './../../../images/icon-warning.png')
			return false
		}

		api.VerifyPhone({
			mobile: that.data.phone,
			authType: 1,
			authCode: that.data.code
		}).then(data => {
			return api.BindMobile({
				mobile: that.data.phone,
				password: utils.getStorage('wxappid')
			})

		}).then(res => {
			if (res.code == config.successCode) {
				utils.log('绑定手机成功：', res)
				utils.setStorage('usersn', res.usersn)
				var params = {
					"avatarUrl": app.globalData.userInfo.avatarUrl,
					"city": app.globalData.userInfo.city,
					"gender": app.globalData.userInfo.gender,
					"language": app.globalData.userInfo.language,
					"nickName": app.globalData.userInfo.nickName,
					"openid": utils.getStorage('openid'),
					"province": app.globalData.userInfo.province,
					"usersn": utils.getStorage('usersn')
				}
				utils.log('上传用户信息参数：', params)
				return api.SaveUserInfo(params)
			} else {
				utils.log('绑定手机失败：', res)
			}
		}).then(res => {
			if (res.code == config.successCode) {
				utils.alert('绑定成功')
				utils.log('上传用户信息成功：', res)
				wx.switchTab({
					url: '/pages/my/index'
				})
			} else {
				utils.log('上传用户信息失败：', res)
				utils.alert('绑定失败', '', './../../../images/icon-warning.png')
			}
		}).catch(err => {
			utils.log('保存失败:', err)
			utils.alert('保存失败', '', './../../../images/icon-warning.png')
		})
	},

	// wx.switchTab({
	// 	url: '/pages/my/index'
	// })

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		utils.log(app.globalData)
		this.setData({
			phone: app.globalData.phone
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
		this.setData({
			timer: null
		})
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		this.setData({
			timer: null
		})
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})