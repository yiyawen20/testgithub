//app.js
var webim = require('./utils/webim.js');
var webimhandler = require('./utils/webim_handler.js');
var gloalConfig = require('./utils/config.js');
var msghandler = require("./utils/msg_handler.js");
const util = require('./utils/util.js')
const redis = require('./utils/redis.js');

var Config = {
  sdkappid: gloalConfig.getSdkappid(),
  accountType: 21294,
  accountMode: 0 //帐号模式，0-表示独立模式，1-表示托管模式
};

App({
  //需要区分从app过来，
  onLaunch: function (opts) {
    let that = this;

    // wx.request = function () { console.log('11111'); } 
    const originRequest = wx.request;
    Object.defineProperty(wx, 'request', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function () {
        const config = arguments[0] || {};
        const url = config.url;
        console.log('发送了ajax，url是: ', url);
        //可以增加上报//
        return originRequest.apply(this, arguments);
      }
    });

    that.globalData.scene = opts.scene;
    that.globalData.shareId = opts.query.userId || - parseInt(Math.random() * 1e6);
    that.globalData.shareReportId = opts.query.shareId;
    try {
      var res = wx.getSystemInfoSync();
      that.globalData.systemInfo = res;
      that.globalData.statusBarHeight = res.statusBarHeight * 750 / res.windowWidth;
      // 登录
      wx.login({
        success: rs => {
          that.globalData.code = rs.code;
          let key = redis.get("logout")
          if (key == 1) {
            return
          }
          //判断登录状态
          let phoneLoginData = redis.get("phoneLoginData");
          if (phoneLoginData != undefined && phoneLoginData.length > 0) {
            phoneLoginData = JSON.parse(phoneLoginData)
            if (phoneLoginData.userId > 0) {
              that.globalData.userId = phoneLoginData.userId;
              that.globalData.token = phoneLoginData.token;
              that.globalData.userInfo = phoneLoginData.userInfo;
              return;
            }
          }

          //判断微信状态
          let wxLoginData = redis.get("wxLoginData");
          if (wxLoginData != undefined && wxLoginData.length > 0) {
            wxLoginData = JSON.parse(wxLoginData)
            if (wxLoginData.userId > 0) {
              that.globalData.userId = wxLoginData.userId;
              that.globalData.token = wxLoginData.token;
              that.globalData.userInfo = wxLoginData.userInfo;
              return;
            }
          }
          /*that.globalData.userId = 101208;//测试
          that.globalData.token = "c8j5wkl9xv4dwjqyfl9do";//测试
          return;*/
          wx.getSetting({
            success(res){
              if (res.authSetting["scope.userInfo"] && that.globalData.userId <= 0){
                wx.getUserInfo({
                  success: function (e) {
                    let nickName = e.userInfo.nickName;
                    let avatar = e.userInfo.avatarUrl;
                    let path = "/imimini/login/byWx";
                    let data = {
                      code: that.globalData.code,
                      nickName: nickName,
                      avatarUrl: avatar,
                      shareId : that.globalData.shareId,
                      method: "GET"

                    }
                    that.ajax(path, data, function (resp) {
                      let key = redis.get("logout")
                      if (key == 1) {
                        redis.remove("logout")
                      }
                      that.globalData.userId = resp.userId;
                      that.globalData.token = resp.token;
                      that.globalData.userInfo.nickName = resp.nickName;
                      resp.avatar = ((resp.avatar.indexOf('//') == 0 || resp.avatar.indexOf('http') == 0) ? resp.avatar : gloalConfig.cdnstatic + resp.avatar);
                      resp.avatar = resp.avatar.indexOf('http:') == 0 ? resp.avatar.replace("http", "https") : resp.avatar;
                      that.globalData.userInfo.avatarUrl = resp.avatar;

                      let _arr = {
                        userId: that.globalData.userId,
                        token: that.globalData.token,
                        userInfo: that.globalData.userInfo
                      }
                      redis.put("wxLoginData", JSON.stringify(_arr), 3600 * 24 * 365);//秒
                    });
                  }
                })
              }
            }
          })
        }
      })
    } catch (e) {
      // Do something when catch error
    }
    try { 
      this.loadConfig();
      
    } catch (e) { }
  },
  loadConfig: function (cb) {
    let that = this;
    let url = gloalConfig.baseUrl;
    wx.request({
      url: url + "/imimini/allconfig?ver=" + gloalConfig.version,
      success: function(res){
        if ((typeof cb) == "function") {
          cb();
        }
        if (!that.isEmptyObject(that.globalData.config)){return}
        that.globalData.config = res.data;

        //console.log(that.globalData.shareList);
        if (that.globalData.afterConfigLoader.length > 0) {
          for (let i in that.globalData.afterConfigLoader) {
            that.globalData.afterConfigLoader[i]();
          }
        }

        that.reportAnalyticsDate();
      }
    });
  },
  splitList(res) {
    let arr = [], brr = [];
    if (res == undefined){return}
    arr = res.split("||");
    for (let i = 0; i < arr.length; i++) {
      brr.push(arr[i].split("__"));
    }
    return brr;
  },
  reportAnalyticsDate(){
    let that = this;
    let arr = that.splitList(that.globalData.config.shareTitle);
    for (let i in arr){
      console.log('分享' + arr[i][1] + arr[i][0] + "," + that.globalData.shareReportId, arr[i][0] == that.globalData.shareReportId)
      if (arr[i][0] == that.globalData.shareReportId){
        // 分析数据上报
        that.shareReport(that.globalData.shareId, arr[i][0], arr[i][1], 2)
        wx.reportAnalytics('click_share_card', {
          share_id: arr[i][0],
          share_title: arr[i][1],
          share_userid: that.globalData.shareId
        });
      }
    }
  },
  isEmptyObject(obj){
    for (var key in obj) {
      return false;//返回false，不为空对象
　　}
　　return true;//返回true，为空对象
  },
  routeUrl(){
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route //当前页面url
    let routeUrl = url.replace("pages", "..");
    return routeUrl;
  },
  getParameter(paramUrl, paramName) {
    try {
      var searchString = paramUrl.split("?")[1],
        i, val, params = searchString.split("&");
      for (i = 0; i < params.length; i++) {
        val = params[i].split("=");
        if (val[0] == paramName) {
          return unescape(val[1]);
        }
      }
      return null;
    } catch (e) { console.error(e, "error") }
  },
  onError(err){
    console.log('上报错误啦！');
    let that = this;
    let userId = that.globalData.userId;
    let path = gloalConfig.cdnfile + "/imi_mini/images/pixel.gif?userId=" + userId + "&error=1";
    let data = { err: err}
    this.ajax(path, data);
  },
  globalData: {
    clicks: 1,
    uid: 19018,//测试
    userId: 0,
    userInfo: {},
    identifier: null, //存放用户ID
    userSig: null, // 云通信加密串
    config: {}, //全局配置开关,
    chatMsgListenerNames: {}, //记录监听模块名，防止重复监听
    cmdMsgListenerNames: {}, //记录监听模块名，防止重复监听
    meetingInfo: { uid: 0, tid: 0, isEmcee: false, audioOnly: false }, //视频需要参数,uid,tid,isEmcee, channel,channelKey,audioOnly 这些参数
    afterConfigLoader:[], // 配置文件加载后执行的方法
    shareId : 0
  },
  //注入聊天消息处理函数
  registerChatMsgListener: function (moduleName, fn) {
    if (!this.globalData.chatMsgListenerNames.hasOwnProperty(moduleName)) {
      this.globalData.chatMsgListenerNames[moduleName] = fn;
    }
  },
  unRegisterChatMsgListener: function (moduleName) {
    if (this.globalData.chatMsgListenerNames.hasOwnProperty(moduleName)) {
      delete this.globalData.chatMsgListenerNames[moduleName];
    }
  },

  //注入信令消息处理函数
  registerCmdMsgListener: function (moduleName, fn) {
    if (!this.globalData.cmdMsgListenerNames.hasOwnProperty(moduleName)) {
      this.globalData.cmdMsgListenerNames[moduleName] = fn;
    }
  },
  unRegisterCmdMsgListener: function (moduleName, fn) {
    if (this.globalData.cmdMsgListenerNames.hasOwnProperty(moduleName)) {
      delete this.globalData.cmdMsgListenerNames[moduleName];
    }
  },

  sendMsg: function (tid, msg, callback) {
    webimhandler.onSendMsg(tid, msg, function () {
      callback && callback();
    })
  },
  //消息回调处理
  msgCallback: function (jsonMsg, fromAccount) {
    var that = this;
    var jsonMsgnew = jsonMsg;
    //收到图片和语音消息单独处理
    if (jsonMsgnew.substring(1, 4) == "img" || jsonMsgnew.substring(0, 5) == "audio") {
      var jsonmsg  = {};
      jsonmsg.msgType=3;
      jsonmsg.fromAccount = fromAccount;
      jsonmsg.msg = jsonMsgnew;
      jsonmsg.type = "media";
      var listeners = that.globalData.chatMsgListenerNames;
      for (var i in listeners) {
        listeners[i](jsonmsg);
      }
      return;
    }
    jsonMsg = jsonMsg.replace(/&quot;/g, "\"");
    var msgPrefix = '10', cmdPrefix = '20';   
    var prefix = jsonMsg.substring(0, 2);
    if (msgPrefix != msgPrefix && msgPrefix != cmdPrefix) {
      console.warn('接收到无效消息，不处理,', jsonMsg);
      return;
    }
    jsonMsg = jsonMsg.substring(2);
    jsonMsg = JSON.parse(jsonMsg);
    if (jsonMsg.msgType==3){
      jsonMsg.fromAccount = fromAccount;
    }    
    console.log('app msg: ' + util.formatTime(new Date()), jsonMsg)
    if (msgPrefix == prefix) {
      var listeners = that.globalData.chatMsgListenerNames;
      for (var i in listeners) {
        listeners[i](jsonMsg);
      }
    } else if (cmdPrefix == prefix) {
      var listeners = that.globalData.cmdMsgListenerNames;
      for (var i in listeners) {
        listeners[i](jsonMsg);
      }
    }
  },
  remind: function (jsonMsg){
    var msgType = jsonMsg.msgType;
    if (msgType == 3) {
      wx.showTabBarRedDot({
        index: 1
      });
    }   
  },
  initIM: function () {
    var that = this;

    webimhandler.init({
      accountMode: Config.accountMode
      , accountType: Config.accountType
      , sdkAppID: Config.sdkappid
      , avChatRoomId: '' //默认房间群ID，群类型必须是直播聊天室（AVChatRoom），应用不需要
      , selType: webim.SESSION_TYPE.C2C
      , selToID: ''
      , selSess: null //当前聊天会话
    });
    var u = that.userInfo;
    //当前用户身份
    var loginInfo = {
      'sdkAppID': Config.sdkappid, //用户所属应用id,必填
      'appIDAt3rd': Config.sdkappid, //用户所属应用id，必填
      'accountType': Config.accountType, //用户所属应用帐号类型，必填
      'identifier': that.globalData.identifier, //当前用户ID,必须是否字符串类型，选填
      'identifierNick': u && u.nickName || '' + that.globalData.identifier, //当前用户昵称，选填
      'userSig': that.globalData.userSig, //当前用户身份凭证，必须是字符串类型，选填
    };

    //监听（多终端同步）群系统消息方法，方法都定义在demo_group_notice.js文件中
    var onGroupSystemNotifys = {
      "5": webimhandler.onDestoryGroupNotify, //群被解散(全员接收)
      "11": webimhandler.onRevokeGroupNotify, //群已被回收(全员接收)
      "255": webimhandler.onCustomGroupNotify//用户自定义通知(默认全员接收)
    };

    //监听连接状态回调变化事件
    var onConnNotify = function (resp) {
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          webim.Log.warn('连接状态正常...');
          break;
        case webim.CONNECTION_STATUS.OFF:
          webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
          wx.showModal({
            title: 'IM连接',
            content: '连接已断开，无法收到新消息，请检查下你的网络是否正常'
          })
          break;
        default:
          webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
          wx.showModal({
            title: 'IM连接',
            content: resp.ErrorCode +',未知连接状态,请刷新页面'
          })
          break;
      }
    };


    //监听事件
    var listeners = {
      "onConnNotify": this.onConnNotify, //选填
      "onBigGroupMsgNotify": function (msg) { }, //监听新消息(大群)事件，必填
      "onMsgNotify": webimhandler.onMsgNotify,//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
      "onGroupSystemNotifys": webimhandler.onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
      "onGroupInfoChangeNotify": webimhandler.onGroupInfoChangeNotify//监听群资料变化事件，选填
    };

    //其他对象，选填
    var options = {
      'isAccessFormalEnv': true,//是否访问正式环境，默认访问正式，选填
      'isLogOn': false//是否开启控制台打印日志,默认开启，选填
    };

    webimhandler.sdkLogin(loginInfo, listeners, options, function () {
      var u = that.globalData.userInfos;
      if (u) {
        //设置IM上的用户信息
        let uid = u.userId,
          nickName = u.nickName, avatar = u.avatar;
        let opts = {
          'ProfileItem': [{
            "Tag": "Tag_Profile_IM_Nick",
            "Value": nickName
          },
          {
            "Tag": "Tag_Profile_IM_Image",
            "Value": avatar
          }]
        };
        webim.setProfilePortrait(opts,
          function (res) {
            console.log(`设置头像成功,uid:${uid},nickName:${nickName},avatar:${avatar}`);
          },
          function () {
            console.log(`设置头像失败,uid:${uid},nickName:${nickName},avatar:${avatar}`);
          }
        );
      }
    });

    //注册消息解析处理
    this.registerChatMsgListener('app', msghandler.handleMsg);
    //注册指令解析处理
    this.registerChatMsgListener('app', msghandler.handleCmd);
    //注册消息解析处理
    this.registerChatMsgListener('chatmsg', this.remind);
  },
  logout: function () {
    webimhandler.logout();
  }
  ,
  /**
   * path:请求路径
   * method：请求方法，默认为POST
   * data：请求参数
   * success：请求成功回调方法
   * error:请求失败回调方法
   * complete：请求完成回调方法
   */
  ajax: function (path, data, success, error, complete) {

    //还没有获取用户ID之前，需要保存用户的请求记录
    let oldTime = new Date().getTime();
    if (data.uid == 1 && this.globalData.token == undefined) {//需要登录
      if (!this.globalData.waittingQueue){
        this.globalData.waittingQueue = [];
      }
      this.globalData.waittingQueue.push({ path: path, data: data, success: success, error: error, complete: complete});
      if (!this.globalData.waitting) {
        var that = this;
        this.globalData.waitting = setInterval(function(){
          let newTime = new Date().getTime();
          if (newTime - oldTime > 30e3){
            clearInterval(that.globalData.waitting);
            return;
          }
          if (that.globalData.token != undefined) {
            clearInterval(that.globalData.waitting);
            //把可能存放的请求，进行请求
            if (that.globalData.waittingQueue && that.globalData.waittingQueue.length > 0) {
              for (var i in that.globalData.waittingQueue) {
                var json = that.globalData.waittingQueue[i];
                json.data.uid = 2;
                that.ajax(json.path, json.data, json.success, json.error, json.complete);
              }
            }
          }
        },500);
      }
      return;
    }

    path = path || '/';
    if (path.indexOf('http') != 0) {
      path = gloalConfig.baseUrl + path;
    }
    if (path.indexOf('?') < 0) {
      path = path + "?token=" + this.globalData.token;
    }else{
      path = path + "&token=" + this.globalData.token;
    }
    let uinq = new Date().getTime() + Math.round(Math.random() * 10000000000);
    data = data || {};
    data["userId"] = this.globalData.userId || this.globalData.identifier; //请求体中 ，增加userId参数

    wx.request({
      url: path,
      data: data,
      method: data["method"] || "POST",
      dataType: 'json',
      success: function (res) {
        success && success(res.data)
      },
      fail: function (err) {
        error && error(err)
      },
      complete: function (c) {
        complete && complete(c)
      }
    })
  }
  //显示充值面板
  , showRecharge: function () {
    var that = this;
    wx.showModal({
      title: '',
      content: '余额不足',
      confirmText: '去充值',
      success: function (res) {
        if (res.confirm) {
          wx.showModal({
            title: '充值提示',
            content: `${that.globalData.config.rechargeMsg}`,
            confirmText: '好的',
            showCancel: false,
            success: function (res) {
              wx.switchTab({
                url: '/pages/user/user'
              });
            }
          })
        }
      }

    })
  },
  //查询用户余额，cb 为回调，参数为{coin:xxx,jewel:xxx}
  queryBalance: function (cb) {
    var path = "/v1/wealth/query", data = {};
    this.ajax(path, data, function (res) {
      if (res && res.code == 100000) {
        cb && cb({ coin: res.data.goldAmount / 100, jewel: res.data.jewelAmount / 100 });
      }
    });
  },
  //本地保存formId
  formSubmit: function(e) {
    let formId = e.detail.formId;
    //console.log(Math.random(), formId)

    //IDE模拟，不需要
    if (formId == 'the formId is a mock one'){
      return;
    }
    this.collectFormIds(formId);  //保存推送码
  },
  //搜集formId
  collectFormIds: function (formId) {
    let formIds = this.globalData.globalFormIds;  // 获取全局推送码数组
    if (!formIds)
      formIds = [];
    let data = {
      formId: formId,
      expire: new Date().getTime() + 604800000  // 7天后的过期时间戳
    }
    formIds.push(data);
    this.globalData.globalFormIds = formIds;
    this.uploadFormIds();
  },
  //上报
  uploadFormIds: function () {
    let formIds = this.globalData.globalFormIds || [];  // 获取全局推送码
    if (formIds.length < 10) {
      return;
    }

    formIds = JSON.stringify(formIds);  // 转换成JSON字符串
    this.globalData.globalFormIds = '';  // 清空当前全局推送码
    wx.request({  // 发送到服务器
      url: gloalConfig.baseUrl +'/wxserviec/saveformIds',
      method: 'POST',
      data: {
        openId: this.globalData.openId,
        formIds: formIds
      },
      success: function (res) {
        
      }
    });
  },
  /**
   * 分享数据上报
   * userId: 用户ID
   * shareId: 分享文案对应编号
   * step, 1:分享前上报；2：从分享页面进入app上报
   */
  shareReport: function (userId, shareId, title, step) {
    let path = gloalConfig.cdnfile + "/imi_mini/images/pixel.gif?userId=" + userId+"&shareId="+shareId+"&title="+ title +"&step="+step;
    let data = {}
    this.ajax(path, data);
  }
})