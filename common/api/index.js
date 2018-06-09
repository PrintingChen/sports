var utils = require('./../utils/utils')
var config = require('./../config')

// 登录
const Login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            success: function (res) {
                if (res.code) {
                    var data = utils.getData({
                        code: res.code
                    })
                    wx.request({
                        url: config.apiUrl + 'wxapp/user/onLogin',
                        data: data,
                        method: "POST",
                        success: function (res) {
                            utils.log('success===>', res)
                            if (res && res.data.code == config.successCode) {
                                utils.log(`onLogin成功`)
                                //缓存唯一标识
                                wx.setStorageSync('wxappid', res.data.data.wxappId)
                                wx.setStorageSync('openid', res.data.data.openid)
                                wx.setStorageSync('usersn', res.data.data.usersn)
                                resolve(res.data.data)

                            } else {
                                reject()
                                utils.alert('登录失败')
                            }
                        },
                        fail: function (err) {
                            reject(err)
                            utils.alert('请求超时')
                        }
                    })
                } else {
                    utils.log('获取code失败！' + res.errMsg)
                }
            },
            fail: function (err) {

            }
        })
    })
}

//获取用户详细信息
const GetUserDetail = (params) => {
    var data = utils.getData(params)
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.apiUrl + 'user/getDetail',
            data: data,
            method: "POST",
            success: function (res) {
                if (res && res.data.code == config.successCode) {
                    resolve(res.data.data)
                } else {
                    reject()
                }
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}

//获取手机验证码
const GetCode = (params) => {
    var data = utils.getData(params)
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.apiUrl + 'auth/code/get',
            data: data,
            method: "POST",
            success: function (res) {
                if (res && res.data.code == config.successCode) {
                    resolve(res.data.data)
                } else {
                    reject()
                }
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}

//验证手机
const VerifyPhone = (params) => {
    var data = utils.getData(params)
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.apiUrl + 'auth/code/verify',
            data: data,
            method: "POST",
            success: function (res) {
                if (res && res.data.code == config.successCode) {
                    resolve(res.data.data)
                } else {
                    reject()
                }
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}

//用户绑定手机
const BindMobile = (params) => {
    var data = utils.getData(params)
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.apiUrl + 'user/bindMobile',
            data: data,
            method: "POST",
            success: function (res) {
                if (res && res.data.code == config.successCode) {
                    resolve(res.data.data)
                } else {
                    reject()
                }
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}

//保存用户信息
const SaveUserInfo = (params) => {
    var data = utils.getData(params)
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.apiUrl + 'wxapp/user/saveWxappInfo',
            data: data,
            method: "POST",
            success: function (res) {
                if (res && res.data.code == config.successCode) {
                    resolve(res.data.data)
                } else {
                    reject()
                }
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}

module.exports = {
    Login,
    GetUserDetail,
    GetCode,
    VerifyPhone,
    BindMobile,
    SaveUserInfo,
}