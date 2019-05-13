// pages/mine/mine.js
const app = getApp();
const login = require('../../utils/login.js');
const globalConfig = require('../../utils/config.js');
const gloalConfig = globalConfig;
const cdnfile = gloalConfig.cdnfile + "/imi_mini";
const redis = require('../../utils/redis.js');
import share from "../../utils/share.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnfile: cdnfile,
    judge: {},
    title: { nickName: "我", backbtn: true },
    userInfo: {
      avatar: '',
      nickname: '',
      userId: 0,
      attention: 0,
      fans: 0,
      goldAmount: 0,
      conchAmount: 0,
      vip: 0
    },
    openAppPanel: false,
    isOpenApp: false,
    audit: false
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
      userInfo: {
        avatar: app.globalData.userInfo.avatarUrl,
        nickname: app.globalData.userInfo.nickName
      }
    });

    if (app.globalData.userId <= 0) {
      login.wxLogin(app.routeUrl());
    } else {
      that.getUserDetail()
    }

    if (app.globalData.scene == 1036) {
      that.setData({
        isOpenApp: true
      })
    }

    let audit = app.globalData.config.audit
    audit = audit == "true" || audit == true ? false : true
    if (app.isEmptyObject(app.globalData.config)) {
      app.loadConfig(function () {
        that.setData({
          audit: audit
        })
      })
    } else {
      that.setData({
        audit: audit
      })
    }
  },
  getUserDetail() {
    // console.log('getUserDetail ' + app.globalData.token)
    let that = this;
    let path = "/imimini/user/getInfo"
    let data = {
      token: app.globalData.token
    }
    app.ajax(path, data, function (res) {
      console.log(res)
      if (res.result == 10000) {
        let avatar = res.avatar
        if (avatar.indexOf(globalConfig.cdnstatic) < 0) {
          avatar = globalConfig.cdnstatic + res.avatar
        }
        avatar = ((res.avatar.indexOf('//') == 0 || res.avatar.indexOf('http') == 0) ? res.avatar : globalConfig.cdnstatic + res.avatar);
        avatar = avatar.indexOf('http:') == 0 ? avatar.replace("http", "https") : avatar;
        console.log(avatar)
        let vipUrl = globalConfig.wxUrl + "pic/vip/VIP" + res.vipLevel + ".png"
        console.log(vipUrl)
        that.setData({
          userInfo: {
            avatar: avatar,
            nickname: res.nickName,
            userId: res.userId,
            attention: res.followCount,
            fans: res.fansCount,
            goldAmount: parseInt(res.amount),
            conchAmount: parseInt(res.conch),
            vip: vipUrl
          }
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
  onShareAppMessage: function () {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return share.shareObj();
  },

  back() {
    wx.navigateBack({})
  },

  startApp() {
    let that = this;
    that.setData({
      openAppPanel: !that.data.openAppPanel
    })
  },

  close() {
    let that = this;
    that.setData({
      openAppPanel: false
    })
  },
  logout(){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认退出登录？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.submitLogout();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  submitLogout(){
    let that = this;
    try {
      let key = redis.get("logout")
      if (!key) {
        redis.put("logout", 1, 3600 * 24 * 365);//秒
      }
      redis.remove("phoneLoginData")
      redis.remove("wxLoginData")
    } catch (e) { }
    wx.login({
      success: rs => {
        app.globalData.code = rs.code;
      }
    })
    app.globalData.userId = - parseInt(Math.random() * 1e6);
    app.globalData.token = undefined;
    app.globalData.userInfo = {}
    wx.reLaunch({
      url: "../index/index"
    });
  }
})