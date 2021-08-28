precision mediump float;

uniform float uFrameWidth;
uniform float uFrameHeight;

uniform float uDepthDiscontinuous;
uniform float uNormalDiscontinuous;

uniform sampler2D uNPRDepthTexture;
uniform sampler2D uNPRNormalTexture;

uniform float uPointLightIntensity;
uniform vec3  uPointLightPosition;

float texel1X = 1.0 / uFrameWidth;
float texel1Y = 1.0 / uFrameHeight;
float texel2X = 2.0 / uFrameWidth;
float texel2Y = 2.0 / uFrameHeight;

varying vec2 v_TexCoord;

void detectSilhouette( in float _depth, in vec4 _contiguousDepth, out bool _detected );
void detectSilhouette( in vec4 _normal, in vec4 _normal1, in vec4 _normal2, in vec4 _normal3, in vec4 _normal4, out bool _detected );

void detectDepthSilhouette();
void detectNormalSilhouette();

void detectSobelSilhouette();

float lum(vec4 c) 
{
    return dot(c.xyz, vec3(1.0, 1.0, 1.0));//0.3, 0.59, 0.11));
}

void main()
{
    detectSobelSilhouette();
    //detectDepthSilhouette();
    ////detectNormalSilhouette();
}


void detectSobelSilhouette()// int float _depth, in mat3 _sobelMask, out bool _detected )
{
    vec2    vIncrement   = vec2( 1.0 / uFrameWidth, 1.0 / uFrameHeight );

    float a00 = lum(texture2D(uNPRDepthTexture, v_TexCoord + vIncrement * vec2(-1, -1)));
    float a10 = lum(texture2D(uNPRDepthTexture, v_TexCoord + vIncrement * vec2( 0, -1)));
    float a20 = lum(texture2D(uNPRDepthTexture, v_TexCoord + vIncrement * vec2( 1, -1)));

    float a01 = lum(texture2D(uNPRDepthTexture, v_TexCoord + vIncrement * vec2(-1,  0)));

    float a21 = lum(texture2D(uNPRDepthTexture, v_TexCoord + vIncrement * vec2( 1,  0)));

    float a02 = lum(texture2D(uNPRDepthTexture, v_TexCoord + vIncrement * vec2(-1,  1)));
    float a12 = lum(texture2D(uNPRDepthTexture, v_TexCoord + vIncrement * vec2( 0,  1)));
    float a22 = lum(texture2D(uNPRDepthTexture, v_TexCoord + vIncrement * vec2( 1,  1)));

    vec2 grad;

    grad.x = a00 + 2.0 * a01 + a02 - a20 - 2.0 * a21 - a22; 
    grad.y = a00 + 2.0 * a10 + a20 - a02 - 2.0 * a12 - a22; 

    float len = length(grad);

//    if( len < 0.8)
//        len = len * 0.3;
//    else    
//        len = len * 2.;

    if (len < 0.0)
        len = 0.0;
    
    else if ( len > 1.0)
        len = 1.0;
        
    gl_FragColor = vec4(1.0 - len, 1.0 - len, 1.0 - len, len);
}


void detectSilhouette( in float _depth, in vec4 _contiguousDepth, out bool _detected )
{
    vec4  difference = vec4(
        abs( _depth - _contiguousDepth.x ),
        abs( _depth - _contiguousDepth.y ),
        abs( _depth - _contiguousDepth.z ),
        abs( _depth - _contiguousDepth.w ) );

        if(difference.x > uDepthDiscontinuous ||
            difference.y > uDepthDiscontinuous ||
            difference.z > uDepthDiscontinuous ||
            difference.w > uDepthDiscontinuous)
            _detected = true;
}


void detectSilhouette( in vec4 _normal, in vec4 _normal1, in vec4 _normal2, in vec4 _normal3, in vec4 _normal4, out bool _detected )
{
    vec4 difference = vec4(
        dot( _normal, _normal1 ),
        dot( _normal, _normal2 ),
        dot( _normal, _normal3 ),
        dot( _normal, _normal4 ) );


    if(difference.x < uNormalDiscontinuous ||
        difference.y < uNormalDiscontinuous ||
        difference.z < uNormalDiscontinuous ||
        difference.w < uNormalDiscontinuous)
            _detected = true;
}


