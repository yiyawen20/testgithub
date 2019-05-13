const app = getApp();
const gloalConfig = require('config.js');

const shareObj = date =>{
  let userId = app.globalData.userId;  
  let arr = [];
  arr = date || app.splitList(app.globalData.config.shareTitle);
  let ran = Math.floor(Math.random() * arr.length);
  let brr = arr[ran];
  if (brr.length == 0){return}
  // 分析数据上报
  app.shareReport(userId, brr[0], brr[1], 1)
  wx.reportAnalytics('share_click_num', {
    shareid: brr[0],
    title: brr[1],
    shareuserId: userId
  });
  return {
    title: brr[1],
    path: "/pages/index/index?userId=" + userId + "&shareId=" + brr[0],
    imageUrl: gloalConfig.cdnfile + "/imi_mini/images/" + brr[0] +".png",
    success: function(e) {
      let userId = app.globalData.userId;
      app.shareReport(userId, brr[0], 1);
      //console.log(userId, brr[0], 1, "yiyawen");
    }
  }
}

module.exports = {
  shareObj: shareObj
}
