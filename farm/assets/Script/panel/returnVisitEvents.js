cc.Class({
    extends: cc.Component,

    properties: {
    },

    // onLoad () {},
    handler(e, param){
        let that = this;
        var event = new cc.Event.EventCustom('returnVisit', true);
        event.setUserData(param);
        that.node.dispatchEvent( event );
    },

    start () {

    },

    // update (dt) {},
});
