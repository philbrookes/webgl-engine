function Engine(canvasId){
    this.canvas = document.getElementById("canvas");
    this.initGL();
    this.initShaders();

    this.items = [];

    this.objects = [];

    this.renderer = new Renderer(this);    
}

Engine.prototype.initGL = function(){
    this.gl = this.canvas.getContext("experimental-webgl");
    this.gl.viewportWidth = this.canvas.width;
    this.gl.viewportHeight = this.canvas.height;

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
}

Engine.prototype.getShader = function(shaderId){
    var shaderScript = document.getElementById(shaderId);
    if(!shaderScript){
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while(k) {
        if(k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;

    if(shaderScript.type == "x-shader/x-fragment") {
        shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    } else if (shaderScript .type == "x-shader/x-vertex") {
        shader = this.gl.createShader(this.gl.VERTEX_SHADER);
    } else {
        return null;
    }

    this.gl.shaderSource(shader, str);
    this.gl.compileShader(shader);

    if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
        console.log(this.gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

Engine.prototype.initShaders = function(){
    this.fragmentShader = this.getShader("shader-fs");
    this.vertexShader = this.getShader("shader-vs");

    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, this.vertexShader);
    this.gl.attachShader(this.shaderProgram, this.fragmentShader);
    this.gl.linkProgram(this.shaderProgram);

    if(!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)){
        console.log("Could not initialise shaders");
    }

    this.gl.useProgram(this.shaderProgram);

    this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

    this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
    this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

    this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");                
    this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

Engine.prototype.process = function(){
    var items = this.getItems();

    for(var i in items){
        item = items[i];
        if(typeof item.process != "function"){
            continue;
        }
        item.process(this);
    }
}

Engine.prototype.addItem = function(item){
    this.items.push(item);
}

Engine.prototype.getItems = function(){
    return this.items;
}

Engine.prototype.getCloseItems = function(point, range){
    var ret = [];
    for(i in this.items){
        var item = this.items[i];
        if( Math.abs(item.x - point.x) > range
            && Math.abs(item.y - point.y) > range
            && Math.abs(item.z - point.z) > range
        ){
            ret.append(item);
        }
    }
    return ret;
}

Engine.prototype.removeItem = function(item){
    var index = this.items.indexOf(item);
    if(index != -1)
    {
        this.items.splice(index, 1);
    }
}

Engine.prototype.removeItems = function(){
    this.items = [];
}

Engine.prototype.distance = function(point1, point2){
    var xDiff = Math.abs(point1.x - point2.x);
    var yDiff = Math.abs(point1.y - point2.y);
    var zDiff = Math.abs(point1.z - point2.z);

    var xyDiff = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
    var xyzDiff = Math.sqrt((xyDiff * xyDiff) + (zDiff * zDiff));

    return xyzDiff;
}

Engine.prototype.loadObject = function(path){
    if(this.objects[path]){
        return this.objects[path];
    }

    $.ajax({
        url: "../Blends/Base/Base.obj"
    }).done(
        function(data){
            console.log(data);
        }
    );
}