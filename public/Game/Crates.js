function Crates(renderer){
    this.init(
        renderer
        , "Game/objects/Crates/"
        , "crates-normals.obj"
    );
}

Crates.prototype = new Collection();

Crates.prototype.process = function(engine){
	this.yaw += (0.01 * engine.renderer.timeElapsed);
}
