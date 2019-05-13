var encrypt = require('encrypt.js');

var sdkappid = 0;
var fetchSigUrl='';

function login(opts) {
  var uid = opts.uid;
  wx.request({
    url: fetchSigUrl,
    data: {
      "id": uid,
      "appid": sdkappid
    },
    method: 'post',
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      opts.success && opts.success({
        UserSig: res.data.data.userSig
      });
    },
    fail: function(errMsg) {
      opts.error && opts.error(errMsg);
    }
  });
}

module.exports = {
  init: function(opts) {
    sdkappid = opts.sdkappid;
    fetchSigUrl = opts.fetchSigUrl;
  },
  login: login
};