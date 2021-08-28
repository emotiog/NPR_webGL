
function Shader()
{
    this.VERTEX_RESOURCE     = null;
    this.FRAG_RESOURCE       = null;

    this.mVertexShader        = null;
    this.mFragmentShader      = null;
    
    this.mProgram             = null;
};


Shader.prototype.initContext    = function(gl)
{
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext('webgl');
    
    gl.viewportWidth   = canvas.width;
    gl.viewportHeight  = canvas.height;
    
    if (!_pGL) 
    {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }    
};


Shader.prototype.setShader = function(_pGL, _rVertexSource, _rFragSource)
{
    this.VERTEX_RESOURCE = this._loadFile(_rVertexSource + '.vs');
    this.FRAG_RESOURCE   = this._loadFile(_rFragSource   + '.fs');
    
    // Initialize shaders
    if (!this._initShaders(_pGL, this.VERTEX_RESOURCE, this.FRAG_RESOURCE)) 
    {
        console.log('Failed to intialize shaders.');
        return;
    }
};


Shader.prototype._loadFile   = function(url)
{
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    var data    = null;
    
    request.open('GET', url, false);
    request.send();    
 
    if (request.readyState === 4) 
    {
        // If we got HTTP status 200 (OK)
        if (request.status === 200) 
        {
            data = request.responseText;
        } 
        else 
        { // Failed
            alert('Failed to download \"' + url + '\"');
        }
    }

    return data;
};

// 수정할 부분 - 사용 하는 프로그램이 다를 것이기 때문에 다른 프로그램을 매개변수로
// 대입
Shader.prototype._initShaders = function(_pGL, vShader, fShader)
{
    this.mProgram = this._createProgram(_pGL, vShader, fShader);

    if (!this.mProgram) 
    {
        console.log('Failed to create program');
        return false;
    }

    return true;
};


Shader.prototype._loadShader    = function(_pGL, _rType, _rSource)
{
    var shader  = _pGL.createShader(_rType);
    
    if(shader === null)
    {
        console.log('unable to create shader');
        return null;
    }
    
    _pGL.shaderSource(shader, _rSource);
    
    _pGL.compileShader(shader);
    
    var compiled    = _pGL.getShaderParameter(shader, _pGL.COMPILE_STATUS);
    
    if(!compiled)
    {
        var error = _pGL.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        _pGL.deleteShader(shader);
    
        return null;
    }
    
    return shader;
};


Shader.prototype._createProgram  = function(_pGL, vShader, fShader)
{
    this.mVertexShader    = this._loadShader(_pGL, _pGL.VERTEX_SHADER, vShader);
    this.mFragmentShader  = this._loadShader(_pGL, _pGL.FRAGMENT_SHADER, fShader);
    
    if(!this.mVertexShader || !this.mFragmentShader)
    {
        console.log('Failed to load Shader');
        return null;
    }
    
    var program = _pGL.createProgram();
    
    if(!program)
    {
        console.log('Failed to create program');
        return null;
    }
    
    _pGL.attachShader(program, this.mVertexShader);
    _pGL.attachShader(program, this.mFragmentShader);
    
    _pGL.linkProgram(program);
    
    var linked  = _pGL.getProgramParameter(program, _pGL.LINK_STATUS);
    
    if(!linked)
    {
        var error = _pGL.getProgramInfoLog(program);
        
        console.log('Failed to link program:' + error);
        
        _pGL.deleteProgram(program);
        _pGL.deleteShader(this.mFragmentShader);
        _pGL.deleteShader(this.mVertexShader);
        
        return null;
    }
    
    return program;
};


Shader.prototype.terminateContext   = function(_pGL)
{
    if(!this.mProgram)
    {
        _pGL.deleteProgram(this.mProgram);
        this.mProgram = null;
    }
    
    if(!this.mFragmentShader)
    {
        _pGL.deleteShader(this.mFragmentShader);
        this.mFragmentShader    = null;
    }
    
    if(!this.mVertexShader)
    {
        _pGL.deleteShader(this.mVertexShader);
        this.mVertexShader  = null;
    };
    
    _pGL = null;
};


