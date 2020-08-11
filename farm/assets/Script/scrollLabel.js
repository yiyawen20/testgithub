cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        itemLabel: {
            default: null,
            type: cc.RichText
        }
    },
    onLoad () {
        let that = this;

        // 初始化跳跃动作
        // that.scrollAction = that.setScrollAction();
        // that.node.runAction(that.scrollAction);

        that.itemNumber = 4;
        // that.itemLabel.node.active = true;
        // that.itemLabel.string = '12-03 22：33 比一句中访问了你的农场，并照料了你的满天星幼苗~~\n'
        //     +'12-03 22：33 暗室逢灯发送给发货1~~\n'
        //     +'12-03 22：33 同仁堂和教育局统一发放的方式发给红包呢2~~\n'
        //     +'12-03 22：33 啊实打实大扫荡法规实打实阿打算 阿打算多 阿达3~~\n';
        
        // that.setScrollAction();
    },
    headerScroll(list){
        let that = this;
        let str = '', typeStr = '';
        if(list && list.length > 0){
            for(var i = 0; i < list.length; i ++){
                typeStr = list[i].type == 1 ? '兑换' : '幸运的获得了';
                str += "<color=#ffda00>" + list[i].nickName + '</color>'+typeStr+'<color=#00edff>' + list[i].num + '</color>个<color=#00edff>' + list[i].giftName +'</color>！<br/>';
            }
            that.itemLabel.string = str;
            that.itemNumber = Math.floor((that.itemLabel.node.height - 50)/40);
            that.setScrollAction();
            that.itemLabel.node.active = true;
        }else{
            that.node.active = false;
        }
    },
    footerScroll(list){
        let that = this;
        let str = '';
        if(list && list.length > 0){
            for(var i = 0; i < list.length; i ++){
                str += list[i].time + " " + list[i].nickName + '访问了你的农场，并照料了你的'+goodsConfig[list[i].vegeSn].name+'！<br/>';
            }
            that.itemLabel.string = str;
            that.itemNumber = Math.floor((that.itemLabel.node.height - 50)/40);
            that.setScrollAction();
            that.itemLabel.node.active = true;
        }
    },
    setScrollAction: function () {
        let that = this;
        that.unschedule(that.callback);
        that.idx = 0;
        // 以秒为单位的时间间隔
        var interval = 5;
        that.callback = function () {
            that.idx++;
            that.scrollAction();
        }
        that.schedule(that.callback, interval);
    },
    scrollAction(){
        let that = this;
        if(that.idx >= that.itemNumber){
            that.idx = 0;
            that.itemLabel.node.setPosition(cc.v2(0, 25));
        }else{
            let callback = cc.callFunc(that.completeLabel, that, [that.idx]);
            let seq = cc.sequence(cc.moveBy(0, cc.v2(0, 0)), cc.moveBy(0.5, cc.v2(0, 40)), callback);
            that.itemLabel.node.runAction(seq);
        }
    },
    completeLabel(evt, arr){
        // cc.log('completeLabel:', arr[0]);
    },

    start () {},

    // update (dt) {},
});