void detectDepthSilhouette()
{
    bool silhouette_detected = false;

    float NPRDepth = texture2D( uNPRDepthTexture, v_TexCoord.xy ).x;
    
    vec4 contiguousNPRDepth = vec4(
        texture2D( uNPRDepthTexture, vec2( v_TexCoord.x + texel1X, v_TexCoord.y + texel1Y ) ).x,
        texture2D( uNPRDepthTexture, vec2( v_TexCoord.x - texel1X, v_TexCoord.y + texel1Y ) ).x,
        texture2D( uNPRDepthTexture, vec2( v_TexCoord.x - texel1X, v_TexCoord.y - texel1Y ) ).x,
        texture2D( uNPRDepthTexture, vec2( v_TexCoord.x + texel1X, v_TexCoord.y - texel1Y ) ).x );
        
    detectSilhouette( NPRDepth, contiguousNPRDepth, silhouette_detected );

    if ( silhouette_detected == true )
    {
        gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
    }
    


    contiguousNPRDepth = vec4(
        texture2D( uNPRDepthTexture, vec2( v_TexCoord.x + texel2X, v_TexCoord.y + texel2Y ) ).x,
        texture2D( uNPRDepthTexture, vec2( v_TexCoord.x - texel2X, v_TexCoord.y + texel2Y ) ).x,
        texture2D( uNPRDepthTexture, vec2( v_TexCoord.x - texel2X, v_TexCoord.y - texel2Y ) ).x,
        texture2D( uNPRDepthTexture, vec2( v_TexCoord.x + texel2X, v_TexCoord.y - texel2Y ) ).x );

    detectSilhouette( NPRDepth, contiguousNPRDepth, silhouette_detected );
        
    if ( silhouette_detected == true )
    {
        gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
    }
/*
    if(texture2D( uNPRDepthTexture, v_TexCoord).rgb == vec3(1.0, 0.0, 0.0) )
    {
        if ( silhouette_detected == true )
            gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
    }
*/
}

void detectNormalSilhouette()
{
    bool silhouette_detected = false;

    vec4 NPRNormal  = texture2D( uNPRNormalTexture, v_TexCoord.xy );
    vec4 NPRNormal1 = texture2D( uNPRNormalTexture, vec2( v_TexCoord.x + texel1X, v_TexCoord.y + texel1Y ) );
    vec4 NPRNormal2 = texture2D( uNPRNormalTexture, vec2( v_TexCoord.x - texel1X, v_TexCoord.y + texel1Y ) );
    vec4 NPRNormal3 = texture2D( uNPRNormalTexture, vec2( v_TexCoord.x - texel1X, v_TexCoord.y - texel1Y ) );
    vec4 NPRNormal4 = texture2D( uNPRNormalTexture, vec2( v_TexCoord.x + texel1X, v_TexCoord.y - texel1Y ) );

    detectSilhouette( NPRNormal, NPRNormal1, NPRNormal2, NPRNormal3, NPRNormal4, silhouette_detected );
    if ( silhouette_detected == true )
    {
        gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
        //discard;
    }

    NPRNormal1 = texture2D( uNPRNormalTexture, vec2( v_TexCoord.x + texel2X, v_TexCoord.y + texel2Y ) );
    NPRNormal2 = texture2D( uNPRNormalTexture, vec2( v_TexCoord.x - texel2X, v_TexCoord.y + texel2Y ) );
    NPRNormal3 = texture2D( uNPRNormalTexture, vec2( v_TexCoord.x - texel2X, v_TexCoord.y - texel2Y ) );
    NPRNormal4 = texture2D( uNPRNormalTexture, vec2( v_TexCoord.x + texel2X, v_TexCoord.y - texel2Y ) );

    detectSilhouette( NPRNormal, NPRNormal1, NPRNormal2, NPRNormal3, NPRNormal4, silhouette_detected );
    if ( silhouette_detected == true )
    {
        gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
        //discard;
    }
}