// vertex shader의 변수가 무엇이냐에 따라서 다른 특성을 대입해야 한다.
// 대입한 특성 4개
Shader.prototype.initAttribLocation = function(_pGL)
{
    this.a_Position = _pGL.getAttribLocation(this.mProgram, 'a_Position');
//    _pGL.a_Position = _pGL.getAttribLocation(this.mProgram, 'a_Position');

    if( this.a_Position < 0)
    {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    
    this.a_Color =  _pGL.getAttribLocation(this.mProgram, 'a_Color');
    //_pGL.a_Color = _pGL.getAttribLocation(this.mProgram, 'a_Color');
    
    if (this.a_Color < 0) 
    {
        console.log('Failed to get the storage location of a_Color');
        return;
    }
    
    this.a_Normal = _pGL.getAttribLocation(this.mProgram, 'a_Normal');
    
    if (this.a_Normal < 0) 
    {
        console.log('Failed to get the storage location of a_Normal');
        return;
    }
    
    this.a_TexCoord = _pGL.getAttribLocation(this.mProgram, 'a_TexCoord');
    
    if (this.a_TexCoord < 0) 
    {
        console.log('Failed to get the storage location of a_TexCoord');
        return;
    }    
};


Shader.prototype.getAttribLocation  = function(_pGL, a_string)
{
    return _pGL.getAttribLocation(_pGL.mProgram, a_string);
};


Shader.prototype.setLightEnable   = function(_pCamera)
{
     // each shader will draw - fragment Part
    var lightPosition   = _pCamera.setLightPosition(_pCamera.getTargetPosition());
        
    var uniformColor      = this.getUniformLocation('u_LightColor');
    var uniformPosition   = this.getUniformLocation('u_LightPosition');
    var uniformAmbient    = this.getUniformLocation('u_AmbientLight');
    
    this.uniform3f(uniformColor,    0.7, 0.7, 0.7);
    this.uniform3f(uniformPosition, lightPosition.x, lightPosition.y, lightPosition.z);
    this.uniform3f(uniformAmbient, 0.3, 0.3, 0.3);
};


Shader.prototype.setLightDisable    = function()
{
    this.uniform3f(this.getUniformLocation('u_LightColor'),    0.0, 0.0, 0.0);
    this.uniform3f(this.getUniformLocation('u_LightPosition'), 0.0, 0.0, 0.0);
    this.uniform3f(this.getUniformLocation('u_AmbientLight'), 0.3, 0.3, 0.3);
};


Shader.prototype.getProgram = function()
{
    return this.mProgram;
};


Shader.prototype.getUniformLocation = function(_pGL, u_string)
{
    return _pGL.getUniformLocation(this.mProgram, u_string);
};


Shader.prototype.uniformMatrix4fv   = function(_pGL, _rUniformLocation, _pMatrix)
{
    return _pGL.uniformMatrix4fv(_rUniformLocation, false, _pMatrix.m);
};


Shader.prototype.uniform3f  = function(_pGL, uniformParam, value1, value2, value3)
{
    _pGL.uniform3f(uniformParam, value1, value2, value3);
};


Shader.prototype.uniform2f  = function(_pGL, uniformParam, _rValue1, _rValue2)
{
    _pGL.uniform2f(uniformParam, _rValue1, _rValue2);
};


Shader.prototype.uniform1f  = function(_pGL, uniformParam, _rValue)
{
    _pGL.uniform1f(uniformParam, _rValue);
};


Shader.prototype.uniform1i  = function(_pGL, uniformParam, _rValue)
{
    _pGL.uniform1i(uniformParam, _rValue);    
};


Shader.prototype.clearColor = function(_pGL, _r, _g, _b, _a)
{
    _pGL.clearColor(_r, _g, _b, _a);
};


Shader.prototype.clear  = function(_pGL,  _param)
{
    _pGL.clear(_param);
};


Shader.prototype.enable = function(_pGL)
{
    _pGL.useProgram( this.mProgram);
};


Shader.prototype.disable    = function(_pGL)
{
    _pGL.useProgram( null);
};