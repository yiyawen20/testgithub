// wxlogin yyw

const redis = require('redis');
const appRequest = require("network");

function wxAutoLogin(cb){
    let that = this;
    let key = redis.get("logout");
    if (key == 1) {//表示当前为退出状态，不能自动登录
      if ((typeof cb) == "function") {
        cb();
      }
      return
    }

    let sysInfo = window.wx.getSystemInfoSync();
    //获取微信界面大小
    let width = sysInfo.screenWidth;
    let height = sysInfo.screenHeight;



    console.log("微信登录");
    let button = wx.createUserInfoButton({
        type: 'text',
        text: '获取用户信息',
        style: {
          left: 0,
          top: 0,
          width: width,
          height: height,
          lineHeight: height,
          backgroundColor: '#00000050',
          color: '#ffffff',
          textAlign: 'center',
          fontSize: 16,
          borderRadius: 0
        }
      })
      button.onTap((res) => {
        if (res.userInfo) {
            console.log("登录信息" + res);
            //此时可进行登录操作
            wx.login({
              success: rs => {
                redis.put("author", "yyw", 3600 * 24 * 365);
                window.code = rs.code;
                let encryptedData = res.encryptedData
                let iv = res.iv;
                let nickName = res.userInfo.nickName;
                let avatar = res.userInfo.avatarUrl;
                let path = "imimini/login/byWx";
                let data = {
                    appId: "wx14e14e780984fa4e",
                    encryptedData: encryptedData,
                    iv: iv,
                    code: code,
                    nickName: nickName,
                    avatarUrl: avatar,
                    shareId: shareId

                }
                let _url = config.baseReqUrl;
                config.baseReqUrl = loginReqUrl[config.env];
                appRequest.Get(path, data, function(resp){
                    config.baseReqUrl = _url;
                    let key = redis.get("logout");
                    if (key == 1) {
                        redis.remove("logout");
                    }
                    userId = resp.userId;
                    token = resp.token;
                    userInfo.nickName = resp.nickName;
                    userInfo.avatarUrl = resp.avatar;
                    let _arr = {
                        userId: userId,
                        token: token,
                        userInfo: userInfo
                    }
                    redis.put("wxLoginData", JSON.stringify(_arr), 3600 * 24 * 365);//秒
                    if ((typeof cb) == "function") {
                        cb();
                    }
                    button.hide();
                });
              }
            });
        }else {
            console.log("用户拒绝授权:", res);
        }
      })





      /*wx.getSetting({
        success (res) {
            console.log(res.authSetting);
            if (res.authSetting["scope.userInfo"]) {
                console.log("用户已授权");
                wx.getUserInfo({
                    success(res){
                        console.log(res);
                        //此时可进行登录操作
                    }
                });
                if ((typeof cb) == "function") {
                    cb();
                }
            }else {
              console.log("用户未授权用户未授权用户未授权用户未授权");
                //用户未授权
            }
        }
     })*/


  }
  
  function wxLogin(routeUrl){
    if (userId <= 0){
        //微信登录
    }
  }
  
  //绑定手机
  function wxBindPhone(routeUrl) {
    //绑定手机
  }

  //退出
  function submitLogout(){
    let that = this;
    try {
      let key = redis.get("logout");
      if (!key) {
        redis.put("logout", 1, 3600 * 24 * 365);//秒
      }
      redis.remove("phoneLoginData");
      redis.remove("wxLoginData");
    } catch (e) { }
    userId = - parseInt(Math.random() * 1e6);
    token = undefined;
    userInfo = {};
  }
  
  module.exports = {
    wxAutoLogin,
    wxLogin,
    wxBindPhone,
    submitLogout
  }