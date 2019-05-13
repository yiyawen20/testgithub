const app = getApp()
const gloalConfig = require('../../utils/config.js');
const redis = require('../../utils/redis.js');
const cdnfile = gloalConfig.cdnfile + "/imi_mini";

// login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cdnfile: cdnfile,
    user: { nickName: "登录账号", backbtn: true},
    judge: {},
    windowHigh : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.routeUrl = options.routeUrl;
    var res = wx.getSystemInfoSync();
    let windowHeight = res.windowHeight * 750 / res.windowWidth;
    this.setData({
      judge: { height: app.globalData.statusBarHeight},
      windowHigh: windowHeight - app.globalData.statusBarHeight - 86
    });
  },
  toPhoneLogin : function(){
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 2] //获取当前页面的对象
    let url = currentPage.route //当前页面url
    let routeUrl = url.replace("pages", "..");
    wx.navigateTo({
      url: '../phoneLogin/phoneLogin?routeUrl=' + routeUrl
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

  },
  back: function () {
    //写该值很大，就是直接返回首页
    wx.navigateBack({});
  },
  onGotUserInfo(e) {
    let that = this;
    console.log(e);
    if(e.detail.userInfo){
      var nickName = e.detail.userInfo.nickName;
      var avatar = e.detail.userInfo.avatarUrl;
      wx.request({
        url: gloalConfig.baseUrl + "/imimini/login/byWx",
        data: {
          code: app.globalData.code,
          nickName: encodeURI(nickName, "utf-8"),
          avatar: avatar,
          shareId: app.globalData.shareId
        },
        success: resp => {
          let key = redis.get("logout")
          if (key == 1) {
            redis.remove("logout")
          }
          app.globalData.userId = resp.data.userId;
          app.globalData.token = resp.data.token;
          app.globalData.userInfo.nickName = resp.data.nickName;
          resp.data.avatar = ((resp.data.avatar.indexOf('//') == 0 || resp.data.avatar.indexOf('http') == 0) ? resp.data.avatar : gloalConfig.cdnstatic + resp.data.avatar);
          resp.data.avatar = resp.data.avatar.indexOf('http:') == 0 ? resp.data.avatar.replace("http", "https") : resp.data.avatar;
          app.globalData.userInfo.avatarUrl = resp.data.avatar;
          
          let _arr = {
            userId: app.globalData.userId,
            token: app.globalData.token,
            userInfo: app.globalData.userInfo
          }
          redis.put("wxLoginData", JSON.stringify(_arr), 3600 * 24 * 365);//秒

          //调到首页
          let  url = "../index/index"
          if (that.routeUrl != undefined){
            url = that.routeUrl
          }
          wx.navigateTo({
            url: url
          });
        }
      })
    }
  }
})