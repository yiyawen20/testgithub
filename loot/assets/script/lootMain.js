const pool = require("pool");
const appRequest = require("network");
cc.Class({
    extends: cc.Component,

    properties: {
        lootMain: {
            default: null,
            type: cc.Node
        },
        lootCar: {
            default: null,
            type: cc.Prefab
        },
        commonPanel: {
            default: null,
            type: cc.Prefab
        },
        PermanentNode: {
            default: null,
            type: cc.Prefab
        }
    },
    onLoad () {
        let that = this;
        clientEvent.init();

        pool.createPrefabPool(that.lootCar);
        let lootCarMain = pool.getPrefab(that.lootCar.name);
        that.lootCarMain = lootCarMain;
        lootCarMain.x = -320;
        lootCarMain.y = 8;
        // lootCarMain.active = false;
        that.lootMain.addChild(lootCarMain);
        let futou1 = lootCarMain.getChildByName("futou1");
        futou1.y = -40;
        futou1.x = 80;

        lootCarMain.on("touchend", that.cutLoot, that);

        lootCarMain.getChildByName("car").active = true;
        let callback = cc.callFunc(that.goEnd, that);
        let seq = cc.sequence(cc.moveBy(0, cc.v2(0, 0)), cc.moveBy(60, cc.v2(640, 0)), callback);
        lootCarMain.runAction(seq);
    },
    goEnd(){
        cc.log("走到尽头回调！");
        let that = this;
        let lootCarMain = that.lootCarMain;
        let car = lootCarMain.getChildByName("car");
        car.active = false;
        car.getComponent(cc.Animation).pause();
        let lootEnd = lootCarMain.getChildByName("carEnd");
        lootEnd.active = true;
        let carEnd = lootEnd.getComponent(cc.Animation).play();
        console.dir(carEnd);
        that.scheduleOnce(function() {
            console.log("砍镖结束");
        }, 2.2);
    },
    cutLoot(){
        let jampH = Math.random()*20;
        let that = this;
        let lootCarMain = that.lootCarMain;
        var seq = cc.sequence(cc.moveBy(.2, 0, jampH), cc.moveBy(.2, 0, -jampH));
        lootCarMain.runAction(seq);
        let car = lootCarMain.getChildByName("car").getComponent(cc.Animation);
        // car.pause();
        var carState = car.play();
        console.dir(carState);

        let _ram = Math.random();
        let feng1 = lootCarMain.getChildByName("feng1");
        let feng2 = lootCarMain.getChildByName("feng2");
        let blow = lootCarMain.getChildByName("blow");
        let blowAnim = blow.getComponent(cc.Animation);
        let daoShadow = lootCarMain.getChildByName("dao_shadow");
        daoShadow.scale = 0.5;
        let daoShadowAnim = daoShadow.getComponent(cc.Animation);
        let futou1 = lootCarMain.getChildByName("futou1");
        // let _daoShadow = cc.instantiate(daoShadow);
        // _daoShadow.scale = 0.5;
        // let _daoShadowAnim = _daoShadow.getComponent(cc.Animation);
        // lootCarMain.addChild(_daoShadow);
        let _blow = cc.instantiate(blow);
        // _blow.opacity = 250;
        // _blow.x = 0;
        _blow.y = _ram*70*addSub();
        lootCarMain.addChild(_blow);
        let _blowAnim = _blow.getComponent(cc.Animation);
        let _futou = cc.instantiate(futou1);
        lootCarMain.addChild(_futou);
        cc.tween(_futou)
            .to(.05, {angle: -60, scale: 1, position: cc.v2(50, 40)})
            .call(function(){
                daoShadow.active = true;
                daoShadowAnim.resume();
                daoShadowAnim.play();
                if(_ram > .4){feng2.active = true;}else{feng1.active = true;}
            })
            .to(.1, {angle: 60, position: cc.v2(-25, -20)})
            .call(function(){
                _blow.active = true;
                _blowAnim.resume();
                _blowAnim.play();
                // 掉落
                that.thingFall();
            })
            .to(.1, {angle: 120, position: cc.v2(-25, -20)})
            .to(.1, {angle: 180, position: cc.v2(25, -20), opacity: 0})
            .call(function(){
                daoShadow.active = false;
                daoShadowAnim.stop();
                daoShadowAnim.resume();
                if(_ram > .4){feng2.active = false;}else{feng1.active = false;}
            })
            .to(.1, {angle: 0, scale: .6, position: cc.v2(0, 0)})
            .call(function(){
                _futou.destroy();
                _blow.destroy();
            })
            .start();
    },
    thingFall(){
        let that = this;
        let lootCarMain = that.lootCarMain;
        let gold = lootCarMain.getChildByName("gold")
        let _ram = Math.random();
        let _gold = cc.instantiate(gold);
        _gold.active = true;
        _gold.x = _ram * 30 * addSub();
        let _goldAnim = _gold.getComponent(cc.Animation);
        lootCarMain.addChild(_gold);
        _goldAnim.play();
        _goldAnim.on('finished', that.onFinished, _gold);

        // 血条
        let blood = lootCarMain.getChildByName("blood").getChildByName("loading");
        blood.width = 60;

        let lootCarClass = lootCarMain.getComponent("lootCar");
        if(_ram < .1){
            lootCarClass.fly();
        }else if(_ram >= .1 && _ram < .2){
            lootCarClass.seal();
        }else if(_ram >= .2 && _ram < .3){
            lootCarClass.dodge();
        }else if(_ram >= .3 && _ram < .4){
            lootCarClass.ache();
        }else if(_ram >= .4 && _ram < .5){
            lootCarClass.crti();
        }else{
            lootCarClass.currency();
        }
    },
    onFinished(){
        this.destroy();
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
    start () {},
    update (dt) {
        let that = this;
        if(that.holdClick){
            that.holdTimeEclipse++;
        }
    },
});
