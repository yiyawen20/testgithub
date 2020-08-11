const pool = require("pool");
const appRequest = require("network");
cc.Class({
    extends: cc.Component,

    properties: {
        shopLi: {
            default: null,
            type: cc.Prefab
        },
        buyPanel: {
            default: null,
            type: cc.Prefab
        },
        choicePanel: {
            default: null,
            type: cc.Prefab
        }
    },
    onLoad () {
        let that = this;
        clientEvent.init();

        //添加兑换弹窗
        var _buyPanel = cc.instantiate(that.buyPanel);
        _buyPanel.active = false;
        that.node.addChild(_buyPanel);
        that._buyPanel = _buyPanel.getComponent("buyPanel");

        //添加筛选弹窗
        var _choicePanel = cc.instantiate(that.choicePanel);
        _choicePanel.active = false;
        that.node.addChild(_choicePanel);
        that._choicePanel = _choicePanel.getComponent("choicePanel");

        pool.createPrefabPool(that.shopLi);
        that.content = cc.find("Canvas/main/trade/shop/scrollview/view/content");
        that._stuffSn = 0;
        that.init(that._stuffSn);

        let choiceBtn = that.node.getChildByName("btn_shaixuan");
        choiceBtn.on("touchend", that.showChoicePanel, that);
    },

    show(){
        let that = this;
        that.node.active = true;
        that.init(that._stuffSn);
    },

    init(stuffSn){
        var that = this;
        // let stuffSn = stuffSn || 0;
        that.content.removeAllChildren();
        appRequest.Get("farm/deal/shop/show", {
            token: token,
            stuffSn: stuffSn
        }, function(rs){
            let res = JSON.parse(rs);
            let list = res.list;
            let node = that.content.parent.getChildByName("blankText");
            if(list && list.length > 0){
                for(var i = 0; i < list.length; i++){
                    let shopLi = pool.getPrefab(that.shopLi.name);
                    shopLi.setPosition(cc.v2(0, i*-1*92-46));
                    shopLi.active = false;
                    that.content.height = 92 * (i + 1);
                    that.content.addChild(shopLi);

                    let gift = shopLi.getChildByName("zz");
                    let name = shopLi.getChildByName("name");
                    let num = shopLi.getChildByName("num");
                    let curr = shopLi.getChildByName("curr");
                    let btn = shopLi.getChildByName("btn_hong");
                    cc.loader.loadRes("crops/"+list[i].stuffSn, cc.SpriteFrame, function (err, spriteFrame) {
                        gift.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        gift.width = gift.height = 120;
                        shopLi.active = true;                    
                    });
                    name.getComponent(cc.Label).string = goodsConfig[list[i].stuffSn].name;
                    num.getComponent(cc.Label).string = list[i].num;
                    curr.getComponent(cc.Label).string = list[i].price;
                    btn.on("touchend", that.goodsBuy,
                    {
                        evt: that,
                        id: list[i].id,    //商店物品列表ID
                        stuffSn: list[i].stuffSn,   //商品编号
                        price: list[i].price,
                        num: list[i].num
                    });
                }
                if(node != null){
                    node.destroy();
                }
            }else{
                if(node == null){
                    node = new cc.Node('blankText');
                    let sp = node.addComponent(cc.Label);
                    sp.string = '当前无人上架商品';
                    sp.fontSize = 32;
                    node.color = new cc.Color(179, 157, 98, 255);
                    node.y = 100;
                    node.parent = that.content.parent;
                }
            }
        });
    },
    goodsBuy(){
        let evt = this;
        let that = evt.evt;
        // 购买
        that._buyPanel.showPanel({
            title: goodsConfig[evt.stuffSn].name,
            stuffSn: evt.stuffSn,
            content:      "购买数量：<color=#cd7c56>"+evt.num+"</c><br/>单       价：<color=#cd7c56>"+evt.price+"贝壳</c><br/>总       价：<color=#cd7c56>"+evt.price*evt.num+"贝壳</c>",
            leftBtnText:  "购买",
            leftCallback: function(){
                cc.log("购买");
                that.sureBuy(evt);
            }
        });
    },
    sureBuy(evt){
        let that = this;
        appRequest.Get("farm/deal/shop/buy", {
            token: token,
            stuffSn: evt.stuffSn,
            id: evt.id
        }, function(rs){
            let res = JSON.parse(rs);
            let result = res.result;
            let str = '';
            if(result == 0){
                // 成功
                str = '购买成功';
                that.init(that._stuffSn);
            }else if(result == -4){
                str = '贝壳不足，无法购买';
            }else if(result == -5){
                str = '扣费失败';
            }else if(result == -6){
                str = '交易状态失败';
            }else if(result == -8){
                str = '该物品需要VIP'+goodsConfig[evt.stuffSn].vip+'才可购买';
            }else{
                str = '购买失败';
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
            if(result == -4){
                arr = {
                    content:      str,
                    leftBtnText:  "知道了",
                    leftCallback: function(){},
                    rightBtnText: "去兑换",
                    rightCallback: function(){
                        that.scheduleOnce(function(){
                            if(_ivp.openType == "web"){
                                var event = new cc.Event.EventCustom('pcRecharge', true);
                                event.setUserData();
                                that.node.dispatchEvent( event );
                            }else{
                                if(window.__wxjs_environment === 'miniprogram'){
                                    // that.wxRecharge(totalFee, isLottery);
                                    return;
                                }
                                // 手机充值
                                var event = new cc.Event.EventCustom('phoneRecharge', true);
                                event.setUserData();
                                that.node.dispatchEvent( event );
                            }
                        }, .5);
                    },
                    centerBtnText: "",
                    centerCallback: function(){}
                };
            }
            var event = new cc.Event.EventCustom('commonPanel', true);
            event.setUserData(arr);
            that.node.dispatchEvent( event );
        });
    },
    showChoicePanel(){
        let that = this;
        that._choicePanel.showPanel({
            title: '筛选',
            leftBtnText:  "确认",
            leftCallback: function(){
                cc.log("筛选", that._choicePanel.selectId);
                let _str = '';
                if(that._choicePanel.selectId == 0 || that._choicePanel.selectId == undefined){
                    _str = '名称';
                }else{
                    _str = goodsConfig[that._choicePanel.selectId].name;
                }
                that.node.getChildByName("shaixuan").getChildByName("label").getComponent(cc.Label).string = _str;
                that.content.removeAllChildren();
                // that.scheduleOnce(that.init, 1);
                that._stuffSn = that._choicePanel.selectId;
                that.init(that._stuffSn);
            }
        });
    },
    start () {},

    // update (dt) {},
});
