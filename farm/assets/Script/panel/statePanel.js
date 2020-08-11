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
        this.btnChanchu = this.node.getChildByName("chanchu");
        let that = this;
        that.btnChanchu.on("touchend", function(){
            if(this.node.getChildByName("label2").getComponent(cc.Label).string.indexOf('已枯萎') == -1){
                var arr = {
                    content:      '提前铲除植物将无法获取后续收成，是否继续铲除？',
                    leftBtnText:  "取消",
                    leftCallback: function(){},
                    rightBtnText: "确定",
                    rightCallback: function(){
                        that.removeLand();
                    },
                    centerBtnText: "",
                    centerCallback: function(){}
                };
                var event = new cc.Event.EventCustom('commonPanel', true);
                event.setUserData(arr);
                that.node.dispatchEvent( event );
            }else{
                that.removeLand();
            }
            that.node.active = false;
        }, that);
        
        // this.showPanel();
    },
    removeLand(){
        // 铲除
        let that = this;
        appRequest.Get("farm/home/plantRemove", {
            token: token,
            landId: that.landId
        }, function(rs){
            let res = JSON.parse(rs);
            let result = res.result;
            let str = '';
            if(result == 0){
                // 成功
                str = '铲除成功';
                var event = new cc.Event.EventCustom('removeLand', true);
                event.setUserData(that.landId);
                that.node.dispatchEvent( event );
            }else{
                str = '铲除失败';
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
        this.btnRight.getChildByName("label").getComponent(cc.Label).string = this.brr.rightBtnText;
        this.node.getChildByName("title").getChildByName("label").getComponent(cc.Label).string = this.brr.title;
        this.node.getChildByName("label1").getComponent(cc.Label).string = this.brr.time;
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
