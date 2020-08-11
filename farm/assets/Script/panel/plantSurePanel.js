cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.node.getChildByName("bg").on("touchend", function(e){e.stopPropagation();}, this);
        this.node.getChildByName("btn_gb").on("touchend", function(){
            this.node.active = false;
        }, this);

        // this.editbox = this.node.getChildByName("editboxNum");

        this.btnLeft = this.node.getChildByName("btn_blue");
        this.btnRight = this.node.getChildByName("btn_green");
        
        // this.showPanel();
    },
    showPanel(objList){
        this.node.active = true;
        var arr = {
            title: '提示',
            stuffSn: '',
            content:      "默认说明",
            leftBtnText:  "取消",
            leftCallback: function(){},
            rightBtnText:  "确定",
            rightCallback: function(){}
        };
        this.brr = {};
        for(var attr in arr){
            this.brr[attr] = arr[attr];
        }
        for(var attr in objList){
            this.brr[attr] = objList[attr];
        }

        // this.brr = $.extend(arr, objList);
        let gift = this.node.getChildByName("yuan").getChildByName("gift").getChildByName("gift1");
        cc.loader.loadRes("crops/"+this.brr.stuffSn, cc.SpriteFrame, function (err, spriteFrame) {
            gift.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            gift.active = true;
            gift.width = gift.height = 120;
        });
        // this.editbox.getComponent(cc.EditBox).string = 0;
        // this.exchangeNum = 0;
        this.btnLeft.getChildByName("label").getComponent(cc.Label).string = this.brr.leftBtnText;
        this.btnRight.getChildByName("label").getComponent(cc.Label).string = this.brr.rightBtnText;
        this.node.getChildByName("title").getChildByName("label").getComponent(cc.Label).string = this.brr.title;
        this.node.getChildByName("label2").getComponent(cc.Label).string = this.brr.content;

        this.btnLeft.once("touchend", function(){
            this.brr.leftCallback();
            this.panelBtnOff();
            this.node.active = false;
        }, this);
        this.btnRight.once("touchend", function(){
            this.brr.rightCallback();
            this.panelBtnOff();
            this.node.active = false;
        }, this);
    },
    panelBtnOff(){
        this.btnLeft.off("touchend");
        this.btnRight.off("touchend");
    },
    start () {

    },

    // update (dt) {},
});
