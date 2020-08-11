const pool = require("pool");
const appRequest = require("network");
cc.Class({
    extends: cc.Component,

    properties: {
        storageLi: {
            default: null,
            type: cc.Prefab
        }
    },
    onLoad () {
        let that = this;
        clientEvent.init();

        pool.createPrefabPool(that.storageLi);
        that.content = cc.find("Canvas/main/trade/storage/scrollview/view/content");
        // that.init(1);
        that._type = 1;

        let btnZd = cc.find("Canvas/main/trade/storage/part2/part2_foot/btn_zd");
        btnZd.on("touchend", that.choiceMax, that);

        that.editboxNum = cc.find("Canvas/main/trade/storage/part2/part2_foot/editboxNum");
        that.editboxPrice = cc.find("Canvas/main/trade/storage/part2/part2_foot/editboxPrice");
        let upSellBtn = cc.find("Canvas/main/trade/storage/part2/part2_foot/btn-0");
        upSellBtn.on("touchend", that.upSell, that);

        that.tabArr = [];
        for(var i = 0; i < 3; i ++){
            that.tabArr[i] = cc.find("Canvas/main/trade/storage/part2/tab"+(i+1));
            that.tabArr[i].on("touchend", that.choiceTab, {evt: that, idx: i});
        }

        that.storagePart2 = cc.find("Canvas/main/trade/storage/part2/part2_foot");

        //上架规则
        // var _sellRulePanel = cc.instantiate(that.sellRulePanel);
        // _sellRulePanel.active = false;
        // that.node.addChild(_sellRulePanel);
        // that._sellRulePanel = _sellRulePanel.getComponent("tradeAbPanel");
        let sellRuleEntry = cc.find("Canvas/main/trade/storage/part2/part2_foot/rule");
        sellRuleEntry.on("touchend", function(){
            var arr = {
                title: '提示',
                content: '1.每笔交易系统收取30%的手续费。\n'
                +'2.出售种子的价格在系统默认价格的50%~100%。\n'
                  +'  二级种子：2500~5000金豆\n'
                  +'  三级种子：20000~40000金豆\n'
                +'3.出售碎片的价格不能低于系统默认价格。\n'
                  +'  一级碎片：不低于1600金豆\n'
                  +'  二级碎片：不低于5000金豆\n'
                  +'  三级碎片：不低于20000金豆\n'
            };
            var event = new cc.Event.EventCustom('aboutPanel', true);
            event.setUserData(arr);
            that.node.dispatchEvent( event );
        }, that);

        if(gameRatio < ratio){
            that.storagePart2.getChildByName("label copy").getComponent(cc.Label).string = "单价：";
        }
    },

    show(){
        let that = this;
        that.node.active = true;
        that.init(that._type);

        that.editboxNum.getComponent(cc.EditBox).string = "";
        that.editboxPrice.getComponent(cc.EditBox).string = "";
        that.editboxPrice.getComponent(cc.EditBox).placeholder = '单价';
        that.selectSellObj = undefined;
    },
    init(type){
        var that = this;
        // let type = type || 1;
        that.content.removeAllChildren();
        appRequest.Get("farm/deal/store/show", {
            token: token,
            type: type
        }, function(rs){
            let res = JSON.parse(rs);
            let list = res.list;
            let _arr = [-1, 0, 1];
            let node = that.content.parent.getChildByName("blankText");
            if(list && list.length > 0){
                for(var i = 0; i < list.length; i++){
                    let storageLi = pool.getPrefab(that.storageLi.name);
                    storageLi.active = false;
                    let x = _arr[i%3];
                    let y = parseInt(i / 3);
                    storageLi.setPosition(cc.v2((195 + 8) * x, -(213 + 12) * y - 106));
                    that.content.height = (213 + 12) * (y + 1);
                    that.content.addChild(storageLi);

                    let gift = storageLi.getChildByName("zz");
                    let name = storageLi.getChildByName("name");
                    let num = storageLi.getChildByName("num");
                    cc.loader.loadRes("crops/"+list[i].giftSn, cc.SpriteFrame, function (err, spriteFrame) {
                        gift.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        gift.width = gift.height = 120;
                        storageLi.active = true;                    
                    });
                    name.getComponent(cc.Label).string = goodsConfig[list[i].giftSn].name;
                    num.getComponent(cc.Label).string = "剩余数量："+list[i].giftNum;
                    storageLi.on("touchend", that.storageChoice,
                    {
                        evt: that,
                        giftSn: list[i].giftSn,
                        num: list[i].giftNum
                    });
                }
                if(node != null){
                    node.destroy();
                }
            }else{
                let _arr = ['种子', '碎片', '植物'];
                if(node == null){
                    node = new cc.Node('blankText');
                    let sp = node.addComponent(cc.Label);
                    sp.string = '暂无收获' + _arr[type-1];
                    sp.fontSize = 32;
                    node.color = new cc.Color(179, 157, 98, 255);
                    node.y = 100;
                    node.parent = that.content.parent;
                }else{
                    let sp = node.getComponent(cc.Label);
                    sp.string = '暂无收获' + _arr[type-1];
                }
            }
        });
    },
    storageChoice(){
        let evt = this;
        let that = evt.evt;
        that.selectSellObj = evt;
        that.editboxNum.getComponent(cc.EditBox).string = "";
        that.editboxPrice.getComponent(cc.EditBox).string = "";
        that.editboxPrice.getComponent(cc.EditBox).placeholder = goodsConfig[evt.giftSn].placeholder;
        for(let i = 0; i < that.content.childrenCount; i ++){
            let _active = false;
            if(that.content.children[i].getChildByName("name").getComponent(cc.Label).string == goodsConfig[evt.giftSn].name){
                _active = true;
            }
            that.content.children[i].getChildByName("border_xanzhong").active = _active;
        }
    },
    choiceMax(){
        let that = this;
        if(that.selectSellObj != undefined){
            that.editboxNum.getComponent(cc.EditBox).string = that.selectSellObj.num;
        }
    },
    inputChanged(e, node, type){
        let that = this;
        let _ti = type == 'num' ? '数量' : '单价';
        let _o = type == 'num' ? that.editboxNum : that.editboxPrice;
        let str = '';
        if(!(/(^[1-9]\d*$)/.test(e)) && e != ""){
            str = '请输入出售' + _ti;
            e = "";
        }
        if(str != ""){
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
        }
        _o.getComponent(cc.EditBox).string = e;
    },
    upSell(){
        let that = this;
        let str = '';
        let num = that.editboxNum.getComponent(cc.EditBox).string;
        num = num || 0;
        let price = that.editboxPrice.getComponent(cc.EditBox).string;
        price = price || 0;
        if(price == 0){
            str = '请输入出售单价';
        }
        if(num == 0){
            str = '请输入出售数量';
        }
        if(that.selectSellObj == undefined){
            str = '请选择出售物品';
        }
        if(str != ""){
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
            return;
        }
        console.log(num + "," + price);
        appRequest.Get("farm/deal/consign/upSell", {
            token: token,
            stuffSn: that.selectSellObj.giftSn,
            num: num,
            price: price
        }, function(rs){
            let res = JSON.parse(rs);
            let result = res.result;
            let str = '';
            if(result == 0){
                // 成功
                str = '上架成功';
                that.init(that._type);
            }else if(result == -3){
                str = '编号不对';
            }else if(result == -4){
                str = '蔬菜不能卖';
            }else if(result == -5){
                str = '售价范围应'+goodsConfig[that.selectSellObj.giftSn].placeholder+'贝壳';
            }else if(result == -6 || result == -7){
                str = '你当前拥有'+goodsConfig[that.selectSellObj.giftSn].name+that.selectSellObj.num+'个，数量不足';
            }else if(result == -8){
                str = '出库失败';
            }else if(result == -9){
                str = '上架失败';
            }else{
                str = '上架失败';
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
    choiceTab(){
        let evt = this;
        let that = evt.evt;
        if(evt.idx == 2){
            that.storagePart2.active = false;
        }else{
            that.storagePart2.active = true;
        }
        that.editboxNum.getComponent(cc.EditBox).string = "";
        that.editboxPrice.getComponent(cc.EditBox).string = "";
        that.editboxPrice.getComponent(cc.EditBox).placeholder = '单价';
        that.selectSellObj = undefined;
        for(let i = 0; i < that.tabArr.length; i ++){
            let _active = false;
            if(i == evt.idx){
                _active = true;
                that.tabArr[i].getChildByName("label").color = new cc.Color(255, 255, 255, 255);
            }else{
                that.tabArr[i].getChildByName("label").color = new cc.Color(179, 157, 98, 255);
            }
            that.tabArr[i].getChildByName("tab1").active = _active;
        }
        that._type = evt.idx+1;
        that.init(that._type);
    },
    start () {},

    // update (dt) {},
});
