function Renderer(_rName)
{
    this.mName          = _rName;
    this.mCanvas        = null;
    
    this.mGL            = null;
    this.mCamera        = new Camera();
    this.mLightPosition  = new Vector4D(202530.0, 5000.0, -443700.0, 1.);
    
    
    this.mViewMatrix    = new Matrix4x4();

    this.mNear          = 1.0;
    this.mFar           = 1000.0;
    
    
    this.mPhotoRealisticShader  = null;
    this.mHatchingShader        = null;
    this.mCartoonShader         = null;
    this.mSilhouetteShader      = null;
    
    this.mTargetShader         = null;
    this.mCartoonHatchingShader     = null;
    
    this.initContext();
    this.initShader();
    this.initViewBuffer();
};


Renderer.prototype.initContext  = function()
{
    this.mCanvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    this.mGL = this.mCanvas.getContext('webgl');
    
    this.mGL.viewportWidth   = this.mCanvas.width;
    this.mGL.viewportHeight  = this.mCanvas.height;
    
    if (!this.mGL) 
    {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }        
};


Renderer.prototype.initShader   = function()
{
    this.mPhotoRealisticShader  = new Shader();
    this.mHatchingShader        = new Shader();
    this.mCartoonShader         = new Shader();
    this.mSilhouetteShader      = new Shader();
    
    this.mTargetShader     = new Shader();
    this.mCartoonHatchingShader = new Shader();
    
    //this.mStrokeShader          = new Shader();
    
    
    this.mPhotoRealisticShader.setShader(this.mGL, 'Shader/PerPixelPointLight',   'Shader/PerPixelPointLight');
    this.mHatchingShader.setShader      (this.mGL, 'Shader/Hatching',             'Shader/Hatching');
    this.mCartoonShader.setShader       (this.mGL, 'Shader/ToonShading',          'Shader/ToonShading');
    this.mSilhouetteShader.setShader    (this.mGL, 'Shader/Silhouette',           'Shader/Silhouette');
    
    this.mTargetShader.setShader        (this.mGL, 'Shader/Target',         'Shader/Target');
    this.mCartoonHatchingShader.setShader(this.mGL, 'Shader/HatchingCartoon',       'Shader/HatchingCartoon');
    
    this.mPhotoRealisticShader.initAttribLocation(this.mGL);
    this.mHatchingShader.initAttribLocation(this.mGL);
    this.mCartoonShader.initAttribLocation(this.mGL);
    this.mSilhouetteShader.initAttribLocation(this.mGL);
    this.mCartoonHatchingShader.initAttribLocation(this.mGL);
    
    this.initTextureFramebuffer();

    this.mSilhouetteShader.frameWidth     = this.mGL.getUniformLocation(this.mSilhouetteShader.mProgram, "uFrameWidth");
    this.mSilhouetteShader.frameHeight    = this.mGL.getUniformLocation(this.mSilhouetteShader.mProgram, "uFrameHeight");
    
    this.mSilhouetteShader.uDiffuseTexture      = this.mGL.getUniformLocation(this.mSilhouetteShader.mProgram, "uDiffuseTexture");
    this.mSilhouetteShader.uPositionTexture     = this.mGL.getUniformLocation(this.mSilhouetteShader.mProgram, "uPositionTexture");
    this.mSilhouetteShader.uNormalTexture       = this.mGL.getUniformLocation(this.mSilhouetteShader.mProgram, "uNormalTexture");

    this.mSilhouetteShader.uNPRDepthTexture     = this.mGL.getUniformLocation(this.mSilhouetteShader.mProgram, "uNPRDepthTexture");
    this.mSilhouetteShader.uNPRNormalTexture    = this.mGL.getUniformLocation(this.mSilhouetteShader.mProgram, "uNPRNormalTexture");
    
    this.mSilhouetteShader.uPointLightIntensity = this.mGL.getUniformLocation(this.mSilhouetteShader.mProgram, "uPointLightIntensity");
    this.mSilhouetteShader.uPointLightPosition  = this.mGL.getUniformLocation(this.mSilhouetteShader.mProgram, "uPointLightPosition");
    
    this.mSilhouetteShader.uDepth               = this.mGL.getUniformLocation(this.mSilhouetteShader.mProgram, "uDepthDiscontinuous");
    this.mSilhouetteShader.uNormal              = this.mGL.getUniformLocation(this.mSilhouetteShader.mProgram, "uNormalDiscontinuous");
};


