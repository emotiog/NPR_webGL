// Version 2.1.0 

function GLTexture(_name, _pGL, _imgPath)
{
    this.mName      = _name;
    this.mData      = _pGL.createTexture();
    this.mImage    = new Image();
    
    this.mImage.mbComplete  = false;
    
    this.initTexture(_pGL, this.mData, _imgPath);
};
    
    
    
GLTexture.prototype.initTexture = function(gl, _pTexture, _pImagePath)
{
    this.mImage.onload  = function()
    {
        _handleLoadedTexture(gl, this, _pTexture);
        this.mbComplete = true;
    };
    
    this.mImage.src = "Models/" + _pImagePath;
};

function _handleLoadedTexture(gl, _pImage, _pTexture)
{
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, _pTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _pImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    //gl.generateMipmap(gl.TEXTURE_2D);
    
    if(!gl.isTexture(_pTexture))
        alert("Error: Texture is invalid");
    
    gl.bindTexture(gl.TEXTURE_2D, null);
};


