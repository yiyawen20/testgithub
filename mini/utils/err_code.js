var errCode = {
  /** 1000XX 全局变量 start**/
  /** 成功 */
  GLOBAL_SUCCESS: 100000,
  /** 系统异常 */
  GLOBAL_SYSTEM_ERROR: 100002,
  /** 请求失败 */
  GLOBAL_REQUEST_ERROR: 100003,
  /** 请求超时 */
  GLOBAL_REQUEST_TIMEOUT: 100004,
  /** header参数缺失 */
  GLOBAL_HPARAM_ABSENCE: 100006,
  /** header参数校验失败 */
  GLOBAL_HPARAM_CHECKERROR: 100007,
  /** header参数有误 */
  GLOBAL_HPARAM_ERROR: 100008,
  /** 不合法的url */
  GLOBAL_URL_ERROR: 100009,
  /** 请求参数缺失 */
  GLOBAL_PARAM_ABSENCE: 100010,
  /** 请求参数有误 */
  GLOBAL_PARAM_ERROR: 100011,
  /** 参数检验失败 */
  GLOBAL_PARAM_CHECKERROR: 100012,
  /** 网络异常 */
  GLOBAL_INTERNET_ERROR: 100013,
  /** sessionId 失效或者没有*/
  GLOBAL_SESSIONID_ERROR: 100014,
  /**没有满足条件的数据*/
  GLOBAL_DATA_NULL: 100015,
  /**处理失败*/
  GOLBAL_FAILED: 100016,
  /**后台设置缺失*/
  GOLBAL_CONSOLE_ABSENCE: 100017,
  /**重复操作*/
  GOLBAL_DO_AGAIN: 100018,

  /**业务代码自定义消息*/
  GLOBAL_CUSTOM_MESSAGE: 100019,

  /** 1000XX 全局变量 end**/

  /** 1001XX 注册登录 start */
  /** 手机号已经注册  */
  PHONE_HAS_REGISTER: 100100,
  /** 登录失败  */
  LOGIN_ERROR: 100101,
  /** 资料未完善  */
  LOGIN_INFO_UNCOMPLETE: 100102,
  /** 未注册，已发送验证码  */
  LOGIN_SMSCODE_SEND: 100103,
  /** QQ未授权  */
  LOGIN_QQ_UN_AUTH: 100104,
  /** QQ获取信息失败  */
  LOGIN_QQ_INFO_ERROR: 100105,
  /** 微信未授权  */
  LOGIN_WX_UN_AUTH: 100106,
  /** 微信获取信息失败  */
  LOGIN_WX_INFO_ERROR: 100107,
  /** 手机号未绑定  */
  LOGIN_PHONE_UNBIND: 100108,
  /** 手机号错误  */
  LOGIN_PHONE_ERROR: 100109,
  /** 验证码已发送  */
  LOGIN_SMS_SEND: 100110,
  /** 验证码发送失败  */
  LOGIN_SMS_SEND_EROOR: 100111,
  /** 验证码校验失败  */
  LOGIN_SMSCODE_ERROR: 100112,
  /** 你输入账号或密码错误  */
  LOGIN_ACC_UNREGISTER: 100113,
  /** 你输入账号或密码错误  */
  LOGIN_PWD_ERROR: 100114,
  /** 你输入账号或密码错误  */
  LOGIN_PWD_FORMATERROR: 100115,
  /** 新密码重新登录 */
  LOGIN_HAD_LOGIN_ARGIN: 100116,
  /** 昵称已存在  */
  LOGIN_NICKNAME_EXIST: 100117,
  /** 昵称不能为空  */
  LOGIN_NICKNAME_NULL: 100118,
  /** 个人信息获取失败  */
  LOGIN_INFO_GET_ERROR: 100119,
  /** 资料已完善，无需再次操作 */
  LOGIN_INFO_IS_COMPLETY: 100120,
  /** 注册操作超时 */
  LOGIN_REGISTER_TIMEOUT: 100121,
  /** 注册失败 */
  LOGIN_REGISTER_ERROR: 100122,
  /** 手机号绑定失败 */
  LOGIN_PHONE_BIND_ERROR: 100123,
  /** 手机号未注册 */
  PHONE_UN_REGISTER: 100124,
  /** 找回密码操作失败 */
  CHANGE_PWD_ERROR: 100125,
  /** 登录IP已被封 */
  LOGIN_IP_LOCKED_ERROR: 100126,
  /** 账号已被锁定 */
  LOGIN_USERID_LOCKED: 100127,
  /** 昵称有敏感字 */
  LOGIN_NICKNAME_BAN: 100128,
  /** 昵称超长 */
  LOGIN_NICKNAME_LONGER: 100129,
  /** 登录IP已被封 */
  LOGIN_IMEI_LOCKED_ERROR: 100130,

  /** 1001XX 注册登录 end */

  /** 1002XX 个人档案 start */

  /** 昵称已存在 **/
  USER_NICKNAME_EXIST: 100201,
  /** 昵称不能为空 **/
  USER_NICKNAME_IS_NULL: 100202,
  /** 昵称过长 **/
  USER_NICKNAME_TOO_LONG: 100203,

  /** 今日修改次数达到上限 **/
  USER_NICKNAME_HAS_CHANGED_TODAY: 100204,
  /** 职业不存在 **/
  INVALID_PROFESSION: 100205,
  /** 城市不存在 **/
  INVALID_CITY: 100206,
  /**身高不合法*/
  INVALID_HEIGHT: 100207,
  /**生日不合法*/
  INVALID_BIRTHDAY: 100208,
  /**学校不存在*/
  INVALID_SCHOOL: 100209,
  /**已提交审核信息*/
  REAL_AUTH_AUDITING: 100210,
  /**已完成实名认证*/
  REAL_AUTH_SUCCESS: 100211,
  /**视频审核中*/
  VIDEO_AUDITING: 100212,
  /** 签名不能为空 **/
  USER_SIGN_IS_NULL: 100213,
  /** 签名过长 **/
  USER_SIGN_TOO_LONG: 100214,

  /** 1002XX 个人档案 end */

  /** 1003XX 约吧 start */
  /** 账号被限制,无法发约 */
  INVITE_ACC_RESTICT: 100301,
  /** 连接中断 */
  INVITE_CONNECT_BREAK: 100302,
  /** 加速红包道具缺失 */
  INVITE_REDPACK_LACK: 100303,
  /** 加速红包道具可以使用 */
  INVITE_PEDPACK_ABLE: 100304,
  /** 未视频认证 */
  INVITE_VIDEO_UNAUTH: 100305,
  /** 未语言认证 */
  INVITE_AUDIO_UNAUTH: 100306,
  /** 报名失败 */
  INVITE_SIGNUP_ERROR: 100308,
  /** 扣费成功 */
  INVITE_DUDECTGOLD_SUCCESS: 100309,
  /** 扣费失败 */
  INVITE_DUDECTGOLD_ERROR: 100310,
  /** 余额不足 */
  INVITE_GOLD_DEFICIENCY: 100311,
  /** 视频剩余金豆不足2分钟 */
  INVITE_VIDEO_LESS_GOLD: 100312,
  /** 视频发约成功 */
  INVITE_VSEND_SUCCESS: 100313,
  /** 音频发约成功 */
  INVITE_ASEND_SUCCESS: 100314,
  /** 视频发约取消成功 */
  INVITE_VIDEO_CANCEL_SUCCESS: 100315,
  /** 音频发约取消失败 */
  INVITE_AUDIO_CANCEL_ERREO: 100316,
  /** 加速红包购买失败 */
  INVITE_REDPACK_BUY_ERROR: 100318,
  /** 评论失败 */
  INVITE_COMMENT_ERROR: 100321,
  /** 其他连接未断开 */
  INVITE_HAS_OTHER_RELATION: 100322,
  /** 对方正在聊天 */
  INVITE_TOUSER_HAS_INVITE: 100323,
  /** 对方未报名*/
  INVITE_TOUSER_UN_JOIN: 100324,
  /** 邀请已过期*/
  INVITE_RECV_JOIN_OUTTIME: 100325,
  /** 其他人已抢先*/
  INVITE_RECV_OTHER_JOIN: 100326,
  /** 重复操作其他人已经操作*/
  INVITE_DO_REPEAT: 100328,
  /** 对方忙，对方设置了不接受邀请*/
  INVITE_TOUSER_BUSY: 100329,
  /** 发约选择已经超时失效*/
  INVITE_SELECT_TIMEOUT: 100330,
  /** 报名已满*/
  INVITE_RECV_JOIN_FULL: 100331,
  /** 被对方拉黑*/
  INVITE_IN_USER_BLACK: 100332,
  /** 代金券活动没开启*/
  COUPON_ACT_IS_NO_OPNE: 100333,
  /** 不符合代金券新用户*/
  COUPON_IS_NEW_USER: 100334,
  /** 推荐用户为空*/
  COUPON_RECOM_USER_IS_NULL: 100335,
  /** 对方已取消 **/
  INVITE_OTHER_IS_CANCEL: 100336,
  /** 自己不能呼叫自己 **/
  INVITE_NOT_CALL_MYSELF: 100337,


  /** 1003XX 约吧 end */

  /** 1004XX 充值提现 start */
  /**余额不足*/
  WEALTH_INSUFFICIENT: 100401,
  /** 未实名认证 **/
  UNAUTH: 100402,
  /**更新金豆失败**/
  UPDATE_GOLD_FAILED: 100403,
  /** 当日提现已达到最大值 **/
  EXCHANGEOUT_IS_TOP: 100404,
  /**提现金额过少*/
  EXCHANGEOUT_SO_LITTLE: 100405,
  /**提现账号未设置*/
  ALIACCOUNT_IS_NULL: 100406,
  /**只有周一可以申请提现**/
  EXCHANGEOUT_NOT_IN_MONDAY: 100407,

  /**使用钻石充值*/
  USE_JEWEL_RECHARGE: 100408,

  /** 1004XX 充值提现 end */

  /** 1005XX 资源上传 start */
  /**上传文件格式不合法*/
  INVALID_RESOURCE_TYPE: 100501,
  /**上传资源太大*/
  RESOURCE_TOO_LARGE: 100502,
  /**上传资源失败*/
  RESOURCE_UPLOAD_FAILED: 100503
  /** 1005XX 资源上传 end */
}

module.exports = {
  errCode : errCode
}