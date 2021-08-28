

var Matrix4x4   = function(_rParam)
{
    var _rMatrix    = null;
    var _sMatrix    = null;
    
    if(_rParam & typeof _rParam === 'object' && _rParam.hasOwnProperty('elements'))
    {
        _sMatrix    = _rParam.m;
        _rMatrix    = new Float32Array(16);
        
        for(var data = 0 ; data < data < 16 ; data++)
        {
            _rMatrix[data]   = _sMatrix[data];
        }
        
        this.m = _rMatrix;
    }
    else
    {
        this.m  = new Float32Array([ 1. , 0. , 0. , 0.
                                   , 0. , 1. , 0. , 0.
                                   , 0. , 0. , 1. , 0.
                                   , 0. , 0. , 0. , 1.]);
    }  
};


Matrix4x4.prototype.loadIdentity    = function()
{
    for(var i = 0 ; i < 16 ; i ++)
    {
        // 0, 5, 10, 15
        if( (i % 5) === 0)
        {
            this.m[i]   = 1.;
        }
        
        else
        {
            this.m[i]   = 0.;
        }
    }
};


Matrix4x4.prototype.set = function(_rSrc)
{
    if(_rSrc.m === this.m)
        return;
    
    for(var i = 0 ; i < 16 ; i ++)
    {
        this.m[i] = _rSrc.m[i];
    }
};


Matrix4x4.prototype.setPerspective  = function(_rFovy, _rAspect, _rNear, _rFar)
{
    if(_rNear === _rFar || _rAspect === 0)
        throw 'null frustum';
    
    if( _rNear <= 0)
        throw 'Near <= 0';
    
    if(_rFar <= 0)
        throw 'Far <= 0';
    
    _rFovy  = Math.PI * _rFovy / 360;
    
    var sinFovy = Math.sin(_rFovy);
    
    if( sinFovy === 0)
        throw 'null frustum';
    
    var radian      = 1 / (_rFar - _rNear);
    var cotanFovy   = Math.cos(_rFovy) / sinFovy;
    
    var m           = this.m;
    
    m[0]  = cotanFovy / _rAspect;    m[1]  = 0;           m[2]  = 0;                            m[3]  = 0;
    m[4]  = 0;                       m[5]  = cotanFovy;   m[6]  = 0;                            m[7]  = 0;
    m[8]  = 0;                       m[9]  = 0;           m[10] =  -(_rFar + _rNear) * radian;  m[11] = -1;
    m[12] = 0;                       m[13] = 0;           m[14] = -2 * _rNear * _rFar * radian; m[15] = 0;
};


Matrix4x4.prototype.setLookAtVec   = function( _rEye, _rCenter, _rCameraUp)
{
    var fVec  = _rCenter.substract(_rEye);
    fVec.normalize();
    
    var cP  =  fVec.getCrossProduct(_rCameraUp);
    cP.normalize();
    
    var up  = cP.getCrossProduct(fVec);
    up.normalize();
    
    var matrix  = this.m;
    matrix[0]   = cP.x;      matrix[1]   = cP.x;      matrix[2]   = -fVec.x;        matrix[3]   = 0;
    matrix[4]   = cP.y;      matrix[5]   = up.y;      matrix[6]   = -fVec.y;        matrix[7]   = 0;
    matrix[8]   = cP.z;      matrix[9]   = up.z;      matrix[10]  = -fVec.z;        matrix[11]  = 0;
    matrix[12]  = 0;         matrix[13]  = 0;         matrix[14]  = 0;              matrix[15]  = 1;
    
    return this.translate( -_rCameraUp.x, -_rCameraUp.y, -_rCameraUp.z);
};

Matrix4x4.prototype.setLookAt   = function( _rEye_x, _rEye_y, _rEye_z, _rCenter_x, _rCenter_y, _rCenter_z,
_rCameraUpVec_x, _rCameraUpVec_y, _rCameraUpVec_z)
{
    var fx  = _rCenter_x - _rEye_x;
    var fy  = _rCenter_y - _rEye_y;
    var fz  = _rCenter_z - _rEye_z;
    
    // Noarmalize f
    var rf  = 1 / Math.sqrt( fx *fx + fy *fy + fz *fz);
    fx  *= rf;
    fy  *= rf;
    fz  *= rf;
    
    // Calculate cross prodct of f and up
    var cpX = fy * _rCameraUpVec_z - fz * _rCameraUpVec_y;
    var cpY = fz * _rCameraUpVec_x - fx * _rCameraUpVec_z;
    var cpZ = fx * _rCameraUpVec_y - fy * _rCameraUpVec_x;
    
    // Normalize cp
    var rs  = 1/ Math.sqrt(cpX *cpX + cpY *cpY + cpZ *cpZ);

    cpX  *= rs;
    cpY  *= rs;
    cpZ  *= rs;
    
        
    // Calculate cross product of cp and f
    var upX = cpY * fz - cpZ * fy;
    var upY = cpZ * fx - cpX * fz;
    var upZ = cpX * fy - cpY * fx;
    

    // Set to this.
    this.m[0]   = cpX;      this.m[1]   = upX;      this.m[2]   = -fx;        this.m[3]   = 0;
    this.m[4]   = cpY;      this.m[5]   = upY;      this.m[6]   = -fy;        this.m[7]   = 0;
    this.m[8]   = cpZ;      this.m[9]   = upZ;      this.m[10]  = -fz;        this.m[11]  = 0;
    this.m[12]  = 0;        this.m[13]  = 0;        this.m[14]  = 0;          this.m[15]  = 1;
    
    return this.translate( -_rEye_x, -_rEye_y, -_rEye_z);
};


