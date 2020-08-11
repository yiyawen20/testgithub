const pool = require("pool");
const appRequest = require("network");
cc.Class({
    extends: cc.Component,

    properties: {
        saleLi: {
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

        //添加筛选弹窗
        var _choicePanel = cc.instantiate(that.choicePanel);
        _choicePanel.active = false;
        that.node.addChild(_choicePanel);
        that._choicePanel = _choicePanel.getComponent("choicePanel");

        pool.createPrefabPool(that.saleLi);
        that.content = cc.find("Canvas/main/trade/sale/scrollview/view/content");
        // that.init();

        let choiceBtn = that.node.getChildByName("btn_shaixuan");
        choiceBtn.on("touchend", that.showChoicePanel, that);
    },

    show(){
        let that = this;
        that.node.active = true;
        that.init();
    },

    init(){
        var that = this;
        that.content.removeAllChildren();
        appRequest.Get("farm/deal/consign/show", {
            token: token
        }, function(rs){
            let res = JSON.parse(rs);
            let list = res.list;
            let node = that.content.parent.getChildByName("blankText");
            if(list && list.length > 0){
                for(var i = 0; i < list.length; i++){
                    let saleLi = pool.getPrefab(that.saleLi.name);
                    saleLi.setPosition(cc.v2(0, i*-1*92-46));
                    saleLi.active = false;
                    that.content.height = 92 * (i + 1);
                    that.content.addChild(saleLi);

                    let gift = saleLi.getChildByName("zz");
                    let name = saleLi.getChildByName("name");
                    let num = saleLi.getChildByName("num");
                    let curr = saleLi.getChildByName("curr");
                    let btn = saleLi.getChildByName("btn_hong");
                    cc.loader.loadRes("crops/"+list[i].stuffSn, cc.SpriteFrame, function (err, spriteFrame) {
                        gift.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        gift.width = gift.height = 120;
                        saleLi.active = true;                    
                    });
                    name.getComponent(cc.Label).string = goodsConfig[list[i].stuffSn].name;
                    num.getComponent(cc.Label).string = list[i].num;
                    curr.getComponent(cc.Label).string = list[i].price;
                    btn.on("touchend", that.downSale,
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
                    sp.string = '你还没有上架商品';
                    sp.fontSize = 32;
                    node.color = new cc.Color(179, 157, 98, 255);
                    node.y = 100;
                    node.parent = that.content.parent;
                }
            }
        });
    },
    downSale(){
        let evt = this;
        let that = evt.evt;
        appRequest.Get("farm/deal/consign/unsell", {
            token: token,
            stuffSn: evt.stuffSn,
            id: evt.id
        }, function(rs){
            let res = JSON.parse(rs);
            let result = res.result;
            let str = '';
            if(result == 0){
                // 成功
                str = '下架成功';
                that.init();
            }else if(result == -3 || result == -6){
                str = '信息不对';
            }else if(result == -4){
                str = '已下架或未上架';
            }else if(result == -5){
                str = '更新数据失败';
            }else{
                str = '下架失败';
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
                that.scheduleOnce(that.init, 1);
            }
        });
    },
    start () {},

    // update (dt) {},
});
