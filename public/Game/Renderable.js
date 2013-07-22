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
}

Renderable.prototype.addTextureVertice = function(vertice){
    if(typeof this.textureVertices !== "object")
    {
        this.textureVertices = [];
    }
    this.textureVertices.push(vertice);
    this.textureNum = Math.floor(this.textureVertices.length / this.textureSize);
}

Renderable.prototype.handleLoadedTexture = function(texture){
    var gl = this.renderer.engine.gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

Renderable.prototype.loadTexture = function(Texture){
    this.texture = this.renderer.engine.gl.createTexture();
    this.texture.image = new Image();
    var me = this;
    this.texture.image.onload = function(){
        me.handleLoadedTexture(me.texture);
    }
    this.texture.image.src = Texture;
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


    renderer.engine.gl.bindBuffer(renderer.engine.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    renderer.engine.gl.vertexAttribPointer(renderer.engine.shaderProgram.textureCoordAttribute, this.cubeVertexTextureCoordBuffer.itemSize, renderer.engine.gl.FLOAT, false, 0, 0);

    renderer.engine.gl.activeTexture(renderer.engine.gl.TEXTURE0);
    renderer.engine.gl.bindTexture(renderer.engine.gl.TEXTURE_2D, this.texture);
    renderer.engine.gl.uniform1i(renderer.engine.shaderProgram.samplerUniform, 0);

    renderer.setMatrixUniforms();
    renderer.engine.gl.drawArrays(this.listType, 0, this.vertexPositionBuffer.numItems);
}

Renderable.prototype.initBuffer = function(renderer) {
    this.setupTextureArray(renderer);
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

Renderable.prototype.setupTextureArray = function(renderer){
    var textureCoords = this.textureVertices;
    this.cubeVertexTextureCoordBuffer = renderer.engine.gl.createBuffer();
    renderer.engine.gl.bindBuffer(renderer.engine.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);

    renderer.engine.gl.bufferData(renderer.engine.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.renderer.engine.gl.STATIC_DRAW);
    this.cubeVertexTextureCoordBuffer.itemSize = this.textureSize;
    this.cubeVertexTextureCoordBuffer.numItems = this.textureNum;
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