/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Face    = function(name)
{
    this.mName  = name;
    
    if(name === null)
        this.mName  = "";
    
    this.mVindices  = new Array(0);
    this.mTindices  = new Array(0);
    this.mNindices  = new Array(0);
};


var GroupFace   = function(_gName)
{
    this.mName      = _gName;
    this.mFace      = new Array(0);
    this.mFaceIndex = 0;
};


GroupFace.prototype.addFace = function(face)
{
    this.mFace.push(face);
    this.mFaceIndex += face.mIndex;
};


Face.prototype.setNormalVector  = function(_vertices)
{
    var vInstance   = _vertices[this.mNindices[0]];
    var vResult     = null;
    
    var vParam  = [ 
                    _vertices[this.mNindices[1]],
                    _vertices[this.mNindices[2]]
                ];
                
    vResult = vInstance.getNormalVector(vParam[0], vParam[1]);
    
    if(vResult === null)
    {
        vParam[2]   = _vertices[this.mNindices[3]];
        vResult     = vParam[0].getNormalVector(vParam[1], vParam[2]);
    }
    
    if(vResult === null)
    {
        vResult.x   = 0.;
        vResult.y   = 1.;
        vResult.z   = 0.;
    }
};