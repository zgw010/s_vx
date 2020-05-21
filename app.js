//app.js
App({
  onLaunch: function () {
    const _this = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        // console.log('app', res)
        if (res.data === '') return;
        const userInfo = JSON.parse(res.data);
        _this.globalData.userInfo = userInfo;
      },
      fail(err) { console.log(err) },
    });
  },
  globalData: {
    API: {
      login: 'https://www.iyyq.top/api/s/login',
      getRunDataList: 'https://www.iyyq.top/api/s/data/get_run_data_list',
      getRunData: 'https://www.iyyq.top/api/s/data/get_run_data',
      addRunData: 'https://www.iyyq.top/api/s/data/add_run_data',
    },
    userInfo: {},
  }
})