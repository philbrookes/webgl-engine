function Collection(){
	
}

Collection.prototype = new Renderable();

var loadedCollections = [];

Collection.prototype.init = function(renderer, objDataSrc){
	this.renderer = renderer;

	this.setColor([1, 1, 1, 1.0]);
	this.scale = 1;
	this.armyId = 1;

	this.x = 0.0;
	this.y = 0.0;
	this.z = 0.0;

	this.yaw = 0;
	this.pitch = 0;
	this.roll = 0;

	this.objects = [];

	this.loadObjFile(objDataSrc);
}

Collection.prototype.loadObjFile = function(objDataSrc){
	var me = this;

	$.ajax(
		{
			url: "../Blends/" + objDataSrc
		}
	).done(function(data){
		me.raw = data;
		me.load();
	});
}

Collection.prototype.render = function(){
	this.prepareMatrix(this.renderer);
	for(var i in this.objects){
		var object = this.objects[i];
		object.render();
	}
}

Collection.prototype.load = function(){
	var output = this.raw, i = 0;
	var currentObject = null;
	var vertices = [];
	var textureVertices = [];
	while (i < output.length)
	{
	    var j = output.indexOf("\n", i);
	    if (j == -1){
	    	j = output.length;
	 	}
	    var line = output.substr(i, j-i);
	    
	    if(line.substr(0, 2) == "o "){
	    	if(currentObject){
				currentObject.setColor(this.color);
	    		this.objects.push(currentObject);
	    	}

	    	currentObject = new Renderable();
	    	currentObject.renderer = this.renderer;

			currentObject.x = 0.0;
			currentObject.y = 0.0;
			currentObject.z = 0.0;

			currentObject.yaw = 0;
			currentObject.pitch = 0;
			currentObject.roll = 0;

			currentObject.scale = 1;

			currentObject.itemSize = 3;
			currentObject.itemNum = 0;

			currentObject.colorSize = 4;
			currentObject.colorNum = 0;
			currentObject.listType = this.renderer.engine.gl.TRIANGLE_STRIP;

	    	var values = line.split(" ");
			for(var ind in values){
	    		var value = values[ind];
	    		if(value != "o")
	    		{
	    			currentObject.name = value;
    			}
	    	}
	    }

	    if(line.substr(0, 2) == "v "){
	    	var values = line.split(" ");
	    	var point = [];
	    	for(var ind in values){
	    		var value = values[ind];
	    		if(value != "v")
	    		{
	    			point.push(value);
    			}
	    	}
			vertices.push(point);
	    }

	    if(line.substr(0, 3) == "vt "){
	    	var values = line.split(" ");
	    	var point = [];
	    	for(var ind in values){
	    		var value = values[ind];
	    		if(value != "vt")
	    		{
	    			point.push(value);
    			}
	    	}
			textureVertices.push(point);
	    }
	    

	    if(line.substr(0, 2) == "f "){
	    	var values = line.split(" ");
	    	for(var ind in values){
	    		var value = values[ind];
	    		if(value != "f")
	    		{
	    			value = value.split("/")[0];
	    			value = value - 1;
	    			var point = vertices[value];
	    			for(id in point){
	    				currentObject.addVertice(point[id]);
	    			}
    			}	    		
	    	}
	    }
	    
	    i = j+1;
	}

	if(currentObject){
		currentObject.setColor(this.color);
		this.objects.push(currentObject);
	}
}


Collection.prototype.setColor = function(color){
	this.color = color;
	for(id in this.objects){
		this.objects[id].setColor(this.color);
	}
}
