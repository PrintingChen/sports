var config = require('../../../common/config');
var utils = require('../../../common/utils/utils');
var WxParse = require('../../../common/libs/wxParse/wxParse.js');
Page({
  onLoad(e) {
    var data = utils.getData({ trainingNoteUuid: e.id });
    var that = this;
    that.setData({ isLoading: true });
    wx.request({
      url: config.apiUrl + 'training/note/detail',
      data: data,
      method: "POST",
      success: function (res) {
        res = res.data;
        if (res.code == '200000') {
          WxParse.wxParse('article', 'html', res.data.content, that);
          var time = new Date(res.data.createTime);
          res.data.dateTime = time.getFullYear() + '/' + utils.formatNumber(time.getMonth() + 1) + '/' + utils.formatNumber(time.getDate()) + ' ' + utils.formatNumber(time.getHours()) + ':' + utils.formatNumber(time.getMinutes()) + ':' + utils.formatNumber(time.getSeconds());
          that.setData({ isLoading: false, detail: res.data });
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
  }
});
