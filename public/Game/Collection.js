function Collection(){
    
}

Collection.prototype = new Renderable();

var loadedCollections = [];

Collection.prototype.init = function(renderer, objDataDir, objDataFile){
    this.renderer = renderer;

    this.setColor([1, 1, 1, 1.0]);
    this.scale = 1;
    this.armyId = 1;

    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;

    this.yaw = 0;
    this.pitch = 0;
    this.roll = 0;

    this.dataDir = objDataDir;

    this.objects = [];
    this.materials = [];
    this.loadObjFile(objDataDir, objDataFile);
    this.loadedMtlLibs = [];
}

Collection.prototype.loadObjFile = function(objDataDir, objDataFile){
    var me = this;

    $.ajax(
        {
            url: objDataDir + objDataFile
            , async: false
        }
    ).done(function(data){
        me.raw = data;
        me.load();
    });
}

Collection.prototype.render = function(){
    this.prepareMatrix(this.renderer);
    for(var i in this.objects){
        var object = this.objects[i];
        object.render();
    }
}

Collection.prototype.loadMaterials = function(output){
    var currentMaterial = null, i = 0;
    while (i < output.length)
    {
        var j = output.indexOf("\n", i);
        if (j == -1){
            j = output.length;
         }
        var line = output.substr(i, j-i);
        i = j+1;
        if(line.substr(0, 6) == "newmtl"){
            if(currentMaterial){
                this.materials.push(currentMaterial);
            }
            currentMaterial = {};
            currentMaterial.name = line.split(" ")[1];

        }
        if(line.substr(0, 6) == "map_Kd"){
            currentMaterial.path = line.split(" ")[1];
        }

        i = j+1;
    }
    if(currentMaterial){
        this.materials.push(currentMaterial);
    }

    this.loadingMaterials = false;
}

Collection.prototype.load = function(){
    var output = this.raw, i = 0;
    var currentObject = null;
    var vertices = [];
    var textureVertices = [];
    loadedMtlLibs = [];
    while (i < output.length)
    {
        var j = output.indexOf("\n", i);
        if (j == -1){
            j = output.length;
         }
        var line = output.substr(i, j-i);
        if(line.substr(0, 6) == "mtllib"){
            var mtllib = line.split(" ")[1];
            if(loadedMtlLibs.indexOf(mtllib) === -1)
            {
                loadedMtlLibs.push(mtllib);
                this.loadingMaterials = true;
                var me = this;
                $.ajax(
                {
                    url: this.dataDir + mtllib
                    , async: false
                }
                ).done(function(data){
                    me.loadMaterials(data);
                });
            }
        }

        if(line.substr(0, 2) == "o "){
            if(currentObject){
                currentObject.setColor(this.color);
                this.objects.push(currentObject);
            }

            currentObject = new Renderable();
            currentObject.renderer = this.renderer;

            currentObject.x = 0.0;
            currentObject.y = 0.0;
            currentObject.z = 0.0;

            currentObject.yaw = 0;
            currentObject.pitch = 0;
            currentObject.roll = 0;

            currentObject.scale = 1;

            currentObject.itemSize = 3;
            currentObject.itemNum = 0;

            currentObject.textureSize = 2;
            currentObject.colorNum = 0;
            currentObject.listType = this.renderer.engine.gl.TRIANGLES;

            var values = line.split(" ");
            for(var ind in values){
                var value = values[ind];
                if(value != "o")
                {
                    currentObject.name = value;
                }
            }
        }

        if(line.substr(0, 2) == "v "){
            var values = line.split(" ");
            var point = [];
            for(var ind in values){
                var value = values[ind];
                if(value != "v")
                {
                    point.push(value);
                }
            }
            vertices.push(point);
        }

        if(line.substr(0, 3) == "vt "){
            var values = line.split(" ");
            var point = [];
            for(var ind in values){
                var value = values[ind];
                if(value != "vt")
                {
                    point.push(value);
                }
            }
            textureVertices.push(point);
        }

        if(line.substr(0, 2) == "f "){
            var values = line.split(" ");
            for(var ind in values){
                var value = values[ind];
                if(value != "f")
                {
                    var vert = value.split("/")[0];
                    vert = vert - 1;
                    var point = vertices[vert];
                    for(id in point){
                        currentObject.addVertice(point[id]);
                    }
                    var tex = value.split("/")[1];
                    tex = tex - 1;
                    var point = textureVertices[tex];
                    for(id in point){
                        currentObject.addTextureVertice(point[id]);
                    }
                }                
            }
        }
        if(line.substr(0, 6) == "usemtl"){
            var matname = line.split(" ")[1];
            for(i in this.materials){
                if(this.materials[i].name == matname){
                    currentObject.loadTexture(this.dataDir + this.materials[i].path);
                }
            }
        }

        i = j+1;
    }

    if(currentObject){
        currentObject.initBuffer(this.renderer);
        this.objects.push(currentObject);
    }
}


Collection.prototype.setColor = function(color){
    this.color = color;
    for(id in this.objects){
        this.objects[id].setColor(this.color);
    }
}
