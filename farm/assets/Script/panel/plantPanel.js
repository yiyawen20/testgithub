const pool = require("pool");
const appRequest = require("network");
cc.Class({
    extends: cc.Component,

    properties: {
        seedLi: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad () {
        this.node.getChildByName("bg").on("touchend", function(e){
            this.node.active = false;
            e.stopPropagation();
        }, this);
        this.node.getChildByName("pop_bg1").on("touchend", function(e){e.stopPropagation();}, this);
        // this.node.getChildByName("btn_gb").on("touchend", function(){
        //     this.node.active = false;
        // }, this);

        let that = this;
        pool.createPrefabPool(that.seedLi);
        // that.init();

        that.tabArr = [];
        for(var i = 0; i < 3; i ++){
            that.tabArr[i] = that.node.getChildByName("tab"+(i+1));
            that.tabArr[i].on("touchend", that.choiceTab, {evt: that, idx: i});
        }
    },
    showPanel(landId){
        let that = this;
        that.node.active = true;
        that.init(landId);
    },
    init(landId){
        var that = this;
        appRequest.Get("farm/home/seedSn", {
            token: token
        }, function(rs){
            let res = JSON.parse(rs);
            let _arr = [-1, 0, 1];
            for(var j = 0; j < 3; j ++){
                let list = res["type_"+(j+1)];
                let seedNode;
                if(that.node.getChildByName("seedNode_"+(j+1)) == null){
                    seedNode = new cc.Node("seedNode_"+(j+1));
                    seedNode.parent = that.node;
                }else{
                    seedNode = that.node.getChildByName("seedNode_"+(j+1));
                    seedNode.removeAllChildren();
                }
                seedNode.y = 54;
                if(j == 0){
                    seedNode.active = true;
                }else{
                    seedNode.active = false;
                }
                for(var i = 0; i < list.length; i++){
                    let seedLi = pool.getPrefab(that.seedLi.name);
                    seedLi.active = false;
                    let x = _arr[i%3];
                    let y = parseInt(i / 3);
                    seedLi.setPosition(cc.v2((156 + 8) * x, -(160 + 12) * y));
                    seedNode.addChild(seedLi);
    
                    let gift = seedLi.getChildByName("zz");
                    let name = seedLi.getChildByName("name");
                    let priceLabel = seedLi.getChildByName("label");
                    name.getComponent(cc.Label).string = goodsConfig[list[i].seedSn].name;
                    cc.loader.loadRes("crops/"+list[i].seedSn, cc.SpriteFrame, function (err, spriteFrame) {
                        gift.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        gift.width = gift.height = 90;
                        seedLi.active = true;
                    });
                    let _priceLabel = list[i].num;
                    _priceLabel = _priceLabel == 0 ? list[i].price + '贝壳' : '剩余：' + _priceLabel
                    priceLabel.getComponent(cc.Label).string = _priceLabel;
                    seedLi.on("touchend", that.seedChoice,
                    {
                        evt: that,
                        seedSn: list[i].seedSn,
                        price: list[i].price,
                        num: list[i].num,
                        landId: landId
                    });
                    seedLi.getChildByName("info").on("touchend", that.infoAboutTips, {
                        evt: that,
                        seedSn: list[i].seedSn,
                        price: list[i].price,
                        num: list[i].num,
                        landId: landId
                    });
                }
            }
            // 切页初始到第一个位置
            that.tabArr[0].emit('touchstart');
            that.tabArr[0].emit('touchend');
        });
    },
    seedChoice(){
        // 种植
        let evt = this;
        let that = evt.evt;
        that.node.active = false;
        var arr = {
            seedSn: evt.seedSn,
            price: evt.price,
            num: evt.num,
            landId: evt.landId
        };
        var event = new cc.Event.EventCustom('plantSurePanel', true);
        event.setUserData(arr);
        that.node.dispatchEvent( event );
    },
    choiceTab(){
        let evt = this;
        let that = evt.evt;
        for(let i = 0; i < that.tabArr.length; i ++){
            let _active = false;
            if(i == evt.idx){
                _active = true;
                that.tabArr[i].getChildByName("label").color = new cc.Color(255, 255, 255, 255);
            }else{
                that.tabArr[i].getChildByName("label").color = new cc.Color(179, 157, 98, 255);
            }
            that.tabArr[i].getChildByName("tab1").active = _active;
            that.node.getChildByName("seedNode_"+(i+1)).active = _active;
        }
    },
    infoAboutTips(e){
        if(e != undefined) e.stopPropagation();
        let evt = this;
        let that = evt.evt;
        let seedSn = evt.seedSn;
        let _arr = [
            '每次收获时，必定收获3-7个{}，有一定概率获取1个一级碎片，极小概率出现暴击获取5个一级碎片。\n'
                +'果实可以在直播间送出，有几率中奖；一级碎片可用于兑换跑车。',
            '限VIP3可种植。\n每次收获时，必定收获1-5个{}，有概率收获{}，有一定概率获取二级碎片，极小概率出现暴击获取5个二级碎片。\n'
                +'果实可以在直播间送出，有几率中奖；种子可以继续种植或卖出；二级碎片可用于兑换火焰战车和求婚。',
            '限VIP5可种植。\n每次收获时，必定收获3-7个{}，有概率收获{}，有一定概率获取三级碎片，极小概率出现暴击获取5个三级碎片。\n'
                +'果实可以在直播间送出，有几率中奖；种子可以继续种植或卖出；三级碎片可用于兑换特斯拉和糖果炸弹。',
        ];
        var arr = {
            title: goodsConfig[seedSn].name,
            content: fm(_arr[goodsConfig[seedSn].level - 1], goodsConfig[seedSn].name.replace("种子", ""), goodsConfig[seedSn].name)
        };
        var event = new cc.Event.EventCustom('aboutPanel', true);
        event.setUserData(arr);
        that.node.dispatchEvent( event );
    },
    start () {

    },

    // update (dt) {},
});
