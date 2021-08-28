function Camera()
{ 
    this._mCameraPosition   = new Vector3D(0.0, 30.0, 0.0);
    this._mTargetPosition   = new Vector3D(0.0, 0.0, -200.0);
    this._mCameraAxis       = new Vector3D(0.0, 1.0, 0.0);
    
    this._mDistance         = new Vector3D(0.0, -30.0, 200.0);
    
    this.mViewMatrix        = new Matrix4x4();
};


Camera.prototype.setLookAt  = function()
{
    this.mViewMatrix.setLookAt(   
                        this._mCameraPosition.x,   this._mCameraPosition.y,     this._mCameraPosition.z,
                        this._mTargetPosition.x,   this._mTargetPosition.y,     this._mTargetPosition.z,
                        this._mCameraAxis.x,       this._mCameraAxis.y,         this._mCameraAxis.z);
                        
    return this.mViewMatrix;
};


Camera.prototype.setLightPosition   = function(_vPosition)
{
    this.mLightPosition = _vPosition;
    return this.mViewMatrix.multiplyVector3(_vPosition);
};


Camera.prototype._cameraUpdate   = function()
{
    this._mTargetPosition.x = this._mCameraPosition.x   - this._mDistance.x;
    this._mTargetPosition.y = this._mCameraPosition.y   - this._mDistance.y;
    this._mTargetPosition.z = this._mCameraPosition.z   - this._mDistance.z;
};

Camera.prototype.getTargetPosition  = function()
{
    return this._mTargetPosition;
};


Camera.prototype.moveFor    = function(_rX, _rY, _rZ)
{
    this._mCameraPosition.x -= _rX;
    this._mCameraPosition.y -= _rY;
    this._mCameraPosition.z -= _rZ;
    this._cameraUpdate();
};

Camera.prototype.moveForward = function(_rValue)
{
    this._mCameraPosition.z -= _rValue;
    this._cameraUpdate();
};


Camera.prototype.moveBackWard   = function(_rValue)
{
    this._mCameraPosition.z += _rValue;  
    this._cameraUpdate();
};


Camera.prototype.moveUpward = function(_rValue)
{
    this._mCameraPosition.y += _rValue;
    this._cameraUpdate();
};


Camera.prototype.moveSidewalk   = function(_rValue)
{
    this._mCameraPosition.x += _rValue;
    this._cameraUpdate();
};


Camera.prototype.rotate = function( _rAxis, _rAngle)
{
    this._mCameraAxis.y -= 0.1;
    this._mCameraAxis.normalize();
};


Camera.prototype.rotateY = function(_rValue)
{
    this._mCameraAxis.y -= _rValue/100;
    this._mCameraAxis.normalize();
    this._cameraUpdate();
};

Camera.prototype.rotateX = function(_rValue)
{
    this._mCameraAxis.x -= _rValue/100;
    
    this._mCameraAxis.normalize();
    this._cameraUpdate();
};

Camera.prototype.rotateZ = function(_rValue)
{
    this._mCameraAxis.z -= _rValue/100;
    this._mCameraAxis.normalize();
    this._cameraUpdate();
};