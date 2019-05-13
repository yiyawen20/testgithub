// pages/phoneBind/phoneBind.js
const app = getApp()
const gloalConfig = require('../../utils/config.js');
const cdnfile = gloalConfig.cdnfile + "/imi_mini";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnfile: cdnfile,
    user: { nickName: "绑定手机号", backbtn: true },
    judge: {},
    phoneNo: '',
    smscode: '',
    disabled: false,
    smsTime: 60,
    sendSmsText: '发送验证码',
    windowHigh: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.routeUrl = options.routeUrl;
    var res = wx.getSystemInfoSync();
    let windowHeight = res.windowHeight * 750 / res.windowWidth;
    this.setData({
      judge: { height: app.globalData.statusBarHeight },
      windowHigh: windowHeight - app.globalData.statusBarHeight - 86
    });
  },
  phoneBind: function () {
    let that = this;
     if (that.data.phoneNo == '' || that.data.smscode == '') {
       wx.showModal({
         title: '提示',
         content: '手机号和验证码不能为空',
         showCancel: false
       });
       return;
     }
    wx.request({
      url: gloalConfig.baseUrl + "/imimini/login/bindPhone",
      data: {
        phoneNo: that.data.phoneNo,
        smsCode: that.data.smscode,
        token:app.globalData.token
      },
      success: resp => {
        console.log(resp.data.result);
        var content = '';
        if (resp.data.result == 12003){
          content = '手机号已经绑定其他号';
        } else if (resp.data.result == 12002){
          content = '手机号格式不对';
        } else if (resp.data.result == 12004){
          content = '验证码有误';
        } else if (resp.data.result == 12005){
          content = '该账号已经绑定了手机号'
        } else{
            let url = "../index/index"
            if (that.routeUrl != undefined) {
              url = that.routeUrl
            }
            wx.navigateTo({
              url: url
            });
        }
        if(content != ''){
          wx.showModal({
            title: '提示',
            content: content,
            showCancel: false
          });
        }        
      }
    })
  },
  //input输入结束了保存输入手机号
  inputPhoneOver: function (e) {
    this.setData({ phoneNo: e.detail.value })
  },
  //input输入结束了保存smscode
  inputsmsCode: function (e) {
    this.setData({ smscode: e.detail.value })
  },
  sendSmsCode: function () {
    let that = this;
    if (that.data.phoneNo == '') {
      wx.showModal({
        title: '提示',
        content: '手机号不能为空',
        showCancel: false
      });
      return;
    }
    this.setData({ disabled: true})
    clearInterval(this.Timer);
    console.log(that.data.smsTime);
    this.Timer = setInterval(function () {
      let time = that.data.smsTime;
      if (time <= 0) {
        clearInterval(this.Timer);
        that.setData({ disabled: false,sendSmsText: '发送验证码' })
        return;
      }
      time--;
      console.log(time);
      that.smsLeftTime(time);
    }, 1e3);
    wx.request({
      url: gloalConfig.baseUrl + "/imimini/login/getSmsCode",
      data: {
        phoneNo: that.data.phoneNo
      },
      success: resp => {
        console.log(resp.data.result);
      }
    })
  },
  smsLeftTime(leftTime) {
    this.setData({
      smsTime: leftTime,
      sendSmsText: "重新发送" + leftTime + "s"
    })
  },
  back: function () {
    wx.navigateBack({ delta: 1 });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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