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

Renderable.prototype.addNormal = function(normal){
    if(typeof this.normals !== "object")
    {
        this.normals = [];
    }
    this.normals.push(normal);
    this.normalNum = Math.floor(this.normals.length / 3);
}

Renderable.prototype.handleLoadedTexture = function(texture){
    var gl = this.renderer.engine.gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

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
    var gl = renderer.engine.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(renderer.engine.shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
    gl.vertexAttribPointer(renderer.engine.shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
    gl.vertexAttribPointer(renderer.engine.shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(renderer.engine.shaderProgram.samplerUniform, 0);

    renderer.setMatrixUniforms();
    gl.drawArrays(this.listType, 0, this.vertexPositionBuffer.numItems);
}

Renderable.prototype.initBuffer = function(renderer) {
    this.vertexPositionBuffer = renderer.engine.gl.createBuffer();
    renderer.engine.gl.bindBuffer(renderer.engine.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    renderer.engine.gl.bufferData(renderer.engine.gl.ARRAY_BUFFER, new Float32Array(this.vertices), renderer.engine.gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = this.itemSize;
    this.vertexPositionBuffer.numItems = this.itemNum;
    this.setupTextureArray(renderer);
    this.setupNormalsArray(renderer);
}

Renderable.prototype.setupTextureArray = function(renderer){

    var textureCoords = this.textureVertices;
    this.vertexTextureCoordBuffer = renderer.engine.gl.createBuffer();
    renderer.engine.gl.bindBuffer(renderer.engine.gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);

    renderer.engine.gl.bufferData(renderer.engine.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.renderer.engine.gl.STATIC_DRAW);
    this.vertexTextureCoordBuffer.itemSize = this.textureSize;
    this.vertexTextureCoordBuffer.numItems = this.textureNum;
}

Renderable.prototype.setupNormalsArray = function(renderer){
    var normals = this.normals;
    this.normalsBuffer = renderer.engine.gl.createBuffer();
    renderer.engine.gl.bindBuffer(renderer.engine.gl.ARRAY_BUFFER, this.normalsBuffer);

    renderer.engine.gl.bufferData(renderer.engine.gl.ARRAY_BUFFER, new Float32Array(normals), renderer.engine.gl.STATIC_DRAW);
    this.normalsBuffer.itemSize = 3;
    this.normalsBuffer.numItems = this.normalNum;
}

Renderable.prototype.position = function(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
}

Renderable.prototype.setScale = function(scale){
    this.scale = scale;
}