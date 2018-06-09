var MD5 = require('../libs/md5.min')

function formatTime(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()

	var hour = date.getHours()
	var minute = date.getMinutes()
	var second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "";

	var uuid = s.join("");
	return uuid;
}

function getData(data) {
	var dataId = Date.now();
	var secret_key = 'ad999e4e5a85444dbe4b363e759da7f9ff6e9a35';
	var sign = MD5.getMD5('ShiboteWxAppid=' + dataId + secret_key);
	var devicesn = '';
	try {
		devicesn = wx.getStorageSync('uuid')
		if (devicesn) {
			data.devicesn = devicesn;
		}
	} catch (e) {}
	if (devicesn == '') {
		devicesn = uuid();
		wx.setStorageSync('uuid', devicesn);
		data.devicesn = devicesn;
	}
	return {
		id: dataId,
		caller: 'ShiboteWxApp',
		sign: sign,
		data: data
	};
}

function isPoneAvailable(str) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (!myreg.test(str)) {
        return false
    } else {
        return true
    }
}

function getStorage(key) {
    return wx.getStorageSync(key)
}

function setStorage(key, value) {
    return  wx.setStorageSync(key, value)
}

function getOpenId(key) {
    return wx.getStorageSync(key)
}

function skip(uri) {
    wx.navigateTo({
        url: uri
    })
}

function log() {
    console.log.apply(console, arguments)
}

function alert(title, type, url) {
    wx.showToast({
        title: title,
        icon: type || 'success',
        image: url || '',
        duration: 1500,
        mask: true,
    })
}

module.exports = {
	formatTime: formatTime,
	getData,
	formatNumber,
	getStorage,
	setStorage,
	getOpenId,
	isPoneAvailable,
	skip,
	log,
	alert,
}