Renderer.prototype.terminate    = function()
{
    delete  this.mPhotoRealisticShader;
    delete  this.mHatchingShader;
    delete  this.mCartoonShader;
    delete  this.mSilhouetteShader;
    
    delete  this.mDepthBuffer;
    delete  this.mFrameBuffer;
};


Renderer.prototype.clear    = function()
{
    this.mGL.clear(this.mGL.COLOR_BUFFER_BIT | this.mGL.DEPTH_BUFFER_BIT);
};


Renderer.prototype.clearColor   = function(_r, _g, _b, _a)
{
    this.mGL.clearColor(_r, _g, _b, _a);
};


Renderer.prototype.setViewport    = function( _pShader)
{
    var uniFormMat  = _pShader.getUniformLocation(this.mGL, 'u_View');
    this.mGL.viewMat = this.mCamera.setLookAt();
    _pShader.uniformMatrix4fv(this.mGL, uniFormMat, this.mGL.viewMat);
    
    uniFormMat = null;
};


Renderer.prototype.setPerspective   = function( _pShader)
{
    var projectionMatrix    = new Matrix4x4();
    projectionMatrix.setPerspective(45, (this.mGL.viewportWidth / this.mGL.viewportHeight), 1, 1000);

    var uniformProMat   = _pShader.getUniformLocation(this.mGL, 'u_Proj');
    _pShader.uniformMatrix4fv(this.mGL, uniformProMat, projectionMatrix);
};


Renderer.prototype.setOrtho = function(_pShader)
{
    var orthoMatrix = new Matrix4x4();
    orthoMatrix.setOrtho(0, this.mGL.viewportWidth, 0, this.mGL.viewportHeight, 1, 1000.0);
    
    var uniformProMat   = _pShader.getUniformLocation(this.mGL, 'u_Proj');
    _pShader.uniformMatrix4fv(this.mGL, uniformProMat, orthoMatrix);
};


Renderer.prototype._saveFrameAsTexture   = function(_pModel)
{
    this.mGL.bindFramebuffer(this.mGL.FRAMEBUFFER, this.mFrameBuffer);
    //this.mGL.disable(this.mGL.DEPTH_TEST);
    
    this.mGL.clear(this.mGL.DEPTH_BUFFER_BIT | this.mGL.COLOR_BUFFER_BIT);

    for( var modelNum   = 0 ; modelNum  < _pModel.length ; modelNum ++)
    {
        switch(_pModel[modelNum].mSilhouette)
        {
            case Silhouette.SILHOUETTE_DISABLE:
                this._drawTarget(_pModel[modelNum]);
                break;

            case Silhouette.SILHOUETTE_OUTLINE:
                this._drawCartoon(_pModel[modelNum]);
                break;
                
            case Silhouette.SILHOUETTE_COMPONENT:
                this._drawRealisticModel(_pModel[modelNum]);
                break;
                
            default:
                break;
        }        
    }

    this.mGL.bindTexture(this.mGL.TEXTURE_2D, this.mNPRDepthTexture);
    this.mGL.generateMipmap(this.mGL.TEXTURE_2D);
    this.mGL.bindTexture(this.mGL.TEXTURE_2D, null);

    this.mGL.bindFramebuffer(this.mGL.FRAMEBUFFER, null);
};


