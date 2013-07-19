function Star(renderer){
	this.init(
		renderer
		, "Star/Star.obj"
	);

	this.totalEnergy = 1;
	this.currentEnergy = 1;
	this.rechargeTime = 300;
}

Star.prototype = new Collection();

Star.prototype.setEnergy = function(energy){
	var me = this;
	var originalColor = this.color;
	this.currentEnergy = energy;
	if(this.currentEnergy <= 0){
		this.currentEnergy = 0;
		this.setColor([.2, .2, .2, 1]);
		setTimeout(function(){
			me.setEnergy(this.totalEnergy);
			me.setColor(originalColor);
		}
		, this.rechargeTime * 1000);
	}
}