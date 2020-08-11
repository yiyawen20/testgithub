cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.node.getChildByName("bg").on("touchend", function(e){e.stopPropagation();}, this);
        this.node.getChildByName("btn_gb").on("touchend", function(){
            this.node.active = false;
        }, this);
        
        let that = this;
        that.content = that.node.getChildByName("scrollview").getChildByName("view").getChildByName("content");
        that.consoleText = that.content.getChildByName("item");
        // this.showPanel();
    },
    showPanel(objList){
        this.node.active = true;
        var arr = {
            title: '提示',
            content:      "默认说明"
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

        this.node.getChildByName("title").getChildByName("label").getComponent(cc.Label).string = this.brr.title;
        that.consoleText.getComponent(cc.RichText).string = this.brr.content;
        that.scheduleOnce(function(){
            that.content.height = that.consoleText.height;
            that.content.position = cc.v2(0, 170);
            that.node.getChildByName("scrollview").getComponent(cc.ScrollView).scrollToTop(0.1);
        }, .2);
    },
    start () {

    },

    // update (dt) {},
});
