var gRenderer   = new Renderer('NPR render');
var gModel      = new Array();

var gHatchingTexture = new HatchingTextureSet();

var gbFrameBufferOn = true;
//var gTotalLoadingTime   = 0;
var g_bBlend    = true;

function webGLMain()
{
    var _FPSstats = new Stats();
    setFPS(_FPSstats);

    gRenderer.mCanvas.onmousedown   = handleMouseDown;
    document.onmouseup              = handleMouseUp;
    document.onmousemove            = handleMouseMove;
    document.onmousewheel           = handleMouseWheel;
 
    var objLoader   = new Array();
    
    objLoad(objLoader);
    gHatchingTexture.initTexture(gRenderer.mGL);
    
    var _timer      = new Date();
    var prevTime    = _timer.getTime();
    
    
    document.onkeydown  = function(_rEvent)
    {
        switch(_rEvent.keyCode)
        {
            case 48:    // 0
                //gRenderer.terminate();
                for(var i = 0 ; i < gModel.length ; i++)
                {
                    gModel[i].mSilhouette = Silhouette.SILHOUETTE_DISABLE;
                }
                break;
                
            case 49:    // 1
                for(var i = 0 ; i < gModel.length ; i++)
                {
                    gModel[i].mSurface = Surface.SURFACE_PHOTOREALISTIC;
                }
                break;
            
            case 50:    // 2
                for(var i = 0 ; i < gModel.length ; i ++)
                {
                    gModel[i].mSurface = Surface.SURFACE_CARTOON;
                }
                break;
            
            //case 50:    // 2
            //    for(var i = 0 ; i < gModel.length ; i ++)
            //        gModel[i].mSurface = Surface.SURFACE_HATCHING;                
            //    break;
                
            case 51:    // 3
                for(var i = 0 ; i < gModel.length ; i ++)
                {
                    gModel[i].mSurface = Surface.SURFACE_CARTOON;
                }
                break;
                
            case 56:    // 8
                for(var i = 0 ; i < gModel.length ; i ++)
                {                   
                    gModel[i].mSilhouette   = Silhouette.SILHOUETTE_COMPONENT;
                }
                break;
                
            case 57:    // 9
                for(var i = 0 ; i < gModel.length ; i ++)
                {
                    gModel[i].mSilhouette   = Silhouette.SILHOUETTE_OUTLINE;
                }
                break;
                
            case 52:    // 4
                for(var i = 0 ; i < gModel.length ; i ++)
                    gModel[i].mSurface = Surface.SURFACE_CARTOON;
                
                for(var i = 0 ; i < gModel.length ; i += 5)
                {
                    gModel[i].mSilhouette   = Silhouette.SILHOUETTE_OUTLINE;
                    gModel[i].mSurface      = Surface.SURFACE_PHOTOREALISTIC;
                }
                
                gModel[ 8].mSilhouette   = Silhouette.SILHOUETTE_COMPONENT;
                gModel[20].mSilhouette   = Silhouette.SILHOUETTE_COMPONENT;
                
                gModel[16].mSurface      = Surface.SURFACE_PHOTOREALISTIC;
                gModel[16].mSilhouette   = 5;   // 16 target
                break;    
                
            //case 53:    // 5
            //    for(var i = 0 ; i < gModel.length ; i ++)
            //    {
            //        gModel[i].mSurface  = Surface.SURFACE_HATCH_CARTOON;
            //    }
            //    break;

            case 54:
                for(var i = 0 ; i < gModel.length ; i ++)
                {
                    gModel[i].mSurface  = Surface.SURFACE_TARGET;
                }
                break;
           
            case 55: // 7
                g_bBlend = !g_bBlend;
                break;
                
            case 76:    // L
                gbFrameBufferOn = !gbFrameBufferOn;
                break;
                
            case 81:    // Q
                gRenderer.mCamera.moveForward(10);
                break;
        
            case 69:    // E
                gRenderer.mCamera.moveForward(-10);
                //gRenderer.mLightPosition.y += 5000;
                break;
                
            case 87:    // W
                gRenderer.mCamera.moveUpward(10);
                //gRenderer.mLightPosition.x += 10;
                break;
                
            case 83:    // S
                gRenderer.mCamera.moveUpward(-10);
                //gRenderer.mLightPosition.x += 5000;
                break;
                
            case 65:    // A
                gRenderer.mCamera.moveSidewalk(-10);
                break;
                
            case 68:    // D
                gRenderer.mCamera.moveSidewalk(10);
                break;
                
            case 90:    // Z
                gRenderer.mCamera.rotate();
        }
        //this.mGL.clearColor(0.3, 0.3, 0.3, 1.0);
    };
    
    var Tick    = function()
    {
        var curTimer    = new Date();
        var curTime     = curTimer.getTime();

        var elapseTime  = curTime   - prevTime; 
        //gTotalLoadingTime += elapseTime;

        if(elapseTime >= 10)
        {
            prevTime  = curTime;
        }

// initModel
        for(var iter = 0 ; iter < objLoader.length ; iter++)
        {
            if(objLoader[iter].mState === ON_STATE.ON_READ)
            {
                var model   = new Model();
                
                if(model.convertFromLoader(gRenderer.mGL, objLoader[iter]))
                {
                    model.createTexture(gRenderer.mGL, objLoader[iter]);
                    model.connectTexture();
                    model.translate(-202530.0, 0.0, 443700.0);
                    gModel.push(model);   
                    //if(gModel.length === 22)
                    //    alert(gTotalLoadingTime);
                }
            }
        }

        DrawScene(gRenderer, gModel);
        
        _FPSstats.update();
        requestAnimationFrame(Tick);
    };
   
    Tick();
};


