cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.node.getChildByName("bg").on("touchend", function(e){e.stopPropagation();}, this);

        this.btnLeft = this.node.getChildByName("pop_btn_bg1");
        this.btnRight = this.node.getChildByName("pop_btn_bg2");
        
        // this.showPanel();
    },
    showPanel(objList){
        this.node.active = true;
        var arr = {
            content:      "游戏错误",
            leftBtnText:  "取消",
            leftCallback: function(){},
            rightBtnText: "确定",
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

        this.btnLeft.getChildByName("text").getComponent(cc.Label).string = this.brr.leftBtnText;
        this.btnRight.getChildByName("text").getComponent(cc.Label).string = this.brr.rightBtnText;
        this.node.getChildByName("text").getComponent(cc.Label).string = this.brr.content;

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
