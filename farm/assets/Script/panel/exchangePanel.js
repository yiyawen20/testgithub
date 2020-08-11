cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.node.getChildByName("bg").on("touchend", function(e){e.stopPropagation();}, this);
        this.node.getChildByName("btn_gb").on("touchend", function(){
            this.node.active = false;
        }, this);

        this.node.getChildByName("btn_zd").on("touchend", function(){
            var _n = parseInt(this.brr.hadNum/this.brr.needNum);
            this.exchangeNum = _n;
            if(_n == 0){
                console.log("数量不够")
            }
            this.editbox.getComponent(cc.EditBox).string = _n;
            this.node.getChildByName("label1").getComponent(cc.Label).string = "礼物价值："+giftConfig[this.brr.giftSn].price+"贝壳\n所需碎片："+this.brr.needNum+"片\n兑换数量：\n共需碎片："+_n*this.brr.needNum;
        }, this);

        this.editbox = this.node.getChildByName("editboxNum");

        this.btnLeft = this.node.getChildByName("btn1");
        
        // this.showPanel();
    },
    textChanged(e, customEventData){
        this.exchangeNum = e;
        this.node.getChildByName("label1").getComponent(cc.Label).string = "礼物价值："+giftConfig[this.brr.giftSn].price+"贝壳\n所需碎片："+this.brr.needNum+"片\n兑换数量：\n共需碎片："+e*this.brr.needNum;
        cc.log(e + "," + this.editbox.string);
        console.dir(customEventData);
    },
    showPanel(objList){
        this.node.active = true;
        var arr = {
            title: '提示',
            giftSn: '',
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
        let gift = this.node.getChildByName("yuan").getChildByName("gift").getChildByName("gift1");
        cc.loader.loadRes("gift/"+this.brr.giftSn, cc.SpriteFrame, function (err, spriteFrame) {
            gift.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            gift.active = true;
            gift.width = gift.height = 120;
        });
        this.editbox.getComponent(cc.EditBox).string = 0;
        this.exchangeNum = 0;
        this.btnLeft.getChildByName("label").getComponent(cc.Label).string = this.brr.leftBtnText;
        this.node.getChildByName("title").getChildByName("label").getComponent(cc.Label).string = this.brr.title;
        this.node.getChildByName("label1").getComponent(cc.Label).string = this.brr.content;

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
