const pool = require("pool");
const appRequest = require("network");
cc.Class({
    extends: cc.Component,

    properties: {
        flyIcon: {
            default: null,
            type: cc.Prefab
        },
        sealIcon: {
            default: null,
            type: cc.SpriteFrame
        },
        dodgeIcon: {
            default: null,
            type: cc.SpriteFrame
        },
        acheIcon: {
            default: null,
            type: cc.SpriteFrame
        },
        crtiIcon: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    onLoad () {
        let that = this;

        // 疼
        var ache = new cc.Node('ache');
        var sp = ache.addComponent(cc.Sprite);
        sp.spriteFrame = that.acheIcon;
        ache.parent = that.node;
        ache.x = 120;
        ache.y = 20;
        ache.active = false;
        // let _ache = cc.instantiate(ache);
    },
    fly(){
        let that = this;
        let _ram = Math.random();
        pool.createPrefabPool(that.flyIcon);
        let flyIcon = pool.getPrefab(that.flyIcon.name);
        that.node.addChild(flyIcon);
        flyIcon.active = true;
        flyIcon.x = _ram*30*addSub();
        that.point = [];
        for(var i = 0; i < 3; i ++){
            that.point[i] = flyIcon.getChildByName(i+1+"");
            that.point[i].opacity = 0;
        }
        // node.setSiblingIndex(0);
        cc.tween(flyIcon)
            .to(.7, {position: cc.v2(flyIcon.x, 80)})
            .call(function(){
                cc.tween(that.point[0]).to(.1, {opacity: 255}).start();
                cc.tween(that.point[1]).delay(.2).to(.1, {opacity: 255}).delay(.2).to(.1, {opacity: 0}).delay(.2).to(.1, {opacity: 255}).start();
                cc.tween(that.point[2]).delay(.4).to(.1, {opacity: 255}).delay(.2).to(.1, {opacity: 0}).delay(.4).to(.2, {opacity: 255}).start();
            })
            .delay(1.6)
            .to(.5, {position: cc.v2(flyIcon.x+10, 70), opacity: 0})
            .call(function(){
                flyIcon.destroy();
            })
            .start();
    },
    seal(){
        let that = this;
        let _ram = Math.random();
        var node = new cc.Node('seal');
        var sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = that.sealIcon;
        node.parent = that.node;
        node.x = _ram*30*addSub();
        cc.tween(node)
            .to(.7, {position: cc.v2(node.x, 80)})
            .delay(1.2)
            .to(.5, {position: cc.v2(node.x+10, 70), opacity: 0})
            .call(function(){
                node.destroy();
            })
            .start();
    },
    dodge(){
        let that = this;
        let _ram = Math.random();
        var node = new cc.Node('dodge');
        var sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = that.dodgeIcon;
        node.parent = that.node;
        node.x = _ram*30*addSub();
        cc.tween(node)
            .to(.5, {position: cc.v2(node.x, 80)})
            .delay(.1)
            .to(.2, {position: cc.v2(node.x, 70), opacity: 0})
            .call(function(){
                node.destroy();
            })
            .start();
    },
    ache(){
        let that = this;
        let ache = that.node.getChildByName("ache");
        ache.active = true;
        that.scheduleOnce(function() {
            ache.active = false;
        }, 1);
    },
    crti(){
        let that = this;
        let _addSub = addSub();
        let _ram = Math.random();
        var node = new cc.Node('crti');
        var sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = that.crtiIcon;
        node.parent = that.node;
        node.x = _ram*30*_addSub;
        cc.tween(node)
            .to(.4, {position: cc.v2(node.x+60*_addSub, 80)})
            .to(.1, {scale: 1.2}).to(.1, {scale: .9}).to(.1, {scale: 1.1}).to(.1, {scale: 1}).to(.1, {scale: .9}).to(.1, {scale: 1}).to(.1, {opacity: 0})
            .call(function(){
                node.destroy();
            })
            .start();
    },
    currency(){
        let that = this;
        let _ram = Math.random();
        let currNode = new cc.Node("currNode"+parseInt(new Date().getTime()*_ram));
        currNode.parent = that.node;
        currNode.x = 50*addSub()*_ram-80;
        let curr = 12345;
        curr = curr.toString();
        let _arr = curr.split("");
        that.currencyRender(_arr, currNode);
    },
    currencyRender(_arr, currNode){
        let that = this;
        if(_arr.length == 0) return;
        let n = _arr.shift();
        let _name = 'h'+n;
        cc.loader.loadRes("num/"+_name, cc.SpriteFrame, function (err, spriteFrame) {
            var node = new cc.Node(_name);
            var sp = node.addComponent(cc.Sprite);
            sp.spriteFrame = spriteFrame;
            node.parent = currNode;
            node.x = 24*n;
            if(_arr.length == 0){
                cc.tween(currNode)
                    .to(.4, {position: cc.v2(currNode.x+120*addSub(), 80)})
                    .to(.1, {scale: 1.2}).to(.1, {scale: .9}).to(.1, {scale: 1.1}).to(.1, {scale: 1}).to(.1, {scale: .9}).to(.1, {scale: 1}).to(.1, {opacity: 0})
                    .call(function(){
                        currNode.destroy();
                    })
                    .start();
                return;
            }
            that.currencyRender(_arr, currNode);
        });
    },
    start () {

    },

    update (dt) {},
});
