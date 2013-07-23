function Crates(renderer){
    this.init(
        renderer
        , "Game/objects/Crates/"
        , "Crates.obj"
    );
}

Crates.prototype = new Collection();

Crates.prototype.process = function(engine){
}
