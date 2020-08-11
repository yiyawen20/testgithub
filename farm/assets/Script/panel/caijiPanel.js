const pool = require("pool");
const appRequest = require("network");
cc.Class({
    extends: cc.Component,

    properties: {
        giftLi: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad () {
        this.node.getChildByName("bg").on("touchend", function(e){e.stopPropagation();}, this);
        this.node.getChildByName("btn_gb").on("touchend", function(){
            this.node.active = false;
        }, this);

        // this.editbox = this.node.getChildByName("editboxNum");

        this.btnLeft = this.node.getChildByName("btn1");
        
        pool.createPrefabPool(this.giftLi);

        this.giftContent = new cc.Node("giftContent");
        this.giftContent.parent = this.node;
        // this.showPanel();
    },
    showPanel(objList){
        this.node.active = true;
        var arr = {
            title: '提示',
            stuffSn: [],
            content:      "默认说明",
            leftBtnText:  "取消",
            leftCallback: function(){}
        };
        this.brr = {};
        for(var attr in arr){
            this.brr[attr] = arr[attr];
        }
        for(var attr in objList){
            this.brr[attr] = objList[attr];
        }

        // this.brr = $.extend(arr, objList);
        let that = this;
        let stuffSn = that.brr.stuffSn;
        // that.giftContent.y = 68;
        that.giftContent.removeAllChildren();
        that.giftContent.x = 164*-1*(stuffSn.length-1)/2;
        for(var i = 0; i < stuffSn.length; i ++){
            let giftLi = pool.getPrefab(that.giftLi.name);
            let gift = giftLi.getChildByName("gift").getChildByName("gift1");
            gift.width = gift.height = 120;
            giftLi.x = 164 * i;
            that.giftContent.addChild(giftLi);
            gift.active = false;
            cc.loader.loadRes("crops/"+stuffSn[i], cc.SpriteFrame, function (err, spriteFrame) {
                gift.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                gift.active = true;
            });
        }
        // this.editbox.getComponent(cc.EditBox).string = 0;
        // this.exchangeNum = 0;
        this.btnLeft.getChildByName("label").getComponent(cc.Label).string = this.brr.leftBtnText;
        this.node.getChildByName("title").getChildByName("label").getComponent(cc.Label).string = this.brr.title;
        this.node.getChildByName("label2").getComponent(cc.Label).string = this.brr.content;

        this.btnLeft.once("touchend", function(){
            this.brr.leftCallback();
            this.panelBtnOff();
            this.node.active = false;
        }, this);
    },
    panelBtnOff(){
        this.btnLeft.off("touchend");
    },
    start () {

    },

    // update (dt) {},
});
