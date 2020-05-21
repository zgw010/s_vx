const app = getApp();
const API = app.globalData.API;
Page({
  data: {
    userName: '',
    userPassword: '',
  },
  onLoad: function () {
  },
  login: function () {
    console.log(this.data.userName, this.data.userPassword)
    wx.request({
      method: 'POST',
      url: API.login,
      data: {
        userName: this.data.userName,
        userPassword: this.data.userPassword,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'charset': 'utf-8'
      },
      success: (res) => {
        console.log(res);
        app.globalData.userInfo = JSON.parse(res.data.userInfo);
        wx.setStorage({
          key: 'userInfo',
          data: res.data.userInfo,
          success: () => wx.redirectTo({
            url: '/pages/index/index',
            success(res) { console.log(res) },
            fail(err) { console.log(err) },
          }),
        })
      },
      fail: () => { },
    })

  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    });
  },
  userPasswordInput: function (e) {
    this.setData({
      userPassword: e.detail.value
    });
  },
})
