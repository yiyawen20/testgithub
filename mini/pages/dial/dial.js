// pages/dial/dial.js
const app = getApp()
const login = require('../../utils/login.js');
const gloalConfig = require('../../utils/config.js');
const cdnfile = gloalConfig.cdnfile + "/imi_mini";
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    propA: {
      type: Boolean// 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cdnfile: cdnfile,
    animationData: {},
    dialDisabled: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    startDial(){
      let that = this;
      that.goDial();
    },
    goDial(){
      let that = this;
      if (app.globalData.userId <= 0) {
        //请登录
        login.wxLogin(app.routeUrl());
        return
      }
      if(that.dialSwitch == 1){
        return;
      }
      that.dialSwitch = 1;
      let path = "/imimini/share/userLottery", data = {};
      app.ajax(path, data, function(res){
        let result = res.result;
        if (result == 10000){
          let awardText = res.awardText;
          let awardIndex = res.position - 1;

          // 获取奖品配置
          /*var awardsConfig = app.globalData.awardsConfig,
            len = awardsConfig.awards.length,
            runNum = 8*/
          let times = res.num, len = 6, runNum = 8;

          // 旋转抽奖
          app.globalData.runDegs = app.globalData.runDegs || 0
          app.globalData.runDegs = app.globalData.runDegs + (360 - app.globalData.runDegs % 360) + (360 * runNum - awardIndex * (360 / len)) + 180;
          console.log('deg', app.globalData.runDegs, "awardIndex", awardIndex);

          let dialAnimation = wx.createAnimation({
            transformOrigin: "50% 50%",
            delay: 0,
            duration: 4e3,
            timingFunction: "ease"
          })
          dialAnimation.rotate(app.globalData.runDegs).step()
          that.setData({
            animationData: dialAnimation.export(),
            dialDisabled: "dial_disabled"
          })

          setTimeout(() => {
            let contentMain = awardIndex == 2 ? "谢谢参与" : "获得" + awardText;
            let title = awardIndex == 2 ? "提示" : "恭喜"
            wx.showModal({
              title: title,
              content: contentMain,
              showCancel: false,
              success: function (res) {
                that.dialSwitch = 2;
                that.setData({
                  dialDisabled: ""
                });
              }
            })
          }, 4e3);
        } else if (result == 11000){
          //次数不足
          wx.showModal({
            title: "提示",
            content: "次数不足",
            showCancel: false,
            success: function (res) {
              that.dialSwitch = 2;
            }
          })
        }
      })
    },
    close(e){
      let that = this;
      that.triggerEvent('close');
      app.globalData.runDegs = 0;
    }
  },
  attached() {
    // console.log("display", this.properties.propA);
  },
})