Renderer.prototype._renderModels   = function(_pModel)
{
    this.mGL.enable(this.mGL.DEPTH_TEST);
    this.mGL.clear(this.mGL.DEPTH_BUFFER_BIT | this.mGL.COLOR_BUFFER_BIT);

    for( var modelNum   = 0 ; modelNum  < _pModel.length ; modelNum ++)
    {
        switch(_pModel[modelNum].mSurface)
        {
            case Surface.SURFACE_PHOTOREALISTIC:
                this._drawRealisticModel(_pModel[modelNum]);
                break;

            case Surface.SURFACE_HATCHING:  
                this._drawHatching(_pModel[modelNum]);
                break;

            case Surface.SURFACE_CARTOON:
                this._drawCartoon(_pModel[modelNum]);
                break;

            case Surface.SURFACE_HATCH_CARTOON:
                this._drawHatchingCartoon(_pModel[modelNum]);
                break;

            case Surface.SURFACE_TARGET:
                this._drawTarget(_pModel[modelNum]);
                break;
        }        
    }
    
    if(gbFrameBufferOn)
    {
        this._saveFrameAsTexture(_pModel);
        this._drawSilhouette();
    }
};


Renderer.prototype._drawHatchingCartoon = function(_pSingleModel)
{
    this.mCartoonHatchingShader.enable(this.mGL);
    {
        this.mGL.viewport(0, 0, this.mFrameBuffer.width, this.mFrameBuffer.height);

        this.setViewport(this.mCartoonHatchingShader);
        this.setPerspective(this.mCartoonHatchingShader);
        
        // Init Lights
        var u_lCol          = this.mGL.getUniformLocation(this.mCartoonHatchingShader.getProgram(), 'u_LightColor');
        var u_lPos          = this.mGL.getUniformLocation(this.mCartoonHatchingShader.getProgram(), 'u_LightPosition');
        var u_lAmbientCol   = this.mGL.getUniformLocation(this.mCartoonHatchingShader.getProgram(), 'u_AmbientLight');

        var viewLight   = new Matrix4x4();
        viewLight.loadIdentity();
        
        var lightPos = viewLight.multiplyVector3(new Vector3D(this.mLightPosition.x, this.mLightPosition.y, this.mLightPosition.z));

        this.mGL.uniform3f(u_lCol, 0.7, 0.7, 0.7);
        this.mGL.uniform3f(u_lPos, lightPos.x, lightPos.y, lightPos.z);
        this.mGL.uniform3f(u_lAmbientCol, 0.3, 0.3, 0.3);

        gHatchingTexture.bindTexture(this.mGL, this.mCartoonHatchingShader);
        _pSingleModel.setDrawPosition(this.mGL, this.mCartoonHatchingShader);
        
        for(var iMesh = 0 ; iMesh < _pSingleModel.mMeshCount ; iMesh ++)
            _pSingleModel.renderSubMesh(this.mGL, this.mHatchingShader, iMesh);
        
        gHatchingTexture.unbindTexture(this.mGL, this.mCartoonHatchingShader);
        
        this.mGL.viewMat = null;        
    }
    this.mCartoonHatchingShader.disable(this.mGL);
};


Renderer.prototype._drawRealisticModel    = function(_pSingleModel)
{      
    this.mPhotoRealisticShader.enable(this.mGL);
    {
        var nearLocation    = this.mPhotoRealisticShader.getUniformLocation(this.mGL, 'uNear');
        var farLocation     = this.mPhotoRealisticShader.getUniformLocation(this.mGL, 'uFar');

        this.mGL.uniform1f( nearLocation, this.mNear);
        this.mGL.uniform1f(  farLocation, this.mFar );

        var modelDiffuseTextureLocation = this.mGL.getUniformLocation( this.mPhotoRealisticShader.getProgram(), 'uModelDiffuseTexture');

        this.mGL.viewport(0, 0, this.mFrameBuffer.width, this.mFrameBuffer.height);
        
        this.setViewport    (this.mPhotoRealisticShader);
        this.setPerspective (this.mPhotoRealisticShader);
        
        this.mPhotoRealisticShader.uniform1i(this.mGL, modelDiffuseTextureLocation, 0);
        
        // Init Lights
        var u_lCol          = this.mGL.getUniformLocation(this.mPhotoRealisticShader.getProgram(), 'u_LightColor');
        var u_lPos          = this.mGL.getUniformLocation(this.mPhotoRealisticShader.getProgram(), 'u_LightPosition');
        var u_lAmbientCol   = this.mGL.getUniformLocation(this.mPhotoRealisticShader.getProgram(), 'u_AmbientLight');

        var viewLight   = new Matrix4x4();
        viewLight.loadIdentity();
        
        var lightPos = viewLight.multiplyVector3(new Vector3D(this.mLightPosition.x, this.mLightPosition.y, this.mLightPosition.z));

        this.mGL.uniform3f(u_lCol, 0.7, 0.7, 0.7);
        this.mGL.uniform3f(u_lPos, lightPos.x, lightPos.y, lightPos.z);
        this.mGL.uniform3f(u_lAmbientCol, 0.8, 0.8, 0.8);
        
        _pSingleModel.setDrawPosition(this.mGL, this.mPhotoRealisticShader);
        _pSingleModel.renderModel(this.mGL, this.mPhotoRealisticShader);        
    }
    this.mGL.bindTexture(this.mGL.TEXTURE_2D, null);
    
    this.mPhotoRealisticShader.disable(this.mGL);
};


