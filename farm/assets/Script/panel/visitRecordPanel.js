cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.node.getChildByName("bg").on("touchend", function(e){e.stopPropagation();}, this);
        this.node.getChildByName("btn_gb").on("touchend", function(){
            this.node.active = false;
        }, this);
        
        // this.showPanel();
        let that = this;
        that.content = that.node.getChildByName("scrollview").getChildByName("view").getChildByName("content");
        that.consoleText = that.content.getChildByName("item");
    },
    showPanel(list){
        this.node.active = true;

        let that = this;
        let str = '';
        // list = list || [];
        // list[0] = {
        //     "userId": '101208',
        //     "nickName": '呜呜呜呜',
        //     "seedSn": '1771',
        //     "time": '2020-8-3 06:02'
        // };
        // let item = that.consoleText.getComponent(cc.RichText);
        if(that.content == undefined){
            that.content = that.node.getChildByName("scrollview").getChildByName("view").getChildByName("content");
        }
        that.content.removeAllChildren();
        if(list && list.length > 0){
            for(var i = 0; i < list.length; i ++){
                var node = new cc.Node('userid_' + list[i].userId);
                var sp = node.addComponent(cc.RichText);
                sp.string = list[i].time + " " + list[i].nickName + '访问了你的农场，并照料了你的'+goodsConfig[list[i].vegeSn].name+'<color=#ff0000>  <on click="handler" param="'+list[i].userId+'">回访></on></color><br/>';
                sp.horizontalAlign =  cc.Label.HorizontalAlign.LEFT;
                sp.lineHeight = 40;
                sp.fontSize = 24;
                sp.maxWidth = 500;
                node.y = -(60 + (80 + 6) * i);                
                node.color = new cc.Color(179, 157, 98, 255);
                node.parent = that.content;
                node.on("touchend", that.itemClick, that);
            }
        }else{
            var node = new cc.Node('blankText');
            var sp = node.addComponent(cc.RichText);
            sp.string = '暂无记录';
            sp.horizontalAlign =  cc.Label.HorizontalAlign.CENTER;
            sp.lineHeight = 40;
            sp.fontSize = 24;
            sp.maxWidth = 500;
            node.y = -60;                
            node.color = new cc.Color(179, 157, 98, 255);
            node.parent = that.content;
        }
        // content.horizontalAlign =  cc.Label.HorizontalAlign.LEFT;
        // str = '12-04   22：00  XXXX访问了你的农场，并照料了你的XXX，<color=#ff0000><on click="handler" param="101208">回访></on></color>\n'
        //     +'12-04   22：00  XXXX访问了你的农场，并照料了你的XXX，<color=#ff0000><on click="handler" param="101208">回访></on></color>';

        // item.string = str;
        // item.lineHeight = 40;
        // item.fontSize = 24;
        that.scheduleOnce(function(){
            that.content.height = (80+6) * (list.length || 1);
            that.content.position = cc.v2(0, 170);
            that.node.getChildByName("scrollview").getComponent(cc.ScrollView).scrollToTop(0.1);
        }, .2);
        
    },
    itemClick(e){
        let that = this;
        let userId = e.target.name.split("_")[1];
        var event = new cc.Event.EventCustom('returnVisit', true);
        event.setUserData(userId);
        that.node.dispatchEvent( event );
    },
    hidePanel(){
        this.node.active = false;
    },
    start () {

    },

    // update (dt) {},
});
