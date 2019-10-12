import Notify from 'vant-weapp/notify/notify';
// import Msg from 'weui-miniprogram/msg/msg';

//初始化云数据库
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieid: -1,
    details: {},
    content: '',
    rate: 0,
    selectFile: [],
    uplaodFile: [],
    temFiles: [],
    files: [],
    fileIds: []
  },

  /**
   * 评价
   */
  onContentChange: function(event) {
    this.setData({
      content: event.detail
    });
  },
  /**
   * 评分
   */
  onRateChange: function(event) {
    this.setData({
      rate: event.detail
    });
  },

  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  selectFile: function(files) {
    this.setData({
      temFiles: []
    })

    this.setData({
      temFiles: this.data.temFiles.concat(files.tempFilePaths)
    })
    // 返回false可以阻止某次文件上传
  },

  /**
   * 删除照片
   */
  deleteFile: function(e) {
    this.data.files.splice(e.detail.index, 1)
    this.data.temFiles.splice(e.detail.index, 1)
    this.setData({
      files: this.data.files,
      temFiles: this.data.temFiles
    })
  },

  uplaodFile: function(files) {
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      for (let i = 0; i < this.data.temFiles.length; i++) {
        let item = this.data.temFiles[i];
        let suffix = /\.\w+$/.exec(item)[0]; //正则表达式，返回文件扩展名 

        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix, //上传至云端的路径
          filePath: this.data.temFiles[i], // 文件路径
        }).then(res => {
          let json = {
            url: this.data.temFiles[i]
          }
          this.setData({
            files: this.data.files.concat(json),
            fileIds: this.data.fileIds.concat(res.fileID)
          })

        }).catch(error => {
          console.log(error)
        })
      }
    })
  },

  /**
   * 提交评价
   */
  submitComment: function() {
    wx.showLoading({
      title: '评价提交中',
    })

    db.collection('comment').add({
      data: {
        movieid: this.data.movieid,
        content: this.data.content,
        rate: this.data.rate,
        fileIds: this.data.fileIds
      }
    }).then(res => {
      // wx.hideLoading();
      wx.showToast({
        title: '提交成功'
      })

      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)

    }).catch(err => {
      console.log(err)
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })

    this.setData({
      movieid: Number(options.movieid),
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })

    wx.cloud.callFunction({
      name: 'getdetail',
      data: {
        movieid: this.data.movieid
      }
    }).then(res => {
      this.setData({
        details: res.result
      })

      wx.hideLoading();
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})