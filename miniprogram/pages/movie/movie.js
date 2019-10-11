import Notify from 'vant-weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: [],
    start: 0,
    count: 10
  },

  /**
   * 获取电影列表
   */
  getMovieList: function() {
    wx.showLoading({
        title: '加载中',
      }),

      this.setData({
        start: this.data.movieList.length
      })

    wx.cloud.callFunction({
      name: 'getmovielist',
      data: {
        start: this.data.start,
        count: 10
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading();
      this.setData({
        movieList: this.data.movieList.concat(res.result.subjects)
      })
    }).catch(err => {
      wx.hideLoading();
      Notify({
        type: 'warning',
        message: '加载失败！'
      });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMovieList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getMovieList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})