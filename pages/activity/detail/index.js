var config = require('../../../common/config');
var utils = require('../../../common/utils/utils');
var WxParse = require('../../../common/libs/wxParse/wxParse.js');
Page({
  onLoad(e) {
    var data = utils.getData({ uuid: e.id, isgetcon: true });
    var that = this;
    that.setData({ isLoading: true });
    wx.request({
      url: config.apiUrl + 'activity/detail',
      data: data,
      method: "POST",
      success: function (res) {
        res = res.data;
        that.setData({ isLoading: false });
        if (res.code == '200000') {
          WxParse.wxParse('article', 'html', res.data.content, that);
          let endTime = new Date(res.data.endTime.replace(/-/g, '/') + ':00');
          if (endTime < Date.now()) {
            res.data.status = 0;
          } else {
            res.data.status = 1;
          }
          that.setData({ detail: res.data });
        }
      }, error() {
        that.setData({ isLoading: false });
      }
    })
  },
  onShareAppMessage() {
  },
  data: {
    isLoading: false,
    info: {}
  }
});
