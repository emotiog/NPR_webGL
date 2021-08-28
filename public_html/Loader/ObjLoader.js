
var ON_STATE    = 
        {
            NO_READ: 0,
            ON_READ: 1,
            ON_LOADED: 2
        };

// obj object
var OBJ  = function (_rFileName)
{
    this.mState         = ON_STATE.NO_READ;
    this.mFileName      = _rFileName;
    this.mFilePath      = _rFileName;
    
    this.mMtls       = new Array(0);
    this.mGroupFace  = new Array(0);
    
    this.mVertices   = new Array(0);
    this.mNormals    = new Array(0);
    this.mTextures   = new Array(0);
};


OBJ.prototype.isMTL = function()
{
    if(this.mMtls.length === 0)
    {
        return false;
    }
    
    return true;
};


OBJ.prototype.convertforWebGL   = function( _faceID)
{
    var capacity   = this.mGroupFace[_faceID].mFaceIndex;
    
    var vertexArray = new Float32Array(capacity *3);
    var normalArray = new Float32Array(capacity *3);
    var colorArray  = new Float32Array(capacity *4);
    var textureArray= new Float32Array(capacity *2);
    var indicesArray= new Uint16Array (capacity);

    var webGLindex  = 0;
    var curGroupFace    = this.mGroupFace[_faceID];

    for(var faceIdx = 0 ; faceIdx < curGroupFace.mFace.length ; faceIdx ++)
    {
        var face        = curGroupFace.mFace[faceIdx];
        var color       = this._getColor(face.mName);
        var VindicesCapacity    = face.mVindices.length;

        for(var row = 0 ; row < VindicesCapacity ; row ++)
        {
            indicesArray[webGLindex]    = webGLindex;

            var vIndices    = face.mVindices[row];
            var vertices    = this.mVertices[vIndices];

            vertexArray[webGLindex *3 + 0]   = vertices.x;
            vertexArray[webGLindex *3 + 1]   = vertices.y;
            vertexArray[webGLindex *3 + 2]   = vertices.z;

            colorArray[webGLindex *4 + 0]      = color.x;
            colorArray[webGLindex *4 + 1]      = color.y;
            colorArray[webGLindex *4 + 2]      = color.z;
            colorArray[webGLindex *4 + 3]      = color.w;

            var tIndices    = face.mTindices[row];
            var texture     = this.mTextures[tIndices];

            textureArray[webGLindex *2 +0]     = texture.s;
            textureArray[webGLindex *2 +1]     = texture.t;


            var nIndices    = face.mNindices[row];    
            var normal      = this.mNormals[nIndices];

            normalArray[webGLindex *3 +0]  = normal.x;
            normalArray[webGLindex *3 +1]  = normal.y;
            normalArray[webGLindex *3 +2]  = normal.z;

            webGLindex++;
        }
    }
   
    return new DrawInfo(vertexArray, textureArray, normalArray, colorArray, indicesArray);
};


OBJ.prototype._parse    = function (fileString)
{
    var lines   = fileString.split('\n');
    
    lines.push(null);
    
    var index   = 0;
    var curGroupFace    = null;
    var curMaterialName   = null;
    
    var curLine         = null;
    var stringParser    = new StringParser();
    
    while(true)
    {
        curLine = lines[index++];
        
        if(curLine === null)
            break;
        
        stringParser._initialize(curLine);
        
        var command = stringParser.getUnitWord();
        
        if( command === null)
            continue;
    
        
        
        switch(command)
        {
            case '#':
                continue;
                
            case 'mtllib':
                var path    = this._parseMtlLibName(stringParser, this.mFilePath);
                
                loadMTL(this.mMtls, path);
                continue;
                
            case 'o':
            case 'g':
                //var object  = this._parseObjectName(stringParser);
                //this.mGroupFace.push(object);
                //curGroupFace    = object;
                continue;
                
            case 'v':
                var vtx     = this._getVector3D(stringParser);
                this.mVertices.push(vtx);
                continue;
                
            case 'vn':
                var normal  = this._getVector3D(stringParser);
                this.mNormals.push(normal);
                continue;
                
            case 'vt':
                var texture = this._getVector2D(stringParser);
                this.mTextures.push(texture);
                continue;
                
            case 'usemtl':
                var object  = this._parseObjectName(stringParser);
                this.mGroupFace.push(object);
                curGroupFace    = object;
                curMaterialName = this._parseUnitWord(stringParser);
                continue;
                
            case 'f':
                if(curGroupFace === null)
                {
                    curGroupFace    = new GroupFace('default');
                    this.mGroupFace.push(curGroupFace);
                }
                var face = this._parseFace(stringParser, curMaterialName);
                curGroupFace.addFace(face);
                continue;
        };
    }
    
    return true;
};


