function setFPS(_pFPS)
{
    _pFPS.setMode(0);
    
    // Align top-left
    _pFPS.domElement.style.position = 'absolute';
    _pFPS.domElement.style.left     = '11px';
    _pFPS.domElement.style.top      = '11px';//'34px';

    document.body.appendChild( _pFPS.domElement );     
};