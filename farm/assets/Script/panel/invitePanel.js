const pool = require("pool");
const appRequest = require("network");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.node.getChildByName("bg").on("touchend", function(e){e.stopPropagation();}, this);
        this.node.getChildByName("btn_gb").on("touchend", function(){
            this.node.active = false;
        }, this);

        this.btnLeft = this.node.getChildByName("btn1");
        this.btnRight = this.node.getChildByName("btn2");
        
        // this.showPanel();
    },
    showPanel(objList, landId){
        this.landId = landId;
        this.node.active = true;
        var arr = {
            title: '提示',
            time: '枯萎',
            content:      "默认说明",
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

        this.btnLeft.getChildByName("label").getComponent(cc.Label).string = this.brr.leftBtnText;
        // this.btnRight.getChildByName("label").getComponent(cc.Label).string = this.brr.rightBtnText;
        this.node.getChildByName("title").getChildByName("label").getComponent(cc.Label).string = this.brr.title;
        this.node.getChildByName("label_t").getComponent(cc.Label).string = this.brr.time;
        this.node.getChildByName("label1").getComponent(cc.Label).string = this.brr.content;

        this.btnLeft.once("touchend", function(){
            this.brr.leftCallback();
            this.panelBtnOff();
            this.node.active = false;
        }, this);
        // this.btnRight.once("touchend", function(){
        //     this.brr.rightCallback();
        //     this.panelBtnOff();
        //     this.node.active = false;
        // }, this);
    },
    panelBtnOff(){
        this.btnLeft.off("touchend");
        // this.btnRight.off("touchend");
    },
    start () {

    },

    // update (dt) {},
});
