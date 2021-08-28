/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var Vector2D    = function(_s, _t)
{
    this.s  = _s;
    this.t  = _t;
};


var Vector3D    = function(_x, _y, _z)
{
    this.x = _x;
    this.y = _y;
    this.z = _z;
    
    if(this.x === undefined)
        this.x  = 0.;
    
    if(this.y === undefined)
        this.y  = 0.;
    
    if(this.z === undefined)
        this.z  = 0.;
};


var Vector4D    = function(_x, _y, _z, _w)
{
    this.x  = _x;
    this.y  = _y;
    this.z  = _z;
    this.w  = _w;
    
    if(this.x === undefined)
        this.x  = 0.;
    
    if(this.y === undefined)
        this.y  = 0.;
    
    if(this.z === undefined)
        this.z  = 0.;
    
    if(this.w === undefined)
        this.w  = 0.;
};


Vector3D.prototype.set      = function(_rVec)
{
    this.x  = _rVec.x;
    this.y  = _rVec.y;
    this.z  = _rVec.z;
};


Vector3D.prototype.substract    = function(_rVec)
{
    this.x  -= _rVec.x;
    this.y  -= _rVec.y;
    this.z  -= _rVec.z;
    
    return this;
};


Vector3D.prototype.getCrossProduct = function( _rVec)
{
    var result  = new Vector3D(this.x, this.y, this.z);
    
    result.x = this.y * _rVec.z - this.z * _rVec.y;
    result.y = this.z * _rVec.x - this.x * _rVec.z;
    result.z = this.x * _rVec.y - this.y * _rVec.x;
    
    return result;
};


Vector3D.prototype.crossProduct = function( _rVec)
{
    var result  = new Vector3D(this.x, this.y, this.z);
    
    result.x = this.y * _rVec.z - this.z * _rVec.y;
    result.y = this.z * _rVec.x - this.x * _rVec.z;
    result.z = this.x * _rVec.y - this.y * _rVec.x;
    
    this.set(result);
    
    return this;
};


Vector3D.prototype.getNormalVector    = function(p1, p2)
{
    var v0              = new Vector3D();
    var v1              = new Vector3D();
    var crossProduct    = new Vector3D();
    
    v0.x   = this.x - p1.x;
    v0.y   = this.y - p1.y;
    v0.z   = this.z - p1.z;
    
    v1.x   = p2.x - p1.x;
    v1.y   = p2.y - p1.y;
    v1.z   = p2.z - p1.z;
    
    
    crossProduct.x = v0.y * v1.z - v0.z * v1.y;
    crossProduct.y = v0.z * v1.y - v1.y * v1.x;
    crossProduct.z = v0.x * v1.y - v0.y * v1.x;
    
    //var v   = new Vector3(crossProduct);
    //v.normalize();
    crossProduct.normalize();
    return crossProduct;
};


Vector3D.prototype.normalize    = function()
{
    var length =   Math.sqrt(this.x *this.x + this.y * this.y + this.z * this.z);
    
    this.x = this.x / length;
    this.y = this.y / length;
    this.z = this.z / length;
    
    return this;
};

Vector3D.prototype.getNormalize   = function()
{
    var vResult = new Vector3D();
    var length  =   Math.sqrt(this.x *this.x + this.y * this.y + this.z * this.z);
    
    vResult.x = this.x / length;
    vResult.y = this.y / length;
    vResult.z = this.z / length;
    
    return vResult;
};