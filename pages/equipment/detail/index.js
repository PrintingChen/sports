var config = require('../../../common/config');
var utils = require('../../../common/utils/utils');
var WxParse = require('../../../common/libs/wxParse/wxParse.js');

Page({
	onLoad(e) {
		var data = utils.getData({
			itemSn: e.id,
			isgetcon: true
		});
		var that = this;
		this.setData({
			isLoading: true
		})
		wx.request({
			url: config.apiUrl + 'product/detail',
			data: data,
			method: "POST",
			success: function (res) {
				console.log('product/detail：', res)
				res = res.data;
				if (res.code == '200000') {
					var imgs = [];
					res.data.images.forEach(item => {
						imgs.push(item.imageUrl);
					})
					res.data.swiperImgs = imgs;
					var colors = [],
						size = [];
					res.data.norms.forEach(item => {
						if (item.normType == '尺寸') {
							size.push(item.normValue);
						}
						if (item.normType == '颜色') {
							colors.push(item.normValue);
						}
					})
					WxParse.wxParse('article', 'html', res.data.detail.description, that);
					res.data.colors = colors;
					res.data.size = size;
					that.setData({
						baseInfo: res.data
					});
				}
				that.setData({
					isLoading: false
				});
			},
			error() {
				that.setData({
					isLoading: false
				});
			}
		})
	},
	onShareAppMessage() {},
	data: {
		imgUrls: [
			'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
			'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
			'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
		],
		indicatorDots: true,
		autoplay: true,
		interval: 4000,
		duration: 500,
		isLoading: true,
		baseInfo: {},

		isShowActionSheet: true,
		num: 1, // input默认是1  
		minusStatus: 'disabled'
	},

	purchase() {
		console.log('purchase...')
		this.setData({
			isShowActionSheet: false
		})
	},

	bindPurchase() { //立即购买
		console.log('bindPurchase...')
		utils.skip('/pages/my/orderconfirm/index')
	},

	contact() {
		console.log('contact...')
	},

	listenerActionSheet() {
		console.log('listenerActionSheet...')
		this.setData({
			isShowActionSheet: true
		})
	},

	listenerMask() {
		console.log('listenerActionSheet...')
		this.setData({
			isShowActionSheet: false
		})
	},

	bindMinus: function () {
		var num = this.data.num;
		if (num > 1) {
			num--;
		}
		var minusStatus = num <= 1 ? 'disabled' : 'normal';
		this.setData({
			num: num,
			minusStatus: minusStatus
		});
	},

	bindPlus: function () {
		var num = this.data.num;
		num++;
		var minusStatus = num < 1 ? 'disabled' : 'normal';
		this.setData({
			num: num,
			minusStatus: minusStatus
		});
	},

	bindManual: function (e) {
		var num = e.detail.value;
		this.setData({
			num: num
		});
	}

});