Renderer.prototype._drawHatching  = function(_pSingleModel)
{
    this.mHatchingShader.enable(this.mGL);
    {
        this.setViewport(this.mHatchingShader);
        this.setPerspective(this.mHatchingShader);
        
        // Init Lights
        var u_lCol          = this.mGL.getUniformLocation(this.mHatchingShader.getProgram(), 'u_LightColor');
        var u_lPos          = this.mGL.getUniformLocation(this.mHatchingShader.getProgram(), 'u_LightPosition');
        var u_lAmbientCol   = this.mGL.getUniformLocation(this.mHatchingShader.getProgram(), 'u_AmbientLight');

        var lightPos = this.mGL.viewMat.multiplyVector3(new Vector3D(this.mLightPosition.x, this.mLightPosition.y, this.mLightPosition.z));

        this.mGL.uniform3f(u_lCol, 0.7, 0.7, 0.7);
        this.mGL.uniform3f(u_lPos, lightPos.x, lightPos.y, lightPos.z);
        this.mGL.uniform3f(u_lAmbientCol, 0.3, 0.3, 0.3);

        gHatchingTexture.bindTexture(this.mGL, this.mHatchingShader);
        _pSingleModel.setDrawPosition(this.mGL, this.mHatchingShader);
        
        for(var iMesh = 0 ; iMesh < _pSingleModel.mMeshCount ; iMesh ++)
            _pSingleModel.renderSubMesh(this.mGL, this.mHatchingShader, iMesh);

        gHatchingTexture.unbindTexture(this.mGL, this.mHatchingShader);
        
        this.mGL.viewMat = null;
    }
    this.mGL.bindTexture(this.mGL.TEXTURE_2D, null);
    this.mHatchingShader.disable(this.mGL);
};


Renderer.prototype._drawTarget = function(_pSingleModel)
{
    this.mTargetShader.enable(this.mGL);
    {
        this.setViewport(this.mTargetShader);
        this.setPerspective(this.mTargetShader);
        
        _pSingleModel.setDrawPosition(this.mGL, this.mTargetShader);
    
        for(var iMesh = 0 ; iMesh < _pSingleModel.mMeshCount ; iMesh ++)
            _pSingleModel.renderSubMesh(this.mGL, this.mHatchingShader, iMesh);
    }
    this.mTargetShader.disable(this.mGL);   
};


