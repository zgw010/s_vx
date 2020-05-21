//index.js
//获取应用实例
const app = getApp()
const API = app.globalData.API;
const formatTime = date => {
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${year}-${formatNumber(month)}-${formatNumber(day)} ${hour}:${minute}:${second}`
}

let point = [];
let _this;
let len = 0;
let time = 0;
function drawline() {
  _this.setData({
    polyline: [{
      points: point,
      color: '#09bb07',
      width: 4,
      dottedLine: false
    }]
  });
}



function getLen(lat, lng) {
  const lastPiont = point[point.length - 1];
  const { latitude, longitude } = lastPiont;
  return GetDistance(latitude, longitude, lat, lng);
}

function GetDistance(lat1, lng1, lat2, lng2) {
  var rad1 = lat1 * Math.PI / 180.0;
  var rad2 = lat2 * Math.PI / 180.0;
  var a = rad1 - rad2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var r = 6378137;
  return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0);
}
Page({
  data: {
    polyline: [],
    isStart: false,
    startTime: 0,
    maxSpeed: 0,
    speed: 0,
    distance: 0,
    time: 0,
    kcal: 0,
  },
  //获取经纬度,并且计算累计移动长度和实时速度
  getlocation: function () {
    var lat, lng;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        lat = res.latitude;
        lng = res.longitude;
        const s = +getLen(lat, lng);
        const v = s / ((+new Date() - time) / 1000);
        // console.log('v', v, _this.data.maxSpeed);
        if (v > _this.data.maxSpeed) {
          _this.setData({ maxSpeed: Math.round(v * 100) / 100 });
        }
        _this.setData({ speed: Math.round(v * 100) / 100 });
        point.push({ latitude: lat, longitude: lng });
        time = +new Date();
        len += s;
        _this.setData({ distance: len });
        _this.setData({ kcal: (80 * len / 1000 * 1.036).toFixed(2) });
        _this.setData({ time: ((time - _this.data.startTime) / 1000 / 60).toFixed(2) });
      }
    });
  },
  onLoad: function () {
    // wx.setStorage({
    //   key: "userInfo",
    //   data: ""
    // });
    _this = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        // console.log('res.data', res.data);
        if (res.data === '') {
          wx.redirectTo({
            url: '/pages/login/login',
            // success(res) { console.log(res) },
            // fail(err) { console.log(err) },
          });
        } else {
          const userInfo = JSON.parse(res.data);
          if (userInfo.UserID === '') {
            wx.redirectTo({
              url: '/pages/login/login',
              // success(res) { console.log(res) },
              // fail(err) { console.log(err) },
            });
          } else {
            _this.setData({
              userInfo: userInfo
            });
          }
        }
      },
      // fail(err) { console.log(err) },
    });
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        _this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
        point.push({ latitude: res.latitude, longitude: res.longitude });
      }
    });
  },

  start: function () {
    this.timer = setInterval(repeat, 1000);
    this.setData({ isStart: true });
    this.setData({ startTime: +new Date() });
    time = +new Date();
    function repeat() {
      _this.getlocation();
      drawline();
    }
  },
  end: function () {
    const _this = this;
    clearInterval(this.timer);
    this.setData({ isStart: false, speed: 0 });
    setTimeout(() => { _this.setData({ speed: 0 }); }, 2000)
    const {
      polyline,
      startTime,
      maxSpeed,
      distance,
      kcal,
    } = this.data;
    console.log(
      {
        userInfo: app.globalData,
        userID: app.globalData.userInfo.UserID,
        track: JSON.stringify(polyline),
        calories: `${kcal}`,
        distance: `${distance}`,
        startTime: formatTime(new Date(startTime)),
        endTime: formatTime(new Date()),
        maxSpeed: `${maxSpeed}`,
        averageSpeed: `${distance / ((+new Date() - startTime) / 1000)}`,
      },
    );

    wx.request({
      method: 'POST',
      url: API.addRunData,
      data: {
        userID: app.globalData.userInfo.UserID,
        track: JSON.stringify(polyline),
        calories: `${kcal}`,
        distance: `${distance}`,
        startTime: formatTime(new Date(startTime)),
        endTime: formatTime(new Date()),
        maxSpeed: `${maxSpeed}`,
        averageSpeed: `${Math.round(distance / ((+new Date() - startTime) / 100000)) / 100}`,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'charset': 'utf-8'
      },
      success: (res) => {
        console.log(res);

      },
      fail: (err) => console.log(err),
    })
  },
  quit: function () {
    wx.setStorage({
      key: "userInfo",
      data: "",
      success: function () {
        wx.redirectTo({
          url: '/pages/login/login',
          // success(res) { console.log(res) },
          // fail(err) { console.log(err) },
        });
      }
    });
  },
  toDataPage: function () {
    wx.navigateTo({
      url: '/pages/data/data',
      // success(res) { console.log(res) },
      // fail(err) { console.log(err) },
    });
  },
});

