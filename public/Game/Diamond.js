function Diamond(){
}

Diamond.prototype = new Renderable();

Diamond.prototype.init = function(renderer){
	this.renderer = renderer;

	this.x = 0.0;
	this.y = 0.0;
	this.z = 0.0;

	this.yaw = 0;
	this.pitch = 0;
	this.roll = 0;

	this.scale = 1;

	this.itemSize = 3;
	this.itemNum  = 24;
	this.listType = renderer.engine.gl.TRIANGLES;

	this.vertices = [
		//top-front
		 0.0,  0.1,  0.0,
		-0.1,  0.0, -0.1,
		 0.1,  0.0, -0.1,
		 //top-left
		 0.0,  0.1,  0.0,
		-0.1,  0.0,  0.1,
		-0.1,  0.0, -0.1,
		//top-back
		 0.0,  0.1,  0.0,
		 0.1,  0.0,  0.1,
		-0.1,  0.0,  0.1,
		//top-right
		 0.0,  0.1,  0.0,
		 0.1,  0.0, -0.1,
		 0.1,  0.0,  0.1,
		 //bottom-front
		 0.0,  -0.1,  0.0,
		-0.1,  0.0, -0.1,
		 0.1,  0.0, -0.1,
		 //bottom-left
		 0.0,  -0.1,  0.0,
		-0.1,  0.0,  0.1,
		-0.1,  0.0, -0.1,
		//bottom-back
		 0.0,  -0.1,  0.0,
		 0.1,  0.0,  0.1,
		-0.1,  0.0,  0.1,
		//bottom-right
		 0.0,  -0.1,  0.0,
		 0.1,  0.0, -0.1,
		 0.1,  0.0,  0.1
	];

	this.colorSize = 4;
	this.colorNum  = 24;
	this.color = [1, 1, 0, 1.0];
	
	this.setColor(this.color);
}

Diamond.prototype.process = function(engine){

}