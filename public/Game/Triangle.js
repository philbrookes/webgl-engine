function Triangle(renderer){
	this.x = -1.5;
	this.y = 0.0;
	this.z = -7.0;

	this.yaw = 0;
	this.pitch = 0;
	this.roll = 0;

	this.itemSize = 3;
	this.itemNum  = 3;
	this.listType = renderer.engine.gl.TRIANGLES;

	this.vertices = [
		 0.0,  1.0,  0.0,
		-1.0, -1.0,  0.0,
		 1.0, -1.0,  0.0,
	];

	this.colorSize = 4;
	this.colorNum  = 3;

	this.colors = [
		1, 0, 0, 1.0,
        0, 1, 0, 1.0,
        0, 0, 1, 1.0
	];
	this.initBuffer(renderer);
}

Triangle.prototype = Renderable.prototype;


Triangle.prototype.process = function(engine){

}

Triangle.prototype.render = function(renderer){
	
	this.prepareMatrix(renderer);

	if(this.backwards)
	{
		this.yaw -= (90 * renderer.timeElapsed) / 1000.0;
	}else{
		this.yaw += (120 * renderer.timeElapsed) / 1000.0;
	}

	this.draw(renderer);
	
}