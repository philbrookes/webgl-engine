function Renderer(Engine) {
    this.engine = Engine;
    this.mvMatrix = mat4.create();
    this.matrixStack = [];
    this.pMatrix = mat4.create();
    this.elapsedTime = 0;
    this.camera = new Camera();
}

Renderer.prototype.pushMatrix = function(){
    var pushable = mat4.create(this.mvMatrix);
    this.matrixStack.push(pushable);
}

Renderer.prototype.popMatrix = function(){
    if(this.matrixStack.length == 0) {
        throw "Error no popable matrix";
    }
    this.mvMatrix = this.matrixStack.pop();
}


Renderer.prototype.setMatrixUniforms = function(){
    this.engine.gl.uniformMatrix4fv(this.engine.shaderProgram.pMatrixUniform, false, this.pMatrix);
    this.engine.gl.uniformMatrix4fv(this.engine.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
}

Renderer.prototype.render = function(){
    if(!this.mvMatrix)
    {
        requestAnimationFrame(this.render);
        return;
    }
    this.engine.gl.viewport(0, 0, this.engine.gl.viewportWidth, this.engine.gl.viewportHeight);
    this.engine.gl.clearColor(0.5, 0.5, 0.5, 1);
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

    this.popMatrix();
}

Renderer.prototype.degToRad = function(degrees) {
        return degrees * Math.PI / 180;
    }