OBJ.prototype._parseObjectName    = function(parser)
{
    var name = parser.getUnitWord();
    return (new GroupFace(name));
};


OBJ.prototype._parseUnitWord        = function(parser)
{
    return parser.getUnitWord();
};


OBJ.prototype._parseMtlLibName  = function(parser, fileName)
{
    var index   = fileName.lastIndexOf("/");
    var dirPath = "";
    
    if(index > 0)
        dirPath = fileName.substr(0, index +1);
    
    return dirPath + parser.getUnitWord();
};


OBJ.prototype.isNormal  = function()
{
    var end     = this.mGroupFace.length;
    
    for(var index = 0 ; index < end ; index++)
    {
        var curGroupFace    = this.mGroupFace[index]; 
        var capacity   = curGroupFace.mFace.length; 
        
        for(var faceIdx = 0 ; faceIdx < capacity ; faceIdx ++)
        {
            var face                = curGroupFace.mFace[faceIdx];
            
            if(face.mNindices.length > 0)
                return true;
        }
    }
    
    return false;
};


OBJ.prototype.createNormalVectorByFace    = function()
{
    var nIdx    = 0;
    var end     = this.mGroupFace.length;
    
    for(var index = 0 ; index < end ; index++)
    {
        var curGroupFace    = this.mGroupFace[index];
        var capacity   = curGroupFace.mFace.length;                   
        
        for(var faceIdx = 0 ; faceIdx < capacity ; faceIdx ++)
        {
            var face                = curGroupFace.mFace[faceIdx];
            
            var vi_1    = face.mVindices[0];
            var vi_2    = face.mVindices[1];
            var vi_3    = face.mVindices[2];

            var vertices    = this.mVertices[vi_1];
            var p1          = this.mVertices[vi_2];
            var p2          = this.mVertices[vi_3];

            var newNormal   = vertices.getNormalVector(p1, p2);

            this.mNormals.push(newNormal);

            // face에 3개의 면에다 같은 indices 삽입
            face.mNindices.push(nIdx);
            face.mNindices.push(nIdx);
            face.mNindices.push(nIdx++);
        }
    }
};



OBJ.prototype._getVector3D          = function(parser)
{
    var x = parser.getFloat();
    var y = parser.getFloat();
    var z = parser.getFloat();
    
    return (new Vector3D(x, y, z));
};

OBJ.prototype._getVector2D          = function(parser)
{
    var x = parser.getFloat();
    var y = parser.getFloat();
    
    return (new Vector2D(x, y));
};



OBJ.prototype._parseFace    = function(parser, _faceName)
{
    var face    = new Face(_faceName);
    
    while(true)
    {
        var word    = parser.getUnitWord();
        
        if(word === null)
            break;
        
        var subWords = word.split('/');
        
        if(subWords.length >= 1)
        {
            var vi = parseInt(subWords[0]) -1;
            face.mVindices.push(vi);
        }
        
        if(subWords.length >= 2)
        {
            var ti  = parseInt(subWords[1]) -1;
            face.mTindices.push(ti);
        }
        
        if(subWords.length >= 3)
        {
            var ni  = parseInt(subWords[2]) -1;
            face.mNindices.push(ni);
        }
    };
    
    // Devide to triangles if face contains over than 3 points.
    if(face.mVindices.length > 3)
    {
        var capacity  = face.mVindices.length -2;
        
        var vIndices    = new Array(capacity *3);
        var tIndices    = new Array(capacity *3);
        var nIndices    = new Array(capacity *3);
        
        for(var start = 0 ; start < capacity ; start ++)
        {
            vIndices[start * 3 + 0] = face.mVindices[0];
            vIndices[start * 3 + 1] = face.mVindices[start + 1];
            vIndices[start * 3 + 2] = face.mVindices[start + 2];
            
            tIndices[start * 3 + 0] = face.mTindices[0];
            tIndices[start * 3 + 1] = face.mTindices[start + 1];
            tIndices[start * 3 + 2] = face.mTindices[start + 2];
            
            nIndices[start * 3 + 0] = face.mNindices[0];
            nIndices[start * 3 + 1] = face.mNindices[start + 1];
            nIndices[start * 3 + 2] = face.mNindices[start + 2];
        }
        
        face.mVindices  = vIndices;
        face.mTindices  = tIndices;
        face.mNindices  = nIndices;
    }
    
    face.mIndex    = face.mVindices.length;

    return face;
};


OBJ.prototype._getColor    = function(_name)
{   
    for(var idx = 0 ; idx < this.mMtls.length ; idx ++)
    {
        if(this.mMtls[idx].mName === _name)
            return (this.mMtls[idx].mKd.mColor);
    }
    
    return (new Vector4D(0.8, 0.8, 0.8, 1.0));
};