function DrawScene(_pRender, _pModel)
{
    _pRender.clear();   // base - GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT
    _pRender.clearColor(0.95, 0.95, 0.95, 1.0);
    
    _pRender._renderModels(_pModel);
};

function objLoad(_pLoader)
{
    _pLoader.push(new OBJ('3687248.obj'));
    _pLoader.push(new OBJ('3687250.obj'));
    _pLoader.push(new OBJ('3687271.obj'));
    _pLoader.push(new OBJ('3687274.obj'));
    _pLoader.push(new OBJ('3694891.obj'));
    
    _pLoader.push(new OBJ('3697905.obj'));
    _pLoader.push(new OBJ('3697909.obj'));
    _pLoader.push(new OBJ('3706218.obj'));
    _pLoader.push(new OBJ('3706220.obj'));
    _pLoader.push(new OBJ('3706243.obj'));
    
    _pLoader.push(new OBJ('3714392.obj'));
    _pLoader.push(new OBJ('3714394.obj'));      
    _pLoader.push(new OBJ('3714395.obj'));
    _pLoader.push(new OBJ('3714404.obj'));
    _pLoader.push(new OBJ('3714405.obj'));   
    
    _pLoader.push(new OBJ('3714417.obj'));
    _pLoader.push(new OBJ('3714468.obj'));
    _pLoader.push(new OBJ('3714499.obj'));
    _pLoader.push(new OBJ('3725436.obj'));
    _pLoader.push(new OBJ('3725439.obj'));
    
    _pLoader.push(new OBJ('3725441.obj'));
    _pLoader.push(new OBJ('3725447.obj'));      
        // 22
    for(var modelNumber = 0 ; modelNumber < _pLoader.length ; modelNumber++)
    {
        loadObj("Models/", _pLoader[modelNumber]);
    }
};


