const pool = require("pool");
const appRequest = require("network");
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad () {
        let that = this;
        clientEvent.init();

        that.content = cc.find("Canvas/main/pageview/view/content");
        that.num = 0;
        that.init();
    },

    init(){
        var that = this;
        let node = new cc.Node('guide' + that.num);
        let sp = node.addComponent(cc.Sprite);
        // node.x = 750 * that.num;
        // node.parent = that.content.parent;
        let pageView = that.getComponent(cc.PageView);
        that.node.on("touchmove", that.movePage, that);
        that.node.on("touchend", that.nextPage, that);
        pageView.addPage(node);
        cc.loader.loadRes("guide/"+(that.num+1), cc.SpriteFrame, function (err, spriteFrame) {
            sp.spriteFrame = spriteFrame;
            if(that.num == 4){
                node.on("touchend", that.openFarm, that);
                return;
            }
            that.num ++;
            that.init();
        });
    },
    openFarm(){
        console.log("openFarm");
        this.node.active = false;
    },
    movePage(){
        var that = this;
        let pageView = that.getComponent(cc.PageView);
        that.isScrolling = pageView.isScrolling();
    },
    nextPage(e){
        if(e != undefined) e.stopPropagation();
        var that = this;
        if(that.isScrolling){
            that.isScrolling = !that.isScrolling;
        }else{
            let pageView = that.getComponent(cc.PageView);
            let idx = pageView.getCurrentPageIndex();
            pageView.scrollToPage(idx + 1);
        }
    },    
    start () {},

    // update (dt) {},
});
