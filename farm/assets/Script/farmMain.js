const pool = require("pool");
const appRequest = require("network");
cc.Class({
    extends: cc.Component,

    properties: {
        tempTian: {
            default: null,
            type: cc.Prefab
        },
        exchangePanel: {
            default: null,
            type: cc.Prefab
        },
        tradePanel: {
            default: null,
            type: cc.Prefab
        },
        statePanel: {
            default: null,
            type: cc.Prefab
        },
        visitRecordBox: {
            default: null,
            type: cc.Prefab
        },
        visitRecordPanel: {
            default: null,
            type: cc.Prefab
        },
        headerScroll: {
            default: null,
            type: cc.Prefab
        },
        plantPanel:{
            default: null,
            type: cc.Prefab
        },
        plantSurePanel:{
            default: null,
            type: cc.Prefab
        },
        commonPanel: {
            default: null,
            type: cc.Prefab
        },
        caijiPanel: {
            default: null,
            type: cc.Prefab
        },
        invitePanel: {
            default: null,
            type: cc.Prefab
        },
        aboutPanel: {
            default: null,
            type: cc.Prefab
        },
        guideLoading: {
            default: null,
            type: cc.Prefab
        },
        permanentNode: {
            default: null,
            type: cc.Prefab
        }
    },
    onLoad () {
        let that = this;
        clientEvent.init();
        _ivp = query2Obj();
        token = query2Obj().token;
        pool.createPrefabPool(that.tempTian);
        that.tPosList = [];
        that.rows = 4;
        that.columns = 3;

        gameRatio = that.node.parent.height/that.node.parent.width;

        // 他人农场
        that.otherId = (_ivp.otherId == "undefined" ? 0 : _ivp.otherId) || 0;
        that.otherId = that.otherId > 0 ? that.otherId : 0;
        that.otherId = that.otherId == _ivp.userId ? 0 : that.otherId;
        
        let tianArr = [
                        [[218, 136], [216, 136], [218, 136]],
                        [[226, 146], [226, 146], [226, 146]],
                        [[236, 160], [236, 160], [236, 160]],
                        [[248, 174], [248, 174], [248, 174]]
        ];

        //初始化格子坐标
        for(let x = 0;x <that.rows; x++){
            let areaLine = [];
            var longY = 0;
            for(let z = 0; z < x; z++){
                longY += tianArr[z][0][1];
            }
            // longY += 5*x;
            for(let y = 0; y < that.columns; y++){
                // let _pos = tianArr[x][y];
                let longX = tianArr[x][y][0];
                let _x = x-1 < 0 ? 0 : x-1;
                // let longY = tianArr[_x][y][1];
                let pos = cc.v2((longX - 15) * ((y - 1)%2), - longY);
                areaLine[y] = pos;
            }
            that.tPosList.push(areaLine);
        }
        cc.log("田的坐标");
        console.dir(that.tPosList);

        that.callbackBtn = that.node.getChildByName("bg-tm");
        that.callbackBtn.active = false;
        that.callbackBtn.on("touchend", that.callbackMineFarm, that);

        //头部兑换记录
        that.topExchangeRecord = cc.instantiate(that.headerScroll);
        that.topExchangeRecord.x = -80;
        that.topExchangeRecord.y = 560;
        // that.topExchangeRecord.active = false;
        that.node.addChild(that.topExchangeRecord);
        
        //到访记录跑到
        that._visitRecordBox = cc.instantiate(that.visitRecordBox);
        that._visitRecordBox.x = -40;
        that._visitRecordBox.y = gameRatio >= ratio ? -600 : -560;
        // that._visitRecordBox.active = false;
        that.node.addChild(that._visitRecordBox);
        // that._visitRecord = visitRecord.getComponent("visitRecordPanel");

        //到访记录弹窗
        let visitRecord = cc.instantiate(that.visitRecordPanel);
        visitRecord.active = false;
        that.node.addChild(visitRecord);
        that._visitRecord = visitRecord.getComponent("visitRecordPanel");

        that._visitRecordBox.on("touchend", function(){
            that._visitRecord.showPanel(that.lookList);
        }, that);

        that.node.on('commonPanel', function (event) {
            event.stopPropagation();
            that.farmCommonPanel(event.detail);
        });

        that.node.on('plantSuccess', function (event) {
            event.stopPropagation();
            that.plantSuccess(event.detail);
        });

        that.node.on('removeLand', function (event) {
            event.stopPropagation();
            that.removeLand(event.detail);
        });

        that.node.on('returnVisit', function (event) {
            event.stopPropagation();
            that.visitOtherFarm(event.detail);
        });

        that.node.on('pcRecharge', function (event) {
            event.stopPropagation();
            that.pcRecharge(event.detail);
        });

        that.node.on('phoneRecharge', function (event) {
            event.stopPropagation();
            that.phoneRecharge(event.detail);
        });

        that.iconDhzx = that.node.getChildByName("icon–dhzx");
        that.iconJysc = that.node.getChildByName("icon_jysc");

        if(that.otherId == 0){
            that.getMap(); 
        }else{
            that.visitOtherFarm(that.otherId);
        }

        pool.createPrefabPool(that.exchangePanel);
        let exchangePanel = pool.getPrefab(that.exchangePanel.name);
        exchangePanel.active = false;
        that.node.addChild(exchangePanel);
        pool.createPrefabPool(that.tradePanel);
        let tradePanel = pool.getPrefab(that.tradePanel.name);
        tradePanel.active = false;
        that.node.addChild(tradePanel);
        
        let exchange = that.node.getChildByName("exchange");
        that.iconDhzx.on("touchend", function(){
            exchange.getComponent("exchange").show();
            // exchange.active = true;
            exchange.scale = gameRatio >= ratio ? 1 : .9;
        }, that);

        let trade = that.node.getChildByName("trade");
        that.iconJysc.on("touchend", function(){
            trade.active = true;
            trade.scale = gameRatio >= ratio ? 1 : .9;
        }, that);

        //植物状态弹窗
        let statePanel = cc.instantiate(that.statePanel);
        statePanel.active = false;
        that.node.addChild(statePanel);
        that._statePanel = statePanel.getComponent("statePanel");

        //种植弹窗
        let plantPanel = cc.instantiate(that.plantPanel);
        plantPanel.active = false;
        that.node.addChild(plantPanel);
        that._plantPanel = plantPanel.getComponent("plantPanel");

        //种植确认弹窗
        let plantSurePanel = cc.instantiate(that.plantSurePanel);
        plantSurePanel.active = false;
        that.node.addChild(plantSurePanel);
        that._plantSurePanel = plantSurePanel.getComponent("plantSurePanel");
        that.node.on('plantSurePanel', function (event) {
            event.stopPropagation();
            that.plantSurePanelCb(event.detail);
        });

        //采集成功
        let caijiPanel = cc.instantiate(that.caijiPanel);
        caijiPanel.active = false;
        that.node.addChild(caijiPanel);
        that._caijiPanel = caijiPanel.getComponent("caijiPanel");

        //邀请照料
        let invitePanel = cc.instantiate(that.invitePanel);
        invitePanel.active = false;
        that.node.addChild(invitePanel);
        that._invitePanel = invitePanel.getComponent("invitePanel");

        //说明弹窗
        let aboutPanel = cc.instantiate(that.aboutPanel);
        aboutPanel.active = false;
        that.node.addChild(aboutPanel);
        that._aboutPanel = aboutPanel.getComponent("aboutPanel");

        that.node.on('aboutPanel', function (event) {
            event.stopPropagation();
            that.aboutCommonPanel(event.detail);
        });

        // 玩法说明
        that.playAhout = that.node.getChildByName("play_about");
        that.playAhout.on("touchend", function(){
            var arr = {
                title: '提示',
                content: '一、VIP特权\n'
                +'所有用户默认拥有一块土地，VIP4及以上用户额外获取1块土地，VIP6以上用户额外获取1块土地，VIP7以上用户额外获取2块土地，VIP8以上用户额外获取1块土地，VIP9以上用户额外获取2块土地，VIP10以上用户额外获取2块土地，SVIP额外获取2块土地。\n'
                +'当用户的VIP等级分别为VIP9、VIP10、SVIP时，采集收益分别提升2倍、3倍、5倍。\n\n'
                +'二、种植\n'
                +'植物分为：\n'
                +'一级植物：满天星，牵牛花，野菊花\n'
                +'二级植物：冬青花，金茶花，杜鹃花\n'
                +'三级植物：摇钱树\n'
                +'种植植物消耗对应种子，种子可以通过系统或玩家商店购买，或收获获得。\n'
                +'不同等级植物的存活周期及限定的VIP等级不同：\n'
                +'一级植物最低VIP0可种，最长存活3天\n'
                +'二级植物最低VIP3可种，最长存活5天\n'
                +'三级植物最低VIP5可种，最长存活7天\n\n'
                +'三、照料、采集\n'
                +'植物状态分为幼苗、良好、一般、濒死及枯萎。每次照料都将恢复植物状态至良好。如果一个植物连续3天不照料将枯萎死亡。三级植物需要分享农场至正在直播的直播间邀请他人照料。\n'
                +'除种植当日外，所有植物必须经过照料方可在次日采集收获。各等级收获对应如下：\n'
                +'一级植物：必定产出3-7个果实，概率产出一级碎片，小概率暴击产出5个一级碎片。\n'
                +'二级植物：必定产出1-5个果实，概率产出二级碎片，概率产出二级种子，小概率暴击产出5个二级碎片。\n'
                +'三级植物：必定产出3-7个果实，概率产出三级碎片，概率产出三级种子，小概率暴击产出5个一级碎片。\n\n'
                +'四、铲除\n'
                +'连续三日未照料或超过最大存活天数的植物将枯萎，需要通过铲除操作清理土地。\n\n'
                +'五、交易\n'
                +'种植采集的种子及碎片可以放入“交易市场”，与其他玩家交易，系统会收取一定手续费。每个物品有官方指导价。\n\n'
                +'六、兑换\n'
                +'积攒足够的碎片可以在“兑换中心”去兑换相应的礼物，兑换礼物需要相应的VIP等级。'
            };
            var event = new cc.Event.EventCustom('aboutPanel', true);
            event.setUserData(arr);
            that.node.dispatchEvent( event );
        }, that);

        //引导
        that.guideOpenFarm();

        //panel
        let commonPanel = cc.instantiate(that.commonPanel);
        commonPanel.active = false;
        that.node.addChild(commonPanel);
        that.showPanel = commonPanel.getComponent("panel");
        // commonPanel.getComponent("panel").panel = that;

        // 常驻节点
        // cc.game.addPersistRootNode(that.node);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, that.onKeyDown, that);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, that.onKeyUp, that);

        let permanentNode = cc.instantiate(that.permanentNode);
        permanentNode.active = true;
        that.node.addChild(permanentNode);
        that.consoleNode = permanentNode.getComponent("console");

        that.node.on("touchstart", that.onTouchStart, that);
        that.node.on("touchend", that.onTouchEnd, that);
        that.holdClick = false;
        that.holdTimeEclipse = 0;
    },
    getMap () {
        var that = this;
        appRequest.Get("farm/init", {
            token: token
        }, function(rs){
            let res = JSON.parse(rs);
            that.topExchangeRecord.getComponent("scrollLabel").headerScroll(res.exchangeList);
            that._visitRecordBox.getComponent("scrollLabel").footerScroll(res.lookList);
            that.lookList = res.lookList;
            that.farmRender(res);
        });
    },
    getMapOther () {
        var that = this;
        appRequest.Get("farm/initOhter", {
            token: token,
            otherId: that.otherId
        }, function(rs){
            let res = JSON.parse(rs);
            that.farmRender(res);
        });
    },
    farmRender(res){
        var that = this;
        that.node.getChildByName("tian").removeAllChildren();
        for(let j=0; j<that.rows; j++){
            for (let k = 0; k < that.columns; k++) {
                let tianNode = pool.getPrefab(that.tempTian.name);
                tianNode.active = false;
                let seedlings = tianNode.getChildByName("seedlings");
                let iconCaiji = tianNode.getChildByName("icon_caiji");
                let spriteBtqp = tianNode.getChildByName("sprite_btqp");
                let tianB = tianNode.getChildByName("b");
                let iconLipai = tianNode.getChildByName("icon_lipai");
                cc.loader.loadRes("tian/"+(j+1)+"-"+(k+1)+"a", cc.SpriteFrame, function (err, spriteFrame) {
                    tianNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    cc.loader.loadRes("tian/"+(j+1)+"-"+(k+1)+"b", cc.SpriteFrame, function (err, spriteFrame) {
                        tianB.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        tianNode.active = true;
                    });
                });
                let _idx = that.columns*j + k;
                res.list[_idx].landId = _idx + 1;
                let _arr = res.list[_idx];
                if(_arr.seedSn < 0){//未开启
                    tianB.active = true;
                    if(_arr.tips > 0){
                        iconLipai.active = true;
                        iconLipai.getChildByName("label").getComponent(cc.Label).string = (_arr.tips == 11 ? "SVIP" : "V"+_arr.tips) + '开启';
                    }
                    // else if(',9,10'.indexOf(_arr.landId) > -1){
                    //     tianNode.getChildByName("label").active = true;
                    // }else{
                    //     tianNode.getChildByName("icon_lipai").active = true;
                    // }
                }else{//开启
                    tianB.active = false;
                    if(_arr.seedSn > 0){//已种植
                        let _plantId = -1;
                        if(_arr.status == -2){
                            // 幼苗
                            _plantId = 0;
                        }else if(_arr.status == -1){
                            // 枯萎
                            _plantId = -1;
                        }else{
                            // 成熟
                            _plantId = _arr.vegeSn;
                        }
                        cc.loader.loadRes("crops/"+_plantId, cc.SpriteFrame, function (err, spriteFrame) {
                            seedlings.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                            seedlings.active = true;
                            if(_arr.collect == 1){
                                iconCaiji.active = true;
                            }else{
                                if(',0,1,'.indexOf(','+_arr.status+',') > -1 && (that.otherId == 0 || (that.otherId > 0 && goodsConfig[_arr.seedSn].level == 3))){
                                    spriteBtqp.active = true;
                                }
                            }
                            // if(_arr.growUp == 0){
                            //     // 种子状态
                            //     seedlings.setPosition(cc.v2(0, 40));
                            // }else{
                            //     seedlings.setPosition(cc.v2(-6, 70));
                            // }
                            tianNode.getChildByName("bg_zz").active = true;
                            // if(_arr.recv == 1 && _arr.care == 0 && _arr.growth == 1){
                            //     iconCaiji.setPosition(cc.v2(50, 123));
                            //     spriteBtqp.setPosition(cc.v2(-50, 148));
                            // }
                        });
                    }
                }
                that.node.getChildByName("tian").addChild(tianNode);
                iconCaiji.on("touchend", that.tianCaiji, {evt: that, landId: _arr.landId});
                spriteBtqp.on("touchend", that.tianCare, {evt: that, landId: _arr.landId});
                tianNode.setPosition(that.tPosList[j][k]);
                tianNode.pieceIdx = j*that.rows + k;
                showTianInfo = res.list;

                tianNode.on("touchend", that.showPlantPanel, {evt: that, landId: _arr.landId});
            }
        }
        console.dir(showTianInfo, that.node.getChildByName("tian"));
    },
    tianCaiji(e){
        if(e != undefined) e.stopPropagation();
        let that = this.evt;
        let landId = this.landId;
        let vegeSn = showTianInfo[landId-1].vegeSn;
        let tian = that.node.getChildByName("tian");
        let tianNode = tian.children[landId - 1];
        let bgZz = tianNode.getChildByName("bg_zz");
        let seedlings = tianNode.getChildByName("seedlings");
        let iconCaiji = tianNode.getChildByName("icon_caiji");
        let spriteBtqp = tianNode.getChildByName("sprite_btqp");
        appRequest.Get("farm/home/collect", {
            token: token,
            landId: landId,
            vegeSn: vegeSn,
            roomId: _ivp.roomId
        }, function(rs){
            let res = JSON.parse(rs);
            let result = res.result;
            let str = '';
            if(result == 0){
                that.scheduleOnce(that.getMap, .1);
                str = '采集成功';
                bgZz.active = false;
                seedlings.active = false;
                iconCaiji.active = false;
                spriteBtqp.active = false;

                let _arr = showTianInfo[landId-1];
                _arr.seedSn = 0;
                _arr.vegeSn = 0;
                showTianInfo[landId-1] = _arr;

                let _brr = ["一", "二", "三", "四", "五", "六", "七", "八"];
                let _btnTxt = res.mult > 1 ? (res.vip == 11 ? 'SVIP' : 'VIP'+res.vip)+_brr[res.mult-1]+'倍领取' : '确定';
                let stuffSn = [], content = '恭喜你收获' + goodsConfig[vegeSn].name + '*' + res.vegeNum;
                stuffSn.push(vegeSn);
                if(res.pieceNum > 0){stuffSn.push(res.pieceSn); content += '、'+goodsConfig[res.pieceSn].name + '*' + res.pieceNum;}
                if(res.seedNum > 0){stuffSn.push(res.seedSn); content += '、'+goodsConfig[res.seedSn].name + '*' + res.seedNum;}
                that._caijiPanel.showPanel({
                    title: goodsConfig[vegeSn].name,
                    stuffSn: stuffSn,
                    content:      content,
                    leftBtnText:  _btnTxt,
                    leftCallback: function(){
                        cc.log(content);
                    }
                });
            }else{
                str = '采集失败';
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
            }
        });

        cc.log('tianCaiji landId:' + landId);
    },
    tianCare(e){
        if(e != undefined) e.stopPropagation();
        let that = this.evt;
        let landId = this.landId;
        if(that.otherId != 0){
            that.otherTakeCare(landId);
            return;
        }
        let vegeObj = goodsConfig[showTianInfo[landId-1].vegeSn];
        let level = vegeObj.level;
        if(level == 3){
            // 三级种子只能邀请照料
            let arr = showTianInfo[landId-1];
            let _statesArr = ["幼苗", "枯萎", "频死", "一般", "良好"];
            let _content = '';
            if(arr.status == 0){
                _content = '请及时邀请他人照料，否则植物将于明天枯萎，你将失去收获'+vegeObj.name+'果实、'+vegeObj.name+'种子及三级碎片的机会（三级碎片可用于兑换特斯拉和糖果炸弹）';
            }else if(arr.status == 1){
                _content = '三级植物需要邀请他人照料，明日才可以继续收获'+vegeObj.name+'果实，有概率获取'+vegeObj.name+'种子及三级碎片哦（三级碎片可用于兑换特斯拉和糖果炸弹）';
            }
            that._invitePanel.showPanel({
                title: goodsConfig[arr.vegeSn].name,
                time: '将于'+arr.endTime+'枯萎',
                content:      '植物状态：'+_statesArr[arr.status+2]+'\n'+_content,
                leftBtnText:  "邀请照料",
                leftCallback: function(){
                    console.log("邀请照料", Math.random());
                    that.sendInvite(landId);
                },
                // rightBtnText: "照料",
                // rightCallback: function(){console.log("照料", Math.random());}
            });
            return;
        }
        let tian = that.node.getChildByName("tian");
        let tianNode = tian.children[landId - 1];
        let spriteBtqp = tianNode.getChildByName("sprite_btqp");
        appRequest.Get("farm/home/takeCare", {
            token: token,
            landId: landId
        }, function(rs){
            let res = JSON.parse(rs);
            let result = res.result;
            let str = '';
            if(result == 0){
                str = '照料成功';
                spriteBtqp.active = false;

                let _arr = showTianInfo[landId-1];
                _arr.status = 2;
                showTianInfo[landId-1] = _arr;
            }else{
                str = '照料失败';
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

        cc.log('zhaoliao landId:' + landId);
    },
    otherTakeCare(landId){
        let that = this;
        let tian = that.node.getChildByName("tian");
        let tianNode = tian.children[landId - 1];
        let spriteBtqp = tianNode.getChildByName("sprite_btqp");
        appRequest.Get("farm/home/otherTakeCare", {
            token: token,
            landId: landId,
            otherId: that.otherId
        }, function(rs){
            let res = JSON.parse(rs);
            let result = res.result;
            let str = '';
            if(result == 0){
                str = '照料成功，奖励200贝壳';
                spriteBtqp.active = false;

                let _arr = showTianInfo[landId-1];
                _arr.status = 2;
                showTianInfo[landId-1] = _arr;
            }else if(result == -3){
                str = '根据您的VIP等级，今日已到照料上限了哦';
            }else if(result == -4){
                str = '当前土地未种植植物';
            }else if(result == -5){
                str = '当前土地不是三级植物';
            }else if(result == -7){
                str = '来晚了，该植物已被照料过了';
            }else{
                str = '照料失败';
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
    sendInvite(landId){
        let that = this;
        appRequest.Get("farm/home/applyCare", {
            token: token,
            roomId: _ivp.roomId,
            landId: landId
        }, function(rs){
            let res = JSON.parse(rs);
            let result = res.result;
            let str = '';
            if(result == 0){
                // 成功
                str = '邀请成功';
            }else if(result == -8){
                str = '只有正在直播的房间才能发送照料邀请哦';
            }else if(result == -5){
                str = '不是三级植物';
            }else if(result == -7){
                str = '该植物已被人照料过了哦';
            }else if(result == -4){
                str = '未种植';
            }else{
                str = '邀请失败';
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
    showPlantPanel(){
        let evt = this;
        let that = evt.evt;
        let arr = showTianInfo[evt.landId-1];
        if(that.otherId != 0) return;
        if(arr.seedSn == 0){
            that._plantPanel.showPanel(arr.landId);
        }
        let _statesArr = ["幼苗", "枯萎", "频死", "一般", "良好"], _time, _content;
        let _brr1 = ['（一级碎片可用于兑换跑车）', '（二级碎片可用于兑换火焰战车和求婚）', '（三级碎片可用于兑换特斯拉和糖果炸弹）'];
        let _brr2 = ["一", "二", "三"];
        let vegeObj = goodsConfig[arr.vegeSn];
        if(',-2,-1,2,'.indexOf(','+arr.status+',') > -1 && arr.seedSn > 0 && arr.collect == 0){
            if(arr.status == -2){
                // 幼苗
                _time = '将于'+arr.endTime.substr(0, 10)+'枯萎';
                _content = '植物状态：'+_statesArr[arr.status+2]+'\n明天可以来收获果实'+vegeObj.name+'，还有概率获取'+ (vegeObj.level > 1 ? vegeObj.name+'种子和' : '') +_brr2[vegeObj.level-1]+'级碎片哦'+_brr1[vegeObj.level-1];
            }else if(arr.status == -1){
                // 枯萎
                _time = '';
                _content = '植物状态：'+_statesArr[arr.status+2]+'\n植物已枯萎，请及时铲除';
            }else if(arr.status == 2){
                // 良好
                _time = '将于'+arr.endTime.substr(0, 10)+'枯萎';
                _content = '植物状态：'+_statesArr[arr.status+2]+'\n明天可以来收获果实'+vegeObj.name+'，还有概率获取'+ (vegeObj.level > 1 ? vegeObj.name+'种子和' : '') +_brr2[vegeObj.level-1]+'级碎片哦'+_brr1[vegeObj.level-1];
            }
            // 查看属性
            that._statePanel.showPanel({
                title: goodsConfig[arr.vegeSn].name,
                time: _time,
                content: _content,
                leftBtnText:  "采集",
                leftCallback: function(){console.log("采集", Math.random());},
                rightBtnText: "照料",
                rightCallback: function(){console.log("照料", Math.random());}
            }, arr.landId);
        }

        let tian = that.node.getChildByName("tian");
        let tianNode = tian.children[arr.landId - 1];
        let iconCaiji = tianNode.getChildByName("icon_caiji");
        let spriteBtqp = tianNode.getChildByName("sprite_btqp");
        if(arr.seedSn > 0 && arr.collect == 1){
            iconCaiji.emit('touchstart');
            iconCaiji.emit('touchend');
        }else if(arr.seedSn > 0 && ',0,1,'.indexOf(','+arr.status+',') > -1){
            spriteBtqp.emit('touchstart');
            spriteBtqp.emit('touchend');
        }
    },
    plantSurePanelCb(evt){
        let that = this;
        let str1 = evt.num > 0 ? '当前剩余' + evt.num + '个' : '售价'+evt.price+'贝壳';
        var arr = {
            title: goodsConfig[evt.seedSn].name,
            stuffSn: evt.seedSn,
            content: str1 + '，是否'+(evt.num > 0 ? '' : '购买并')+'种植',
            leftBtnText:  "取消",
            leftCallback: function(){},
            rightBtnText: "确定",
            rightCallback: function(){
                that.planting(evt);
            }
        };
        that._plantSurePanel.showPanel(arr);
    },
    planting(evt){
        let that = this;
        let _type = evt.num > 0 ? 1 : 2;
        appRequest.Get("farm/home/plant", {
            token: token,
            landId: evt.landId,
            seedSn: evt.seedSn,
            type: _type
        }, function(rs){
            let res = JSON.parse(rs);
            let result = res.result;
            let str = '';
            if(result == 0){
                // 成功
                str = '种植成功';
                var brr = {
                    landId: evt.landId,
                    seedSn: evt.seedSn
                };
                var event = new cc.Event.EventCustom('plantSuccess', true);
                event.setUserData(brr);
                that.node.dispatchEvent( event );
                if(_ivp.openType == "web"){
                    // 刷新贝壳
                    window.parent.postMessage('currShow', '*');
                }
            }else if(result == -1){
                str = '参数有误';
            }else if(result == -2){
                str = '系统异常';
            }else if(result == -3){
                str = '该种子需要VIP'+goodsConfig[evt.seedSn].vip+'才可种植';
            }else if(result == -4){
                str = '地块未开启';
            }else if(result == -5){
                str = '该地块已种植';
            }else if(result == -6){
                str = '贝壳不足，无法种植';
            }else if(result == -7){
                str = '仓库数量不够';
            }else{
                str = '重新种植';
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
            if(result == -6){
                arr = {
                    content:      str,
                    leftBtnText:  "知道了",
                    leftCallback: function(){},
                    rightBtnText: "去兑换",
                    rightCallback: function(){
                        that.scheduleOnce(function(){
                            if(_ivp.openType == "web"){
                                that.pcRecharge();
                            }else{
                                if(window.__wxjs_environment === 'miniprogram'){
                                    // that.wxRecharge(totalFee, isLottery);
                                    return;
                                }
                                // 手机充值
                                that.phoneRecharge();
                            }
                        }, .5);
                    },
                    centerBtnText: "",
                    centerCallback: function(){}
                };
            }
            var event = new cc.Event.EventCustom('commonPanel', true);
            event.setUserData(arr);
            that.node.dispatchEvent( event );
        });
    },
    pcRecharge(){
        window.parent.postMessage('charge("'+_ivp.roomId+'", "_blank")', '*');
    },
    phoneRecharge: function(){
        var that = this;
        vFlag = vFlagInit();
		if(!vFlag){
            var str = '当前版本过低，请更新至最新版本';
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
			return ;
		}
		var platformCode = _ivp.fromType.substr(0, 2);
        if (platformCode == "12") {
            window.location =  "/onRecharge";
        } else {
            window.android.onRecharge();
        }
	},
    onTouchStart(evt){
        let that = this;
        that.holdClick = true;
        that.holdTimeEclipse = 0;
    },
    onTouchEnd(evt){
        let that = this;
        if(evt.getLocationX() > 600 && evt.getLocationY() > 1000 && that.holdTimeEclipse >= 30){
            that.consoleNode.init();
        }
    },
    onDestroy () {
        let that = this;
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, that.onKeyDown, that);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, that.onKeyUp, that);
    },
    onKeyDown: function (event) {
        let that = this;
        switch(event.keyCode) {
            case cc.macro.KEY.back:
                console.log('Press back key');
                that.node.destroy();
                break;
        }
    },
    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.back:
                console.log('release a key');
                break;
        }
    },
    farmCommonPanel(events){
        let that = this;
        that.showPanel.showPanel(events);
    },
    plantSuccess(events){
        // 种植成功刷新单块地
        console.log("种植成功刷新单块地");
        console.dir(events);
        let that = this;
        let landId = events.landId;
        let tian = that.node.getChildByName("tian");
        let tianNode = tian.children[landId - 1];
        let bgZz = tianNode.getChildByName("bg_zz");
        let seedlings = tianNode.getChildByName("seedlings");
        // let iconCaiji = tianNode.getChildByName("icon_caiji");
        // let spriteBtqp = tianNode.getChildByName("sprite_btqp");
        bgZz.active = true;
        cc.loader.loadRes("crops/0", cc.SpriteFrame, function (err, spriteFrame) {
            seedlings.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            seedlings.active = true;
        });
        // iconCaiji.active = false;
        // spriteBtqp.active = false;
        let _arr = showTianInfo[landId-1];
        _arr.seedSn = events.seedSn;
        _arr.vegeSn = (events.seedSn == 1788 ? 1780 : events.seedSn)-1;
        _arr.landId = landId;
        _arr.status = -2;
        _arr.collect = 0;
        var date = new Date();
        date.setDate(date.getDate() + goodsConfig[events.seedSn].day);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year=date.getFullYear();
        _arr.endTime = year + "-" + month + "-" + day + " 00:00:00";
        showTianInfo[landId-1] = _arr;
    },
    removeLand(events){
        // 铲除
        console.log("铲除", events);
        let that = this;
        let landId = events;
        let tian = that.node.getChildByName("tian");
        let tianNode = tian.children[landId - 1];
        let bgZz = tianNode.getChildByName("bg_zz");
        let seedlings = tianNode.getChildByName("seedlings");
        let iconCaiji = tianNode.getChildByName("icon_caiji");
        let spriteBtqp = tianNode.getChildByName("sprite_btqp");
        bgZz.active = false;
        seedlings.active = false;
        iconCaiji.active = false;
        spriteBtqp.active = false;
        let _arr = showTianInfo[landId-1];
        _arr.seedSn = 0;
        _arr.vegeSn = 0;
        showTianInfo[landId-1] = _arr;
    },
    visitOtherFarm(otherId){
        console.log("回访人的id：", otherId);
        let that = this;
        that.otherId = otherId;
        that._visitRecord.hidePanel();
        that.scheduleOnce(that.getMapOther, .2);
        that._visitRecordBox.active = false;
        that.topExchangeRecord.active = false;
        that.callbackBtn.active = true;
        that.iconDhzx.active = false;
        that.iconJysc.active = false;
    },
    callbackMineFarm(){
        let that = this;
        that.otherId = 0;
        that.scheduleOnce(that.getMap, .2);
        that._visitRecordBox.active = true;
        that.topExchangeRecord.active = true;
        that.callbackBtn.active = false;
        that.iconDhzx.active = true;
        that.iconJysc.active = true;
        that.guideOpenFarm();
    },
    guideOpenFarm(){
        let that = this;
        if(typeof(Storage) !== "undefined" && that.otherId == 0){
            let key = localStorage.getItem("guideLoading_" + _ivp.userId);
            if (key != 1) {
                localStorage.setItem("guideLoading_" + _ivp.userId, 1);
                let guideLoading = cc.instantiate(that.guideLoading);
                // guideLoading.active = false;
                that.node.addChild(guideLoading);
                that._guideLoading = guideLoading.getComponent("guideLoading");
            }
        }
    },
    aboutCommonPanel(events){
        let that = this;
        that._aboutPanel.showPanel(events);
    },
    start () {},
    update (dt) {
        let that = this;
        if(that.holdClick){
            that.holdTimeEclipse++;
        }
    },
});
