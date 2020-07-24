window.clientEvent = {
    eventType: {
        //eventType
        openChessPiece: "openChessPiece",
        startChessPiece: "startChessPiece",
        moveChessPiece: "moveChessPiece",
        otherChessPiece: "otherChessPiece",
        onChessPiece: "onChessPiece",
        gameMessage: "gameMessage",
        isGameOver: "isGameOver",
        myRound: "myRound",
        roundComplete: "roundComplete"
    },
    eventListener: null,
    messageType: {
        systemError: "systemError",//系统异常
        10000: "canMatch",//可以匹配消息
        10001: "successMatch",//匹配成功（通知匹配的双方,分别收到对方的信息）
        10002: "gameStart",//游戏开始（当双方都加载成功，并通知服务器端加载成功后）
        10003: "rivalOut",//对方退出（匹配成功后；游戏过程中）
        10004: "rivalLose",//对方认输（收到消息方获胜）
        10005: "gameOver",//游戏结束（双方都收到消息）
        10006: "roundOperate",//回合操作
        10007: "flipChess",//翻棋
        10008: "kickout",//被踢出
        10009: "gaming",//在游戏中
        10010: "sum",//求和
        10011: "refuseSum",//拒绝求和
        10012: "gameResult",//游戏结果(道具不足)
        10013: "gameUpgrade",//游戏升级
    }
}

clientEvent.init = function() {
    clientEvent.eventListener = eventListener.create();
};

clientEvent.on = function(eventName, handler, target) {
    if (typeof eventName !== "string") {
        return;
    }
    clientEvent.eventListener.on(eventName, handler, target);
};

clientEvent.off = function(eventName, handler, target) {
    if (typeof eventName !== "string") {
        return;
    }
    clientEvent.eventListener.off(eventName, handler, target);
};

clientEvent.clear = function(target) {
    clientEvent.eventListener.clear(target);
};

clientEvent.dispatch = function(eventName, data) {
    if (typeof eventName !== "string") {
        return;
    }
    clientEvent.eventListener.dispatch(eventName, data);
};