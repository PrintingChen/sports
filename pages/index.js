var config = require('../common/config');
var utils = require('../common/utils/utils');
var areaData = require('../common/utils/area.data');
Page({
  onLoad() {
    var province = ['全国'], city = ['全部'], multiIndex = 0;
    areaData.forEach((item, index) => {
      province.push(item.name);
      if (item.name == '广东') {
        multiIndex = index;
        item.childs.forEach(sitem => {
          city.push(sitem.name);
        })
      }
    })
    this.setData({
      multiIndex: [multiIndex + 1, city.findIndex(item => item == '广州')],
      multiIndexActive: [multiIndex + 1, city.findIndex(item => item == '广州')],
      multiArray: [province, city]
    })
    this.getList({
      "province": '广东',
      "city": '广州',
      "pageNumber": 1
    });
  },
  goDetail() {
    wx.navigateTo({
      url: '/pages/intro/index',
    })
  },
  onShareAppMessage() {
    return {
      title: '仕伯特足球培训',
      path: '/pages/index?id=21',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  data: {
    isLoading: false,
    noMoreData: false,
    noData: false,
    pageNumber: 1,
    multiIndex: 0,
    multiIndexActive: [],
    multiArray: [
      [],
      []
    ],
    list: []
  },
  goHome() {
    wx.navigateTo({ url: 'example/index' });
  },
  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      multiIndex: e.detail.value,
      pageNumber: 1,
      noMoreData: false,
      noData: false,
      multiIndexActive: [e.detail.value[0], e.detail.value[1]],
    })
    this.setData({ list: [], isLoading: true });
    if (e.detail.value[0] === 0 && e.detail.value[1] === 0) {
      this.getList({
        province: '',
        city: '',
        "pageNumber": 1
      });
    } else if (e.detail.value[0] !== 0 && e.detail.value[1] === 0) {
      this.getList({
        "province": this.data.multiArray[0][e.detail.value[0]],
        city: '',
        "pageNumber": 1
      });
    } else {
      this.getList({
        "province": this.data.multiArray[0][e.detail.value[0]],
        "city": this.data.multiArray[1][e.detail.value[1]],
        "pageNumber": 1
      });
    }
  },
  getList(params) {
    var data = utils.getData(params);
    var that = this;
    if (this.data.noMoreData || this.data.noData) return;
    this.setData({ isLoading: true })
    wx.request({
      url: config.apiUrl + 'kindergarten/list',
      data: data,
      method: "POST",
      success: function (res) {
        res = res.data;
        if (res.code == '200000') {
          if (res.data.length == 0 && that.data.pageNumber == 1) {
            that.setData({ noData: true });
          }
          if (res.data.length > 0 && res.data.length < 5) {
            that.setData({ noMoreData: true, noData: false });
          }
          if (res.data.length == 0 && that.data.pageNumber > 1) {
            that.setData({ noMoreData: true, noData: false });
          }
          if (res.data.length != 0) {
            var list = that.data.list;
            res.data.forEach(sitem => {
              if(!list.find(item=>item.id==sitem.id)){
                list.push(sitem);
              }
            })
            that.setData({ list: list });
          }
        }
        that.setData({ isLoading: false, pageNumber: that.data.pageNumber + 1 });
      }, error() {
        that.setData({ isLoading: false });
      }
    })
  },
  bindMultiPickerColumnChange(e) {
    var provinces = this.data.multiArray[0];
    if (e.detail.column === 1) return;
    if (provinces[e.detail.value] == '全国') {
      this.setData({
        multiArray: [provinces, ['全部']]
      })
    } else {
      areaData.forEach(item => {
        if (item.name == provinces[e.detail.value]) {
          var city = ['全部'];
          item.childs.forEach(sitem => {
            city.push(sitem.name);
          })
          this.setData({
            multiArray: [provinces, city]
          })
        }
      })
    }
    console.log('修改的列为', e.detail.column, '，值为', this.data.multiArray[0][e.detail.value]);
  },
  goLink: function () {
    // this.setData({
    // 	message: 'lewlkj '
    // })
    // wx.navigateTo({url:'example/button/button'});
    //wx.chooseImage({
    //   count: 1, // 默认9
    //   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //   success: function (res) {
    //     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    //     var tempFilePaths = res.tempFilePaths
    //   }
    // })
    const page = getCurrentPages();
    wx.showToast({
      title: page[0].route,
      icon: 'success',
      time: 3000
    })
  },
  onReachBottom() {
    var province = this.data.multiArray[0][this.data.multiIndex[0]], city = this.data.multiArray[1][this.data.multiIndex[1]];
    this.getList({
      "province": province == '全部' ? '' : province,
      "city": city == '全部' ? '' : city,
      "pageNumber": this.data.pageNumber
    });
  }
});
