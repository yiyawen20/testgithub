// pages/imi/imi.js
var wxParse = require('../../wxParse/wxParse.js');
const gloalConfig = require('../../utils/config.js');
const cdnfile = gloalConfig.cdnfile + "/imi_mini";
const login = require('../../utils/login.js');
const redis = require('../../utils/redis.js');
const promise = require('../../utils/promise.util.js');
const wxDownloadFile = promise.promisify(wx.downloadFile)
// import share from "../../utils/share.js";
const app = getApp();
const giftQueue = []; // 礼物播放队列
const giftAnimationClips = wx.createAnimation({
  transformOrigin: "50% 50% 0",
  delay: 0,
  duration: 1e3,
  timingFunction: "ease"
})
/**
 * 生成聊天室的系统消息
 */
function createSystemMessage(content) {
  return { "name": "系统提示", "msg": content, src: '' };
}

/**
 * 生成聊天室的聊天消息
 */
function createUserMessage(name, content, src, faceList, num) {
  return { "name": name || '系统消息', "msg": content || '', src: src || '', faceList: faceList|| [], num: num || '' };
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnfile: cdnfile,
    pageHeight: 1334,
    openAppGuide: false,
    isOpenApp: false,
    smallhostavatar: "",
    hostavatar: "",
    roomId: "",
    hostName: "主播",
    hostNo: "",
    liveSrc: "rtmp://live.hkstv.hk.lxdns.com/live/hk",
    playerdisplay: true,
    imageData: "",
    chatArray: [],
    scrollTop: 100,
    attentionClass: "attention",
    attention: "关注",
    user: { nickName: "主播", backbtn: true, idxBack: true },
    judge: {},
    iPhoneTop: 0,
    chatHeight: "",
    footerDisplay: true,
    sendChatDisplay: false,
    chatFocus: false,
    msg: "",
    panelGame: false,
    openAppPanel: false,
    repeatDisplay: "hide",
    audit: false,
    gameEnter: false,
    gamelist: [],
    sendGift: true,
    sender: {
      avatar: '',
      name: '测试用户',
      giftName: '性感比基尼',
      giftSn: 1312,
      giftNum: 1,
      shareCur: 0,
      sendId: 0
    },
    giftAnimation: {},
    imgPrefix: gloalConfig.cdnfile + "/v4/images/gift_min/",
    emceePk: false,
    pkResultDispay: false,
    pkEmceeId: "",
    leftTime: "00:00",
    pkTime: 0,
    score: 0,
    otherScore: 0,
    pkPro: 50,
    pkResult: "",
    pkResultMy: "",
    otherAvatar: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    });
    // wx.hideShareMenu();

    //临时存放，方便回退
    if (options.hostId && options.hostId.length > 0) {
      app.globalData.tmpOptions = options;
    } else {
      options = app.globalData.tmpOptions;
    }

    app.globalData.hostId = options.hostId;

    let that = this;
    //decodeURIComponent(msg);
    //根据hostId获取主播信息
    that.reqRoom(options.hostId);

    let systemInfo = app.globalData.systemInfo;
    let pro = 750 / systemInfo.windowWidth;
    let footMarginIpx = systemInfo.model.indexOf("iPhone X") > -1  ? 68 : 0
    let chatHeight = systemInfo.windowHeight * pro
      - app.globalData.statusBarHeight
      - 86 - 562.5 - 116 - 128 - footMarginIpx;
    let iPhoneTop = systemInfo.model.indexOf("iPhone") > -1 && systemInfo.brand.indexOf("devtools") == -1 ? app.globalData.statusBarHeight + 68 : 0
    that.setData({
      judge: { height: app.globalData.statusBarHeight },
      iPhoneTop: iPhoneTop,
      chatHeight: chatHeight,
      pageHeight: systemInfo.windowHeight * pro - footMarginIpx
    });

    let gameSwitch = app.globalData.config.gameSwitch
    gameSwitch = gameSwitch == "true" || gameSwitch == true ? true : false
    if (app.isEmptyObject(app.globalData.config)){
      app.loadConfig(function () {
        that.setData({
          gameEnter: gameSwitch
        })
      })
    }else{
      that.setData({
        gameEnter: gameSwitch
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

    wx.showLoading({
      title: '视频加载中',
      mask: true
    });

    that.getAttention(app.globalData.hostId);

    //加载字体
    /*wx.loadFontFace({
      family: 'digi',
      source: 'url("' + gloalConfig.masterURL + 'iconfont/ds-digi.ttf")',
      success: function(e){
        console.log(e);
        if (gloalConfig.Config.env == "test") {
          that.pushMessage(createUserMessage("", "success字体:" + e.status, "", [], ""));
        }
      },
      fail(e){
        console.log(e);
        if (gloalConfig.Config.env == "test") {
          that.pushMessage(createUserMessage("", "fail字体:" + e + e.status, "", [], ""));
        }
      }
    });*/

    if (app.globalData.scene == 1036){
      that.setData({
        isOpenApp: true
      })
    }
    if (audit){
      that.openAppGuideTips();
    }
  },
  openAppGuideTips(){
    let that = this;
    try {
      let key = redis.get("openAppGuide")
      if (!key){
        that.setData({
          openAppGuide: true
        })
        setTimeout(()=>{
          that.setData({
            openAppGuide: false
          })
        }, 5e3)
        redis.put("openAppGuide", 1, 3600*24*365);//秒
      }
    } catch (e) { }
  },
  clickPage(){
    let that = this;
    if (that.data.openAppGuide){
      that.setData({
        openAppGuide: false
      })
    }
  },
  openAppChoose(){
    let that = this;
    that.setData({
      openAppPanel: !that.data.openAppPanel
    })
  },
  repeatShot(){
    let that = this;
    let pro = app.globalData.systemInfo.windowWidth / 750;
    let context = wx.createCanvasContext('repeatShotCanvas');
    Promise.all([
      wxDownloadFile({
        url: that.data.hostavatar
      }),
      wxDownloadFile({
        url: that.data.smallhostavatar
      })
    ]).then(res => {
      context.setFillStyle('#ffffff')
      context.fillRect(0, 0, 750 * pro, 750 * pro)
      context.drawImage(res[0].tempFilePath, 0 * pro, 10 * pro, 90 * pro, 90 * pro);
      context.setStrokeStyle('#ffffff')
      context.setLineWidth(50)
      context.arc(45 * pro, 55 * pro, 90 * pro, 0, 2 * Math.PI, true)
      context.stroke()
      context.setFillStyle('#000000')
      context.setFontSize(42 * pro);
      context.setTextBaseline("middle");
      context.fillText(that.data.hostName, 45 * pro * 2 + 10, 55 * pro);
      context.drawImage(res[1].tempFilePath, 0, 110 * pro, 750 * pro, 750 * pro);

      context.draw()
      setTimeout(function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 750 * pro,
          height: 750 * pro,
          destWidth: 750,
          destHeight: 750,
          canvasId: 'repeatShotCanvas',
          success(res) {
            console.log(res.tempFilePath)
            that.data.repeatImg = res.tempFilePath;
          }
        })
      }, 1e3);
    });
  },
  launchAppError(e) {
    console.error(e.detail.errMsg)
    if (gloalConfig.Config.env == "test") {
      that.pushMessage(createUserMessage("", "错误调起app:" + e.detail.errMsg, "", [], ""));
    }
  },
  launchapp(e){
    if (gloalConfig.Config.env == "test") {
      that.pushMessage(createUserMessage("", "成功调起app:" + e.detail.errMsg, "", [], ""));
    }
  },
  close(e) {
    let that = this;
    let _id = e.currentTarget.dataset.hideid;
    if (_id == "panelGame") {
      that.setData({
        "panelGame": !that.data.panelGame
      });
    }
    if (_id == "openAppPanel") {
      that.setData({
        "openAppPanel": !that.data.openAppPanel
      });
    }
    if (_id == "pkResultDispay") {
      that.setData({
        "pkResultDispay": !that.data.pkResultDispay
      });
    }
  },
  //打开游戏panel
  openGamePanel(){
    let that = this;
    if(app.globalData.userId <= 0){
      login.wxLogin(app.routeUrl());
      return;
    }
    that.setData({
      panelGame: !that.data.panelGame
    });
    that.getGameList();
  },
  //获取游戏列表
  getGameList(){
    let that = this;
    let path = "/imimini/gamelist",
      data = {};
    app.ajax(path, data, function(res){
      if(res.result == 10000){
        that.setData({
          gamelist: res.data
        });
      }
    });
  },
  toActivity(e) {
    let that = this;
    let dataset = e.target.dataset;
    let linkUrl = encodeURIComponent(dataset.url);
    if (linkUrl.indexOf("https") < 0) {
      linkUrl = linkUrl.replace("http", "https");
    }
    let title = dataset.title;
    let type = dataset.type;
    if(app.globalData.userId <= 0){
      login.wxLogin(app.routeUrl());//请登录
      return;
    }
    if (linkUrl == "null"){
      return;
    }
    if (type == 1) {
      console.log("sss");//特殊处理
    } else {
      wx.navigateTo({
        url: "../activity/activity?url=" + linkUrl + "&title=" + title + "&roomId=" + that.data.roomId,
      });
    }
  },
  //关注状态
  getAttention(hostId){
    let that = this;
    let path = "/imimini/follow/has",
      data = {
        followingId: hostId,
        uid: 1,
        method: "GET"
      };
    app.ajax(path, data, function(res){
      if (res.result == 10003){
        that.setData({
          attention: " 关注"
        })
      } else if (res.result == 10000){
        that.setData({
          attentionClass: "attentioned",
          attention: "已关注"
        })
      }
    });
  },
  //设置关注
  setAttention(){
    let that = this;
    if(app.globalData.userId <= 0){
      //提示登录
      login.wxLogin(app.routeUrl());
      return;
    }
    let attention = that.data.attention;
    if (attention == " 关注"){
      that.addAttention();
    } /*else if (attention == "已关注"){
      that.unAttention();
    }*/
  },
  //关注
  addAttention(){
    let that = this;
    let path = "/imimini/follow",
      data = {
        followingId: app.globalData.hostId,
        method: "GET"
      };
    app.ajax(path, data, function (res) {
      if (res.result == 10000) {
        that.setData({
          attentionClass: "attentioned",
          attention: "已关注"
        })
      }else if(res.result == 10001){
        wx.showModal({
          title: '提示',
          content: '关注失败',
          showCancel: false,
          confirmText: "知道了",
          confirmColor: "#000",
          success(res) {
            if (res.confirm) {
              // console.log('用户点击知道了')
            } 
          }
        })
      }
    });
  },
  //取消关注
  unAttention(){
    let that = this;
    let path = "/imimini/follow/un",
      data = {
        followingId: app.globalData.hostId,
        method: "GET"
      };
    app.ajax(path, data, function (res) {
      if (res.result == 10000) {
        that.setData({
          attention: " 关注"
        })
      }
    });
  },
  //聊天
  toChat(){
    let that = this;
    that.setData({
      footerDisplay: !that.data.footerDisplay,
      sendChatDisplay: !that.data.sendChatDisplay,
      chatFocus: true
    });
  },
  //聊天失去焦点
  sendBlur(e){
    let that = this;
    that.setData({
      footerDisplay: !that.data.footerDisplay,
      sendChatDisplay: !that.data.sendChatDisplay,
      msg: ""
    });
  },
  sendMsg(e){
    let that = this;
    that.setData({
      msg: e.detail.value
    })
  },
  //发送消息
  sendChat(e){
    let that = this;
    if (app.globalData.userId <= 0) {
      login.wxLogin(app.routeUrl());//请登录
      return;
    }
    var ti = -1;// 聊天对象
    var type = 2;// 公聊
    var act = 0; // 纯公聊
    var isPrivate = 0//私聊不限制
    var msg = that.data.msg;
    if (msg == ""){return}

    let userInfo = app.globalData.userInfo;
    msg = msg.substr(0, 60);
    msg = msg.replace(/\s+/g, '');
    // 过滤特殊字符
    msg = that.filterKeyWord(msg);
    if (that.isNotAllow(msg) && userInfo.vip <= 3) {
      wx.showToast({
        title: '您的发言包括过多字母和数字！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    //您已经被禁言暂时处理不了
    if (userInfo.richLevel <= 5 && userInfo.vip <= 0 && userInfo.authentication == 0) {
      if (msg.length > 10) {
        wx.showToast({
          title: '成为VIP或富农以上后，发言才能超过10个字。',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (that.sendFast == 1) {
        wx.showToast({
          title: '发言频率太快了',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      that.sendFast = 1;
      setTimeout(function () { that.sendFast = 0; }, 5000);
    }
    // 非付费用户发言受到限制判断
    // that.getLocation(Room.Users.managers, userInfo.userId) == -1
    if (userInfo.pubChatType == 2 && userInfo.richLevel <= 5 && userInfo.hostId != userInfo.userId && userInfo.vip <= 0) {
      if (msg.length > 60) {
        wx.showToast({
          title: '富农等级以下的朋友不能发言哦！快快升级吧！',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    // 私聊不做限制，仅精英公聊
    // Room.Users.getLocation(Room.Users.managers, _ivp.userId) == -1
    if (isPrivate == 0 && userInfo.pubChatType == 1 && userInfo.hostId != userInfo.userId) {
      wx.showToast({
        title: '仅精英可以公聊！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // 自己不能给自己聊！
    // 一对一公聊
    // 私聊
    // 聊天对象为所有人
    if (typeof userInfo.userInfo == Object && userInfo.userInfo.hide == 1 && isPrivate != 1) {
      wx.showToast({
        title: '您现在处于隐身状态, 此状态不可以使用此功能哦.',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    //-----------------聊天内容中加vip等级图标 start-------------
    // ----------------- 聊天内容中加vip等级图标 end-------------
    //-----------------口令红包start----------------------------
    //-----------------口令红包end----------------------------

    msg = msg + "(来自小程序)";
    var code = 0;
    var roomId = that.data.roomId;
    let sendMsg = {
      token: app.globalData.token,
      roomId: roomId,
      paramType: type,
      paramAct: act,
      paramMsg: msg,
      paramCode: code,
      paramTi: ti,
      method: "GET"//get请求
    };
    let path = gloalConfig.masterURL + "http/im/sendOther";
    app.ajax(path, sendMsg, function (resp){
      let result = resp.result;
      if (result == 0){
        that.setData({
          msg: ""
        });
      }else{
        if (result == -2) {
          //提示登录
          login.wxLogin(app.routeUrl());
        } else if (result == -6) {
          // 绑定手机号
          login.wxBindPhone(app.routeUrl());
          /*wx.showToast({
            title: '请绑定手机号',
            icon: 'none',
            duration: 2000
          })*/
          clearTimeout(that.sendMsgTimer);
          that.sendMsgTimer = setTimeout(function(){
            login.wxLogin(app.routeUrl())
          }, 2e3);
          // MissionRemind.phoneNextMission(1);
          return;
        } else if (result == -7) {
          wx.showModal({
            title: '提示',
            content: '发言内容含有敏感字,不能发言!',
            showCancel: false,
            confirmText: "知道了",
            confirmColor: "#000",
            success(res) {
              if (res.confirm) {
                // console.log('用户点击知道了')
              }
            }
          })
        } else if (result == -5) {
          // 被禁言
          wx.showToast({
            title: '被禁言',
            icon: 'none',
            duration: 2000
          })
        } else if (result == -4) {
          // 被列入黑名单
          wx.showToast({
            title: '被列入黑名单',
            icon: 'none',
            duration: 2000
          })
        } else {
          console.error(resp);
        }
      }
    });
  },
  filterKeyWord(str){
    str = str.replace(gloalConfig.sensitive_word_list_reg, "");
    return str.replace(/\<|\>|\||%/g, "").replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "");
  },
  isNotAllow(str) {
    var b = 0, a = 0, d = 0;
    for (var g = 0; g < str.length; g++) {
      var m = str.charAt(g);
      if (gloalConfig.FilterStr.dots.indexOf(m) > -1) {
        d = 1;
        break
      }
      if (gloalConfig.FilterStr.number.indexOf(m) > -1) {
        b++
      } else {
        if (gloalConfig.FilterStr.letter.indexOf(m) > -1) {
          a++
        }
      }
    }
    if (d || a > 7 || b >= 7) {
      // 您的发言中包含过多字母或数字！
      return true;
    }
    return false;
  },
  // 查找指定用户信息在数组中的位置，不存在则返回-1
  getLocation: function (arr, userId) {
    var e = -1;
    for (var i = 0; i < arr.length; i++) {
      if (parseInt(arr[i].userId) == userId) {
        e = i;
        break
      }
    }
    return e
  },
  statechange(e) {
    var that = this;
    if (e.detail.code == '2004') {
      that.setData({
        playerdisplay: false
      })
    }
    if (gloalConfig.Config.env == "test" && e.detail.code != 2005){
      that.pushMessage(createUserMessage("", "播放状态变化事件" + e.detail.code, "", [], ""));
    }
  },
  error(e) {
    let that = this;
    console.error('live-player error:', e.detail.errMsg)
    if (gloalConfig.Config.env == "test"){
      that.pushMessage(createUserMessage("", "视频error" + e.detail.errMsg, "", [], ""));
    }
  },
  netstatus(e){
    let that = this;
    console.error('live-player error:', e.detail.info)
    // that.pushMessage(createUserMessage("", "视频网络状态" + e.detail.info, "", [], ""));
  },
  /**
   * 获取播放地址
   */
  getLiveurl: function (pkState) {
    let that = this;
    let path = gloalConfig.baseUrl + "/imimini/getLiveUrl", data = { roomId: that.data.roomId, method: "GET"};
    app.ajax(path, data, function(res){
      wx.hideLoading();
      if (res) {
        let result = res.result;
        let liveSrc, pkEmceeId = "";
        if (res.otherId == undefined){
          liveSrc = res.liveUrl;
        }else{
          //pk阶段
          liveSrc = res.liveUrl;
          if (pkState != 1){
            pkEmceeId = res.otherId;
            let pkTime = res.time;
            let otherAvatar = res.avatar;
            let pkId = res.pkId.split("-");
            let reqId = pkId[0];
            //积分更新
            let score = parseInt(res.curScore);
            let otherScore = parseInt(res.otherScore);
            let pkPro;
            if (score + otherScore > 0){
              pkPro = parseInt(score / (score + otherScore) * 100);
            }
            pkPro = pkPro > 86 ? 86 : pkPro;
            pkPro = pkPro < 14 ? 14 : pkPro;
            that.setData({
              emceePk: true,
              pkEmceeId: pkEmceeId,
              pkTime: pkTime,
              score: score,
              otherScore: otherScore,
              pkPro: pkPro,
              pkResult: ""
            })
            if (result == 2) {
              //pk统计结束
              if (score > otherScore || (score == otherScore && app.globalData.hostId == reqId)) {
                //当前主播赢了
                that.setData({
                  pkResult: "failure",
                  pkResultDispay: !that.data.pkResultDispay,
                  pkResultMy: "win",
                  otherAvatar: otherAvatar
                })
              } else {
                that.setData({
                  pkResult: "win",
                  pkResultDispay: !that.data.pkResultDispay,
                  pkResultMy: "failure",
                  otherAvatar: otherAvatar
                })
              }
            }
            that.intervalTime();
          }
        }
        console.log(pkEmceeId, liveSrc);
        that.setData({
          liveSrc: liveSrc
        });
      }
    });
  },
  intervalTime(){
    let that = this;
    clearInterval(that.pkTimer);
    that.pkTimer = setInterval(function () {
      let time = parseInt(that.data.pkTime);
      if (time <= 0) {
        clearInterval(that.pkTimer);
        return;
      }
      time--;
      that.pkLeftTime(time)
    }, 1e3);
  },
  //pk倒计时
  pkLeftTime(leftTime){
    let that = this;
    let m = parseInt(leftTime / 60);
    m = m < 10 ? "0" + m : m;
    let s = leftTime % 60;
    s = s < 10 ? "0" + s : s;
    that.setData({
      pkTime: leftTime,
      leftTime: m + ":" + s
    })
  },
  reqRoom: function (hostId) {
    //var hostId = e.currentTarget.dataset.tid;
    let that = this;
    let path = gloalConfig.baseUrl + "/imimini/api/emceeinfo?hostId=" + hostId, data = { };
    app.ajax(path, data, function (resp){
      let roomId = resp.roomId;
      let hostName = resp.hostName;
      let hostavar = resp.hostavar;
      let smallhostavar = resp.postAvatar;
      hostavar = ((hostavar.indexOf('//') == 0 || hostavar.indexOf('http') == 0) ? hostavar : gloalConfig.cdnstatic + hostavar);
      hostavar = hostavar.indexOf('http:') == 0 ? hostavar.replace("http", "https") : hostavar;
      smallhostavar = ((smallhostavar.indexOf('//') == 0 || smallhostavar.indexOf('http') == 0) ? smallhostavar : gloalConfig.cdnstatic + smallhostavar);
      smallhostavar = smallhostavar.indexOf('http:') == 0 ? smallhostavar.replace("http", "https") : "https:" + smallhostavar;

      let user = that.data.user;
      user.nickName = decodeURIComponent(hostName);
      that.setData({
        roomId: roomId,
        smallhostavatar: smallhostavar,
        hostavatar: decodeURIComponent(hostavar),
        hostName: decodeURIComponent(hostName),
        user: user,
        hostNo: hostId
        //roomId:'1029261-1-b224d4337539ec6bfbc4bdfc80f4b857'
      });
      that.getLiveurl();
      login.wxAutoLogin(that.getmsgInfo)

      //转发截图
      that.repeatShot();
    });
  },
  getmsgInfo:function(){
    let that = this;
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let path = gloalConfig.getwssurl,
      data = {
        token: app.globalData.token,
        isPack: false,
        t: timestamp
      };
    app.ajax(path, data, function(res){
      if (res) {
        that.setData({
          imageData: res.split(":")[0]
        })
        that.onReadychat();
      }
    });
  },
  back: function () {
    //写该值很大，就是直接返回首页
    // wx.navigateBack({ delta:15});
    wx.redirectTo({
      url: "../index/index"
    });
  },
  imiReqRoom: function (e) {
    let hostId = e.currentTarget.dataset.tid;
    let that = this;
    wx.navigateTo({
      url: '../imi/imi?hostId=' + hostId,
      success: function () { }
    })
  },
  viewchange: function () {},
  wStart(){
    let that = this;
    that.ywTime = new Date().getTime();
  },
  wEnd(){
    let that = this;
    let aTime = new Date().getTime()
    if (app.globalData.userId == 95253051 && aTime - that.ywTime > 8e3) {
      that.ctx.requestFullScreen({ direction: 90 });
    }
  },
  onReadychat: function () {
    //this.pushMessage(createSystemMessage('正在登录...'));
    var that = this
    var urls = gloalConfig.chatUrl + that.data.imageData + '?token=' + app.globalData.token + '&isPack=false';
    var roomId = that.data.roomId;
    var userId = app.globalData.userId;
    //建立socket连接

    wx.connectSocket({
      url: urls
    })

    wx.onSocketOpen(function (res) {
      wx.sendSocketMessage({
        data: '5:::{"name":"message","args":[{"route":"logInOut", "roomId":"' + roomId + '", "userId":' + userId + ',"from":1, "type":1}]}'
      })
    })
    wx.onSocketError(function (res) {
      this.pushMessage(createSystemMessage('连接系统失败'))
    })

    wx.onSocketMessage(function (res) {
      var data = res.data;
      if (data == '1::') { //连接上
        return;
      }
      //心跳消息
      if (data == '2::') {
        wx.sendSocketMessage({
          data: '2::'
        });
        return;
      }
      //拿到消息做页面处理
      if (res.data.length > 6) {
        var jsonstr = res.data.substr(4, );
        var jsonobj = JSON.parse(jsonstr);
        var msgstr = jsonobj.args;
        var msgjson = JSON.parse(msgstr);
        var type = msgjson.type;
        let code = msgjson.code;
        var name = "";
        var msg = "";
        var num = "";
        var giftsrc = "";
        let faceList = [];
        //roomId前带星号是所有房间消息
        if(code == 0){//聊天消息
          if (type == 6) {
            //停播act=0
            if (msgjson.act == 0) {
              wx.showToast({
                title: '主播关直播了',
                icon: 'none',
                duration: 2000
              })
              that.pushMessage(createUserMessage("", "主播关直播了", giftsrc, faceList, num));
            }
            if (msgjson.act == 1) {
              //开播
              that.getLiveurl();
              that.pushMessage(createUserMessage("", "主播开播了", giftsrc, faceList, num));
            }
          }
          var fn = msgjson.fn;
          if (fn == undefined) { return }
          fn = fn.replace(/\\/g, "%");
          fn = unescape(fn);
          if (msgjson.roomId != undefined && msgjson.roomId.indexOf(that.data.roomId) < 0) { return }
          if (type == 4) {
            name = fn + "";
            if (msgjson.act == 1){
              //飞屏
              msg = msgjson.msg.split("|")[0];
              msg = "：" + decodeURIComponent(msg);//转码
            }else{
              num = msgjson.msg.split("|")[1];
              var gift = msgjson.msg.split("|")[2];
              //礼物编号
              var giftSn = msgjson.msg.split('.')[0];
              if (giftSn.length > 6){return}
              giftsrc = gloalConfig.cdnfile + "/v4/images/gift_min/" + giftSn + '.png';
              if (gift == undefined) { return }
              gift = gift.replace(/\\/g, "%");
              gift = unescape(gift);
              msg = "送出" + gift;
            }
          } else if (type == 2) {
            name = fn;
            msg = msgjson.msg;
            msg = "：" + decodeURIComponent(msg);//转码
            msg = msg.replace("(来自小程序)", "");
            var face = gloalConfig.face;
            var vipface = gloalConfig.vipface;
            for (var a in face) {
              var FaceUrl = gloalConfig.cdnfile + '/images/face2/';
              if (msg.indexOf(face[a]) > -1) {
                let _face = {}
                _face.src = FaceUrl + a + '.gif';
                _face.type = "face";
                faceList = faceList.concat(_face);
              }
              msg = msg.replace(new RegExp(face[a], "g"), "")
            }
            for (var a in vipface) {
              var FaceUrl = gloalConfig.cdnfile + '/style/img/vip_face/';
              if (msg.indexOf(vipface[a]) > -1) {
                let _face = {}
                _face.src = FaceUrl + a + '.gif';
                _face.type = "vip_face";
                faceList = faceList.concat(_face);
              }
              msg = msg.replace(new RegExp(vipface[a], "g"), "")
            }
          }
          if (msg == "") { return; }
          that.pushMessage(createUserMessage(name, msg, giftsrc, faceList, num));
        } else if (code == 65){
          if(type == 10){
            //pk开始
            let pkId = msgjson.pkId.split("-");
            let reqId = pkId[0];
            let pkEmceeId = pkId[1];
            if (reqId != app.globalData.hostId){
              pkEmceeId = reqId;
            }
            let pkTime = parseInt(pkId[2])*60;
            that.setData({
              emceePk: true,
              pkEmceeId: pkEmceeId,
              pkTime: pkTime
            })
            that.getLiveurl(1);
            that.intervalTime();
          } else if(type == 11){
            //积分更新
            let score = msgjson.score;
            let otherScore = msgjson.otherScore;
            let pkPro = parseInt(score / (score + otherScore) * 100);
            pkPro = pkPro > 86 ? 86 : pkPro;
            pkPro = pkPro < 14 ? 14 : pkPro;
            that.setData({
              score: score,
              otherScore: otherScore,
              pkPro: pkPro
            })
          } else if(type == 12){
            //pk统计结束
            let winUserId = msgjson.winUserId;
            let otherAvatar = msgjson.otherAvatar;
            if (winUserId == app.globalData.hostId){
              //当前主播赢了
              that.setData({
                pkResult: "failure",
                pkResultDispay: !that.data.pkResultDispay,
                pkResultMy: "win",
                otherAvatar: otherAvatar
              })
            }else{
              that.setData({
                pkResult: "win",
                pkResultDispay: !that.data.pkResultDispay,
                pkResultMy: "failure",
                otherAvatar: otherAvatar
              })
            }
            that.setData({
              pkTime: 180
            })
            // that.getLiveurl(1);
            that.intervalTime();
          } else if (type == 13) {
            //pk惩罚结束
            that.setData({
              emceePk: false,
              pkResultDispay: false,
              score: 0,
              otherScore: 0,
              pkPro: 50
            })
            that.getLiveurl(1);
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(res) {
    var that = this;
   
    that.ctx = wx.createLivePlayerContext('player')
    wx.getNetworkType({
      success: function (res) {
        var networkType = res.networkType;
        if (networkType == 'wifi') {
          that.bindPlay();
        }
      }
    })
  },
  bindPlay() {
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
    this.ctx.play({
      success: res => {

      },
      fail: res => {

      }
    })
  },
  reqimi: function () {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.setData({
      repeatDisplay: "hide",
      openAppPanel: false
    });
    if (that.quitTimer == 1){
      that.quitTimer = 2;
      that.getmsgInfo();
    }
  },
  quit() {
    wx.closeSocket();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    that.quitTimer = 1;
    that.quit();
    that.ctx.pause();
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.quit();
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
   * 通用更新当前消息集合的方法
   */
  updateMessages(updater) {
    let that = this;
    if (!that.chatArrayQueue){
      that.chatArrayQueue = [];
    }
    let chatArrayQueue = that.chatArrayQueue;
    updater(chatArrayQueue);
    if (that.chatArraySwitch != 1 && that.chatArrayQueue.length > 0){
      that.chatArraySwitch = 1
      that.pushChat();
      that.chatArrayTimer = setInterval(()=>{
        if (that.chatArrayQueue.length == 0){
          that.chatArraySwitch = 2;
          clearInterval(that.chatArrayTimer)
          return;
        }
        that.pushChat();
      }, 1e3)
    }

    /*var wpsr = '';
    var arrchat = chatArray;
    for (var i = 0; i < arrchat.length; i++) {
      wpsr += '<div class="chat"><p class="chatcontent ' + (arrchat[i].num != '' ? 'chatgift' : '') + '">' + '<span class="chatname">' + arrchat[i].name +'</span>'+arrchat[i].msg + '</p><span><img class="giftClass" src="' + arrchat[i].src + '"/></span><span class="chatgift">' + (arrchat[i].num != '' ? 'X' + arrchat[i].num : '') + '</span></div>'
    }

    wxParse.wxParse('str', 'html', wpsr, this, 5);*/
  },
  pushChat(){
    let that = this;
    let chatArray = that.data.chatArray.concat(that.chatArrayQueue.slice(0, 10));
    that.chatArrayQueue.splice(0, 10);
    if (chatArray.length > 40) {
      chatArray.splice(0, 10);
    }
    that.setData({
      chatArray: chatArray,
      scrollTop: that.data.scrollTop + 500
    });
  },
  pushMessage(message) {
    message.num = message.num != "" ? "X" + message.num : "";
    this.updateMessages(chatArray => chatArray.push(message));
  },

  /**
   * 替换上一条消息
   */
  amendMessage(message) {
    this.updateMessages(chatArray => chatArray.splice(-1, 1, message));
  },

  /**
   * 删除上一条消息
   */
  popMessage() {
    this.updateMessages(chatArray => chatArray.pop());
  },
  //送礼
  sendGiftEnter(){
    let that = this;
    if (app.globalData.userId <= 0) {
      login.wxLogin(app.routeUrl());//请登录
      return;
    }
    if (app.isEmptyObject(app.globalData.userInfo)){
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (e) {
                app.globalData.userInfo.nickName = e.userInfo.nickName;
                app.globalData.userInfo.avatarUrl = e.userInfo.avatarUrl;
              }
            })
          }
        }
      })
    }
    
    let json = {
      avatar: app.globalData.userInfo.avatarUrl,
      name: app.globalData.userInfo.nickName,
      giftName: gloalConfig.gifts[gloalConfig.gifts.sendList[0]].name,
      giftSn: gloalConfig.gifts.sendList[0],
      giftNum: 1,
      sendId: app.globalData.userId
    };
    let path = "/imimini/gift/send";
    let data = {
      method: "GET",
      giftSn: json.giftSn,
      n: json.giftNum,//送礼数量
      cycle: 1,//循环次数
      tid: that.data.hostNo,//接收人ID
      rid: that.data.roomId//roomId
    };
    app.ajax(path, data, function (resp){
      let result = resp.result;
      if (result == "0"){
        giftQueue.push(json);
        that.playGift();
      } else if (result == "-2"){
        login.wxLogin(app.routeUrl());//请登录
      } else if (result == "-4") {
        //余额不足请充值
        if(that.yebz != 1){
          that.yebz = 1
          wx.showModal({
            title: '金豆余额不足',
            content: '点击直播间右下角落按钮，登录艾米直播APP充值金豆即可打赏主播哦~~~~',
            showCancel: false,
            confirmText: "知道了",
            confirmColor: "#000",
            success(res) {
              that.yebz = 2;
              if (res.confirm) {
                console.log('用户点击知道了')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
        }
      } else if (result == "-1") {
        //赠送礼物处理异常，请重新赠送礼物！
        wx.showToast({
          title: '赠送礼物异常',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  //播放礼物
  playGift: function () {
    let that = this;
    if (that.playGiftTimer == 1) {
      return;
    }
    that.playGiftTimer = 1;
    that.giftFlash();
    that.giftTimer = setInterval(()=>{
      if (giftQueue.length == 0) {
        that.playGiftTimer = 2;
        clearTimeout(that.giftTimer);
        return;
      }
      that.giftFlash();
    }, 5e3)
  },
  giftFlash(){
    let that = this
    let json1 = giftQueue.shift();
    let density = 750 / app.globalData.systemInfo.windowWidth;
    let x = 200 / density, y = -100 / density;
    giftAnimationClips.translate(0, y).opacity(1).step()
    giftAnimationClips.translate(0, 0).opacity(0).step({ delay: 2e3 })
    that.setData({
      sender: json1,
      giftAnimation: giftAnimationClips.export()
    })
  },

  onShareAppMessage(res) {
    let that = this;
    that.setData({
      repeatDisplay: "show"
    });
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    // return share.shareObj();
    let userId = app.globalData.userId;
    let arr = app.splitList(app.globalData.config.liveShareList);
    let ran = Math.floor(Math.random() * arr.length);
    let brr = arr[ran];
    return {
      title: brr[1],
      path: "/pages/imi/imi?userId=" + userId + "&shareId=" + brr[0] + "&hostId=" + app.globalData.hostId
    }
  },

})