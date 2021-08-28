var SHADER_TYPE = 
        {
            NORMAL_SHADING : 0,
            HATCHING_SHADING : 1,
            CARTOON_SHADING : 2,
            SEMANTIC_LOD_EXAMPLE : 3,
            COMBINE_HATCHING_CARTOON : 4
        };

function radioCheck()
{
    for(var shaderCheck = 0 ; shaderCheck < document.all.NPRcheck.length ; shaderCheck ++)
    {
        if(document.all.NPRcheck[shaderCheck].checked === true)
        {
            switch(shaderCheck)
            {
                case SHADER_TYPE.NORMAL_SHADING:
                    for(var i = 0 ; i < gModel.length ; i ++)
                    {
                        gModel[i].mSurface  = Surface.SURFACE_PHOTOREALISTIC;
                    }
                    
                    break;
                
                case SHADER_TYPE.HATCHING_SHADING:
                    for(var i = 0 ; i < gModel.length ; i ++)
                    {
                        gModel[i].mSurface  = Surface.SURFACE_HATCHING;
                    }

                    break;
                    
                case SHADER_TYPE.CARTOON_SHADING:
                    for(var i = 0 ; i < gModel.length ; i ++)
                    {
                        gModel[i].mSurface  = Surface.SURFACE_CARTOON;
                    }
                    break;
                    
                case SHADER_TYPE.SEMANTIC_LOD_EXAMPLE:
                    for(var i = 0 ; i < gModel.length ; i ++)
                        gModel[i].mSurface = Surface.SURFACE_CARTOON;
                
                    for(var i = 0 ; i < gModel.length ; i += 5)
                        gModel[i].mSurface = Surface.SURFACE_HATCHING;
              
                    gModel[6].mSurface = Surface.SURFACE_PHOTOREALISTIC;
                    gModel[8].mSurface = Surface.SURFACE_PHOTOREALISTIC;
                    break;
                    
                case SHADER_TYPE.COMBINE_HATCHING_CARTOON:
                    for(var i = 0 ; i < gModel.length ; i ++)
                    {
                        gModel[i].mSurface  = Surface.SURFACE_HATCH_CARTOON;
                    }
                    break;
            }
        }
    }

};