// pages/searchemcee/searchemcee.js
const app = getApp()
const login = require('../../utils/login.js');
const gloalConfig = require('../../utils/config.js');
const cdnfile = gloalConfig.cdnfile + "/imi_mini";

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    styleIsolation: 'apply-shared'
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
    msg: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputValue(e){
      let that = this
      that.setData({
        msg: e.detail.value
      })
    },
    goRoom(){
      let that = this
      wx.navigateTo({
        url: '../imi/imi?hostId=' + that.data.msg,
      })
    }
  },
  attached() {
    // console.log("display", this.properties.propA);
  },
})