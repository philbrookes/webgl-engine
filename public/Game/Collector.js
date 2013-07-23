function Collector(renderer){
    this.init(
        renderer
        , "objects/Cottage/"
        , "Cottage.obj"
    );
    this.scale = 1;
    this.speedPerSecond = 10;
    this.target = null;
    //this.setArmyId(1);
    this.hasEnergy = false;
}

Collector.prototype = new Collection();

Collector.prototype.process = function(engine){
    /*if(! this.hasEnergy)
    {
        if(this.target == null || this.target.currentEnergy <= 0 || this.colleagueHasTarget(this.target))
        {
            this.setTarget(this.base.findStarFor(this));
        }
    }
    else
    {
        this.target = this.base;
    }
    this.move();    */
}

Collector.prototype.setArmyId = function(armyId){
    this.armyId = armyId;
    switch(armyId){
        case 1:
            this.setColor([1, 0, 0, 1]);
            break;
        case 2:
            this.setColor([0, 0, 1, 1]);
            break;
        case 3:
            this.setColor([1, 0, 1, 1]);
            break;
    }
}

Collector.prototype.colleagueHasTarget = function(target){
    var colleagues = this.base.getUnits();
    for(id in colleagues){
        var collector = colleagues[id];
        if(target == collector.target && collector != this){
            return true;
        }
    }
    return false;
}

Collector.prototype.move = function(){
    var tx = this.target.x - this.x;
    var ty = this.target.y - this.y;
    var tz = this.target.z - this.z;

    var myPoint = {
        x: this.x, 
        y: this.y, 
        z: this.z
    };
    var thatPoint = {
        x: this.target.x, 
        y: this.target.y, 
        z: this.target.z
    };

    var dist = engine.distance(myPoint, thatPoint);

    if(dist > (this.speedPerSecond * (this.renderer.timeElapsed/1000))){
        var velX = (tx/dist) * (this.speedPerSecond * (this.renderer.timeElapsed/1000));
        var velY = (ty/dist) * (this.speedPerSecond * (this.renderer.timeElapsed/1000));
        var velZ = (tz/dist) * (this.speedPerSecond * (this.renderer.timeElapsed/1000));

        this.x += velX;
        this.y += velY;
        this.z += velZ;
    } else {
        this.x = this.target.x;
        this.y = this.target.y;
        this.z = this.target.z;
        this.arrived();
    }
}

Collector.prototype.arrived = function(){
    if(typeof this.target.setEnergy == "function"){
        this.target.setEnergy(0);
        this.hasEnergy = true;
    } else {
        this.hasEnergy = false;
    }
        
}

Collector.prototype.setTarget = function(item){
    this.target = item;
}
