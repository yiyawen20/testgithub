// 日志工具类 -- log.js
let logitems = [];
let isRecordLog = false;
let isDebug = false;

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const millisecond = date.getMilliseconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second, millisecond].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 记录日志
 */
const log = (msg, level) => {
  let time = formatTime(new Date());
  if(isRecordLog){
    logitems.push(`${time}: ${msg}`);
  }
  if (level === "error") {
    console.error(`${time}: ${msg}`);
  } else {
    console.log(`${time}: ${msg}`);
  }
}

/**
 * debug 日志
 */
const debug = (msg) => {
  if(!isDebug) {
    return;
  }
  log(msg);
}

/**
 * 上报日志
 */
const report = () => {

}

/**
 * 是否需要记录日志
 */
const setRecordLog = (bool) => {
  isRecordLog = bool;
}

const setDebug = (bool) => {
  isDebug = bool;
}

module.exports = {
  formatTime: formatTime,
  log: log,
  debug: debug,
  report: report,
  setRecordLog: setRecordLog,
  setDebug: setDebug,
  getLogs: function () { return logitems }
}
