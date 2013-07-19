function Renderable(){
}

Renderable.prototype.render = function(){
    this.prepareMatrix(this.renderer);
    this.draw(this.renderer);
}

Renderable.prototype.addVertice = function(vertice){
    if(typeof this.vertices !== "object")
    {
        this.vertices = [];
    }
    this.vertices.push(vertice);
    this.itemNum = Math.floor(this.vertices.length / this.itemSize);
    this.colorNum++;
}

Renderable.prototype.prepareMatrix = function(renderer){
    mat4.translate(renderer.mvMatrix, [this.x, this.y, this.z]);
    if(this.pitch % 360){
        mat4.rotate(renderer.mvMatrix, renderer.degToRad(this.pitch), [1, 0, 0]);
    }
    if(this.yaw % 360){
        mat4.rotate(renderer.mvMatrix, renderer.degToRad(this.yaw),   [0, 1, 0]);
    }
    if(this.roll % 360){
        mat4.rotate(renderer.mvMatrix, renderer.degToRad(this.roll),  [0, 0, 1]);
    }
    
    mat4.scale(renderer.mvMatrix, [this.scale, this.scale, this.scale]);
}

Renderable.prototype.draw = function(renderer) {
    renderer.engine.gl.bindBuffer(renderer.engine.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    renderer.engine.gl.vertexAttribPointer(renderer.engine.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, renderer.engine.gl.FLOAT, false, 0, 0);

    renderer.engine.gl.bindBuffer(renderer.engine.gl.ARRAY_BUFFER, this.vertexColorBuffer);
    renderer.engine.gl.vertexAttribPointer(renderer.engine.shaderProgram.vertexColorAttribute, this.vertexColorBuffer.itemSize, renderer.engine.gl.FLOAT, false, 0, 0);

    renderer.setMatrixUniforms();
    renderer.engine.gl.drawArrays(this.listType, 0, this.vertexPositionBuffer.numItems);
}

Renderable.prototype.initBuffer = function(renderer) {
    this.vertexPositionBuffer = renderer.engine.gl.createBuffer();
    renderer.engine.gl.bindBuffer(renderer.engine.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    renderer.engine.gl.bufferData(renderer.engine.gl.ARRAY_BUFFER, new Float32Array(this.vertices), renderer.engine.gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = this.itemSize;
    this.vertexPositionBuffer.numItems = this.itemNum;

    this.vertexColorBuffer = renderer.engine.gl.createBuffer();
    renderer.engine.gl.bindBuffer(renderer.engine.gl.ARRAY_BUFFER, this.vertexColorBuffer);
    renderer.engine.gl.bufferData(renderer.engine.gl.ARRAY_BUFFER, new Float32Array(this.colors), renderer.engine.gl.STATIC_DRAW);
    this.vertexColorBuffer.itemSize = this.colorSize;
    this.vertexColorBuffer.numItems = this.colorNum;
}


Renderable.prototype.setColor = function(color){
    this.color = color;
    this.colors = [];
    for(var i = 0; i < this.colorNum; i++){
        this.colors = this.colors.concat(this.color);
    }
    this.initBuffer(this.renderer);
}


Renderable.prototype.position = function(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
}

Renderable.prototype.setScale = function(scale){
    this.scale = scale;
}