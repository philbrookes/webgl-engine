function Renderer(Engine) {
    this.engine = Engine;
    this.mvMatrix = mat4.create();
    this.matrixStack = [];
    this.pMatrix = mat4.create();
    this.elapsedTime = 0;
    this.prepareLighting();
    this.camera = new Camera();

    this.lightingUpwards = false;
    this.ly = 5;
}

Renderer.prototype.pushMatrix = function(){
    var pushable = mat4.create(this.mvMatrix);
    this.matrixStack.push(pushable);
}

Renderer.prototype.popMatrix = function(){
    if(this.matrixStack.length == 0) {
        throw "Error no poppable matrix";
    }
    this.mvMatrix = this.matrixStack.pop();
}


Renderer.prototype.setMatrixUniforms = function(){
    this.engine.gl.uniformMatrix4fv(this.engine.shaderProgram.pMatrixUniform, false, this.pMatrix);
    this.engine.gl.uniformMatrix4fv(this.engine.shaderProgram.mvMatrixUniform, false, this.mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(this.mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    this.engine.gl.uniformMatrix3fv(this.engine.shaderProgram.nMatrixUniform, false, normalMatrix);
}

Renderer.prototype.render = function(){
    if(!this.mvMatrix)
    {
        requestAnimationFrame(this.render);
        return;
    }
    this.engine.gl.viewport(0, 0, this.engine.gl.viewportWidth, this.engine.gl.viewportHeight);
    this.engine.gl.clear(this.engine.gl.COLOR_BUFFER_BIT | this.engine.gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, this.engine.gl.viewportWidth / this.engine.gl.viewportHeight, 0.1, 10000.0, this.pMatrix);

    mat4.identity(this.mvMatrix);

    this.pushMatrix();

    //camera
    this.camera.position(this);
    this.camera.rotate(this);

    var items = this.engine.getItems();
    for(i in items) {
        var item = items[i];
        if(!item instanceof Renderable){
            continue;
        }
        this.pushMatrix();
        item.render();
        this.popMatrix();
    }
    this.prepareLighting();
    this.popMatrix();    
}

Renderer.prototype.degToRad = function(degrees) {
    return degrees * Math.PI / 180;
}

Renderer.prototype.prepareLighting = function() {
    //ambient lighting
    this.engine.gl.uniform3f(this.engine.shaderProgram.ambientColorUniform, 0, 0, 0);

    //point lighting
    var alp = vec3.create();
    vec3.normalize([0, 0, 0], alp);
    //mat4.multiplyVec3(this.mvMatrix, alp);
    this.engine.gl.uniform3fv(this.engine.shaderProgram.pointLightingLocationUniform, alp);
    this.engine.gl.uniform3f(this.engine.shaderProgram.pointLightingColorUniform, 0.8, 0.8, 0.8);
}