// pages/popularize/popularize.js
const app = getApp();
var globalConfig = require('../../utils/config.js');
const login = require('../../utils/login.js');
const gloalConfig = globalConfig;
const cdnfile = gloalConfig.cdnfile + "/imi_mini";
import share from "../../utils/share.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnfile: cdnfile,
    judge: {},
    title: { nickName: "邀请好友", backbtn: true },
    avatarUrl: '',
    nickname: '用户名用户名',
    slogon: '人海茫茫，有趣的人相聚于此',
    imageUrls: [
      globalConfig.cdnstatic + "/mini/share/share01.png",
      globalConfig.cdnstatic + "/mini/share/share02.png",
      globalConfig.cdnstatic + "/mini/share/share03.png",
      globalConfig.cdnstatic + "/mini/share/share04.png",
      globalConfig.cdnstatic + "/mini/share/share05.png",
      globalConfig.cdnstatic + "/mini/share/share06.png",
      globalConfig.cdnstatic + "/mini/share/share07.png",
      globalConfig.cdnstatic + "/mini/share/share08.png",
      globalConfig.cdnstatic + "/mini/share/share09.png",
      globalConfig.cdnstatic + "/mini/share/share10.png",
      globalConfig.cdnstatic + "/mini/share/share11.png",
    ],
    imageUrl: '',
    currentImageCount: 0,
    canvasHidden: true,
    shareImgPath: '',
    shareAvatarPath: '',
    shareImgSrc: '',
    codeUrl: '',
    shareCodePath: ''
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
      imageUrl: that.data.imageUrls[0]
    }); 

    if (app.globalData.userId <= 0) {
      login.wxLogin(app.routeUrl());
      return;
    }
    
    that.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickname: app.globalData.userInfo.nickName
    })

    that.getAvatarImageInfo();
    that.getWxacodeUnlimited();
    that.getShareImageInfo();
    
  },

  /**
   * 用户头像
   */
  getAvatarImageInfo() {
    let that = this;
    console.log("avatarUrl: " + that.data.avatarUrl)
    wx.getImageInfo({
      src: that.data.avatarUrl,
      success: function (res) {
        that.setData({
          // shareImgPath: '../../' + res.path
          shareAvatarPath: res.path
        })
        console.log("shareAvatarPath: " + that.data.shareAvatarPath)
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  /**
   * 卡片图片
   */
  getShareImageInfo() {
    let that = this;
    console.log("imageUrl: " + that.data.imageUrl)
    wx.getImageInfo({
      src: that.data.imageUrl,
      success: function (res) {
        that.setData({
          // shareImgPath: '../../' + res.path
          shareImgPath: res.path
        })
        console.log("shareImgPath: " + that.data.shareImgPath)
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  /**
   * 小程序码
   */
  getWxacodeUnlimited() {
    let that = this;
    let path = '/imimini/share/unlimitAcode';
    let data = {
      token: app.globalData.token,
      scene: app.globalData.userId,
      method: "GET"
    }
    app.ajax(path, data, function(res) {
      that.setData({
        codeUrl: globalConfig.cdnstatic + res.url
      })
      console.log("codeUrl: " + that.data.codeUrl)
      wx.getImageInfo({
        src: that.data.codeUrl,
        success: function (res) {
          that.setData({
            shareCodePath: res.path
          })
          console.log("shareCodePath: " + that.data.shareCodePath)
        },
        fail(res) {
          console.log(res)
        }
      })  
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
    wx.navigateBack({

    })
  },

  refresh() {
    let that = this;
    let count = that.data.currentImageCount + 1;
    that.setData({
      currentImageCount: count,
      imageUrl: that.data.imageUrls[count % that.data.imageUrls.length]
    });
    that.getShareImageInfo()
  },

  saveShareImage() {
    let that = this;
    
    if (that.data.shareAvatarPath == '' || that.data.shareImgPath == '' || 
        that.data.shareCodePath == '') {
      wx.showToast({
        title: '图片绘制中，请稍后重试',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '保存图片中...',
    })
    
    const context = wx.createCanvasContext("shareCanvas")

    // 卡片图片
    context.drawImage(that.data.shareImgPath, 0, 0, 300, 332)
    // 底部白色背景
    context.setFillStyle("#fff")
    context.fillRect(0, 332, 300, 92)

    // 头像
    let avatarSize = 36
    let avatarX = 16
    let avatarY = 344
    context.save()
    context.beginPath()
    context.setStrokeStyle('#fff')
    context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, false)
    context.clip()
    context.drawImage(that.data.shareAvatarPath, avatarX, avatarY, avatarSize, avatarSize)
    context.closePath()
    context.restore()

    // 小程序码
    let codeSize = 103
    let codeX = 188
    let codeY = 300
    let innerSize = 100
    context.save()
    context.beginPath()
    context.setStrokeStyle('#fff')
    context.setFillStyle('#fff')
    context.arc(codeX + codeSize / 2, codeY + codeSize / 2, codeSize / 2, 0, Math.PI * 2, false)
    context.clip()
    context.fill()
    context.drawImage(that.data.shareCodePath, 189.5, 301.5, innerSize, innerSize)
    context.closePath()
    context.restore()
    
    // 用户名 宣传语
    context.setFillStyle('#000')
    context.setFontSize(15)
    context.fillText(that.data.nickname, 58, 372)
    context.setFontSize(12)
    context.fillText(that.data.slogon, 16, 400)

    context.draw()

    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300,
      height: 424,
      destWidth: 900,
      destHeight: 1272,
      canvasId: 'shareCanvas',
      success(res) {
        console.log(res)
        that.setData({
          shareImgSrc: res.tempFilePath
        })
        if (!res.tempFilePath) {
          wx.showModal({
            title: '提示',
            content: '图片绘制中，请稍后重试',
            showCancel: false
          })
        }
        wx.saveImageToPhotosAlbum({
          filePath: that.data.shareImgSrc,
          success(res) {
            console.log(res)
          }
        })
        wx.hideLoading()
      },
      fail(res) {
        console.log(res)
        wx.hideLoading()
      }
    }, this)

  }
})