function allObjLoad(_pLoader)
{
    /*
    //_pLoader.push(new OBJ('3687224.obj'));
    //_pLoader.push(new OBJ('3687236.obj'));
    
    //_pLoader.push(new OBJ('3687238.obj'));
    //_pLoader.push(new OBJ('3687241.obj'));
    //_pLoader.push(new OBJ('3687244.obj'));
    //_pLoader.push(new OBJ('3687246.obj'));
    //_pLoader.push(new OBJ('3687247.obj'));
    */
    _pLoader.push(new OBJ('3687248.obj'));
    _pLoader.push(new OBJ('3687250.obj'));
    //_pLoader.push(new OBJ('3687251.obj'));      // 10
    
    //_pLoader.push(new OBJ('3687261.obj'));
    _pLoader.push(new OBJ('3687271.obj'));
    _pLoader.push(new OBJ('3687274.obj'));
    //_pLoader.push(new OBJ('3687276.obj'));
    //_pLoader.push(new OBJ('3687459.obj'));
    //_pLoader.push(new OBJ('3687500.obj'));
    //_pLoader.push(new OBJ('3687501.obj'));
    /*
    _pLoader.push(new OBJ('3687502.obj'));
    _pLoader.push(new OBJ('3687503.obj'));
    _pLoader.push(new OBJ('3687516.obj'));      // 20
    
    _pLoader.push(new OBJ('3687537.obj'));
    _pLoader.push(new OBJ('3687553.obj'));
    _pLoader.push(new OBJ('3687561.obj'));
    _pLoader.push(new OBJ('3687571.obj'));
    _pLoader.push(new OBJ('3687578.obj'));
    _pLoader.push(new OBJ('3694855.obj'));*/
    _pLoader.push(new OBJ('3694891.obj'));
    /*
    _pLoader.push(new OBJ('3694910.obj'));
    _pLoader.push(new OBJ('3695118.obj'));
    _pLoader.push(new OBJ('3695130.obj'));      // 30
    
    _pLoader.push(new OBJ('3697885.obj'));
    _pLoader.push(new OBJ('3697900.obj'));
    _pLoader.push(new OBJ('3697901.obj'));      */
    _pLoader.push(new OBJ('3697905.obj'));
    //_pLoader.push(new OBJ('3697909.obj'));
    _pLoader.push(new OBJ('3706218.obj'));
    _pLoader.push(new OBJ('3706220.obj'));
    _pLoader.push(new OBJ('3706243.obj'));
    //_pLoader.push(new OBJ('3714392.obj'));
    _pLoader.push(new OBJ('3714394.obj'));      // 40
    
    _pLoader.push(new OBJ('3714395.obj'));
    _pLoader.push(new OBJ('3714404.obj'));
    _pLoader.push(new OBJ('3714405.obj'));      
    _pLoader.push(new OBJ('3714417.obj'));
    _pLoader.push(new OBJ('3714468.obj'));
    _pLoader.push(new OBJ('3714499.obj'));
    _pLoader.push(new OBJ('3725436.obj'));
    _pLoader.push(new OBJ('3725439.obj'));
    _pLoader.push(new OBJ('3725441.obj'));
    _pLoader.push(new OBJ('3725447.obj'));      // 50
    
/*        
    _pLoader.push(new OBJ('3725452.obj'));
    _pLoader.push(new OBJ('3725460.obj'));
    _pLoader.push(new OBJ('3725468.obj'));      
    _pLoader.push(new OBJ('3725502.obj'));
    _pLoader.push(new OBJ('3725507.obj'));
    _pLoader.push(new OBJ('3725513.obj'));
    _pLoader.push(new OBJ('3725746.obj'));
    _pLoader.push(new OBJ('3725750.obj'));
    _pLoader.push(new OBJ('3725757.obj'));
    _pLoader.push(new OBJ('3725759.obj'));      // 60
        
    _pLoader.push(new OBJ('3725774.obj'));
    _pLoader.push(new OBJ('3725794.obj'));
    _pLoader.push(new OBJ('3725802.obj'));      
    _pLoader.push(new OBJ('3726670.obj'));
    _pLoader.push(new OBJ('3726676.obj'));
    _pLoader.push(new OBJ('3726678.obj'));
    _pLoader.push(new OBJ('3726685.obj'));
    _pLoader.push(new OBJ('3726691.obj'));
    _pLoader.push(new OBJ('3726693.obj'));
    _pLoader.push(new OBJ('3726701.obj'));      // 70
        
    _pLoader.push(new OBJ('3730512.obj'));
    _pLoader.push(new OBJ('3730517.obj'));
    _pLoader.push(new OBJ('3730525.obj'));      
    _pLoader.push(new OBJ('3733482.obj'));
    _pLoader.push(new OBJ('3733539.obj'));
    _pLoader.push(new OBJ('3733543.obj'));
    _pLoader.push(new OBJ('3733544.obj'));
    _pLoader.push(new OBJ('3733791.obj'));
    _pLoader.push(new OBJ('3733822.obj'));
    _pLoader.push(new OBJ('3741432.obj'));      // 80
        
    _pLoader.push(new OBJ('3741444.obj'));
    _pLoader.push(new OBJ('3741445.obj'));
    _pLoader.push(new OBJ('3741449.obj'));      
    _pLoader.push(new OBJ('3741457.obj'));
    _pLoader.push(new OBJ('3741458.obj'));
    _pLoader.push(new OBJ('3741490.obj'));
    _pLoader.push(new OBJ('3741546.obj'));
    _pLoader.push(new OBJ('3741692.obj'));
    _pLoader.push(new OBJ('3741697.obj'));
    _pLoader.push(new OBJ('3741698.obj'));      // 90
        
    _pLoader.push(new OBJ('3741744.obj'));
    _pLoader.push(new OBJ('3741751.obj'));
    _pLoader.push(new OBJ('3741766.obj'));      
    _pLoader.push(new OBJ('3741769.obj'));
    _pLoader.push(new OBJ('3741778.obj'));
    _pLoader.push(new OBJ('3741779.obj'));
    _pLoader.push(new OBJ('3741784.obj'));
    _pLoader.push(new OBJ('4465537.obj'));
    _pLoader.push(new OBJ('4465538.obj'));
    _pLoader.push(new OBJ('4465769.obj'));      // 100
        
    _pLoader.push(new OBJ('4465800.obj'));
    _pLoader.push(new OBJ('4465807.obj'));
    _pLoader.push(new OBJ('4465875.obj'));      
    _pLoader.push(new OBJ('4465940.obj'));
    _pLoader.push(new OBJ('4465951.obj'));
    _pLoader.push(new OBJ('4465993.obj'));
    _pLoader.push(new OBJ('4466026.obj'));
    _pLoader.push(new OBJ('4466028.obj'));
    _pLoader.push(new OBJ('4466030.obj'));
    _pLoader.push(new OBJ('4466034.obj'));      // 110
        
    _pLoader.push(new OBJ('4466071.obj'));
    _pLoader.push(new OBJ('4466081.obj'));
    _pLoader.push(new OBJ('4466114.obj'));      
    _pLoader.push(new OBJ('4466116.obj'));
    _pLoader.push(new OBJ('4466118.obj'));
    _pLoader.push(new OBJ('4466132.obj'));
    _pLoader.push(new OBJ('4466143.obj'));
    _pLoader.push(new OBJ('4466152.obj'));
    _pLoader.push(new OBJ('4466154.obj'));
    _pLoader.push(new OBJ('4466243.obj'));      // 120
        
    _pLoader.push(new OBJ('4466269.obj'));
    _pLoader.push(new OBJ('4466271.obj'));
    _pLoader.push(new OBJ('4479236.obj'));      
    _pLoader.push(new OBJ('4485017.obj'));
    _pLoader.push(new OBJ('4485025.obj'));
    _pLoader.push(new OBJ('4485103.obj'));
    _pLoader.push(new OBJ('4485177.obj'));
    _pLoader.push(new OBJ('4485228.obj'));
    _pLoader.push(new OBJ('4498539.obj'));
    _pLoader.push(new OBJ('4498550.obj'));      // 130
        
    _pLoader.push(new OBJ('4527408.obj'));
    _pLoader.push(new OBJ('4527411.obj'));
    _pLoader.push(new OBJ('4527503.obj'));      
    _pLoader.push(new OBJ('4541085.obj'));
    _pLoader.push(new OBJ('4551467.obj'));
    _pLoader.push(new OBJ('4551481.obj'));
    _pLoader.push(new OBJ('4551501.obj'));
    _pLoader.push(new OBJ('4551528.obj'));
    _pLoader.push(new OBJ('4569384.obj'));
    _pLoader.push(new OBJ('4569588.obj'));      // 140
        
    _pLoader.push(new OBJ('4569749.obj'));
    _pLoader.push(new OBJ('4582442.obj'));
    _pLoader.push(new OBJ('4582443.obj'));      
    _pLoader.push(new OBJ('4593307.obj'));
    _pLoader.push(new OBJ('4593309.obj'));
    _pLoader.push(new OBJ('4593310.obj'));
    _pLoader.push(new OBJ('4593321.obj'));
    _pLoader.push(new OBJ('4593359.obj'));
    _pLoader.push(new OBJ('4593362.obj'));
    _pLoader.push(new OBJ('4593364.obj'));      // 150
        
    _pLoader.push(new OBJ('4593365.obj'));
    _pLoader.push(new OBJ('4593368.obj'));
    _pLoader.push(new OBJ('4593369.obj'));      
    _pLoader.push(new OBJ('4593371.obj'));
    _pLoader.push(new OBJ('4593372.obj'));
    _pLoader.push(new OBJ('4593374.obj'));
    _pLoader.push(new OBJ('4593377.obj'));
    _pLoader.push(new OBJ('4593381.obj'));
    _pLoader.push(new OBJ('4593479.obj'));
    _pLoader.push(new OBJ('4593503.obj'));      // 160
        
    _pLoader.push(new OBJ('4612783.obj'));
    _pLoader.push(new OBJ('4612790.obj'));
    _pLoader.push(new OBJ('4612792.obj'));      
    _pLoader.push(new OBJ('4612994.obj'));
    _pLoader.push(new OBJ('4612998.obj'));
    _pLoader.push(new OBJ('4613003.obj'));
    _pLoader.push(new OBJ('4623267.obj'));
    _pLoader.push(new OBJ('4623270.obj'));
    _pLoader.push(new OBJ('4623294.obj'));
    _pLoader.push(new OBJ('4623298.obj'));      // 170
        
    _pLoader.push(new OBJ('4623306.obj'));
    _pLoader.push(new OBJ('4623317.obj'));
    _pLoader.push(new OBJ('4623323.obj'));      
    _pLoader.push(new OBJ('4623470.obj'));
    _pLoader.push(new OBJ('4623473.obj'));
    _pLoader.push(new OBJ('4623508.obj'));
    _pLoader.push(new OBJ('4623510.obj'));
    _pLoader.push(new OBJ('4623511.obj'));
    _pLoader.push(new OBJ('4623513.obj'));
    _pLoader.push(new OBJ('4623522.obj'));      // 180
        
    _pLoader.push(new OBJ('4623527.obj'));
    _pLoader.push(new OBJ('4642782.obj'));
    _pLoader.push(new OBJ('4656248.obj'));      
    _pLoader.push(new OBJ('4666431.obj'));
    _pLoader.push(new OBJ('4666432.obj'));
    _pLoader.push(new OBJ('4666457.obj'));
    _pLoader.push(new OBJ('4666470.obj'));
    _pLoader.push(new OBJ('4666491.obj'));
    _pLoader.push(new OBJ('4666492.obj'));
    _pLoader.push(new OBJ('4666495.obj'));      // 190
        
    _pLoader.push(new OBJ('4666501.obj'));
    _pLoader.push(new OBJ('4666503.obj'));
    _pLoader.push(new OBJ('4666572.obj'));      
    _pLoader.push(new OBJ('4666588.obj'));
    _pLoader.push(new OBJ('4666589.obj'));
    _pLoader.push(new OBJ('4666647.obj'));
    _pLoader.push(new OBJ('4666649.obj'));
    _pLoader.push(new OBJ('4666662.obj'));
    _pLoader.push(new OBJ('4666676.obj'));
    _pLoader.push(new OBJ('4666677.obj'));      // 200
        
    _pLoader.push(new OBJ('4666681.obj'));
    _pLoader.push(new OBJ('4666702.obj'));
    _pLoader.push(new OBJ('4666703.obj'));      
    _pLoader.push(new OBJ('4666711.obj'));
    _pLoader.push(new OBJ('4666739.obj'));
    _pLoader.push(new OBJ('4666740.obj'));
    _pLoader.push(new OBJ('4666797.obj'));
    _pLoader.push(new OBJ('4666859.obj'));
    _pLoader.push(new OBJ('4666883.obj'));
    _pLoader.push(new OBJ('4666895.obj'));      // 210
    
    _pLoader.push(new OBJ('4700116.obj'));      
    _pLoader.push(new OBJ('11841644.obj'));      
    _pLoader.push(new OBJ('11009905.obj'));      // 212
*/    
    for(var modelNumber = 0 ; modelNumber < _pLoader.length ; modelNumber++)
    {
        loadObj("Models/", _pLoader[modelNumber]);
    }    
};