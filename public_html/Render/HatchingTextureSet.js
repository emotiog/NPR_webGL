var HatchingTextureSet  = function()
{
    this.textSet    = new Array();
    this.imageSet   = new Array();
};


HatchingTextureSet.prototype.initTexture   = function(_pGL)
{
    var textSet_1         = _pGL.createTexture();
    var imageSet_1       = new Image();
    
    imageSet_1.onload = function()
    {
        hatchingHandleTextureLoaded(_pGL, textSet_1, this);
    };
    
    imageSet_1.src = "Shader/Hatching_Image/boundary.png";//"Shader/Hatching_Image/paper1.jpg";
    
    this.textSet.push(textSet_1);
    this.imageSet.push(imageSet_1);
        
    var textSet_2         = _pGL.createTexture();
    var imageSet_2       = new Image();
    
    imageSet_2.onload = function()
    {
        hatchingHandleTextureLoaded(_pGL, textSet_2, this);
    };
    imageSet_1.src = "Shader/Hatching_Image/Boundary_1.png";//"Shader/Hatching_Image/paper2.jpg";
    
    this.textSet.push(textSet_2);
    this.imageSet.push(imageSet_2);
    
    
    var textSet_3         = _pGL.createTexture();
    var imageSet_3       = new Image();
    
    imageSet_3.onload = function()
    {
        hatchingHandleTextureLoaded(_pGL, textSet_3, this);
    };
    imageSet_3.src = "Shader/Hatching_Image/Boundary_2.png";//"Shader/Hatching_Image/paper5.jpg";
    
    this.textSet.push(textSet_3);
    this.imageSet.push(imageSet_3);
};


HatchingTextureSet.prototype.bindTexture    = function(_pGL, _pShader)
{
    for(var iter = 0 ; iter < 3 ; iter ++)
    {
        _pGL.activeTexture(_pGL.TEXTURE0 + iter);
        //_pGL.enable(_pGL.TEXTURE_2D);
        _pGL.bindTexture(_pGL.TEXTURE_2D, this.textSet[iter]);
        var uniformHatching = _pShader.getUniformLocation(_pGL, 'hatch' + (iter+1));
        _pGL.uniform1i(uniformHatching, iter);
    }
};


HatchingTextureSet.prototype.unbindTexture  = function(_pGL, _pShader)
{
    /*
    for(var iter = 0 ; iter < 3 ; iter ++)
    {
        _pGL.activeTexture(_pGL.TEXTURE0 + iter);
        //_pGL.disable(_pGL.TEXTURE_2D);
        _pGL.bindTexture(_pGL.TEXTURE_2D, null);
    }
    */
    
        _pGL.activeTexture(_pGL.TEXTURE0);
        //_pGL.disable(_pGL.TEXTURE_2D);
        _pGL.bindTexture(_pGL.TEXTURE_2D, null);
        _pGL.uniform1i(_pShader.getUniformLocation(_pGL, 'hatch1'), null);
        
        _pGL.activeTexture(_pGL.TEXTURE1);
        //_pGL.disable(_pGL.TEXTURE_2D);
        _pGL.bindTexture(_pGL.TEXTURE_2D, null);
        _pGL.uniform1i(_pShader.getUniformLocation(_pGL, 'hatch2'), null);
        
        _pGL.activeTexture(_pGL.TEXTURE2);
        //_pGL.disable(_pGL.TEXTURE_2D);
        _pGL.bindTexture(_pGL.TEXTURE_2D, null);
        _pGL.uniform1i(_pShader.getUniformLocation(_pGL, 'hatch3'), null);
};


function hatchingHandleTextureLoaded(gl, _pTexture, _pImage)
{
    gl.bindTexture(gl.TEXTURE_2D, _pTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _pImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    
    if(!gl.isTexture(_pTexture))
        alert("Error: Hatching Texture is invalid");
    
    gl.bindTexture(gl.TEXTURE_2D, null);
}