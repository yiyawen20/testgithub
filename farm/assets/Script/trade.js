cc.Class({
    extends: cc.Component,

    properties: {
        editbox: {
            default: null,
            type: cc.EditBox
        }
    },
    onLoad () {
        let that = this;
        that.node.getChildByName("bg").on("touchend", function(e){e.stopPropagation();}, that);
        that.node.getChildByName("btn2").on("touchend", function(e){
            e.stopPropagation();
            that.node.active = false;
        }, that);

        that.shop = that.node.getChildByName("shop");
        that.storage = that.node.getChildByName("storage");
        that.sale = that.node.getChildByName("sale");
        that.record = that.node.getChildByName("record");

        that.qie1 = that.node.getChildByName("qie1");
        that.qie2 = that.node.getChildByName("qie2");
        that.qie3 = that.node.getChildByName("qie3");
        that.qie4 = that.node.getChildByName("qie4");
        that.qie1.on("touchend", that.switchTab, {evt: that, idx: 1});
        that.qie2.on("touchend", that.switchTab, {evt: that, idx: 2});
        that.qie3.on("touchend", that.switchTab, {evt: that, idx: 3});
        that.qie4.on("touchend", that.switchTab, {evt: that, idx: 4});
        // this.editbox.getComponent(cc.EditBox).string = 100000;
    },
    switchTab(){
        let that = this.evt;
        let idx = this.idx;
        that.qie1.getChildByName("qie1").active = false;
        that.qie2.getChildByName("qie1").active = false;
        that.qie3.getChildByName("qie1").active = false;
        that.qie4.getChildByName("qie1").active = false;
        that.shop.active = false;
        that.storage.active = false;
        that.sale.active = false;
        that.record.active = false;
        if(idx == 1){
            that.qie1.getChildByName("qie1").active = true;
            // that.shop.active = true;
            that.shop.getComponent("shop").show();
        }else if(idx == 2){
            that.qie2.getChildByName("qie1").active = true;
            // that.storage.active = true;
            that.storage.getComponent("storage").show();
        }else if(idx == 3){
            that.qie3.getChildByName("qie1").active = true;
            // that.sale.active = true;
            that.sale.getComponent("sale").show();
        }else if(idx == 4){
            that.qie4.getChildByName("qie1").active = true;
            // that.record.active = true;
            that.record.getComponent("record").show();
        }
    },
    textChanged(e, customEventData){
        cc.log(e + "," + this.editbox.string)
        console.dir(customEventData);
    },

    start () {},

    // update (dt) {},
});
