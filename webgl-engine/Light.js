Light = function(){
	this.x = 0;
	this.y = 0;
	this.z = 0;

	this.colour = [0.8, 0.8, 0.8];	
}

Light.prototype.getPositionV = function(){
	return [this.x, this.y, this.z];
}
