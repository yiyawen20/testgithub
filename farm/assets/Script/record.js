const pool = require("pool");
const appRequest = require("network");
cc.Class({
    extends: cc.Component,

    properties: {
        recordLi: {
            default: null,
            type: cc.Prefab
        },
    },
    onLoad () {
        let that = this;
        clientEvent.init();

        pool.createPrefabPool(that.recordLi);
        that.content = cc.find("Canvas/main/trade/record/scrollview/view/content");
        that.init();
    },

    show(){
        let that = this;
        that.node.active = true;
        that.init();
    },

    init(){
        var that = this;
        if(that.content == undefined){
            that.content = cc.find("Canvas/main/trade/record/scrollview/view/content");
        }
        that.content.removeAllChildren();
        appRequest.Get("farm/deal/log", {
            token: token
        }, function(rs){
            let res = JSON.parse(rs);
            let list = res.list;
            let node = that.content.parent.getChildByName("blankText");
            if(list && list.length > 0){
                for(var i = 0; i < list.length; i++){
                    let recordLi = pool.getPrefab(that.recordLi.name);
                    recordLi.setPosition(cc.v2(0, i*-1*92-46));
                    recordLi.active = false;
                    that.content.height = 92 * (i + 1);
                    that.content.addChild(recordLi);

                    let gift = recordLi.getChildByName("zz");
                    let name = recordLi.getChildByName("name");
                    let num = recordLi.getChildByName("num");
                    let curr = recordLi.getChildByName("curr");
                    let time = recordLi.getChildByName("time");
                    cc.loader.loadRes("crops/"+list[i].stuffSn, cc.SpriteFrame, function (err, spriteFrame) {
                        gift.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        gift.width = gift.height = 120;
                        recordLi.active = true;                    
                    });
                    name.getComponent(cc.Label).string = goodsConfig[list[i].stuffSn].name;
                    num.getComponent(cc.Label).string = list[i].stuffNum;
                    let buyUserId = list[i].buyUserId;
                    let userId = list[i].userId;
                    let stuffNum = list[i].stuffNum;
                    let buyPrice = list[i].buyPrice;
                    let recvPrice = list[i].recvPrice;
                    let _shouzhi, color;
                    if(buyUserId == _ivp.userId){
                        _shouzhi = buyPrice * -1;
                        color = new cc.Color(0, 255, 0, 255);
                    }else{
                        _shouzhi = recvPrice;
                        color = new cc.Color(255, 0, 0, 255);
                    }
                    curr.getComponent(cc.Label).string = _shouzhi;
                    curr.color = color;
                    time.getComponent(cc.Label).string = list[i].addTime.substr(0, 16);
                }
                if(node != null){
                    node.destroy();
                }
            }else{
                if(node == null){
                    node = new cc.Node('blankText');
                    let sp = node.addComponent(cc.Label);
                    sp.string = '你还没有交易过';
                    sp.fontSize = 32;
                    node.color = new cc.Color(179, 157, 98, 255);
                    node.y = 100;
                    node.parent = that.content.parent;
                }
            }
        });
    },
    start () {},

    // update (dt) {},
});