Renderer.prototype._drawCartoon = function(_pSingleModel)
{
    this.mCartoonShader.enable(this.mGL);
    {
        this.setViewport(this.mCartoonShader);
        this.setPerspective(this.mCartoonShader);
        
        // Init Lights
        var u_lCol          = this.mGL.getUniformLocation(this.mCartoonShader.getProgram(), 'u_LightColor');
        var u_lPos          = this.mGL.getUniformLocation(this.mCartoonShader.getProgram(), 'u_LightPosition');
        var u_lAmbientCol   = this.mGL.getUniformLocation(this.mCartoonShader.getProgram(), 'u_AmbientLight');

        var lightPos = this.mGL.viewMat.multiplyVector3(new Vector3D(this.mLightPosition.x, this.mLightPosition.y, this.mLightPosition.z));

        this.mGL.uniform3f(u_lCol, 0.7, 0.7, 0.7);
        this.mGL.uniform3f(u_lPos, lightPos.x, lightPos.y, lightPos.z);
        this.mGL.uniform3f(u_lAmbientCol, 0.3, 0.3, 0.3);
        
        _pSingleModel.setDrawPosition(this.mGL, this.mCartoonShader);
        _pSingleModel.renderModel(this.mGL, this.mCartoonShader);
    }
    this.mCartoonShader.disable(this.mGL);
};


Renderer.prototype._drawSilhouette = function()
{   
    this.mSilhouetteShader.enable(this.mGL);
    {        
        this.mGL.uniform1f( this.mSilhouetteShader.uDepth, 0.05);
        this.mGL.uniform1f( this.mSilhouetteShader.frameWidth, this.mGL.viewportWidth);
        this.mGL.uniform1f( this.mSilhouetteShader.frameHeight, this.mGL.viewportHeight);

        this.mGL.bindBuffer(this.mGL.ARRAY_BUFFER, this.viewNorBuffer);
        this.mGL.vertexAttribPointer(this.mGL.a_Normal, this.viewNorBuffer.itemSize, this.mGL.FLOAT, false, 0, 0);

        this.mGL.bindBuffer(this.mGL.ARRAY_BUFFER, this.viewTexBuffer);
        this.mGL.vertexAttribPointer(this.mGL.a_TexCoord, this.viewTexBuffer.itemSize, this.mGL.FLOAT, false, 0, 0);    

        this.bindNPRDepthTexture(this.mGL, this.mSilhouetteShader.uNPRDepthTexture);
    
        this.mGL.enable(this.mGL.BLEND);
        this.mGL.disable(this.mGL.DEPTH_TEST);
        
        this.mGL.blendFunc(this.mGL.SRC_ALPHA, this.mGL.ONE_MINUS_SRC_ALPHA);
        this.mGL.drawArrays(this.mGL.TRIANGLES, 0, this.viewTexBuffer.numItems);
    }
    this.mSilhouetteShader.disable(this.mGL);
    
    this.mGL.disable(this.mGL.BLEND);
};


// only for silhouette 
Renderer.prototype.bindDiffuseTexture = function(_pGL, _mDiffuseTextureLocation)
{
    _pGL.activeTexture( _pGL.TEXTURE0 );
    _pGL.bindTexture(_pGL.TEXTURE_2D, this.mDiffuseTexture );
    _pGL.uniform1i(_mDiffuseTextureLocation, 0);
};


Renderer.prototype.bindPositionTexture = function(_pGL, _mPositionTextureLocation)
{
    _pGL.activeTexture( _pGL.TEXTURE1 );
    _pGL.bindTexture(_pGL.TEXTURE_2D, this.mPositionTexture );
    _pGL.uniform1i(_mPositionTextureLocation, 1);    
};


Renderer.prototype.bindNormalTexture  = function(_pGL, _mNormalTextureLocation)
{
    _pGL.activeTexture( _pGL.TEXTURE2 );
    _pGL.bindTexture(_pGL.TEXTURE_2D, this.mNormalTexture );
    _pGL.uniform1i(_mNormalTextureLocation, 2);        
};


Renderer.prototype.bindNPRDepthTexture    = function(_pGL, _mNPRDepthTextureLocation)
{
    _pGL.activeTexture( _pGL.TEXTURE0 );
    _pGL.bindTexture(_pGL.TEXTURE_2D, this.mNPRDepthTexture );
    _pGL.uniform1i(_mNPRDepthTextureLocation, 0);        
};


Renderer.prototype.bindNPRNormalTexture   = function(_pGL, _mNPRNormalTextureLocation)
{
    _pGL.activeTexture( _pGL.TEXTURE4 );
    _pGL.bindTexture(_pGL.TEXTURE_2D, this.mNPRNormalTexture );
    _pGL.uniform1i(_mNPRNormalTextureLocation, 4);        
};


