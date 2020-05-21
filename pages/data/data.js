const app = getApp();

const formatTime = date => {
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${formatNumber(month)}-${formatNumber(day)}`
}

const queryData = (startTime, endTime, _this) => {
  wx.request({
    method: 'GET',
    url: `${app.globalData.API.getRunDataList}?userID=${app.globalData.userInfo.UserID}&startTime=${startTime}&endTime=${endTime}`,
    success: (res) => {
      const list = res.data.data;
      list.forEach(data => data.time = Math.round((Number(new Date(data.EndTime.replace(/-/g, '/'))) - Number(new Date(data.StartTime.replace(/-/g, '/')))) / 1000 / 6) / 10)
      _this.setData({
        runList: list,
      })
      // console.log(list);
    },
    fail: (err) => { console.log(err) },
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: formatTime(new Date()),
    endTime: formatTime(new Date()),
    runList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    queryData(this.data.startTime, this.data.endTime, this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  changeStartTime: function (e) {
    // console.log('picke发送选择改变，携带值为', e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
  },
  changeEndTime: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endTime: e.detail.value
    })
  },
  query: function () {
    queryData(this.data.startTime, this.data.endTime, this);
  },
  details: function (e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/details/details?runDataID=${e.target.id}`,
    });
  },
})