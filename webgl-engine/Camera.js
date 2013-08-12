function Camera(){
    // [PITCH, YAW, ROLL]
    this.yaw = 0;
    this.pitch = 0;
    this.roll = 0;

    this.panSpeed=50;
}

Camera.prototype.position = function(renderer){
    this.processPanning(renderer);
    mat4.translate(renderer.mvMatrix, [-this.x, -this.y, -this.z]);
    mat4.lookAt([this.x, this.y, this.z], [this.focusX, this.focusY, this.focusZ], [0, 1, 0], renderer.mvMatrix);
}

Camera.prototype.rotate = function(renderer){

    
    mat4.translate(renderer.mvMatrix, [this.focusX, this.focusY, this.focusZ]);    

    mat4.rotate(renderer.mvMatrix, -renderer.degToRad(this.pitch), [1, 0, 0]);
    mat4.rotate(renderer.mvMatrix, -renderer.degToRad(this.yaw),   [0, 1, 0]);
    mat4.rotate(renderer.mvMatrix, -renderer.degToRad(this.roll),  [0, 0, 1]);

    mat4.translate(renderer.mvMatrix, [-this.focusX, -this.focusY, -this.focusZ]);

}

Camera.prototype.lookAt = function(x, y, z){
    this.focusX = x;
    this.focusY = y;
    this.focusZ = z;
    this.panTo(x, y, z);
}

Camera.prototype.panTo = function(x, y, z){
    this.targetFocusX = x;
    this.targetFocusY = y;
    this.targetFocusZ = z;
}

Camera.prototype.processPanning = function(renderer){
    if(this.targetFocusX == this.focusX && this.targetFocusY == this.focusY && this.targetFocusZ == this.focusZ){
        return;
    }
    var tx = this.targetFocusX - this.focusX;
    var ty = this.targetFocusY - this.focusY;
    var tz = this.targetFocusZ - this.focusZ;

    var myPoint = {
        x: this.focusX, 
        y: this.focusY, 
        z: this.focusZ
    };
    var thatPoint = {
        x: this.targetFocusX, 
        y: this.targetFocusY, 
        z: this.targetFocusZ
    };

    var dist = engine.distance(myPoint, thatPoint);

    if(dist > (this.panSpeed * (renderer.timeElapsed/1000))){
        var velX = (tx/dist) * (this.panSpeed * (renderer.timeElapsed/1000));
        var velY = (ty/dist) * (this.panSpeed * (renderer.timeElapsed/1000));
        var velZ = (tz/dist) * (this.panSpeed * (renderer.timeElapsed/1000));

        this.focusX += velX;
        this.focusY += velY;
        this.focusZ += velZ;
    } else {
        this.focusX = this.targetFocusX;
        this.focusY = this.targetFocusY;
        this.focusZ = this.targetFocusZ;
    }
}