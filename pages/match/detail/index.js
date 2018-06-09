var config = require('../../../common/config');
var utils = require('../../../common/utils/utils');
var WxParse = require('../../../common/libs/wxParse/wxParse.js');
Page({
  onLoad(e) {
    var data = utils.getData({ matchUuid: e.id, currentTime: Date.now() });
    var that = this;
    that.setData({ isLoading: true });
    wx.request({
      url: config.apiUrl + 'match/detail',
      data: data,
      method: "POST",
      success: function (res) {
        var errorInfo = res;
        res = res.data;
        if (res.code == '200000') {
          // WxParse.wxParse('article', 'html', res.data, that);
          that.setData({ isLoading: false, data: res.data });
        }else{
          console.log(res)
          that.setData({ isLoading: false, loadError: errorInfo });
        }
      },
      error() {
        that.setData({ isLoading: false });
      }
    })
  },
  onShareAppMessage() {
  },
  data: {
    isLoading: false,
    data: null,
    loadError: null
  }
});
