cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.node.getChildByName("bg").on("touchend", function(e){e.stopPropagation();}, this);
        this.node.getChildByName("btn_gb").on("touchend", function(){
            this.node.active = false;
        }, this);

        this.btnLeft = this.node.getChildByName("btn_blue");
        this.btnRight = this.node.getChildByName("btn_green");
        this.btnCenter = this.node.getChildByName("btn1");
        
        // this.showPanel();
    },
    showPanel(objList){
        this.node.active = true;
        var arr = {
            content:      "游戏错误",
            leftBtnText:  "取消",
            leftCallback: function(){},
            rightBtnText: "确定",
            rightCallback: function(){},
            centerBtnText: "确定",
            centerCallback: function(){}
        };
        this.brr = {};
        for(var attr in arr){
            this.brr[attr] = arr[attr];
        }
        for(var attr in objList){
            this.brr[attr] = objList[attr];
        }

        // this.brr = $.extend(arr, objList);

        if(this.brr.leftBtnText != ""){
            this.btnLeft.active = true;
            this.btnLeft.getChildByName("label").getComponent(cc.Label).string = this.brr.leftBtnText;
        }else{
            this.btnLeft.active = false;
        }
        if(this.brr.rightBtnText != ""){
            this.btnRight.active = true;
            this.btnRight.getChildByName("label").getComponent(cc.Label).string = this.brr.rightBtnText;
        }else{
            this.btnRight.active = false;
        }
        if(this.brr.centerBtnText != ""){
            this.btnCenter.active = true;
            this.btnCenter.getChildByName("label").getComponent(cc.Label).string = this.brr.centerBtnText;
        }else{
            this.btnCenter.active = false;
        }
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
        this.btnCenter.once("touchend", function(){
            this.brr.centerCallback();
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
