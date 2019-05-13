const APPID = "c6a3a55301614c06a86617e91433bdc7";

if (APPID === "") {
  wx.showToast({
    title: `请在util/agora/config.js中提供正确的appid`,
    icon: 'none',
    duration: 5000
  });
}

module.exports = {
  APPID: APPID
}