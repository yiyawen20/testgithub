window.addSub = function(){
    let _ram = Math.random();
    return _ram > .5 ? 1 : -1;
},
//窗口
window.win = {
    width: 750,
    height: 1334
}

window.mouseStatus = true;

window.webSocketState = 0;//webSocket是否连接，0表示没连接
window.kickoutState = 0;//断开状态，1表示断开，2表示系统异常断开

window.commonCode = {};//没有解析的消息


window.query2Obj = function() {
	var result = {};
	var query = location.search.slice(1);
	var arr = query.split("&");
	for(var i = 0; i < arr.length; i++) {
		var brr = arr[i].split('=');
		result[brr[0]] = brr[1];
	}
	return result;
}
window.userId = - parseInt(Math.random() * 1e6);
window.token = undefined;
window.userInfo = {};

window.showTianInfo = [];

window.consoleArr = [];
var log = cc.log;
cc.log = function(){
    // log("cc:"+text);
    let text = "";
    for(let i in arguments){
        text += arguments[i];
    }
    if(config.env != "product"){
        log.call(cc,"cc:"+text);//使用call让log里面的this指向console,而不是window
    }
    if(consoleArr.length > 120){
        consoleArr.splice(0, 1);
    }
    consoleArr.push("cc:"+text);
}

var log = console.log;
console.log = function(){
    // log("console:"+text);
    let text = "";
    for(let i in arguments){
        text += arguments[i];
    }
    if(config.env != "product"){
        log.call(console,"console:"+text);//使用call让log里面的this指向console,而不是window
    }
    if(consoleArr.length > 120){
        consoleArr.splice(0, 1);
    }
    consoleArr.push("console:"+text);
}

//礼物
window.giftConfig = {
    1312: {
        name: '香吻'
    }
};

//碎片
window.debrisConfig = {
    1001: {
        name: '碎片名称'
    }
};