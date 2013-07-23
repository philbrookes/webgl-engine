function UI(engine){
	this.engine = engine;

	var me = this;

    $(this.engine.canvas).mousedown(function(event){
    	me.handleMouseDown(event);
	});
    $(document).mouseup(function(event){ me.handleMouseUp(event); });
    $(document).mousemove(function(event){ me.handleMouseMove(event); });
    $(this.engine.canvas).bind("mousewheel", function(event){ me.handleZoom(event); });

    this.mouseDown = false;
	this.lastMouseX = null;
	this.lastMouseY = null;
}

UI.prototype.handleMouseDown = function(event) {
    this.mouseDown = true;
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
    $(engine.canvas).css({cursor: "none"});
}

UI.prototype.handleMouseUp = function(event) {
    this.mouseDown = false;
    $(engine.canvas).css("cursor", "pointer");
}

UI.prototype.handleMouseMove = function(event) {
    if (!this.mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - this.lastMouseX;
    this.engine.renderer.camera.yaw += deltaX;

    var deltaY = newY - this.lastMouseY;
    this.engine.renderer.camera.pitch -= deltaY;
    this.lastMouseX = newX
    this.lastMouseY = newY;
}

UI.prototype.handleZoom = function(event){
    if(event.originalEvent.wheelDelta > 0){
        this.engine.renderer.camera.z -= 5;
        if(this.engine.renderer.camera.z < this.engine.renderer.camera.focusZ + 15.0){
            this.engine.renderer.camera.z = this.engine.renderer.camera.focusZ + 15.0;
        }
    } else {
        this.engine.renderer.camera.z += 5;
        if(this.engine.renderer.camera.z > this.engine.renderer.camera.focusZ + 215.0){
            this.engine.renderer.camera.z = this.engine.renderer.camera.focusZ + 215.0;
        }
    }

    return false;
}