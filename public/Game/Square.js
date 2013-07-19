function Square(renderer){
	this.x = 1.5;
	this.y = 0.0;
	this.z = -7.0;

	this.itemSize = 3;
	this.itemNum  = 4;
	this.listType = renderer.engine.gl.TRIANGLE_STRIP;
	
	this.vertices = [
		 1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0,
		 1.0, -1.0,  0.0,
		-1.0, -1.0,  0.0
	];
}

Square.prototype = Renderable.prototype;