var config = require('../../common/config')
var utils = require('../../common/utils/utils')
var api = require('./../../common/api/index')
var app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLogin: false,
		userInfo: {
			avatarUrl: './../../images/avatar.png',
			nickName: '',
			phone: ''
		}
	},

	getUserInfo(res) {
		app.globalData.userInfo = res.detail.userInfo
		console.log(res.detail.errMsg == "getUserInfo:ok")

		if(res.detail.errMsg == "getUserInfo:ok"){
			utils.skip('/pages/my/bindphone/index')
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this
		var openid = utils.getOpenId('openid')
		var usersn = utils.getOpenId('usersn')
		utils.log('my onLoad: openid:', openid)

		if (!openid) {
			api.Login().then(res => {
				utils.log(res)
			}).catch(err => {
				utils.log(err)
			})
		}else if(usersn){
			api.GetUserDetail({usersn: usersn}).then(res => {
				utils.log('获取的用户信息：',res)
				var avatarUrl = 'userInfo.avatarUrl'
				var nickName = 'userInfo.nickName'
				that.setData({
					[avatarUrl]: res.avatarUrl,
					[nickName]: res.nickName,
					isLogin: true
				})
			}).catch(err => {
				utils.log(err)
			})
		}else{
			utils.log('没有绑定手机号')
			this.setData({
				isLogin: false
			})
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		console.log('onReady...')
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function (opt) {
		utils.log('onShow...')
		
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

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