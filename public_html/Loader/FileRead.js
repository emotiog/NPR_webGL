


function loadObj(_rFilePath, _pModel) 
{
    var request = new XMLHttpRequest();

    request.onreadystatechange  = function()
    {
        if(request.readyState === 4 && request.status   !== 404)
        {
            _onReadObj(request.responseText, _rFilePath, _pModel);
            _pModel.mState = ON_STATE.ON_READ;
        }
    };

    request.open('GET', _rFilePath + _pModel.mFileName, true);
    request.send();
};


function _onReadObj(fileString, _rFilePath, _pModel) 
{
    _pModel.mFilePath   = _rFilePath;
    _pModel._parse(fileString);
    
    if(!_pModel.isNormal())
    {
        _pModel.createNormalVectorByFace();
    }
    
    if(_pModel === null)
    {
        console.log('OBJ file parsing error');       
        return null;
    }
};
