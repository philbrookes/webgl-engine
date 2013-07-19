function Galaxy(engine){
	this.numStars = 2500;
	this.radius = 500;
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.stars = [];
}

Galaxy.prototype.initStars = function(engine){
	var i;
	for(i =0; i < this.numStars; i++){
		var angle = Math.floor(Math.random()*36001);
		angle = angle / 100;
		var radius = Math.floor(Math.random() * (this.radius+1));
		var x = this.x + radius * Math.sin(angle)
		var z = this.z + radius * Math.cos(angle);

		var factor = Math.sqrt(radius);
		factor = Math.sqrt(this.radius - 100) - factor;
		var y = Math.floor(Math.random()* ((factor * 2)+1) )  - factor;

		x = x / 25;
		z = z / 25;
		y = y / 10;

		x += this.x;
		y += this.y;
		z += this.z;

		var perc = (radius / this.radius) * 100;
		var color = [1, 1, (100-perc)/100, 1.0];
		var scale = (0.1 + (100-perc)/100)/5;
		this.addStar(x, y, z, color, scale);
	}
}


Galaxy.prototype.addStar = function(x, y, z, color, scale){
	var star = new Star(engine.renderer);
	star.position(x, y, z);
	star.setColor(color);
	star.setScale(scale);
	this.stars.push(star);
	engine.addItem(star);
}

Galaxy.prototype.addBase = function(armyId){
	var base = new Base(this, engine.renderer);
	var angle = Math.floor(Math.random() * 54001);
	angle = angle / 100;

	var radius = 500;

	var x = this.x + radius * Math.sin(angle)
	var z = this.z + radius * Math.cos(angle);

	var factor = Math.sqrt(radius);
	factor = Math.sqrt(this.radius - 100) - factor;
	var y = 0; //Math.floor(Math.random()* ((factor * 2)+1) )  - factor;

	x = x / 25;
	z = z / 25;
	y = y / 10;

	x += this.x;
	y += this.y;
	z += this.z;

	base.x = x;
	base.y = y;
	base.x = x;
	base.setArmyId(armyId);
	base.mapGalaxy();
	base.yaw = Math.floor(Math.random()*361);
	engine.addItem(base);
	return base;
}