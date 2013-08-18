function Crates(renderer){
    this.init(
        renderer
        , "Game/Objects/Crates/"
        , "crates-normals.obj"
    );
}

Crates.prototype = new Collection();

Crates.prototype.process = function(engine){
}