Renderer.prototype.unbindTexture   = function(_pGL)
{
    _pGL.activeTexture( _pGL.TEXTURE0 );
    _pGL.bindTexture(_pGL.TEXTURE_2D, null);
};


Renderer.prototype._initDepthTexture    = function()
{
    this.mNPRDepthTexture   = this.mGL.createTexture();
    this.mGL.bindTexture(this.mGL.TEXTURE_2D, this.mNPRDepthTexture);
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_WRAP_S, this.mGL.CLAMP_TO_EDGE );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_WRAP_T, this.mGL.CLAMP_TO_EDGE );  
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_MIN_FILTER, this.mGL.LINEAR );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_MAG_FILTER, this.mGL.LINEAR );
    
    this.mGL.texImage2D(this.mGL.TEXTURE_2D, 0, this.mGL.RGBA, this.mFrameBuffer.width, this.mFrameBuffer.height, 0, this.mGL.RGBA, this.mGL.UNSIGNED_BYTE, null);
 
    this.mDepthBuffer     = this.mGL.createRenderbuffer();
    this.mGL.bindRenderbuffer(this.mGL.RENDERBUFFER, this.mDepthBuffer);
    this.mGL.renderbufferStorage(this.mGL.RENDERBUFFER, this.mGL.DEPTH_COMPONENT16, this.mFrameBuffer.width, this.mFrameBuffer.height);    
    
    this.mGL.framebufferTexture2D(this.mGL.FRAMEBUFFER, this.mGL.COLOR_ATTACHMENT0, this.mGL.TEXTURE_2D, this.mNPRDepthTexture, 0);
    this.mGL.framebufferRenderbuffer(this.mGL.FRAMEBUFFER, this.mGL.DEPTH_ATTACHMENT, this.mGL.RENDERBUFFER, this.mDepthBuffer);
    
    this.mGL.bindTexture(this.mGL.TEXTURE_2D, null);
};


Renderer.prototype._initDiffuseTexture  = function()
{
    this.mDiffuseTexture    = this.mGL.createTexture();
    this.mGL.bindTexture(this.mGL.TEXTURE_2D, this.mDiffuseTexture);
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_MIN_FILTER, this.mGL.LINEAR );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_MAG_FILTER, this.mGL.LINEAR );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_WRAP_S, this.mGL.CLAMP_TO_EDGE );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_WRAP_T, this.mGL.CLAMP_TO_EDGE );

    this.mGL.texImage2D(this.mGL.TEXTURE_2D, 0, this.mGL.RGBA, this.mFrameBuffer.width, this.mFrameBuffer.height, 0, this.mGL.RGBA, this.mGL.UNSIGNED_BYTE, null);

    this.mDiffuseBuffer = this.mGL.createRenderbuffer();
    this.mGL.bindRenderbuffer(this.mGL.RENDERBUFFER, this.mDiffuseBuffer);
    this.mGL.renderbufferStorage(this.mGL.RENDERBUFFER, this.mGL.DEPTH_COMPONENT16, this.mFrameBuffer.width, this.mFrameBuffer.height);
    
    this.mGL.framebufferTexture2D(this.mGL.FRAMEBUFFER, this.mGL.COLOR_ATTACHMENT0, this.mGL.TEXTURE_2D, this.mDiffuseTexture, 0);
    this.mGL.framebufferRenderbuffer(this.mGL.FRAMEBUFFER, this.mGL.DEPTH_ATTACHMENT, this.mGL.RENDERBUFFER, this.mDiffuseBuffer);
    
    this.mGL.bindTexture(this.mGL.TEXTURE_2D, null);
};


