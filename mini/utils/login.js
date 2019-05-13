const app = getApp();
const redis = require('redis.js');

function wxAutoLogin(cb){
  let that = this;
  let key = redis.get("logout")
  if (key == 1) {
    if ((typeof cb) == "function") {
      cb();
    }
    return
  }
  wx.getSetting({
    success(res) {
      if (res.authSetting["scope.userInfo"] && app.globalData.userId <= 0) {
        wx.getUserInfo({
          success: function (e) {
            let nickName = e.userInfo.nickName;
            let avatar = e.userInfo.avatarUrl;
            let path = "/imimini/login/byWx";
            let data = {
              code: app.globalData.code,
              nickName: nickName,
              avatarUrl: avatar,
              shareId: app.globalData.shareId,
              method: "GET"

            }
            app.ajax(path, data, function (resp) {
              let key = redis.get("logout")
              if (key == 1) {
                redis.remove("logout")
              }
              app.globalData.userId = resp.userId;
              app.globalData.token = resp.token;
              app.globalData.userInfo.nickName = resp.nickName;
              resp.avatar = ((resp.avatar.indexOf('//') == 0 || resp.avatar.indexOf('http') == 0) ? resp.avatar : gloalConfig.cdnstatic + resp.avatar);
              resp.avatar = resp.avatar.indexOf('http:') == 0 ? resp.avatar.replace("http", "https") : resp.avatar;
              app.globalData.userInfo.avatarUrl = resp.avatar;
              let _arr = {
                userId: app.globalData.userId,
                token: app.globalData.token,
                userInfo: app.globalData.userInfo
              }
              redis.put("wxLoginData", JSON.stringify(_arr), 3600 * 24 * 365);//秒
              if ((typeof cb) == "function") {
                cb();
              }
            });
          }
        })
      }else{
        if ((typeof cb) == "function") {
          cb();
        }
      }
    }
  })
}

function wxLogin(routeUrl){
  let userId = app.globalData.userId
  if (userId <= 0){
    wx.navigateTo({
      url: '../login/login?routeUrl=' + routeUrl
    });
  }
}

//绑定手机
function wxBindPhone(routeUrl) {
  wx.navigateTo({
    url: '../phoneBind/phoneBind?routeUrl=' + routeUrl
  });
}

module.exports = {
  wxAutoLogin,
  wxLogin,
  wxBindPhone
}