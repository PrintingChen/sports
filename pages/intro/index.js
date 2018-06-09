var config = require('../../common/config');
var utils = require('../../common/utils/utils');
var WxParse = require('../../common/libs/wxParse/wxParse.js');
Page({
  onLoad(e) {
    var data = utils.getData({});
    var that = this;
    that.setData({ isLoading: true });
    wx.request({
      url: config.apiUrl + 'training/intro',
      data: data,
      method: "POST",
      success: function (res) {
        res = res.data;
        if (res.code == '200000') {
          WxParse.wxParse('article', 'html', res.data, that);
          that.setData({ isLoading: false, detail: res.data });
        }
      },
      error(){
        that.setData({ isLoading: false });
      }
    })
  },
  onShareAppMessage() {
  },
  data: {
    isLoading: false,
  }
});
