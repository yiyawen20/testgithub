cc.Class({
    extends: cc.Component,

    properties: {
        optionsTab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad () {
        this.node.getChildByName("bg").on("touchend", function(e){e.stopPropagation();}, this);
        this.node.getChildByName("btn_gb").on("touchend", function(){
            this.node.active = false;
        }, this);

        // this.editbox = this.node.getChildByName("editboxNum");

        this.btnLeft = this.node.getChildByName("btn1");

        this.selectNode = new cc.Node('selectNode');
        this.selectNode.parent = this.node;

        this.selectId = 0;
        
        // this.showPanel();
    },
    showPanel(objList){
        this.node.active = true;
        var arr = {
            title: '提示',
            leftBtnText:  "取消",
            leftCallback: function(){}
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
        this.node.getChildByName("title").getChildByName("label").getComponent(cc.Label).string = this.brr.title;

        this.btnLeft.once("touchend", function(){
            this.brr.leftCallback();
            this.panelBtnOff();
            this.node.active = false;
        }, this);

        let that = this;
        // that.selectId = 0;
        let j = 0;
        if(that.selectNode.children.length > 0) return;
        for(var i = 0; i < shopChoiceArr.length; i ++){
            let _optionsTab = cc.instantiate(that.optionsTab);
            _optionsTab.x = (j % 3) * (153 + 6);
            _optionsTab.y = Math.floor(j/3) * (58 + 8) * -1;
            j ++;
            _optionsTab.getChildByName("choice2").active = false;
            _optionsTab.getChildByName("label").getComponent(cc.Label).string = goodsConfig[shopChoiceArr[i]].name;
            _optionsTab.on("touchend", that.selectOption,{evt: that, stuffSn: shopChoiceArr[i], j: j});
            that.selectNode.addChild(_optionsTab);
            that.selectNode.x = -1 * (156+6) + 6;
            that.selectNode.y = (58+8)*Math.floor(j/3)/2 + 30;
        }
        // that.each(goodsConfig, function(i, v){
        //     if(v.placeholder != undefined && v.placeholder != ""){
        //         let _optionsTab = cc.instantiate(that.optionsTab);
        //         _optionsTab.x = (j % 3) * (153 + 6);
        //         _optionsTab.y = Math.floor(j/3) * (58 + 8) * -1;
        //         j ++;
        //         _optionsTab.getChildByName("choice2").active = false;
        //         _optionsTab.getChildByName("label").getComponent(cc.Label).string = v.name;
        //         _optionsTab.on("touchend", that.selectOption,{evt: that, stuffSn: i, j: j});
        //         that.selectNode.addChild(_optionsTab);
        //         that.selectNode.x = -1 * (156+6) + 6;
        //         that.selectNode.y = (58+8)*Math.floor(j/3)/2 + 30;
        //     }
        // });
    },
    selectOption(e){
        let evt = this;
        let that = evt.evt;
        let stuffSn = evt.stuffSn;
        that.selectId = that.selectId == stuffSn ? 0 : stuffSn;
        // e.currentTarget.getChildByName("choice2").active = true;
        for(let i = 0; i < that.selectNode.children.length; i ++){
            let _active = false;
            if(i == evt.j - 1 && that.selectId != 0){
                _active = true;
            }
            that.selectNode.children[i].getChildByName("choice2").active = _active;
        }
    },
    panelBtnOff(){
        this.btnLeft.off("touchend");
    },
    each(object, callback){
        var type = (function(){
            switch (object.constructor){
                case Object:
                    return 'Object';
                    break;
                case Array:
                    return 'Array';
                    break;
                case NodeList:
                    return 'NodeList';
                    break;
                default:
                    return 'null';
                    break;
            }
        })();
        // 为数组或类数组时, 返回: index, value
        if(type === 'Array' || type === 'NodeList'){
            // 由于存在类数组NodeList, 所以不能直接调用every方法
            [].every.call(object, function(v, i){
                return callback.call(v, i, v) === false ? false : true;
            });
        }
        // 为对象格式时,返回:key, value
        else if(type === 'Object'){
            for(var i in object){
                if(callback.call(object[i], i, object[i]) === false){
                    break;
                }
            }
        }
    },
    start () {

    },

    // update (dt) {},
});
