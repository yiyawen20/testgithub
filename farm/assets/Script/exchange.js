const pool = require("pool");
const appRequest = require("network");
cc.Class({
    extends: cc.Component,

    properties: {
        tempExchangeBox: {
            default: null,
            type: cc.Prefab
        },
        exchangeBoxPanel: {
            default: null,
            type: cc.Prefab
        }
    },
    onLoad () {
        let that = this;

        clientEvent.init();

        // pool.createPrefabPool(that.tempExchangeBox);

        //添加兑换弹窗
        var exchangePanel = cc.instantiate(that.exchangeBoxPanel);
        exchangePanel.active = false;
        that.node.addChild(exchangePanel);
        that.exchangePanel = exchangePanel.getComponent("exchangePanel");

        that.node.getChildByName("bg").on("touchend", function(e){e.stopPropagation();}, that);

        that.node.getChildByName("btn2").on("touchend", function(e){
            e.stopPropagation();
            that.node.active = false;
        }, that);

        // that.content = cc.find("Canvas/main/exchange/scrollview/view/content");
        // that.content.setPosition(cc.v2(0, 590));
        // that.init();
    },
    show(){
        let that = this;
        that.init();
    },
    init(){
        var that = this;
        if(that.content == undefined){
            that.content = cc.find("Canvas/main/exchange/scrollview/view/content");
        }
        that.content.removeAllChildren();
        appRequest.Get("farm/exchange/show", {
            token: token
        }, function(rs){
            let res = JSON.parse(rs);
            that.node.active = true;
            let list = res.list;
            for(var i = 0; i < list.length; i++){
                // let exchangeBox = pool.getPrefab(that.tempExchangeBox.name);
                let exchangeBox = cc.instantiate(that.tempExchangeBox);
                let x = (i+1) % 2 == 0 ? -1 : 1;
                let y = parseInt(i / 2);
                exchangeBox.setPosition(cc.v2(-172 * x, -356 * y - 175));
                that.content.height = 356 * (y + 1);
                that.content.addChild(exchangeBox);

                let gift = exchangeBox.getChildByName("gift1");
                cc.loader.loadRes("gift/"+list[i].giftSn, cc.SpriteFrame, function (err, spriteFrame) {
                    gift.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    gift.active = true;
                    gift.width = gift.height = 150;
                });
                let vBg = exchangeBox.getChildByName("v-bg");
                let vip = exchangeBox.getChildByName("v");
                let title = exchangeBox.getChildByName("title");
                let name = exchangeBox.getChildByName("name");
                name.getComponent(cc.Label).string = giftConfig[list[i].giftSn].name;
                let exchangeBtn = exchangeBox.getChildByName("exchangeBtn");
                exchangeBtn.on("touchend", that.exchangeRes,
                    {
                        evt: that,
                        giftSn: list[i].giftSn,    //兑换的礼物ID
                        needSn: list[i].needSn,   //需要的碎片ID
                        needNum: list[i].needNum,    //需要的碎片数量
                        hadNum: list[i].hadNum     //用户拥有的该碎片数量
                    });
                let btnName = exchangeBtn.getChildByName("Background").getChildByName("Label");
                if(list[i].vip == 0){
                    vBg.active = false;
                    vip.active = false;
                    title.x = 0;
                    title.getComponent(cc.Label).horizontalAlign =  cc.Label.HorizontalAlign.CENTER;
                }else{
                    vip.getComponent(cc.Label).string = 'V' + list[i].vip;
                }
                title.getComponent(cc.Label).string = '由'+goodsConfig[list[i].needSn].name+'合成';
                btnName.getComponent(cc.Label).string = '兑换'+list[i].hadNum+'/'+list[i].needNum;
            }
        });
    },
    exchangeRes(){
        let evt = this;
        let that = evt.evt;
        console.dir(evt)
        cc.log(evt.giftSn, '兑换的礼物ID');
        // 兑换
        that.exchangePanel.showPanel({
            title: giftConfig[evt.giftSn].name,
            giftSn: evt.giftSn,
            content:      "礼物价值："+giftConfig[evt.giftSn].price+"贝壳\n所需碎片："+evt.needNum+"片\n兑换数量：\n共需碎片：0",
            needNum: evt.needNum,    //需要的碎片数量
            hadNum: evt.hadNum,     //用户拥有的该碎片数量
            leftBtnText:  "确认兑换",
            leftCallback: function(){
                let exchangeNum = that.exchangePanel.exchangeNum;
                if(exchangeNum == 0 || exchangeNum == undefined){
                    // 兑换数量不能为0
                    var arr = {
                        content:      '你的礼物碎片不足，无法兑换',
                        leftBtnText:  "",
                        leftCallback: function(){},
                        rightBtnText: "",
                        rightCallback: function(){},
                        centerBtnText: "确定",
                        centerCallback: function(){}
                    };
                    var event = new cc.Event.EventCustom('commonPanel', true);
                    event.setUserData(arr);
                    that.node.dispatchEvent( event );
                }else{
                    //兑换
                    cc.log("确认兑换", exchangeNum);
                    that.doExchange(evt.giftSn, exchangeNum);
                }
            }
        });
    },
    doExchange(giftSn, num){
        let that = this;
        appRequest.Get("farm/exchange/doAction", {
            token: token,
            giftSn: giftSn,
            num: num
        }, function(rs){
            let res = JSON.parse(rs);
            let result = res.result;
            let str = '';
            if(result == 0){
                // 成功
                str = '兑换成功，你获得了'+num+'个'+giftConfig[giftSn].name;
                that.init();
            }else if(result == -3){
                str = '礼物信息不存在';
            }else if(result == -4){
                str = '配置信息有误';
            }else if(result == -5){
                str = '你的VIP等级不足，无法兑换';
            }else if(result == -6){
                str = '你的礼物碎片不足，无法兑换';
            }else if(result == -7){
                str = '入库失败';
            }else{
                str = '兑换失败';
            }
            var arr = {
                content:      str,
                leftBtnText:  "",
                leftCallback: function(){},
                rightBtnText: "",
                rightCallback: function(){},
                centerBtnText: "确定",
                centerCallback: function(){}
            };
            var event = new cc.Event.EventCustom('commonPanel', true);
            event.setUserData(arr);
            that.node.dispatchEvent( event );
        });
    },

    start () {},

    // update (dt) {},
});
