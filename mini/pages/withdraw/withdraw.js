const app = getApp();
const login = require('../../utils/login.js');
import share from "../../utils/share.js";
const gloalConfig = require('../../utils/config.js');
const cdnfile = gloalConfig.cdnfile + "/imi_mini";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnfile: cdnfile,
    judge: {},
    title: { nickName: "红包提现", backbtn: true },
    avatarUrl: '',
    balance: 0.0,
    downloadLink: 'http://m.happyia.com/index_g.html?from=100000&imcn=100011',
    openAppPanel: false,
    isOpenApp: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    let that = this;
    that.setData({
      judge: {
        height: app.globalData.statusBarHeight
      },
      balance: options.balance
    });

    if (app.globalData.userId <= 0) {
      login.wxLogin(app.routeUrl());
      return;
    }

    that.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl
    })

    if (app.globalData.scene == 1036) {
      that.setData({
        isOpenApp: true
      })
    }
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return share.shareObj();
  },

  startApp() {
    let that = this;
    that.setData({
      openAppPanel: !that.data.openAppPanel
    })
  },

  copyLink() {
    let that = this;
    wx.setClipboardData({
      data: that.data.downloadLink,
    })
  },

  back () {
    wx.navigateBack({
      
    })
  },

  close() {
    let that = this;
    that.setData({
      openAppPanel: false
    })
  }
})