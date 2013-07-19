function Circle(renderer){
	this.x = -1.5;
	this.y = 0.0;
	this.z = -7.0;

	this.itemSize = 3;
	this.itemNum  = 8;
	this.listType = renderer.engine.gl.TRIANGLE_STRIP;
	
	this.vertices = [
		 0.0,  1.0,  0.0,
		 0.0,  0.0,  0.0,
		 0.7,  0.7,  0.0, //1
		 1.0,  0.0,  0.0, //2
		 0.7, -0.7,  0.0, //3
		 0.0, -1.0,  0.0, //4
		-0.7, -0.7,  0.0, //5 
		-1.0,  0.0,  0.0, //6
		-0.7,  0.7,  0.0  //7
	];
}

Circle.prototype = Renderable.prototype;