Renderer.prototype._initPositionTexture  = function()
{
    this.mPositionTexture    = this.mGL.createTexture();
    this.mGL.bindTexture(this.mGL.TEXTURE_2D, this.mPositionTexture);
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_MIN_FILTER, this.mGL.LINEAR );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_MAG_FILTER, this.mGL.LINEAR );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_WRAP_S, this.mGL.CLAMP_TO_EDGE );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_WRAP_T, this.mGL.CLAMP_TO_EDGE );

    this.mGL.texImage2D(this.mGL.TEXTURE_2D, 0, this.mGL.RGBA, this.mFrameBuffer.width, this.mFrameBuffer.height, 0, this.mGL.RGBA, this.mGL.UNSIGNED_BYTE, null);

    this.mPositionBuffer    = this.mGL.createRenderbuffer();
    this.mGL.bindRenderbuffer(this.mGL.RENDERBUFFER, this.mPositionBuffer);
    this.mGL.renderbufferStorage(this.mGL.RENDERBUFFER, this.mGL.DEPTH_COMPONENT16, this.mFrameBuffer.width, this.mFrameBuffer.height);
    
    this.mGL.framebufferTexture2D(this.mGL.FRAMEBUFFER, this.mGL.COLOR_ATTACHMENT1, this.mGL.TEXTURE_2D, this.mPositionTexture, 0);
    this.mGL.framebufferRenderbuffer(this.mGL.FRAMEBUFFER, this.mGL.DEPTH_ATTACHMENT, this.mGL.RENDERBUFFER, this.mPositionBuffer);

    this.mGL.bindTexture(this.mGL.TEXTURE_2D, null);
};


Renderer.prototype._initNormalTexture   = function()
{
    this.mNormalTexture    = this.mGL.createTexture();
    this.mGL.bindTexture(this.mGL.TEXTURE_2D, this.mNormalTexture);
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_MIN_FILTER, this.mGL.LINEAR );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_MAG_FILTER, this.mGL.LINEAR );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_WRAP_S, this.mGL.CLAMP_TO_EDGE );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_WRAP_T, this.mGL.CLAMP_TO_EDGE );

    this.mGL.texImage2D(this.mGL.TEXTURE_2D, 0, this.mGL.RGBA, this.mFrameBuffer.width, this.mFrameBuffer.height, 0, this.mGL.RGBA, this.mGL.UNSIGNED_BYTE, null);

    this.mNormalBuffer    = this.mGL.createRenderbuffer();  
    this.mGL.bindRenderbuffer(this.mGL.RENDERBUFFER, this.mNormalBuffer);
    this.mGL.renderbufferStorage(this.mGL.RENDERBUFFER, this.mGL.DEPTH_COMPONENT16, this.mFrameBuffer.width, this.mFrameBuffer.height);
    
    this.mGL.framebufferTexture2D(this.mGL.FRAMEBUFFER, this.mGL.COLOR_ATTACHMENT0, this.mGL.TEXTURE_2D, this.mNormalTexture, 0);
    this.mGL.framebufferRenderbuffer(this.mGL.FRAMEBUFFER, this.mGL.DEPTH_ATTACHMENT, this.mGL.RENDERBUFFER, this.mNormalBuffer);
 
    this.mGL.bindTexture(this.mGL.TEXTURE_2D, null);
};


Renderer.prototype._initNPRnormalTexture    = function()
{
    this.mNPRNormalTexture   = this.mGL.createTexture();
    this.mGL.bindTexture(this.mGL.TEXTURE_2D, this.mNPRNormalTexture);
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_MIN_FILTER, this.mGL.LINEAR );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_MAG_FILTER, this.mGL.LINEAR );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_WRAP_S, this.mGL.CLAMP_TO_EDGE );
    this.mGL.texParameteri( this.mGL.TEXTURE_2D, this.mGL.TEXTURE_WRAP_T, this.mGL.CLAMP_TO_EDGE );  

    this.mGL.texImage2D(this.mGL.TEXTURE_2D, 0, this.mGL.RGBA, this.mFrameBuffer.width, this.mFrameBuffer.height, 0, this.mGL.RGBA, this.mGL.UNSIGNED_BYTE, null);

    this.mNPRnormalBuffer   = this.mGL.createRenderbuffer();
    this.mGL.bindRenderbuffer(this.mGL.RENDERBUFFER, this.mNPRnormalBuffer);
    this.mGL.renderbufferStorage(this.mGL.RENDERBUFFER, this.mGL.DEPTH_COMPONENT16, this.mFrameBuffer.width, this.mFrameBuffer.height);

    this.mGL.framebufferTexture2D(this.mGL.FRAMEBUFFER, this.mGL.COLOR_ATTACHMENT0, this.mGL.TEXTURE_2D, this.mNPRNormalTexture, 0);
    this.mGL.framebufferRenderbuffer(this.mGL.FRAMEBUFFER, this.mGL.DEPTH_ATTACHMENT, this.mGL.RENDERBUFFER, this.mNPRnormalBuffer);  
     
    this.mGL.bindTexture(this.mGL.TEXTURE_2D, null);
};


