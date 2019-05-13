// pages/becomeman/becomeman.js

const app = getApp()
const gloalConfig = require('../../utils/config.js');
import share from "../../utils/share.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: { nickName: "模板", backbtn: true },
    judge: {},
    dialDisplay: false
  },
  //抽奖入口
  luckyDraw(){
    let that = this;
    that.setData({
      dialDisplay: !that.data.dialDisplay
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
	  wx.showShareMenu({
      withShareTicket: true
    })

    that.setData({
      judge: { height: app.globalData.statusBarHeight }
    });
  },
  back: function () {
    wx.navigateBack();
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
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return share.shareObj();
  }
})