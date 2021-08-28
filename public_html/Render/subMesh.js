function DrawInfo(_vertices, _textures, _normals, _colors, _indices)
{
    this.mVertices      = _vertices;
    this.mTextures      = _textures;
    this.mColors        = _colors;
    this.mNormals       = _normals;
    this.mIndices       = _indices;
};

function SubMesh()
{
    this.mDrawInfo      = null;
    
    this.mVertexBuffer  = null;
    this.mNormalBuffer  = null;
    this.mTextureBuffer = null;
    this.mColorBuffer   = null;
    
    this.mMtl           = null;
    this.mTexture      = null;
};


SubMesh.prototype._updateVertexBuffer = function(gl)
{
    this.mVertexBuffer  = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.mDrawInfo.mVertices, gl.STATIC_DRAW);
};


SubMesh.prototype._updateNormalBuffer = function(gl)
{
    this.mNormalBuffer  = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.mDrawInfo.mNormals, gl.STATIC_DRAW);
};


SubMesh.prototype._updateColorBuffer   = function(gl)
{
    this.mColorBuffer   = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.mDrawInfo.mColors, gl.STATIC_DRAW);
};


SubMesh.prototype._updateTextureBuffer   = function(gl)
{
    this.mTextureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.mDrawInfo.mTextures, gl.STATIC_DRAW);
};


SubMesh.prototype._updateIndicesBuffer      = function(gl)
{
    this.mIndexBuffer   = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.mDrawInfo.mIndices, gl.STATIC_DRAW);
};

SubMesh.prototype.drawSubMesh     = function(_pGL, _pShader)
{
    _pGL.bindBuffer(_pGL.ARRAY_BUFFER, this.mVertexBuffer);
    _pGL.vertexAttribPointer(_pShader.a_Position, 3, _pGL.FLOAT, false, 0, 0);
    _pGL.enableVertexAttribArray(_pShader.a_Position);
    
    _pGL.bindBuffer(_pGL.ARRAY_BUFFER, this.mNormalBuffer);
    _pGL.vertexAttribPointer(_pShader.a_Normal, 3, _pGL.FLOAT, false, 0, 0);
    _pGL.enableVertexAttribArray(_pShader.a_Normal);
    
    _pGL.bindBuffer(_pGL.ARRAY_BUFFER, this.mColorBuffer);
    _pGL.vertexAttribPointer(_pShader.a_Color, 4, _pGL.FLOAT, false, 0, 0);
    _pGL.enableVertexAttribArray(_pShader.a_Color);
            
    _pGL.bindBuffer(_pGL.ARRAY_BUFFER, this.mTextureBuffer);
    _pGL.vertexAttribPointer(_pShader.a_TexCoord, 2, _pGL.FLOAT, false, 0, 0);
    _pGL.enableVertexAttribArray(_pShader.a_TexCoord);
    
    _pGL.bindBuffer(_pGL.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer);
    _pGL.drawElements(_pGL.TRIANGLES, this.mDrawInfo.mIndices.length, _pGL.UNSIGNED_SHORT, 0);   
};


SubMesh.prototype.bindTexture    = function(_pGL, _pShader, _index, _uSamplerString)
{
    _pGL.activeTexture(_pGL.TEXTURE0 + _index % 10);
    _pGL.bindTexture(_pGL.TEXTURE_2D, this.mTexture.mData);
    
    var uPtrSampler    = _pGL.getUniformLocation(_pShader.mProgram, _uSamplerString);
    _pGL.uniform1i(uPtrSampler, _index % 10);
};


SubMesh.prototype.unbindTexture  = function(_pGL, _pShader, _index, _uSamplerString)
{
    _pGL.activeTexture(_pGL.TEXTURE0 + _index % 10);
    _pGL.bindTexture(_pGL.TEXTURE_2D, null);
    
    var uPtrSampler    = _pGL.getUniformLocation(_pShader.mProgram, _uSamplerString);
    _pGL.uniform1i(uPtrSampler, null);
};