Renderer.prototype.initTextureFramebuffer   = function()
{       
    this.mFrameBuffer   = this.mGL.createFramebuffer();
    this.mGL.bindFramebuffer(this.mGL.FRAMEBUFFER, this.mFrameBuffer);

    this.mFrameBuffer.width = this.mGL.viewportWidth;
    this.mFrameBuffer.height= this.mGL.viewportHeight;

    this._initDepthTexture();
//    this._initDiffuseTexture();
//    this._initNormalTexture();
//    this._initNPRnormalTexture();
    
    var status  = this.mGL.checkFramebufferStatus(this.mGL.FRAMEBUFFER);
    
    if(status !== this.mGL.FRAMEBUFFER_COMPLETE)
        throw   "Fail to load FrameBuffer";
    
    this.mGL.bindRenderbuffer(this.mGL.RENDERBUFFER, null);
    this.mGL.bindFramebuffer(this.mGL.FRAMEBUFFER, null);   
};



Renderer.prototype.initViewBuffer   = function()
{
    // 이미지라서 Texture 가 필요가 없다??
/*
    this.viewBuffer  = this.mGL.createBuffer();
    this.mGL.bindBuffer(this.mGL.ARRAY_BUFFER, this.viewBuffer);
    var fVertices = [
                        this.mFrameBuffer.width, this.mFrameBuffer.height, 0,//1,1,0,//
                        this.mFrameBuffer.width, this.mFrameBuffer.height, 0,
                        this.mFrameBuffer.width, this.mFrameBuffer.height, 0,
                        this.mFrameBuffer.width, this.mFrameBuffer.height, 0,
                        this.mFrameBuffer.width, this.mFrameBuffer.height, 0,
                        this.mFrameBuffer.width, this.mFrameBuffer.height, 0
                    ];
                    
    this.mGL.bufferData(this.mGL.ARRAY_BUFFER, new Float32Array(fVertices), this.mGL.STATIC_DRAW);
    this.viewBuffer.itemSize = 3;
    this.viewBuffer.numItems = 6;
*/    
    this.viewNorBuffer  = this.mGL.createBuffer();
    this.mGL.bindBuffer(this.mGL.ARRAY_BUFFER, this.viewNorBuffer);
    var normals = [
             0.0, 1.0, 0.0,
             0.0, 0.0, 1.0,
             1.0, 0.0, 0.0,
             0.0, 1.0, 0.0
        ];
        
    this.mGL.bufferData(this.mGL.ARRAY_BUFFER, new Float32Array(normals), this.mGL.STATIC_DRAW);
    this.viewNorBuffer.itemSize = 3;
    this.viewNorBuffer.numItems = 4;
    
    
    this.viewTexBuffer   = this.mGL.createBuffer();
    this.mGL.bindBuffer(this.mGL.ARRAY_BUFFER, this.viewTexBuffer);
    var texCoords   = 
                        [
                            -1.0,  1.0,                
                            -1.0, -1.0,
                             1.0, -1.0,
                             1.0, -1.0,
                             1.0,  1.0,
                            -1.0,  1.0
                        ];
    this.mGL.bufferData(this.mGL.ARRAY_BUFFER, new Float32Array(texCoords), this.mGL.STATIC_DRAW);
    this.viewTexBuffer.itemSize  = 2;
    this.viewTexBuffer.numItems  = 6;
};