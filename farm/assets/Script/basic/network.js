var socket;
var newWork = {
    ip: baseReqUrl[config.env],
    version: "1.0.0",   

    Get: function(url,reqData,callback){
        var self = this;
        self.ip = baseReqUrl[config.env];
        url += "?";
        for(var item in reqData){
            url += item +"=" +reqData[item] +"&";
        }
        console.log(self.ip + url, JSON.stringify(reqData));
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    // console.log(response)
                    if(response){
                        //var responseJson = JSON.parse(response);
                        callback(response);
                    }else{
                        console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    console.log("请求失败")
                    callback(false);
                }
            }
        };
        xhr.open("GET", self.ip + url, true);
        xhr.send();
    },

    Post: function (url, reqData, callback) {
        var self = this;
        self.ip = baseReqUrl[config.env];
        // console.log(url)
        // console.log(reqData)
        //1.拼接请求参数
        var param = "";
        for(var item in reqData){
            param += item + "=" + reqData[item] + "&";
        }
        //2.发起请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    // console.log(response)
                    if(response){
                        var responseJson = JSON.parse(response);
                        callback(responseJson);
                    }else{
                        console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    console.log("请求失败")
                    callback(false);
                }
            }
        };
        xhr.open("POST", self.ip + url, true);
        xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  
        xhr.send(param);//reqData为字符串形式： "key=value"
    },

    webSocket(){
        if(webSocketState == 1){
            return;
        }
        webSocketState = 1;
        let that = this;
        if(typeof(WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
        } else {
            console.log("您的浏览器支持WebSocket");
            //实现化WebSocket对象，指定要连接的服务器地址与端口 建立连接
            //等同于socket = new WebSocket("ws://localhost:8080/websocket/19018");
            socket = new WebSocket(config.webSocketUrl + "animal?token="+token+"&userId=" + userId);
            //打开事件
            socket.onopen = function() {
                console.log("Socket 已打开");
                // 以秒为单位的时间间隔
                clearInterval(window.socketTimer);
                window.socketTimer = window.setInterval(()=>{
                    socket.send('ping');
                }, 3e3);
                /*let interval = 2;
                that.unschedule(that.webSocketTimer);
                that.webSocketTimer = function(){
                    // cc.log("这是来自客户端的消息" + location.href + new Date());
                    socket.send('ping');
                };
                that.schedule(that.webSocketTimer, interval);*/
            };
            //获得消息事件
            socket.onmessage = function (evt){
                if("pong" == evt.data) {
                    return;
                }
                console.log(evt.data, "接收消息");
                let jsonMsg = JSON.parse(evt.data);
                let code = jsonMsg.code;
                clientEvent.dispatch(clientEvent.messageType[code], jsonMsg);
                //发现消息进入 开始处理前端触发逻辑
            };
            //关闭事件
            socket.onclose = function() {
                console.log("Socket已关闭");
                clientEvent.dispatch("kickout");
            };
            //发生了错误事件
            socket.onerror = function() {
                console.error("Socket发生了错误");
                //此时可以尝试刷新页面
                clientEvent.dispatch(clientEvent.messageType.systemError);
            }
        }
    },
    webSocketConnect(){
        console.log(socket, "webSocketConnect");
        if(webSocketState == 0 && userId > 0){
            window.kickoutState = 0;
            console.log(kickoutState, "kickoutStatekickoutStatekickoutState");
            wxBackStageSign = 0;
            // this.webSocket();
            cc.director.loadScene("startGame");
        }
    },
    webSocketClose(){
        console.log(socket, "webSocketClose");
        if(webSocketState == 1){
            webSocketState = 0;
            wxBackStageSign = 1;
            socket.close();
        }
    }
};

module.exports = newWork;