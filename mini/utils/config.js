var config = {
  env: 'product', //develop | test | product
  fromType: 100861008,//100861008自定义
  server: 1,
  psdkappid: 1400072939,
  tsdkappid: 1400060425
};

let cdnstatic = {
  "develop": "https://cdnstatic.imifun.com/ivp",
  "test": "https://static.mobimtech.com/ivp",
  "product": "https://cdnstatic.imifun.com/ivp"
}

let cdnfile = {
  "develop": "https://cdnfile.imifun.com/www/ivp",
  "test": "https://cdn.mobimtech.com/www/ivp",
  "product": "https://cdnfile.imifun.com/www/ivp"
}

var baseReqUrl = {
  'develop': 'https://mini.imifun.com',
  'test': 'https://minitest.imifun.com',
  'product': 'https://mini.imifun.com'
}

//主站url
var masterURL = {
  'develop': 'https://aimi.mobimtech.com/',
  'test': 'https://aimi.mobimtech.com/',
  'product': 'https://www.imifun.com/'
}

let requestUrl = {
  /*getwssurl: 'http://connector.mobimtech.com:8004/imi/1/',
  chatUrl: 'ws://connector.mobimtech.com:8004/imi/1/websocket/',*/
  getwssurl: {
    "develop": 'https://testchatwss.imifun.com/imi/1/',
    "test": 'https://testchatwss.imifun.com/imi/1/',
    "product": 'https://chatwss.imifun.com/imi/1/'
  },
  chatUrl: {
    "develop": 'wss://testchatwss.imifun.com/imi/1/websocket/',
    "test": 'wss://testchatwss.imifun.com/imi/1/websocket/',
    "product": 'wss://chatwss.imifun.com/imi/1/websocket/'
  },
  chatUrls: '?token=bro5af7jcpn5a37lfu9d8oqrkbd9&isPack=false'
}

let wxUrl = {
  'develop': 'https://wx.mobimtech.com/',
  'test': 'https://wx.mobimtech.com/',
  'product': 'https://s1wx.imifun.com/'
}

//敏感词过滤
var sensitive_word_list_reg = /[\u0F00-\u0FFF]|[\u0600-\u06FF]|[\u0750-\u077F]|[\uFB50–\uFDFF]|[\uFE70–\uFEFF]/ig;
//过滤字符
var FilterStr = {
  number: "扣1234567890１２３４５６７８９０一二三四五六七八九零 ①②③④⑤⑥⑦⑧⑨㈠ ㈡ ㈢ ㈣ ㈤ ㈥ ㈦ ㈧ ㈨ ⑴ ⑵ ⑶ ⑷ ⑸ ⑹ ⑺ ⑻ ⑼壹贰叁肆伍陆柒捌玖",
  letter: "./．点。abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZａｂｃｄｅｆｇｈｉｇｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＧＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ",
  dots: "らㄋ⒈⒉⒋⒌⒍⒎⒏⒐⒑⒒⒓⒔⒕⒖⒗⒘⒙⒚⒛ΒСΟΚКМТΧΙΝткτκ┰Τ"
};

var face = {
    "0": "`狂笑",
    "1": "`大笑",
    "2": "`惊讶",
    "3": "`害羞",
    "4": "`窃笑",
    "5": "`发怒",
    "6": "`大哭",
    "7": "`色色",
    "8": "`坏笑",
    "9": "`发火",
    "10": "`汗",
    "11": "`贼笑",
    "12": "`欢迎",
    "13": "`再见",
    "14": "`白眼",
    "15": "`挖鼻",
    "16": "`赞",
    "17": "`胜利",
    "18": "`欧耶",
    "19": "`抱拳",
    "20": "`囧",
    "21": "`淡定",
    "22": "`挑眉",
    "23": "`抽",
    "24": "`神马",
    "25": "`开心",
    "26": "`给力",
    "27": "`飞吻",
    "28": "`眨眼",
    "29": "`V5",
    "30": "`来吧",
    "31": "`肿么了",
    "32": "`困惑",
    "33": "`雷",
    "34": "`愁人",
    "35": "`萌萌",
    "36": "`审视",
    "37": "`无语",
    "38": "`无奈",
    "39": "`亲亲",
    "40": "`勾勾",
    "41": "`后后",
    "42": "`吐血",
    "43": "`啊哦",
    "44": "`媚眼"
  };
 var vipface= {
    "1": "@我踩",
    "2": "@加油",
    "3": "@惊喜",
    "4": "@发财",
    "5": "@写报告",
    "6": "@预防感冒",
    "7": "@大哭",
    "8": "@泡澡澡",
    "9": "@美男子",
    "10": "@沙发",
    "11": "@爱爱",
    "12": "@打飞",
    "13": "@吐血",
    "14": "@超人",
    "15": "@有福",
    "16": "@再见",
    "17": "@闪光耀眼",
    "18": "@掀桌子",
    "19": "@草泥马",
    "20": "@洗白白",
    "21": "@汗",
    "22": "@失落",
    "23": "@不要啊",
    "24": "@爱意满满",
    "25": "@冷",
    "26": "@嘲笑",
    "27": "@贱叫",
    "28": "@哭泣",
    "29": "@安静",
    "30": "@疑问",
    "31": "@威武",
    "32": "@流鼻血",
    "33": "@卖烧",
    "34": "@合照",
    "35": "@龙椅",
    "36": "@开火",
    "37": "@枣上好",
    "38": "@露腿",
    "39": "@喷血",
    "40": "@吻腿",
    "41": "@吐",
    "42": "@真好听",
    "43": "@紧急抢救",
    "44": "@鼓舞",
    "45": "@吃货",
    "46": "@挂盐水",
    "47": "@怨气",
    "48": "@画圈圈",
    "49": "@送花",
    "50": "@怒火",
    "51": "@喜欢你",
    "52": "@流氓",
    "53": "@土豪",
    "54": "@炸死你",
    "55": "@吃瓜众",
    "56": "@吃药",
    "57": "@我好方",
    "58": "@666",
    "59": "@噗噗噗",
    "60": "@单身狗",
    "61": "@约吗",
    "62": "@老司机",
    "63": "@色迷迷",
    "64": "@献爱",
    "65": "@干杯",
    "66": "@屎",
    "67": "@完美",
    "68": "@蓝瘦香菇"
  };
