// pages/phoneLogin/phoneLogin.js
const app = getApp()
const gloalConfig = require('../../utils/config.js');
const redis = require('../../utils/redis.js');
const cdnfile = gloalConfig.cdnfile + "/imi_mini";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cdnfile: cdnfile,
    user: { nickName: "验证码登录", backbtn: true },
    judge: {},
    phoneNo : '',
    smscode : '',
    disabled : false,
    smsTime: 60,
    sendSmsText: '发送验证码',
    windowHigh: 0,
    smsBtndisabled: ""
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
  phoneLogin: function () {
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
      url: gloalConfig.baseUrl + "/imimini/login/byPhoneNo",
      data: {
        phoneNo: that.data.phoneNo,
        smsCode: that.data.smscode
      },
      success: resp => {
        if (resp.data.result == 10000){
          app.globalData.userId = resp.data.userId;
          app.globalData.token = resp.data.token;
          app.globalData.userInfo.nickName = resp.data.nickName;
          resp.data.avatar = ((resp.data.avatar.indexOf('//') == 0 || resp.data.avatar.indexOf('http') == 0) ? resp.data.avatar : gloalConfig.cdnstatic + resp.data.avatar);
          resp.data.avatar = resp.data.avatar.indexOf('http:') == 0 ? resp.data.avatar.replace("http", "https") : resp.data.avatar;
          app.globalData.userInfo.avatarUrl = resp.data.avatar;
          let _arr = {
            phoneNo: that.data.phoneNo,
            userId: app.globalData.userId,
            token: app.globalData.token,
            userInfo: app.globalData.userInfo
          }
          redis.put("phoneLoginData", JSON.stringify(_arr), 3600 * 24 * 365);//秒
          redis.remove("logout");
          //调到首页
          let url = "../index/index"
          if (that.routeUrl != undefined) {
            url = that.routeUrl
          }
          wx.navigateTo({
            url: url
          });
        }else{
          wx.showModal({
            title: '提示',
            content: '手机号未注册或登录失败',
            showCancel: false
          });
        }
      }
    })
  },
  //input输入结束了保存输入手机号
  inputPhoneOver : function(e){
    this.setData({phoneNo:e.detail.value})
  },
  //input输入结束了保存smscode
  inputsmsCode : function(e){
    this.setData({smscode:e.detail.value})
  },
  sendSmsCode : function(){
    let that = this;
    if (that.sendSmsCodeTimer == 1){return}
    that.sendSmsCodeTimer = 1
    if (that.data.phoneNo == ''){
      wx.showModal({
        title: '提示',
        content: '手机号不能为空',
        showCancel: false
      });
      return;
    }
    this.setData({ smsBtndisabled: "smsBtndisabled"})
    clearInterval(that.Timer);
    console.log(that.data.smsTime);
    that.Timer = setInterval(function () {
      let time = that.data.smsTime;
      if (time <= 0) {
        clearInterval(that.Timer);
        that.setData({ smsBtndisabled: "", sendSmsText: '发送验证码', smsTime: 60})
        that.sendSmsCodeTimer = 2;
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
      sendSmsText: "重新发送"+leftTime+"s"
    })
  },
  back: function () {
    wx.navigateBack({ delta: 1 });
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