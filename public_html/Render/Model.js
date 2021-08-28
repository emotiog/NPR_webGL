
var Surface = 
{
    "SURFACE_PHOTOREALISTIC"  : 0,
    "SURFACE_HATCHING"        : 1,
    "SURFACE_CARTOON"         : 2,
    "SURFACE_HATCH_CARTOON"   : 3
};

var Silhouette =
{
    "SILHOUETTE_DISABLE"       : 0,
    "SILHOUETTE_OUTLINE"       : 1,
    "SILHOUETTE_COMPONENT"     : 2,
    "SILHOUETTE_TARGET"        : 3

};

function Model()
{
    this.mSurface       = Surface.SURFACE_CARTOON;//Surface.SURFACE_PHOTOREALISTIC; //  //Surface.SURFACE_HATCHING;
    this.mSilhouette    = Silhouette.SILHOUETTE_DISABLE;
    
    this.mRenderable    = false;
    this.mTransform     = new Matrix4x4();
    
    this.mDrawMesh      = new Array();    
    
    this.mMeshCount     = 0;
    this.mTextureArray  = new Array();
};


Model.prototype.createTexture   = function(_pSystem, _pLoader)
{
    var mtlSize = _pLoader.mMtls.length;
    
    for(var idx = 0 ; idx < mtlSize ; idx++)
    {
        var texture = new GLTexture(_pLoader.mMtls[idx].mName, _pSystem, _pLoader.mMtls[idx].mImagePath);
        this.mTextureArray.push(texture);
    }
};


Model.prototype.connectTexture    = function()
{
    if(this.mTextureArray.length === 0)
        return;
    
    var subMeshCnt  = this.mDrawMesh.length;
    var textureCnt  = this.mTextureArray.length;
    
    var test_debug = false;
    for(var iMesh = 0 ; iMesh < subMeshCnt ; iMesh++)
    {
        test_debug = false;
        for(var iTx = 0 ; iTx < textureCnt ; iTx ++)
        {
            if(this.mDrawMesh[iMesh].mMtl === this.mTextureArray[iTx].mName)
            {
                this.mDrawMesh[iMesh].mTexture  = this.mTextureArray[iTx];
                test_debug = true;
                break;
            }
        }
        if(test_debug === false)
            console.log("Non-matching detected");
    };
    

};



Model.prototype.initialize  = function()
{
    for(var i = 0 ; i < 16 ; i ++)
    {
        // 0, 5, 10, 15
        if( (i % 5) === 0)
        {
            this.mTransform[i]   = 1.;
        }
        
        else
        {
            this.mTransform[i]   = 0.;
        }
    }
};

Model.prototype.renderModel = function(_pGL, _pShader)
{
    for(var iMesh = 0 ; iMesh < this.mMeshCount ; iMesh ++)
    {
        if(this.mDrawMesh[iMesh].mTexture.mImage !== null && this.mDrawMesh[iMesh].mTexture.mImage.mbComplete === true)
            this.mDrawMesh[iMesh].bindTexture(_pGL, _pShader, iMesh, 'u_Sampler');
        
        this.mDrawMesh[iMesh].drawSubMesh(_pGL, _pShader);
        
        if(this.mDrawMesh[iMesh].mTexture.mData !== null)
            this.mDrawMesh[iMesh].unbindTexture(_pGL, _pShader, iMesh, 'u_Sampler');
    }
};


Model.prototype.renderSubMesh   = function(_pGL, _pShader, _partID)
{
    this.mDrawMesh[_partID].drawSubMesh(_pGL, _pShader);
};


Model.prototype.setDrawPosition    = function(_pGL, _pShader)
{
    if(!this.mRenderable)
        return;
    
    // convert world Position
    var u_mMat = _pShader.getUniformLocation(_pGL, 'u_World');
    _pShader.uniformMatrix4fv(_pGL, u_mMat, this.mTransform);
    
    var normalMat   = new Matrix4x4();
    var MVmatrix    = new Matrix4x4();
    
    MVmatrix.set(_pGL.viewMat);
    normalMat.setInverseOf(MVmatrix.concat(this.mTransform));
    normalMat.transpose();
    
    u_mMat  = _pShader.getUniformLocation(_pGL, 'u_TrNorm');
    _pShader.uniformMatrix4fv(_pGL, u_mMat, normalMat);
};

Model.prototype._updateBuffer  = function(gl, _subMesh)
{
    _subMesh._updateVertexBuffer (gl);
    _subMesh._updateNormalBuffer (gl);
    _subMesh._updateColorBuffer  (gl);
    _subMesh._updateTextureBuffer(gl);
    _subMesh._updateIndicesBuffer(gl);
};


Model.prototype.convertFromLoader   = function(_pGL, _pLoader)
{
    if(!_pLoader.isMTL())
        return false;
    
    var fLength = _pLoader.mGroupFace.length;
    
    for(var fID = 0 ; fID < fLength ; fID ++)
    {
        var subMesh = new SubMesh();
     
        subMesh.mDrawInfo   = _pLoader.convertforWebGL(fID);
        subMesh.mMtl        = _pLoader.mGroupFace[fID].mName;
        
        this._updateBuffer(_pGL, subMesh);
        this.mDrawMesh.push(subMesh);
    }
    
    this.mMeshCount = this.mDrawMesh.length;
    
    _pLoader.mState     = ON_STATE.ON_LOADED;
    this.mRenderable    = true;
    
    return true;
};


Model.prototype.translate   = function(_x, _y, _z)
{
    this.mTransform.translate(_x, _y, _z);
};


Model.prototype.setSurface    = function(_rSurface)
{
    this.mSurface   = _rSurface;
};


Model.prototype.getSurface      = function()
{
    return this.mSurface;
};


Model.prototype.setSilhouette   = function( _rSilhouette)
{
    this.mSilhouette    = _rSilhouette;
};


Model.prototype.getSilhouette   = function()
{
    return this.mSilhouette;
};


Model.prototype.setScale    = function( _x, _y, _z)
{
    this.mTransform[0]  *= _x;
    this.mTransform[5]  *= _y;
    this.mTransform[10] *= _z;
};