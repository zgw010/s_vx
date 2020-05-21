const app = getApp();

function drawline() {
  _this.setData({
    polyline: [{
      points: point,
      color: '#99FF00',
      width: 4,
      dottedLine: false
    }]
  });
}

Page({
  data: {
    polyline: [],
    startTime: '',
    endTime: '',
    averageSpeed: '',
    maxSpeed: '',
    sistance: '',
    calories: '',
    time: '',
  },
  onLoad: function (option) {
    const _this = this;
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     _this.setData({
    //       longitude: res.longitude,
    //       latitude: res.latitude,
    //     });
    //     // point.push({ latitude: res.latitude, longitude: res.longitude });
    //   }
    // });
    wx.request({
      method: 'GET',
      url: `${app.globalData.API.getRunData}?runDataID=${option.runDataID}`,
      success: (res) => {
        console.log(res);
        const {
          StartTime,
          EndTime,
          AverageSpeed,
          MaxSpeed,
          Distance,
          Calories,
          Track,
        } = res.data.data;
        const track = JSON.parse(Track);
        console.log(track)
        _this.setData({
          startTime: StartTime,
          endTime: EndTime,
          averageSpeed: AverageSpeed,
          maxSpeed: MaxSpeed,
          distance: Distance,
          calories: Calories,
          polyline: track,
          time: Math.round((Number(new Date(EndTime.replace(/-/g, '/'))) - Number(new Date(StartTime.replace(/-/g, '/')))) / 1000 / 6) / 10,
          longitude: track[0].points[0].longitude,
          latitude: track[0].points[0].latitude,
        })
      },
      fail: (err) => { console.log(err) },
    });
  },
});

