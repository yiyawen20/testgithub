// pages/haha/haha.js
const app = getApp();
const gloalConfig = require('../../utils/config.js');
const login = require('../../utils/login.js');
const cdnfile = gloalConfig.cdnfile + "/imi_mini";
import share from "../../utils/share.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnfile: cdnfile,
    judge: {},
    title: { nickName: "分享拿红包", backbtn: true},
    listData: [],
    curAmount: 0.0,
    lotteryNum: 0,
    dialDisplay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      judge: { 
        height: app.globalData.statusBarHeight 
      },
    });
    
    console.log(app.globalData.userId)
    if (app.globalData.userId <= 0) {
      login.wxLogin(app.routeUrl());
      return;
    }

    that.getShareList()
  },

  getShareList() {
    console.log(app.globalData.userInfo)
    let that = this;
    let path = "/imimini/share/redPackageList"
    let data = {
      token: app.globalData.token
    }
    app.ajax(path, data, function(res) {
      console.log(res)
      if (res.result == "10000") {
        that.setData({
          listData: res.userList,
          curAmount: res.curAmount,
          lotteryNum: res.lotteryNum
        })
      }
    })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return share.shareObj();
  },

  back: function () {
    wx.navigateBack({
      
    })
  },

  withdraw() {
    let that = this;
    let balance = that.data.curAmount
    wx.navigateTo({
      url: '../withdraw/withdraw?balance=' + balance,
    })
  },

  lottery() {
    let that = this;
    that.setData({
      dialDisplay: !that.data.dialDisplay
    })
  },

  navToPopularize() {  
    wx.navigateTo({
      url: '../popularize/popularize',
    })
  }
})