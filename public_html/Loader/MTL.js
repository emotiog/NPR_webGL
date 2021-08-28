function loadMTL(_mtl, _path)
{
    var request = new XMLHttpRequest();
    
    request.onreadystatechange  = function()
    {
        if(request.readyState === 4)
        {
            if(request.status !== 404)
            {
                _onReadMTL(request.responseText, _mtl);
            }
            else
            {
                console.log('load error to read materal file');
                return;
            }
        }
    };
    
    request.open('GET', _path, true);
    request.send();
    
    return;
};


function _onReadMTL(fileString, _mtl)
{
    var lines   = fileString.split('\n');
    lines.push(null);
    
    var bStart = false;
    
    var index = 0;
    var curLine = 0;
    
    var stringParser = new StringParser();
    
    var mtl         = null;
    var preMap_Kd   = null;
    
    while(true)
    {
        curLine = lines[index++];

        if(curLine === null)
            break;
        
        stringParser._initialize(curLine);
        
        var command = stringParser.getUnitWord();
        
        if(command === null)
            continue;
        
        switch(command)
        {
            case '#':
                continue;
                
            case 'newmtl':
                if(bStart === true)
                    _mtl.push(mtl);
                else
                    bStart = true;
                
                mtl = null;
                mtl = new MTL();
                
                mtl.mName         = mtl._parseNewMtl(stringParser);
                continue;
                
            case 'Ns':
                mtl.mNs           = stringParser.getFloat();
                continue;
            
            case 'Ka':
                mtl.mKa           = mtl._parseRGB(stringParser, _mtl.mName);
                continue;
            
            case 'Kd':
                mtl.mKd           = mtl._parseRGB(stringParser, _mtl.mName);
                continue;
            
            case 'Ks':
                mtl.mKs           = mtl._parseRGB(stringParser, _mtl.mName);
                continue;
            
            case 'Ni':
                mtl.mNi           = stringParser.getFloat();
                continue;
                
            case 'd':
                mtl.mD           = stringParser.getFloat();
                continue;
            
            case 'illum':
                mtl.mILLum           = stringParser.getFloat();
                continue;
                
            case 'map_Kd':
                mtl.mImagePath     = mtl._parseNewMtl(stringParser);
                if(mtl.mImagePath === null)
                    mtl.mImagePath = preMap_Kd;
                else
                    preMap_Kd   = mtl.mImagePath;
                    
                continue;
        }
    }
    
    _mtl.push(mtl);
};


var MTL = function()
{
    this.mName      = "";
    this.mImagePath   = null;
};


MTL.prototype._parseNewMtl  = function(parser)
{
    return parser.getUnitWord();
};


MTL.prototype._parseRGB         = function(parser, _name)
{
    var r = parser.getFloat();
    var g = parser.getFloat();
    var b = parser.getFloat();
    
    return (new MTLColor(_name, r, g, b, 1));
};


MTL.prototype._parseVector3D    = function(parser, _name)
{
    var v   =new Vector3D();
    
    v.x   = parser.getFloat();
    v.y   = parser.getFloat();
    v.z   = parser.getFloat();
    
    return v;
};


var MTLColor   = function(_name, r, g, b, a)
{
    this.mName  = _name;
    this.mColor = new Vector4D(r, g, b, a);
};


