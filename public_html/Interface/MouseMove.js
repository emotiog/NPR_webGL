
/*
gRenderer.mCanvas.onmousedown   = handleMouseDown;
gRenderer.mCanvas.oncontextmenu = function(ev) {return false;};
document.onmouseup = handleMouseUp;
document.onmousemove = handleMouseMove;

var mouseLeftDown   = false;
var mouseRightDown  = false;

var azimuth     = 0;
var elevation   = 0;
var radius      = 10;

function handleMouseDown(event) 
{
    if( event.button === 2 ) 
    {
        mouseLeftDown = false;
        mouseRightDown = true;
    }
    else 
    {
        mouseLeftDown = true;
        mouseRightDown = false;
    }
    
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) 
{
    mouseLeftDown = false;
    mouseRightDown = false;
    
    time = 0;
}

function handleMouseMove(event) 
{
    if (!(mouseLeftDown || mouseRightDown)) 
    {
        return;
    }

    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;

    if( mouseLeftDown )
    {
        azimuth += 0.01 * deltaX;
        elevation += 0.01 * deltaY;
        elevation = Math.min(Math.max(elevation, -Math.PI/2+0.001), Math.PI/2-0.001);
    }
    else
    {
        radius += 0.01 * deltaY;
        radius = Math.min(Math.max(radius, 2.0), 30.0);
    }
    eye = sphericalToCartesian(radius, azimuth, elevation);

    //mat4.lookAt(eye, center, up, view);
    gRenderer.mCamera.setLookAtVec(eye, center, up);

    lastMouseX = newX;
    lastMouseY = newY;
};

function handleMouseWheel( event )
{
    gRenderer.mCamera.move(event.wheelDelta/10);    
};

function sphericalToCartesian(radius, azimuth, elevation)
{
    var x = radius * sin(azimuth) * cos(elevation);
    var y = radius * sin(azimuth) * sin(elevation);
    var z = radius * cos(azimuth);
    
    var vec = new Vector3D();
    
    vec.x = x;
    vec.y = y;
    vec.z = z;
    
    return vec;
};
*/

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

function handleMouseDown(event) 
{
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) 
{
    mouseDown = false;
}

function handleMouseMove(event) 
{
    if (!mouseDown) 
    {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;
    
  //  gRenderer.mCamera.rotateX(deltaX);
    gRenderer.mCamera.moveSidewalk(deltaX);
    //gRenderer.mCamera.moveFor(deltaX, deltaY, 0);
    //gRenderer.mCamera.moveUpward(deltaY);
    lastMouseX = newX;
    lastMouseY = newY;
};

function handleMouseWheel( event )
{
    gRenderer.mCamera.move(event.wheelDelta/10);    
};
