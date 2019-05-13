//--- 消息解析处理----- 消息和指令--- msghandler.js
var gloalConfig = require('./config.js');
/**
 * 解析普通消息
 */
function handleMsg(jsonMsg) {
  console.log('app msghandler handleMsg: ', jsonMsg)
}

/**
 * 解析指令消息
 */
function handleCmd(jsonMsg) {
  console.log('app msghandler handleCmdMsg: ', jsonMsg)
  jsonMsg = jsonMsg || {};
  var actionType = jsonMsg.actionType;
  switch (actionType) {
    case gloalConfig.ACTION_TYPE.NOTICE_INCOME: //收益通知


      break;

    case gloalConfig.ACTION_TYPE.CALL_ASK_HANGUP_BY_NORMAL: //正常通话挂断


      break;
    case gloalConfig.ACTION_TYPE.CALL_ASK_HANGUP_BY_SYSTEM: //系统强制挂断


      break;
    default:
      console.log('未处理消息:', jsonMsg)
  }
}

module.exports = {
  handleMsg: handleMsg,
  handleCmd: handleCmd
};