var gifts = {
  sendList: [2531],
  2531: {
    name: '棒棒糖',
    price: '40'
  },
  1110: {
    name: '金玫瑰',
    price: '400'
  }
};
/*gifts.sort(function(a, b) {
  return a.price - b.price
});*/

//消息类型定义，具体参考文档消息结构体
var MSG_TYPE = {
  CALL_RECORDS: 1, //通话记录
  SYSTEM: 2, //系统消息
  PRIVATE_CHAT: 3, //一对一私聊
  CALL_RECORDS_DETAIL: 4, //通话详情，系统消息
  CONSOLE_AUDIT_PLAIN: 5, //后台系统消息(审核情况，等纯文字)
  CONSOLE_PUSH_MUTI: 6, //后台推送系统消息(有图片)
  SYSTEM_SIMU_CHAT: 7, //系统模拟一对一聊天
  PUSH_MICRO_PAGE: 8, //小秘书发送微网页
  SEND_GIFT: 20 //私信一对一界面聊天时送礼
}

//信令类型定义，具体参考文档消息结构体
var ACTION_TYPE = {
  SEND_ASK: 1, //发约
  SEND_ASK_CANCEL: 2, //发约取消
  SEND_ASK_RECV: 3, //j接受发约邀请
  CHAT_BEGAN: 4, // 已经开始聊天，双方看到对方视频
  NOTICE_INCOME: 5, //收益通知
  CALL_ASK: 11, //指定用户一对一,呼叫
  CALL_ASK_CANCEL: 12, //呼叫取消
  CALL_ASK_ACCEPT: 13, //接受呼叫
  CALL_ASK_REJECT: 14, //拒绝接听
  CALL_ASK_HANGUP_BY_NORMAL: 15, //通话挂断
  CALL_ASK_HANGUP_BY_SYSTEM: 16, //系统强制挂断通话
  COIN_NOT_ENOUGH_ONE_MIN: 17, //通话时长不满一分钟
  RECHARGE_SUCCESS: 18, //充值成功
  BILL_FEE_NOTICE: 19, //扣费通知，通话结束时收到
  SEND_GIFT: 20, //音视频过程中送礼,
  USE_VOUCHER: 21, // 使用代金券
  USE_VOUCHER_OK: 22 //代金券使用完成
}

var MEDIA_TYPE = {
  AUDIO_TYPE: 1, //音频聊天
  VIDEO_TYPE: 2 //视频聊天
}

module.exports = {
  getSdkappid: function() {
    return config.env == 'product' ? config.psdkappid : config.tsdkappid;
  },
  Config: config,
  gifts: gifts,
  face: face,
  vipface: vipface,
  MSG_TYPE: MSG_TYPE,
  ACTION_TYPE: ACTION_TYPE,
  MEDIA_TYPE: MEDIA_TYPE,
  cdnstatic: cdnstatic[config.env],
  cdnfile: cdnfile[config.env],
  baseUrl: baseReqUrl[config.env],
  masterURL: masterURL[config.env],
  wxUrl: wxUrl[config.env],
  requestUrl: requestUrl,
  getwssurl: requestUrl.getwssurl[config.env],
  chatUrl: requestUrl.chatUrl[config.env],
  sensitive_word_list_reg: sensitive_word_list_reg,
  FilterStr: FilterStr,
  version: '1.6.4' //该参数很重要
}