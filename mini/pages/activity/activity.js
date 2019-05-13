// pages/activity/activity.js
const app = getApp();
const gloalConfig = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // console.log(options, app.globalData, app.globalData.config.server, gloalConfig.Config.env, new Date().getTime());
    let url = decodeURIComponent(options.url);
    let roomId = options.roomId;
    let imToken = app.globalData.token;
    let userId = app.globalData.userId;
    let fromType = app.globalData.config.fromType || gloalConfig.Config.fromType;
    let env = gloalConfig.Config.env;
    let server = gloalConfig.Config.server;
    let v = new Date().getTime();
    let linkUrl = url.split("?")[0];
    that.setData({
      srcUrl: linkUrl + "?server=" + server + "&imToken=" + imToken + "&roomId=" + roomId + "&userId=" + userId + "&fromType=" + fromType + "&env=" + env + "&v=" + v
    });
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

  }
})