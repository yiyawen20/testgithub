cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        let that = this;




        // this.node.getChildByName("bg").on("touchend", function(evt){return;}, this);

        // this.btnLeft = this.node.getChildByName("pop_btn_bg1");
        // this.btnRight = this.node.getChildByName("pop_btn_bg2");





        that.node.active = false;
        that.content = that.node.getChildByName("scrollview").getChildByName("view").getChildByName("content");
        that.consoleText = that.content.getChildByName("item");
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, that.onKeyDown, that);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, that.onKeyUp, that);
        // clientEvent.on("gameStart", that.gameStartEvent, that);
    },
    onKeyDown: function (event) {
        let that = this;
        switch(event.keyCode) {
            case cc.macro.KEY.shift && cc.macro.KEY.q:
                // console.log('Press shift+q key');
                that.init();
                break;
        }
    },
    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.shift && cc.macro.KEY.q:
                // console.log('release shift+q key');
                break;
        }
    },
    // gameStartEvent(){
    //     consoleArr = [];
    // },
    init(){
        let that = this;
        that.node.active = !that.node.active;
        let _li = "";
        for(var i in consoleArr){
            _li += consoleArr[i] + "\n";
        }
        that.consoleText.getComponent(cc.Label).string = _li;
        that.scheduleOnce(function(){
            that.content.height = that.consoleText.height;
        }, .2);
    },

    start () {

    },

    // update (dt) {},
});
