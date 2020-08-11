//窗口
window.win = {
    width: 750,
    height: 1334
}

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
// window.token = "c8j56fvmc74dwjqyfl9do";
window.token = undefined;
window.userInfo = {};
window._ivp = {};

window.ratio = 1334/750 - .02;
window.gameRatio = 0;

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

window.clientDispatchEvent = {
    eventType: {
        commonPanel: 'commonPanel',
        returnVisit: 'returnVisit',
        plantSuccess: 'plantSuccess', //种植成功
        removeLand: 'removeLand', //铲除地
        plantSurePanel: 'plantSurePanel', //种植确认弹窗
        pcRecharge: 'pcRecharge',
        phoneRecharge: 'phoneRecharge',
        aboutPanel: 'aboutPanel'
    }
}

window.vFlag = false;
// vFlag = vFlagInit();
window.vFlagInit = function(){
    var version = _ivp.v;
    if(version!="" && version!=null){
		if(version.indexOf(".")>0){
			var split = version.split("\.");
			if(split[0]<7){
				vFlag = false;
			}else if(split[0]==7 && split[1]<7){
				vFlag = false;
			}else if(split.length>=3 && split[0]==7 && split[1]==7 && split[2]<2){
				vFlag = false;
			}else if(split.length==2 && split[0]==7 && split[1]==7){
				vFlag = false;
			}else{
				vFlag = true;
			}
		}
    }
    return vFlag;
}

/**
 * 格式化输出 
 * @param {} template 模板，占位符为{}，具体内容，依次排在后面，或者数组
 * @return {}
 */
window.fm = function(template) {// 接收的参数为两种类型，(template,1,2,...) 或者(template,[1,3,...])
	var arr = [];
	if (arguments.length == 2 && typeof arguments[1] == 'object')
		arr = arr.concat(arguments[1]);
	else {
		for (var i = 1; i < arguments.length; i++) {
			arr.push(arguments[i]);
		}
	}
	for (var i = 0; i<arr.length;i++) {
		template = template.replace(/{}/, arr[i]);
	}
    arr.splice(0,arr.length);
    arr = null;
	return template;
}

//礼物
window.giftConfig = {
    1500: {
        name: '跑车',
        price : 8000
    },
    1512: {
        name: '火焰战车',
        price : 40000
    },
    1505: {
        name: '求婚',
        price : 40000
    },
    1977: {
        name: '特斯拉',
        price : 200000
    },
    2100: {
        name: '糖果炸弹',
        price : 200000
    }
};

//礼物，种子，碎片
window.goodsConfig = {
    1771: {
        name: "满天星",
        level: 1
    },
    1772: {
        name: "满天星种子",
        level: 1,
        day: 3,
        price: 1000,
        vip: 0
    },
    1773: {
        name: "牵牛花",
        level: 1
    },
    1774: {
        name: "牵牛花种子",
        level: 1,
        day: 3,
        price: 1000,
        vip: 0
    },
    1775: {
        name: "野菊花",
        level: 1
    },
    1776: {
        name: "野菊花种子",
        level: 1,
        day: 3,
        price: 1000,
        vip: 0
    },
    1777: {
        name: "杜鹃花",
        level: 2
    },
    1778: {
        name: "杜鹃花种子",
        level: 2,
        placeholder: '介于2500~5000',
        day: 5,
        price: 5000,
        vip: 3
    },
    1779: {
        name: "金茶花",
        level: 2
    },
    1788: {
        name: "金茶花种子",
        level: 2,
        placeholder: '介于2500~5000',
        day: 5,
        price: 5000,
        vip: 3
    },
    1781: {
        name: "冬青花",
        level: 2
    },
    1782: {
        name: "冬青花种子",
        level: 2,
        placeholder: '介于2500~5000',
        day: 5,
        price: 5000,
        vip: 3
    },
    1783: {
        name: "摇钱树",
        level: 3
    },
    1784: {
        name: "摇钱树种子",
        level: 3,
        placeholder: '介于20000~40000',
        day: 7,
        price: 40000,
        vip: 5
    },
    1785: {
        name: '一级碎片',
        placeholder: '不低于1600',
        vip: 0
    },
    1786: {
        name: '二级碎片',
        placeholder: '不低于5000',
        vip: 3
    },
    1787: {
        name: '三级碎片',
        placeholder: '不低于20000',
        vip: 5
    }
};

// 商店筛选列表
window.shopChoiceArr = [1785, 1786, 1787, 1778, 1788, 1782, 1784];