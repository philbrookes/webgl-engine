function Crates(renderer){
    this.init(
        renderer
        , "objects/Crates/"
        , "Crates.obj"
    );
}

Crates.prototype = new Collection();

Crates.prototype.process = function(engine){
}
