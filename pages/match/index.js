var config = require('../../common/config');
var utils = require('../../common/utils/utils');
Page({
  onShareAppMessage() {
  },
  data: {
    isLoading: false,
    noMoreData: false,
    noData: false,
    isLoading1: false,
    noMoreData1: false,
    noData1: false,
    pageNumber: 1,
    pageNumbser1: 1,
    tabs: ["焦点赛事", "赛事回顾"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    list1: [],
    list: []
  },
  onLoad(e) {
    this.getList({ pageNumber: 1 });
    this.getList1({ pageNumber: 1 });
  },
  onReachBottom() {
    if (this.data.activeIndex === 0) {
      this.getList({ pageNumber: this.data.pageNumber });
    } else {
      this.getList1({ pageNumber: this.data.pageNumber1 });
    }
  },
  getList(params) {
    var data = utils.getData(params);
    var that = this;
    if (this.data.noMoreData || this.data.noData) return;
    this.setData({ isLoading: true })
    wx.request({
      url: config.apiUrl + 'competition/caveats',
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
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/match/detail/index?id=' + e.currentTarget.dataset.id,
    })
  },
  goList(e) {
    wx.navigateTo({
      url: '/pages/match/list/index?id=' + e.currentTarget.dataset.id,
    })
  },
  getList1(params) {
    var data = utils.getData(params);
    var that = this;
    if (this.data.noMoreData1 || this.data.noData1) return;
    this.setData({ isLoading1: true })
    wx.request({
      url: config.apiUrl + 'competition/reviews',
      data: data,
      method: "POST",
      success: function (res) {
        res = res.data;
        if (res.code == '200000') {
          if (res.data.length == 0 && that.data.pageNumber1 == 1) {
            that.setData({ noData1: true });
          }
          if ((res.data.length > 0 && res.data.length < 5) || (res.data.length == 0 && that.data.pageNumber1 > 1)) {
            that.setData({ noMoreData1: true, noData1: false });
          }
          if (res.data.length != 0) {
            that.setData({ list1: that.data.list1.concat(res.data) });
          }
        }
        that.setData({ isLoading1: false, pageNumber1: that.data.pageNumber1 + 1 });
      }, error() {
        that.setData({ isLoading1: false });
      }
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});
