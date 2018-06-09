var config = require('../../common/config');
var utils = require('../../common/utils/utils');
Page({
  onLoad(e) {
    console.log(e);
    var that = this;
    var data = utils.getData({ kindergartenId: e.id });
    wx.request({
      url: config.apiUrl + 'kindergarten/index',
      data: data,
      method: "POST",
      success: function (res) {
        res = res.data;
        if (res.code == '200000') {
          that.setData({ detail: res.data });
        }
      }, error() {
      }
    })
    this.id = e.id;
    this.getList({ pageNumber: 1, kindergartenId: e.id });
  },
  onShareAppMessage() {
  },
  data: {
    isLoading: false,
    noMoreData: false,
    noData: false,
    pageNumber: 1,
    list: [],
    detail: null
  },
  getList(params) {
    var data = utils.getData(params);
    var that = this;
    if (this.data.noMoreData || this.data.noData) return;
    this.setData({ isLoading: true })
    wx.request({
      url: config.apiUrl + 'training/note/list',
      data: data,
      method: "POST",
      success: function (res) {
        res = res.data;
        if (res.code == '200000') {
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
    this.getList({ pageNumber: this.data.pageNumber, kindergartenId: this.id });
  },
  goIntro(e) {
    wx.navigateTo({
      url: '/pages/school/intro/index?id=' + e.currentTarget.dataset.id,
    })
  },
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/school/detail/index?id=' + e.currentTarget.dataset.id,
    })
  }
});