Matrix4x4.prototype.translate   = function(_x, _y, _z)
{
    this.m[12]  += this.m[0] * _x + this.m[4] * _y + this.m[8] * _z;
    this.m[13]  += this.m[1] * _x + this.m[5] * _y + this.m[9] * _z;
    this.m[14]  += this.m[2] * _x + this.m[6] * _y + this.m[10]* _z;
    this.m[15]  += this.m[3] * _x + this.m[7] * _y + this.m[11]* _z;
};


// translate by vector3D
Matrix4x4.prototype.move    = function(_rVec)
{
    this.m[12]  += this.m[0] * _rVec.x + this.m[4] * _rVec.y + this.m[8] * _rVec.z;
    this.m[13]  += this.m[1] * _rVec.x + this.m[5] * _rVec.y + this.m[9] * _rVec.z;
    this.m[14]  += this.m[2] * _rVec.x + this.m[6] * _rVec.y + this.m[10]* _rVec.z;
    this.m[15]  += this.m[3] * _rVec.x + this.m[7] + _rVec.y + this.m[11]* _rVec.z;    
};


Matrix4x4.prototype.inverse = function()
{
    return this.setInverseOf(this);
};


//  Multiply the matrix from the right
Matrix4x4.prototype.concat  = function( _rOther)
{
    var a   = this.m;
    var b   = _rOther.m;
    
    // if e equals param, copy b to temporary matrix
    if(this.m === b)
    {
        b   = new Float32Array(16);
        
        for( var iter = 0 ; iter < 16 ; ++iter)
        {
            b[iter] = this.m[iter];
        }
    }
    
    var ai0 = null;
    var ai1 = null;
    var ai2 = null;
    var ai3 = null;
    
    for( var iter = 0 ; iter < 4 ; iter ++)
    {
        ai0  = a[iter];     ai1  = a[iter+4];   ai2  = a[iter +8];  ai3  = a[iter+12];
        
        this.m[iter]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
        this.m[iter+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
        this.m[iter+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
        this.m[iter+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }
    
    return this;
};
Matrix4x4.prototype.multiply    = Matrix4x4.prototype.concat;


Matrix4x4.prototype.setInverseOf  = function(_rOther)
{
    var s   = _rOther.m;
    var inv = new Float32Array(16);
    
    inv[0]  =   s[5]*s[10]*s[15] - s[5] *s[11]*s[14] - s[9] *s[6]*s[15]
              + s[9]*s[7] *s[14] + s[13]*s[6] *s[11] - s[13]*s[7]*s[10];
    inv[4]  = - s[4]*s[10]*s[15] + s[4] *s[11]*s[14] + s[8] *s[6]*s[15]
              - s[8]*s[7] *s[14] - s[12]*s[6] *s[11] + s[12]*s[7]*s[10];
    inv[8]  =   s[4]*s[9] *s[15] - s[4] *s[11]*s[13] - s[8] *s[5]*s[15]
              + s[8]*s[7] *s[13] + s[12]*s[5] *s[11] - s[12]*s[7]*s[9];
    inv[12] = - s[4]*s[9] *s[14] + s[4] *s[10]*s[13] + s[8] *s[5]*s[14]
              - s[8]*s[6] *s[13] - s[12]*s[5] *s[10] + s[12]*s[6]*s[9];

    inv[1]  = - s[1]*s[10]*s[15] + s[1] *s[11]*s[14] + s[9] *s[2]*s[15]
              - s[9]*s[3] *s[14] - s[13]*s[2] *s[11] + s[13]*s[3]*s[10];
    inv[5]  =   s[0]*s[10]*s[15] - s[0] *s[11]*s[14] - s[8] *s[2]*s[15]
              + s[8]*s[3] *s[14] + s[12]*s[2] *s[11] - s[12]*s[3]*s[10];
    inv[9]  = - s[0]*s[9] *s[15] + s[0] *s[11]*s[13] + s[8] *s[1]*s[15]
              - s[8]*s[3] *s[13] - s[12]*s[1] *s[11] + s[12]*s[3]*s[9];
    inv[13] =   s[0]*s[9] *s[14] - s[0] *s[10]*s[13] - s[8] *s[1]*s[14]
              + s[8]*s[2] *s[13] + s[12]*s[1] *s[10] - s[12]*s[2]*s[9];

    inv[2]  =   s[1]*s[6]*s[15] - s[1] *s[7]*s[14] - s[5] *s[2]*s[15]
              + s[5]*s[3]*s[14] + s[13]*s[2]*s[7]  - s[13]*s[3]*s[6];
    inv[6]  = - s[0]*s[6]*s[15] + s[0] *s[7]*s[14] + s[4] *s[2]*s[15]
              - s[4]*s[3]*s[14] - s[12]*s[2]*s[7]  + s[12]*s[3]*s[6];
    inv[10] =   s[0]*s[5]*s[15] - s[0] *s[7]*s[13] - s[4] *s[1]*s[15]
              + s[4]*s[3]*s[13] + s[12]*s[1]*s[7]  - s[12]*s[3]*s[5];
    inv[14] = - s[0]*s[5]*s[14] + s[0] *s[6]*s[13] + s[4] *s[1]*s[14]
              - s[4]*s[2]*s[13] - s[12]*s[1]*s[6]  + s[12]*s[2]*s[5];

    inv[3]  = - s[1]*s[6]*s[11] + s[1]*s[7]*s[10] + s[5]*s[2]*s[11]
              - s[5]*s[3]*s[10] - s[9]*s[2]*s[7]  + s[9]*s[3]*s[6];
    inv[7]  =   s[0]*s[6]*s[11] - s[0]*s[7]*s[10] - s[4]*s[2]*s[11]
              + s[4]*s[3]*s[10] + s[8]*s[2]*s[7]  - s[8]*s[3]*s[6];
    inv[11] = - s[0]*s[5]*s[11] + s[0]*s[7]*s[9]  + s[4]*s[1]*s[11]
              - s[4]*s[3]*s[9]  - s[8]*s[1]*s[7]  + s[8]*s[3]*s[5];
    inv[15] =   s[0]*s[5]*s[10] - s[0]*s[6]*s[9]  - s[4]*s[1]*s[10]
              + s[4]*s[2]*s[9]  + s[8]*s[1]*s[6]  - s[8]*s[2]*s[5];

    var det = s[0]*inv[0] + s[1]*inv[4] + s[2]*inv[8] + s[3]*inv[12];
    
    if(det === 0)
        return this;
    
    det = 1 / det;
    
    for( var iter = 0 ; iter < 16 ; iter ++)
        this.m[iter] = inv[iter] * det;
    
    return this;
};


Matrix4x4.prototype.transpose   = function()
{
    var t = null;

    t = this.m[ 1];  this.m[ 1] = this.m[ 4];  this.m[ 4] = t;
    t = this.m[ 2];  this.m[ 2] = this.m[ 8];  this.m[ 8] = t;
    t = this.m[ 3];  this.m[ 3] = this.m[12];  this.m[12] = t;
    t = this.m[ 6];  this.m[ 6] = this.m[ 9];  this.m[ 9] = t;
    t = this.m[ 7];  this.m[ 7] = this.m[13];  this.m[13] = t;
    t = this.m[11];  this.m[11] = this.m[14];  this.m[14] = t;

    return this;    
};


Matrix4x4.prototype.multiplyVector3 = function(_rVec) 
{

    var result = new Vector3D(0, 0, 0);

    result.x = _rVec.x * this.m[0] + _rVec.y * this.m[4] + _rVec.z * this.m[ 8] + this.m[12];
    result.y = _rVec.x * this.m[1] + _rVec.y * this.m[5] + _rVec.y * this.m[ 9] + this.m[13];
    result.z = _rVec.x * this.m[2] + _rVec.y * this.m[6] + _rVec.y * this.m[10] + this.m[14];

    return result;
};


Matrix4x4.prototype.setOrtho = function(left, right, bottom, top, near, far) 
{
    var e, rw, rh, rd;

    if (left === right || bottom === top || near === far) {
      throw 'null frustum';
    }

    rw = 1 / (right - left);
    rh = 1 / (top - bottom);
    rd = 1 / (far - near);

    e = this.m;

    e[0]  = 2 * rw;
    e[1]  = 0;
    e[2]  = 0;
    e[3]  = 0;

    e[4]  = 0;
    e[5]  = 2 * rh;
    e[6]  = 0;
    e[7]  = 0;

    e[8]  = 0;
    e[9]  = 0;
    e[10] = -2 * rd;
    e[11] = 0;

    e[12] = -(right + left) * rw;
    e[13] = -(top + bottom) * rh;
    e[14] = -(far + near) * rd;
    e[15] = 1;

    return this;
};