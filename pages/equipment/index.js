var config = require('../../common/config');
var utils = require('../../common/utils/utils');
Page({
  goDetail: function(e) {
    wx.navigateTo({
      url: '/pages/equipment/detail/index?id=' + e.currentTarget.dataset.id,
    })
  },
  onLoad(e) {
    console.log(e);
    this.getList({ pageNumber: 1 });
  },
  onShareAppMessage() {
  },
  data: {
    isLoading: false,
    noMoreData: false,
    noData: false,
    pageNumber: 1,
    list: []
  },
  getList(params) {
    var data = utils.getData(params);
    var that = this;
    if (this.data.noMoreData || this.data.noData) return;
    this.setData({ isLoading: true })
    wx.request({
      url: config.apiUrl + 'product/list',
      data: data,
      method: "POST",
      success: function (res) {
        res = res.data;
        if (res.code == '200000') {
          res.data.forEach(item => {
            var endTime = new Date(item.endTime).getTime();
            if (endTime > res.timestamp) {
              item.status = 1;
            } else {
              item.status = 0;
            }
          })
          if (res.data.length == 0 && that.data.pageNumber == 1) {
            that.setData({ noData: true });
          }
          if ((res.data.length > 0 && res.data.length < 5) || (res.data.length == 0 && that.data.pageNumber > 1)) {
            that.setData({ noMoreData: true, noData: false });
          }
          if (res.data.length != 0) {
            that.setData({ list: that.data.list.concat(res.data) });
          }
        }
        that.setData({ isLoading: false, pageNumber: that.data.pageNumber + 1 });
      }, error() {
        that.setData({ isLoading: false });
      }
    })
  },
  onReachBottom() {
    this.getList({ pageNumber: this.data.pageNumber });
  }
});
