function Base(galaxy, renderer){
	this.init(
		renderer
		, "Base/Base.obj"
	);
	this.scale = .2;
	this.units = [];
	this.galaxy = galaxy;

	this.starMap = [];
}
Base.prototype = new Collection();

Base.prototype.mapGalaxy = function(){
	var stars = this.galaxy.stars;

	for( id in stars){
		var star = stars[id];
		var mappedStar = {};
		mappedStar.range = engine.distance(this, star);
		mappedStar.star = star;
		this.starMap.push(mappedStar);
	}
}

Base.prototype.findStarFor = function(collector){
	var range = 999999, target = null;
	var mappedStars = this.starMap;
	for(id in mappedStars){
		var mappedStar = mappedStars[id];
		if( typeof mappedStar.star.setEnergy != "function" || mappedStar.star.currentEnergy <= 0)
		{
			continue;
		}
	
		if(collector.colleagueHasTarget(mappedStar.star)){
			continue;
		}

		if(mappedStar.range < range){
			range = mappedStar.range;
			target = mappedStar.star;
		}
	}

	return target;
}

Base.prototype.setArmyId = function(armyId){
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

Base.prototype.addCollector = function(){
	var collector = new Collector(this);
	collector.position(this.x, this.y+1, this.z);
	collector.setArmyId(this.armyId);

	this.addUnit(collector);

	return collector;
}

Base.prototype.addUnit = function(unit){
	this.units.push(unit);
	engine.addItem(unit);
}


Base.prototype.getUnits = function(){
	return this.units;
}

Base.prototype.removeUnit = function(item){
	var index = this.units.indexOf(item);
	if(index != -1)
	{
		this.units.splice(index, 1);
		engine.removeItem(item);
	}
}

Base.prototype.removeUnits = function(){
	for(id in this.units){
		engine.removeItem(this.units[id]);
	}
	this.units = [];
}
