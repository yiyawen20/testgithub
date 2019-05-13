//index.js
//获取应用实例
const app = getApp()
const gloalConfig = require('../../utils/config.js');
const login = require('../../utils/login.js');
import share from "../../utils/share.js";
const cdnfile = gloalConfig.cdnfile + "/imi_mini";
var moveDis = 0;
var movePos = [];

Page({
  data: {
    cdnfile: cdnfile,
    testInfo: "",
    attentionList: [],
    nextNum: 0,
    roomList: [],
    user: { nickName: "艾米直播" },
    judge: {},
    searchEmceeDisplay: false,
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    //所有图片的高度
    imgheights: [],
    current: 0,
    activeList: "",
    packageIndicatorDots: true,
    signData: [],
    myPackage: false,
    noPackage: false,
    signBox: false,
    packageData: [
      {
        title: "",
        desc: "",
        list: [
          { stuffType: "", stuff_name: 10 },
          { stuffType: "", stuff_name: 11 },
          { stuffType: "", stuff_name: 12 }
        ]
      }
    ],
    packageCurrent: 0
  },
  wStart(e){
    let pos = e.touches[0]
    movePos = [pos.pageX, pos.pageY];
  },
  wEnd(e) {
    let that = this;
    let pos = e.currentTarget
    movePos = [Math.abs(pos.offsetLeft - movePos[0]), Math.abs(pos.offsetTop - movePos[1])];
    moveDis = moveDis + movePos[0]
    if (moveDis > 3000){
      that.setData({
        searchEmceeDisplay: false
      })
    } else if (moveDis > 2000){
      that.setData({
        searchEmceeDisplay: true
      })
    }
  },
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: true
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: true
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  bannerImgLoad(e) {
    let that = this;
    let imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //计算的高度值  
    let viewHeight = 750 / ratio;
    // let imgheight = viewHeight;
    let imgheights = that.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = viewHeight;
    that.setData({
      imgheights: imgheights
    });
  },
  bannerHeightChange(e){
    this.setData({ current: e.detail.current });
  },
  bannerLoad(){
    let that = this;
    let path = "/imimini/api/banners", data = {};
    app.ajax(path, data, function (res) {
      if (res && res.result == 10000) {
        let _data = that.data.imgUrls.concat(res.data);
        _data = that.uniq(_data);
        that.setData({
          imgUrls: _data
        });
        if (_data.length > 1) {
          that.changeIndicatorDots();
          that.changeAutoplay();
        }
      }
    });
  },
  uniq(array){
    var temp = []; //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
      if (JSON.stringify(temp).indexOf(array[i].id) == -1) {
        temp.push(array[i]);
      }
    }
    return temp;
  },
  toActivity(e){
    let that = this;
    let dataset = e.target.dataset;
    let url = dataset.url;
    let linkUrl = encodeURIComponent(url);
    if (linkUrl.indexOf("https") < 0){
      linkUrl = linkUrl.replace("http", "https");
    }
    let title = dataset.title;
    let type = dataset.type;
    if (url.indexOf("?type") >= 0) {
      type = app.getParameter(url, "type");
      if (type == 1){
        if (app.globalData.userId <= 0) {
          //请登录
          login.wxLogin(app.routeUrl());
          return
        }
        url = "../share/share";
        wx.navigateTo({
          url: url,
        });
      }
    } else {
      wx.navigateTo({
        url: "../activity/activity?url=" + linkUrl + "&title=" + title,
      });
    }
    /*if (type == 1){
      console.log("sss");
      wx.navigateTo({
        url: "../share/share",
      });
    } else if (type == 2){
      console.log("222");
      wx.navigateTo({
        url: "../becomeman/becomeman",
      });
    }*/
  },
  attentionListLoad(){
    let that = this;
    let path = "/imimini/follow/list?userId=" + app.globalData.userId, data = { uid: 1 };
    app.ajax(path, data, function (res) {
      if (res && res.result == 10000) {
        let _data = res.data;
        that.setData({
          attentionList: _data
        });

        let user = that.data.user;
        if (app.isEmptyObject(app.globalData.userInfo)){
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                  success: function (e) {
                    user.userAvatar = e.userInfo.avatarUrl;
                    that.setData({
                      user: user
                    });
                  }
                })
              }
            }
          })
        } else if (app.globalData.userInfo.avatarUrl != undefined){
          user.userAvatar = app.globalData.userInfo.avatarUrl;
          that.setData({
            user: user
          });
        }

        if (gloalConfig.Config.env == "test"){
          that.setData({
            testInfo: app.globalData.userId + "," + app.globalData.scene
          });
        }
      }
    });
  },
  toInfo(){
    if(app.globalData.userId > 0){
      wx.navigateTo({
        url: '../mine/mine'
      });
    }else{
      login.wxLogin(app.routeUrl());
    }
  },
  onLoad: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    that.load();

    that.bannerLoad();

    that.attentionListLoad();

    wx.showShareMenu({
      withShareTicket: true
    });
    // wx.hideShareMenu();

    that.setData({
      user: {
        nickName: "艾米直播",
        userAvatar: "../images/default.png"
      },
      judge: { height: app.globalData.statusBarHeight }
    });
  },
  onGotUserInfo(e){
    console.log(e);
  },
  /**
   * load
   */
  load() {
    let that = this;
    that.getemeccInfo();
  },
  getemeccInfo: function (e) {
    let that = this;
    let startNum = that.data.nextNum;
    let path = "/imimini/api/roomList";
    let data = {
      type: 1,
      label: "",
      startNum: startNum,
      listLen: 8,
      method: "GET"
    }
    app.ajax(path, data, function(resp){
      if (resp.result == 0){
        let roomList = resp.roomList;
        for (let i = 0; i < roomList.length; i++) {
          let url = roomList[i].mobileLiveAvatar;
          if (url.indexOf("http") == -1) {
            url = gloalConfig.cdnstatic + url;
            roomList[i].imageUrl = url;
          }
        }

        let nextNum = that.data.nextNum + 8;
        let roomLists = that.data.roomList;
        //测试
        if (gloalConfig.Config.env == "test") {
          let listId = [101226, 103787, 101161];
          for (let i in listId) {
            roomLists.push({
              userId: listId[i],
              imageUrl: "//cdnstatic.imifun.com/ivp/avatar/avatar/2019/3/21/1553155335116_final.jpg",
              isLive: "1",
              roomName: "可视对讲可视对讲发的",
              userCount: "6888"
            });
          }
        }
        roomList = roomLists.concat(roomList);
        that.setData({
          roomList: roomList,
          nextNum: nextNum
        })
      }else{
        
        //测试
        if (gloalConfig.Config.env == "test") {
          let roomList = []
          let nextNum = that.data.nextNum + 8;
          let roomLists = that.data.roomList;
          let listId = [101226, 103787, 101161];
          for (let i in listId) {
            roomLists.push({
              userId: listId[i],
              imageUrl: "//cdnstatic.imifun.com/ivp/avatar/avatar/2019/3/21/1553155335116_final.jpg",
              isLive: "1",
              roomName: "可视对讲可视对讲发的",
              userCount: "6888"
            });
          }
          roomList = roomLists.concat(roomList);
          that.setData({
            roomList: roomList,
            nextNum: nextNum
          })
        }
        
        wx.showToast({
          title: '主播列表加载失败，请下拉刷新',
          icon: "none",
          duration: 2000
        })
      }
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  imiReqRoom(e){
    let hostId = e.currentTarget.dataset.tid;
    let that = this;
    if(app.globalData.userId <= 0){
      wx.redirectTo({
        url: '../imi/imi?hostId=' + hostId,
        success: function () { }
      })
      return
    }
    let path = gloalConfig.baseUrl + "/imimini/api/emceeinfo?hostId=" + hostId, data = {};
    app.ajax(path, data, function (resp) {
      let roomId = resp.roomId;
      that.toImiReqRoom(e, roomId);
    });
  },
  toImiReqRoom: function (e, roomId) {
    let hostId = e.currentTarget.dataset.tid;
    let that = this;
    let path = "/imimini/room/ispermit";
    let data = {
      roomId: roomId,
      method: "GET"
    };
    app.ajax(path, data, function(res){
      let result = res.result;
      if (result == 10000){
        wx.redirectTo({
          url: '../imi/imi?hostId=' + hostId,
          success: function () { }
        })
      } else if (result == 10001){
        wx.showToast({
          title: '被踢出房间，无法进入直播间',
          icon: "none",
          duration: 2000
        })
      } else if (result == 10002) {
        wx.showToast({
          title: 'ID被封，无法进入直播间',
          icon: "none",
          duration: 2000
        })
      } else if (result == 10003) {
        wx.showToast({
          title: 'IP被封，无法进入直播间',
          icon: "none",
          duration: 2000
        })
      } else if (result == 10003) {
        wx.showToast({
          title: '错误，请重新打开小程序',
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  openActive(){
    let that = this;
    if (app.globalData.userId <= 0){
      //请登录
      login.wxLogin(app.routeUrl());
      return
    }
    let activeList = "";
    if (that.data.activeList == ""){
      activeList = "act";
    }
    that.setData({
      activeList: activeList
    });
  },
  signPanel(){
    let that = this;
    that.getSign();
  },
  getSign(){
    let that = this;
    let userId = app.globalData.userId;
    if (userId <= 0){
      login.wxLogin(app.routeUrl());
      return
    }
    let path = "/imimini/sign/list?userId=" + userId, data = { uid: 1 };
    app.ajax(path, data, function(res){
      if(res.result == 10000){
        let signData = [];
        let day = ["一", "二", "三", "四", "五", "六", "七"]
        for (let i in res.data){
          signData[i] = new Object();
          signData[i].receive = res.data[i] == 0 ? "" : "award_receive";
          signData[i].title = res.data[i] == 0 ? "第" + day[i] + "天" + (i == 6 ? "神秘礼包" : "") : "已领取";
        }
        that.setData({
          signData: signData,
          "signBox": !that.data.signBox
        });
      }else{
        wx.showToast({
          title: '系统异常',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  signReceive(e){
    let that = this;
    let path = "/imimini/sign?userId=" + app.globalData.userId, data = { uid: 1 };
    app.ajax(path, data, function(res){
      if(res.result == 10000){
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration: 2000
        })
        that.getSign();
      } else if (res.result == 10001){
        login.wxBindPhone(app.routeUrl());
        /*wx.showToast({
          title: '未绑定手机号码',
          icon: 'none',
          duration: 2000
        })*/
      } else if (res.result == 10002) {
        wx.showToast({
          title: '今天已经签到',
          icon: "none",
          duration: 2000
        })
      } else if (res.result == 10003) {
        wx.showToast({
          title: '今天签到失败',
          icon: "none",
          duration: 2000
        })
      } else if (res.result == 99999) {
        wx.showToast({
          title: '签到异常',
          icon: "none",
          duration: 2000
        })
      }
    });
  },
  /**timestamp转换为String**/
  changeTimestampToString(ts) {
    var ts = ts.toString().substr(0, 10);
    return new Date(parseInt(ts) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
  },
  bagPanel() {
    let that = this;
    let userId = app.globalData.userId;
    if (userId <= 0) {
      login.wxLogin(app.routeUrl());
      return
    }
    let path = "/imimini/package/userHasAwards", data = { uid:1 };
    app.ajax(path, data, function(rs){
      let sysList = rs.list;
      let pList = rs.plist;
      if (!app.globalData.packageData) {
        app.globalData.packageData = [];
      }
      if ((sysList && sysList.length > 0) || (pList && pList.length > 0)
        || (rs.logonAward && rs.logonAward > 0) || (typeof (rs.hasSun) != "undefined" && rs.hasSun)){
        //有礼包
        that.setData({
          "myPackage": !that.data.myPackage
        });

        var html = '';
        var award_name = "";
        let packageSysData = [];
        if (sysList && sysList.length > 0) {//系统定时奖励的显示
          var last_week = 0;
          for (var i = 0; i < sysList.length; i++) {
            if (sysList[i].gift_type == 1) {
              award_name = "上周礼物之星";
            } else if (sysList[i].gift_type == 2) {
              award_name = "梦中情人";
            } else if (sysList[i].gift_type == 3) {
              award_name = "名扬天下";
            } else if (sysList[i].gift_type == 4) {
              award_name = "守护者";
            } else if (sysList[i].gift_type == 5) {
              award_name = "香车美人";
            } else if (sysList[i].gift_type == 6) {
              award_name = "爱情女神";
            } else if (sysList[i].gift_type == 7) {
              award_name = "铁粉礼包";
            } else if (sysList[i].gift_type == 8) {
              award_name = "精灵女神";
            } else if (sysList[i].gift_type == 9) {
              award_name = "缘定七夕";
            }
            packageSysData[i] = new Object();

            if (last_week == 0 || sysList[i].gift_type != 1) {
              packageSysData[i].title = award_name;
              packageSysData[i].desc = sysList[i].package_explain || award_name;
              that.clickReceiveAwards(i, sysList[i].gift_type);
              if (sysList[i].gift_type == 1) {//上周礼物之星
                last_week = 1;
              }
            }
          }
        }
        if (!app.globalData.packageSysData) {
          app.globalData.packageSysData = [];
        }
        app.globalData.packageSysData = packageSysData;

        let pListData = [];
        if (pList && pList.length > 0) {//其他礼包的奖励
          var type_only = 0;
          for (var i = 0; i < pList.length; i++) {
            pListData[i] = new Object();
            if (pList[i].package_type == 5) {
              pListData[i].title = pList[i].package_name;
              pListData[i].desc = pList[i].package_explain;
              that.receiveAwardByPId(i, pList[i].package_id, pList[i].package_style, pList[i].package_type);

            } else if (pList[i].package_type == 9 && type_only == 0) {
              pListData[i].title = "充值返还礼包";
              pListData[i].desc = pList[i].package_explain || "充值返还礼包";
              that.receiveAwardByPtype(i, 9, 1);
              type_only = 1;

            } else if (pList[i].package_type == 13) {
              pListData[i].title = "精灵守护礼包";
              pListData[i].desc = pList[i].package_explain || "精灵守护礼包";
              that.receiveAwardByPId(i, pList[i].package_id, pList[i].package_style, pList[i].package_type);

            } else {//其他礼包 包括 系统赠送礼包
              pListData[i].title = pList[i].package_name;
              pListData[i].desc = pList[i].package_explain;
              that.receiveAwardByPId(i, pList[i].package_id, pList[i].package_style, pList[i].package_type);
            }
          }
        }
        if (!app.globalData.pListData) {
          app.globalData.pListData = [];
        }
        app.globalData.pListData = pListData;

        let logonAwardData = [];
        let logonAward = rs.logonAward
        if (logonAward && logonAward > 0) {//新人每日连续登录礼包的领取
          logonAwardData[0].title = "连续登录礼包";
          logonAwardData[0].desc = "连续登录礼包";
          that.clickReceiveNewLoginAwards()
        }
        if (!app.globalData.logonAwardData) {
          app.globalData.logonAwardData = [];
        }
        app.globalData.logonAwardData = logonAwardData;
      }else{
        that.setData({
          "noPackage": !that.data.noPackage
        });
      }
    });
  },
  clickReceiveNewLoginAwards(){
    let that = this;
    let path = "/imimini/package/receiveNewLoginAwards", data = {};
    app.ajax(path, data, function(rs){
      if (rs == -1) {
        login.wxLogin(app.routeUrl());
      } else if (rs > 0) {
        let list = that.showGiftLoginAwards(rs);
        app.globalData.logonAwardData[0].list = list;
        app.globalData.packageData.push(app.globalData.logonAwardData[0]);
        that.setData({
          packageData: app.globalData.packageData
        })
      } else if (rs == 0) {
        // showCommonPanel("亲，你今天已经领过奖励了");
        wx.showToast({
          title: '已经领过奖励',
          icon: 'none',
          duration: 2000
        })
      } else if (rs == -2) {
        // showCommonPanel("赠送阳光异常，请重新领取");
        wx.showToast({
          title: '出错重新领取',
          icon: 'none',
          duration: 2000
        })
      }
      // getUserHasAward();
    });
  },
  showGiftLoginAwards(rs){
    var packageName = "连续登陆礼包";
    let list = [];
    let imgstr = gloalConfig.cdnfile + "/images/props/sunlight.png";
    let numstr = "阳光" + rs + "点";
    list[i] = new Object();
    list[i].stuffType = imgstr
    list[i].stuff_name = numstr
    return list;
  },
  clickReceiveAwards(i, giftType){
    let that = this;
    if (giftType <= 0) {
      // showCommonPanel("选择的领取的奖励出错，请刷新界面！");
      wx.showToast({
        title: '礼包出错请刷新',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let path = "/imimini/package/userReceiveAwards";
    let data = {
      checkType: giftType,
      method: "GET"
    };
    app.ajax(path, data, function(rs){
      if (rs > 0) {
        //showCommonPanel("恭喜您获得系统奖励的"+rs+"金豆");
        let list = that.showGiftSystem(giftType, rs);
        app.globalData.packageSysData[i].list = list;
        app.globalData.packageData.push(app.globalData.packageSysData[i]);
        that.setData({
          packageData: app.globalData.packageData
        })
      }
      else if (rs == 0) {
        // showCommonPanel("亲, 你已经领奖了哦. ");
        wx.showToast({
          title: '已经领奖',
          icon: 'none',
          duration: 2000
        })
      }
      else if (rs == -1) {
        login.wxLogin(app.routeUrl());
      }
      else {
        // showCommonPanel("领金豆出现异常，请联系客服");
        wx.showToast({
          title: '异常',
          icon: 'none',
          duration: 2000
        })
      }
      // getUserHasAward();
    });
  },
  showGiftSystem(giftType, rs){
    let list = [];
    var packageName = "";
    if (giftType == 1) {
      packageName = "上周礼物之星";
    } else if (giftType == 2) {
      packageName = "梦中情人";
    } else if (giftType == 3) {
      packageName = "名扬天下";
    } else if (giftType == 4) {
      packageName = "守护者";
    } else if (giftType == 5) {
      packageName = "香车美人";
    } else if (giftType == 6) {
      packageName = "爱情女神";
    } else if (giftType == 7) {
      packageName = "铁粉礼包";
    } else if (giftType == 8) {
      packageName = "精灵女神";
    } else if (giftType == 9) {
      packageName = "缘定七夕";
    }
    let imgstr = gloalConfig.cdnfile + "/taskAct/2018/spring/gold_icon.png";
    let numstr = "金豆" + rs + "个";
    list[i] = new Object();
    list[i].stuffType = imgstr
    list[i].stuff_name = numstr
    return list;
  },
  receiveAwardByPId(i, packageId, packageStyle, packageType){
    let that = this;
    if (packageId <= 0) {
      wx.showToast({
        title: '礼包出错请刷新',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let path = "/imimini/package/receiveAwardByPId";
    let data = {
      packageId: packageId,
      packageStyle: packageStyle,
      packageType: packageType,
      method: "GET"
    };
    app.ajax(path, data, function(rs){
      if (rs == -101) {
        login.wxLogin(app.routeUrl());
      } else if (rs == -102) {
        // showCommonPanel("礼包类型参数不对，请刷新界面！");
        wx.showToast({
          title: '礼包出错请刷新',
          icon: 'none',
          duration: 2000
        })
      } else if (rs.result == 1) {
        var packageName = rs.explainList[0].package_name;
        var explan = rs.explainList[0].package_explain;
        let list = that.showCommonGift(packageName, explan, rs.detailList);
        app.globalData.pListData[i].list = list;
        app.globalData.packageData.push(app.globalData.pListData[i]);
        that.setData({
          packageData: app.globalData.packageData
        })
      } else if (rs.result == 0) {
        // showCommonPanel("亲，你今天已经领过奖励了");
        wx.showToast({
          title: '已经领过奖励',
          icon: 'none',
          duration: 2000
        })
      } else if (rs.result == -2) {
        // showCommonPanel("领取异常，请重新领取");
        wx.showToast({
          title: '领取异常',
          icon: 'none',
          duration: 2000
        })
      }
      // getUserHasAward();重新加载礼包
    });
  },
  receiveAwardByPtype(i, packageType, packageStyle){
    let that = this;
    if (packageId <= 0) {
      wx.showToast({
        title: '礼包出错请刷新',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let path = "/imimini/package/receiveAwardByPtype";
    let data = {
      packageType: packageType,
      packageStyle: packageStyle,
      method: "GET"
    };
    app.ajax(path, data, function(rs){
      if (rs == -101) {
        login.wxLogin(app.routeUrl());
      } else if (rs == -102) {
        // showCommonPanel("礼包类型参数不对，请刷新界面！");
        wx.showToast({
          title: '礼包出错请刷新',
          icon: 'none',
          duration: 2000
        })
      } else if (rs.result > 0) {
        if (rs.detailList && rs.detailList.length > 0) {
          // showPageGift.showGiftByType(rs.detailList);
          let list = that.showGiftByType(rs.detailList);
          app.globalData.pListData[i].list = list;
          app.globalData.packageData.push(app.globalData.pListData[i]);
          that.setData({
            packageData: app.globalData.packageData
          })
        } else {
          // showCommonPanel("恭喜你成功领取礼包奖励!")
          wx.showToast({
            title: '礼包领取成功',
            icon: 'success',
            duration: 2000
          })
        }
      } else if (rs.result == 0) {
        // showCommonPanel("亲，你今天已经领过奖励了");
        wx.showToast({
          title: '已领过奖励',
          icon: 'success',
          duration: 2000
        })
      } else if (rs.result == -2) {
        // showCommonPanel("领取异常，请重新领取");
        wx.showToast({
          title: '礼包出错请刷新',
          icon: 'none',
          duration: 2000
        })
      }
      // getUserHasAward();
    })
  },
  showCommonGift(packageName, explan, detailList){
    if (explan == null) {
      explan = "";
    }
    let list = [];
    for (var i = 0; i < detailList.length; i++) {
      var stuffType = detailList[i].stuff_type;
      var stuff_nums = detailList[i].stuff_nums;
      var stuffSn = detailList[i].stuff_sn;
      var stuff_name = detailList[i].stuff_name;
      var imgstr = "";
      var numstr = "";
      if (stuffType == 1 && stuff_nums > 0) {// 金豆
        imgstr = gloalConfig.cdnfile + "/taskAct/2018/spring/gold_icon.png";
        numstr = stuff_name + stuff_nums + "个";
      } else if (stuffType == 2) {// 礼物
        imgstr = gloalConfig.cdnfile + "/v4/images/gift_min/" + stuffSn + ".png";
        numstr = stuff_name + stuff_nums + "个";
      } else if (stuffType == 3) {// 阳光
        imgstr = gloalConfig.cdnfile + "/images/props/sunlight.png";
        numstr = stuff_name + stuff_nums + "点";
      } else if (stuffType == 4) {// 座驾
        imgstr = gloalConfig.cdnfile + "/v4/images/car_min/" + stuffSn + ".png";
        numstr = stuff_name + stuff_nums + "辆";
      } else if (stuffType == 5) {// 徽章
        imgstr = gloalConfig.cdnfile + "/pic/global_badge/" + stuffSn + ".png";
        numstr = stuff_name + stuff_nums + "枚";
      } else if (stuffType == 6) {// 道具
        imgstr = gloalConfig.cdnfile + "/v4/images/gift_min/" + stuffSn + ".png";
        numstr = stuff_name + stuff_nums + "个";
      } else if (stuffType == 11) {// 贝壳
        imgstr = gloalConfig.cdnfile + "/v4/style/img/shell2.png";
        numstr = stuff_name + stuff_nums + "个";
      } else if (stuffType == 8) {// 宝箱
        imgstr = gloalConfig.cdnfile + "/v4/images/gift_min/package.png";
        numstr = stuff_name + stuff_nums + "个";
      } else if (stuffType == 7) {// 经验值
        imgstr = "";
        numstr = stuff_name + stuff_nums + "点";
      } else {
        imgstr = "";
        numstr = stuff_name + stuff_nums + "点";
      }
      list[i] = new Object();
      list[i].stuffType = imgstr
      list[i].stuff_name = numstr
    }
    return list;
  },
  showGiftByType(detailList){
    if (detailList && detailList.length > 0){
      var packageName = detailList[0].package_name;
      var explan = detailList[0].package_explain;
      if (explan == null) {
        explan = "";
      }
      let list = [];
      var arr = new Array();
      var lihtml = "";
      for (var i = 0; i < detailList.length; i++) {
        arr = [];
        arr = detailList[i].detail.split("|");
        var stuffType = arr[0];
        var stuff_nums = arr[2];
        var stuffSn = arr[4];
        var stuff_name = arr[1];
        var imgstr = "";
        var numstr = "";
        if (stuffType == 1 && stuff_nums > 0) {// 金豆
          imgstr = gloalConfig.cdnfile + "/taskAct/2018/spring/gold_icon.png";
          numstr = stuff_name + stuff_nums + "个";
        } else if (stuffType == 2) {// 礼物
          imgstr = gloalConfig.cdnfile + "/v4/images/gift_min/" + stuffSn + ".png";
          numstr = stuff_name + stuff_nums + "个";
        } else if (stuffType == 3) {// 阳光
          imgstr = gloalConfig.cdnfile + "/images/props/sunlight.png";
          numstr = stuff_name + stuff_nums + "点";
        } else if (stuffType == 4) {// 座驾
          imgstr = gloalConfig.cdnfile + "/v4/images/car_min/" + stuffSn + ".png";
          numstr = stuff_name + stuff_nums + "辆";
        } else if (stuffType == 5) {// 徽章
          imgstr = gloalConfig.cdnfile + "/pic/global_badge/" + stuffSn + ".png";
          numstr = stuff_name + stuff_nums + "枚";
        } else if (stuffType == 6) {// 道具
          imgstr = gloalConfig.cdnfile + "/v4/images/gift_min/" + stuffSn + ".png";
          numstr = stuff_name + stuff_nums + "个";
        }
        list[i] = new Object();
        list[i].stuffType = imgstr
        list[i].stuff_name = numstr
      }
      return list;
    }
  },
  close(e){
    let that = this;
    let _id = e.currentTarget.dataset.hideid;
    if (_id == "signBox"){
      that.setData({
        "signBox": !that.data.signBox
      });
    }
    if (_id == "myPackage") {
      that.setData({
        "myPackage": !that.data.myPackage
      });
    }
    if (_id == "noPackage") {
      that.setData({
        "noPackage": !that.data.noPackage
      });
    }
  },
  packageSliderChange(e){
    let that = this;
    that.setData({
      packageCurrent: e.detail.current
    })
    console.log(e, "领取礼包切页");
  },
  packageReceive(){
    let that = this;
    if (app.globalData.packageData.length > 0){
      app.globalData.packageData.splice(that.data.packageCurrent, 1)
      if (that.data.packageCurrent == app.globalData.packageData.length){
        that.data.packageCurrent--;
        that.data.packageCurrent = that.data.packageCurrent < 0 ? 0 : that.data.packageCurrent;
        that.setData({
          packageCurrent: that.data.packageCurrent
        })
      }
      that.setData({
        packageData: app.globalData.packageData
      })
      if (app.globalData.packageData.length == 0){
        that.setData({
          "myPackage": !that.data.myPackage,
          "noPackage": !that.data.noPackage
        });
      }
    }else{
      that.setData({
        "myPackage": !that.data.myPackage,
        "noPackage": !that.data.noPackage
      });
    }
    
  },
  messageFormSubmit: function (e) {
    app.formSubmit(e);
    //console.log('form发生了submit事件，携带数据为：', e.detail.formId)
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    let that = this;
    moveDis = 0;
    /*let user = that.data.user;
    wx.getSetting({
      success(res){
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success: function (e) {
              user.userAvatar = e.userInfo.avatarUrl;
              that.setData({
                user: user
              });
            }
          })
        }
      }
    })*/
  },
  onPullDownRefresh(){
    let that = this;
    // wx.stopPullDownRefresh();
    //下拉刷新
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    /*clearTimeout(that.refreshListTimer);
    that.refreshListTimer = setTimeout(()=>{
      
    }, .2e3);*/
    that.setData({
      roomList: [],
      nextNum: 0
    })
    that.getemeccInfo();
    that.bannerLoad();
    that.attentionListLoad();
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    let that = this;
    /*wx.showLoading({
      title: '加载中',
      mask: true
    });*/
    /*clearTimeout(that.refreshListTimer);
    that.refreshListTimer = setTimeout(that.getemeccInfo, .2e3);*/
    that.getemeccInfo();
  },
  onShareAppMessage(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }  
    return share.shareObj();
  }
})
